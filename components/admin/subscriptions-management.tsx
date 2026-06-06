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
            <Card key={i} className="border border-slate-200 dark:border-slate-800/30 bg-white dark:bg-card-dark shadow-sm dark:shadow-none">
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
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Subscriptions</h1>
            <p className="text-slate-500 dark:text-slate-400">Manage premium plans</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border border-slate-200 dark:border-slate-800/30 bg-white dark:bg-card-dark shadow-sm dark:shadow-none">
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

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Subscriptions</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Manage premium users and subscription tiers.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-9 bg-slate-50 dark:bg-background-dark border-slate-200 dark:border-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:border-primary transition-all text-slate-900 dark:text-white"
            />
          </div>
          <Button variant="outline" size="icon" onClick={fetchSubscriptions} className="h-9 w-9 text-slate-500 dark:text-slate-400 hover:text-primary border-slate-200 dark:border-slate-800/50 bg-white dark:bg-card-dark">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-slate-200 dark:border-slate-800/30 bg-white dark:bg-card-dark shadow-sm dark:shadow-none hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Subscriptions</CardTitle>
            <div className="bg-amber-500/10 p-2 rounded-full border border-amber-500/20">
              <Crown className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{data.totalSubscriptions.toLocaleString()}</div>
            <div className="flex items-center space-x-2 text-xs text-emerald-450 mt-1">
              <TrendingUp className="h-3 w-3" />
              <span>+{data.subscriptionGrowth}% growth</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-800/30 bg-white dark:bg-card-dark shadow-sm dark:shadow-none hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Subscriptions</CardTitle>
            <div className="bg-primary/10 p-2 rounded-full border border-primary/20">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{data.activeSubscriptions.toLocaleString()}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {((data.activeSubscriptions / data.totalSubscriptions) * 100).toFixed(1)}% retention rate
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-800/30 bg-white dark:bg-card-dark shadow-sm dark:shadow-none hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Monthly Revenue</CardTitle>
            <div className="bg-emerald-500/10 p-2 rounded-full border border-emerald-500/20">
              <DollarSign className="h-4 w-4 text-emerald-450" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(data.revenue.monthly)}</div>
            <div className="flex items-center space-x-2 text-xs text-emerald-450 mt-1">
              <TrendingUp className="h-3 w-3" />
              <span>+{data.revenue.growth}% growth</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-800/30 bg-white dark:bg-card-dark shadow-sm dark:shadow-none hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Yearly Revenue</CardTitle>
            <div className="bg-purple-500/10 p-2 rounded-full border border-purple-500/20">
              <Calendar className="h-4 w-4 text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(data.revenue.yearly)}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Projected annual revenue
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Subscription Tiers */}
        {Object.entries(data.tiers).map(([tier, info]) => (
          <Card key={tier} className="border border-slate-200 dark:border-slate-800/30 bg-white dark:bg-card-dark shadow-sm dark:shadow-none hover:shadow-md transition-all group">
            <CardHeader className="border-b border-slate-200 dark:border-slate-800/50 pb-4">
              <CardTitle className="flex items-center justify-between">
                <span className="capitalize text-lg text-slate-800 dark:text-white">{tier}</span>
                <Badge variant="outline" className={tier === "enterprise" ? "bg-slate-900 text-white border-transparent dark:bg-primary/20 dark:text-primary dark:border-primary/30" : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-neutral-dark/40 dark:text-slate-300 dark:border-slate-700"}>
                  {info.count} users
                </Badge>
              </CardTitle>
              <div className="mt-2">
                <span className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(info.price)}</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">/month</span>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3 mb-6">
                {info.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-300">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <div>
                <div className="flex justify-between text-xs mb-2 text-slate-500 dark:text-slate-400">
                  <span>Usage Distribution</span>
                  <span>{((info.count / data.totalSubscriptions) * 100).toFixed(0)}%</span>
                </div>
                <Progress value={(info.count / data.totalSubscriptions) * 100} className="h-1.5 bg-slate-100 dark:bg-slate-800" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Monthly Trends */}
        <Card className="lg:col-span-1 border border-slate-200 dark:border-slate-800/30 bg-white dark:bg-card-dark shadow-sm dark:shadow-none">
          <CardHeader className="border-b border-slate-200 dark:border-slate-800/50 pb-4">
            <CardTitle className="text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Trends
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">Revenue over time</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-200 dark:divide-slate-800/50">
              {data.monthlyTrends.map((trend, index) => (
                <div key={trend.month} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-neutral-dark/40 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center text-primary font-bold text-sm">
                      {trend.month}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">{formatCurrency(trend.revenue)}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{trend.subscriptions} subs</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Subscriptions */}
        <Card className="lg:col-span-2 border border-slate-200 dark:border-slate-800/30 bg-white dark:bg-card-dark shadow-sm dark:shadow-none">
          <CardHeader className="border-b border-slate-200 dark:border-slate-800/50 pb-4 flex flex-row items-center justify-between bg-slate-50/20 dark:bg-neutral-dark/10">
            <div>
              <CardTitle className="text-lg text-slate-900 dark:text-white">Recent Subscriptions</CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400">Latest users upgrading their plans</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="hidden sm:flex border-slate-200 dark:border-slate-800/50 text-slate-700 dark:text-slate-300 bg-white dark:bg-card-dark hover:bg-slate-50 dark:hover:bg-neutral-dark/40">View All</Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50 dark:bg-neutral-dark/30 border-b border-slate-200 dark:border-slate-800/50">
                  <TableRow className="border-b border-slate-200 dark:border-slate-800/50 hover:bg-transparent">
                    <TableHead className="pl-6 font-semibold text-slate-600 dark:text-slate-300">User</TableHead>
                    <TableHead className="font-semibold text-slate-600 dark:text-slate-300">Tier</TableHead>
                    <TableHead className="font-semibold text-slate-600 dark:text-slate-300">Amount</TableHead>
                    <TableHead className="font-semibold text-slate-600 dark:text-slate-300">Date</TableHead>
                    <TableHead className="text-right pr-6 font-semibold text-slate-600 dark:text-slate-300">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecent.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center text-slate-500 dark:text-slate-400">
                        No recent subscriptions found.
                      </TableCell>
                    </TableRow>
                  ) : filteredRecent.map((subscription) => (
                    <TableRow key={subscription.id} className="border-b border-slate-200 dark:border-slate-800/30 hover:bg-slate-50 dark:hover:bg-neutral-dark/40 transition-colors text-slate-700 dark:text-slate-300">
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 font-bold text-xs uppercase border border-slate-200 dark:border-slate-700">
                            {subscription.userName.substring(0, 2)}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white">{subscription.userName}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">{subscription.userEmail}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`capitalize font-normal border ${subscription.tier === 'enterprise' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                          subscription.tier === 'premium' ? 'bg-primary/10 text-primary border-primary/20' :
                            'bg-slate-500/10 text-slate-400 border-slate-500/20'
                          }`}>
                          {subscription.tier}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-slate-900 dark:text-white">
                        {formatCurrency(subscription.amount)}
                      </TableCell>
                      <TableCell className="text-slate-500 dark:text-slate-400 text-sm">
                        {subscription.date}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Badge variant="outline" className={subscription.status === 'active' ? 'bg-emerald-500/10 text-emerald-450 border-emerald-500/20 font-semibold' : 'bg-slate-500/10 text-slate-400 border-slate-500/20 font-semibold'}>
                          {subscription.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
