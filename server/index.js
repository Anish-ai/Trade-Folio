require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const routes = require('./routes');
const { PrismaClient } = require('@prisma/client');
const userRoutes = require('./routes/userRoutes');
const stockRoutes = require('./routes/stockRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const marketplaceRoutes = require('./routes/marketplaceRoutes');
const chatRoutes = require('./routes/chatRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');

// Initialize Prisma
const prisma = new PrismaClient();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Apply middleware
app.use(helmet()); // Security headers
app.use(cors()); // Cross-origin resource sharing
app.use(compression()); // Compress responses
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan('dev')); // Logging

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests, please try again after 15 minutes'
  }
});
app.use('/api', apiLimiter);

// Routes
app.use('/users', userRoutes);
app.use('/stocks', stockRoutes);
app.use('/transactions', transactionRoutes);  // For POST /transactions
app.use('/users', transactionRoutes);         // For GET /users/:userId/transactions
app.use('/', paymentRoutes);
app.use('/marketplace', marketplaceRoutes);
app.use('/chat', chatRoutes);
app.use('/portfolios', portfolioRoutes);

// API routes
app.use('/api', routes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Catch-all route for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({ error: message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; // For testing
