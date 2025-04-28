"use client";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";

// Dashboard Components
import DashboardContent from "./components/DashboardContent";
import PortfolioContent from "./components/PortfolioContent";
import TradingContent from "./components/TradingContent";
import AIAssistantContent from "./components/AIAssistantContent";
import ProfileContent from "./components/ProfileContent";

export default function Dashboard() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/");
    },
  });

  const [activeTab, setActiveTab] = useState("dashboard");
  const [portfolioValue, setPortfolioValue] = useState(87420);
  const [portfolioChange, setPortfolioChange] = useState(6.2);
  const [cryptoData, setCryptoData] = useState([
    { symbol: "BTC", price: 68420, change: 1.2 },
    { symbol: "ETH", price: 3320, change: -0.8 },
    { symbol: "SOL", price: 148, change: 5.3 },
    { symbol: "XRP", price: 0.62, change: -1.5 },
    { symbol: "DOT", price: 7.25, change: 2.1 },
  ]);

  const [watchlist, setWatchlist] = useState([
    { symbol: "AAPL", name: "Apple Inc.", price: 187.45, change: 1.2, sentiment: "bullish" },
    { symbol: "MSFT", name: "Microsoft Corp.", price: 415.32, change: 0.8, sentiment: "bullish" },
    { symbol: "GOOGL", name: "Alphabet Inc.", price: 178.95, change: -0.5, sentiment: "neutral" },
    { symbol: "AMZN", name: "Amazon.com Inc.", price: 182.34, change: 2.1, sentiment: "bullish" },
    { symbol: "TSLA", name: "Tesla, Inc.", price: 880.02, change: 2.4, sentiment: "bullish" },
  ]);

  const [transactions, setTransactions] = useState([
    { id: 1, type: "BUY", symbol: "AAPL", quantity: 10, price: 185.23, total: 1852.3, date: "2023-04-01" },
    { id: 2, type: "SELL", symbol: "MSFT", quantity: 5, price: 410.75, total: 2053.75, date: "2023-04-02" },
    { id: 3, type: "BUY", symbol: "TSLA", quantity: 3, price: 875.64, total: 2626.92, date: "2023-04-03" },
  ]);

  const [news, setNews] = useState([
    { 
      id: 1, 
      title: "Tesla Announces New Battery Technology", 
      summary: "Tesla unveils breakthrough in battery technology that could increase range by 40%.", 
      sentiment: "positive",
      source: "TechCrunch",
      date: "2023-04-03"
    },
    { 
      id: 2, 
      title: "Fed Signals Potential Rate Cuts", 
      summary: "Federal Reserve hints at possible interest rate cuts in the coming months as inflation eases.", 
      sentiment: "positive",
      source: "Bloomberg",
      date: "2023-04-03"
    },
    { 
      id: 3, 
      title: "Apple Faces Regulatory Challenges in EU", 
      summary: "Apple's App Store practices under scrutiny as EU enforces new Digital Markets Act.", 
      sentiment: "negative",
      source: "Financial Times",
      date: "2023-04-02"
    },
  ]);

  // Animation refs
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  // Tab change animation
  useEffect(() => {
    if (sidebarRef.current) {
      sidebarRef.current.classList.add('animate-pulse-once');
      setTimeout(() => {
        if (sidebarRef.current) {
          sidebarRef.current.classList.remove('animate-pulse-once');
        }
      }, 500);
    }
  }, [activeTab]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0A0F24] flex items-center justify-center">
        <div className="w-16 h-16 relative">
          <div className="absolute w-full h-full border-4 border-[#00F0FF]/20 rounded-full"></div>
          <div className="absolute w-full h-full border-t-4 border-[#00F0FF] rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-[#00F0FF]/20 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  const getSentimentEmoji = (sentiment: string) => {
    switch (sentiment) {
      case "bullish": return "🚀";
      case "bearish": return "🔻";
      case "neutral": return "😐";
      default: return "😐";
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "border-green-500";
      case "negative": return "border-red-500";
      case "neutral": return "border-blue-500";
      default: return "border-blue-500";
    }
  };

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardContent 
                portfolioValue={portfolioValue} 
                portfolioChange={portfolioChange} 
                cryptoData={cryptoData} 
                watchlist={watchlist} 
                news={news} 
                transactions={transactions}
                getSentimentEmoji={getSentimentEmoji}
                getSentimentColor={getSentimentColor}
               />;
      case "portfolio":
        return <PortfolioContent portfolioValue={portfolioValue} watchlist={watchlist} />;
      case "trading":
        return <TradingContent cryptoData={cryptoData} />;
      case "ai":
        return <AIAssistantContent news={news} watchlist={watchlist} />;
      case "profile":
        return <ProfileContent />;
      default:
        return <DashboardContent 
                portfolioValue={portfolioValue} 
                portfolioChange={portfolioChange} 
                cryptoData={cryptoData} 
                watchlist={watchlist} 
                news={news} 
                transactions={transactions}
                getSentimentEmoji={getSentimentEmoji}
                getSentimentColor={getSentimentColor}
               />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F24] text-white">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute w-full h-full">
          {[...Array(10)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full opacity-5 animate-float"
              style={{
                width: `${Math.random() * 300 + 100}px`,
                height: `${Math.random() * 300 + 100}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: `rgba(${Math.random() * 100}, ${Math.random() * 150 + 100}, ${Math.random() * 255}, 0.5)`,
                animationDuration: `${Math.random() * 15 + 20}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Glassmorphism Sidebar */}
      <div ref={sidebarRef} className="fixed left-0 top-0 h-screen w-20 md:w-64 bg-[#12172f]/70 backdrop-blur-xl border-r border-[#1A2142] z-40 transition-all duration-300">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 flex items-center justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#FF4DED] flex items-center justify-center">
              <span className="text-white font-bold">TF</span>
            </div>
            <span className="ml-3 text-xl font-bold hidden md:block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-[#FF4DED]">
                Trade-Folio
              </span>
            </span>
          </div>
          
          {/* Navigation */}
          <nav className="mt-8 flex-1">
            <ul className="space-y-2 px-2">
              <li>
                <button 
                  onClick={() => setActiveTab("dashboard")}
                  className={`w-full flex items-center justify-center md:justify-start rounded-xl py-3 px-2 md:px-4 transition-all duration-300 ${
                    activeTab === "dashboard" 
                      ? "bg-[#1A2142] text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.3)]" 
                      : "hover:bg-[#1A2142]/50 hover:text-[#00F0FF]/80"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                  <span className="ml-3 hidden md:block">Dashboard</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab("portfolio")}
                  className={`w-full flex items-center justify-center md:justify-start rounded-xl py-3 px-2 md:px-4 transition-all duration-300 ${
                    activeTab === "portfolio" 
                      ? "bg-[#1A2142] text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.3)]" 
                      : "hover:bg-[#1A2142]/50 hover:text-[#00F0FF]/80"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="ml-3 hidden md:block">Portfolio</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab("trading")}
                  className={`w-full flex items-center justify-center md:justify-start rounded-xl py-3 px-2 md:px-4 transition-all duration-300 ${
                    activeTab === "trading" 
                      ? "bg-[#1A2142] text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.3)]" 
                      : "hover:bg-[#1A2142]/50 hover:text-[#00F0FF]/80"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="ml-3 hidden md:block">Trading</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab("ai")}
                  className={`w-full flex items-center justify-center md:justify-start rounded-xl py-3 px-2 md:px-4 transition-all duration-300 ${
                    activeTab === "ai" 
                      ? "bg-[#1A2142] text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.3)]" 
                      : "hover:bg-[#1A2142]/50 hover:text-[#00F0FF]/80"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="ml-3 hidden md:block">AI Assistant</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center justify-center md:justify-start rounded-xl py-3 px-2 md:px-4 transition-all duration-300 ${
                    activeTab === "profile" 
                      ? "bg-[#1A2142] text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.3)]" 
                      : "hover:bg-[#1A2142]/50 hover:text-[#00F0FF]/80"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="ml-3 hidden md:block">Profile</span>
                </button>
              </li>
            </ul>
          </nav>
          
          {/* User Section */}
          <div className="p-4 border-t border-[#1A2142]">
            <div className="flex items-center">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#FF4DED] flex items-center justify-center text-white font-bold">
                  {session?.user?.name?.charAt(0) || "U"}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0A0F24] animate-pulse"></div>
              </div>
              <div className="ml-3 hidden md:block">
                <p className="text-sm font-medium">{session?.user?.name || "User"}</p>
                <p className="text-xs text-gray-400">{session?.user?.email || "user@example.com"}</p>
              </div>
              <button 
                onClick={() => signOut()}
                className="ml-auto text-gray-400 hover:text-white transition-colors hover:scale-110 transform duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L15.586 9H8a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="ml-20 md:ml-64 p-6 min-h-screen">
        {/* Real-Time Market Ticker */}
        <div className="bg-[#1A2142]/70 backdrop-blur-md rounded-xl p-3 mb-6 overflow-hidden border border-[#1A2142]/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
          <div className="flex gap-8 items-center animate-ticker-slow">
            {[...Array(2)].map((_, outerIndex) => (
              <div key={outerIndex} className="flex gap-8 items-center">
                {cryptoData.map((crypto, index) => (
                  <div key={`${outerIndex}-${index}`} className="flex items-center gap-3">
                    <span className="text-white font-medium">{crypto.symbol}/USD</span>
                    <span className={crypto.change >= 0 ? "text-green-400" : "text-red-400"}>
                      ${crypto.price.toLocaleString()}
                    </span>
                    <span className={`text-sm ${crypto.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {crypto.change >= 0 ? "+" : ""}{crypto.change}%
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        
        {/* Dynamic Tab Content */}
        <div className="animate-fade-in">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}