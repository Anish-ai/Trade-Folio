import React, { useState, useRef, useEffect } from 'react';

interface AIAssistantContentProps {
  news: any[];
  watchlist: any[];
}

const AIAssistantContent: React.FC<AIAssistantContentProps> = ({ news, watchlist }) => {
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: 'Hello! I\'m your AI financial assistant. How can I help you today?',
      timestamp: new Date().toISOString()
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Sample insights based on portfolio data
  const insights = [
    { title: 'Portfolio Diversification', content: 'Your tech exposure is high at 65%. Consider adding more defensive sectors.', type: 'warning' },
    { title: 'Earnings Alert', content: 'AAPL reports earnings next week. Historical volatility suggests a 5% price move.', type: 'info' },
    { title: 'Opportunity', content: 'TSLA technical analysis shows a bullish pattern with strong momentum.', type: 'success' },
  ];
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle sending a message
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { 
      role: 'user', 
      content: inputValue,
      timestamp: new Date().toISOString()
    }]);
    
    // Simulate AI thinking
    setTimeout(() => {
      // Add AI response based on user message
      let response = '';
      const userQuestion = inputValue.toLowerCase();
      
      if (userQuestion.includes('portfolio') && userQuestion.includes('risk')) {
        response = 'Based on your current portfolio allocation, your risk level is moderate. Your exposure to technology stocks is 65%, which is relatively high. To reduce risk, consider diversifying into defensive sectors like utilities or consumer staples.';
      } else if (userQuestion.includes('buy') && userQuestion.includes('tesla')) {
        response = 'Tesla (TSLA) shows strong technical indicators with a bullish trend. My analysis indicates a buy signal with a price target of $950 over the next 30 days. However, be aware of high volatility.';
      } else if (userQuestion.includes('market') && userQuestion.includes('outlook')) {
        response = 'The market outlook is cautiously positive. Economic indicators show moderate growth with inflation concerns. The tech sector continues to outperform broader indices, while financial stocks may face headwinds due to interest rate uncertainty.';
      } else {
        response = 'I understand you\'re asking about "' + inputValue + '". Let me analyze this for you. Based on current market conditions and your portfolio, I recommend focusing on quality companies with strong balance sheets and consistent revenue growth.';
      }
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response,
        timestamp: new Date().toISOString()
      }]);
    }, 1500);
    
    // Clear input
    setInputValue('');
  };
  
  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Toggle voice recording
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      // Simulate receiving voice command after 2 seconds
      setTimeout(() => {
        setInputValue('What is the market outlook for the tech sector?');
        setIsRecording(false);
      }, 2000);
    }
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      {/* Main AI Chat Panel */}
      <div className="lg:col-span-2 bg-[#1A2142]/70 backdrop-blur-md rounded-xl border border-[#1A2142]/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col h-[calc(100vh-220px)]">
        <div className="p-6 border-b border-[#1A2142] bg-gradient-to-r from-[#0F1428] to-[#1A2142]">
          <div className="flex items-center">
            <div className="relative w-12 h-12 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#FF4DED] flex items-center justify-center">
              <div className="absolute w-16 h-16 rounded-full border-2 border-[#00F0FF] animate-ping-slow opacity-20"></div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-bold">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-[#FF4DED]">
                  AI Assistant
                </span>
              </h2>
              <p className="text-gray-400 text-sm">Powered by advanced financial models</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button className="p-2 bg-[#0F1428] rounded-lg border border-[#1A2142] text-gray-400 hover:text-white transition-colors transform hover:scale-105 duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
              <button className="p-2 bg-[#0F1428] rounded-lg border border-[#1A2142] text-gray-400 hover:text-white transition-colors transform hover:scale-105 duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-[#0F1428]/50 to-[#0A0F24]/50">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-xl p-4 animate-fade-in-up ${
                  message.role === 'user' 
                    ? 'bg-[#1A2142] text-white rounded-tr-none border border-[#00F0FF]/30' 
                    : 'bg-gradient-to-br from-[#0F1428] to-[#1A2142] text-white rounded-tl-none border border-[#FF4DED]/30'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-sm">{message.content}</div>
                <div className="text-right mt-1">
                  <span className="text-xs text-gray-400">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input Area */}
        <div className="p-4 border-t border-[#1A2142] bg-[#0F1428]">
          <div className="flex items-center">
            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask me anything about finance, trading, or your portfolio..."
                className="w-full bg-[#1A2142]/70 border border-[#1A2142] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00F0FF] min-h-[60px] max-h-[120px] resize-none pr-10"
              />
              <button 
                onClick={toggleRecording}
                className={`absolute right-3 top-3 p-2 rounded-full ${
                  isRecording 
                    ? 'bg-red-500/20 text-red-400 animate-pulse' 
                    : 'bg-[#1A2142] text-gray-400 hover:text-white'
                } transition-colors`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
            </div>
            <button
              onClick={handleSendMessage}
              className="ml-2 p-3 bg-gradient-to-r from-[#00F0FF] to-[#FF4DED] rounded-full text-white transform hover:scale-105 transition-transform duration-200 shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
          <div className="flex mt-2 text-xs text-gray-400">
            <span>Pro Tip: Try asking about market trends, portfolio analysis, or specific stock recommendations</span>
          </div>
        </div>
      </div>
      
      {/* Right Column - Insights and Suggestions */}
      <div className="space-y-6">
        {/* AI Insights */}
        <div className="bg-[#1A2142]/70 backdrop-blur-md rounded-xl p-6 relative border border-[#1A2142]/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/5 to-[#FF4DED]/5 rounded-xl"></div>
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-4">Personalized Insights</h2>
            
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg border animate-fade-in-up transform hover:translate-y-[-5px] transition-all duration-300 ${
                    insight.type === 'warning' 
                      ? 'border-yellow-500/50 bg-yellow-500/10' 
                      : insight.type === 'success'
                        ? 'border-green-500/50 bg-green-500/10'
                        : 'border-blue-500/50 bg-blue-500/10'
                  }`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="flex items-center mb-2">
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        insight.type === 'warning'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : insight.type === 'success'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      {insight.type === 'warning' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      ) : insight.type === 'success' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    <h3 
                      className={`ml-2 font-medium ${
                        insight.type === 'warning'
                          ? 'text-yellow-400'
                          : insight.type === 'success'
                            ? 'text-green-400'
                            : 'text-blue-400'
                      }`}
                    >
                      {insight.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-300">{insight.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Frequently Asked Questions */}
        <div className="bg-[#1A2142]/70 backdrop-blur-md rounded-xl p-6 relative border border-[#1A2142]/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF4DED]/5 to-transparent rounded-xl"></div>
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-4">Try Asking Me</h2>
            
            <div className="space-y-2">
              {[
                "What is my portfolio risk level?",
                "Should I buy Tesla stock?",
                "What is the market outlook for tech?",
                "How can I diversify my investments?",
                "Analyze my recent trading performance"
              ].map((question, index) => (
                <button
                  key={index}
                  className="w-full text-left p-3 bg-[#0F1428]/80 rounded-lg border border-[#1A2142] hover:border-[#FF4DED]/50 hover:bg-[#0F1428] transition-colors text-sm"
                  onClick={() => setInputValue(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Latest News Card */}
        <div className="bg-[#1A2142]/70 backdrop-blur-md rounded-xl p-6 relative border border-[#1A2142]/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#00F0FF]/5 rounded-xl"></div>
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-4">Latest Market News</h2>
            
            {news.length > 0 && (
              <div className="bg-[#0F1428]/80 p-4 rounded-lg border border-green-500/30 hover:border-green-500/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-white">{news[0].title}</h3>
                  <span className="text-xs text-gray-400">{news[0].source}</span>
                </div>
                <p className="text-sm text-gray-300 mb-2">{news[0].summary}</p>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">{news[0].date}</span>
                  <button className="text-[#00F0FF] hover:underline">Ask about this</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantContent; 