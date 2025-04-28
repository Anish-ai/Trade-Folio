// server/routes/stockRoutes.js
const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public routes (accessible without authentication)
router.get('/', stockController.getAllStocks);
router.get('/trending', stockController.getTrendingStocks);
router.get('/sectors', stockController.getSectors);
router.get('/:idOrSymbol', stockController.getStock);
router.get('/:idOrSymbol/history', stockController.getStockHistory);

// Admin routes (require authentication and admin privileges)
router.post('/', authMiddleware, adminMiddleware, stockController.addStock);
router.put('/:idOrSymbol', authMiddleware, adminMiddleware, stockController.updateStock);

module.exports = router; 