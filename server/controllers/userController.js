const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// Register a new user
exports.registerUser = async (req, res) => {
  const { username, email, password, name } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required' });
  }
  
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        name,
        portfolio: {
          create: {} // Create empty portfolio
        }
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        balance: true,
        isVirtual: true,
        verified: true,
        createdAt: true
      }
    });
    
    // Create initial user activity
    await prisma.userActivity.create({
      data: {
        userId: user.id,
        action: 'REGISTER',
        ipAddress: req.ip,
        metadata: { userAgent: req.headers['user-agent'] }
      }
    });
    
    return res.status(201).json(user);
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ error: 'Failed to register user' });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  
  try {
    // Find user by username or email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email: username } // Allow login with email as username
        ]
      }
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Create login activity
    await prisma.userActivity.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        ipAddress: req.ip,
        metadata: { userAgent: req.headers['user-agent'] }
      }
    });
    
    return res.status(200).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        balance: user.balance,
        isVirtual: user.isVirtual,
        verified: user.verified
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ error: 'Failed to login' });
  }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  const userId = req.params.userId || req.user.userId;
  
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        balance: true,
        isVirtual: true,
        verified: true,
        createdAt: true,
        portfolio: {
          include: {
            holdings: {
              include: {
                stock: true
              }
            },
            snapshots: {
              orderBy: {
                timestamp: 'desc'
              },
              take: 30
            }
          }
        }
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    return res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  const userId = req.params.userId || req.user.userId;
  const { name, email } = req.body;
  
  try {
    // Check if email is taken by another user
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          NOT: {
            id: userId
          }
        }
      });
      
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(email && { email })
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        balance: true,
        isVirtual: true,
        verified: true,
        createdAt: true
      }
    });
    
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    return res.status(500).json({ error: 'Failed to update user profile' });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  const userId = req.user.userId;
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current password and new password are required' });
  }
  
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Verify current password
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });
    
    // Create password change activity
    await prisma.userActivity.create({
      data: {
        userId,
        action: 'PASSWORD_CHANGE',
        ipAddress: req.ip,
        metadata: { userAgent: req.headers['user-agent'] }
      }
    });
    
    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    return res.status(500).json({ error: 'Failed to change password' });
  }
};

// Get user activities
exports.getUserActivities = async (req, res) => {
  const userId = req.params.userId || req.user.userId;
  const { limit = 20, page = 1, action } = req.query;
  
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  try {
    const where = { userId };
    if (action) {
      where.action = action;
    }
    
    const activities = await prisma.userActivity.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit)
    });
    
    const total = await prisma.userActivity.count({ where });
    
    return res.status(200).json({
      activities,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching user activities:', error);
    return res.status(500).json({ error: 'Failed to fetch user activities' });
  }
};

// Add funds to account
exports.addFunds = async (req, res) => {
  const userId = req.params.userId || req.user.userId;
  const { amount } = req.body;
  
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Valid amount is required' });
  }
  
  try {
    // Create a payment record
    const payment = await prisma.payment.create({
      data: {
        userId,
        amount,
        type: 'DEPOSIT',
        status: 'COMPLETED', // In a real app, this would be 'PENDING' until processed
        referenceId: `DEP-${Date.now()}`
      }
    });
    
    // Update user balance
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        balance: {
          increment: amount
        }
      },
      select: {
        id: true,
        username: true,
        balance: true
      }
    });
    
    return res.status(200).json({
      message: 'Funds added successfully',
      payment,
      newBalance: user.balance
    });
  } catch (error) {
    console.error('Error adding funds:', error);
    return res.status(500).json({ error: 'Failed to add funds' });
  }
};

// Get user transactions
exports.getUserTransactions = async (req, res) => {
  const userId = req.params.userId || req.user.userId;
  const { limit = 20, page = 1, type } = req.query;
  
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  try {
    const where = { userId };
    if (type) {
      where.type = type;
    }
    
    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit),
      include: {
        stock: true
      }
    });
    
    const total = await prisma.transaction.count({ where });
    
    return res.status(200).json({
      transactions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching user transactions:', error);
    return res.status(500).json({ error: 'Failed to fetch user transactions' });
  }
};

// Get user payment history
exports.getUserPayments = async (req, res) => {
  const userId = req.params.userId || req.user.userId;
  const { limit = 20, page = 1, type } = req.query;
  
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  try {
    const where = { userId };
    if (type) {
      where.type = type;
    }
    
    const payments = await prisma.payment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit)
    });
    
    const total = await prisma.payment.count({ where });
    
    return res.status(200).json({
      payments,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching user payments:', error);
    return res.status(500).json({ error: 'Failed to fetch user payments' });
  }
};

// Get current user's details
exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        portfolio: {
          include: {
            holdings: {
              include: {
                stock: true
              }
            }
          }
        }
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Remove sensitive data
    const { password, resetPasswordToken, resetPasswordExpiry, verificationToken, verificationTokenExpiry, ...userData } = user;
    
    return res.status(200).json(userData);
  } catch (error) {
    console.error('Get current user error:', error);
    return res.status(500).json({ error: 'Failed to fetch user data' });
  }
};

// Update current user's details
exports.updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, email, profileSettings } = req.body;
    
    // Check if email is already in use
    if (email) {
      const existingUser = await prisma.user.findUnique({
        where: { email, NOT: { id: userId } }
      });
      
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }
    
    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(email && { email }),
        ...(profileSettings && { 
          profile: {
            update: profileSettings
          }
        })
      },
      include: {
        profile: true
      }
    });
    
    // Remove sensitive data
    const { password, resetPasswordToken, resetPasswordExpiry, verificationToken, verificationTokenExpiry, ...userData } = updatedUser;
    
    return res.status(200).json(userData);
  } catch (error) {
    console.error('Update user error:', error);
    return res.status(500).json({ error: 'Failed to update user data' });
  }
};

// Get user activity history
exports.getUserActivity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const activities = await prisma.userActivity.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit)
    });
    
    const total = await prisma.userActivity.count({
      where: { userId }
    });
    
    return res.status(200).json({
      activities,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get user activity error:', error);
    return res.status(500).json({ error: 'Failed to fetch user activity' });
  }
};

// Get user notifications
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const whereClause = {
      userId,
      ...(unreadOnly === 'true' && { read: false })
    };
    
    const notifications = await prisma.notification.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit)
    });
    
    const total = await prisma.notification.count({
      where: whereClause
    });
    
    const unreadCount = await prisma.notification.count({
      where: { userId, read: false }
    });
    
    return res.status(200).json({
      notifications,
      unreadCount,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    return res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

// Mark notification as read
exports.markNotificationRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    const notification = await prisma.notification.findUnique({
      where: { id }
    });
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    if (notification.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const updatedNotification = await prisma.notification.update({
      where: { id },
      data: { read: true }
    });
    
    return res.status(200).json(updatedNotification);
  } catch (error) {
    console.error('Mark notification read error:', error);
    return res.status(500).json({ error: 'Failed to update notification' });
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    const notification = await prisma.notification.findUnique({
      where: { id }
    });
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    if (notification.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    await prisma.notification.delete({
      where: { id }
    });
    
    return res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Delete notification error:', error);
    return res.status(500).json({ error: 'Failed to delete notification' });
  }
};

// === Admin-only methods ===

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    
    const { page = 1, limit = 20, search = '' } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const whereClause = search
      ? {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } }
          ]
        }
      : {};
    
    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isVerified: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        profile: {
          select: {
            avatarUrl: true
          }
        },
        _count: {
          select: {
            portfolio: true,
            transactions: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit)
    });
    
    const total = await prisma.user.count({
      where: whereClause
    });
    
    return res.status(200).json({
      users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get user by ID (admin only)
exports.getUserById = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    
    const { id } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        portfolio: true,
        transactions: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        },
        activities: {
          take: 10,
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Remove sensitive data
    const { password, resetPasswordToken, resetPasswordExpiry, verificationToken, verificationTokenExpiry, ...userData } = user;
    
    return res.status(200).json(userData);
  } catch (error) {
    console.error('Get user by ID error:', error);
    return res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Update user by ID (admin only)
exports.updateUserById = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    
    const { id } = req.params;
    const { firstName, lastName, email, role, isVerified, profileSettings } = req.body;
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });
    
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if email is already in use
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email }
      });
      
      if (emailExists) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }
    
    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(email && { email }),
        ...(role && { role }),
        ...(isVerified !== undefined && { isVerified }),
        ...(profileSettings && { 
          profile: {
            update: profileSettings
          }
        })
      },
      include: {
        profile: true
      }
    });
    
    // Remove sensitive data
    const { password, resetPasswordToken, resetPasswordExpiry, verificationToken, verificationTokenExpiry, ...userData } = updatedUser;
    
    return res.status(200).json(userData);
  } catch (error) {
    console.error('Update user by ID error:', error);
    return res.status(500).json({ error: 'Failed to update user' });
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    
    const { id } = req.params;
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Delete user (cascading to connected records)
    await prisma.user.delete({
      where: { id }
    });
    
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({ error: 'Failed to delete user' });
  }
}; 