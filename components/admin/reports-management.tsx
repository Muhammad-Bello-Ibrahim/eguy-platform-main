"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, TrendingUp, Users, DollarSign, Calendar, Download, Eye, Filter, ArrowUpRight, ArrowDownRight, CreditCard, Activity } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

interface ReportsData {
  summary: {
    totalRevenue: number
    totalUsers: number
    totalTransactions: number
    growthRate: number
  }
  revenue: {
    daily: { date: string; amount: number }[]
    monthly: { month: string; amount: number }[]
    byService: { service: string; amount: number; percentage: number }[]
  }
  users: {
    byLocation: { location: string; count: number; percentage: number }[]
    byKycStatus: { status: string; count: number; percentage: number }[]
    growth: { month: string; newUsers: number; total: number }[]
  }
  transactions: {
    successRate: number
    averageValue: number
    byType: { name: string; value: number; amount: number }[]
    failures: { reason: string; count: number }[]
  }
}

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

export function ReportsManagement({ searchTerm }: { searchTerm?: string }) {
  const [data, setData] = useState<ReportsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const [dateRange, setDateRange] = useState("30d")
  const { toast } = useToast()

  // Prevent hydration mismatch
  React.useEffect(() => {
    setIsClient(true)
  }, [])

  // Get user from sessionStorage
  const user = typeof window !== "undefined" ? JSON.parse(window.sessionStorage.getItem("user") || "null") : null;

  useEffect(() => {
    if (isClient) {
      fetchReports()
    }
  }, [isClient, dateRange])

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

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/reports?range=${dateRange}`)
      if (response.ok) {
        const data = await response.json()
        setData(data)
      } else {
        // Mock data
        // setData({...})
        console.error("Failed to fetch reports: API returned error")
        toast({
          title: "Error",
          description: "Failed to fetch report data",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error)
      toast({
        title: "Error",
        description: "Failed to fetch report data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-100 shadow-lg rounded-lg">
          <p className="text-sm font-semibold text-slate-900">{label}</p>
          <p className="text-sm text-blue-600">
            {payload[0].name}: {
              payload[0].name.toLowerCase().includes('amount') || payload[0].name.toLowerCase().includes('revenue')
                ? formatCurrency(payload[0].value)
                : payload[0].value.toLocaleString()
            }
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Reports</h1>
            <p className="text-slate-500">Loading analytics...</p>
          </div>
        </div>
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

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports & Analytics</h1>
          <p className="text-slate-500 text-sm">Comprehensive insights into platform performance.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[150px] bg-white border-slate-200">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 3 Months</SelectItem>
              <SelectItem value="1y">Values Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="bg-white border-slate-200 text-slate-600 hover:text-blue-600">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white border-none shadow-md shadow-blue-200">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Revenue</CardTitle>
            <div className="bg-green-50 p-2 rounded-full">
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{formatCurrency(data.summary.totalRevenue)}</div>
            <div className="flex items-center space-x-2 text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3" />
              <span>+{data.summary.growthRate}% growth</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Users</CardTitle>
            <div className="bg-blue-50 p-2 rounded-full">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{data.summary.totalUsers.toLocaleString()}</div>
            <div className="text-xs text-slate-500 mt-1">
              Registered platform users
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Transactions</CardTitle>
            <div className="bg-purple-50 p-2 rounded-full">
              <CreditCard className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{data.summary.totalTransactions.toLocaleString()}</div>
            <div className="text-xs text-slate-500 mt-1">
              All platform transactions
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Success Rate</CardTitle>
            <div className="bg-teal-50 p-2 rounded-full">
              <Activity className="h-4 w-4 text-teal-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{data.transactions.successRate}%</div>
            <Progress value={data.transactions.successRate} className="mt-2 h-1.5" indicatorClassName={data.transactions.successRate > 95 ? 'bg-teal-500' : 'bg-amber-500'} />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="bg-slate-100 p-1 mb-6 rounded-lg w-full sm:w-auto grid sm:inline-grid grid-cols-3 sm:grid-cols-none">
          <TabsTrigger value="revenue" className="rounded-md">Revenue</TabsTrigger>
          <TabsTrigger value="users" className="rounded-md">Users</TabsTrigger>
          <TabsTrigger value="transactions" className="rounded-md">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6 mt-0">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2 border-0 shadow-md shadow-slate-200/50">
              <CardHeader>
                <CardTitle className="text-lg text-slate-800">Revenue Trends</CardTitle>
                <CardDescription>Income over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.revenue.monthly} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} tickFormatter={(value) => `₦${(value / 1000000).toFixed(1)}M`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" name="Revenue" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md shadow-slate-200/50">
              <CardHeader>
                <CardTitle className="text-lg text-slate-800">Revenue by Service</CardTitle>
                <CardDescription>Breakdown by category</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.revenue.byService}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="amount"
                      nameKey="service"
                    >
                      {data.revenue.byService.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-md shadow-slate-200/50">
            <CardHeader>
              <CardTitle className="text-lg text-slate-800">Daily Revenue Performance</CardTitle>
              <CardDescription>Daily transaction volume for the selected period</CardDescription>
            </CardHeader>
            <CardContent className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.revenue.daily}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} minTickGap={30} />
                  <Tooltip cursor={{ fill: '#f1f5f9' }} content={<CustomTooltip />} />
                  <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Daily Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6 mt-0">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-0 shadow-md shadow-slate-200/50">
              <CardHeader>
                <CardTitle className="text-lg text-slate-800">User Growth</CardTitle>
                <CardDescription>New user registrations over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.users.growth}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="newUsers" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="New Users" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md shadow-slate-200/50">
              <CardHeader>
                <CardTitle className="text-lg text-slate-800">User Distribution</CardTitle>
                <CardDescription>By Location and KYC Status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-3">By Location</h4>
                    <div className="space-y-3">
                      {data.users.byLocation.map((loc, i) => (
                        <div key={loc.location} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                            <span>{loc.location}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <Progress value={loc.percentage} className="w-24 h-2" indicatorClassName={`bg-[${COLORS[i % COLORS.length]}]`} />
                            <span className="w-8 text-right text-slate-500">{loc.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-100">
                    <h4 className="text-sm font-medium text-slate-700 mb-3">By KYC Status</h4>
                    <div className="flex gap-2">
                      {data.users.byKycStatus.map((status, i) => (
                        <div key={status.status} className="flex-1 p-3 bg-slate-50 rounded-lg text-center">
                          <div className="text-xs text-slate-500 mb-1">{status.status}</div>
                          <div className="font-bold text-slate-900">{status.percentage}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6 mt-0">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-0 shadow-md shadow-slate-200/50">
              <CardHeader>
                <CardTitle className="text-lg text-slate-800">Transaction Volume by Type</CardTitle>
                <CardDescription>Which services are most used?</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.transactions.byType}
                      cx="50%"
                      cy="50%"
                      innerRadius={0}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      nameKey="name"
                    >
                      {data.transactions.byType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend layout="vertical" verticalAlign="middle" align="right" />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md shadow-slate-200/50">
              <CardHeader>
                <CardTitle className="text-lg text-slate-800">Failed Transactions Analysis</CardTitle>
                <CardDescription>Top reasons for failure</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.transactions.failures.map((fail, i) => (
                    <div key={fail.reason} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-slate-700">{fail.reason}</span>
                        <span className="text-slate-500">{fail.count} failures</span>
                      </div>
                      <Progress value={(fail.count / 500) * 100} className="h-2" indicatorClassName="bg-red-500" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

    </div>
  )
}
