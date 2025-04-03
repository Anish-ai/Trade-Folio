const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  transactionOptions: {
    maxWait: 10000,  // 10 seconds
    timeout: 30000   // 30 seconds
  }
});

const handleTransactionError = (res, error, action) => {
  const errorMap = {
    P2002: { status: 409, message: 'Conflict: Duplicate transaction' },
    P2028: { status: 504, message: 'Transaction timeout' },
    P2034: { status: 500, message: 'Transaction commit failed' }
  };

  const { status = 500, message = 'Transaction failed' } = errorMap[error.code] || {};
  
  console.error(`Transaction Error (${action}):`, error);
  res.status(status).json({
    success: false,
    message: `${message}: ${error.message}`,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

const executeWithRetry = async (fn, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.code === 'P2028' && i < retries - 1) {
        console.log(`Retry attempt ${i + 1}`);
        await new Promise(resolve => setTimeout(resolve, 100 * (i + 1)));
        continue;
      }
      throw error;
    }
  }
};

// Helper function to update portfolio holdings
const updatePortfolioHoldings = async (tx, portfolioId, stockId, quantity, price, type) => {
    const holding = await tx.stockHolding.findFirst({
      where: {
        portfolioId: portfolioId,
        stockId: stockId
      }
    });

  if (type === 'BUY') {
    if (holding) {
      // Update existing holding
      const newQuantity = holding.quantity + quantity;
      const newAvgPrice = ((holding.avgPrice * holding.quantity) + (price * quantity)) / newQuantity;
      
      await tx.stockHolding.update({
        where: {
          id: holding.id
        },
        data: {
          quantity: newQuantity,
          avgPrice: newAvgPrice
        }
      });
    } else {
      // Create new holding
      await tx.stockHolding.create({
        data: {
          portfolioId,
          stockId,
          quantity,
          avgPrice: price
        }
      });
    }
  } else if (type === 'SELL') {
    if (!holding) {
      throw new Error('Cannot sell stock that is not in portfolio');
    }
    
    if (holding.quantity < quantity) {
      throw new Error('Insufficient stock quantity');
    }
    
    const newQuantity = holding.quantity - quantity;
    
    if (newQuantity === 0) {
      // Remove holding completely
      await tx.stockHolding.delete({
        where: {
          id: holding.id
        }
      });
    } else {
      // Update holding quantity (avg price doesn't change on sell)
      await tx.stockHolding.update({
        where: {
          id: holding.id
        },
        data: {
          quantity: newQuantity
        }
      });
    }
  }
};

// Helper function to ensure user has a portfolio
const ensureUserHasPortfolio = async (tx, userId) => {
  let portfolio = await tx.portfolio.findUnique({
    where: { userId }
  });
  
  if (!portfolio) {
    // Create a new portfolio for the user
    portfolio = await tx.portfolio.create({
      data: {
        userId
      }
    });
    console.log(`Created new portfolio for user ${userId}`);
  }
  
  return portfolio;
};

const createTransaction = async (req, res) => {
  try {
    const result = await executeWithRetry(() => 
      prisma.$transaction(async (tx) => {
        const { userId, stockId, type, quantity, price } = req.body;
        
        if (!['BUY', 'SELL'].includes(type)) {
          throw new Error('Invalid transaction type. Must be BUY or SELL');
        }
        
        const user = await tx.user.findUnique({
          where: { id: userId }
        });

        if (!user) throw new Error('User not found');
        
        // Ensure user has a portfolio (create one if not exists)
        const portfolio = await ensureUserHasPortfolio(tx, userId);

        // Verify the stock exists
        const stock = await tx.stock.findUnique({
          where: { id: stockId }
        });
        
        if (!stock) {
          throw new Error('Stock not found');
        }

        const totalAmount = quantity * price;
        let newBalance = user.balance;

        if (type === 'BUY') {
          newBalance -= totalAmount;
          if (newBalance < 0) throw new Error('Insufficient funds');
        } else {
          // SELL
          newBalance += totalAmount;
        }

        await tx.user.update({
          where: { id: userId },
          data: { balance: newBalance }
        });

        const transaction = await tx.transaction.create({
          data: {
            userId,
            stockId,
            type,
            quantity,
            price,
            totalAmount,
            balanceBefore: user.balance,
            balanceAfter: newBalance,
            status: 'COMPLETED'
          }
        });

        await updatePortfolioHoldings(
          tx,
          portfolio.id,
          stockId,
          quantity,
          price,
          type
        );

        return transaction;
      }, {
        isolationLevel: 'Serializable',
        maxWait: 10000,
        timeout: 30000
      })
    );

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    handleTransactionError(res, error, 'create');
  }
};

const getTransactionsByUser = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, stockId } = req.query;
    const userId = req.params.userId;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    const where = { userId };
    
    if (type) where.type = type;
    if (stockId) where.stockId = stockId;

    const [transactions, total] = await prisma.$transaction([
      prisma.transaction.findMany({
        where,
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: {
          stock: { select: { symbol: true, name: true } },
          user: { select: { username: true } }
        }
      }),
      prisma.transaction.count({ where })
    ]);

    res.json({
      success: true,
      data: transactions,
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    handleTransactionError(res, error, 'fetch');
  }
};

const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        stock: { 
          select: { 
            id: true,
            symbol: true, 
            name: true, 
            currentPrice: true 
          } 
        },
        user: { 
          select: { 
            id: true,
            username: true 
          } 
        }
      }
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    handleTransactionError(res, error, 'fetch');
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      type, 
      stockId, 
      userId,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    const where = {};
    
    if (type) where.type = type;
    if (stockId) where.stockId = stockId;
    if (userId) where.userId = userId;
    
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const orderBy = {};
    orderBy[sortBy] = sortOrder;

    const [transactions, total] = await prisma.$transaction([
      prisma.transaction.findMany({
        where,
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        orderBy,
        include: {
          stock: { select: { symbol: true, name: true } },
          user: { select: { username: true } }
        }
      }),
      prisma.transaction.count({ where })
    ]);

    res.json({
      success: true,
      data: transactions,
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    handleTransactionError(res, error, 'fetch');
  }
};

const cancelTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await executeWithRetry(() => 
      prisma.$transaction(async (tx) => {
        // Find the transaction
        const transaction = await tx.transaction.findUnique({
          where: { id },
          include: {
            user: true,
            stock: true
          }
        });

        if (!transaction) {
          throw { status: 404, message: 'Transaction not found' };
        }

        // Check if transaction can be canceled (e.g., only recent transactions)
        const hoursSinceCreation = (Date.now() - transaction.createdAt.getTime()) / (1000 * 60 * 60);
        if (hoursSinceCreation > 24) {
          throw { status: 400, message: 'Transaction cannot be canceled after 24 hours' };
        }

        if (transaction.status === 'CANCELED') {
          throw { status: 400, message: 'Transaction already canceled' };
        }

        // Reverse the financial impact
        let newBalance = transaction.user.balance;
        
        if (transaction.type === 'BUY') {
          newBalance += transaction.totalAmount;
        } else {
          // SELL
          newBalance -= transaction.totalAmount;
          if (newBalance < 0) throw new Error('Insufficient funds to cancel transaction');
        }

        // Update user balance
        await tx.user.update({
          where: { id: transaction.userId },
          data: { balance: newBalance }
        });

        // Get the user's portfolio
        const portfolio = await tx.portfolio.findUnique({
          where: { userId: transaction.userId }
        });

        if (!portfolio) {
          throw new Error('User has no portfolio');
        }

        if (transaction.type === 'BUY') {
          // Reverse a buy = sell
          await updatePortfolioHoldings(
            tx,
            portfolio.id,
            transaction.stockId,
            transaction.quantity,
            transaction.price,
            'SELL'
          );
        } else {
          // Reverse a sell = buy
          await updatePortfolioHoldings(
            tx,
            portfolio.id,
            transaction.stockId,
            transaction.quantity,
            transaction.price,
            'BUY'
          );
        }

        // Update transaction status
        const updatedTransaction = await tx.transaction.update({
          where: { id },
          data: {
            status: 'CANCELED',
            metadata: {
              ...(transaction.metadata || {}),
              canceledAt: new Date(),
              cancelReason: req.body.reason || 'User requested'
            }
          }
        });

        return updatedTransaction;
      }, {
        isolationLevel: 'Serializable',
        maxWait: 10000,
        timeout: 30000
      })
    );

    res.json({ success: true, data: result });
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({
        success: false,
        message: error.message
      });
    } else {
      handleTransactionError(res, error, 'cancel');
    }
  }
};

module.exports = {
  createTransaction,
  getTransactionsByUser,
  getTransactionById,
  getAllTransactions,
  cancelTransaction
};