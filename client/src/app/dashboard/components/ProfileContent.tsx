import React, { useState } from 'react';

const ProfileContent: React.FC = () => {
  const [activeSection, setActiveSection] = useState('profile');
  
  // Mock user data
  const userData = {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    joined: "March 2023",
    avatar: "/avatar.jpg",
    plan: "Pro Trader",
    status: "Verified",
    tradingStats: {
      totalTrades: 245,
      winRate: 68,
      avgReturn: 12.4,
      bestTrade: 32.5,
      worstTrade: -8.2,
      tradingVolume: "$437,290",
      tradingSince: "March 2023",
    },
    securitySettings: {
      twoFactor: true,
      lastLogin: "Today, 9:42 AM",
      devices: [
        { name: "Windows PC - Chrome", location: "New York, US", lastActive: "Now" },
        { name: "iPhone 13 - Safari", location: "New York, US", lastActive: "Yesterday" },
      ],
    },
    notificationSettings: {
      priceAlerts: true,
      newFeatures: true,
      marketUpdates: true,
      securityAlerts: true,
      tradingUpdates: false,
      newsletter: true,
    },
    apiKeys: [
      { name: "Trading Bot Alpha", created: "Apr 12, 2023", lastUsed: "Today", status: "Active" },
      { name: "Portfolio Tracker", created: "May 3, 2023", lastUsed: "2 days ago", status: "Active" },
    ],
  };

  // Render content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Profile */}
            <div className="lg:col-span-1 bg-[#1A2142]/70 backdrop-blur-md rounded-xl p-6 border border-[#1A2142]/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)] animate-fade-in-up">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#FF4DED] flex items-center justify-center text-white text-5xl font-bold">
                    {userData.name.charAt(0)}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#1A2142] rounded-full border-2 border-[#0A0F24] flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00F0FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold mt-4">{userData.name}</h2>
                <p className="text-gray-400">{userData.email}</p>
                
                <div className="mt-3 flex space-x-2">
                  <span className="px-3 py-1 text-xs rounded-full bg-green-500/20 text-green-400">
                    {userData.status}
                  </span>
                  <span className="px-3 py-1 text-xs rounded-full bg-[#00F0FF]/20 text-[#00F0FF]">
                    {userData.plan}
                  </span>
                </div>
                
                <div className="mt-6 w-full px-6 py-4 bg-[#12172f]/80 rounded-lg border border-[#1A2142]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Member Since</span>
                    <span className="text-sm">{userData.joined}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Total Trades</span>
                    <span className="text-sm">{userData.tradingStats.totalTrades}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Win Rate</span>
                    <span className="text-sm text-green-400">{userData.tradingStats.winRate}%</span>
                  </div>
                </div>
                
                <div className="mt-6 w-full flex">
                  <button className="flex-1 py-2 text-sm bg-[#00F0FF]/20 text-[#00F0FF] rounded-lg hover:bg-[#00F0FF]/30 transition-colors">
                    Upgrade Plan
                  </button>
                </div>
              </div>
            </div>
            
            {/* Trading Statistics */}
            <div className="lg:col-span-2 bg-[#1A2142]/70 backdrop-blur-md rounded-xl p-6 border border-[#1A2142]/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)] animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <h2 className="text-xl font-bold mb-4">Trading Statistics</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-[#12172f]/80 p-4 rounded-xl border border-[#1A2142]/60 transform hover:translate-y-[-5px] transition-transform duration-300">
                  <p className="text-sm text-gray-400 mb-1">Win Rate</p>
                  <p className="text-2xl font-bold text-green-400">{userData.tradingStats.winRate}%</p>
                </div>
                <div className="bg-[#12172f]/80 p-4 rounded-xl border border-[#1A2142]/60 transform hover:translate-y-[-5px] transition-transform duration-300">
                  <p className="text-sm text-gray-400 mb-1">Avg. Return</p>
                  <p className="text-2xl font-bold text-[#00F0FF]">+{userData.tradingStats.avgReturn}%</p>
                </div>
                <div className="bg-[#12172f]/80 p-4 rounded-xl border border-[#1A2142]/60 transform hover:translate-y-[-5px] transition-transform duration-300">
                  <p className="text-sm text-gray-400 mb-1">Best Trade</p>
                  <p className="text-2xl font-bold text-green-400">+{userData.tradingStats.bestTrade}%</p>
                </div>
                <div className="bg-[#12172f]/80 p-4 rounded-xl border border-[#1A2142]/60 transform hover:translate-y-[-5px] transition-transform duration-300">
                  <p className="text-sm text-gray-400 mb-1">Worst Trade</p>
                  <p className="text-2xl font-bold text-red-400">{userData.tradingStats.worstTrade}%</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Monthly Performance */}
                <div className="bg-[#12172f]/80 p-4 rounded-xl border border-[#1A2142]/60">
                  <h3 className="text-sm font-medium mb-3">Monthly Performance</h3>
                  <div className="h-48 flex items-end space-x-2">
                    {Array.from({ length: 12 }).map((_, i) => {
                      const height = 30 + Math.random() * 70;
                      const isPositive = Math.random() > 0.3;
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center">
                          <div 
                            className={`w-full ${isPositive ? 'bg-green-400' : 'bg-red-400'} rounded-t-sm animate-slide-in-up`} 
                            style={{ height: `${height}%`, animationDelay: `${i * 0.05}s` }}
                          ></div>
                          <span className="text-xs text-gray-400 mt-1">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Trade Distribution */}
                <div className="bg-[#12172f]/80 p-4 rounded-xl border border-[#1A2142]/60">
                  <h3 className="text-sm font-medium mb-3">Trade Distribution</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-gray-400">Stocks</span>
                        <span className="text-xs">45%</span>
                      </div>
                      <div className="h-2 bg-[#1A2142] rounded-full overflow-hidden">
                        <div className="h-full bg-[#00F0FF] rounded-full animate-slide-in-right" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-gray-400">Crypto</span>
                        <span className="text-xs">35%</span>
                      </div>
                      <div className="h-2 bg-[#1A2142] rounded-full overflow-hidden">
                        <div className="h-full bg-[#FF4DED] rounded-full animate-slide-in-right" style={{ width: '35%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-gray-400">Forex</span>
                        <span className="text-xs">15%</span>
                      </div>
                      <div className="h-2 bg-[#1A2142] rounded-full overflow-hidden">
                        <div className="h-full bg-green-400 rounded-full animate-slide-in-right" style={{ width: '15%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-gray-400">Commodities</span>
                        <span className="text-xs">5%</span>
                      </div>
                      <div className="h-2 bg-[#1A2142] rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400 rounded-full animate-slide-in-right" style={{ width: '5%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Account Settings */}
            <div className="lg:col-span-3 bg-[#1A2142]/70 backdrop-blur-md rounded-xl p-6 border border-[#1A2142]/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)] animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-xl font-bold mb-4">Account Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Personal Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                      <input type="text" defaultValue={userData.name} className="w-full bg-[#12172f] border border-[#1A2142] rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00F0FF] focus:border-[#00F0FF]" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Email Address</label>
                      <input type="email" defaultValue={userData.email} className="w-full bg-[#12172f] border border-[#1A2142] rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00F0FF] focus:border-[#00F0FF]" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
                      <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full bg-[#12172f] border border-[#1A2142] rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00F0FF] focus:border-[#00F0FF]" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Date of Birth</label>
                      <input type="date" defaultValue="1990-01-15" className="w-full bg-[#12172f] border border-[#1A2142] rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00F0FF] focus:border-[#00F0FF]" />
                    </div>
                  </div>
                </div>
                
                {/* Preferences */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Preferences</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Language</label>
                      <select className="w-full bg-[#12172f] border border-[#1A2142] rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00F0FF] focus:border-[#00F0FF]">
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                        <option>Japanese</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Time Zone</label>
                      <select className="w-full bg-[#12172f] border border-[#1A2142] rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00F0FF] focus:border-[#00F0FF]">
                        <option>Eastern Time (ET)</option>
                        <option>Pacific Time (PT)</option>
                        <option>Central European Time (CET)</option>
                        <option>Japan Standard Time (JST)</option>
                        <option>Coordinated Universal Time (UTC)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Currency</label>
                      <select className="w-full bg-[#12172f] border border-[#1A2142] rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00F0FF] focus:border-[#00F0FF]">
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                        <option>GBP (£)</option>
                        <option>JPY (¥)</option>
                        <option>CAD ($)</option>
                      </select>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="darkMode" defaultChecked className="w-4 h-4 bg-[#12172f] border-[#1A2142] rounded checked:bg-[#00F0FF]" />
                      <label htmlFor="darkMode" className="ml-2 text-sm">Dark Mode</label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-6 space-x-3">
                <button className="px-4 py-2 rounded-lg border border-[#1A2142] text-white hover:bg-[#1A2142] transition-colors">
                  Cancel
                </button>
                <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#00F0FF] to-[#FF4DED] text-white hover:opacity-90 transition-opacity">
                  Save Changes
                </button>
              </div>
            </div>
            
            {/* Security & Notifications */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Security */}
              <div className="bg-[#1A2142]/70 backdrop-blur-md rounded-xl p-6 border border-[#1A2142]/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)] animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <h2 className="text-xl font-bold mb-4">Security</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Password</h3>
                    <div className="space-y-3">
                      <button className="w-full py-2 text-sm rounded-lg bg-[#12172f] border border-[#1A2142] hover:bg-[#1A2142] transition-colors">
                        Change Password
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          className="sr-only" 
                          id="twoFactor" 
                          defaultChecked={userData.securitySettings.twoFactor} 
                        />
                        <label 
                          htmlFor="twoFactor" 
                          className={`block w-12 h-6 rounded-full transition-colors duration-300 ease-in-out ${
                            userData.securitySettings.twoFactor ? 'bg-[#00F0FF]' : 'bg-[#1A2142]'
                          }`}
                        >
                          <span 
                            className={`block w-4 h-4 mt-1 ml-1 rounded-full transition-transform duration-300 ease-in-out bg-white transform ${
                              userData.securitySettings.twoFactor ? 'translate-x-6' : ''
                            }`} 
                          />
                        </label>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      Add an extra layer of security by enabling two-factor authentication.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Active Sessions</h3>
                    <p className="text-sm text-gray-400 mb-3">
                      Last login: {userData.securitySettings.lastLogin}
                    </p>
                    <div className="space-y-3">
                      {userData.securitySettings.devices.map((device, index) => (
                        <div key={index} className="flex justify-between items-center bg-[#12172f]/80 p-3 rounded-lg border border-[#1A2142]">
                          <div>
                            <p className="text-sm">{device.name}</p>
                            <p className="text-xs text-gray-400">{device.location}</p>
                          </div>
                          <div className="flex items-center">
                            <span className="text-xs text-gray-400 mr-3">{device.lastActive}</span>
                            {device.lastActive === "Now" && (
                              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            )}
                            <button className="ml-3 text-red-400 text-sm hover:text-red-300">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Notifications */}
              <div className="bg-[#1A2142]/70 backdrop-blur-md rounded-xl p-6 border border-[#1A2142]/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)] animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <h2 className="text-xl font-bold mb-4">Notifications</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-[#1A2142]">
                    <div>
                      <p className="text-sm">Price Alerts</p>
                      <p className="text-xs text-gray-400">Get notified of significant price movements</p>
                    </div>
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        id="priceAlerts" 
                        defaultChecked={userData.notificationSettings.priceAlerts} 
                      />
                      <label 
                        htmlFor="priceAlerts" 
                        className={`block w-12 h-6 rounded-full transition-colors duration-300 ease-in-out ${
                          userData.notificationSettings.priceAlerts ? 'bg-[#00F0FF]' : 'bg-[#1A2142]'
                        }`}
                      >
                        <span 
                          className={`block w-4 h-4 mt-1 ml-1 rounded-full transition-transform duration-300 ease-in-out bg-white transform ${
                            userData.notificationSettings.priceAlerts ? 'translate-x-6' : ''
                          }`} 
                        />
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-b border-[#1A2142]">
                    <div>
                      <p className="text-sm">New Features</p>
                      <p className="text-xs text-gray-400">Stay updated with new platform features</p>
                    </div>
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        id="newFeatures" 
                        defaultChecked={userData.notificationSettings.newFeatures} 
                      />
                      <label 
                        htmlFor="newFeatures" 
                        className={`block w-12 h-6 rounded-full transition-colors duration-300 ease-in-out ${
                          userData.notificationSettings.newFeatures ? 'bg-[#00F0FF]' : 'bg-[#1A2142]'
                        }`}
                      >
                        <span 
                          className={`block w-4 h-4 mt-1 ml-1 rounded-full transition-transform duration-300 ease-in-out bg-white transform ${
                            userData.notificationSettings.newFeatures ? 'translate-x-6' : ''
                          }`} 
                        />
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-b border-[#1A2142]">
                    <div>
                      <p className="text-sm">Market Updates</p>
                      <p className="text-xs text-gray-400">Daily and weekly market summaries</p>
                    </div>
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        id="marketUpdates" 
                        defaultChecked={userData.notificationSettings.marketUpdates} 
                      />
                      <label 
                        htmlFor="marketUpdates" 
                        className={`block w-12 h-6 rounded-full transition-colors duration-300 ease-in-out ${
                          userData.notificationSettings.marketUpdates ? 'bg-[#00F0FF]' : 'bg-[#1A2142]'
                        }`}
                      >
                        <span 
                          className={`block w-4 h-4 mt-1 ml-1 rounded-full transition-transform duration-300 ease-in-out bg-white transform ${
                            userData.notificationSettings.marketUpdates ? 'translate-x-6' : ''
                          }`} 
                        />
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-b border-[#1A2142]">
                    <div>
                      <p className="text-sm">Security Alerts</p>
                      <p className="text-xs text-gray-400">Login attempts and security notifications</p>
                    </div>
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        id="securityAlerts" 
                        defaultChecked={userData.notificationSettings.securityAlerts} 
                      />
                      <label 
                        htmlFor="securityAlerts" 
                        className={`block w-12 h-6 rounded-full transition-colors duration-300 ease-in-out ${
                          userData.notificationSettings.securityAlerts ? 'bg-[#00F0FF]' : 'bg-[#1A2142]'
                        }`}
                      >
                        <span 
                          className={`block w-4 h-4 mt-1 ml-1 rounded-full transition-transform duration-300 ease-in-out bg-white transform ${
                            userData.notificationSettings.securityAlerts ? 'translate-x-6' : ''
                          }`} 
                        />
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm">Newsletter</p>
                      <p className="text-xs text-gray-400">Monthly newsletter with tips and strategies</p>
                    </div>
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        id="newsletter" 
                        defaultChecked={userData.notificationSettings.newsletter} 
                      />
                      <label 
                        htmlFor="newsletter" 
                        className={`block w-12 h-6 rounded-full transition-colors duration-300 ease-in-out ${
                          userData.notificationSettings.newsletter ? 'bg-[#00F0FF]' : 'bg-[#1A2142]'
                        }`}
                      >
                        <span 
                          className={`block w-4 h-4 mt-1 ml-1 rounded-full transition-transform duration-300 ease-in-out bg-white transform ${
                            userData.notificationSettings.newsletter ? 'translate-x-6' : ''
                          }`} 
                        />
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Notification Channels</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="email" defaultChecked className="w-4 h-4 bg-[#12172f] border-[#1A2142] rounded checked:bg-[#00F0FF]" />
                      <label htmlFor="email" className="text-sm">Email</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="push" defaultChecked className="w-4 h-4 bg-[#12172f] border-[#1A2142] rounded checked:bg-[#00F0FF]" />
                      <label htmlFor="push" className="text-sm">Push Notifications</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="sms" className="w-4 h-4 bg-[#12172f] border-[#1A2142] rounded checked:bg-[#00F0FF]" />
                      <label htmlFor="sms" className="text-sm">SMS</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="inApp" defaultChecked className="w-4 h-4 bg-[#12172f] border-[#1A2142] rounded checked:bg-[#00F0FF]" />
                      <label htmlFor="inApp" className="text-sm">In-App</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'settings':
        // Settings section content
        return <div>Settings Content</div>;
      
      case 'security':
        // Security section content
        return <div>Security Content</div>;
      
      case 'apikeys':
        // API Keys section content
        return <div>API Keys Content</div>;
      
      default:
        return <div>Profile Content</div>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-[#1A2142]/70 backdrop-blur-md rounded-xl p-6 relative border border-[#1A2142]/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00F0FF]/5 to-[#FF4DED]/5 rounded-xl"></div>
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 flex items-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-[#FF4DED]">
              My Profile
            </span>
          </h1>
          
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setActiveSection('profile')} 
              className={`px-4 py-2 rounded-lg transition-all ${
                activeSection === 'profile' 
                  ? 'bg-[#00F0FF]/20 text-[#00F0FF]' 
                  : 'bg-[#12172f] text-gray-400 hover:text-white'
              }`}
            >
              Personal Info
            </button>
            <button 
              onClick={() => setActiveSection('settings')} 
              className={`px-4 py-2 rounded-lg transition-all ${
                activeSection === 'settings' 
                  ? 'bg-[#00F0FF]/20 text-[#00F0FF]' 
                  : 'bg-[#12172f] text-gray-400 hover:text-white'
              }`}
            >
              Settings
            </button>
            <button 
              onClick={() => setActiveSection('security')} 
              className={`px-4 py-2 rounded-lg transition-all ${
                activeSection === 'security' 
                  ? 'bg-[#00F0FF]/20 text-[#00F0FF]' 
                  : 'bg-[#12172f] text-gray-400 hover:text-white'
              }`}
            >
              Security
            </button>
            <button 
              onClick={() => setActiveSection('apikeys')} 
              className={`px-4 py-2 rounded-lg transition-all ${
                activeSection === 'apikeys' 
                  ? 'bg-[#00F0FF]/20 text-[#00F0FF]' 
                  : 'bg-[#12172f] text-gray-400 hover:text-white'
              }`}
            >
              API Keys
            </button>
          </div>
        </div>
      </div>
      
      {/* Content based on active section */}
      {renderContent()}
    </div>
  );
};

export default ProfileContent; 