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
      <DialogContent className="max-w-sm mx-auto rounded-3xl shadow-xl p-8 bg-white border border-green-100">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl font-extrabold text-green-700">
            <Banknote />
            Withdraw Funds
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-1">Withdraw money from your wallet to your payout account</DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-6 mt-6" onSubmit={handleSubmit}>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Label htmlFor="amount" className="text-sm font-semibold text-green-700 mb-1">Amount (₦)</Label>
          <div className="flex items-center gap-3 bg-green-50 rounded-2xl px-5 py-4 shadow-sm">
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
          {/* Show payout account details if available */}
          {payoutAccount && (
            <div className="bg-green-50 p-4 rounded-xl space-y-2 border border-green-100">
              <h4 className="font-semibold text-sm text-green-700 mb-1">Payout Account</h4>
              <div className="text-xs text-green-700">
                <p><strong>Bank:</strong> {payoutAccount.bank}</p>
                <p><strong>Account Number:</strong> {payoutAccount.accountNumber}</p>
                <p><strong>Account Name:</strong> {payoutAccount.accountName}</p>
              </div>
            </div>
          )}
          <p className="text-xs text-green-700">Minimum withdrawal: ₦100</p>
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
                "Withdraw"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
