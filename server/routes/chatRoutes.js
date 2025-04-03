const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Chat Sessions
router.post('/sessions', chatController.createChatSession);
router.get('/users/:userId/sessions', chatController.getUserChatSessions);
router.get('/sessions/:sessionId', chatController.getConversation);
router.patch('/sessions/:sessionId', chatController.updateChatSession);
router.delete('/sessions/:sessionId', chatController.deleteChatSession);

// Chat Messages
router.post('/messages', chatController.createChatMessage);
router.get('/users/:userId/history', chatController.getChatHistory);
router.patch('/messages/:id', chatController.updateChatMessage);
router.delete('/messages/:id', chatController.deleteChatMessage);

module.exports = router;