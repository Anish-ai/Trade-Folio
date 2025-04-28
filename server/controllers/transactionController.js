const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all transactions for a user
exports.getUserTransactions = async (req, res) => {
  const userId = req.params.userId || req.user.userId;
  const { page = 1, limit = 20, type } = req.query;
  
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  try {
    // Build filter
    const where = { userId };
    if (type) {
      where.type = type.toUpperCase();
    }
    
    // Get transactions
    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: parseInt(limit),
      include: {
        stock: true
      }
    });
    
    // Get total count
    const total = await prisma.transaction.count({ where });
    
    return res.status(200).json({
      transactions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

// Get transaction by ID
exports.getTransaction = async (req, res) => {
  const { id } = req.params;
  
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        stock: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    });
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    // Check if user has access to this transaction
    const userId = req.user.userId;
    if (transaction.userId !== userId && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    return res.status(200).json(transaction);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return res.status(500).json({ error: 'Failed to fetch transaction' });
  }
};

// Create a buy transaction
exports.buyStock = async (req, res) => {
  const userId = req.params.userId || req.user.userId;
  const { stockId, quantity, price } = req.body;
  
  if (!stockId || !quantity || !price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // Get user
      const user = await tx.user.findUnique({
        where: { id: userId },
        include: { portfolio: true }
      });
      
      if (!user) {
        throw new Error('User not found');
      }
      
      // Check if user has enough balance
      const totalAmount = price * quantity;
      if (user.balance < totalAmount) {
        throw new Error('Insufficient balance');
      }
      
      // Get stock
      const stock = await tx.stock.findUnique({
        where: { id: stockId }
      });
      
      if (!stock) {
        throw new Error('Stock not found');
      }
      
      // Create or update portfolio if it doesn't exist
      let portfolioId = user.portfolio?.id;
      
      if (!portfolioId) {
        const newPortfolio = await tx.portfolio.create({
          data: { userId }
        });
        portfolioId = newPortfolio.id;
      }
      
      // Check if user already has this stock
      const existingHolding = await tx.stockHolding.findFirst({
        where: {
          portfolioId,
          stockId
        }
      });
      
      // Update or create holding
      if (existingHolding) {
        // Calculate new average price
        const newTotalValue = existingHolding.avgPrice * existingHolding.quantity + price * quantity;
        const newTotalQuantity = existingHolding.quantity + quantity;
        const newAvgPrice = newTotalValue / newTotalQuantity;
        
        await tx.stockHolding.update({
          where: { id: existingHolding.id },
          data: {
            quantity: newTotalQuantity,
            avgPrice: newAvgPrice
          }
        });
      } else {
        await tx.stockHolding.create({
          data: {
            portfolioId,
            stockId,
            quantity,
            avgPrice: price
          }
        });
      }
      
      // Update user balance
      const newBalance = user.balance - totalAmount;
      await tx.user.update({
        where: { id: userId },
        data: { balance: newBalance }
      });
      
      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          userId,
          stockId,
          type: 'BUY',
          quantity,
          price,
          totalAmount,
          balanceBefore: user.balance,
          balanceAfter: newBalance,
          metadata: {
            currentMarketPrice: stock.currentPrice,
            timestamp: new Date()
          }
        },
        include: {
          stock: true
        }
      });
      
      // Create user activity
      await tx.userActivity.create({
        data: {
          userId,
          action: 'TRADE',
          metadata: {
            action: 'BUY',
            symbol: stock.symbol,
            quantity,
            price,
            totalAmount
          }
        }
      });
      
      // Update portfolio snapshot
      const holdings = await tx.stockHolding.findMany({
        where: { portfolioId },
        include: { stock: true }
      });
      
      const portfolioValue = holdings.reduce((total, holding) => {
        return total + (holding.quantity * holding.stock.currentPrice);
      }, 0);
      
      await tx.portfolioSnapshot.create({
        data: {
          portfolioId,
          totalValue: portfolioValue
        }
      });
      
      return transaction;
    });
    
    return res.status(201).json(result);
  } catch (error) {
    console.error('Error buying stock:', error);
    const message = error instanceof Error ? error.message : 'Failed to buy stock';
    return res.status(400).json({ error: message });
  }
};

// Create a sell transaction
exports.sellStock = async (req, res) => {
  const userId = req.params.userId || req.user.userId;
  const { stockId, quantity, price } = req.body;
  
  if (!stockId || !quantity || !price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // Get user with portfolio
      const user = await tx.user.findUnique({
        where: { id: userId },
        include: { portfolio: true }
      });
      
      if (!user || !user.portfolio) {
        throw new Error('User or portfolio not found');
      }
      
      // Get stock
      const stock = await tx.stock.findUnique({
        where: { id: stockId }
      });
      
      if (!stock) {
        throw new Error('Stock not found');
      }
      
      // Check if user has this stock
      const holding = await tx.stockHolding.findFirst({
        where: {
          portfolioId: user.portfolio.id,
          stockId
        }
      });
      
      if (!holding) {
        throw new Error('You do not own this stock');
      }
      
      // Check if user has enough quantity
      if (holding.quantity < quantity) {
        throw new Error('Insufficient shares to sell');
      }
      
      // Calculate total amount
      const totalAmount = price * quantity;
      
      // Update holding
      if (holding.quantity === quantity) {
        // Remove holding if selling all
        await tx.stockHolding.delete({
          where: { id: holding.id }
        });
      } else {
        // Update holding if selling part
        await tx.stockHolding.update({
          where: { id: holding.id },
          data: {
            quantity: holding.quantity - quantity
          }
        });
      }
      
      // Update user balance
      const newBalance = user.balance + totalAmount;
      await tx.user.update({
        where: { id: userId },
        data: { balance: newBalance }
      });
      
      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          userId,
          stockId,
          type: 'SELL',
          quantity,
          price,
          totalAmount,
          balanceBefore: user.balance,
          balanceAfter: newBalance,
          metadata: {
            currentMarketPrice: stock.currentPrice,
            timestamp: new Date(),
            profitLoss: (price - holding.avgPrice) * quantity
          }
        },
        include: {
          stock: true
        }
      });
      
      // Create user activity
      await tx.userActivity.create({
        data: {
          userId,
          action: 'TRADE',
          metadata: {
            action: 'SELL',
            symbol: stock.symbol,
            quantity,
            price,
            totalAmount,
            profitLoss: (price - holding.avgPrice) * quantity
          }
        }
      });
      
      // Update portfolio snapshot
      const holdings = await tx.stockHolding.findMany({
        where: { portfolioId: user.portfolio.id },
        include: { stock: true }
      });
      
      const portfolioValue = holdings.reduce((total, h) => {
        return total + (h.quantity * h.stock.currentPrice);
      }, 0);
      
      await tx.portfolioSnapshot.create({
        data: {
          portfolioId: user.portfolio.id,
          totalValue: portfolioValue
        }
      });
      
      return transaction;
    });
    
    return res.status(201).json(result);
  } catch (error) {
    console.error('Error selling stock:', error);
    const message = error instanceof Error ? error.message : 'Failed to sell stock';
    return res.status(400).json({ error: message });
  }
};

// Get transaction statistics
exports.getTransactionStats = async (req, res) => {
  const userId = req.params.userId || req.user.userId;
  
  try {
    // Get buy transactions
    const buyTransactions = await prisma.transaction.findMany({
      where: {
        userId,
        type: 'BUY'
      },
      include: {
        stock: true
      }
    });
    
    // Get sell transactions
    const sellTransactions = await prisma.transaction.findMany({
      where: {
        userId,
        type: 'SELL'
      },
      include: {
        stock: true
      }
    });
    
    // Calculate total invested
    const totalInvested = buyTransactions.reduce((sum, tx) => sum + tx.totalAmount, 0);
    
    // Calculate total sold
    const totalSold = sellTransactions.reduce((sum, tx) => sum + tx.totalAmount, 0);
    
    // Calculate realized profit/loss
    const realizedProfitLoss = sellTransactions.reduce((sum, tx) => {
      const profitLoss = tx.metadata?.profitLoss || 0;
      return sum + profitLoss;
    }, 0);
    
    // Get user's current portfolio
    const portfolio = await prisma.portfolio.findUnique({
      where: { userId },
      include: {
        holdings: {
          include: {
            stock: true
          }
        }
      }
    });
    
    // Calculate unrealized profit/loss
    let unrealizedProfitLoss = 0;
    let currentPortfolioValue = 0;
    
    if (portfolio) {
      currentPortfolioValue = portfolio.holdings.reduce((sum, holding) => {
        return sum + (holding.quantity * holding.stock.currentPrice);
      }, 0);
      
      const totalCostBasis = portfolio.holdings.reduce((sum, holding) => {
        return sum + (holding.quantity * holding.avgPrice);
      }, 0);
      
      unrealizedProfitLoss = currentPortfolioValue - totalCostBasis;
    }
    
    // Calculate total profit/loss
    const totalProfitLoss = realizedProfitLoss + unrealizedProfitLoss;
    
    // Calculate ROI
    const totalInvestedIncludingCurrent = totalInvested - totalSold + currentPortfolioValue;
    const roi = totalInvestedIncludingCurrent > 0 
      ? (totalProfitLoss / totalInvestedIncludingCurrent) * 100 
      : 0;
    
    return res.status(200).json({
      userId,
      transactionCount: buyTransactions.length + sellTransactions.length,
      buyCount: buyTransactions.length,
      sellCount: sellTransactions.length,
      totalInvested,
      totalSold,
      realizedProfitLoss,
      unrealizedProfitLoss,
      totalProfitLoss,
      currentPortfolioValue,
      roi
    });
  } catch (error) {
    console.error('Error fetching transaction stats:', error);
    return res.status(500).json({ error: 'Failed to fetch transaction statistics' });
  }
}; 