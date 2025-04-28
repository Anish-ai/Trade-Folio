"use client";
import { useEffect, useState, useRef } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [typedText, setTypedText] = useState("");
  const fullText = "AI-Driven Trading, Simplified for Everyone";
  const typingRef = useRef(0);

  useEffect(() => {
    const typeText = () => {
      if (typingRef.current < fullText.length) {
        setTypedText(fullText.substring(0, typingRef.current + 1));
        typingRef.current += 1;
        setTimeout(typeText, 100);
      }
    };
    
    typeText();
    
    return () => {
      typingRef.current = fullText.length;
    };
  }, []);

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0A0F24]">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0F24] via-[#162252] to-[#0A0F24] animate-gradient-xy overflow-hidden">
          {/* Floating elements */}
          <div className="absolute w-full h-full">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full opacity-20 animate-float"
                style={{
                  width: `${Math.random() * 200 + 50}px`,
                  height: `${Math.random() * 200 + 50}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  background: `rgba(${Math.random() * 100}, ${Math.random() * 150 + 100}, ${Math.random() * 255}, 0.5)`,
                  animationDuration: `${Math.random() * 10 + 15}s`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8">
            <span>Trade</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-[#FF4DED]"> Smarter</span>
          </h1>
          
          <h2 className="text-2xl md:text-4xl font-medium text-white h-16 mb-12">
            {typedText}
            <span className="animate-blink">|</span>
          </h2>

          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="group relative px-8 py-4 font-medium text-white bg-gradient-to-r from-[#00F0FF] to-[#FF4DED] rounded-full overflow-hidden shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,240,255,0.8)] hover:scale-105"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              )}
              <span>{isLoading ? "Signing in..." : "Get Started with Google"}</span>
            </span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </button>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-20 px-4 bg-[#0D1329]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-16">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-[#FF4DED]">
              Cutting-Edge
            </span> Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="group relative bg-gradient-to-b from-[#1A2142] to-[#0F1428] p-6 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] hover:scale-105 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(0,240,255,0.1)] to-transparent opacity-0 group-hover:opacity-100 animate-shine"></div>
              <div className="h-32 mb-6 flex items-center justify-center">
                <div className="w-24 h-24 relative flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-[#00F0FF] opacity-10 animate-pulse"></div>
                  <div className="relative z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#00F0FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2a10 10 0 1 0 10 10H12V2Z"></path>
                      <path d="M21.6 9.5A10 10 0 0 0 12.5.4"></path>
                    </svg>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Real-Time AI Predictions</h3>
              <p className="text-blue-100 mb-4">Advanced neural networks analyze market trends to provide accurate forecasts and insights.</p>
            </div>

            {/* Feature Card 2 */}
            <div className="group relative bg-gradient-to-b from-[#1A2142] to-[#0F1428] p-6 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,77,237,0.3)] hover:scale-105 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(255,77,237,0.1)] to-transparent opacity-0 group-hover:opacity-100 animate-shine"></div>
              <div className="h-32 mb-6 flex items-center justify-center">
                <div className="w-24 h-24 relative flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-[#FF4DED] opacity-10 animate-pulse"></div>
                  <div className="relative z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FF4DED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22V2"></path>
                      <path d="M5 12H2"></path>
                      <path d="M22 12h-3"></path>
                      <path d="m17 7-5 5-5-5"></path>
                      <path d="m17 17-5-5-5 5"></path>
                    </svg>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Virtual Portfolio Sandbox</h3>
              <p className="text-blue-100 mb-4">Test trading strategies risk-free with our advanced simulation environment.</p>
            </div>

            {/* Feature Card 3 */}
            <div className="group relative bg-gradient-to-b from-[#1A2142] to-[#0F1428] p-6 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,140,0,0.3)] hover:scale-105 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(255,140,0,0.1)] to-transparent opacity-0 group-hover:opacity-100 animate-shine"></div>
              <div className="h-32 mb-6 flex items-center justify-center">
                <div className="w-24 h-24 relative flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-[#FF8C00] opacity-10 animate-pulse"></div>
                  <div className="relative z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FF8C00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2v8"></path>
                      <path d="m4.93 10.93 1.41 1.41"></path>
                      <path d="M2 18h2"></path>
                      <path d="M20 18h2"></path>
                      <path d="m19.07 10.93-1.41 1.41"></path>
                      <path d="M22 22H2"></path>
                      <path d="m16 6-4 4-4-4"></path>
                      <path d="M16 18a4 4 0 0 0-8 0"></path>
                    </svg>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Smart Risk Analytics</h3>
              <p className="text-blue-100 mb-4">Visualize and manage your exposure with our intelligent risk assessment tools.</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Capabilities Section */}
      <section className="py-20 px-4 bg-[#0A0F24]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                Experience AI Trading
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-[#FF4DED]">
                  Intelligence
                </span>
              </h2>
              <p className="text-blue-100 mb-8 text-lg">
                Type any stock symbol to see our AI's real-time analysis and predictions.
              </p>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Try typing 'TSLA'"
                  className="w-full bg-[#1A2142] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0FF]"
                  defaultValue="TSLA"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#00F0FF] to-[#FF4DED] text-white px-4 py-1 rounded-md">
                  Analyze
                </button>
              </div>
            </div>
            
            <div className="bg-[#1A2142] p-6 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">Tesla, Inc. (TSLA)</h3>
                  <p className="text-green-400">$880.02 <span className="ml-1">+2.4%</span></p>
                </div>
                <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                  Buy Signal
                </div>
              </div>
              
              <div className="h-48 mb-4 bg-gradient-to-r from-[#1A2142] to-[#0F1428] rounded overflow-hidden relative">
                <div className="absolute inset-0 opacity-50">
                  <svg viewBox="0 0 500 200" className="w-full h-full">
                    <path d="M 0,100 C 150,50 300,150 500,100" fill="none" stroke="#00F0FF" strokeWidth="2"></path>
                    <path d="M 0,100 C 150,180 250,50 500,100" fill="none" stroke="#FF4DED" strokeWidth="2" strokeDasharray="5,5"></path>
                  </svg>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#1A2142] to-transparent"></div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-[#0F1428] p-3 rounded-lg">
                  <p className="text-sm text-blue-100 mb-1">AI Confidence</p>
                  <p className="text-xl font-bold text-white">87%</p>
                </div>
                <div className="bg-[#0F1428] p-3 rounded-lg">
                  <p className="text-sm text-blue-100 mb-1">Target Price</p>
                  <p className="text-xl font-bold text-green-400">$950</p>
                </div>
                <div className="bg-[#0F1428] p-3 rounded-lg">
                  <p className="text-sm text-blue-100 mb-1">Time Frame</p>
                  <p className="text-xl font-bold text-white">30 days</p>
                </div>
              </div>
              
              <button className="w-full bg-gradient-to-r from-[#00F0FF] to-[#FF4DED] text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
                View Full Analysis
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Market Ticker */}
      <footer className="py-6 px-4 bg-[#0D1329] border-t border-[#1A2142]">
        <div className="max-w-6xl mx-auto">
          <div className="overflow-hidden mb-8">
            <div className="animate-ticker flex gap-8 items-center">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex gap-8 items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-white">BTC/USD</span>
                    <span className="text-green-400">$68,420</span>
                    <span className="text-green-400 text-sm">+1.2%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white">ETH/USD</span>
                    <span className="text-red-400">$3,320</span>
                    <span className="text-red-400 text-sm">-0.8%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white">NASDAQ</span>
                    <span className="text-green-400">16,245</span>
                    <span className="text-green-400 text-sm">+0.5%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white">S&P 500</span>
                    <span className="text-green-400">4,890</span>
                    <span className="text-green-400 text-sm">+0.3%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white">USD/JPY</span>
                    <span className="text-red-400">148.75</span>
                    <span className="text-red-400 text-sm">-0.4%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-blue-100">© 2023 Trade-Folio. All rights reserved.</p>
            <button
              onClick={handleGoogleSignIn}
              className="group relative px-6 py-3 font-medium text-white bg-gradient-to-r from-[#00F0FF] to-[#FF4DED] rounded-full overflow-hidden shadow-[0_0_15px_rgba(0,240,255,0.5)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,240,255,0.8)]"
            >
              <span className="relative z-10">Start Free Trial</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

// NEXTAUTH_URL=http://localhost:3000
// NEXTAUTH_SECRET=8f42a73d6f1e3725b4c9234e8b58436c9d8913ecf453f7c92a7b551ef9385f2b
// GOOGLE_CLIENT_ID=434171448237-u06a0lqgrglu1d6b29mhovngc6efq69m.apps.googleusercontent.com
// GOOGLE_CLIENT_SECRET=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