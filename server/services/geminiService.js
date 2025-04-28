const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API with your API key
const geminiApiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(geminiApiKey);

// Default model
const DEFAULT_MODEL = 'gemini-1.5-pro';

/**
 * Generate a response using Gemini AI
 * 
 * @param {string} prompt - The user's message
 * @param {Array} chatHistory - Previous messages in the conversation
 * @param {Object} options - Additional options for the generation
 * @returns {Promise<string>} The generated response
 */
async function generateResponse(prompt, chatHistory = [], options = {}) {
  try {
    // Set up the model
    const model = genAI.getGenerativeModel({
      model: options.model || DEFAULT_MODEL,
    });

    // Format the chat history for Gemini
    const formattedHistory = chatHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    // Start a chat session
    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        temperature: options.temperature || 0.7,
        topK: options.topK || 40,
        topP: options.topP || 0.95,
        maxOutputTokens: options.maxTokens || 1024,
      },
    });

    // Generate a response
    const result = await chat.sendMessage(prompt);
    const response = result.response.text();
    
    return response;
  } catch (error) {
    console.error('Error generating response from Gemini:', error);
    throw new Error('Failed to generate AI response');
  }
}

/**
 * Analyze portfolio risk using Gemini AI
 * 
 * @param {Object} portfolioData - The user's portfolio data
 * @returns {Promise<Object>} Analysis of the portfolio
 */
async function analyzePortfolioRisk(portfolioData) {
  try {
    const model = genAI.getGenerativeModel({ model: DEFAULT_MODEL });
    
    const prompt = `
      Analyze the following investment portfolio and provide risk assessment:
      
      Portfolio Value: $${portfolioData.totalValue}
      Holdings: ${JSON.stringify(portfolioData.holdings)}
      
      Provide an analysis with the following:
      1. Overall risk level (Low, Medium, High)
      2. Diversification assessment
      3. Sector concentration risks
      4. Top 3 recommendations to optimize the portfolio
      
      Format the response as a JSON object with keys: riskLevel, diversification, sectorRisks, and recommendations.
    `;
    
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    try {
      // Try to parse as JSON
      return JSON.parse(response);
    } catch (e) {
      // If it's not valid JSON, return as text
      return { analysis: response };
    }
  } catch (error) {
    console.error('Error analyzing portfolio with Gemini:', error);
    throw new Error('Failed to analyze portfolio');
  }
}

/**
 * Get stock recommendations using Gemini AI
 * 
 * @param {Object} userData - User data including preferences and current portfolio
 * @returns {Promise<Array>} List of recommended stocks
 */
async function getStockRecommendations(userData) {
  try {
    const model = genAI.getGenerativeModel({ model: DEFAULT_MODEL });
    
    const prompt = `
      Based on the following user profile and market conditions, recommend 5 stocks:
      
      User Profile:
      - Risk Tolerance: ${userData.riskTolerance || 'Medium'}
      - Investment Horizon: ${userData.investmentHorizon || 'Long term'}
      - Current Portfolio: ${JSON.stringify(userData.currentHoldings || [])}
      
      Provide recommendations with the following format as a JSON array:
      [
        {
          "symbol": "AAPL",
          "name": "Apple Inc.",
          "reasoning": "Strong fundamentals and growth potential",
          "fitScore": 85
        }
      ]
    `;
    
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    try {
      // Try to parse as JSON
      return JSON.parse(response);
    } catch (e) {
      // If not valid JSON, return structured format
      return { recommendations: response };
    }
  } catch (error) {
    console.error('Error getting stock recommendations from Gemini:', error);
    throw new Error('Failed to get stock recommendations');
  }
}

module.exports = {
  generateResponse,
  analyzePortfolioRisk,
  getStockRecommendations
}; 