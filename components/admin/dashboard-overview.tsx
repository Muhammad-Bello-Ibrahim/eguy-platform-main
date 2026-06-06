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

  const fetchStats = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/stats")
      if (response.ok) {
        const data = await response.json()
        console.log("Received stats from API:", data)
        setStats(data)
      } else {
        console.error("API returned error:", response.status, response.statusText)
        throw new Error(`API error: ${response.status}`)
      }
    } catch (error) {
      console.error("Failed to fetch admin stats:", error)
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
            <Card key={i} className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800/30 shadow-sm dark:shadow-none">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4" />
                  <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
                  <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return <div className="p-4 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 rounded-lg border border-red-100 dark:border-red-500/20">Access denied: Admins only.</div>;
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800/30 shadow-sm dark:shadow-none">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4" />
                  <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
                  <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-full" />
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
      <div className="flex items-center justify-center h-96 bg-white dark:bg-card-dark rounded-xl shadow-sm dark:shadow-none border border-slate-200 dark:border-slate-800/30">
        <div className="text-center">
          <div className="bg-red-50 dark:bg-red-500/10 p-4 rounded-full inline-flex mb-4">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Failed to load data</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">We couldn't fetch the latest dashboard statistics.</p>
          <Button onClick={fetchStats} className="bg-primary hover:bg-primary/90 text-background-dark font-extrabold shadow-lg shadow-primary/20 transition-all duration-200 active:scale-95 rounded-xl">
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Here's what's happening on your platform today.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border border-slate-200 dark:border-slate-800/50 bg-white dark:bg-card-dark hover:bg-slate-50 dark:hover:bg-neutral-dark text-slate-800 dark:text-slate-200 rounded-xl">
            <Settings className="h-4 w-4 mr-2" />
            Customize
          </Button>
          <Button onClick={fetchStats} size="sm" className="bg-primary hover:bg-primary/90 text-background-dark font-extrabold shadow-lg shadow-primary/20 transition-all duration-200 active:scale-95 rounded-xl">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Primary Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Users Card */}
        <Card className="border border-slate-200 dark:border-slate-800/30 bg-white dark:bg-card-dark shadow-sm hover:shadow-md dark:shadow-none transition-all duration-300 relative overflow-hidden group">
          <div className="absolute right-0 top-0 h-32 w-32 bg-primary/5 rounded-full translate-x-8 -translate-y-8 opacity-50 group-hover:scale-110 transition-transform duration-500" />
          <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary">
                <Users className="h-6 w-6" />
              </div>
              <Badge variant="outline" className="text-emerald-400 bg-emerald-500/10 border-emerald-500/20 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" />
                {stats.users.growth}%
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Users</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{formatNumber(stats.users.total)}</h3>
            </div>
          </CardContent>
        </Card>

        {/* Net Revenue Card */}
        <Card className="border border-slate-200 dark:border-slate-800/30 bg-white dark:bg-card-dark shadow-sm hover:shadow-md dark:shadow-none transition-all duration-300 relative overflow-hidden group">
          <div className="absolute right-0 top-0 h-32 w-32 bg-emerald-500/5 rounded-full translate-x-8 -translate-y-8 opacity-50 group-hover:scale-110 transition-transform duration-500" />
          <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                <Wallet className="h-6 w-6" />
              </div>
              <Badge variant="outline" className="text-emerald-400 bg-emerald-500/10 border-emerald-500/20 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" />
                {stats.financial.revenueGrowth}%
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Net Revenue</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{formatCurrency(stats.financial.netRevenue)}</h3>
            </div>
          </CardContent>
        </Card>

        {/* Active Referrals Card */}
        <Card className="border border-slate-200 dark:border-slate-800/30 bg-white dark:bg-card-dark shadow-sm hover:shadow-md dark:shadow-none transition-all duration-300 relative overflow-hidden group">
          <div className="absolute right-0 top-0 h-32 w-32 bg-amber-500/5 rounded-full translate-x-8 -translate-y-8 opacity-50 group-hover:scale-110 transition-transform duration-500" />
          <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
                <Activity className="h-6 w-6" />
              </div>
              <Badge variant="outline" className="text-emerald-400 bg-emerald-500/10 border-emerald-500/20 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" />
                {stats.referrals.referralGrowth}%
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Active Referrals</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{formatNumber(stats.referrals.activeReferrals)}</h3>
            </div>
          </CardContent>
        </Card>

        {/* Success Rate Card */}
        <Card className="border border-slate-200 dark:border-slate-800/30 bg-white dark:bg-card-dark shadow-sm hover:shadow-md dark:shadow-none transition-all duration-300 relative overflow-hidden group">
          <div className="absolute right-0 top-0 h-32 w-32 bg-teal-500/5 rounded-full translate-x-8 -translate-y-8 opacity-50 group-hover:scale-110 transition-transform duration-500" />
          <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-teal-500/10 rounded-xl text-teal-400">
                <UserCheck className="h-6 w-6" />
              </div>
              <Badge variant="outline" className="text-primary bg-primary/10 border-primary/20">
                Stable
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Transaction Success</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{stats.transactions.successRate}%</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border border-slate-200 dark:border-slate-800/30 bg-white dark:bg-card-dark shadow-sm dark:shadow-none">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white font-bold">Revenue Overview</CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">Monthly revenue performance over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#46F0D2" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#46F0D2" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} tickFormatter={(value) => `₦${value / 1000}k`} />
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#131321', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#46F0D2' }}
                    formatter={(value: number) => [`₦${value}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#46F0D2" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 border border-slate-200 dark:border-slate-800/30 bg-white dark:bg-card-dark shadow-sm dark:shadow-none">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white font-bold">User Growth</CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">New user registrations by month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userGrowthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                  <Tooltip
                    cursor={{ fill: '#334155', opacity: 0.1 }}
                    contentStyle={{ backgroundColor: '#131321', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                  />
                  <Bar dataKey="users" fill="#46F0D2" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* User Stats Detail */}
        <Card className="border border-slate-200 dark:border-slate-800/30 bg-white dark:bg-card-dark shadow-sm dark:shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-base text-slate-900 dark:text-white font-bold">
              <Users className="h-5 w-5 text-primary" />
              <span>User Demographics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-800/30 last:border-0 hover:bg-slate-50 dark:hover:bg-neutral-dark/40 px-2 rounded-md transition-colors">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Users</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-slate-900 dark:text-white">{formatNumber(stats.users.active)}</span>
                <Badge variant="default" className="text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20 border-0">
                  72%
                </Badge>
              </div>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-800/30 last:border-0 hover:bg-slate-50 dark:hover:bg-neutral-dark/40 px-2 rounded-md transition-colors">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Suspended Users</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-slate-900 dark:text-white">{formatNumber(stats.users.suspended)}</span>
                <Badge variant="destructive" className="text-red-400 bg-red-500/10 border-red-500/20 hover:bg-red-500/20 border-0">
                  Alert
                </Badge>
              </div>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-800/30 last:border-0 hover:bg-slate-50 dark:hover:bg-neutral-dark/40 px-2 rounded-md transition-colors">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">New This Month</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-slate-900 dark:text-white">{formatNumber(stats.users.newThisMonth)}</span>
                <Badge variant="secondary" className="text-slate-400 bg-slate-500/10 border-slate-500/20 hover:bg-slate-500/20 border-0">
                  New
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Stats Detail */}
        <Card className="border border-slate-200 dark:border-slate-800/30 bg-white dark:bg-card-dark shadow-sm dark:shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-base text-slate-900 dark:text-white font-bold">
              <CreditCard className="h-5 w-5 text-emerald-400" />
              <span>Financial Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-800/30 last:border-0 hover:bg-slate-50 dark:hover:bg-neutral-dark/40 px-2 rounded-md transition-colors">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Deposits</span>
              <span className="font-semibold text-emerald-400">{formatCurrency(stats.financial.totalDeposits)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-800/30 last:border-0 hover:bg-slate-50 dark:hover:bg-neutral-dark/40 px-2 rounded-md transition-colors">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Withdrawals</span>
              <span className="font-semibold text-red-400">{formatCurrency(stats.financial.totalWithdrawals)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-800/30 last:border-0 hover:bg-slate-50 dark:hover:bg-neutral-dark/40 px-2 rounded-md transition-colors">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Pending Withdrawals</span>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-amber-400 bg-amber-500/10 border-amber-500/20">
                  {formatCurrency(stats.financial.pendingWithdrawals)}
                </Badge>
              </div>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-800/30 last:border-0 hover:bg-slate-50 dark:hover:bg-neutral-dark/40 px-2 rounded-md transition-colors">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Users Fund Balance</span>
              <span className="font-semibold text-primary">{formatCurrency(stats.financial.totalUsersFund)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Service Performance */}
        <Card className="border border-slate-200 dark:border-slate-800/30 bg-white dark:bg-card-dark shadow-sm dark:shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-base text-slate-900 dark:text-white font-bold">
              <Activity className="h-5 w-5 text-amber-400" />
              <span>Service Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.services && (
              <>
                <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-800/30 last:border-0 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-neutral-dark/40">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 text-primary rounded-lg">
                      <Smartphone className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Airtime</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{formatNumber(stats.services.airtimeTransactions)}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-800/30 last:border-0 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-neutral-dark/40">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                      <Wifi className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Data</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{formatNumber(stats.services.dataTransactions)}</span>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800/30">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Most Popular</span>
                    <Badge className="bg-primary text-background-dark font-extrabold hover:bg-primary/95">{stats.services.mostPopularService}</Badge>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Footer */}
      <Card className="border border-primary/20 bg-gradient-to-r from-neutral-dark to-card-dark text-white shadow-lg shadow-primary/5 overflow-hidden relative">
        <div className="absolute right-0 top-0 h-64 w-64 bg-primary/5 opacity-40 rounded-full translate-x-12 -translate-y-12" />
        <div className="absolute left-0 bottom-0 h-32 w-32 bg-primary/5 opacity-40 rounded-full -translate-x-8 translate-y-8" />

        <CardHeader>
          <CardTitle className="text-white relative z-10 font-bold">Quick Actions</CardTitle>
          <CardDescription className="text-slate-400 relative z-10">Common administrative tasks you perform frequently</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="secondary" className="bg-white/5 hover:bg-primary/10 text-slate-200 hover:text-primary border border-white/10 hover:border-primary/20 h-auto py-3 justify-start px-4 transition-all rounded-xl">
              <Users className="h-5 w-5 mr-3 opacity-90" />
              <div className="flex flex-col items-start">
                <span className="font-semibold">Manage Users</span>
                <span className="text-xs text-slate-400 font-normal">View and edit accounts</span>
              </div>
            </Button>
            <Button variant="secondary" className="bg-white/5 hover:bg-primary/10 text-slate-200 hover:text-primary border border-white/10 hover:border-primary/20 h-auto py-3 justify-start px-4 transition-all rounded-xl">
              <Wallet className="h-5 w-5 mr-3 opacity-90" />
              <div className="flex flex-col items-start">
                <span className="font-semibold">Withdrawals</span>
                <span className="text-xs text-slate-400 font-normal">Approve pending requests</span>
              </div>
            </Button>
            <Button variant="secondary" className="bg-white/5 hover:bg-primary/10 text-slate-200 hover:text-primary border border-white/10 hover:border-primary/20 h-auto py-3 justify-start px-4 transition-all rounded-xl">
              <BarChart3 className="h-5 w-5 mr-3 opacity-90" />
              <div className="flex flex-col items-start">
                <span className="font-semibold">Reports</span>
                <span className="text-xs text-slate-400 font-normal">Generate analytics</span>
              </div>
            </Button>
            <Button variant="secondary" className="bg-white/5 hover:bg-primary/10 text-slate-200 hover:text-primary border border-white/10 hover:border-primary/20 h-auto py-3 justify-start px-4 transition-all rounded-xl">
              <Settings className="h-5 w-5 mr-3 opacity-90" />
              <div className="flex flex-col items-start">
                <span className="font-semibold">Settings</span>
                <span className="text-xs text-slate-400 font-normal">System configuration</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
