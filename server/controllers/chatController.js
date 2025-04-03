const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new chat session
exports.createChatSession = async (req, res) => {
  try {
    const { userId, title } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    // Create a new chat session
    const chatSession = await prisma.chatSession.create({
      data: {
        userId,
        title: title || 'New Chat'
      }
    });
    
    res.status(201).json(chatSession);
  } catch (error) {
    console.error('Error creating chat session:', error);
    res.status(500).json({ message: 'Failed to create chat session', error: error.message });
  }
};

// Get all chat sessions for a user
exports.getUserChatSessions = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const chatSessions = await prisma.chatSession.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { messages: true }
        }
      }
    });
    
    res.status(200).json(chatSessions);
  } catch (error) {
    console.error('Error fetching chat sessions:', error);
    res.status(500).json({ message: 'Failed to fetch chat sessions', error: error.message });
  }
};

// Get a specific chat session with its messages
exports.getConversation = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    
    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          skip: offset,
          take: limit
        }
      }
    });
    
    if (!session) {
      return res.status(404).json({ message: 'Chat session not found' });
    }
    
    res.status(200).json(session);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ message: 'Failed to fetch conversation', error: error.message });
  }
};

// Create a new chat message
exports.createChatMessage = async (req, res) => {
  try {
    const { sessionId, role, content, metadata } = req.body;
    
    if (!sessionId || !role || !content) {
      return res.status(400).json({ message: 'Session ID, role, and content are required' });
    }
    
    if (!['user', 'ai', 'system'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be user, ai, or system' });
    }
    
    // Check if session exists
    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId }
    });
    
    if (!session) {
      return res.status(404).json({ message: 'Chat session not found' });
    }
    
    // Create new message
    const message = await prisma.chatMessage.create({
      data: {
        sessionId,
        role,
        content,
        metadata: metadata || {}
      }
    });
    
    // Update the session's updatedAt timestamp
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { updatedAt: new Date() }
    });
    
    res.status(201).json(message);
  } catch (error) {
    console.error('Error creating chat message:', error);
    res.status(500).json({ message: 'Failed to create chat message', error: error.message });
  }
};

// Get chat history for a user (all messages across all sessions)
exports.getChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    
    // First get all session IDs for this user
    const sessions = await prisma.chatSession.findMany({
      where: { userId },
      select: { id: true }
    });
    
    const sessionIds = sessions.map(session => session.id);
    
    if (sessionIds.length === 0) {
      return res.status(200).json([]);
    }
    
    // Then get messages from these sessions
    const messages = await prisma.chatMessage.findMany({
      where: {
        sessionId: { in: sessionIds }
      },
      include: {
        session: {
          select: {
            title: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit
    });
    
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ message: 'Failed to fetch chat history', error: error.message });
  }
};

// Update a chat message
exports.updateChatMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, metadata } = req.body;
    
    if (!content && !metadata) {
      return res.status(400).json({ message: 'Content or metadata is required for update' });
    }
    
    // Check if message exists
    const message = await prisma.chatMessage.findUnique({
      where: { id },
      include: { session: true }
    });
    
    if (!message) {
      return res.status(404).json({ message: 'Chat message not found' });
    }
    
    // Only allow updating AI or system messages, not user messages
    if (message.role === 'user') {
      return res.status(403).json({ message: 'User messages cannot be updated' });
    }
    
    // Update the message
    const updatedData = {};
    if (content) updatedData.content = content;
    if (metadata) updatedData.metadata = metadata;
    
    const updatedMessage = await prisma.chatMessage.update({
      where: { id },
      data: updatedData
    });
    
    // Update the session's updatedAt timestamp
    await prisma.chatSession.update({
      where: { id: message.sessionId },
      data: { updatedAt: new Date() }
    });
    
    res.status(200).json(updatedMessage);
  } catch (error) {
    console.error('Error updating chat message:', error);
    res.status(500).json({ message: 'Failed to update chat message', error: error.message });
  }
};

// Delete a chat message
exports.deleteChatMessage = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if message exists
    const message = await prisma.chatMessage.findUnique({
      where: { id }
    });
    
    if (!message) {
      return res.status(404).json({ message: 'Chat message not found' });
    }
    
    // Delete the message
    await prisma.chatMessage.delete({
      where: { id }
    });
    
    // Update the session's updatedAt timestamp
    await prisma.chatSession.update({
      where: { id: message.sessionId },
      data: { updatedAt: new Date() }
    });
    
    res.status(200).json({ message: 'Chat message deleted successfully' });
  } catch (error) {
    console.error('Error deleting chat message:', error);
    res.status(500).json({ message: 'Failed to delete chat message', error: error.message });
  }
};

// Update chat session title
exports.updateChatSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { title } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    // Check if session exists
    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId }
    });
    
    if (!session) {
      return res.status(404).json({ message: 'Chat session not found' });
    }
    
    // Update session title
    const updatedSession = await prisma.chatSession.update({
      where: { id: sessionId },
      data: { title }
    });
    
    res.status(200).json(updatedSession);
  } catch (error) {
    console.error('Error updating chat session:', error);
    res.status(500).json({ message: 'Failed to update chat session', error: error.message });
  }
};

// Delete a chat session and all its messages
exports.deleteChatSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // Check if session exists
    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId }
    });
    
    if (!session) {
      return res.status(404).json({ message: 'Chat session not found' });
    }
    
    // Delete all messages in the session first
    await prisma.chatMessage.deleteMany({
      where: { sessionId }
    });
    
    // Delete the session
    await prisma.chatSession.delete({
      where: { id: sessionId }
    });
    
    res.status(200).json({ message: 'Chat session deleted successfully' });
  } catch (error) {
    console.error('Error deleting chat session:', error);
    res.status(500).json({ message: 'Failed to delete chat session', error: error.message });
  }
};