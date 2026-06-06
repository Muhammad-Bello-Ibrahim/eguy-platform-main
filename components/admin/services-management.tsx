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
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Services</h1>
            <p className="text-slate-500 dark:text-slate-400">Service status and performance</p>
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Service Management</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Configure payment services and monitor performance.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 h-4 w-4" />
            <Input
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-9 bg-slate-50 dark:bg-background-dark border-slate-200 dark:border-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:border-primary transition-all text-slate-900 dark:text-white"
            />
          </div>
          <Button variant="outline" size="icon" onClick={fetchServices} className="h-9 w-9 text-slate-500 dark:text-slate-400 hover:text-primary border-slate-200 dark:border-slate-800/50 bg-white dark:bg-card-dark">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-slate-200 dark:border-slate-800/30 bg-white dark:bg-card-dark shadow-sm dark:shadow-none hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Services</CardTitle>
            <div className="bg-primary/10 p-2 rounded-full border border-primary/20">
              <Settings className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{data.activeServices}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              of {data.totalServices} total services configured
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-800/30 bg-white dark:bg-card-dark shadow-sm dark:shadow-none hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Service Providers</CardTitle>
            <div className="bg-purple-500/10 p-2 rounded-full border border-purple-500/20">
              <Server className="h-4 w-4 text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{data.serviceProviders}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Active integrations running
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-800/30 bg-white dark:bg-card-dark shadow-sm dark:shadow-none hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Transactions</CardTitle>
            <div className="bg-emerald-500/10 p-2 rounded-full border border-emerald-500/20">
              <TrendingUp className="h-4 w-4 text-emerald-450" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{data.totalTransactions.toLocaleString()}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Across all services lifetime
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-800/30 bg-white dark:bg-card-dark shadow-sm dark:shadow-none hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Avg Success Rate</CardTitle>
            <div className="bg-teal-500/10 p-2 rounded-full border border-teal-500/20">
              <Activity className="h-4 w-4 text-teal-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {((data.services.reduce((sum, service) => sum + service.successRate, 0)) / (data.services.length || 1)).toFixed(1)}%
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Performance metric
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Services Overview */}
        <Card className="border border-slate-200 dark:border-slate-800/30 bg-white dark:bg-card-dark shadow-sm dark:shadow-none">
          <CardHeader className="border-b border-slate-200 dark:border-slate-800/50 pb-4">
            <CardTitle className="text-lg text-slate-900 dark:text-white">Services Performance</CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">Real-time performance metrics for each service</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-200 dark:divide-slate-800/50">
              {filteredServices.map((service) => (
                <div key={service.id} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-neutral-dark/40 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm">
                      {getServiceIcon(service.id)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">{service.name}</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        {service.provider}
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <span className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 font-medium">{service.commission}% comm</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${service.successRate > 95 ? 'text-emerald-600 dark:text-emerald-450' : service.successRate > 80 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-450'}`}>
                      {service.successRate}%
                    </div>
                    <div className="text-xs text-slate-400 dark:text-slate-500">{service.totalTransactions.toLocaleString()} txns</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Service Providers */}
        <Card className="border border-slate-200 dark:border-slate-800/30 bg-white dark:bg-card-dark shadow-sm dark:shadow-none">
          <CardHeader className="border-b border-slate-200 dark:border-slate-800/50 pb-4">
            <CardTitle className="text-lg text-slate-900 dark:text-white">Provider Status</CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">Uptime and health monitoring</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-200 dark:divide-slate-800/50">
              {data.providers.map((provider) => (
                <div key={provider.id} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-neutral-dark/40 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-sm ${provider.status === "active" ? "bg-emerald-500/10 border-emerald-500/20" : "bg-red-500/10 border-red-500/20"
                        }`}>
                        <Server className={`w-6 h-6 ${provider.status === "active" ? "text-emerald-450" : "text-red-450"
                          }`} />
                      </div>
                      <span className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white dark:border-card-dark ${provider.status === "active" ? "bg-emerald-500" : "bg-red-500"
                        }`} />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">{provider.name}</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400 max-w-[200px] truncate">{provider.services.join(", ")}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900 dark:text-white">{provider.uptime}% <span className="text-xs font-normal text-slate-400 dark:text-slate-500">uptime</span></div>
                    <div className="text-xs text-slate-400 dark:text-slate-500">{provider.totalTransactions.toLocaleString()} txns processed</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Details Cards Grid */}
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mt-4 px-1">Detailed Metrics</h3>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredServices.map((service) => (
          <Card key={service.id} className="border border-slate-200 dark:border-slate-800/30 bg-white dark:bg-card-dark shadow-sm dark:shadow-none hover:shadow-md transition-all group overflow-hidden">
            <div className={`h-1 w-full ${service.status === 'active' ? 'bg-gradient-to-r from-primary to-blue-500' : 'bg-slate-300 dark:bg-slate-700'
              }`} />
            <CardHeader className="pb-3 border-b border-slate-200 dark:border-slate-800/50 bg-slate-50/30 dark:bg-neutral-dark/10">
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center space-x-3">
                  <div className="bg-white dark:bg-slate-800 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                    {getServiceIcon(service.id)}
                  </div>
                  <span className="text-slate-800 dark:text-white">{service.name}</span>
                </span>
                <Badge variant="outline" className={service.status === "active" ? "bg-emerald-500/10 text-emerald-450 border-emerald-500/20" : "bg-slate-500/10 text-slate-400 border-slate-500/20"}>
                  {service.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xs text-slate-400 dark:text-slate-500 uppercase font-semibold">Volume</span>
                  <div className="font-semibold text-slate-900 dark:text-white">{service.totalTransactions.toLocaleString()}</div>
                </div>
                <div className="space-y-1 text-right">
                  <span className="text-xs text-slate-400 dark:text-slate-500 uppercase font-semibold">Avg Value</span>
                  <div className="font-semibold text-slate-900 dark:text-white">{formatCurrency(service.averageValue)}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Success Rate</span>
                  <span className={`font-bold ${service.successRate > 90 ? 'text-emerald-600 dark:text-emerald-450' : 'text-amber-600 dark:text-amber-400'}`}>{service.successRate}%</span>
                </div>
                <Progress value={service.successRate} className="h-1.5 bg-slate-100 dark:bg-slate-800" indicatorClassName={service.successRate > 90 ? 'bg-emerald-500' : 'bg-amber-500'} />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">Provider: <span className="font-medium text-slate-700 dark:text-slate-300">{service.provider}</span></span>
                <Button variant="ghost" size="sm" className="h-7 text-xs text-primary hover:text-primary hover:bg-primary/10 transition-colors">
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
