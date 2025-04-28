// server/routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

// All chat routes require authentication
router.use(authMiddleware);

// Chat sessions
router.get('/sessions', chatController.getChatSessions);
router.post('/sessions', chatController.createChatSession);
router.get('/sessions/:sessionId', chatController.getChatSession);
router.put('/sessions/:sessionId', chatController.updateChatSession);
router.delete('/sessions/:sessionId', chatController.deleteChatSession);

// Chat messages
router.post('/sessions/:sessionId/messages', chatController.sendMessage);
router.get('/sessions/:sessionId/messages', chatController.getMessages);

// AI analysis endpoints
router.get('/analysis/portfolio', chatController.analyzePortfolio);
router.get('/recommendations', chatController.getRecommendations);

module.exports = router; 