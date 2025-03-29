const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { PrismaClient } = require('@prisma/client');
const userRoutes = require('./routes/userRoutes');
const stockRoutes = require('./routes/stockRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const marketplaceRoutes = require('./routes/marketplaceRoutes')

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/users', userRoutes);
app.use('/stocks', stockRoutes);
app.use('/transactions', transactionRoutes);  // For POST /transactions
app.use('/users', transactionRoutes);         // For GET /users/:userId/transactions
app.use('/', paymentRoutes);
app.use('/marketplace', marketplaceRoutes);

// Database connection
prisma.$connect()
    .then(() => console.log('Connected to database'))
    .catch(error => {
        console.error('Database connection error:', error);
        process.exit(1);
    });

// Error handling
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { error: err.message })
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});