"use client"
import { useEffect } from "react"
import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Banknote } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface WithdrawModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function WithdrawModal({ isOpen, onClose, onSuccess }: WithdrawModalProps) {
  const [amount, setAmount] = useState("")
  const [payoutAccount, setPayoutAccount] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  // Fetch user's payout account on open
  useEffect(() => {
    if (isOpen) {
      fetch("/api/user")
        .then((res) => res.json())
        .then((data) => {
          if (data.user && data.user.payoutAccount) {
            setPayoutAccount(data.user.payoutAccount)
          }
        })
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const withdrawAmount = Number.parseFloat(amount)
    if (!withdrawAmount || withdrawAmount < 100) {
      setError("Minimum withdrawal amount is ₦100")
      setIsLoading(false)
      return
    }
    if (!payoutAccount) {
      setError("No payout account found. Please add one in your profile.")
      setIsLoading(false)
      return
    }
    try {
      const response = await fetch("/api/wallet/withdraw", {
        method: "POST",
        body: JSON.stringify({ amount: withdrawAmount }),
        headers: { "Content-Type": "application/json" },
      })
      if (!response.ok) throw new Error("Withdrawal failed")
      setIsLoading(false)
      onSuccess()
      toast({ title: "Withdrawal requested", description: "Your withdrawal is being processed." })
      onClose()
    } catch (err: any) {
      setError(err.message || "Withdrawal failed")
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white border border-gray-200 shadow-lg">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Banknote className="w-5 h-5 text-red-600" />
            </div>
            Withdraw Funds
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Withdraw money from your wallet to your payout account
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
            <p className="text-xs text-gray-600">Minimum withdrawal: ₦100</p>
          </div>

          {/* Show payout account details if available */}
          {payoutAccount ? (
            <div className="bg-gray-50 p-4 rounded-xl space-y-2 border border-gray-200">
              <h4 className="font-semibold text-sm text-gray-900 mb-1">Payout Account</h4>
              <div className="text-xs text-gray-600">
                <p><strong>Bank:</strong> {payoutAccount.bank}</p>
                <p><strong>Account Number:</strong> {payoutAccount.accountNumber}</p>
                <p><strong>Account Name:</strong> {payoutAccount.accountName}</p>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 p-4 rounded-xl border border-red-200">
              <p className="text-sm text-red-800">
                No payout account found. Please add your bank details in your profile settings.
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-xl border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !payoutAccount}
              className="flex-1 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-lg shadow-lg hover:shadow-red-500/25 transition-all duration-200 border-0 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Withdraw"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
