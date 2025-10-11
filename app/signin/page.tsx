"use client"
import { SigninForm } from "@/components/auth/signin-form"
import Link from "next/link"
import { ArrowLeft, TrendingUp, TrendingDown, Activity, DollarSign, Users, Wallet, BarChart3 } from "lucide-react"
import { useState, useEffect } from "react"

export default function SigninPage() {
  const [data, setData] = useState([
    { label: "Portfolio Value", value: 245000, change: 12.5, trend: "up" },
    { label: "Monthly Income", value: 85000, change: -3.2, trend: "down" },
    { label: "Savings Rate", value: 28, change: 5.1, trend: "up" },
    { label: "Transactions", value: 127, change: 8.7, trend: "up" }
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => prev.map(item => ({
        ...item,
        value: item.value + Math.floor(Math.random() * 1000) - 500,
        change: (Math.random() * 20) - 10
      })))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Left side - Financial Dashboard Animation */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,_rgba(255,255,255,0.1),transparent_50%)]"></div>

        {/* Animated background elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-20 right-20 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-white/10 rounded-full blur-xl animate-pulse delay-500"></div>

        <div className="relative z-10 w-full h-full flex flex-col justify-center">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">eG</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">eGuy Analytics</h2>
                <p className="text-blue-100">Live financial dashboard</p>
              </div>
            </div>
          </div>

          {/* Animated financial metrics */}
          <div className="space-y-6 mb-8">
            {data.map((item, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-100 text-sm font-medium">{item.label}</span>
                  <div className={`flex items-center gap-1 ${item.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    {item.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span className="text-xs font-medium">{item.change > 0 ? '+' : ''}{item.change.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-2">
                  {item.label.includes('₦') || item.label.includes('Rate') ? '' : '₦'}
                  {item.value.toLocaleString()}
                  {item.label.includes('Rate') && '%'}
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${item.trend === 'up' ? 'bg-green-400' : 'bg-red-400'} transition-all duration-1000`}
                    style={{ width: `${Math.max(20, Math.min(100, 50 + item.change * 2))}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Mini charts */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-4 h-4 text-blue-300" />
                <span className="text-blue-100 text-sm font-medium">Growth</span>
              </div>
              <div className="flex items-end gap-1 h-8">
                {[40, 60, 30, 80, 50, 70, 90].map((height, i) => (
                  <div key={i} className="bg-gradient-to-t from-green-400 to-green-300 rounded-sm flex-1" style={{ height: `${height}%` }}></div>
                ))}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-purple-300" />
                <span className="text-blue-100 text-sm font-medium">Activity</span>
              </div>
              <div className="flex items-end gap-1 h-8">
                {[60, 30, 80, 40, 90, 50, 70].map((height, i) => (
                  <div key={i} className="bg-gradient-to-t from-purple-400 to-purple-300 rounded-sm flex-1" style={{ height: `${height}%` }}></div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating stats */}
          <div className="absolute bottom-8 right-8 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">₦2.4M</div>
              <div className="text-xs text-blue-200">Total Volume</div>
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
            <SigninForm />
          </div>
        </div>
      </div>
    </div>
  )
}