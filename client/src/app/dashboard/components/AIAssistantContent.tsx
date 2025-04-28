import React, { useState, useEffect, useRef } from 'react';

interface AIAssistantContentProps {
  news: {
    id: number;
    title: string;
    summary: string;
    sentiment: string;
    source: string;
    date: string;
  }[];
  watchlist: {
    symbol: string;
    name: string;
    price: number;
    change: number;
    sentiment: string;
  }[];
}

const AIAssistantContent: React.FC<AIAssistantContentProps> = ({ news, watchlist }) => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'ai', content: 'Hello! I\'m your AI trading assistant. How can I help you with your investments today?' },
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Sample personalized insights
  const insights = [
    {
      id: 1,
      title: 'Portfolio Diversification',
      description: 'Your portfolio has a heavy tech concentration. Consider adding some exposure to healthcare and renewable energy sectors.',
      icon: '🔄',
      priority: 'high',
    },
    {
      id: 2,
      title: 'Risk Assessment',
      description: 'Market volatility may increase next week due to upcoming Fed announcements. Consider hedging strategies.',
      icon: '⚠️',
      priority: 'medium',
    },
    {
      id: 3,
      title: 'Tax Optimization',
      description: 'You could benefit from tax-loss harvesting on TSLA position to offset gains in AAPL.',
      icon: '📊',
      priority: 'medium',
    },
    {
      id: 4,
      title: 'Stock Rating Change',
      description: 'MSFT received an analyst upgrade today. New price target is $450 (8.4% upside).',
      icon: '📈',
      priority: 'low',
    },
  ];
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle send message
  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { type: 'user', content: input }]);
    
    // Simulate AI thinking
    setTimeout(() => {
      // Generate AI response based on user input
      let response = '';
      
      if (input.toLowerCase().includes('portfolio') && input.toLowerCase().includes('risk')) {
        response = 'Based on my analysis, your portfolio has a moderate risk level with a beta of 1.2. The tech sector represents 45% of your holdings, which slightly increases your volatility. I recommend reducing tech exposure by 10% and increasing your position in defensive sectors like consumer staples or utilities.';
      } else if (input.toLowerCase().includes('recommend') || input.toLowerCase().includes('buy')) {
        response = 'Based on your investment profile and current market conditions, you might consider these opportunities:\n\n1. NVDA - Strong momentum in AI sector, technical indicators positive\n2. ABBV - Stable dividend player with new product pipeline\n3. XLE - Energy sector ETF as inflation hedge\n\nWould you like a detailed analysis on any of these?';
      } else if (input.toLowerCase().includes('market') || input.toLowerCase().includes('outlook')) {
        response = 'The current market sentiment is cautiously bullish. Key indicators:\n\n- VIX at 18.5 (moderate volatility)\n- Treasury yields stabilizing\n- Earnings season mostly positive so far\n- Fed expected to maintain rates in next meeting\n\nTechnical analysis suggests a potential consolidation phase before next leg up.';
      } else {
        response = `I understand you're asking about "${input}". Based on your portfolio and recent market movements, I'd recommend analyzing how this fits with your overall investment strategy. Would you like me to provide more specific insights on this topic?`;
      }
      
      // Add AI response
      setMessages(prev => [...prev, { type: 'ai', content: response }]);
    }, 1000);
    
    // Clear input
    setInput('');
  };
  
  // Handle key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Toggle recording state
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    
    // Simulate voice recording result after 2 seconds
    if (!isRecording) {
      setTimeout(() => {
        setInput('What stocks should I buy based on my portfolio?');
        setIsRecording(false);
      }, 2000);
    }
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* AI Chat Interface */}
      <div className="lg:col-span-2 bg-[#1A2142]/70 backdrop-blur-md rounded-xl border border-[#1A2142]/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)] flex flex-col h-[calc(100vh-12rem)] animate-fade-in">
        {/* Chat Header */}
        <div className="p-4 border-b border-[#1A2142]">
          <div className="flex items-center">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#FF4DED] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-[#0A0F24] animate-pulse"></div>
            </div>
            <div className="ml-3">
              <h2 className="text-xl font-bold">TradingGPT</h2>
              <p className="text-sm text-gray-400">AI Trading Assistant</p>
            </div>
            <div className="ml-auto flex items-center space-x-3">
              <button className="w-8 h-8 rounded-full bg-[#12172f] flex items-center justify-center text-gray-400 hover:text-[#00F0FF] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <button className="w-8 h-8 rounded-full bg-[#12172f] flex items-center justify-center text-gray-400 hover:text-[#00F0FF] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div 
                  className={`max-w-[75%] rounded-xl p-4 ${
                    message.type === 'user'
                      ? 'bg-[#00F0FF]/20 text-white rounded-tr-none'
                      : 'bg-[#12172f] text-white rounded-tl-none'
                  }`}
                >
                  {message.type === 'ai' && (
                    <div className="flex items-center mb-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#FF4DED] flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <span className="ml-2 text-xs font-medium">TradingGPT</span>
                    </div>
                  )}
                  <p className="whitespace-pre-line text-sm">{message.content}</p>
                  <div className="mt-1 text-right text-xs text-gray-400">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* Input Area */}
        <div className="p-4 border-t border-[#1A2142]">
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask anything about your portfolio, trading strategies, or market insights..."
              className="w-full bg-[#12172f] border border-[#1A2142] rounded-xl py-3 px-4 pr-24 text-white focus:outline-none focus:ring-2 focus:ring-[#00F0FF] focus:border-[#00F0FF] min-h-[60px] max-h-32 resize-none"
              rows={2}
            ></textarea>
            <div className="absolute right-2 bottom-2 flex space-x-2">
              <button
                onClick={toggleRecording}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  isRecording
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-[#1A2142] text-gray-400 hover:text-[#00F0FF]'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!input.trim()}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  input.trim()
                    ? 'bg-gradient-to-r from-[#00F0FF] to-[#FF4DED] text-white'
                    : 'bg-[#1A2142] text-gray-400'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex justify-center mt-2">
            <div className="flex space-x-2 text-xs text-gray-400">
              <button className="px-2 py-1 rounded bg-[#12172f] hover:text-[#00F0FF] transition-colors">Portfolio Analysis</button>
              <button className="px-2 py-1 rounded bg-[#12172f] hover:text-[#00F0FF] transition-colors">Market Outlook</button>
              <button className="px-2 py-1 rounded bg-[#12172f] hover:text-[#00F0FF] transition-colors">Stock Recommendations</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* AI Insights & Market Intelligence */}
      <div className="lg:col-span-1 space-y-6">
        {/* AI Insights */}
        <div className="bg-[#1A2142]/70 backdrop-blur-md rounded-xl p-6 border border-[#1A2142]/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)] animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">AI Insights</h2>
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#FF4DED] flex items-center justify-center animate-pulse-slow">
              <span className="text-xs text-white">AI</span>
            </div>
          </div>
          
          <div className="space-y-3">
            {insights.map((insight) => (
              <div 
                key={insight.id}
                className="p-3 bg-[#12172f]/80 rounded-lg border border-[#1A2142]/60 hover:border-[#00F0FF]/30 transition-colors cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${insight.id * 0.1}s` }}
              >
                <div className="flex items-start">
                  <div className="text-2xl mr-3">{insight.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm">{insight.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        insight.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                        insight.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {insight.priority}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{insight.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 py-2 rounded-lg bg-[#12172f] text-[#00F0FF] text-sm hover:bg-[#1A2142] transition-colors">
            Get More Insights
          </button>
        </div>
        
        {/* Market News */}
        <div className="bg-[#1A2142]/70 backdrop-blur-md rounded-xl p-6 border border-[#1A2142]/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)] animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Latest News</h2>
            <button className="text-xs px-2 py-1 rounded-full bg-[#12172f] text-gray-400 hover:text-white transition-colors">
              View All
            </button>
          </div>
          
          <div className="space-y-3">
            {news.slice(0, 2).map((item) => (
              <div 
                key={item.id}
                className="bg-[#12172f]/80 p-3 rounded-lg border-l-4 border-t border-r border-b border-[#1A2142]/60 animate-fade-in-up"
                style={{ 
                  animationDelay: `${item.id * 0.1}s`,
                  borderLeftColor: item.sentiment === 'positive' ? '#10b981' : item.sentiment === 'negative' ? '#ef4444' : '#3b82f6'
                }}
              >
                <h3 className="text-sm font-medium mb-1">{item.title}</h3>
                <p className="text-xs text-gray-400 mb-2">{item.summary}</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{item.source}</span>
                  <span>{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Watchlist Summary */}
        <div className="bg-[#1A2142]/70 backdrop-blur-md rounded-xl p-6 border border-[#1A2142]/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)] animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Watchlist</h2>
            <button className="text-xs px-2 py-1 rounded-full bg-[#12172f] text-gray-400 hover:text-white transition-colors">
              + Add
            </button>
          </div>
          
          <div className="space-y-2">
            {watchlist.slice(0, 3).map((stock) => (
              <div 
                key={stock.symbol}
                className="flex justify-between items-center p-3 bg-[#12172f]/80 rounded-lg border border-[#1A2142]/60 hover:border-[#00F0FF]/30 transition-colors cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${0.1}s` }}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#FF4DED] flex items-center justify-center text-white text-xs font-bold">
                    {stock.symbol.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{stock.symbol}</p>
                    <p className="text-xs text-gray-400">{stock.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">${stock.price.toLocaleString()}</p>
                  <p className={`text-xs ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.change}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantContent;