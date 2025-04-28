// server/controllers/marketplaceController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get market events
exports.getMarketEvents = async (req, res) => {
  try {
    const { impact, limit = 10 } = req.query;
    
    // Build filter conditions
    const where = {};
    if (impact) {
      where.impact = impact;
    }
    
    const events = await prisma.marketEvent.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: Number(limit)
    });
    
    return res.status(200).json(events);
  } catch (error) {
    console.error('Error getting market events:', error);
    return res.status(500).json({ error: 'Failed to fetch market events' });
  }
};

// Buy stock
exports.buyStock = async (req, res) => {
  const { userId, stockId, quantity, price } = req.body;
  
  if (!userId || !stockId || !quantity || !price) {
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

// Sell stock
exports.sellStock = async (req, res) => {
  const { userId, stockId, quantity, price } = req.body;
  
  if (!userId || !stockId || !quantity || !price) {
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
            profitLoss: (price - holding.avgPrice) * quantity,
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
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error selling stock:', error);
    const message = error instanceof Error ? error.message : 'Failed to sell stock';
    return res.status(400).json({ error: message });
  }
};

// Get market trends
exports.getMarketTrends = async (req, res) => {
  try {
    // Get top gainers (stocks with highest positive change)
    const topGainers = await prisma.stock.findMany({
      where: {
        change: { gt: 0 }
      },
      orderBy: {
        change: 'desc'
      },
      take: 5
    });
    
    // Get top losers (stocks with most negative change)
    const topLosers = await prisma.stock.findMany({
      where: {
        change: { lt: 0 }
      },
      orderBy: {
        change: 'asc'
      },
      take: 5
    });
    
    // Get most active (stocks with highest volume)
    const mostActive = await prisma.stock.findMany({
      where: {
        volume: { not: null }
      },
      orderBy: {
        volume: 'desc'
      },
      take: 5
    });
    
    return res.status(200).json({
      topGainers,
      topLosers,
      mostActive
    });
  } catch (error) {
    console.error('Error getting market trends:', error);
    return res.status(500).json({ error: 'Failed to fetch market trends' });
  }
};

// Get sectors (for marketplace filters/exploration)
exports.getSectors = async (req, res) => {
  try {
    const sectors = await prisma.stock.groupBy({
      by: ['sector'],
      where: {
        sector: { not: null }
      }
    });
    
    return res.status(200).json(sectors.map(s => s.sector));
  } catch (error) {
    console.error('Error getting sectors:', error);
    return res.status(500).json({ error: 'Failed to fetch sectors' });
  }
};