const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const geminiService = require('../services/geminiService');

// Get all chat sessions for a user
exports.getChatSessions = async (req, res) => {
  try {
    const userId = req.user.id;
    const chatSessions = await prisma.chatSession.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: {
          select: { messages: true }
        }
      }
    });
    
    res.json(chatSessions);
  } catch (error) {
    console.error('Error fetching chat sessions:', error);
    res.status(500).json({ error: 'Failed to fetch chat sessions' });
  }
};

// Get a specific chat session with messages
exports.getChatSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;
    
    const chatSession = await prisma.chatSession.findUnique({
      where: { 
        id: sessionId,
        userId
      },
      include: { messages: true }
    });
    
    if (!chatSession) {
      return res.status(404).json({ error: 'Chat session not found' });
    }
    
    res.json(chatSession);
  } catch (error) {
    console.error('Error fetching chat session:', error);
    res.status(500).json({ error: 'Failed to fetch chat session' });
  }
};

// Create a new chat session
exports.createChatSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title } = req.body;
    
    const chatSession = await prisma.chatSession.create({
      data: {
        title: title || 'New Chat',
        user: { connect: { id: userId } }
      }
    });
    
    res.status(201).json(chatSession);
  } catch (error) {
    console.error('Error creating chat session:', error);
    res.status(500).json({ error: 'Failed to create chat session' });
  }
};

// Update chat session title
exports.updateChatSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;
    const { title } = req.body;
    
    const chatSession = await prisma.chatSession.findUnique({
      where: { 
        id: sessionId,
        userId 
      }
    });
    
    if (!chatSession) {
      return res.status(404).json({ error: 'Chat session not found' });
    }
    
    const updatedChatSession = await prisma.chatSession.update({
      where: { id: sessionId },
      data: { title }
    });
    
    res.json(updatedChatSession);
  } catch (error) {
    console.error('Error updating chat session:', error);
    res.status(500).json({ error: 'Failed to update chat session' });
  }
};

// Delete a chat session
exports.deleteChatSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;
    
    const chatSession = await prisma.chatSession.findUnique({
      where: { 
        id: sessionId,
        userId 
      }
    });
    
    if (!chatSession) {
      return res.status(404).json({ error: 'Chat session not found' });
    }
    
    // Delete all messages in the chat session
    await prisma.chatMessage.deleteMany({
      where: { chatSessionId: sessionId }
    });
    
    // Delete the chat session
    await prisma.chatSession.delete({
      where: { id: sessionId }
    });
    
    res.json({ message: 'Chat session deleted successfully' });
  } catch (error) {
    console.error('Error deleting chat session:', error);
    res.status(500).json({ error: 'Failed to delete chat session' });
  }
};

// Send a message in a chat session
exports.sendMessage = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;
    const { content, role = 'user' } = req.body;
    
    const chatSession = await prisma.chatSession.findUnique({
      where: { 
        id: sessionId,
        userId 
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });
    
    if (!chatSession) {
      return res.status(404).json({ error: 'Chat session not found' });
    }
    
    // Save the user message
    const message = await prisma.chatMessage.create({
      data: {
        content,
        role,
        chatSession: { connect: { id: sessionId } }
      }
    });
    
    // Update session lastActivity
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { updatedAt: new Date() }
    });
    
    // If user message, generate AI response using Gemini
    if (role === 'user') {
      try {
        // Get user's portfolio data for context
        const userPortfolio = await prisma.portfolio.findFirst({
          where: { userId },
          include: {
            holdings: {
              include: {
                stock: true
              }
            }
          }
        });
        
        // Get chat history for context
        const chatHistory = chatSession.messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }));
        
        // Generate response with Gemini
        const aiResponseContent = await geminiService.generateResponse(
          content,
          chatHistory,
          { 
            temperature: 0.7,
            maxTokens: 1024
          }
        );
        
        // Save AI response to database
        const aiResponse = await prisma.chatMessage.create({
          data: {
            content: aiResponseContent,
            role: 'assistant',
            chatSession: { connect: { id: sessionId } }
          }
        });
        
        res.status(201).json({ userMessage: message, aiResponse });
      } catch (error) {
        console.error('Error generating AI response:', error);
        
        // If Gemini fails, use fallback response
        const fallbackResponse = await prisma.chatMessage.create({
          data: {
            content: `I apologize, but I'm having trouble processing your request right now. Please try again later.',
            role: 'assistant`,
            chatSession: { connect: { id: sessionId } }
          }
        });
        
        res.status(201).json({ 
          userMessage: message, 
          aiResponse: fallbackResponse,
          warning: 'Used fallback response due to AI service error'
        });
      }
    } else {
      res.status(201).json(message);
    }
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

// Get messages from a chat session with pagination
exports.getMessages = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;
    
    const chatSession = await prisma.chatSession.findUnique({
      where: { 
        id: sessionId,
        userId 
      }
    });
    
    if (!chatSession) {
      return res.status(404).json({ error: 'Chat session not found' });
    }
    
    const messages = await prisma.chatMessage.findMany({
      where: { chatSessionId: sessionId },
      orderBy: { createdAt: 'asc' }
    });
    
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// Portfolio analysis using Gemini
exports.analyzePortfolio = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get the user's portfolio
    const portfolio = await prisma.portfolio.findFirst({
      where: { userId },
      include: {
        holdings: {
          include: {
            stock: true
          }
        }
      }
    });
    
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    
    // Process portfolio data for analysis
    const portfolioData = {
      totalValue: portfolio.holdings.reduce((sum, holding) => {
        return sum + (holding.quantity * holding.stock.currentPrice);
      }, 0),
      holdings: portfolio.holdings.map(holding => ({
        symbol: holding.stock.symbol,
        name: holding.stock.name,
        quantity: holding.quantity,
        value: holding.quantity * holding.stock.currentPrice,
        sector: holding.stock.sector
      }))
    };
    
    // Get analysis from Gemini
    const analysis = await geminiService.analyzePortfolioRisk(portfolioData);
    
    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing portfolio:', error);
    res.status(500).json({ error: 'Failed to analyze portfolio' });
  }
};

// Stock recommendations using Gemini
exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const { riskTolerance, investmentHorizon } = req.query;
    
    // Get user profile and portfolio
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
    
    if (!user || !user.portfolio) {
      return res.status(404).json({ error: 'User or portfolio not found' });
    }
    
    // Format data for Gemini
    const userData = {
      riskTolerance: riskTolerance || user.profile?.riskTolerance || 'Medium',
      investmentHorizon: investmentHorizon || user.profile?.investmentHorizon || 'Long term',
      currentHoldings: user.portfolio.holdings.map(holding => ({
        symbol: holding.stock.symbol,
        name: holding.stock.name,
        quantity: holding.quantity,
        sector: holding.stock.sector
      }))
    };
    
    // Get recommendations from Gemini
    const recommendations = await geminiService.getStockRecommendations(userData);
    
    res.json(recommendations);
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ error: 'Failed to get stock recommendations' });
  }
}; 