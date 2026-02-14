"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Smartphone, Zap, Tv, GraduationCap, Wifi, Settings, Activity, TrendingUp, Search, RefreshCw, Server, AlertCircle, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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

export function ServicesManagement({ searchTerm: initialSearchTerm }: { searchTerm?: string }) {
  const [data, setData] = useState<ServicesData | null>(null)
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
      fetchServices()
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

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/services")
      if (response.ok) {
        const data = await response.json()
        setData(data)
      } else {
        // Mock data if API fails
        // setData({...})
        console.error("Failed to fetch services: API returned error")
        toast({
          title: "Error",
          description: "Failed to fetch services data",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to fetch services:", error)
      toast({
        title: "Error",
        description: "Failed to fetch services data",
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

  const getServiceIcon = (serviceId: string) => {
    switch (serviceId) {
      case "airtime":
        return <Smartphone className="w-5 h-5 text-blue-600" />
      case "data":
        return <Wifi className="w-5 h-5 text-purple-600" />
      case "electricity":
        return <Zap className="w-5 h-5 text-amber-600" />
      case "cable":
        return <Tv className="w-5 h-5 text-green-600" />
      case "exam":
        return <GraduationCap className="w-5 h-5 text-orange-600" />
      default:
        return <Settings className="w-5 h-5 text-slate-600" />
    }
  }

  const filteredServices = data?.services.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.provider.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Services</h1>
            <p className="text-slate-500">Service status and performance</p>
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
          <h1 className="text-2xl font-bold text-slate-900">Service Management</h1>
          <p className="text-slate-500 text-sm">Configure payment services and monitor performance.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-9 bg-white border-slate-200"
            />
          </div>
          <Button variant="outline" size="icon" onClick={fetchServices} className="h-9 w-9 bg-white border-slate-200 text-slate-500 hover:text-blue-600">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Active Services</CardTitle>
            <div className="bg-blue-50 p-2 rounded-full">
              <Settings className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{data.activeServices}</div>
            <div className="text-xs text-slate-500 mt-1">
              of {data.totalServices} total services configured
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Service Providers</CardTitle>
            <div className="bg-purple-50 p-2 rounded-full">
              <Server className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{data.serviceProviders}</div>
            <div className="text-xs text-slate-500 mt-1">
              Active integrations running
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Transactions</CardTitle>
            <div className="bg-green-50 p-2 rounded-full">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{data.totalTransactions.toLocaleString()}</div>
            <div className="text-xs text-slate-500 mt-1">
              Across all services lifetime
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Avg Success Rate</CardTitle>
            <div className="bg-teal-50 p-2 rounded-full">
              <Activity className="h-4 w-4 text-teal-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {((data.services.reduce((sum, service) => sum + service.successRate, 0)) / (data.services.length || 1)).toFixed(1)}%
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Performance metric
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Services Overview */}
        <Card className="border-0 shadow-md shadow-slate-200/50">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-lg text-slate-800">Services Performance</CardTitle>
            <CardDescription>Real-time performance metrics for each service</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-50">
              {filteredServices.map((service) => (
                <div key={service.id} className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 shadow-sm">
                      {getServiceIcon(service.id)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{service.name}</div>
                      <div className="text-sm text-slate-500 flex items-center gap-1">
                        {service.provider}
                        <span className="text-slate-300">•</span>
                        <span className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-medium">{service.commission}% comm</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${service.successRate > 95 ? 'text-green-600' : service.successRate > 80 ? 'text-amber-600' : 'text-red-600'}`}>
                      {service.successRate}%
                    </div>
                    <div className="text-xs text-slate-400">{service.totalTransactions.toLocaleString()} txns</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Service Providers */}
        <Card className="border-0 shadow-md shadow-slate-200/50">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-lg text-slate-800">Provider Status</CardTitle>
            <CardDescription>Uptime and health monitoring</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-50">
              {data.providers.map((provider) => (
                <div key={provider.id} className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-sm ${provider.status === "active" ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"
                        }`}>
                        <Server className={`w-6 h-6 ${provider.status === "active" ? "text-green-600" : "text-red-600"
                          }`} />
                      </div>
                      <span className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white ${provider.status === "active" ? "bg-green-500" : "bg-red-500"
                        }`} />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{provider.name}</div>
                      <div className="text-sm text-slate-500 max-w-[200px] truncate">{provider.services.join(", ")}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">{provider.uptime}% <span className="text-xs font-normal text-slate-400">uptime</span></div>
                    <div className="text-xs text-slate-400">{provider.totalTransactions.toLocaleString()} txns processed</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Details Cards Grid */}
      <h3 className="text-lg font-semibold text-slate-800 mt-4 px-1">Detailed Metrics</h3>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredServices.map((service) => (
          <Card key={service.id} className="border-0 shadow-sm hover:shadow-md transition-all group overflow-hidden">
            <div className={`h-1 w-full ${service.status === 'active' ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-slate-300'
              }`} />
            <CardHeader className="pb-3 border-b border-slate-50 bg-slate-50/30">
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center space-x-3">
                  <div className="bg-white p-1.5 rounded-lg border border-slate-100 shadow-sm">
                    {getServiceIcon(service.id)}
                  </div>
                  <span className="text-slate-800">{service.name}</span>
                </span>
                <Badge variant="outline" className={service.status === "active" ? "bg-green-50 text-green-700 border-green-200" : "bg-slate-100 text-slate-500"}>
                  {service.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Volume</span>
                  <div className="font-semibold text-slate-900">{service.totalTransactions.toLocaleString()}</div>
                </div>
                <div className="space-y-1 text-right">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Avg Value</span>
                  <div className="font-semibold text-slate-900">{formatCurrency(service.averageValue)}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Success Rate</span>
                  <span className={`font-bold ${service.successRate > 90 ? 'text-green-600' : 'text-amber-600'}`}>{service.successRate}%</span>
                </div>
                <Progress value={service.successRate} className="h-1.5" indicatorClassName={service.successRate > 90 ? 'bg-green-500' : 'bg-amber-500'} />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-slate-500">Provider: <span className="font-medium text-slate-700">{service.provider}</span></span>
                <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                  Configure
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
