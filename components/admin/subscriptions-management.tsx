"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Crown, Users, DollarSign, TrendingUp, Calendar, Star, Check, Search, RefreshCw, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

interface SubscriptionsData {
  totalSubscriptions: number
  activeSubscriptions: number
  expiredSubscriptions: number
  subscriptionGrowth: number
  revenue: {
    monthly: number
    yearly: number
    growth: number
  }
  tiers: {
    basic: { count: number; price: number; features: string[] }
    premium: { count: number; price: number; features: string[] }
    enterprise: { count: number; price: number; features: string[] }
  }
  recentSubscriptions: any[]
  monthlyTrends: any[]
}

export function SubscriptionsManagement({ searchTerm: initialSearchTerm }: { searchTerm?: string }) {
  const [data, setData] = useState<SubscriptionsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm || "")
  const { toast } = useToast()

  // Prevent hydration mismatch
  React.useEffect(() => {
    setIsClient(true)
  }, [])

  // Get user from sessionStorage
  const user = typeof window !== "undefined" ? JSON.parse(window.sessionStorage.getItem("user") || "null") : null;

  useEffect(() => {
    if (isClient) {
      fetchSubscriptions()
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

  const fetchSubscriptions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/subscriptions")
      if (response.ok) {
        const data = await response.json()
        setData(data)
      } else {
        // Mock data
        // setData({...})
        console.error("Failed to fetch subscriptions: API returned error")
        toast({
          title: "Error",
          description: "Failed to fetch subscriptions data",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to fetch subscriptions:", error)
      toast({
        title: "Error",
        description: "Failed to fetch subscriptions data",
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

  const filteredRecent = data?.recentSubscriptions.filter(s =>
    s.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Subscriptions</h1>
            <p className="text-slate-500">Manage premium plans</p>
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
          <h1 className="text-2xl font-bold text-slate-900">Subscriptions</h1>
          <p className="text-slate-500 text-sm">Manage premium users and subscription tiers.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-9 bg-white border-slate-200"
            />
          </div>
          <Button variant="outline" size="icon" onClick={fetchSubscriptions} className="h-9 w-9 bg-white border-slate-200 text-slate-500 hover:text-blue-600">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Subscriptions</CardTitle>
            <div className="bg-amber-50 p-2 rounded-full">
              <Crown className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{data.totalSubscriptions.toLocaleString()}</div>
            <div className="flex items-center space-x-2 text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3" />
              <span>+{data.subscriptionGrowth}% growth</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Active Subscriptions</CardTitle>
            <div className="bg-blue-50 p-2 rounded-full">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{data.activeSubscriptions.toLocaleString()}</div>
            <div className="text-xs text-slate-500 mt-1">
              {((data.activeSubscriptions / data.totalSubscriptions) * 100).toFixed(1)}% retention rate
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Monthly Revenue</CardTitle>
            <div className="bg-green-50 p-2 rounded-full">
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{formatCurrency(data.revenue.monthly)}</div>
            <div className="flex items-center space-x-2 text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3" />
              <span>+{data.revenue.growth}% growth</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Yearly Revenue</CardTitle>
            <div className="bg-purple-50 p-2 rounded-full">
              <Calendar className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{formatCurrency(data.revenue.yearly)}</div>
            <div className="text-xs text-slate-500 mt-1">
              Projected annual revenue
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Subscription Tiers */}
        {Object.entries(data.tiers).map(([tier, info]) => (
          <Card key={tier} className="border-0 shadow-sm hover:shadow-md transition-all group">
            <CardHeader className="border-b border-slate-50 pb-4">
              <CardTitle className="flex items-center justify-between">
                <span className="capitalize text-lg text-slate-800">{tier}</span>
                <Badge variant={tier === "enterprise" ? "default" : "secondary"} className={tier === "enterprise" ? "bg-slate-900" : "bg-slate-100 text-slate-600"}>
                  {info.count} users
                </Badge>
              </CardTitle>
              <div className="mt-2">
                <span className="text-2xl font-bold text-slate-900">{formatCurrency(info.price)}</span>
                <span className="text-sm text-slate-500">/month</span>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3 mb-6">
                {info.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 text-sm text-slate-600">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <div>
                <div className="flex justify-between text-xs mb-2 text-slate-500">
                  <span>Usage Distribution</span>
                  <span>{((info.count / data.totalSubscriptions) * 100).toFixed(0)}%</span>
                </div>
                <Progress value={(info.count / data.totalSubscriptions) * 100} className="h-1.5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Monthly Trends */}
        <Card className="lg:col-span-1 border-0 shadow-md shadow-slate-200/50">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Trends
            </CardTitle>
            <CardDescription>Revenue over time</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-50">
              {data.monthlyTrends.map((trend, index) => (
                <div key={trend.month} className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-700 font-bold text-sm">
                      {trend.month}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{formatCurrency(trend.revenue)}</div>
                      <div className="text-xs text-slate-500">{trend.subscriptions} subs</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Subscriptions */}
        <Card className="lg:col-span-2 border-0 shadow-md shadow-slate-200/50">
          <CardHeader className="border-b border-slate-100 pb-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg text-slate-800">Recent Subscriptions</CardTitle>
              <CardDescription>Latest users upgrading their plans</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="hidden sm:flex">View All</Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-b border-slate-100 hover:bg-transparent">
                  <TableHead className="pl-6 font-semibold text-slate-600">User</TableHead>
                  <TableHead className="font-semibold text-slate-600">Tier</TableHead>
                  <TableHead className="font-semibold text-slate-600">Amount</TableHead>
                  <TableHead className="font-semibold text-slate-600">Date</TableHead>
                  <TableHead className="text-right pr-6 font-semibold text-slate-600">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecent.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                      No recent subscriptions found.
                    </TableCell>
                  </TableRow>
                ) : filteredRecent.map((subscription) => (
                  <TableRow key={subscription.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs uppercase">
                          {subscription.userName.substring(0, 2)}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{subscription.userName}</div>
                          <div className="text-xs text-slate-500">{subscription.userEmail}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`capitalize font-normal border-0 ${subscription.tier === 'enterprise' ? 'bg-purple-100 text-purple-700' :
                        subscription.tier === 'premium' ? 'bg-blue-100 text-blue-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                        {subscription.tier}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-slate-900">
                      {formatCurrency(subscription.amount)}
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm">
                      {subscription.date}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'} className={subscription.status === 'active' ? 'bg-green-100 text-green-700 border-0 hover:bg-green-100' : ''}>
                        {subscription.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
