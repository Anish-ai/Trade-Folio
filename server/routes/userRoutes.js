// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// All user routes require authentication
router.use(authMiddleware);

// User routes
router.get('/', userController.getCurrentUser);
router.put('/', userController.updateUser);
router.get('/activity', userController.getUserActivity);
router.get('/notifications', userController.getNotifications);
router.put('/notifications/:id/read', userController.markNotificationRead);
router.delete('/notifications/:id', userController.deleteNotification);

// Admin-only routes
router.get('/all', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUserById);
router.delete('/:id', userController.deleteUser);

module.exports = router; 