"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, Plus, Minus, ArrowUpRight, Eye, EyeOff } from "lucide-react"

interface WalletCardProps {
  onDeposit: () => void
  onWithdraw: () => void
  onTransfer: () => void
}

export function WalletCard({ onDeposit, onWithdraw, onTransfer }: WalletCardProps) {
  const [balance, setBalance] = useState(0)
  const [isBalanceVisible, setIsBalanceVisible] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchBalance()
    // Refresh balance when user returns from Paystack/payment
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchBalance()
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  const fetchBalance = async () => {
    try {
      const response = await fetch("/api/wallet/balance")
      if (response.ok) {
        const data = await response.json()
        setBalance(data.balance)
      }
    } catch (error) {
      console.error("Failed to fetch balance:", error)
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
    <Card className="bg-green-600 border-none rounded-2xl p-5 shadow-none">
      <div className="flex flex-col gap-4">
        {/* Top row: Balance label */}
        <div className="w-full flex items-center justify-between">
          <p className="text-lg font-semibold text-white tracking-wide">Balance</p>
        </div>
        {/* Bottom row: Amount and toggle */}
        <div className="w-full flex items-center justify-between">
          <div className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            {isLoading ? (
              <span className="animate-pulse text-green-100">Loading...</span>
            ) : isBalanceVisible ? (
              formatCurrency(balance)
            ) : (
              <span className="tracking-widest">****</span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle balance visibility"
            onClick={() => setIsBalanceVisible(!isBalanceVisible)}
            className="h-9 w-9 p-0 text-white hover:bg-green-600/30"
          >
            {isBalanceVisible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
          </Button>
        </div>
        {/* Actions row removed for clean look */}
      </div>
    </Card>
  )
}
