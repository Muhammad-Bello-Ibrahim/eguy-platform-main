"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, TrendingUp, Eye, EyeOff, RefreshCw } from "lucide-react"

interface ReferralTreeData {
  user: {
    id: string
    name: string
    referralCode: string
  }
  levels: {
    level1: Array<{ id: string; bonusAmount: number; status: string; createdAt: string }>
    level2: Array<{ id: string; bonusAmount: number; status: string; createdAt: string }>
    level3: Array<{ id: string; bonusAmount: number; status: string; createdAt: string }>
    level4: Array<{ id: string; bonusAmount: number; status: string; createdAt: string }>
    level5: Array<{ id: string; bonusAmount: number; status: string; createdAt: string }>
  }
  summary: {
    totalReferrals: number
    totalEarnings: number
    activeReferrals: number
  }
}

export function ReferralTree() {
  const [treeData, setTreeData] = useState<ReferralTreeData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    fetchReferralTree()
  }, [])

  const fetchReferralTree = async () => {
    try {
      const response = await fetch("/api/referrals/tree")
      if (response.ok) {
        const data = await response.json()
        setTreeData(data)
      }
    } catch (error) {
      console.error("Failed to fetch referral tree:", error)
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

  const getLevelColor = (level: number) => {
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-purple-100 text-purple-800",
      "bg-orange-100 text-orange-800",
      "bg-red-100 text-red-800",
    ]
    return colors[level - 1] || "bg-gray-100 text-gray-800"
  }

  const getLevelBonus = (level: number) => {
    const bonuses = [200, 150, 100, 50, 50] // Basic pack bonuses
    return bonuses[level - 1] || 0
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Referral Tree</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 animate-pulse">
            <div className="h-20 bg-muted rounded" />
            <div className="h-32 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!treeData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Referral Tree</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Unable to load referral tree</p>
            <Button variant="outline" size="sm" onClick={fetchReferralTree} className="mt-2 bg-transparent">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span>Referral Tree</span>
        </CardTitle>
        <Button variant="outline" size="sm" onClick={() => setShowDetails(!showDetails)} className="bg-transparent">
          {showDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-lg font-bold text-primary">{treeData.summary.totalReferrals}</div>
            <div className="text-xs text-muted-foreground">Total Referrals</div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-lg font-bold text-green-600">{formatCurrency(treeData.summary.totalEarnings)}</div>
            <div className="text-xs text-muted-foreground">Total Earnings</div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-lg font-bold text-blue-600">{treeData.summary.activeReferrals}</div>
            <div className="text-xs text-muted-foreground">Active</div>
          </div>
        </div>

        {/* Tree Visualization */}
        <div className="space-y-4">
          {/* Root User */}
          <div className="flex items-center justify-center">
            <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-center">
              <div className="font-medium">{treeData.user.name}</div>
              <div className="text-xs opacity-80">You ({treeData.user.referralCode})</div>
            </div>
          </div>

          {/* Levels */}
          {[1, 2, 3, 4, 5].map((level) => {
            const levelData = treeData.levels[`level${level}` as keyof typeof treeData.levels]
            const levelCount = levelData.length
            const levelEarnings = levelData.reduce((sum, ref) => sum + ref.bonusAmount, 0)

            return (
              <div key={level} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge className={getLevelColor(level)}>Level {level}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {levelCount} referral{levelCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{formatCurrency(levelEarnings)}</span>
                    <TrendingUp className="h-3 w-3 text-muted-foreground" />
                  </div>
                </div>

                {showDetails && levelCount > 0 && (
                  <div className="ml-4 space-y-1">
                    {levelData.slice(0, 3).map((ref, index) => (
                      <div key={index} className="flex items-center justify-between text-xs bg-muted/30 p-2 rounded">
                        <span>Referral #{index + 1}</span>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {ref.status}
                          </Badge>
                          <span className="font-medium">{formatCurrency(ref.bonusAmount)}</span>
                        </div>
                      </div>
                    ))}
                    {levelCount > 3 && (
                      <div className="text-xs text-muted-foreground text-center py-1">
                        +{levelCount - 3} more referrals
                      </div>
                    )}
                  </div>
                )}

                {!showDetails && levelCount > 0 && (
                  <div className="flex justify-center space-x-1">
                    {Array.from({ length: Math.min(levelCount, 10) }).map((_, index) => (
                      <div key={index} className={`w-2 h-2 rounded-full ${getLevelColor(level).split(" ")[0]}`} />
                    ))}
                    {levelCount > 10 && <span className="text-xs text-muted-foreground">+{levelCount - 10}</span>}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Bonus Structure */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-medium mb-3 text-sm">Current Bonus Structure (Basic Pack)</h4>
          <div className="grid grid-cols-5 gap-2 text-xs">
            {[1, 2, 3, 4, 5].map((level) => (
              <div key={level} className="text-center">
                <div className={`w-full py-1 rounded text-xs ${getLevelColor(level)}`}>L{level}</div>
                <div className="mt-1 font-medium">{formatCurrency(getLevelBonus(level))}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
