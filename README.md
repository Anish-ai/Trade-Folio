## Gemini AI Integration

The platform uses Google's Gemini API for AI-powered chat, portfolio analysis, and stock recommendations. To set up the Gemini integration:

1. Get a Gemini API key from the [Google AI Studio](https://makersuite.google.com/)
2. Add your API key to the `server/.env` file:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```
3. The following AI features are available:
   - AI Assistant chat in the dashboard
   - Portfolio risk analysis
   - Personalized stock recommendations
   - Market insights and news analysis

## API Endpoints

### Chat Endpoints
- `GET /api/chat/sessions` - Get all chat sessions
- `POST /api/chat/sessions` - Create a new chat session
- `GET /api/chat/sessions/:sessionId` - Get a specific chat session
- `PUT /api/chat/sessions/:sessionId` - Update chat session title
- `DELETE /api/chat/sessions/:sessionId` - Delete a chat session
- `POST /api/chat/sessions/:sessionId/messages` - Send a message
- `GET /api/chat/sessions/:sessionId/messages` - Get all messages for a session

### AI Analysis Endpoints
- `GET /api/chat/analysis/portfolio` - Get AI portfolio analysis
- `GET /api/chat/recommendations` - Get stock recommendations 