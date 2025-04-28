const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get user portfolio
exports.getPortfolio = async (req, res) => {
  const userId = req.params.userId || req.user.userId;
  
  try {
    // Get portfolio with holdings and stocks
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
    
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    
    // Calculate current portfolio value
    const totalValue = portfolio.holdings.reduce((sum, holding) => {
      return sum + (holding.quantity * holding.stock.currentPrice);
    }, 0);
    
    // Calculate total cost basis
    const totalCostBasis = portfolio.holdings.reduce((sum, holding) => {
      return sum + (holding.quantity * holding.avgPrice);
    }, 0);
    
    // Calculate overall return
    const totalReturn = totalValue - totalCostBasis;
    const totalReturnPercentage = totalCostBasis > 0 
      ? (totalReturn / totalCostBasis) * 100 
      : 0;
    
    // Enhance the holdings with calculated fields
    const enhancedHoldings = portfolio.holdings.map(holding => {
      const currentValue = holding.quantity * holding.stock.currentPrice;
      const costBasis = holding.quantity * holding.avgPrice;
      const returnValue = currentValue - costBasis;
      const returnPercentage = costBasis > 0 
        ? (returnValue / costBasis) * 100 
        : 0;
      const allocationPercentage = totalValue > 0 
        ? (currentValue / totalValue) * 100 
        : 0;
      
      return {
        ...holding,
        currentValue,
        costBasis,
        return: returnValue,
        returnPercentage,
        allocationPercentage
      };
    });
    
    // Sort holdings by allocation percentage (descending)
    enhancedHoldings.sort((a, b) => b.allocationPercentage - a.allocationPercentage);
    
    // Get latest snapshot for performance data
    const latestSnapshot = await prisma.portfolioSnapshot.findFirst({
      where: { portfolioId: portfolio.id },
      orderBy: { timestamp: 'desc' }
    });
    
    return res.status(200).json({
      id: portfolio.id,
      userId,
      totalValue,
      totalCostBasis,
      totalReturn,
      totalReturnPercentage,
      lastUpdated: latestSnapshot ? latestSnapshot.timestamp : portfolio.updatedAt,
      holdings: enhancedHoldings
    });
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
};

// Get portfolio performance over time
exports.getPortfolioPerformance = async (req, res) => {
  const userId = req.params.userId || req.user.userId;
  const { timeframe = '1m' } = req.query; // 1d, 1w, 1m, 3m, 6m, 1y, all
  
  try {
    // Get user portfolio
    const portfolio = await prisma.portfolio.findUnique({
      where: { userId }
    });
    
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    
    // Calculate date range based on timeframe
    const endDate = new Date();
    const startDate = new Date();
    
    switch (timeframe) {
      case '1d':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case '1w':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '1m':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case '3m':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case '6m':
        startDate.setMonth(startDate.getMonth() - 6);
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      case 'all':
        // Don't set a start date limit
        startDate.setFullYear(2000);
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 1);
    }
    
    // Get portfolio snapshots for the timeframe
    const snapshots = await prisma.portfolioSnapshot.findMany({
      where: {
        portfolioId: portfolio.id,
        timestamp: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        timestamp: 'asc'
      }
    });
    
    // If no snapshots, return empty data
    if (snapshots.length === 0) {
      return res.status(200).json({
        userId,
        timeframe,
        performance: []
      });
    }
    
    // Calculate period performance
    const firstValue = snapshots[0].totalValue;
    const lastValue = snapshots[snapshots.length - 1].totalValue;
    const absoluteChange = lastValue - firstValue;
    const percentageChange = firstValue > 0 
      ? (absoluteChange / firstValue) * 100 
      : 0;
    
    return res.status(200).json({
      userId,
      timeframe,
      startDate: snapshots[0].timestamp,
      endDate: snapshots[snapshots.length - 1].timestamp,
      startValue: firstValue,
      endValue: lastValue,
      absoluteChange,
      percentageChange,
      snapshots
    });
  } catch (error) {
    console.error('Error fetching portfolio performance:', error);
    return res.status(500).json({ error: 'Failed to fetch portfolio performance' });
  }
};

// Get asset allocation
exports.getAssetAllocation = async (req, res) => {
  const userId = req.params.userId || req.user.userId;
  
  try {
    // Get portfolio with holdings and stocks
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
    
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    
    // Calculate total portfolio value
    const totalValue = portfolio.holdings.reduce((sum, holding) => {
      return sum + (holding.quantity * holding.stock.currentPrice);
    }, 0);
    
    // Group holdings by sector and calculate allocation
    const sectorAllocation = {};
    
    portfolio.holdings.forEach(holding => {
      const sector = holding.stock.sector || 'Other';
      const value = holding.quantity * holding.stock.currentPrice;
      
      if (!sectorAllocation[sector]) {
        sectorAllocation[sector] = 0;
      }
      
      sectorAllocation[sector] += value;
    });
    
    // Convert to percentage and format for response
    const allocation = Object.entries(sectorAllocation).map(([sector, value]) => ({
      sector,
      value,
      percentage: totalValue > 0 ? (value / totalValue) * 100 : 0
    }));
    
    // Sort by allocation percentage (descending)
    allocation.sort((a, b) => b.percentage - a.percentage);
    
    return res.status(200).json({
      userId,
      totalValue,
      allocation
    });
  } catch (error) {
    console.error('Error fetching asset allocation:', error);
    return res.status(500).json({ error: 'Failed to fetch asset allocation' });
  }
};

// Get portfolio risk analysis
exports.getPortfolioRisk = async (req, res) => {
  const userId = req.params.userId || req.user.userId;
  
  try {
    // Get portfolio with holdings and stocks
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
    
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    
    // Calculate total portfolio value
    const totalValue = portfolio.holdings.reduce((sum, holding) => {
      return sum + (holding.quantity * holding.stock.currentPrice);
    }, 0);
    
    // Simple risk calculation based on sector concentration and volatility
    // In a real app, this would use more sophisticated metrics
    
    // Calculate sector concentration
    const sectorValues = {};
    portfolio.holdings.forEach(holding => {
      const sector = holding.stock.sector || 'Other';
      const value = holding.quantity * holding.stock.currentPrice;
      
      if (!sectorValues[sector]) {
        sectorValues[sector] = 0;
      }
      
      sectorValues[sector] += value;
    });
    
    const sectors = Object.keys(sectorValues);
    const highestConcentration = sectors.length > 0 
      ? Math.max(...Object.values(sectorValues).map(v => (v / totalValue) * 100)) 
      : 0;
    
    // Calculate diversification score (0-100)
    const diversificationScore = sectors.length > 0 
      ? Math.max(0, 100 - (highestConcentration - (100 / sectors.length))) 
      : 0;
    
    // Calculate volatility score based on holdings (simplified)
    let volatilityScore = 50; // Default moderate volatility
    
    // In a real app, we would calculate this based on historical price movements
    // For now, we'll use sector as a proxy
    const highVolatilitySectors = ['Technology', 'Cryptocurrency', 'Energy'];
    const mediumVolatilitySectors = ['Healthcare', 'Consumer Cyclical', 'Industrials'];
    const lowVolatilitySectors = ['Utilities', 'Consumer Defensive', 'Real Estate'];
    
    let highVolValue = 0;
    let medVolValue = 0;
    let lowVolValue = 0;
    
    Object.entries(sectorValues).forEach(([sector, value]) => {
      if (highVolatilitySectors.includes(sector)) {
        highVolValue += value;
      } else if (mediumVolatilitySectors.includes(sector)) {
        medVolValue += value;
      } else if (lowVolatilitySectors.includes(sector)) {
        lowVolValue += value;
      } else {
        medVolValue += value; // Default to medium
      }
    });
    
    if (totalValue > 0) {
      volatilityScore = 
        (highVolValue / totalValue) * 80 + 
        (medVolValue / totalValue) * 50 + 
        (lowVolValue / totalValue) * 20;
    }
    
    // Classify risk level
    let riskLevel;
    if (volatilityScore >= 70) {
      riskLevel = 'High';
    } else if (volatilityScore >= 40) {
      riskLevel = 'Medium';
    } else {
      riskLevel = 'Low';
    }
    
    // Calculate risk-adjusted return (simplified)
    // In a real app this would be Sharpe ratio or similar
    const sharpeRatio = 1.0; // Placeholder
    
    return res.status(200).json({
      userId,
      totalValue,
      diversification: {
        score: Math.round(diversificationScore),
        sectorCount: sectors.length,
        highestConcentration: Math.round(highestConcentration)
      },
      volatility: {
        score: Math.round(volatilityScore),
        level: riskLevel
      },
      riskAdjustedReturn: sharpeRatio
    });
  } catch (error) {
    console.error('Error analyzing portfolio risk:', error);
    return res.status(500).json({ error: 'Failed to analyze portfolio risk' });
  }
};

// Create portfolio snapshot (usually called by a scheduled job)
exports.createPortfolioSnapshot = async (req, res) => {
  const { portfolioId } = req.params;
  
  try {
    // Get portfolio with holdings
    const portfolio = await prisma.portfolio.findUnique({
      where: { id: portfolioId },
      include: {
        holdings: {
          include: {
            stock: true
          }
        }
      }
    });
    
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    
    // Calculate current portfolio value
    const totalValue = portfolio.holdings.reduce((sum, holding) => {
      return sum + (holding.quantity * holding.stock.currentPrice);
    }, 0);
    
    // Create snapshot
    const snapshot = await prisma.portfolioSnapshot.create({
      data: {
        portfolioId,
        totalValue
      }
    });
    
    return res.status(201).json(snapshot);
  } catch (error) {
    console.error('Error creating portfolio snapshot:', error);
    return res.status(500).json({ error: 'Failed to create portfolio snapshot' });
  }
}; 