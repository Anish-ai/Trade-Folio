import React from 'react';

interface DashboardContentProps {
  portfolioValue: number;
  portfolioChange: number;
  cryptoData: {
    symbol: string;
    price: number;
    change: number;
  }[];
  watchlist: {
    symbol: string;
    name: string;
    price: number;
    change: number;
    sentiment: string;
  }[];
  news: {
    id: number;
    title: string;
    summary: string;
    sentiment: string;
    source: string;
    date: string;
  }[];
  transactions: {
    id: number;
    type: string;
    symbol: string;
    quantity: number;
    price: number;
    total: number;
    date: string;
  }[];
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
  getSentimentColor,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {/* Portfolio Summary Card */}
      <div className="xl:col-span-2 bg-[#1A2142]/70 backdrop-blur-md rounded-xl p-6 border border-[#1A2142]/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)] animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Portfolio Summary</h2>
          <div className="text-xs px-2 py-1 rounded-full bg-[#00F0FF]/10 text-[#00F0FF]">Live</div>
        </div>
        
        <div className="flex items-end gap-4">
          <div>
            <p className="text-gray-400 text-sm mb-1">Total Value</p>
            <p className="text-3xl font-bold">${portfolioValue.toLocaleString()}</p>
            <div className={`flex items-center mt-1 ${portfolioChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              <span className="text-sm font-medium">{portfolioChange >= 0 ? '+' : ''}{portfolioChange}%</span>
              <span className="text-xs ml-1">today</span>
            </div>
          </div>
          
          <div className="flex-1 relative h-28">
            {/* Simplified chart */}
            <svg width="100%" height="100%" className="absolute inset-0 z-10">
              <defs>
                <linearGradient id="portfolioGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#00F0FF" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              <path
                d="M0 80 C 40 70, 60 100, 100 60 C 140 20, 180 40, 220 30 C 260 20, 300 0, 340 10 L 340 120 L 0 120 Z"
                fill="url(#portfolioGradient)"
                opacity="0.3"
                className="animate-fade-in"
              />
              
              <path
                d="M0 80 C 40 70, 60 100, 100 60 C 140 20, 180 40, 220 30 C 260 20, 300 0, 340 10"
                fill="none"
                stroke="#00F0FF"
                strokeWidth="3"
                className="animate-draw"
              />
            </svg>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-[#12172f] rounded-lg p-3">
            <p className="text-gray-400 text-xs mb-1">Assets</p>
            <p className="text-lg font-medium">12</p>
          </div>
          <div className="bg-[#12172f] rounded-lg p-3">
            <p className="text-gray-400 text-xs mb-1">Best Performer</p>
            <div className="flex items-center">
              <span className="text-lg font-medium mr-1">TSLA</span>
              <span className="text-xs text-green-400">+8.2%</span>
            </div>
          </div>
          <div className="bg-[#12172f] rounded-lg p-3">
            <p className="text-gray-400 text-xs mb-1">PnL</p>
            <p className="text-lg font-medium text-green-400">+$1,245</p>
          </div>
        </div>
      </div>
      
      {/* AI Insights Card */}
      <div className="bg-[#1A2142]/70 backdrop-blur-md rounded-xl p-6 border border-[#1A2142]/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)] animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">AI Insights</h2>
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#FF4DED] flex items-center justify-center animate-pulse-slow">
            <span className="text-xs text-white">AI</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute -left-2 top-0 w-1 h-full bg-green-400 rounded"></div>
            <p className="text-sm">AAPL shows strong momentum with positive technical indicators, consider adding to your position.</p>
          </div>
          
          <div className="relative">
            <div className="absolute -left-2 top-0 w-1 h-full bg-yellow-400 rounded"></div>
            <p className="text-sm">Market volatility expected with upcoming Fed announcement. Consider hedging your positions.</p>
          </div>
          
          <div className="relative">
            <div className="absolute -left-2 top-0 w-1 h-full bg-blue-400 rounded"></div>
            <p className="text-sm">Based on your portfolio, consider diversifying into tech sector ETFs for balanced exposure.</p>
          </div>
        </div>
        
        <button className="w-full mt-4 py-2 rounded-lg bg-[#12172f] text-[#00F0FF] text-sm hover:bg-[#1A2142] transition-colors">
          Get More Insights
        </button>
      </div>
      
      {/* Market Overview Card */}
      <div className="bg-[#1A2142]/70 backdrop-blur-md rounded-xl p-6 border border-[#1A2142]/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)] animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Market Overview</h2>
          <div className="text-xs px-2 py-1 rounded-full bg-[#12172f] text-gray-400">US Market</div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">S&P 500</span>
            <div className="flex items-center">
              <span className="font-medium">4,380.12</span>
              <span className="text-xs text-green-400 ml-1">+0.8%</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm">NASDAQ</span>
            <div className="flex items-center">
              <span className="font-medium">14,765.32</span>
              <span className="text-xs text-green-400 ml-1">+1.2%</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm">DOW JONES</span>
            <div className="flex items-center">
              <span className="font-medium">34,190.54</span>
              <span className="text-xs text-green-400 ml-1">+0.5%</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm">VIX</span>
            <div className="flex items-center">
              <span className="font-medium">18.62</span>
              <span className="text-xs text-red-400 ml-1">-4.3%</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm">10Y TREASURY</span>
            <div className="flex items-center">
              <span className="font-medium">1.54%</span>
              <span className="text-xs text-green-400 ml-1">+0.02</span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-[#1A2142] mt-4 pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Market Sentiment</span>
            <span className="text-green-400 font-medium">Bullish</span>
          </div>
        </div>
      </div>
      
      {/* Watchlist Card */}
      <div className="xl:col-span-2 bg-[#1A2142]/70 backdrop-blur-md rounded-xl p-6 border border-[#1A2142]/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)] animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Watchlist</h2>
          <button className="text-xs px-2 py-1 rounded-full bg-[#12172f] text-gray-400 hover:text-white transition-colors">
            + Add Symbol
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-[#1A2142]">
                <th className="py-3 text-left text-sm text-gray-400">Symbol</th>
                <th className="py-3 text-left text-sm text-gray-400">Name</th>
                <th className="py-3 text-right text-sm text-gray-400">Price</th>
                <th className="py-3 text-right text-sm text-gray-400">24h Change</th>
                <th className="py-3 text-right text-sm text-gray-400">Sentiment</th>
              </tr>
            </thead>
            <tbody>
              {watchlist.map((item, index) => (
                <tr 
                  key={item.symbol}
                  className="border-b border-[#1A2142]/50 hover:bg-[#1A2142]/50 animate-fade-in-up"
                  style={{ animationDelay: `${0.1 * (index + 1)}s` }}
                >
                  <td className="py-3 text-sm font-medium">{item.symbol}</td>
                  <td className="py-3 text-sm text-gray-300">{item.name}</td>
                  <td className="py-3 text-sm text-right">${item.price.toLocaleString()}</td>
                  <td className={`py-3 text-sm text-right ${item.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {item.change >= 0 ? '+' : ''}{item.change}%
                  </td>
                  <td className="py-3 text-sm text-right">
                    <span className="inline-flex items-center">
                      {getSentimentEmoji(item.sentiment)}
                      <span className="ml-1">{item.sentiment}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Recent News Card */}
      <div className="xl:col-span-2 bg-[#1A2142]/70 backdrop-blur-md rounded-xl p-6 border border-[#1A2142]/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)] animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Recent News</h2>
          <button className="text-xs px-2 py-1 rounded-full bg-[#12172f] text-gray-400 hover:text-white transition-colors">
            View All
          </button>
        </div>
        
        <div className="space-y-4">
          {news.map((item, index) => (
            <div 
              key={item.id}
              className={`p-3 rounded-lg border-l-4 ${getSentimentColor(item.sentiment)} bg-[#12172f]/50 animate-fade-in-up`}
              style={{ animationDelay: `${0.1 * (index + 1)}s` }}
            >
              <h3 className="font-medium mb-1">{item.title}</h3>
              <p className="text-sm text-gray-400 mb-2">{item.summary}</p>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{item.source}</span>
                <span>{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Recent Activity Card */}
      <div className="xl:col-span-2 bg-[#1A2142]/70 backdrop-blur-md rounded-xl p-6 border border-[#1A2142]/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)] animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Recent Activity</h2>
          <button className="text-xs px-2 py-1 rounded-full bg-[#12172f] text-gray-400 hover:text-white transition-colors">
            View All
          </button>
        </div>
        
        <div className="space-y-4">
          {transactions.map((transaction, index) => (
            <div 
              key={transaction.id}
              className="flex items-center p-3 rounded-lg bg-[#12172f]/50 animate-fade-in-up"
              style={{ animationDelay: `${0.1 * (index + 1)}s` }}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                transaction.type === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {transaction.type === 'BUY' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              
              <div className="ml-4 flex-1">
                <p className="font-medium">{transaction.type} {transaction.quantity} {transaction.symbol}</p>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>@ ${transaction.price.toLocaleString()}</span>
                  <span>${transaction.total.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="text-gray-500 text-sm">
                {transaction.date}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Crypto Prices Card */}
      <div className="xl:col-span-2 bg-[#1A2142]/70 backdrop-blur-md rounded-xl p-6 border border-[#1A2142]/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)] animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Crypto Prices</h2>
          <button className="text-xs px-2 py-1 rounded-full bg-[#12172f] text-gray-400 hover:text-white transition-colors">
            View All
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {cryptoData.map((crypto, index) => (
            <div 
              key={crypto.symbol}
              className="bg-[#12172f]/80 p-4 rounded-lg border border-[#1A2142]/60 animate-fade-in-up"
              style={{ animationDelay: `${0.1 * (index + 1)}s` }}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#FF4DED] flex items-center justify-center text-white font-bold text-xs">
                    {crypto.symbol.charAt(0)}
                  </div>
                  <span className="ml-2 font-medium">{crypto.symbol}</span>
                </div>
                <div className={`text-xs px-2 py-1 rounded-full ${
                  crypto.change >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {crypto.change >= 0 ? '+' : ''}{crypto.change}%
                </div>
              </div>
              
              <div className="text-xl font-bold">${crypto.price.toLocaleString()}</div>
              
              <div className="relative h-8 mt-2">
                <svg width="100%" height="100%" className="absolute inset-0 z-10">
                  <path
                    d={`M0 ${20 + Math.random() * 10} C ${30 + Math.random() * 10} ${15 + Math.random() * 15}, ${60 + Math.random() * 10} ${5 + Math.random() * 15}, 100 ${10 + Math.random() * 10} C ${140 + Math.random() * 10} ${15 + Math.random() * 10}, ${180 + Math.random() * 10} ${5 + Math.random() * 5}, 220 ${10 + Math.random() * 5}`}
                    fill="none"
                    stroke={crypto.change >= 0 ? "#10b981" : "#ef4444"}
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardContent; 