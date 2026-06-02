"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Check, Crown, Star, Zap, Loader2, KeyRound } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"

interface SubscriptionPacksProps {
  onSubscriptionSuccess: () => void
}

const ActivationCard = {
  id: "activate",
  name: "Activate ElevateX",
  price: 1000,
  description: "Unlock your earning potential with a one-time activation fee",
  icon: Zap,
  color: "text-primary",
  bgColor: "bg-primary/5",
  borderColor: "border-primary/20",
  features: [
    "Unlock Referral System",
    "Earn Matrix Bonuses (5 Levels)",
    "Instant Payouts",
    "Access to Premium Features",
    "24/7 Priority Support",
  ],
  popular: true,
}

export function SubscriptionPacks({ onSubscriptionSuccess }: SubscriptionPacksProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPinModal, setShowPinModal] = useState(false)
  const [pin, setPin] = useState("")
  const { toast } = useToast()

  const handleActivate = async () => {
    if (pin.length !== 4) {
      setError("Please enter your 4-digit transaction PIN")
      return
    }
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/referrals/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ packId: 'activation', pin }), // Sending dummy packId
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Activation failed")
      }

      toast({
        title: "Activation Successful!",
        description: `Welcome to ElevateX! You are now an active member.`,
      })

      setShowPinModal(false)
      setPin("")
      onSubscriptionSuccess()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong")
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

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Activate Your Account</h2>
        <div className="max-w-2xl mx-auto">
          <p className="text-muted-foreground text-lg">
            Start your journey with a simple one-time activation fee of ₦1,000.
            Unlock unlimited earning potential through our 5-level matrix system.
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-center">
        <Card className={`relative w-full max-w-md ${ActivationCard.borderColor} ring-4 ring-primary/10 shadow-xl`}>
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-primary text-primary-foreground px-4 py-1 text-sm font-bold shadow-lg">
              BEST VALUE
            </Badge>
          </div>

          <CardHeader className={`${ActivationCard.bgColor} rounded-t-lg pt-10 pb-8 text-center border-b border-primary/10`}>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm">
                <ActivationCard.icon className={`h-8 w-8 ${ActivationCard.color}`} />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{ActivationCard.name}</CardTitle>
            <div className="flex items-center justify-center gap-1 text-primary">
              <span className="text-4xl font-extrabold">{formatCurrency(ActivationCard.price)}</span>
              <span className="text-sm font-medium opacity-80 self-end mb-1">/ one-time</span>
            </div>
          </CardHeader>

          <CardContent className="pt-8 px-8 pb-8">
            <ul className="space-y-4 mb-8">
              {ActivationCard.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <Check className="h-3.5 w-3.5 text-green-600" />
                  </div>
                  <span className="font-medium">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              className="w-full py-6 text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
              onClick={() => setShowPinModal(true)}
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ${formatCurrency(ActivationCard.price)} & Activate`
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground mt-4">
              Secure payment via your wallet balance
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <span className="material-icons-round text-primary">info</span>
          How Current Rank Works
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <div className="text-primary font-bold mb-1">Basic</div>
            <div className="text-xs text-muted-foreground mb-2">0 - 4 Referrals</div>
            <p className="text-slate-600 dark:text-slate-400 text-xs">Entry level rank. Activate your account to start referring.</p>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <div className="text-green-600 font-bold mb-1">Growth</div>
            <div className="text-xs text-muted-foreground mb-2">5 Direct Referrals</div>
            <p className="text-slate-600 dark:text-slate-400 text-xs">Unlock higher bonuses by completing your first level.</p>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <div className="text-purple-600 font-bold mb-1">Expansion</div>
            <div className="text-xs text-muted-foreground mb-2">Team Growth</div>
            <p className="text-slate-600 dark:text-slate-400 text-xs">Advance to Expansion, Premium, and Pinnacle as your team grows deeper.</p>
          </div>
        </div>
      </div>

      {/* PIN Verification Dialog */}
      <Dialog open={showPinModal} onOpenChange={(open) => !open && setShowPinModal(false)}>
        <DialogContent className="sm:max-w-[360px] bg-white dark:bg-[#131321] border border-slate-100 dark:border-white/10 text-slate-900 dark:text-white rounded-3xl p-6 overflow-hidden">
          <DialogHeader className="flex flex-col items-center justify-center text-center pb-2">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <KeyRound className="w-6 h-6 text-primary" />
            </div>
            <DialogTitle className="text-lg font-bold">Verify PIN</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-6 py-4">
            <p className="text-xs text-slate-500 dark:text-zinc-400 text-center">
              Enter your 4-digit transaction PIN to authorize the payment of {formatCurrency(ActivationCard.price)} for ElevateX activation.
            </p>
            <div className="flex justify-center">
              <InputOTP
                maxLength={4}
                value={pin}
                onChange={(value) => setPin(value)}
              >
                <InputOTPGroup className="gap-3">
                  {[0, 1, 2, 3].map((i) => (
                    <InputOTPSlot
                      key={i}
                      index={i}
                      className="w-12 h-12 text-xl font-bold border-2 border-slate-200 dark:border-white/20 rounded-xl bg-slate-50 dark:bg-zinc-800/40 text-slate-900 dark:text-white data-[active=true]:border-primary data-[active=true]:ring-primary/20 transition-all text-center"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
            <Button
              onClick={handleActivate}
              disabled={isLoading || pin.length !== 4}
              className="w-full bg-primary hover:bg-primary/90 text-background-dark font-extrabold py-3 rounded-xl transition-all"
            >
              {isLoading ? "Processing..." : "Verify & Activate"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
