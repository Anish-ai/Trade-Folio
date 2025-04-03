"use client";
import { Card, CardContent } from "@/components/card";
import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Dashboard() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      
      {/* Navbar with User Info and Logout Button */}
      <nav className="flex justify-between items-center bg-white shadow-md p-4 mb-6">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">GenAI Financial Assistant</h1>
          {session?.user?.name && (
            <span className="ml-4 text-gray-600">
              Welcome, {session.user.name}
            </span>
          )}
        </div>
        <button
          onClick={() => signOut()}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
        >
          Logout
        </button>
      </nav>

      {/* Chat Section */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-2">Ask a Financial Question</h2>
          <p className="text-gray-700">
            Q: What is the best investment for beginners?
          </p>
          <p className="mt-2 text-green-700">
            AI: For beginners, mutual funds and index funds are good options
            as they provide diversification and lower risk.
          </p>
        </CardContent>
      </Card>

      {/* Investment Suggestions */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-2">Investment Suggestions</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>Mutual Funds - Good for long-term stability</li>
            <li>Stocks - High risk, high reward</li>
            <li>Fixed Deposits - Safe, but low returns</li>
            <li>Gold ETFs - Hedge against inflation</li>
          </ul>
        </CardContent>
      </Card>

      {/* Market Trends */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-2">Market Trends</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>NIFTY 50: 22,450 (+0.75%)</li>
            <li>SENSEX: 74,500 (+1.1%)</li>
            <li>Bitcoin: $67,500 (-2.3%)</li>
            <li>Gold: ₹58,000 per 10g (+0.4%)</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}