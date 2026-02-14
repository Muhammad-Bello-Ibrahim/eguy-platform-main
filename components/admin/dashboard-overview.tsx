"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Wallet,
  TrendingUp,
  DollarSign,
  Activity,
  UserCheck,
  AlertTriangle,
  RefreshCw,
  Settings,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Smartphone,
  Wifi,
  BarChart3
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts'

interface AdminStats {
  users: {
    total: number
    active: number
    suspended: number
    newThisMonth: number
    growth: number
  }
  financial: {
    totalDeposits: number
    totalWithdrawals: number
    pendingWithdrawals: number
    netRevenue: number
    monthlyRevenue: number
    totalUsersFund: number
    profitMargin: number
    revenueGrowth: number
  }
  referrals: {
    totalReferrals: number
    activeReferrals: number
    totalBonusPaid: number
    averageTreeSize: number
    topReferrer: string
    referralGrowth: number
  }
  transactions: {
    totalTransactions: number
    successfulTransactions: number
    failedTransactions: number
    successRate: number
    averageTransactionValue: number
  }
  services?: {
    airtimeTransactions: number
    dataTransactions: number
    billPayments: number
    subscriptions: number
    mostPopularService: string
  }
}

// Mock data for charts since the API only returns aggregate stats
const revenueData = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 2000 },
  { name: 'Apr', revenue: 2780 },
  { name: 'May', revenue: 1890 },
  { name: 'Jun', revenue: 2390 },
  { name: 'Jul', revenue: 3490 },
]

const userGrowthData = [
  { name: 'Jan', users: 400 },
  { name: 'Feb', users: 300 },
  { name: 'Mar', users: 200 },
  { name: 'Apr', users: 278 },
  { name: 'May', users: 189 },
  { name: 'Jun', users: 239 },
  { name: 'Jul', users: 349 },
]

export function DashboardOverview({ searchTerm }: { searchTerm?: string }) {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)

  // Prevent hydration mismatch by only checking session after client-side mount
  React.useEffect(() => {
    setIsClient(true)
  }, [])

  // Get user from sessionStorage (or context/provider in production)
  const user = typeof window !== "undefined" ? JSON.parse(window.sessionStorage.getItem("user") || "null") : null;

  useEffect(() => {
    if (isClient) {
      fetchStats()
    }
  }, [isClient])

  if (!isClient) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-8 bg-slate-100 rounded w-1/2" />
                  <div className="h-3 bg-slate-100 rounded w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return <div className="p-4 text-red-600 bg-red-50 rounded-lg border border-red-100">Access denied: Admins only.</div>;
  }

  const fetchStats = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/stats")
      if (response.ok) {
        const data = await response.json()
        console.log("Received stats from API:", data)

        // Check if we got real data (not all zeros)
        // const hasRealData = data.users.total > 0 || data.financial.totalDeposits > 0 || data.transactions.totalTransactions > 0

        // if (hasRealData) {
        //   console.log("Using real data from API")
        setStats(data)
        // } else {
        //   console.warn("API returned only zeros, using mock data for development")
        //   setStats(...)
        // }
      } else {
        console.error("API returned error:", response.status, response.statusText)
        throw new Error(`API error: ${response.status}`)
      }
    } catch (error) {
      console.error("Failed to fetch admin stats:", error)
      // Use mock data as fallback
      // setStats(...)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-NG").format(num)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-8 bg-slate-100 rounded w-1/2" />
                  <div className="h-3 bg-slate-100 rounded w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-96 bg-white rounded-xl shadow-sm border border-slate-100">
        <div className="text-center">
          <div className="bg-red-50 p-4 rounded-full inline-flex mb-4">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">Failed to load data</h3>
          <p className="text-slate-500 mb-6">We couldn't fetch the latest dashboard statistics.</p>
          <Button onClick={fetchStats} className="bg-blue-600 hover:bg-blue-700 text-white">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500 text-sm mt-1">Here's what's happening on your platform today.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="bg-white hover:bg-slate-50 text-slate-700 border-slate-200">
            <Settings className="h-4 w-4 mr-2" />
            Customize
          </Button>
          <Button onClick={fetchStats} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-200">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Primary Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Users Card */}
        <Card className="border-0 shadow-md shadow-slate-200/50 hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
          <div className="absolute right-0 top-0 h-32 w-32 bg-blue-50 rounded-full translate-x-8 -translate-y-8 opacity-50 group-hover:scale-110 transition-transform duration-500" />
          <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                <Users className="h-6 w-6" />
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" />
                {stats.users.growth}%
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Total Users</p>
              <h3 className="text-3xl font-bold text-slate-900">{formatNumber(stats.users.total)}</h3>
            </div>
          </CardContent>
        </Card>

        {/* Net Revenue Card */}
        <Card className="border-0 shadow-md shadow-slate-200/50 hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
          <div className="absolute right-0 top-0 h-32 w-32 bg-purple-50 rounded-full translate-x-8 -translate-y-8 opacity-50 group-hover:scale-110 transition-transform duration-500" />
          <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
                <Wallet className="h-6 w-6" />
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" />
                {stats.financial.revenueGrowth}%
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Net Revenue</p>
              <h3 className="text-3xl font-bold text-slate-900">{formatCurrency(stats.financial.netRevenue)}</h3>
            </div>
          </CardContent>
        </Card>

        {/* Active Referrals Card */}
        <Card className="border-0 shadow-md shadow-slate-200/50 hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
          <div className="absolute right-0 top-0 h-32 w-32 bg-amber-50 rounded-full translate-x-8 -translate-y-8 opacity-50 group-hover:scale-110 transition-transform duration-500" />
          <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
                <Activity className="h-6 w-6" />
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" />
                {stats.referrals.referralGrowth}%
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Active Referrals</p>
              <h3 className="text-3xl font-bold text-slate-900">{formatNumber(stats.referrals.activeReferrals)}</h3>
            </div>
          </CardContent>
        </Card>

        {/* Success Rate Card */}
        <Card className="border-0 shadow-md shadow-slate-200/50 hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
          <div className="absolute right-0 top-0 h-32 w-32 bg-emerald-50 rounded-full translate-x-8 -translate-y-8 opacity-50 group-hover:scale-110 transition-transform duration-500" />
          <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
                <UserCheck className="h-6 w-6" />
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Stable
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Transaction Success</p>
              <h3 className="text-3xl font-bold text-slate-900">{stats.transactions.successRate}%</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue performance over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} tickFormatter={(value) => `₦${value / 1000}k`} />
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#6366f1' }}
                    formatter={(value: number) => [`₦${value}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#8884d8" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-0 shadow-sm">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>New user registrations by month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userGrowthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                  <Tooltip
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="users" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* User Stats Detail */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-base">
              <Users className="h-5 w-5 text-blue-500" />
              <span>User Demographics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0 hover:bg-slate-50 px-2 rounded-md transition-colors">
              <span className="text-sm font-medium text-slate-600">Active Users</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-slate-900">{formatNumber(stats.users.active)}</span>
                <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-200 border-0">
                  72%
                </Badge>
              </div>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0 hover:bg-slate-50 px-2 rounded-md transition-colors">
              <span className="text-sm font-medium text-slate-600">Suspended Users</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-slate-900">{formatNumber(stats.users.suspended)}</span>
                <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-200 border-0">
                  Alert
                </Badge>
              </div>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0 hover:bg-slate-50 px-2 rounded-md transition-colors">
              <span className="text-sm font-medium text-slate-600">New This Month</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-slate-900">{formatNumber(stats.users.newThisMonth)}</span>
                <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-0">
                  New
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Stats Detail */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-base">
              <CreditCard className="h-5 w-5 text-purple-500" />
              <span>Financial Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0 hover:bg-slate-50 px-2 rounded-md transition-colors">
              <span className="text-sm font-medium text-slate-600">Total Deposits</span>
              <span className="font-medium text-green-600">{formatCurrency(stats.financial.totalDeposits)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0 hover:bg-slate-50 px-2 rounded-md transition-colors">
              <span className="text-sm font-medium text-slate-600">Total Withdrawals</span>
              <span className="font-medium text-red-600">{formatCurrency(stats.financial.totalWithdrawals)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0 hover:bg-slate-50 px-2 rounded-md transition-colors">
              <span className="text-sm font-medium text-slate-600">Pending Withdrawals</span>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                  {formatCurrency(stats.financial.pendingWithdrawals)}
                </Badge>
              </div>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0 hover:bg-slate-50 px-2 rounded-md transition-colors">
              <span className="text-sm font-medium text-slate-600">Users Fund Balance</span>
              <span className="font-medium text-blue-600">{formatCurrency(stats.financial.totalUsersFund)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Service Performance */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-base">
              <Activity className="h-5 w-5 text-amber-500" />
              <span>Service Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.services && (
              <>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <Smartphone className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">Airtime</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{formatNumber(stats.services.airtimeTransactions)}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                      <Wifi className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">Data</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{formatNumber(stats.services.dataTransactions)}</span>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Most Popular</span>
                    <Badge className="bg-slate-900 text-white hover:bg-slate-800">{stats.services.mostPopularService}</Badge>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Footer */}
      <Card className="border-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200 overflow-hidden relative">
        <div className="absolute right-0 top-0 h-64 w-64 bg-white opacity-5 rounded-full translate-x-12 -translate-y-12" />
        <div className="absolute left-0 bottom-0 h-32 w-32 bg-white opacity-5 rounded-full -translate-x-8 translate-y-8" />

        <CardHeader>
          <CardTitle className="text-white relative z-10">Quick Actions</CardTitle>
          <CardDescription className="text-blue-100 relative z-10">Common administrative tasks you perform frequently</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm h-auto py-3 justify-start px-4">
              <Users className="h-5 w-5 mr-3 opacity-90" />
              <div className="flex flex-col items-start">
                <span className="font-semibold">Manage Users</span>
                <span className="text-xs text-blue-100 font-normal">View and edit accounts</span>
              </div>
            </Button>
            <Button variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm h-auto py-3 justify-start px-4">
              <Wallet className="h-5 w-5 mr-3 opacity-90" />
              <div className="flex flex-col items-start">
                <span className="font-semibold">Withdrawals</span>
                <span className="text-xs text-blue-100 font-normal">Approve pending requests</span>
              </div>
            </Button>
            <Button variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm h-auto py-3 justify-start px-4">
              <BarChart3 className="h-5 w-5 mr-3 opacity-90" />
              <div className="flex flex-col items-start">
                <span className="font-semibold">Reports</span>
                <span className="text-xs text-blue-100 font-normal">Generate analytics</span>
              </div>
            </Button>
            <Button variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm h-auto py-3 justify-start px-4">
              <Settings className="h-5 w-5 mr-3 opacity-90" />
              <div className="flex flex-col items-start">
                <span className="font-semibold">Settings</span>
                <span className="text-xs text-blue-100 font-normal">System configuration</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

