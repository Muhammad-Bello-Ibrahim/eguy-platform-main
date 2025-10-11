"use client"
import { SignupForm } from "@/components/auth/signup-form"
import Link from "next/link"
import { ArrowLeft, TrendingUp, TrendingDown, Activity, DollarSign, Users, Wallet, BarChart3, PiggyBank, Target, Coins } from "lucide-react"
import { useState, useEffect } from "react"

export default function SignupPage() {
  const [savingsData, setSavingsData] = useState([
    { month: "Jan", amount: 5000, target: 10000 },
    { month: "Feb", amount: 7500, target: 10000 },
    { month: "Mar", amount: 6200, target: 10000 },
    { month: "Apr", amount: 8900, target: 10000 },
    { month: "May", amount: 12000, target: 10000 },
    { month: "Jun", amount: 9500, target: 10000 }
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setSavingsData(prev => prev.map(item => ({
        ...item,
        amount: item.amount + Math.floor(Math.random() * 1000) - 500
      })))
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Left side - Financial Dashboard Animation */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,_rgba(255,255,255,0.1),transparent_50%)]"></div>

        {/* Animated background elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-20 right-20 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-white/10 rounded-full blur-xl animate-pulse delay-500"></div>

        <div className="relative z-10 w-full h-full flex flex-col justify-center">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <PiggyBank className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Savings Dashboard</h2>
                <p className="text-green-100">Track your financial growth</p>
              </div>
            </div>
          </div>

          {/* Savings progress chart */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Savings Progress</h3>
            <div className="space-y-3">
              {savingsData.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-12 text-sm text-green-100">{item.month}</div>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs text-green-100 mb-1">
                      <span>₦{item.amount.toLocaleString()}</span>
                      <span>Target: ₦{item.target.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-400 to-green-300 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min(100, (item.amount / item.target) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievement cards */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-yellow-300" />
                <span className="text-green-100 text-sm font-medium">Goals</span>
              </div>
              <div className="text-xl font-bold text-white">3/5</div>
              <div className="text-xs text-green-200">Completed</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Coins className="w-4 h-4 text-yellow-300" />
                <span className="text-green-100 text-sm font-medium">Rewards</span>
              </div>
              <div className="text-xl font-bold text-white">₦12.5K</div>
              <div className="text-xs text-green-200">Earned</div>
            </div>
          </div>

          {/* Referral growth */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-blue-300" />
              <h3 className="text-lg font-semibold text-white">Referral Growth</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-green-100 text-sm">This Month</span>
                <span className="text-white font-bold">+15</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-100 text-sm">Total Referrals</span>
                <span className="text-white font-bold">127</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-100 text-sm">Earnings</span>
                <span className="text-green-400 font-bold">₦8,500</span>
              </div>
            </div>
          </div>

          {/* Floating achievement */}
          <div className="absolute bottom-8 right-8 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">🏆</div>
              <div className="text-xs text-green-200">Top Saver</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Back to home link */}
        <div className="absolute top-6 left-6 z-10">
          <Link href="/" className="group flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors duration-300">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <SignupForm />
          </div>
        </div>
      </div>
    </div>
  )
}