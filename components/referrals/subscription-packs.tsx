"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Check, Crown, Star, Zap, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SubscriptionPacksProps {
  onSubscriptionSuccess: () => void
}

const packs = [
  {
    id: "basic-pack",
    name: "Basic Pack",
    price: 3000,
    description: "Perfect for getting started with referrals",
    icon: Zap,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    features: [
      "Up to 10 direct referrals",
      "₦200 per Level 1 referral",
      "₦150 per Level 2 referral",
      "₦100 per Level 3 referral",
      "₦50 per Level 4 & 5 referrals",
      "Basic support",
    ],
    popular: false,
  },
  {
    id: "growth-pack",
    name: "Growth Pack",
    price: 5000,
    description: "Scale your referral network effectively",
    icon: Star,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    features: [
      "Up to 20 direct referrals",
      "₦300 per Level 1 referral",
      "₦200 per Level 2 referral",
      "₦150 per Level 3 referral",
      "₦100 per Level 4 referral",
      "₦75 per Level 5 referral",
      "Priority support",
    ],
    popular: true,
  },
  {
    id: "expansion-pack",
    name: "Expansion Pack",
    price: 10000,
    description: "For serious network builders",
    icon: Crown,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    features: [
      "Up to 50 direct referrals",
      "₦500 per Level 1 referral",
      "₦350 per Level 2 referral",
      "₦250 per Level 3 referral",
      "₦150 per Level 4 referral",
      "₦100 per Level 5 referral",
      "Premium support",
      "Monthly bonus rewards",
    ],
    popular: false,
  },
  {
    id: "premium-pack",
    name: "Premium Pack",
    price: 20000,
    description: "Maximum earning potential",
    icon: Crown,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    features: [
      "Up to 100 direct referrals",
      "₦800 per Level 1 referral",
      "₦600 per Level 2 referral",
      "₦400 per Level 3 referral",
      "₦250 per Level 4 referral",
      "₦150 per Level 5 referral",
      "VIP support",
      "Weekly bonus rewards",
      "Exclusive training materials",
    ],
    popular: false,
  },
  {
    id: "pinnacle-pack",
    name: "Pinnacle Pack",
    price: 50000,
    description: "Ultimate package for top earners",
    icon: Crown,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    features: [
      "Up to 200 direct referrals",
      "₦1,500 per Level 1 referral",
      "₦1,000 per Level 2 referral",
      "₦750 per Level 3 referral",
      "₦500 per Level 4 referral",
      "₦300 per Level 5 referral",
      "Dedicated account manager",
      "Daily bonus rewards",
      "Exclusive events access",
      "Custom referral tools",
    ],
    popular: false,
  },
]

export function SubscriptionPacks({ onSubscriptionSuccess }: SubscriptionPacksProps) {
  const [selectedPack, setSelectedPack] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const handleSubscribe = async (packId: string) => {
    setError("")
    setIsLoading(true)
    setSelectedPack(packId)

    try {
      const response = await fetch("/api/referrals/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ packId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Subscription failed")
      }

      toast({
        title: "Subscription Successful!",
        description: `You've successfully subscribed to ${data.pack.name}`,
      })

      onSubscriptionSuccess()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setIsLoading(false)
      setSelectedPack(null)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choose Your ElevateX Pack</h2>
        <p className="text-muted-foreground">Select a subscription pack to start earning referral bonuses</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {packs.map((pack) => (
          <Card key={pack.id} className={`relative ${pack.borderColor} ${pack.popular ? "ring-2 ring-primary" : ""}`}>
            {pack.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
              </div>
            )}

            <CardHeader className={`${pack.bgColor} rounded-t-lg`}>
              <div className="flex items-center justify-between">
                <pack.icon className={`h-8 w-8 ${pack.color}`} />
                <div className="text-right">
                  <div className="text-2xl font-bold">{formatCurrency(pack.price)}</div>
                  <div className="text-sm text-muted-foreground">one-time</div>
                </div>
              </div>
              <CardTitle className="text-xl">{pack.name}</CardTitle>
              <CardDescription>{pack.description}</CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              <ul className="space-y-3 mb-6">
                {pack.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                onClick={() => handleSubscribe(pack.id)}
                disabled={isLoading}
                variant={pack.popular ? "default" : "outline"}
              >
                {isLoading && selectedPack === pack.id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  `Subscribe to ${pack.name}`
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-muted/50 p-6 rounded-lg">
        <h3 className="font-semibold mb-3">How ElevateX Works</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div>
            <h4 className="font-medium text-foreground mb-2">Referral Rules:</h4>
            <ul className="space-y-1">
              <li>• Complete 10 direct referrals to unlock withdrawals</li>
              <li>• Earn bonuses from 5 levels of referrals</li>
              <li>• Reactivate subscription after completing a cycle</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-2">Benefits:</h4>
            <ul className="space-y-1">
              <li>• Passive income from your network</li>
              <li>• Higher tier packs = higher bonuses</li>
              <li>• Build a sustainable income stream</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
