const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { validationResult } = require('express-validator');

//
const createUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, name, isVirtual } = req.body;
    
    try {
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password, // Remember to hash this in production!
                name,
                isVirtual: isVirtual || false,
                balance: 0.0 // Default balance
            }
        });
        
        // Omit sensitive fields from response
        const { password: _, ...safeUser } = newUser;
        res.status(201).json(safeUser);
        
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ 
                message: 'Validation error',
                errors: [{
                    msg: 'Username or email already exists',
                    param: error.meta.target[0]
                }]
            });
        }
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

// Get all users with pagination
const getUsers = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    
    try {
        const users = await prisma.user.findMany({
            skip: (page - 1) * limit,
            take: parseInt(limit),
            select: {
                id: true,
                username: true,
                name: true,
                balance: true,
                isVirtual: true,
                createdAt: true
            }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

// Get user by ID with portfolio and transaction summary
const getUserById = async (req, res) => {
    const { id } = req.params;
    
    try {
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                portfolio: {
                    include: {
                        holdings: {
                            include: {
                                stock: true
                            }
                        }
                    }
                },
                transactions: {
                    take: 5,
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!user) return res.status(404).json({ message: 'User not found' });
        
        // Calculate total portfolio value
        const portfolioValue = user.portfolio?.holdings?.reduce(
            (sum, holding) => sum + (holding.quantity * holding.stock.currentPrice), 0
        ) || 0;

        // Omit sensitive fields
        const { password, ...safeUser } = user;
        res.json({ 
            ...safeUser,
            portfolioValue
        });
        
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
};

// Update user balance with transaction logging
const updateUserBalance = async (req, res) => {
    const { id } = req.params;
    const { amount, type = 'ADJUSTMENT', note } = req.body;
    
    try {
        const result = await prisma.$transaction([
            prisma.user.update({
                where: { id },
                data: { balance: { increment: amount } }
            }),
            prisma.transaction.create({
                data: {
                    userId: id,
                    type,
                    amount,
                    balanceBefore: { increment: -amount },
                    balanceAfter: { increment: amount },
                    metadata: { note }
                }
            })
        ]);

        const updatedUser = result[0];
        res.json(updatedUser);
        
    } catch (error) {
        res.status(500).json({ message: 'Error updating balance', error: error.message });
    }
};

//deleteing user by id
const deleteUser = async (req, res) => {
    const { id } = req.params;
    
    try {
        const user = await prisma.user.delete({
            where: { id }
        });
        
        res.json({ message: 'User deleted successfully', user });
        
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};


module.exports = { createUser, getUsers, getUserById, updateUserBalance,deleteUser };