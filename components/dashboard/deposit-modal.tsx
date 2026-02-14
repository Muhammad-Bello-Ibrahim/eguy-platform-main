"use client"
import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Wallet, CreditCard, Banknote, Smartphone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

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

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Deposit failed")
      }

      const data = await response.json();
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        throw new Error("Could not get payment link.");
      }
    } catch (err: any) {
      setError(err.message || "Deposit failed")
      setIsLoading(false)
    }
  }

  const quickAmounts = [500, 1000, 2000, 5000];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] overflow-hidden">
        <DialogHeader className="flex flex-col items-center justify-center text-center pb-2">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 ring-8 ring-emerald-50/50">
            <Wallet className="w-8 h-8 text-emerald-600" />
          </div>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Fund Your Wallet
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-base max-w-[280px] mx-auto">
            Securely add money via Bank Transfer or Card
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-6 pt-2" onSubmit={handleSubmit}>
          {error && (
            <Alert variant="destructive" className="rounded-2xl border-red-100 bg-red-50/50">
              <AlertDescription className="font-medium text-red-700 text-center">{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <Label htmlFor="amount" className="text-sm font-semibold text-gray-700 ml-1">
              Enter Amount
            </Label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-lg">₦</div>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={100}
                step={100}
                required
                className="pl-10 h-14 rounded-2xl text-lg font-bold bg-gray-50/50 border-gray-200 focus:bg-white transition-all shadow-sm"
              />
            </div>

            <div className="flex gap-2 flex-wrap justify-center mt-2">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAmount(amt.toString())}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                    amount === amt.toString()
                      ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-200"
                      : "bg-white border-gray-200 text-gray-600 hover:border-emerald-300 hover:text-emerald-600"
                  )}
                >
                  ₦{amt.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">
              Supported Methods
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-xs font-medium text-gray-700">Cards</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Banknote className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-xs font-medium text-gray-700">Transfers</span>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-lg shadow-xl shadow-emerald-200 transition-all duration-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              "Proceed to Payment"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
