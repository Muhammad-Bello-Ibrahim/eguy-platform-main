"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Smartphone, Zap, Tv, GraduationCap, Wifi, Settings, Activity, TrendingUp } from "lucide-react"

interface ServicesData {
  totalServices: number
  activeServices: number
  serviceProviders: number
  totalTransactions: number
  services: {
    id: string
    name: string
    provider: string
    status: string
    totalTransactions: number
    successRate: number
    averageValue: number
    commission: number
  }[]
  providers: {
    id: string
    name: string
    services: string[]
    status: string
    uptime: number
    totalTransactions: number
  }[]
}

export function ServicesManagement({ searchTerm }: { searchTerm?: string }) {
  const [data, setData] = useState<ServicesData | null>(null)
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
      fetchServices()
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

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/admin/services")
      if (response.ok) {
        const data = await response.json()
        setData(data)
      }
    } catch (error) {
      console.error("Failed to fetch services:", error)
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

  const getServiceIcon = (serviceId: string) => {
    switch (serviceId) {
      case "airtime":
        return <Smartphone className="w-5 h-5 text-blue-600" />
      case "data":
        return <Wifi className="w-5 h-5 text-purple-600" />
      case "electricity":
        return <Zap className="w-5 h-5 text-yellow-600" />
      case "cable":
        return <Tv className="w-5 h-5 text-green-600" />
      case "exam":
        return <GraduationCap className="w-5 h-5 text-orange-600" />
      default:
        return <Settings className="w-5 h-5 text-gray-600" />
    }
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
          <h1 className="text-3xl font-bold text-slate-900">Service Management</h1>
          <p className="text-slate-600">Configure payment services and monitor performance</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Services</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.activeServices}</div>
            <div className="text-xs text-muted-foreground">
              {data.totalServices} total services configured
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Service Providers</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.serviceProviders}</div>
            <div className="text-xs text-muted-foreground">
              Active provider integrations
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalTransactions.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">
              Across all services
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Success Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((data.services.reduce((sum, service) => sum + service.successRate, 0)) / data.services.length).toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">
              Across all services
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Services Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Services Overview</CardTitle>
            <CardDescription>Performance metrics for each service</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.services.map((service) => (
              <div key={service.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                    {getServiceIcon(service.id)}
                  </div>
                  <div>
                    <div className="font-medium">{service.name}</div>
                    <div className="text-sm text-muted-foreground">{service.provider}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{service.successRate}%</div>
                  <div className="text-sm text-muted-foreground">{service.totalTransactions.toLocaleString()} txns</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Service Providers */}
        <Card>
          <CardHeader>
            <CardTitle>Service Providers</CardTitle>
            <CardDescription>Provider uptime and transaction volume</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.providers.map((provider) => (
              <div key={provider.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    provider.status === "active" ? "bg-green-100" : "bg-red-100"
                  }`}>
                    <Activity className={`w-5 h-5 ${
                      provider.status === "active" ? "text-green-600" : "text-red-600"
                    }`} />
                  </div>
                  <div>
                    <div className="font-medium">{provider.name}</div>
                    <div className="text-sm text-muted-foreground">{provider.services.join(", ")}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{provider.uptime}%</div>
                  <div className="text-sm text-muted-foreground">{provider.totalTransactions.toLocaleString()} txns</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Service Details */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Service Metrics</CardTitle>
          <CardDescription>Comprehensive performance data for each service</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.services.map((service) => (
              <Card key={service.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-base">
                    <span className="flex items-center space-x-2">
                      {getServiceIcon(service.id)}
                      <span>{service.name}</span>
                    </span>
                    <Badge variant={service.status === "active" ? "default" : "secondary"}>
                      {service.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Transactions</span>
                    <span className="font-medium">{service.totalTransactions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Success Rate</span>
                    <span className="font-medium">{service.successRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Avg Value</span>
                    <span className="font-medium">{formatCurrency(service.averageValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Commission</span>
                    <span className="font-medium">{service.commission}%</span>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Performance</span>
                      <span>{service.successRate}%</span>
                    </div>
                    <Progress value={service.successRate} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Service Management Actions</CardTitle>
          <CardDescription>Common administrative tasks for services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="bg-transparent">
              <Settings className="h-4 w-4 mr-2" />
              Configure Services
            </Button>
            <Button variant="outline" className="bg-transparent">
              <Activity className="h-4 w-4 mr-2" />
              Monitor Providers
            </Button>
            <Button variant="outline" className="bg-transparent">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
            <Button variant="outline" className="bg-transparent">
              <Settings className="h-4 w-4 mr-2" />
              Update Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
