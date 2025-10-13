"use client"
import { useEffect } from "react"
import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Banknote, Wallet, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface WithdrawModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function WithdrawModal({ isOpen, onClose, onSuccess }: WithdrawModalProps) {
  const [amount, setAmount] = useState("")
  const [payoutAccount, setPayoutAccount] = useState<any>(null)
  const [userBalance, setUserBalance] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isLoadingData, setIsLoadingData] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  // Transaction fee calculation (2.5% of withdrawal amount)
  const transactionFee = amount ? Math.round(Number.parseFloat(amount) * 0.025) : 0
  const amountAfterFee = amount ? Number.parseFloat(amount) - transactionFee : 0

  // Fetch user's payout account and balance on open
  useEffect(() => {
    if (isOpen) {
      setIsLoadingData(true)
      Promise.all([
        fetch("/api/user").then(res => res.json()),
        fetch("/api/wallet/balance").then(res => res.json())
      ]).then(([userData, balanceData]) => {
        if (userData.user) {
          setPayoutAccount(userData.user.payoutAccount || null)
        }
        if (balanceData.balance !== undefined) {
          setUserBalance(balanceData.balance)
        }
      }).catch(error => {
        console.error("Failed to load data:", error)
      }).finally(() => {
        setIsLoadingData(false)
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
    if (withdrawAmount > userBalance) {
      setError("Insufficient balance")
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount)
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

          {/* Available Balance Display */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Available Balance</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">
              {isLoadingData ? "..." : formatCurrency(userBalance)}
            </p>
          </div>

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

          {/* Transaction Fee Display */}
          {amount && Number.parseFloat(amount) >= 100 && (
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-orange-900">Transaction Fee (2.5%)</p>
                  <p className="text-xs text-orange-700">Fee will be deducted from withdrawal amount</p>
                </div>
                <p className="text-lg font-bold text-orange-900">{formatCurrency(transactionFee)}</p>
              </div>
              <div className="mt-2 pt-2 border-t border-orange-200">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-orange-900">You'll receive</p>
                  <p className="text-lg font-bold text-orange-900">{formatCurrency(amountAfterFee)}</p>
                </div>
              </div>
            </div>
          )}

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
              <p className="text-sm text-red-800 mb-3">
                No payout account found. Please add your bank details in your profile settings.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  router.push('/profile')
                  onClose()
                }}
                className="w-full border-red-300 text-red-700 hover:bg-red-50"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Go to Profile Settings
              </Button>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={isLoading || !payoutAccount || !amount || Number.parseFloat(amount) > userBalance}
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
