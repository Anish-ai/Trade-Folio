const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Error handling utility
const handleStockError = (res, error, action) => {
    console.error(`Error ${action}:`, error);
    const statusCode = error.code === 'P2002' ? 409 : 500;
    res.status(statusCode).json({
        success: false,
        message: `Error ${action}`,
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
};

// Get all stocks with filtering and pagination
const getAllStocks = async (req, res) => {
    try {
        const { sector, symbol, page = 1, limit = 10, sortBy = 'symbol', sortOrder = 'asc' } = req.query;
        
        const where = {};
        if (sector) where.sector = sector;
        if (symbol) where.symbol = { contains: symbol, mode: 'insensitive' };

        const stocks = await prisma.stock.findMany({
            where,
            skip: (page - 1) * limit,
            take: parseInt(limit),
            orderBy: { [sortBy]: sortOrder },
            include: {
                history: { take: 5, orderBy: { timestamp: 'desc' } },
                _count: { select: { holdings: true, transactions: true } }
            }
        });

        const total = await prisma.stock.count({ where });
        
        res.json({
            success: true,
            data: stocks,
            meta: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        handleStockError(res, error, 'fetching stocks');
    }
};

// Get single stock by ID
const getStockById = async (req, res) => {
    try {
        const stock = await prisma.stock.findUnique({
            where: { id: req.params.id },
            include: {
                history: { orderBy: { timestamp: 'desc' }, take: 20 },
                holdings: true,
                transactions: { orderBy: { createdAt: 'desc' }, take: 10 }
            }
        });

        if (!stock) {
            return res.status(404).json({ success: false, message: 'Stock not found' });
        }
        
        res.json({ success: true, data: stock });
    } catch (error) {
        handleStockError(res, error, 'fetching stock');
    }
};

// Create new stock
const createStock = async (req, res) => {
    try {
        const { symbol, name, currentPrice, sector } = req.body;
        
        // Validation
        if (!symbol || !name || !currentPrice) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: symbol, name, currentPrice'
            });
        }

        const existingSymbol = await prisma.stock.findUnique({
            where: { symbol: symbol.toUpperCase() }
        });

        if (existingSymbol) {
            return res.status(409).json({
                success: false,
                message: 'Stock symbol already exists'
            });
        }

        const newStock = await prisma.stock.create({
            data: {
                symbol: symbol.toUpperCase(),
                name,
                currentPrice: parseFloat(currentPrice),
                change: 0,
                sector,
                updatedAt: new Date()
            }
        });

        res.status(201).json({ success: true, data: newStock });
    } catch (error) {
        handleStockError(res, error, 'creating stock');
    }
};

// Update stock details
const updateStock = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Prevent symbol updates
        if (updateData.symbol) {
            return res.status(400).json({
                success: false,
                message: 'Symbol cannot be modified'
            });
        }

        const updatedStock = await prisma.stock.update({
            where: { id },
            data: {
                ...updateData,
                updatedAt: new Date()
            }
        });

        res.json({ success: true, data: updatedStock });
    } catch (error) {
        handleStockError(res, error, 'updating stock');
    }
};

// Update stock price (special endpoint)
const updateStockPrice = async (req, res) => {
    try {
        const { id } = req.params;
        const { newPrice } = req.body;

        if (!newPrice || isNaN(newPrice)) {
            return res.status(400).json({
                success: false,
                message: 'Valid newPrice required'
            });
        }

        const currentStock = await prisma.stock.findUnique({ where: { id } });
        if (!currentStock) {
            return res.status(404).json({ success: false, message: 'Stock not found' });
        }

        const priceChange = parseFloat(newPrice) - currentStock.currentPrice;

        const [updatedStock, historyEntry] = await prisma.$transaction([
            prisma.stock.update({
                where: { id },
                data: {
                    currentPrice: parseFloat(newPrice),
                    change: priceChange,
                    high: Math.max(currentStock.high || 0, parseFloat(newPrice)),
                    low: Math.min(currentStock.low || Infinity, parseFloat(newPrice)),
                    updatedAt: new Date()
                }
            }),
            prisma.stockHistory.create({
                data: {
                    stockId: id,
                    price: parseFloat(newPrice),
                    timestamp: new Date()
                }
            })
        ]);

        res.json({
            success: true,
            data: {
                ...updatedStock,
                historyUpdate: historyEntry
            }
        });
    } catch (error) {
        handleStockError(res, error, 'updating stock price');
    }
};

// Delete stock
const deleteStock = async (req, res) => {
    try {
        const { id } = req.params;

        // Check for existing relationships
        const relatedData = await prisma.stock.findUnique({
            where: { id },
            include: {
                holdings: { take: 1 },
                transactions: { take: 1 }
            }
        });

        if (relatedData.holdings.length > 0 || relatedData.transactions.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Cannot delete stock with existing holdings or transactions'
            });
        }

        await prisma.$transaction([
            prisma.stockHistory.deleteMany({ where: { stockId: id } }),
            prisma.stock.delete({ where: { id } })
        ]);

        res.json({ success: true, message: 'Stock deleted successfully' });
    } catch (error) {
        handleStockError(res, error, 'deleting stock');
    }
};

module.exports = {
    getAllStocks,
    getStockById,
    createStock,
    updateStock,
    updateStockPrice,
    deleteStock
};