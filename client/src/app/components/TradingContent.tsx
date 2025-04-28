import React, { useState, useEffect, useRef } from 'react';

interface TradingContentProps {
  cryptoData: {
    symbol: string;
    price: number;
    change: number;
  }[];
}

const TradingContent: React.FC<TradingContentProps> = ({ cryptoData }) => {
  const [selectedCrypto, setSelectedCrypto] = useState(cryptoData[0]);
  const [orderType, setOrderType] = useState('limit');
  const [orderSide, setOrderSide] = useState('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [timeframe, setTimeframe] = useState('1D');
  const chartRef = useRef<HTMLDivElement>(null);
  const [orderHistory, setOrderHistory] = useState([
    { id: 1, type: 'BUY', symbol: 'BTC', amount: 0.25, price: 65230, total: 16307.5, status: 'Completed', time: '2023-04-03 14:25:36' },
    { id: 2, type: 'SELL', symbol: 'ETH', amount: 2.5, price: 3105, total: 7762.5, status: 'Completed', time: '2023-04-03 10:15:22' },
    { id: 3, type: 'BUY', symbol: 'SOL', amount: 15, price: 142, total: 2130, status: 'Pending', time: '2023-04-03 15:45:11' },
  ]);
  
  const [orderBook, setOrderBook] = useState({
    asks: [
      { price: 68550, amount: 1.24 },
      { price: 68525, amount: 0.89 },
      { price: 68510, amount: 2.35 },
      { price: 68495, amount: 1.65 },
      { price: 68480, amount: 3.12 },
    ],
    bids: [
      { price: 68470, amount: 2.78 },
      { price: 68455, amount: 1.93 },
      { price: 68440, amount: 4.21 },
      { price: 68425, amount: 0.92 },
      { price: 68410, amount: 3.45 },
    ]
  });

  // Generate mock chart data
  const generateChartData = () => {
    if (!chartRef.current) return;
    
    const width = chartRef.current.clientWidth;
    const height = 300;
    const points = 100;
    const volatility = 0.01;
    
    let path = '';
    let startPrice = selectedCrypto.price;
    
    for (let i = 0; i < points; i++) {
      const x = (i / (points - 1)) * width;
      let randomChange = (Math.random() - 0.5) * volatility;
      if (i > points * 0.7) {
        // Trend upward toward the end
        randomChange += 0.002;
      } else if (i > points * 0.3 && i < points * 0.5) {
        // Trend downward in the middle
        randomChange -= 0.003;
      }
      
      startPrice = startPrice * (1 + randomChange);
      const normalizedPrice = 1 - ((startPrice - startPrice * 0.95) / (startPrice * 1.05 - startPrice * 0.95));
      const y = normalizedPrice * height;
      
      if (i === 0) {
        path = `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    }
    
    return path;
  };

  useEffect(() => {
    // Set price field to current price when crypto changes
    setPrice(selectedCrypto.price.toString());
  }, [selectedCrypto]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate order placement
    alert(`${orderSide.toUpperCase()} order placed: ${amount} ${selectedCrypto.symbol} at $${price}`);
  };

  const chartPath = generateChartData();

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Chart Section */}
      <div className="xl:col-span-2 bg-[#1A2142]/70 backdrop-blur-md rounded-xl p-6 border border-[#1A2142]/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              {cryptoData.map((crypto) => (
                <button
                  key={crypto.symbol}
                  onClick={() => setSelectedCrypto(crypto)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    selectedCrypto.symbol === crypto.symbol
                      ? 'bg-[#00F0FF]/20 text-[#00F0FF] shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                      : 'bg-[#1A2142] text-gray-400 hover:bg-[#1A2142]/80'
                  }`}
                >
                  {crypto.symbol}
                </button>
              ))}
            </div>
            <div className="flex items-center">
              <span className="text-2xl font-bold">${selectedCrypto.price.toLocaleString()}</span>
              <span className={`ml-2 text-sm ${selectedCrypto.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {selectedCrypto.change >= 0 ? '+' : ''}{selectedCrypto.change}%
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            {['5m', '15m', '1H', '4H', '1D', '1W'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded-lg text-xs transition-all ${
                  timeframe === tf
                    ? 'bg-[#00F0FF]/20 text-[#00F0FF]'
                    : 'bg-[#1A2142] text-gray-400 hover:bg-[#1A2142]/80'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
        
        {/* Chart */}
        <div className="flex-1 w-full h-80 relative" ref={chartRef}>
          <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
            {[...Array(16)].map((_, i) => (
              <div key={i} className="border-[0.5px] border-[#3A4374]/20" />
            ))}
          </div>
          
          <svg width="100%" height="100%" className="absolute inset-0 z-10">
            <defs>
              <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#00F0FF" stopOpacity="0" />
              </linearGradient>
            </defs>
            
            {chartPath && (
              <>
                <path
                  d={chartPath}
                  fill="none"
                  stroke="#00F0FF"
                  strokeWidth="3"
                  className="animate-draw"
                />
                
                <path
                  d={`${chartPath} V 300 H 0 Z`}
                  fill="url(#chartGradient)"
                  opacity="0.3"
                  className="animate-fade-in"
                />
              </>
            )}
          </svg>
          
          {/* Chart controls */}
          <div className="absolute top-2 right-2 flex gap-2">
            <button className="w-8 h-8 rounded-lg bg-[#1A2142] flex items-center justify-center text-gray-400 hover:text-[#00F0FF] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button className="w-8 h-8 rounded-lg bg-[#1A2142] flex items-center justify-center text-gray-400 hover:text-[#00F0FF] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button className="w-8 h-8 rounded-lg bg-[#1A2142] flex items-center justify-center text-gray-400 hover:text-[#00F0FF] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Order Panel */}
      <div className="xl:col-span-1 grid grid-rows-2 gap-6">
        {/* Order Form */}
        <div className="bg-[#1A2142]/70 backdrop-blur-md rounded-xl p-6 border border-[#1A2142]/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
          <h2 className="text-xl font-bold mb-4">Place Order</h2>
          
          <div className="flex mb-4">
            <button
              onClick={() => setOrderSide('buy')}
              className={`flex-1 py-2 rounded-l-lg transition-all ${
                orderSide === 'buy'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-[#1A2142] text-gray-400 border border-[#1A2142]'
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setOrderSide('sell')}
              className={`flex-1 py-2 rounded-r-lg transition-all ${
                orderSide === 'sell'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-[#1A2142] text-gray-400 border border-[#1A2142]'
              }`}
            >
              Sell
            </button>
          </div>
          
          <div className="flex mb-4">
            <button
              onClick={() => setOrderType('limit')}
              className={`flex-1 py-2 text-sm transition-all ${
                orderType === 'limit'
                  ? 'bg-[#00F0FF]/20 text-[#00F0FF] border-b-2 border-[#00F0FF]'
                  : 'bg-transparent text-gray-400 border-b border-[#1A2142]'
              }`}
            >
              Limit
            </button>
            <button
              onClick={() => setOrderType('market')}
              className={`flex-1 py-2 text-sm transition-all ${
                orderType === 'market'
                  ? 'bg-[#00F0FF]/20 text-[#00F0FF] border-b-2 border-[#00F0FF]'
                  : 'bg-transparent text-gray-400 border-b border-[#1A2142]'
              }`}
            >
              Market
            </button>
            <button
              onClick={() => setOrderType('stop')}
              className={`flex-1 py-2 text-sm transition-all ${
                orderType === 'stop'
                  ? 'bg-[#00F0FF]/20 text-[#00F0FF] border-b-2 border-[#00F0FF]'
                  : 'bg-transparent text-gray-400 border-b border-[#1A2142]'
              }`}
            >
              Stop
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-400 text-sm mb-1">Amount ({selectedCrypto.symbol})</label>
              <div className="relative">
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-[#12172f] border border-[#1A2142] rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-[#00F0FF] focus:border-[#00F0FF]"
                  placeholder="0.00"
                />
                <button
                  type="button"
                  className="absolute right-1 top-1 bg-[#1A2142] px-2 py-1 rounded text-xs text-gray-400 hover:bg-[#1A2142]/80"
                  onClick={() => setAmount("0.1")}
                >
                  Max
                </button>
              </div>
            </div>
            
            {orderType !== 'market' && (
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-1">Price (USD)</label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-[#12172f] border border-[#1A2142] rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-[#00F0FF] focus:border-[#00F0FF]"
                  placeholder="0.00"
                />
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-gray-400 text-sm mb-1">Total (USD)</label>
              <input
                type="text"
                value={amount && price ? (parseFloat(amount) * parseFloat(price)).toFixed(2) : ''}
                disabled
                className="w-full bg-[#12172f] border border-[#1A2142] rounded-lg py-2 px-3 text-white"
                placeholder="0.00"
              />
            </div>
            
            <button
              type="submit"
              className={`w-full py-3 rounded-lg font-bold transition-all ${
                orderSide === 'buy'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg shadow-green-500/20'
                  : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/20'
              }`}
            >
              {orderSide === 'buy' ? 'Buy' : 'Sell'} {selectedCrypto.symbol}
            </button>
          </form>
        </div>
        
        {/* Order Book */}
        <div className="bg-[#1A2142]/70 backdrop-blur-md rounded-xl p-6 border border-[#1A2142]/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)] overflow-hidden">
          <h2 className="text-xl font-bold mb-4">Order Book</h2>
          
          <div className="mb-2">
            <div className="flex text-gray-500 text-xs mb-1">
              <span className="w-1/2">Price (USD)</span>
              <span className="w-1/2 text-right">Amount ({selectedCrypto.symbol})</span>
            </div>
            
            {/* Asks (Sell Orders) */}
            <div className="space-y-1 mb-3">
              {orderBook.asks.map((order, index) => (
                <div
                  key={`ask-${index}`}
                  className="flex items-center text-sm relative overflow-hidden animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div
                    className="absolute inset-y-0 right-0 bg-red-500/10"
                    style={{ width: `${(order.amount / 5) * 100}%` }}
                  ></div>
                  <span className="w-1/2 text-red-400 z-10">${order.price.toLocaleString()}</span>
                  <span className="w-1/2 text-right z-10">{order.amount}</span>
                </div>
              ))}
            </div>
            
            {/* Current Price Indicator */}
            <div className="border-l-4 border-[#00F0FF] bg-[#00F0FF]/10 pl-2 py-1 mb-3 animate-pulse-slow">
              <div className="flex items-center text-sm">
                <span className="w-1/2 text-[#00F0FF] font-medium">${selectedCrypto.price.toLocaleString()}</span>
                <span className="w-1/2 text-right text-gray-400">Current Price</span>
              </div>
            </div>
            
            {/* Bids (Buy Orders) */}
            <div className="space-y-1">
              {orderBook.bids.map((order, index) => (
                <div
                  key={`bid-${index}`}
                  className="flex items-center text-sm relative overflow-hidden animate-fade-in-up"
                  style={{ animationDelay: `${(index + 5) * 0.05}s` }}
                >
                  <div
                    className="absolute inset-y-0 right-0 bg-green-500/10"
                    style={{ width: `${(order.amount / 5) * 100}%` }}
                  ></div>
                  <span className="w-1/2 text-green-400 z-10">${order.price.toLocaleString()}</span>
                  <span className="w-1/2 text-right z-10">{order.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Orders History */}
      <div className="xl:col-span-3 bg-[#1A2142]/70 backdrop-blur-md rounded-xl p-6 border border-[#1A2142]/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
        <h2 className="text-xl font-bold mb-4">Order History</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-[#1A2142]">
                <th className="py-3 text-left text-sm text-gray-400">Type</th>
                <th className="py-3 text-left text-sm text-gray-400">Symbol</th>
                <th className="py-3 text-left text-sm text-gray-400">Amount</th>
                <th className="py-3 text-left text-sm text-gray-400">Price</th>
                <th className="py-3 text-left text-sm text-gray-400">Total</th>
                <th className="py-3 text-left text-sm text-gray-400">Status</th>
                <th className="py-3 text-left text-sm text-gray-400">Time</th>
              </tr>
            </thead>
            <tbody>
              {orderHistory.map((order, index) => (
                <tr
                  key={order.id}
                  className={`border-b border-[#1A2142]/50 hover:bg-[#1A2142]/50 animate-fade-in-up`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <td className={`py-3 text-sm ${order.type === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>
                    {order.type}
                  </td>
                  <td className="py-3 text-sm">{order.symbol}</td>
                  <td className="py-3 text-sm">{order.amount}</td>
                  <td className="py-3 text-sm">${order.price.toLocaleString()}</td>
                  <td className="py-3 text-sm">${order.total.toLocaleString()}</td>
                  <td className="py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.status === 'Completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-gray-400">{order.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TradingContent;
