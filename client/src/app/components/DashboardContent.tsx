import React from 'react';

interface DashboardContentProps {
  portfolioValue: number;
  portfolioChange: number;
  cryptoData: any[];
  watchlist: any[];
  news: any[];
  transactions: any[];
  getSentimentEmoji: (sentiment: string) => string;
  getSentimentColor: (sentiment: string) => string;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  portfolioValue,
  portfolioChange,
  cryptoData,
  watchlist,
  news,
  transactions,
  getSentimentEmoji,
  getSentimentColor
}) => {
  return (
    <>
      {/* Portfolio Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2 bg-[#1A2142]/70 backdrop-blur-md rounded-xl p-6 relative overflow-hidden border border-[#1A2142]/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)] transform hover:scale-[1.01] transition-transform duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/5 to-[#FF4DED]/5"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-[#FF4DED]">Portfolio</span>
              <span className="ml-2">Overview</span>
              <span className="relative flex h-3 w-3 ml-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F0FF] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00F0FF]"></span>
              </span>
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-[#0F1428]/80 p-4 rounded-lg border border-[#1A2142] transform hover:translate-y-[-5px] transition-transform duration-300">
                <p className="text-sm text-gray-400 mb-1">Total Value</p>
                <p className="text-2xl font-bold">${portfolioValue.toLocaleString()}</p>
              </div>
              <div className="bg-[#0F1428]/80 p-4 rounded-lg border border-[#1A2142] transform hover:translate-y-[-5px] transition-transform duration-300">
                <p className="text-sm text-gray-400 mb-1">24h Change</p>
                <p className={`text-2xl font-bold ${portfolioChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {portfolioChange >= 0 ? '+' : ''}{portfolioChange}%
                </p>
              </div>
              <div className="bg-[#0F1428]/80 p-4 rounded-lg border border-[#1A2142] transform hover:translate-y-[-5px] transition-transform duration-300">
                <p className="text-sm text-gray-400 mb-1">Assets</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <div className="bg-[#0F1428]/80 p-4 rounded-lg border border-[#1A2142] transform hover:translate-y-[-5px] transition-transform duration-300">
                <p className="text-sm text-gray-400 mb-1">AI Score</p>
                <p className="text-2xl font-bold text-[#00F0FF]">85/100</p>
              </div>
            </div>
            
            {/* Portfolio Chart Placeholder */}
            <div className="h-64 bg-[#0F1428]/80 rounded-lg relative overflow-hidden border border-[#1A2142]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute w-full h-full">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i}
                      className="absolute rounded-full opacity-10"
                      style={{
                        width: `${Math.random() * 200 + 50}px`,
                        height: `${Math.random() * 200 + 50}px`,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        background: `rgba(${Math.random() * 100}, ${Math.random() * 150 + 100}, ${Math.random() * 255}, 0.5)`,
                      }}
                    />
                  ))}
                </div>
                <p className="text-gray-400 relative z-10">Interactive chart will be displayed here</p>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1/2 pointer-events-none">
                <svg viewBox="0 0 1000 200" preserveAspectRatio="none" className="w-full h-full">
                  <path 
                    d="M0,200 L0,100 C50,80 100,120 150,100 C200,80 250,140 300,130 C350,120 400,60 450,50 C500,40 550,90 600,80 C650,70 700,30 750,20 C800,10 850,50 900,40 C950,30 1000,10 1000,10 L1000,200 Z" 
                    fill="url(#grad)" 
                    opacity="0.2"
                  />
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{ stopColor: "#00F0FF", stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: "#00F0FF", stopOpacity: 0 }} />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="absolute inset-0 pointer-events-none">
                <svg viewBox="0 0 1000 200" preserveAspectRatio="none" className="w-full h-full">
                  <path 
                    d="M0,100 C50,80 100,120 150,100 C200,80 250,140 300,130 C350,120 400,60 450,50 C500,40 550,90 600,80 C650,70 700,30 750,20 C800,10 850,50 900,40 C950,30 1000,10 1000,10" 
                    fill="none" 
                    stroke="#00F0FF" 
                    strokeWidth="2"
                    className="animate-dash"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* AI Assistant Section */}
        <div className="bg-[#1A2142]/70 backdrop-blur-md rounded-xl p-6 relative overflow-hidden border border-[#1A2142]/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)] transform hover:scale-[1.01] transition-transform duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF4DED]/5 to-[#00F0FF]/5"></div>
          <div className="relative z-10">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#FF4DED] flex items-center justify-center relative">
                <div className="absolute w-14 h-14 rounded-full border-2 border-[#FF4DED] animate-ping-slow opacity-20"></div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold ml-3">AI Assistant</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-[#0F1428]/80 p-3 rounded-lg border border-[#1A2142] transform hover:translate-y-[-5px] transition-transform duration-300">
                <p className="text-sm text-gray-400 mb-1">AI Recommendation</p>
                <p className="text-green-400 font-medium">Consider buying TSLA - promising technical setup</p>
              </div>
              
              <div className="bg-[#0F1428]/80 p-3 rounded-lg border border-[#1A2142] transform hover:translate-y-[-5px] transition-transform duration-300">
                <p className="text-sm text-gray-400 mb-1">Market Sentiment</p>
                <p className="font-medium">Overall bullish pattern across tech sector</p>
              </div>
              
              <div className="bg-[#0F1428]/80 p-3 rounded-lg border border-[#1A2142] transform hover:translate-y-[-5px] transition-transform duration-300">
                <p className="text-sm text-gray-400 mb-1">Risk Alert</p>
                <p className="text-amber-400 font-medium">High volatility expected next week</p>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Ask AI anything..." 
                  className="w-full bg-[#0F1428]/80 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0FF] border border-[#1A2142]"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-[#00F0FF] hover:text-white transition-colors transform hover:scale-110 duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Watchlist Section */}
        <div className="bg-[#1A2142]/70 backdrop-blur-md rounded-xl p-6 relative overflow-hidden border border-[#1A2142]/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)] transform hover:scale-[1.01] transition-transform duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/5 to-transparent"></div>
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span>Smart Watchlist</span>
              <div className="ml-2 w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            </h2>
            
            <div className="space-y-3">
              {watchlist.map((stock) => (
                <div key={stock.symbol} className="bg-[#0F1428]/80 p-3 rounded-lg hover:bg-[#0F1428] transition-all cursor-pointer border border-[#1A2142] transform hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center">
                        <span className="font-bold">{stock.symbol}</span>
                        <span className="ml-2 text-sm text-gray-400">{stock.name}</span>
                        <span className="ml-2 text-xl" title={stock.sentiment}>{getSentimentEmoji(stock.sentiment)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${stock.price}</p>
                      <p className={`text-sm ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {stock.change >= 0 ? '+' : ''}{stock.change}%
                      </p>
                    </div>
                  </div>
                  
                  {/* Sparkline Placeholder */}
                  <div className="h-6 mt-2">
                    <svg viewBox="0 0 100 20" className="w-full h-full">
                      <path 
                        d={`M0,10 ${[...Array(20)].map((_, i) => `L${i * 5},${10 + (Math.random() * 6 - 3)}`).join(' ')}`} 
                        fill="none" 
                        stroke={stock.change >= 0 ? "#22C55E" : "#EF4444"} 
                        strokeWidth="1"
                        className="animate-draw"
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-4 bg-[#0F1428]/80 hover:bg-[#0F1428] text-[#00F0FF] py-2 rounded-lg transition-all border border-[#1A2142] hover:border-[#00F0FF] hover:shadow-[0_0_10px_rgba(0,240,255,0.3)]">
              Add Asset +
            </button>
          </div>
        </div>
        
        {/* News & Sentiment Feed */}
        <div className="bg-[#1A2142]/70 backdrop-blur-md rounded-xl p-6 relative overflow-hidden border border-[#1A2142]/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)] transform hover:scale-[1.01] transition-transform duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF4DED]/5 to-transparent"></div>
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4DED] to-[#00F0FF]">AI-Curated</span>
              <span className="ml-1">News</span>
            </h2>
            
            <div className="space-y-4">
              {news.map((item) => (
                <div 
                  key={item.id} 
                  className={`bg-[#0F1428]/80 p-4 rounded-lg border-l-4 ${getSentimentColor(item.sentiment)} border-t border-r border-b border-[#1A2142] transform hover:-translate-y-1 transition-transform duration-300 hover:shadow-[0_5px_15px_rgba(0,0,0,0.2)]`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{item.title}</h3>
                    <span className="text-xs text-gray-400">{item.source}</span>
                  </div>
                  <p className="text-sm text-gray-300">{item.summary}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-xs text-gray-400">{item.date}</span>
                    <button className="text-[#00F0FF] text-sm hover:text-[#FF4DED] transition-colors">Read more</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Transaction History */}
        <div className="bg-[#1A2142]/70 backdrop-blur-md rounded-xl p-6 relative overflow-hidden border border-[#1A2142]/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)] transform hover:scale-[1.01] transition-transform duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#00F0FF]/5"></div>
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
            
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div key={tx.id} className="bg-[#0F1428]/80 p-3 rounded-lg border border-[#1A2142] transform hover:-translate-y-1 transition-transform duration-300 hover:shadow-[0_5px_15px_rgba(0,0,0,0.2)]">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.type === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {tx.type === 'BUY' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">{tx.symbol}</p>
                        <p className="text-sm text-gray-400">{tx.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${tx.total.toLocaleString()}</p>
                      <p className="text-sm text-gray-400">{tx.quantity} × ${tx.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-4 bg-gradient-to-r from-[#00F0FF] to-[#FF4DED] text-white py-2 rounded-lg hover:opacity-90 transition-opacity transform hover:scale-[1.02] duration-300 shadow-[0_4px_10px_rgba(0,0,0,0.3)]">
              New Transaction
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardContent; 