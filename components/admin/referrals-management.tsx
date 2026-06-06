"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, TrendingUp, DollarSign, Target, Calendar, Search, RefreshCw, Trophy } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

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

export function ReferralsManagement({ searchTerm: initialSearchTerm }: { searchTerm?: string }) {
  const [data, setData] = useState<ReferralsData | null>(null)
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
      fetchReferrals()
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

  const fetchReferrals = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/referrals")
      if (response.ok) {
        const data = await response.json()
        setData(data)
      } else {
        // Mock data
        // setData({...})
        console.error("Failed to fetch referrals: API returned error")
        toast({
          title: "Error",
          description: "Failed to fetch referrals data",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to fetch referrals:", error)
      toast({
        title: "Error",
        description: "Failed to fetch referrals data",
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

  const filteredRecent = data?.recentReferrals.filter(r =>
    r.referrerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.referredUser.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Referrals</h1>
            <p className="text-slate-500 dark:text-slate-400">Program performance</p>
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Referrals Management</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Monitor referral program performance and earnings.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 h-4 w-4" />
            <Input
              placeholder="Search referrals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-9 bg-slate-50 dark:bg-background-dark border-slate-200 dark:border-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:border-primary transition-all text-slate-900 dark:text-white"
            />
          </div>
          <Button variant="outline" size="icon" onClick={fetchReferrals} className="h-9 w-9 text-slate-500 dark:text-slate-400 hover:text-primary border-slate-200 dark:border-slate-800/50 bg-white dark:bg-card-dark">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-slate-200 dark:border-slate-800/30 bg-white dark:bg-card-dark shadow-sm dark:shadow-none hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Referrals</CardTitle>
            <div className="bg-primary/10 p-2 rounded-full border border-primary/20">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{data.totalReferrals.toLocaleString()}</div>
            <div className="flex items-center space-x-2 text-xs text-emerald-450 mt-1">
              <TrendingUp className="h-3 w-3" />
              <span>+{data.referralGrowth}% growth</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-800/30 bg-white dark:bg-card-dark shadow-sm dark:shadow-none hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Referrals</CardTitle>
            <div className="bg-emerald-500/10 p-2 rounded-full border border-emerald-500/20">
              <Target className="h-4 w-4 text-emerald-450" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{data.activeReferrals.toLocaleString()}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {((data.activeReferrals / data.totalReferrals) * 100).toFixed(1)}% of total
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-800/30 bg-white dark:bg-card-dark shadow-sm dark:shadow-none hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Bonus Paid</CardTitle>
            <div className="bg-amber-500/10 p-2 rounded-full border border-amber-500/20">
              <DollarSign className="h-4 w-4 text-amber-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(data.totalBonusPaid)}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Avg: {formatCurrency(data.totalBonusPaid / (data.totalReferrals || 1))}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-800/30 bg-white dark:bg-card-dark shadow-sm dark:shadow-none hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Avg Tree Size</CardTitle>
            <div className="bg-purple-500/10 p-2 rounded-full border border-purple-500/20">
              <Users className="h-4 w-4 text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{data.averageTreeSize}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Levels deep</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Referral Levels */}
        <Card className="border border-slate-200 dark:border-slate-800/30 bg-white dark:bg-card-dark shadow-sm dark:shadow-none">
          <CardHeader className="border-b border-slate-200 dark:border-slate-800/50 pb-4">
            <CardTitle className="text-lg text-slate-900 dark:text-white">Referral Levels</CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">Distribution across referral levels</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-200 dark:divide-slate-800/50">
              {Object.entries(data.levels).map(([level, info]) => (
                <div key={level} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-neutral-dark/40 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center text-primary font-bold text-lg">
                      {level.slice(-1)}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">Level {level.slice(-1)}</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">{info.count} users</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900 dark:text-white">{formatCurrency(info.bonus)}</div>
                    <div className="text-xs text-slate-400 dark:text-slate-500">bonus paid</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Top Performer */}
          <Card className="border border-amber-500/30 shadow-md shadow-amber-500/10 bg-gradient-to-br from-amber-500/10 to-orange-500/5 dark:from-amber-500/20 dark:to-orange-500/10 relative overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <Trophy className="h-5 w-5" />
                Top Performer
              </CardTitle>
              <CardDescription className="text-amber-700/70 dark:text-amber-400/70">Highest earning referrer this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mt-2">
                <div className="w-16 h-16 bg-white dark:bg-card-dark rounded-full flex items-center justify-center shadow-sm border-4 border-amber-100 dark:border-amber-500/30">
                  <Users className="w-8 h-8 text-amber-500" />
                </div>
                <div>
                  <div className="font-bold text-xl text-slate-900 dark:text-white">{data.topReferrer}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-300 font-medium bg-white/50 dark:bg-card-dark/50 px-2 py-0.5 rounded-full inline-block mt-1 border border-amber-200 dark:border-amber-500/20">
                    Champion Referrer
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Trends */}
          <Card className="border border-slate-200 dark:border-slate-800/30 bg-white dark:bg-card-dark shadow-sm dark:shadow-none">
            <CardHeader className="border-b border-slate-200 dark:border-slate-800/50 pb-4">
              <CardTitle className="text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Monthly Trends
              </CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400">Activity via referrals</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {data.monthlyTrends.map((trend, index) => (
                  <div key={trend.month} className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-slate-700 dark:text-slate-300 w-10">{trend.month}</span>
                      <div className="flex-1 mx-3">
                        <Progress value={(trend.referrals / Math.max(...data.monthlyTrends.map(t => t.referrals))) * 100} className="h-2 bg-slate-100 dark:bg-slate-800" />
                      </div>
                      <div className="text-right w-24">
                        <span className="block font-bold text-slate-900 dark:text-white">{trend.referrals}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Referrals */}
      <Card className="border border-slate-200 dark:border-slate-800/30 bg-white dark:bg-card-dark shadow-sm dark:shadow-none">
        <CardHeader className="border-b border-slate-200 dark:border-slate-800/50 pb-4 bg-slate-50/20 dark:bg-neutral-dark/10">
          <CardTitle className="text-lg text-slate-900 dark:text-white">Recent Referrals</CardTitle>
          <CardDescription className="text-slate-500 dark:text-slate-400">Latest referral activities</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50 dark:bg-neutral-dark/30 border-b border-slate-200 dark:border-slate-800/50">
                <TableRow className="border-b border-slate-200 dark:border-slate-800/50 hover:bg-transparent">
                  <TableHead className="pl-6 font-semibold text-slate-600 dark:text-slate-300">Referrer</TableHead>
                  <TableHead className="font-semibold text-slate-600 dark:text-slate-300">Referred User</TableHead>
                  <TableHead className="font-semibold text-slate-600 dark:text-slate-300">Bonus</TableHead>
                  <TableHead className="font-semibold text-slate-600 dark:text-slate-300">Level</TableHead>
                  <TableHead className="font-semibold text-slate-600 dark:text-slate-300">Date</TableHead>
                  <TableHead className="text-right pr-6 font-semibold text-slate-600 dark:text-slate-300">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecent.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-slate-500 dark:text-slate-400">
                      No recent referrals found.
                    </TableCell>
                  </TableRow>
                ) : filteredRecent.map((referral) => (
                  <TableRow key={referral.id} className="border-b border-slate-200 dark:border-slate-800/30 hover:bg-slate-50 dark:hover:bg-neutral-dark/40 transition-colors text-slate-700 dark:text-slate-300">
                    <TableCell className="pl-6 font-medium text-slate-900 dark:text-white">{referral.referrerName}</TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-300">{referral.referredUser}</TableCell>
                    <TableCell className="font-medium text-emerald-600 dark:text-emerald-450">{formatCurrency(referral.bonusAmount)}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                        L{referral.level}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500 dark:text-slate-400">{referral.date}</TableCell>
                    <TableCell className="text-right pr-6">
                      <Badge variant="outline" className={referral.status === 'active' || referral.status === 'completed' ? 'bg-emerald-500/10 text-emerald-450 border-emerald-500/20 font-semibold' : 'bg-slate-500/10 text-slate-400 border-slate-500/20 font-semibold'}>
                        {referral.status}
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
  )
}
