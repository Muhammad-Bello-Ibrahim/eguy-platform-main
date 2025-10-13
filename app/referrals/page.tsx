"use client"

import { useState } from "react"
import { SubscriptionPacks } from "@/components/referrals/subscription-packs"
import { ReferralTree } from "@/components/referrals/referral-tree"
import { ReferralStats } from "@/components/dashboard/referral-stats"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Users, Crown, BarChart3 } from "lucide-react"
import Link from "next/link"

export default function ReferralsPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleSubscriptionSuccess = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">eG</span>
              </div>
              <span className="text-xl font-bold text-primary">eGuy</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-balance mb-2">ElevateX Referral System</h1>
          <p className="text-muted-foreground">
            Build your network, earn passive income, and elevate your financial freedom
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="tree" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Referral Tree</span>
            </TabsTrigger>
            <TabsTrigger value="packs" className="flex items-center space-x-2">
              <Crown className="h-4 w-4" />
              <span>Subscription Packs</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <ReferralStats key={refreshKey} />
              <div className="space-y-6">
                <ReferralTree key={refreshKey} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tree" className="space-y-6">
            <ReferralTree key={refreshKey} />
          </TabsContent>

          <TabsContent value="packs" className="space-y-6">
            <SubscriptionPacks onSubscriptionSuccess={handleSubscriptionSuccess} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
