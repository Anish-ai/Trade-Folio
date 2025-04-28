const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const stockRoutes = require('./stockRoutes');
const portfolioRoutes = require('./portfolioRoutes');
const transactionRoutes = require('./transactionRoutes');
const chatRoutes = require('./chatRoutes');

// Configure routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/stocks', stockRoutes);
router.use('/portfolios', portfolioRoutes);
router.use('/transactions', transactionRoutes);
router.use('/chat', chatRoutes);

module.exports = router; 