"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, TrendingUp, Users, DollarSign, Calendar, Download, Eye, Filter } from "lucide-react"

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
    byType: { type: string; count: number; amount: number }[]
    failures: { reason: string; count: number }[]
  }
}

export function ReportsManagement({ searchTerm }: { searchTerm?: string }) {
  const [data, setData] = useState<ReportsData | null>(null)
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
      fetchReports()
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

  const fetchReports = async () => {
    try {
      const response = await fetch("/api/admin/reports")
      if (response.ok) {
        const data = await response.json()
        setData(data)
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error)
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
          <h1 className="text-3xl font-bold text-slate-900">Reports & Analytics</h1>
          <p className="text-slate-600">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="bg-transparent">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.summary.totalRevenue)}</div>
            <div className="flex items-center space-x-2 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span>+{data.summary.growthRate}% growth</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.totalUsers.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">
              Registered platform users
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.totalTransactions.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">
              All platform transactions
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.transactions.successRate}%</div>
            <Progress value={data.transactions.successRate} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Revenue by Service */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Service</CardTitle>
            <CardDescription>Revenue breakdown across different services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.revenue.byService.map((service, index) => (
                <div key={service.service} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-blue-500' :
                      index === 1 ? 'bg-purple-500' :
                      index === 2 ? 'bg-green-500' :
                      index === 3 ? 'bg-orange-500' :
                      'bg-pink-500'
                    }`}></div>
                    <span className="font-medium">{service.service}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{formatCurrency(service.amount)}</div>
                    <div className="text-sm text-muted-foreground">{service.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Users by Location */}
        <Card>
          <CardHeader>
            <CardTitle>Users by Location</CardTitle>
            <CardDescription>Geographic distribution of users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.users.byLocation.map((location, index) => (
                <div key={location.location} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-blue-600' :
                      index === 1 ? 'bg-purple-600' :
                      index === 2 ? 'bg-green-600' :
                      index === 3 ? 'bg-orange-600' :
                      'bg-pink-600'
                    }`}></div>
                    <span className="font-medium">{location.location}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{location.count.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">{location.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction Analysis</CardTitle>
          <CardDescription>Detailed breakdown of transaction patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-3">Transaction Types</h4>
              <div className="space-y-3">
                {data.transactions.byType.map((type) => (
                  <div key={type.type} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <BarChart3 className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-medium">{type.type}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{type.count.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">{formatCurrency(type.amount)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Failure Reasons</h4>
              <div className="space-y-3">
                {data.transactions.failures.map((failure) => (
                  <div key={failure.reason} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <span className="font-medium text-red-700">{failure.reason}</span>
                    <Badge variant="destructive">{failure.count}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Monthly Performance Trends</span>
          </CardTitle>
          <CardDescription>Revenue and user growth over the past months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.users.growth.map((month, index) => (
              <div key={month.month} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="font-bold text-blue-700">{month.month}</span>
                  </div>
                  <div>
                    <div className="font-medium">New Users: {month.newUsers}</div>
                    <div className="text-sm text-muted-foreground">Total: {month.total} users</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">
                    +{((month.newUsers / (month.total - month.newUsers)) * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Growth rate</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Report Export Options</CardTitle>
          <CardDescription>Generate and download comprehensive reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Revenue Report
            </Button>
            <Button variant="outline" className="bg-transparent">
              <Users className="h-4 w-4 mr-2" />
              User Analytics
            </Button>
            <Button variant="outline" className="bg-transparent">
              <BarChart3 className="h-4 w-4 mr-2" />
              Transaction Summary
            </Button>
            <Button variant="outline" className="bg-transparent">
              <Eye className="h-4 w-4 mr-2" />
              Custom Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
