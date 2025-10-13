"use client"
import { Plus, Wallet } from "lucide-react"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CreditCard } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DepositModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function DepositModal({ isOpen, onClose, onSuccess }: DepositModalProps) {
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const depositAmount = Number.parseFloat(amount)
    if (!depositAmount || depositAmount < 100) {
      setError("Minimum deposit amount is ₦100")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/wallet/deposit", {
        method: "POST",
        body: JSON.stringify({ amount: depositAmount }),
        headers: { "Content-Type": "application/json" },
      })
      if (!response.ok) throw new Error("Deposit failed")
      const data = await response.json();
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        setError("Could not get payment link.");
      }
      setIsLoading(false)
      onSuccess()
      toast({ title: "Deposit initiated", description: "Redirecting to Paystack..." })
      onClose()
    } catch (err: any) {
      setError(err.message || "Deposit failed")
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white border border-gray-200 shadow-lg">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Wallet className="w-5 h-5 text-green-600" />
            </div>
            Fund Wallet
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Add money to your eGuy wallet using your debit card or bank transfer
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <Alert variant="destructive" className="rounded-lg border-red-200 bg-red-50">
              <AlertDescription className="font-medium text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <Label htmlFor="amount" className="text-sm font-semibold text-gray-900">Amount (₦)</Label>
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
              <Plus className="text-green-600 w-5 h-5" />
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={100}
                step={100}
                required
                className="bg-transparent outline-none w-full text-lg font-semibold placeholder:text-gray-400"
              />
            </div>
            <p className="text-xs text-gray-600">Minimum deposit: ₦100</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl space-y-2 border border-gray-200">
            <h4 className="font-semibold text-sm text-gray-900">Supported Payment Methods</h4>
            <div className="space-y-1 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <CreditCard className="w-3 h-3" />
                <span>Debit/Credit Cards (Visa, Mastercard)</span>
              </div>
              <p>• Bank Transfer</p>
              <p>• USSD (*737#)</p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold text-lg shadow-lg hover:shadow-green-500/25 transition-all duration-200 border-0"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Fund Wallet"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
