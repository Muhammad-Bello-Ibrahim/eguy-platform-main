"use client"
import { MaterialWallet, MaterialPlus } from "../ui/material-icons"

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
      <DialogContent className="max-w-sm mx-auto rounded-3xl shadow-xl p-8 bg-white border border-green-100">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl font-extrabold text-green-700">
            <MaterialWallet />
            Fund Wallet
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-1">Add money to your eGuy wallet using your debit card or bank transfer</DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-6 mt-6" onSubmit={handleSubmit}>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Label htmlFor="amount" className="text-sm font-semibold text-green-700 mb-1">Amount (₦)</Label>
          <div className="flex items-center gap-3 bg-green-50 rounded-2xl px-5 py-4 shadow-sm">
            <MaterialPlus className="text-green-600" />
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={100}
              step={100}
              required
              className="bg-transparent outline-none w-full text-lg font-semibold placeholder:text-green-400"
            />
          </div>
          <p className="text-xs text-green-700">Minimum deposit: ₦100</p>
          <div className="bg-green-50 p-4 rounded-xl space-y-2 border border-green-100">
            <h4 className="font-semibold text-sm text-green-700">Payment Methods</h4>
            <div className="space-y-1 text-xs text-green-700">
              <p>• Debit/Credit Cards (Visa, Mastercard)</p>
              <p>• Bank Transfer</p>
              <p>• USSD (*737#)</p>
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-xl border-green-200 text-green-700 font-semibold">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1 rounded-xl bg-green-600 text-white font-bold text-lg shadow-lg hover:bg-green-700 transition-all duration-200 active:scale-95">
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
