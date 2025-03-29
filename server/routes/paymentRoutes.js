const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Get all payments for a user
router.get('/users/:userId/payments', paymentController.getUserPayments);

// Get payment by ID
router.get('/payments/:id', paymentController.getPaymentById);

// Create a new payment
router.post('/payments', paymentController.createPayment);

// Update payment status
router.patch('/payments/:id/status', paymentController.updatePaymentStatus);

// Delete a payment (admin only or cancellation)
router.delete('/payments/:id', paymentController.deletePayment);

module.exports = router;