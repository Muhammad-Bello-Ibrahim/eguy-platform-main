"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, TrendingUp, DollarSign, Target, Calendar } from "lucide-react"

interface ReferralsData {
  totalReferrals: number
  activeReferrals: number
  totalBonusPaid: number
  averageTreeSize: number
  topReferrer: string
  referralGrowth: number
  levels: {
    level1: { count: number; bonus: number }
    level2: { count: number; bonus: number }
    level3: { count: number; bonus: number }
    level4: { count: number; bonus: number }
    level5: { count: number; bonus: number }
  }
  recentReferrals: any[]
  monthlyTrends: any[]
}

export function ReferralsManagement({ searchTerm }: { searchTerm?: string }) {
  const [data, setData] = useState<ReferralsData | null>(null)
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
      fetchReferrals()
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

  const fetchReferrals = async () => {
    try {
      const response = await fetch("/api/admin/referrals")
      if (response.ok) {
        const data = await response.json()
        setData(data)
      }
    } catch (error) {
      console.error("Failed to fetch referrals:", error)
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
          <h1 className="text-3xl font-bold text-slate-900">Referrals Management</h1>
          <p className="text-slate-600">Monitor referral program performance and earnings</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalReferrals.toLocaleString()}</div>
            <div className="flex items-center space-x-2 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span>+{data.referralGrowth}% growth</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Referrals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.activeReferrals.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">
              {((data.activeReferrals / data.totalReferrals) * 100).toFixed(1)}% of total
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bonus Paid</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.totalBonusPaid)}</div>
            <div className="text-xs text-muted-foreground">
              Avg: {formatCurrency(data.totalBonusPaid / data.totalReferrals)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Tree Size</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.averageTreeSize}</div>
            <div className="text-xs text-muted-foreground">Levels deep</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Referral Levels */}
        <Card>
          <CardHeader>
            <CardTitle>Referral Levels</CardTitle>
            <CardDescription>Distribution across referral levels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(data.levels).map(([level, info]) => (
              <div key={level} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-700 font-bold text-sm">{level.slice(-1)}</span>
                  </div>
                  <div>
                    <div className="font-medium">Level {level.slice(-1)}</div>
                    <div className="text-sm text-muted-foreground">{info.count} users</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{formatCurrency(info.bonus)}</div>
                  <div className="text-sm text-muted-foreground">bonus</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Performer */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performer</CardTitle>
            <CardDescription>Highest earning referrer this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-lg">{data.topReferrer}</div>
                <div className="text-sm text-muted-foreground">Top referrer</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Monthly Trends</span>
          </CardTitle>
          <CardDescription>Referral activity over the past 5 months</CardDescription>
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
                    <div className="font-medium">{trend.referrals} referrals</div>
                    <div className="text-sm text-muted-foreground">{formatCurrency(trend.bonuses)} in bonuses</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-24">
                    <Progress value={(trend.referrals / Math.max(...data.monthlyTrends.map(t => t.referrals))) * 100} className="h-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Referrals */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Referrals</CardTitle>
          <CardDescription>Latest referral activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.recentReferrals.map((referral) => (
              <div key={referral.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium">{referral.referrerName}</div>
                    <div className="text-sm text-muted-foreground">referred {referral.referredUser}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">{formatCurrency(referral.bonusAmount)}</div>
                  <Badge variant={referral.status === "active" ? "default" : "secondary"}>
                    Level {referral.level}
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
