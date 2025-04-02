const { PrismaClient } = require('@prisma/client');
//explain what is zod
// Zod is a TypeScript-first schema declaration and validation library. It allows you to define schemas for your data structures and validate them at runtime. Zod is particularly useful for validating user input, API responses, and other data that may not conform to your expected types. It provides a fluent API for defining complex validation rules and can be integrated with TypeScript for type inference.
const { z } = require('zod');

const prisma = new PrismaClient();

// Portfolio validation schemas
const createPortfolioSchema = z.object({
  userId: z.string().uuid(),
});

const addHoldingSchema = z.object({
  stockId: z.string().uuid(),
  quantity: z.number().int().positive(),
  avgPrice: z.number().positive(),
});

const updateHoldingSchema = z.object({
  holdingId: z.string().uuid(),
  quantity: z.number().int().min(0),
  avgPrice: z.number().positive().optional(),
});

const portfolioController = {
  // Get user portfolio
  getUserPortfolio: async (req, res) => {
    try {
      const userId = req.params.userId;

      const portfolio = await prisma.portfolio.findUnique({
        where: { userId },
        include: {
          holdings: {
            include: {
              stock: true,
            },
          },
          snapshots: {
            orderBy: {
              timestamp: 'desc',
            },
            take: 10,
          },
        },
      });

      if (!portfolio) {
        return res.status(404).json({ message: 'Portfolio not found' });
      }

      // Calculate current portfolio value
      const totalValue = portfolio.holdings.reduce((sum, holding) => {
        return sum + (holding.quantity * holding.stock.currentPrice);
      }, 0);

      return res.status(200).json({
        portfolio,
        totalValue,
      });
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Create portfolio for user
  createPortfolio: async (req, res) => {
    try {
      const validation = createPortfolioSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ errors: validation.error.errors });
      }

      const { userId } = validation.data;

      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check if portfolio already exists
      const existingPortfolio = await prisma.portfolio.findUnique({
        where: { userId },
      });

      if (existingPortfolio) {
        return res.status(409).json({ message: 'Portfolio already exists for this user' });
      }

      // Create portfolio
      const portfolio = await prisma.portfolio.create({
        data: {
          userId,
        },
        include: {
          holdings: true,
        },
      });

      // Create initial portfolio snapshot with 0 value
      await prisma.portfolioSnapshot.create({
        data: {
          portfolioId: portfolio.id,
          totalValue: 0,
        },
      });

      return res.status(201).json(portfolio);
    } catch (error) {
      console.error('Error creating portfolio:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Add stock holding to portfolio
  addHolding: async (req, res) => {
    try {
      const portfolioId = req.params.portfolioId;
      const validation = addHoldingSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ errors: validation.error.errors });
      }

      const { stockId, quantity, avgPrice } = validation.data;

      // Check if portfolio exists
      const portfolio = await prisma.portfolio.findUnique({
        where: { id: portfolioId },
        include: {
          user: true,
        },
      });

      if (!portfolio) {
        return res.status(404).json({ message: 'Portfolio not found' });
      }

      // Check if stock exists
      const stock = await prisma.stock.findUnique({
        where: { id: stockId },
      });

      if (!stock) {
        return res.status(404).json({ message: 'Stock not found' });
      }

      // Check if holding already exists
      const existingHolding = await prisma.stockHolding.findFirst({
        where: {
          portfolioId,
          stockId,
        },
      });

      if (existingHolding) {
        return res.status(409).json({ 
          message: 'Holding already exists', 
          holdingId: existingHolding.id 
        });
      }

      // Create new holding
      const holding = await prisma.stockHolding.create({
        data: {
          portfolioId,
          stockId,
          quantity,
          avgPrice,
        },
        include: {
          stock: true,
        },
      });

      // Create transaction record
      const totalAmount = quantity * avgPrice;
      
      // Check if user has enough balance
      if (portfolio.user.balance < totalAmount) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }

      // Update user balance
      const balanceBefore = portfolio.user.balance;
      const balanceAfter = balanceBefore - totalAmount;
      
      await prisma.user.update({
        where: { id: portfolio.user.id },
        data: { balance: balanceAfter },
      });

      // Record transaction
      await prisma.transaction.create({
        data: {
          userId: portfolio.user.id,
          stockId,
          type: 'BUY',
          quantity,
          price: avgPrice,
          totalAmount,
          balanceBefore,
          balanceAfter,
          status: 'COMPLETED',
          metadata: {
            reason: 'Initial portfolio holding creation',
          },
        },
      });

      // Create updated portfolio snapshot
      const allHoldings = await prisma.stockHolding.findMany({
        where: { portfolioId },
        include: { stock: true },
      });

      const portfolioValue = allHoldings.reduce((sum, h) => {
        return sum + (h.quantity * h.stock.currentPrice);
      }, 0);

      await prisma.portfolioSnapshot.create({
        data: {
          portfolioId,
          totalValue: portfolioValue,
        },
      });

      return res.status(201).json(holding);
    } catch (error) {
      console.error('Error adding holding:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Update stock holding
  updateHolding: async (req, res) => {
    try {
      const validation = updateHoldingSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ errors: validation.error.errors });
      }

      const { holdingId, quantity, avgPrice } = validation.data;

      // Get existing holding
      const existingHolding = await prisma.stockHolding.findUnique({
        where: { id: holdingId },
        include: {
          portfolio: {
            include: { user: true }
          },
          stock: true,
        },
      });

      if (!existingHolding) {
        return res.status(404).json({ message: 'Holding not found' });
      }

      const updateData = {};
      
      if (quantity !== undefined) {
        updateData.quantity = quantity;
      }
      
      if (avgPrice !== undefined) {
        updateData.avgPrice = avgPrice;
      }

      // Calculate transaction details if quantity is changing
      if (quantity !== undefined && quantity !== existingHolding.quantity) {
        const diffQuantity = quantity - existingHolding.quantity;
        const transactionType = diffQuantity > 0 ? 'BUY' : 'SELL';
        const transactionQuantity = Math.abs(diffQuantity);
        const price = existingHolding.stock.currentPrice;
        const totalAmount = transactionQuantity * price;
        
        const user = existingHolding.portfolio.user;
        const balanceBefore = user.balance;
        
        // For BUY, check if user has enough balance
        if (transactionType === 'BUY' && balanceBefore < totalAmount) {
          return res.status(400).json({ message: 'Insufficient balance' });
        }
        
        // Update user balance
        const balanceAfter = transactionType === 'BUY' 
          ? balanceBefore - totalAmount 
          : balanceBefore + totalAmount;
        
        await prisma.user.update({
          where: { id: user.id },
          data: { balance: balanceAfter },
        });
        
        // Record transaction
        await prisma.transaction.create({
          data: {
            userId: user.id,
            stockId: existingHolding.stock.id,
            type: transactionType,
            quantity: transactionQuantity,
            price,
            totalAmount,
            balanceBefore,
            balanceAfter,
            status: 'COMPLETED',
          },
        });
      }

      // Update the holding
      const updatedHolding = await prisma.stockHolding.update({
        where: { id: holdingId },
        data: updateData,
        include: {
          stock: true,
        },
      });

      // Create updated portfolio snapshot
      const allHoldings = await prisma.stockHolding.findMany({
        where: { portfolioId: existingHolding.portfolioId },
        include: { stock: true },
      });

      const portfolioValue = allHoldings.reduce((sum, h) => {
        return sum + (h.quantity * h.stock.currentPrice);
      }, 0);

      await prisma.portfolioSnapshot.create({
        data: {
          portfolioId: existingHolding.portfolioId,
          totalValue: portfolioValue,
        },
      });

      return res.status(200).json(updatedHolding);
    } catch (error) {
      console.error('Error updating holding:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Delete stock holding
  deleteHolding: async (req, res) => {
    try {
      const holdingId = req.params.holdingId;

      // Get existing holding
      const existingHolding = await prisma.stockHolding.findUnique({
        where: { id: holdingId },
        include: {
          portfolio: {
            include: { user: true }
          },
          stock: true,
        },
      });

      if (!existingHolding) {
        return res.status(404).json({ message: 'Holding not found' });
      }

      // If quantity > 0, record as SELL transaction
      if (existingHolding.quantity > 0) {
        const user = existingHolding.portfolio.user;
        const price = existingHolding.stock.currentPrice;
        const totalAmount = existingHolding.quantity * price;
        
        const balanceBefore = user.balance;
        const balanceAfter = balanceBefore + totalAmount;
        
        // Update user balance
        await prisma.user.update({
          where: { id: user.id },
          data: { balance: balanceAfter },
        });
        
        // Record transaction
        await prisma.transaction.create({
          data: {
            userId: user.id,
            stockId: existingHolding.stock.id,
            type: 'SELL',
            quantity: existingHolding.quantity,
            price,
            totalAmount,
            balanceBefore,
            balanceAfter,
            status: 'COMPLETED',
            metadata: {
              reason: 'Holding removed from portfolio',
            },
          },
        });
      }

      // Delete the holding
      await prisma.stockHolding.delete({
        where: { id: holdingId },
      });

      // Create updated portfolio snapshot
      const allHoldings = await prisma.stockHolding.findMany({
        where: { portfolioId: existingHolding.portfolioId },
        include: { stock: true },
      });

      const portfolioValue = allHoldings.reduce((sum, h) => {
        return sum + (h.quantity * h.stock.currentPrice);
      }, 0);

      await prisma.portfolioSnapshot.create({
        data: {
          portfolioId: existingHolding.portfolioId,
          totalValue: portfolioValue,
        },
      });

      return res.status(200).json({ message: 'Holding successfully deleted' });
    } catch (error) {
      console.error('Error deleting holding:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Get portfolio history/snapshots
  getPortfolioHistory: async (req, res) => {
    try {
      const portfolioId = req.params.portfolioId;
      const days = parseInt(req.query.days) || 30;
      
      // Set date range for snapshots
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const snapshots = await prisma.portfolioSnapshot.findMany({
        where: {
          portfolioId,
          timestamp: {
            gte: startDate,
          },
        },
        orderBy: {
          timestamp: 'asc',
        },
      });

      if (snapshots.length === 0) {
        return res.status(404).json({ 
          message: 'No portfolio history found for the specified time period' 
        });
      }

      return res.status(200).json(snapshots);
    } catch (error) {
      console.error('Error fetching portfolio history:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Generate new portfolio snapshot
  createPortfolioSnapshot: async (req, res) => {
    try {
      const portfolioId = req.params.portfolioId;
      
      // Check if portfolio exists
      const portfolio = await prisma.portfolio.findUnique({
        where: { id: portfolioId },
        include: {
          holdings: {
            include: {
              stock: true,
            },
          },
        },
      });

      if (!portfolio) {
        return res.status(404).json({ message: 'Portfolio not found' });
      }

      // Calculate current portfolio value
      const totalValue = portfolio.holdings.reduce((sum, holding) => {
        return sum + (holding.quantity * holding.stock.currentPrice);
      }, 0);

      // Create new snapshot
      const snapshot = await prisma.portfolioSnapshot.create({
        data: {
          portfolioId,
          totalValue,
        },
      });

      return res.status(201).json(snapshot);
    } catch (error) {
      console.error('Error creating portfolio snapshot:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = { portfolioController };