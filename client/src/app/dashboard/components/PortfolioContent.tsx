import React, { useState } from 'react';

interface PortfolioContentProps {
  portfolioValue: number;
  watchlist: {
    symbol: string;
    name: string;
    price: number;
    change: number;
    sentiment: string;
  }[];
}

const PortfolioContent: React.FC<PortfolioContentProps> = ({ portfolioValue, watchlist }) => {
  const [timeRange, setTimeRange] = useState<keyof typeof portfolioData.performance>('1M');
  const [assetClass, setAssetClass] = useState('all');
  
  // Mock portfolio data for visualization
  const portfolioData = {
    assets: [
      { id: 1, name: 'Apple Inc.', symbol: 'AAPL', type: 'stock', allocation: 15, value: 13113, costBasis: 11240, return: 16.7, color: '#00F0FF' },
      { id: 2, name: 'Microsoft Corp.', symbol: 'MSFT', type: 'stock', allocation: 12, value: 10490.4, costBasis: 9300, return: 12.8, color: '#7B61FF' },
      { id: 3, name: 'Bitcoin', symbol: 'BTC', type: 'crypto', allocation: 25, value: 21855, costBasis: 15000, return: 45.7, color: '#FF4DED' },
      { id: 4, name: 'Ethereum', symbol: 'ETH', type: 'crypto', allocation: 18, value: 15735.6, costBasis: 12200, return: 29, color: '#FFA63F' },
      { id: 5, name: 'Tesla, Inc.', symbol: 'TSLA', type: 'stock', allocation: 8, value: 6993.6, costBasis: 7500, return: -6.8, color: '#1CD8D2' },
      { id: 6, name: 'Amazon.com Inc.', symbol: 'AMZN', type: 'stock', allocation: 10, value: 8742, costBasis: 8900, return: -1.8, color: '#F56A79' },
      { id: 7, name: 'U.S. Treasury Bond', symbol: 'GOVT', type: 'bond', allocation: 7, value: 6119.4, costBasis: 6000, return: 2, color: '#7AE582' },
      { id: 8, name: 'Gold ETF', symbol: 'GLD', type: 'commodity', allocation: 5, value: 4371, costBasis: 4200, return: 4.1, color: '#F9F871' },
    ],
    performance: {
      '1D': -0.8,
      '1W': 2.3,
      '1M': 5.4,
      '3M': 12.7,
      '1Y': 24.5,
      'YTD': 18.2,
      'ALL': 37.9,
    },
    allocationByType: {
      stock: 45,
      crypto: 43,
      bond: 7,
      commodity: 5,
    },
    history: [
      { date: '2023-03-01', value: 70000 },
      { date: '2023-03-15', value: 72500 },
      { date: '2023-03-31', value: 75000 },
      { date: '2023-04-15', value: 79000 },
      { date: '2023-04-30', value: 83000 },
      { date: '2023-05-15', value: 81000 },
      { date: '2023-05-31', value: 84000 },
      { date: '2023-06-15', value: 86000 },
      { date: '2023-06-30', value: 87420 },
    ]
  };

  // Filter assets based on selected asset class
  const filteredAssets = assetClass === 'all' 
    ? portfolioData.assets 
    : portfolioData.assets.filter(asset => asset.type === assetClass);

  // Calculate total portfolio stats
  const totalReturn = portfolioData.assets.reduce((acc, asset) => acc + (asset.value - asset.costBasis), 0);
  const totalCostBasis = portfolioData.assets.reduce((acc, asset) => acc + asset.costBasis, 0);
  const totalReturnPercentage = (totalReturn / totalCostBasis) * 100;

  // Chart dimensions for pie segments
  const radius = 120;
  const centerX = 200;
  const centerY = 200;

  // Generate pie chart segments
  const generatePieSegments = () => {
    let startAngle = 0;
    return filteredAssets.map(asset => {
      const angle = (asset.allocation / 100) * 360;
      const endAngle = startAngle + angle;
      
      // Calculate coordinates for pie segment
      const startRad = (startAngle - 90) * (Math.PI / 180);
      const endRad = (endAngle - 90) * (Math.PI / 180);
      
      const x1 = centerX + radius * Math.cos(startRad);
      const y1 = centerY + radius * Math.sin(startRad);
      const x2 = centerX + radius * Math.cos(endRad);
      const y2 = centerY + radius * Math.sin(endRad);
      
      // Create SVG arc path
      const largeArcFlag = angle > 180 ? 1 : 0;
      const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
      
      // Save current end angle to be the start angle for the next segment
      const segment = {
        path: pathData,
        color: asset.color,
        startAngle,
        endAngle,
        asset
      };
      
      startAngle = endAngle;
      return segment;
    });
  };

  const pieSegments = generatePieSegments();

  // Generate line chart path for portfolio history
  const generateChartPath = () => {
    const width = 800;
    const height = 200;
    const padding = 30;
    
    const values = portfolioData.history.map(point => point.value);
    const minValue = Math.min(...values) * 0.95;
    const maxValue = Math.max(...values) * 1.05;
    
    const xStep = (width - padding * 2) / (portfolioData.history.length - 1);
    
    const points = portfolioData.history.map((point, index) => {
      const x = padding + index * xStep;
      const y = height - padding - ((point.value - minValue) / (maxValue - minValue)) * (height - padding * 2);
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  };

  const chartPath = generateChartPath();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Portfolio Overview */}
      <div className="lg:col-span-3 bg-[#1A2142]/70 backdrop-blur-md rounded-xl p-6 border border-[#1A2142]/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)] animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Portfolio Overview</h2>
            <p className="text-gray-400">Your current investments and performance</p>
          </div>
          
          <div className="flex space-x-2 mt-4 md:mt-0">
            {Object.keys(portfolioData.performance).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range as keyof typeof portfolioData.performance)}
                className={`px-3 py-1 text-sm rounded-lg transition-all ${
                  timeRange === range
                    ? 'bg-[#00F0FF]/20 text-[#00F0FF] shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                    : 'bg-[#1A2142] text-gray-400 hover:bg-[#1A2142]/80'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-[#12172f]/80 p-4 rounded-xl border border-[#1A2142]/60">
            <p className="text-sm text-gray-400 mb-1">Total Value</p>
            <p className="text-2xl font-bold">${portfolioValue.toLocaleString()}</p>
            <div className={`flex items-center mt-1 ${portfolioData.performance[timeRange] >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              <span>{portfolioData.performance[timeRange] >= 0 ? '+' : ''}{portfolioData.performance[timeRange]}%</span>
              <span className="text-xs ml-1">{timeRange}</span>
            </div>
          </div>
          
          <div className="bg-[#12172f]/80 p-4 rounded-xl border border-[#1A2142]/60">
            <p className="text-sm text-gray-400 mb-1">Total Return</p>
            <p className="text-2xl font-bold">${totalReturn.toLocaleString()}</p>
            <div className={`flex items-center mt-1 ${totalReturnPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              <span>{totalReturnPercentage >= 0 ? '+' : ''}{totalReturnPercentage.toFixed(2)}%</span>
              <span className="text-xs ml-1">all time</span>
            </div>
          </div>
          
          <div className="bg-[#12172f]/80 p-4 rounded-xl border border-[#1A2142]/60">
            <p className="text-sm text-gray-400 mb-1">Assets</p>
            <p className="text-2xl font-bold">{portfolioData.assets.length}</p>
            <div className="flex items-center mt-1 text-gray-400">
              <span>{Object.keys(portfolioData.allocationByType).length} asset classes</span>
            </div>
          </div>
          
          <div className="bg-[#12172f]/80 p-4 rounded-xl border border-[#1A2142]/60">
            <p className="text-sm text-gray-400 mb-1">Best Performer</p>
            <p className="text-2xl font-bold">BTC</p>
            <div className="flex items-center mt-1 text-green-400">
              <span>+45.7%</span>
              <span className="text-xs ml-1">all time</span>
            </div>
          </div>
        </div>
        
        {/* Portfolio Performance Chart */}
        <div className="mt-6 bg-[#12172f]/80 p-4 rounded-xl border border-[#1A2142]/60 h-80 relative">
          <svg width="100%" height="100%" viewBox="0 0 800 200" preserveAspectRatio="none">
            {/* Grid lines */}
            <g className="grid-lines">
              {[...Array(5)].map((_, i) => (
                <line 
                  key={i} 
                  x1="30" 
                  y1={30 + i * 35} 
                  x2="770" 
                  y2={30 + i * 35} 
                  stroke="#1A2142" 
                  strokeWidth="1" 
                />
              ))}
              {portfolioData.history.map((_, i) => (
                <line 
                  key={i} 
                  x1={30 + i * (740 / (portfolioData.history.length - 1))} 
                  y1="30" 
                  x2={30 + i * (740 / (portfolioData.history.length - 1))} 
                  y2="170" 
                  stroke="#1A2142" 
                  strokeWidth="1" 
                />
              ))}
            </g>
            
            {/* Chart path */}
            <path
              d={chartPath}
              fill="none"
              stroke="url(#portfolio-gradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-draw-slow"
            />
            
            {/* Area below the line */}
            <path
              d={`${chartPath} L 770,170 L 30,170 Z`}
              fill="url(#portfolio-area-gradient)"
              opacity="0.3"
              className="animate-fade-in"
            />
            
            {/* Gradient definitions */}
            <defs>
              <linearGradient id="portfolio-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00F0FF" />
                <stop offset="100%" stopColor="#FF4DED" />
              </linearGradient>
              <linearGradient id="portfolio-area-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#00F0FF" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Date labels */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-between px-8 text-xs text-gray-400">
            {portfolioData.history.filter((_, i) => i % 2 === 0).map((point, i) => (
              <span key={i}>{point.date}</span>
            ))}
          </div>
          
          {/* Value labels */}
          <div className="absolute top-0 bottom-0 left-2 flex flex-col justify-between py-2 text-xs text-gray-400">
            {[...Array(3)].map((_, i) => {
              const values = portfolioData.history.map(p => p.value);
              const min = Math.min(...values);
              const max = Math.max(...values);
              const step = (max - min) / 2;
              return <span key={i}>${Math.round(max - i * step).toLocaleString()}</span>;
            })}
          </div>
        </div>
      </div>
      
      {/* Asset Allocation */}
      <div className="lg:col-span-1 bg-[#1A2142]/70 backdrop-blur-md rounded-xl p-6 border border-[#1A2142]/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)] animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-xl font-bold mb-4">Asset Allocation</h2>
        
        <div className="flex mb-4">
          <button
            onClick={() => setAssetClass('all')}
            className={`flex-1 py-2 text-sm transition-all ${
              assetClass === 'all'
                ? 'bg-[#00F0FF]/20 text-[#00F0FF] border-b-2 border-[#00F0FF]'
                : 'bg-transparent text-gray-400 border-b border-[#1A2142]'
            }`}
          >
            All
          </button>
          {Object.keys(portfolioData.allocationByType).map(type => (
            <button
              key={type}
              onClick={() => setAssetClass(type)}
              className={`flex-1 py-2 text-sm capitalize transition-all ${
                assetClass === type
                  ? 'bg-[#00F0FF]/20 text-[#00F0FF] border-b-2 border-[#00F0FF]'
                  : 'bg-transparent text-gray-400 border-b border-[#1A2142]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        
        {/* Donut Chart */}
        <div className="relative w-full aspect-square mt-2 mb-4">
          <svg width="100%" height="100%" viewBox="0 0 400 400">
            {/* Pie segments */}
            {pieSegments.map((segment, i) => (
              <path
                key={i}
                d={segment.path}
                fill={segment.color}
                stroke="#0A0F24"
                strokeWidth="1"
                opacity="0.9"
                className="hover:opacity-100 transition-opacity cursor-pointer animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
            
            {/* Inner circle (hole) */}
            <circle cx={centerX} cy={centerY} r={radius * 0.6} fill="#0A0F24" />
            
            {/* Center text */}
            <text x={centerX} y={centerY - 10} textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">
              100%
            </text>
            <text x={centerX} y={centerY + 15} textAnchor="middle" fill="#00F0FF" fontSize="14">
              Allocation
            </text>
          </svg>
        </div>
        
        {/* Legend */}
        <div className="space-y-2 mt-4">
          {filteredAssets.map((asset) => (
            <div key={asset.id} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: asset.color }}></div>
                <span className="text-sm">{asset.name}</span>
              </div>
              <span className="text-sm font-medium">{asset.allocation}%</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Risk Analysis */}
      <div className="lg:col-span-1 bg-[#1A2142]/70 backdrop-blur-md rounded-xl p-6 border border-[#1A2142]/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)] animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-xl font-bold mb-4">Risk Analysis</h2>
        
        <div className="space-y-6">
          {/* Volatility Meter */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-400">Portfolio Volatility</span>
              <span className="text-sm">Moderate</span>
            </div>
            <div className="h-3 bg-[#12172f] rounded-full overflow-hidden relative">
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <div className="h-full w-1/2 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400"></div>
              </div>
              <div className="absolute h-full w-1.5 bg-white rounded-full left-1/2 transform -translate-x-1/2 animate-pulse-slow"></div>
            </div>
          </div>
          
          {/* Diversification Score */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-400">Diversification Score</span>
              <span className="text-sm text-green-400">Good</span>
            </div>
            <div className="h-3 bg-[#12172f] rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-[#00F0FF] rounded-full animate-slide-in-right"></div>
            </div>
          </div>
          
          {/* Risk-to-Reward Ratio */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-400">Risk-to-Reward Ratio</span>
              <span className="text-sm text-green-400">1:1.8</span>
            </div>
            <div className="flex justify-between h-3 gap-1">
              <div className="h-full w-5/12 bg-red-400 rounded-full animate-slide-in-right"></div>
              <div className="h-full w-7/12 bg-green-400 rounded-full animate-slide-in-left"></div>
            </div>
          </div>
          
          {/* Risk Categories */}
          <div className="bg-[#12172f]/80 p-4 rounded-xl border border-[#1A2142]/60">
            <h3 className="text-sm font-medium mb-3">Risk Breakdown</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Market Risk</span>
                <span className="text-yellow-400">Medium</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Currency Risk</span>
                <span className="text-green-400">Low</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Liquidity Risk</span>
                <span className="text-red-400">High</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Concentration Risk</span>
                <span className="text-yellow-400">Medium</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Optimization Suggestions */}
      <div className="lg:col-span-1 bg-[#1A2142]/70 backdrop-blur-md rounded-xl p-6 border border-[#1A2142]/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)] animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Portfolio Insights</h2>
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#FF4DED] flex items-center justify-center animate-pulse-slow">
            <span className="text-xs text-white">AI</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-green-500/10 border-l-4 border-green-500 p-3 rounded-r-lg">
            <h3 className="text-green-400 text-sm font-medium mb-1">Optimization Opportunity</h3>
            <p className="text-sm">Reduce Bitcoin exposure by 5% and reallocate to bond ETFs to improve risk-adjusted returns.</p>
          </div>
          
          <div className="bg-blue-500/10 border-l-4 border-blue-500 p-3 rounded-r-lg">
            <h3 className="text-blue-400 text-sm font-medium mb-1">Tax Efficiency</h3>
            <p className="text-sm">Consider tax-loss harvesting with TSLA to offset capital gains from BTC position.</p>
          </div>
          
          <div className="bg-purple-500/10 border-l-4 border-purple-500 p-3 rounded-r-lg">
            <h3 className="text-purple-400 text-sm font-medium mb-1">Rebalancing Alert</h3>
            <p className="text-sm">Crypto allocation is 3% above target. Consider rebalancing to maintain desired risk profile.</p>
          </div>
          
          <div className="bg-yellow-500/10 border-l-4 border-yellow-500 p-3 rounded-r-lg">
            <h3 className="text-yellow-400 text-sm font-medium mb-1">Diversification Tip</h3>
            <p className="text-sm">Add exposure to international markets to reduce correlation with US equities.</p>
          </div>
        </div>
        
        <button className="w-full mt-4 py-2 rounded-lg bg-[#00F0FF]/20 text-[#00F0FF] text-sm hover:bg-[#00F0FF]/30 transition-colors">
          Get Full Analysis
        </button>
      </div>
      
      {/* Assets Table */}
      <div className="lg:col-span-3 bg-[#1A2142]/70 backdrop-blur-md rounded-xl p-6 border border-[#1A2142]/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)] animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Your Assets</h2>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded-lg text-sm bg-[#12172f] text-gray-400 hover:text-white transition-colors">
              Export
            </button>
            <button className="px-3 py-1 rounded-lg text-sm bg-[#00F0FF]/20 text-[#00F0FF] hover:bg-[#00F0FF]/30 transition-colors">
              + Add Asset
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-[#1A2142]">
                <th className="py-3 text-left text-sm text-gray-400">Asset</th>
                <th className="py-3 text-left text-sm text-gray-400">Type</th>
                <th className="py-3 text-right text-sm text-gray-400">Allocation</th>
                <th className="py-3 text-right text-sm text-gray-400">Current Value</th>
                <th className="py-3 text-right text-sm text-gray-400">Cost Basis</th>
                <th className="py-3 text-right text-sm text-gray-400">Return</th>
                <th className="py-3 text-center text-sm text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {portfolioData.assets.map((asset, index) => (
                <tr 
                  key={asset.id}
                  className="border-b border-[#1A2142]/50 hover:bg-[#1A2142]/50 animate-fade-in-up"
                  style={{ animationDelay: `${0.1 * (index + 1)}s` }}
                >
                  <td className="py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full mr-3" style={{ background: asset.color }}></div>
                      <div>
                        <p className="font-medium">{asset.symbol}</p>
                        <p className="text-xs text-gray-400">{asset.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-sm capitalize">{asset.type}</td>
                  <td className="py-4 text-sm text-right">{asset.allocation}%</td>
                  <td className="py-4 text-sm text-right">${asset.value.toLocaleString()}</td>
                  <td className="py-4 text-sm text-right">${asset.costBasis.toLocaleString()}</td>
                  <td className={`py-4 text-sm text-right ${asset.return >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {asset.return >= 0 ? '+' : ''}{asset.return}%
                  </td>
                  <td className="py-4 text-center">
                    <div className="flex justify-center space-x-2">
                      <button className="w-8 h-8 rounded-lg bg-[#12172f] flex items-center justify-center text-gray-400 hover:text-[#00F0FF] transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                      </button>
                      <button className="w-8 h-8 rounded-lg bg-[#12172f] flex items-center justify-center text-gray-400 hover:text-[#00F0FF] transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                          <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button className="w-8 h-8 rounded-lg bg-[#12172f] flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PortfolioContent; 