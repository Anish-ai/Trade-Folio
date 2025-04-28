const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all stocks with pagination and filters
exports.getAllStocks = async (req, res) => {
  const { 
    page = 1, 
    limit = 20, 
    sector, 
    search, 
    sortBy = 'symbol', 
    sortOrder = 'asc',
    minPrice,
    maxPrice
  } = req.query;
  
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  try {
    // Build where clause for filtering
    const where = {};
    
    if (sector) {
      where.sector = sector;
    }
    
    if (search) {
      where.OR = [
        { symbol: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (minPrice) {
      where.currentPrice = {
        ...(where.currentPrice || {}),
        gte: parseFloat(minPrice)
      };
    }
    
    if (maxPrice) {
      where.currentPrice = {
        ...(where.currentPrice || {}),
        lte: parseFloat(maxPrice)
      };
    }
    
    // Get stocks with pagination
    const stocks = await prisma.stock.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder
      },
      skip,
      take: parseInt(limit)
    });
    
    // Get total count for pagination
    const total = await prisma.stock.count({ where });
    
    return res.status(200).json({
      stocks,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching stocks:', error);
    return res.status(500).json({ error: 'Failed to fetch stocks' });
  }
};

// Get stock by ID or symbol
exports.getStock = async (req, res) => {
  const { idOrSymbol } = req.params;
  
  try {
    // First try to find by ID
    let stock = await prisma.stock.findUnique({
      where: { id: idOrSymbol },
      include: {
        history: {
          orderBy: {
            timestamp: 'desc'
          },
          take: 30
        }
      }
    });
    
    // If not found by ID, try to find by symbol
    if (!stock) {
      stock = await prisma.stock.findUnique({
        where: { symbol: idOrSymbol.toUpperCase() },
        include: {
          history: {
            orderBy: {
              timestamp: 'desc'
            },
            take: 30
          }
        }
      });
    }
    
    if (!stock) {
      return res.status(404).json({ error: 'Stock not found' });
    }
    
    return res.status(200).json(stock);
  } catch (error) {
    console.error('Error fetching stock:', error);
    return res.status(500).json({ error: 'Failed to fetch stock' });
  }
};

// Get stock historical prices
exports.getStockHistory = async (req, res) => {
  const { idOrSymbol } = req.params;
  const { days = 30, interval = 'day' } = req.query;
  
  try {
    // First determine the stock
    let stock;
    
    // Try to find by ID
    if (idOrSymbol.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)) {
      stock = await prisma.stock.findUnique({
        where: { id: idOrSymbol }
      });
    } else {
      // Try to find by symbol
      stock = await prisma.stock.findUnique({
        where: { symbol: idOrSymbol.toUpperCase() }
      });
    }
    
    if (!stock) {
      return res.status(404).json({ error: 'Stock not found' });
    }
    
    // Calculate date range based on days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    // Get history based on interval
    let history;
    
    if (interval === 'hour') {
      // For hourly data, get all points and order by timestamp
      history = await prisma.stockHistory.findMany({
        where: {
          stockId: stock.id,
          timestamp: {
            gte: startDate,
            lte: endDate
          }
        },
        orderBy: {
          timestamp: 'asc'
        }
      });
    } else {
      // For daily data, use raw query to get daily average
      history = await prisma.$queryRaw`
        SELECT 
          DATE(timestamp) as date,
          AVG(price) as price,
          SUM(volume) as volume
        FROM "StockHistory"
        WHERE 
          "stockId" = ${stock.id}
          AND timestamp >= ${startDate}
          AND timestamp <= ${endDate}
        GROUP BY DATE(timestamp)
        ORDER BY date ASC
      `;
    }
    
    return res.status(200).json({
      symbol: stock.symbol,
      name: stock.name,
      interval,
      history
    });
  } catch (error) {
    console.error('Error fetching stock history:', error);
    return res.status(500).json({ error: 'Failed to fetch stock history' });
  }
};

// Get sectors for filtering
exports.getSectors = async (req, res) => {
  try {
    const sectors = await prisma.stock.groupBy({
      by: ['sector'],
      where: {
        sector: {
          not: null
        }
      }
    });
    
    return res.status(200).json(sectors.map(s => s.sector).sort());
  } catch (error) {
    console.error('Error fetching sectors:', error);
    return res.status(500).json({ error: 'Failed to fetch sectors' });
  }
};

// Add a new stock (admin only)
exports.addStock = async (req, res) => {
  const {
    symbol,
    name,
    currentPrice,
    change,
    high,
    low,
    volume,
    marketCap,
    sector
  } = req.body;
  
  if (!symbol || !name || !currentPrice) {
    return res.status(400).json({ error: 'Symbol, name, and current price are required' });
  }
  
  try {
    // Check if stock already exists
    const existingStock = await prisma.stock.findUnique({
      where: { symbol: symbol.toUpperCase() }
    });
    
    if (existingStock) {
      return res.status(400).json({ error: 'Stock with this symbol already exists' });
    }
    
    // Create new stock
    const stock = await prisma.stock.create({
      data: {
        symbol: symbol.toUpperCase(),
        name,
        currentPrice: parseFloat(currentPrice),
        change: parseFloat(change || 0),
        high: high ? parseFloat(high) : null,
        low: low ? parseFloat(low) : null,
        volume: volume ? parseInt(volume) : null,
        marketCap: marketCap ? parseFloat(marketCap) : null,
        sector,
        history: {
          create: {
            price: parseFloat(currentPrice),
            volume: volume ? parseInt(volume) : 0
          }
        }
      }
    });
    
    return res.status(201).json(stock);
  } catch (error) {
    console.error('Error adding stock:', error);
    return res.status(500).json({ error: 'Failed to add stock' });
  }
};

// Update stock price and info (admin or scheduled job)
exports.updateStock = async (req, res) => {
  const { idOrSymbol } = req.params;
  const {
    currentPrice,
    change,
    high,
    low,
    volume,
    marketCap
  } = req.body;
  
  if (!currentPrice) {
    return res.status(400).json({ error: 'Current price is required' });
  }
  
  try {
    // Find the stock
    let stock;
    
    // Try to find by ID
    if (idOrSymbol.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)) {
      stock = await prisma.stock.findUnique({
        where: { id: idOrSymbol }
      });
    } else {
      // Try to find by symbol
      stock = await prisma.stock.findUnique({
        where: { symbol: idOrSymbol.toUpperCase() }
      });
    }
    
    if (!stock) {
      return res.status(404).json({ error: 'Stock not found' });
    }
    
    // Update stock data
    const updatedStock = await prisma.$transaction(async (tx) => {
      // Update stock record
      const updated = await tx.stock.update({
        where: { id: stock.id },
        data: {
          currentPrice: parseFloat(currentPrice),
          change: parseFloat(change || 0),
          high: high ? parseFloat(high) : stock.high,
          low: low ? parseFloat(low) : stock.low,
          volume: volume ? parseInt(volume) : stock.volume,
          marketCap: marketCap ? parseFloat(marketCap) : stock.marketCap
        }
      });
      
      // Add history record
      await tx.stockHistory.create({
        data: {
          stockId: stock.id,
          price: parseFloat(currentPrice),
          volume: volume ? parseInt(volume) : 0
        }
      });
      
      return updated;
    });
    
    return res.status(200).json(updatedStock);
  } catch (error) {
    console.error('Error updating stock:', error);
    return res.status(500).json({ error: 'Failed to update stock' });
  }
};

// Get trending stocks
exports.getTrendingStocks = async (req, res) => {
  const { limit = 5 } = req.query;
  
  try {
    // Get stocks with highest trading volume or positive change
    const trendingStocks = await prisma.stock.findMany({
      orderBy: [
        { change: 'desc' }
      ],
      take: parseInt(limit)
    });
    
    return res.status(200).json(trendingStocks);
  } catch (error) {
    console.error('Error fetching trending stocks:', error);
    return res.status(500).json({ error: 'Failed to fetch trending stocks' });
  }
}; 