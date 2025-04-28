// server/routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

// All transaction routes require authentication
router.use(authMiddleware);

// Get user transactions
router.get('/', transactionController.getUserTransactions);
router.get('/:userId/transactions', transactionController.getUserTransactions);

// Get transaction by ID
router.get('/:id', transactionController.getTransaction);

// Create buy/sell transactions
router.post('/buy', transactionController.buyStock);
router.post('/sell', transactionController.sellStock);

// Get transaction statistics
router.get('/stats', transactionController.getTransactionStats);
router.get('/:userId/stats', transactionController.getTransactionStats);

module.exports = router; 