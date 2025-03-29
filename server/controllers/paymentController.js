const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all payments for a specific user
exports.getUserPayments = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const payments = await prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    
    res.status(200).json(payments);
  } catch (error) {
    console.error('Error fetching user payments:', error);
    res.status(500).json({ message: 'Failed to fetch payments', error: error.message });
  }
};

// Get a specific payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const payment = await prisma.payment.findUnique({
      where: { id }
    });
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    res.status(200).json(payment);
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({ message: 'Failed to fetch payment', error: error.message });
  }
};

// Create a new payment (deposit or withdrawal)
exports.createPayment = async (req, res) => {
  try {
    const { userId, amount, type, referenceId } = req.body;
    
    if (!userId || !amount || !type) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    if (type !== 'DEPOSIT' && type !== 'WITHDRAWAL' && type !== 'FEE') {
      return res.status(400).json({ message: 'Invalid payment type' });
    }
    
    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        userId,
        amount,
        type,
        status: 'PENDING',
        referenceId
      }
    });
    
    res.status(201).json(payment);
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ message: 'Failed to create payment', error: error.message });
  }
};

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Payment status is required' });
    }
    
    if (!['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid payment status' });
    }
    
    const payment = await prisma.payment.findUnique({
      where: { id }
    });
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    // Update payment status
    const updatedPayment = await prisma.payment.update({
      where: { id },
      data: { status }
    });
    
    // If payment is completed and it's a deposit, update user balance
    if (status === 'COMPLETED' && payment.type === 'DEPOSIT') {
      await prisma.user.update({
        where: { id: payment.userId },
        data: {
          balance: {
            increment: payment.amount
          }
        }
      });
      
      // Log the activity
      await prisma.userActivity.create({
        data: {
          userId: payment.userId,
          action: 'DEPOSIT',
          metadata: { 
            paymentId: payment.id,
            amount: payment.amount
          }
        }
      });
    }
    
    // If payment is completed and it's a withdrawal, update user balance
    if (status === 'COMPLETED' && payment.type === 'WITHDRAWAL') {
      // Check if user has sufficient balance
      const user = await prisma.user.findUnique({
        where: { id: payment.userId }
      });
      
      if (user.balance < payment.amount) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }
      
      await prisma.user.update({
        where: { id: payment.userId },
        data: {
          balance: {
            decrement: payment.amount
          }
        }
      });
      
      // Log the activity
      await prisma.userActivity.create({
        data: {
          userId: payment.userId,
          action: 'WITHDRAWAL',
          metadata: { 
            paymentId: payment.id,
            amount: payment.amount
          }
        }
      });
    }
    
    res.status(200).json(updatedPayment);
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ message: 'Failed to update payment status', error: error.message });
  }
};

// Delete a payment (admin only, or cancellation)
exports.deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    
    const payment = await prisma.payment.findUnique({
      where: { id }
    });
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    // Only allow deletion if payment is in PENDING state
    if (payment.status !== 'PENDING') {
      return res.status(400).json({ message: 'Only pending payments can be deleted' });
    }
    
    await prisma.payment.delete({
      where: { id }
    });
    
    res.status(200).json({ message: 'Payment deleted successfully' });
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({ message: 'Failed to delete payment', error: error.message });
  }
};