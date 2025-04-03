const express = require('express');
const router = express.Router();
const {
  createTransaction,
  getTransactionsByUser,
  getTransactionById,
  getAllTransactions,
  cancelTransaction
} = require('../controllers/transactionController');

// GET /transactions?page=1&limit=10&type=BUY&stockId=123&userId=456&startDate=2023-01-01&endDate=2023-12-31
router.get('/', getAllTransactions);

// GET /transactions/:id
router.get('/:id', getTransactionById);

// POST /transactions (create new transaction)
router.post('/', createTransaction);

// GET /transactions/user/:userId?page=1&limit=10&type=BUY&stockId=123
router.get('/user/:userId', getTransactionsByUser);

// PATCH /transactions/:id/cancel (cancel a transaction)
router.patch('/:id/cancel', cancelTransaction);

module.exports = router;