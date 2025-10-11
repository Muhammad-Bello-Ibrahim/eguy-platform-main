"use client"
import { ResetRequestForm } from "@/components/auth/reset-request-form"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, TrendingUp, TrendingDown, Activity, DollarSign, Users, Wallet, BarChart3, Shield, Lock, AlertTriangle } from "lucide-react"
import { useState, useEffect } from "react"

export default function ResetPasswordPage() {
  const params = useSearchParams()
  const token = params.get("token") || ""

  const [securityMetrics, setSecurityMetrics] = useState([
    { label: "Active Sessions", value: 1247, change: 8.3, trend: "up" },
    { label: "Failed Logins", value: 3, change: -45.2, trend: "down" },
    { label: "Security Score", value: 94, change: 2.1, trend: "up" },
    { label: "Protected Accounts", value: 50123, change: 12.5, trend: "up" }
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setSecurityMetrics(prev => prev.map(item => ({
        ...item,
        value: item.value + Math.floor(Math.random() * 10) - 5,
        change: (Math.random() * 20) - 10
      })))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  if (token) {
    return (
      <div className="min-h-screen w-full flex bg-gradient-to-br from-slate-50 via-white to-slate-100">
        {/* Left side - Security Dashboard */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-red-600 via-orange-600 to-yellow-600 p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,_rgba(255,255,255,0.1),transparent_50%)]"></div>

          {/* Animated background elements */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-20 right-20 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-white/10 rounded-full blur-xl animate-pulse delay-500"></div>

          <div className="relative z-10 w-full h-full flex flex-col justify-center">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Security Center</h2>
                  <p className="text-orange-100">Real-time protection monitoring</p>
                </div>
              </div>
            </div>

            {/* Security metrics */}
            <div className="space-y-6 mb-8">
              {securityMetrics.map((item, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-orange-100 text-sm font-medium">{item.label}</span>
                    <div className={`flex items-center gap-1 ${item.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                      {item.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      <span className="text-xs font-medium">{item.change > 0 ? '+' : ''}{item.change.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">
                    {item.value.toLocaleString()}
                    {item.label.includes('Score') && '/100'}
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

            {/* Security alerts */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-yellow-300" />
                <h3 className="text-lg font-semibold text-white">Security Alerts</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-100 text-sm">All systems operational</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-blue-100 text-sm">Biometric verification active</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-purple-100 text-sm">Encryption protocols updated</span>
                </div>
              </div>
            </div>

            {/* Protection status */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">🔒</div>
                <div className="text-sm font-medium text-white">Account Protected</div>
                <div className="text-xs text-orange-200">Military-grade security</div>
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
              <ResetPasswordForm />
            </div>
          </div>
        </div>
      </div>
    )
  }

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
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Password Recovery</h2>
                <p className="text-blue-100">Secure account access</p>
              </div>
            </div>
          </div>

          {/* Recovery metrics */}
          <div className="space-y-6 mb-8">
            {[
              { label: "Recovery Requests", value: 247, change: -12.3, trend: "down", color: "blue" },
              { label: "Success Rate", value: 98.7, change: 0.5, trend: "up", color: "green" },
              { label: "Avg Response Time", value: 2.3, change: -8.1, trend: "down", color: "purple" },
              { label: "Security Checks", value: 15, change: 3.2, trend: "up", color: "orange" }
            ].map((item, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-100 text-sm font-medium">{item.label}</span>
                  <div className={`flex items-center gap-1 ${item.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    {item.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span className="text-xs font-medium">{item.change > 0 ? '+' : ''}{item.change.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-2">
                  {item.value.toLocaleString()}
                  {item.label.includes('Rate') && '%'}
                  {item.label.includes('Time') && 'min'}
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

          {/* Security features */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-center">
                <Shield className="w-8 h-8 text-blue-300 mx-auto mb-2" />
                <div className="text-sm font-medium text-white">SSL Encrypted</div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-center">
                <Lock className="w-8 h-8 text-purple-300 mx-auto mb-2" />
                <div className="text-sm font-medium text-white">Secure Tokens</div>
              </div>
            </div>
          </div>

          {/* Recovery success */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">✅</div>
              <div className="text-sm font-medium text-white">99.8% Success Rate</div>
              <div className="text-xs text-blue-200">Secure password recovery</div>
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
            <ResetRequestForm />
          </div>
        </div>
      </div>
    </div>
  )
}
