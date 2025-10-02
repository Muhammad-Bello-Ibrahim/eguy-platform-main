"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Share2, TrendingUp, Copy, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ReferralStats {
  totalReferrals: number
  activeReferrals: number
  totalEarnings: number
  referralsByLevel: {
    level1: number
    level2: number
    level3: number
    level4: number
    level5: number
  }
}

export function ReferralStats() {
  const [stats, setStats] = useState<ReferralStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  // Mock referral code - in production, this would come from user session
  const referralCode = "EGUY123"
  const referralLink = `https://eguy.app/signup?ref=${referralCode}`

  useEffect(() => {
    fetchReferralStats()
  }, [])

  const fetchReferralStats = async () => {
    try {
      const response = await fetch("/api/referrals/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Failed to fetch referral stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      toast({
        title: "Copied!",
        description: "Referral link copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy referral link",
        variant: "destructive",
      })
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount)
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Referral Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 animate-pulse">
            <div className="h-20 bg-muted rounded" />
            <div className="h-16 bg-muted rounded" />
            <div className="h-12 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span>ElevateX Referrals</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-primary">{stats?.totalReferrals || 0}</div>
            <div className="text-sm text-muted-foreground">Total Referrals</div>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{formatCurrency(stats?.totalEarnings || 0)}</div>
            <div className="text-sm text-muted-foreground">Total Earnings</div>
          </div>
        </div>

        {/* Level Breakdown */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Referrals by Level</h4>
          {[1, 2, 3, 4, 5].map((level) => (
            <div key={level} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="w-12 justify-center">
                  L{level}
                </Badge>
                <span className="text-sm">Level {level}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">
                  {stats?.referralsByLevel[`level${level}` as keyof typeof stats.referralsByLevel] || 0}
                </span>
                <TrendingUp className="h-3 w-3 text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>

        {/* Referral Link */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Your Referral Link</h4>
          <div className="flex items-center space-x-2">
            <div className="flex-1 p-2 bg-muted rounded text-sm font-mono truncate">{referralLink}</div>
            <Button size="sm" variant="outline" onClick={copyReferralLink}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <Button className="w-full" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share Referral Link
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
