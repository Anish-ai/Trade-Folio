import React, { useState } from 'react';

interface PortfolioContentProps {
  portfolioValue: number;
  watchlist: any[];
}

const PortfolioContent: React.FC<PortfolioContentProps> = ({
  portfolioValue,
  watchlist
}) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('1M');
  
  // Sample asset allocation data
  const assetAllocation = [
    { type: 'Stocks', percentage: 65, value: 56823, color: '#00F0FF' },
    { type: 'Crypto', percentage: 20, value: 17484, color: '#FF4DED' },
    { type: 'Commodities', percentage: 10, value: 8742, color: '#FFA500' },
    { type: 'Bonds', percentage: 5, value: 4371, color: '#4CAF50' },
  ];

  // Sample performance data
  const performanceData = [
    { month: 'Jan', value: 75000 },
    { month: 'Feb', value: 72000 },
    { month: 'Mar', value: 78000 },
    { month: 'Apr', value: 80000 },
    { month: 'May', value: 76000 },
    { month: 'Jun', value: 82000 },
    { month: 'Jul', value: 85000 },
    { month: 'Aug', value: 83000 },
    { month: 'Sep', value: 87000 },
    { month: 'Oct', value: 84000 },
    { month: 'Nov', value: 86000 },
    { month: 'Dec', value: portfolioValue },
  ];

  // Calculate the highest value for the Y-axis scale
  const maxValue = Math.max(...performanceData.map(item => item.value)) * 1.1;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-[#1A2142]/70 backdrop-blur-md rounded-xl p-6 relative border border-[#1A2142]/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00F0FF]/5 to-[#FF4DED]/5 rounded-xl"></div>
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 flex items-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-[#FF4DED]">
              Your Portfolio
            </span>
            <div className="ml-4 px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">
              +6.2% this month
            </div>
          </h1>
          
          <div className="flex flex-wrap gap-4 items-center">
            <div className="bg-[#0F1428] px-6 py-4 rounded-lg border border-[#1A2142] shadow-inner transform hover:scale-105 transition-transform duration-300">
              <p className="text-sm text-gray-400">Total Value</p>
              <p className="text-3xl font-bold text-white">${portfolioValue.toLocaleString()}</p>
            </div>
            
            <div className="bg-[#0F1428] px-6 py-4 rounded-lg border border-[#1A2142] shadow-inner transform hover:scale-105 transition-transform duration-300">
              <p className="text-sm text-gray-400">Profit/Loss</p>
              <p className="text-3xl font-bold text-green-400">+$12,420.00</p>
            </div>
            
            <div className="bg-[#0F1428] px-6 py-4 rounded-lg border border-[#1A2142] shadow-inner transform hover:scale-105 transition-transform duration-300">
              <p className="text-sm text-gray-400">ROI</p>
              <p className="text-3xl font-bold text-green-400">+14.8%</p>
            </div>
            
            <div className="ml-auto flex gap-2">
              <button className="px-4 py-2 bg-gradient-to-r from-[#00F0FF] to-[#00F0FF]/70 text-white rounded-lg hover:opacity-90 transition-opacity transform hover:scale-105 duration-200 shadow-lg">
                Deposit
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-[#FF4DED] to-[#FF4DED]/70 text-white rounded-lg hover:opacity-90 transition-opacity transform hover:scale-105 duration-200 shadow-lg">
                Withdraw
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Portfolio Visualization */}
        <div className="lg:col-span-2 space-y-6">
          {/* Performance Chart */}
          <div className="bg-[#1A2142]/70 backdrop-blur-md rounded-xl p-6 relative border border-[#1A2142]/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)] transform hover:scale-[1.01] transition-transform duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/5 to-transparent rounded-xl"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Portfolio Performance</h2>
                <div className="flex bg-[#0F1428] rounded-lg p-1 border border-[#1A2142]">
                  {['1W', '1M', '3M', '1Y', 'All'].map((range) => (
                    <button
                      key={range}
                      className={`px-3 py-1 text-sm rounded-md transition-all ${
                        timeRange === range
                          ? 'bg-[#1A2142] text-[#00F0FF] shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                          : 'text-gray-400 hover:text-white'
                      }`}
                      onClick={() => setTimeRange(range)}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Performance Chart Visualization */}
              <div className="h-72 relative mt-4">
                <div className="absolute inset-x-0 bottom-0 h-[1px] bg-[#1A2142]"></div>
                <div className="absolute inset-y-0 left-0 w-[1px] bg-[#1A2142]"></div>
                
                {/* Y-axis labels */}
                <div className="absolute left-2 top-0 text-xs text-gray-400">
                  ${Math.floor(maxValue).toLocaleString()}
                </div>
                <div className="absolute left-2 bottom-0 text-xs text-gray-400">
                  $0
                </div>
                
                {/* Chart lines and area */}
                <svg className="w-full h-full" viewBox="0 0 1200 400">
                  {/* Grid lines */}
                  {[...Array(5)].map((_, i) => (
                    <line
                      key={i}
                      x1="0"
                      y1={(i + 1) * 80}
                      x2="1200"
                      y2={(i + 1) * 80}
                      stroke="#1A2142"
                      strokeWidth="1"
                      strokeDasharray="5,5"
                    />
                  ))}
                  
                  {/* Data path with gradient fill */}
                  <defs>
                    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Calculate paths based on data */}
                  {(() => {
                    const width = 1200;
                    const height = 400;
                    const barWidth = width / performanceData.length;
                    const barSpacing = 10;
                    
                    // Line path
                    const linePath = performanceData.map((item, i) => {
                      const x = i * barWidth + barWidth / 2;
                      const y = height - (item.value / maxValue) * height;
                      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
                    }).join(' ');
                    
                    // Area path for gradient fill
                    const areaPath = `${linePath} L${width},${height} L0,${height} Z`;
                    
                    return (
                      <>
                        {/* Area fill */}
                        <path
                          d={areaPath}
                          fill="url(#areaGradient)"
                          className="opacity-70"
                        />
                        
                        {/* Line path */}
                        <path
                          d={linePath}
                          fill="none"
                          stroke="#00F0FF"
                          strokeWidth="3"
                          className="animate-draw-slow"
                        />
                        
                        {/* Data points */}
                        {performanceData.map((item, i) => {
                          const x = i * barWidth + barWidth / 2;
                          const y = height - (item.value / maxValue) * height;
                          return (
                            <g key={i}>
                              <circle
                                cx={x}
                                cy={y}
                                r="6"
                                fill="#0F1428"
                                stroke="#00F0FF"
                                strokeWidth="2"
                                className="animate-pulse-slow"
                              />
                              
                              {/* X-axis month labels */}
                              <text
                                x={x}
                                y={height - 10}
                                fontSize="12"
                                fill="#888"
                                textAnchor="middle"
                              >
                                {item.month}
                              </text>
                              
                              {/* Value on hover - simplified demo */}
                              <g className="opacity-0 hover:opacity-100 transition-opacity duration-200">
                                <rect
                                  x={x - 40}
                                  y={y - 40}
                                  width="80"
                                  height="30"
                                  rx="4"
                                  fill="#1A2142"
                                  strokeWidth="1"
                                  stroke="#00F0FF"
                                />
                                <text
                                  x={x}
                                  y={y - 20}
                                  fontSize="12"
                                  fill="white"
                                  textAnchor="middle"
                                >
                                  ${item.value.toLocaleString()}
                                </text>
                              </g>
                            </g>
                          );
                        })}
                      </>
                    );
                  })()}
                </svg>
              </div>
            </div>
          </div>
          
          {/* Asset List */}
          <div className="bg-[#1A2142]/70 backdrop-blur-md rounded-xl p-6 relative border border-[#1A2142]/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF4DED]/5 to-transparent rounded-xl"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Your Assets</h2>
                <div className="flex bg-[#0F1428] rounded-lg p-1 border border-[#1A2142]">
                  {['all', 'crypto', 'stocks', 'commodities'].map((filter) => (
                    <button
                      key={filter}
                      className={`px-3 py-1 text-sm rounded-md transition-all ${
                        activeFilter === filter
                          ? 'bg-[#1A2142] text-[#FF4DED] shadow-[0_0_10px_rgba(255,77,237,0.2)]'
                          : 'text-gray-400 hover:text-white'
                      }`}
                      onClick={() => setActiveFilter(filter)}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="overflow-hidden rounded-lg border border-[#1A2142]">
                <table className="min-w-full divide-y divide-[#1A2142]">
                  <thead className="bg-[#0F1428]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Asset</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Holdings</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Value</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Change</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-[#0F1428]/50 divide-y divide-[#1A2142]">
                    {watchlist.map((asset, index) => (
                      <tr key={asset.symbol} className="hover:bg-[#1A2142]/30 transition-colors duration-150 group">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#FF4DED] flex items-center justify-center text-white font-bold">
                              {asset.symbol.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">{asset.symbol}</div>
                              <div className="text-sm text-gray-400">{asset.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white">${asset.price.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white">{(Math.random() * 10 + 2).toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white">${(asset.price * (Math.random() * 10 + 2)).toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            asset.change >= 0 
                              ? 'bg-green-100/10 text-green-400' 
                              : 'bg-red-100/10 text-red-400'
                          }`}>
                            {asset.change >= 0 ? '+' : ''}{asset.change}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button className="bg-[#00F0FF]/20 hover:bg-[#00F0FF]/30 text-[#00F0FF] px-2 py-1 rounded">
                              Buy
                            </button>
                            <button className="bg-[#FF4DED]/20 hover:bg-[#FF4DED]/30 text-[#FF4DED] px-2 py-1 rounded">
                              Sell
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
        </div>
        
        {/* Right Column - Portfolio Breakdown */}
        <div className="space-y-6">
          {/* Asset Allocation */}
          <div className="bg-[#1A2142]/70 backdrop-blur-md rounded-xl p-6 relative border border-[#1A2142]/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)] transform hover:scale-[1.01] transition-transform duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/5 to-[#FF4DED]/5 rounded-xl"></div>
            <div className="relative z-10">
              <h2 className="text-xl font-bold mb-4">Asset Allocation</h2>
              
              {/* 3D Donut Chart */}
              <div className="h-64 flex items-center justify-center mb-4 relative">
                <div className="absolute w-40 h-40 rounded-full bg-[#0F1428] shadow-[0_0_40px_rgba(0,240,255,0.2)]"></div>
                
                {/* SVG Donut Chart */}
                <svg className="w-48 h-48 transform rotate-[-90deg]" viewBox="0 0 100 100">
                  <defs>
                    {assetAllocation.map((asset, index) => (
                      <linearGradient
                        key={`gradient-${index}`}
                        id={`gradient-${index}`}
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor={asset.color} />
                        <stop offset="100%" stopColor={`${asset.color}80`} />
                      </linearGradient>
                    ))}
                  </defs>
                  
                  {assetAllocation.map((asset, index) => {
                    // Calculate the start percentage for this slice
                    const previousPercentages = assetAllocation
                      .slice(0, index)
                      .reduce((sum, current) => sum + current.percentage, 0);
                    
                    // Calculate the slice properties
                    const startPercentage = previousPercentages;
                    const slicePercentage = asset.percentage;
                    
                    // Convert percentages to radians
                    const startAngle = (startPercentage / 100) * Math.PI * 2;
                    const angle = (slicePercentage / 100) * Math.PI * 2;
                    const endAngle = startAngle + angle;
                    
                    // Calculate the SVG arc path
                    const radius = 40;
                    const innerRadius = 25; // For donut hole
                    
                    // Calculate points on the arc
                    const startX = 50 + radius * Math.cos(startAngle);
                    const startY = 50 + radius * Math.sin(startAngle);
                    const endX = 50 + radius * Math.cos(endAngle);
                    const endY = 50 + radius * Math.sin(endAngle);
                    
                    // Inner points
                    const innerStartX = 50 + innerRadius * Math.cos(startAngle);
                    const innerStartY = 50 + innerRadius * Math.sin(startAngle);
                    const innerEndX = 50 + innerRadius * Math.cos(endAngle);
                    const innerEndY = 50 + innerRadius * Math.sin(endAngle);
                    
                    // Create the arc flag
                    const largeArcFlag = angle > Math.PI ? 1 : 0;
                    
                    // Create the SVG path
                    const path = [
                      `M ${startX} ${startY}`, // Move to start point
                      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Outer arc
                      `L ${innerEndX} ${innerEndY}`, // Line to inner end
                      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStartX} ${innerStartY}`, // Inner arc
                      'Z', // Close path
                    ].join(' ');
                    
                    return (
                      <path
                        key={`slice-${index}`}
                        d={path}
                        fill={`url(#gradient-${index})`}
                        stroke="#0A0F24"
                        strokeWidth="0.5"
                        className="drop-shadow-lg hover:opacity-90 transition-opacity cursor-pointer"
                        style={{
                          transform: `translateY(${index % 2 === 0 ? -3 : 0}px)`,
                          filter: `drop-shadow(0 4px 6px rgba(0, 0, 0, 0.5))`,
                        }}
                      />
                    );
                  })}
                  
                  {/* Inner Circle */}
                  <circle cx="50" cy="50" r="22" fill="#0F1428" />
                  
                  {/* Center Text */}
                  <text
                    x="50"
                    y="50"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="8"
                    fontWeight="bold"
                    transform="rotate(90, 50, 50)"
                  >
                    ${portfolioValue.toLocaleString()}
                  </text>
                </svg>
                
                {/* 3D Effect Overlay */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#ffffff10] to-transparent opacity-30 pointer-events-none"></div>
              </div>
              
              {/* Legend */}
              <div className="space-y-2">
                {assetAllocation.map((asset) => (
                  <div key={asset.type} className="flex items-center justify-between p-2 rounded-lg hover:bg-[#0F1428]/50 transition-colors">
                    <div className="flex items-center">
                      <div
                        className="w-4 h-4 rounded-sm mr-3"
                        style={{ backgroundColor: asset.color }}
                      ></div>
                      <span>{asset.type}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-400">{asset.percentage}%</span>
                      <span>${asset.value.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Risk Analysis */}
          <div className="bg-[#1A2142]/70 backdrop-blur-md rounded-xl p-6 relative border border-[#1A2142]/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)] transform hover:scale-[1.01] transition-transform duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF4DED]/5 to-transparent rounded-xl"></div>
            <div className="relative z-10">
              <h2 className="text-xl font-bold mb-4">Risk Analysis</h2>
              
              {/* Risk Meter */}
              <div className="h-32 flex items-center justify-center mb-6 relative">
                <div className="w-full h-6 bg-[#0F1428] rounded-full overflow-hidden border border-[#1A2142]">
                  <div className="h-full w-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full">
                    {/* Risk Indicator */}
                    <div
                      className="absolute top-0 h-12 w-1 bg-white border-2 border-[#0A0F24] rounded-full transform translate-y-[-25%] transition-all duration-500"
                      style={{ left: `65%` }}
                    >
                      <div className="absolute bottom-[-30px] left-[-20px] w-40 text-center">
                        <div className="text-sm font-bold">Moderate</div>
                        <div className="text-xs text-gray-400">65/100</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Risk Breakdown */}
              <div className="space-y-4">
                <div className="bg-[#0F1428]/80 p-4 rounded-lg border border-[#1A2142]">
                  <div className="flex justify-between mb-2">
                    <div className="text-sm font-medium">Volatility</div>
                    <div className="text-sm font-medium text-yellow-400">Medium</div>
                  </div>
                  <div className="w-full h-2 bg-[#1A2142] rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                
                <div className="bg-[#0F1428]/80 p-4 rounded-lg border border-[#1A2142]">
                  <div className="flex justify-between mb-2">
                    <div className="text-sm font-medium">Diversification</div>
                    <div className="text-sm font-medium text-green-400">Good</div>
                  </div>
                  <div className="w-full h-2 bg-[#1A2142] rounded-full overflow-hidden">
                    <div className="h-full bg-green-400 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
                
                <div className="bg-[#0F1428]/80 p-4 rounded-lg border border-[#1A2142]">
                  <div className="flex justify-between mb-2">
                    <div className="text-sm font-medium">Market Exposure</div>
                    <div className="text-sm font-medium text-red-400">High</div>
                  </div>
                  <div className="w-full h-2 bg-[#1A2142] rounded-full overflow-hidden">
                    <div className="h-full bg-red-400 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
              
              <button className="w-full mt-4 bg-[#0F1428]/80 hover:bg-[#0F1428] text-[#00F0FF] py-2 rounded-lg transition-all border border-[#1A2142] hover:border-[#00F0FF] hover:shadow-[0_0_10px_rgba(0,240,255,0.3)]">
                Adjust Risk Parameters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioContent; 