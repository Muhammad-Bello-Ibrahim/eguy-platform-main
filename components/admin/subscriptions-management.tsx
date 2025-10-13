"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Crown, Users, DollarSign, TrendingUp, Calendar, Star } from "lucide-react"

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

export function SubscriptionsManagement({ searchTerm }: { searchTerm?: string }) {
  const [data, setData] = useState<SubscriptionsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)

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
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-8 bg-muted rounded w-1/2" />
                  <div className="h-3 bg-muted rounded w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return <div className="p-4 text-red-600">Access denied: Admins only.</div>;
  }

  const fetchSubscriptions = async () => {
    try {
      const response = await fetch("/api/admin/subscriptions")
      if (response.ok) {
        const data = await response.json()
        setData(data)
      }
    } catch (error) {
      console.error("Failed to fetch subscriptions:", error)
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

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-8 bg-muted rounded w-1/2" />
                  <div className="h-3 bg-muted rounded w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Subscriptions</h1>
          <p className="text-slate-600">Manage premium subscriptions and tiers</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subscriptions</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalSubscriptions.toLocaleString()}</div>
            <div className="flex items-center space-x-2 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span>+{data.subscriptionGrowth}% growth</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.activeSubscriptions.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">
              {((data.activeSubscriptions / data.totalSubscriptions) * 100).toFixed(1)}% retention rate
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.revenue.monthly)}</div>
            <div className="flex items-center space-x-2 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span>+{data.revenue.growth}% growth</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yearly Revenue</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.revenue.yearly)}</div>
            <div className="text-xs text-muted-foreground">
              Projected annual revenue
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Subscription Tiers */}
        {Object.entries(data.tiers).map(([tier, info]) => (
          <Card key={tier}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="capitalize">{tier}</span>
                <Badge variant={tier === "enterprise" ? "default" : "secondary"}>
                  {info.count} users
                </Badge>
              </CardTitle>
              <CardDescription className="text-2xl font-bold text-green-600">
                {formatCurrency(info.price)}/month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {info.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Usage</span>
                  <span>{info.count} users</span>
                </div>
                <Progress value={(info.count / data.totalSubscriptions) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Monthly Trends</span>
          </CardTitle>
          <CardDescription>Subscription and revenue trends over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.monthlyTrends.map((trend, index) => (
              <div key={trend.month} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                    <span className="text-slate-700 font-bold text-sm">{trend.month}</span>
                  </div>
                  <div>
                    <div className="font-medium">{trend.subscriptions} subscriptions</div>
                    <div className="text-sm text-muted-foreground">{formatCurrency(trend.revenue)} revenue</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-24">
                    <Progress value={(trend.subscriptions / Math.max(...data.monthlyTrends.map(t => t.subscriptions))) * 100} className="h-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Subscriptions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Subscriptions</CardTitle>
          <CardDescription>Latest subscription activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.recentSubscriptions.map((subscription) => (
              <div key={subscription.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    subscription.tier === "enterprise" ? "bg-purple-100" :
                    subscription.tier === "premium" ? "bg-blue-100" : "bg-green-100"
                  }`}>
                    <Crown className={`w-5 h-5 ${
                      subscription.tier === "enterprise" ? "text-purple-600" :
                      subscription.tier === "premium" ? "text-blue-600" : "text-green-600"
                    }`} />
                  </div>
                  <div>
                    <div className="font-medium">{subscription.userName}</div>
                    <div className="text-sm text-muted-foreground">{subscription.userEmail}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{formatCurrency(subscription.amount)}</div>
                  <Badge variant={subscription.status === "active" ? "default" : "secondary"}>
                    {subscription.tier} - {subscription.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
