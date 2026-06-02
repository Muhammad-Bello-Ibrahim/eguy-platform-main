"use client"
import { useEffect } from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, ShieldCheck, ChevronDown, ExternalLink, KeyRound } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

interface WithdrawModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function WithdrawModal({ isOpen, onClose, onSuccess }: WithdrawModalProps) {
  const [amount, setAmount] = useState("")
  const [pin, setPin] = useState("")
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
          const linkedAccs = userData.user.linkedAccounts || []
          const activeAccount = linkedAccs.find((a: any) => a.isPrimary) || linkedAccs[0] || userData.user.payoutAccount || null
          setPayoutAccount(activeAccount)
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

  const [otp, setOtp] = useState("")
  const [transferCode, setTransferCode] = useState("")
  const [step, setStep] = useState<'amount' | 'otp'>('amount')

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
        body: JSON.stringify({ amount: withdrawAmount, pin }),
        headers: { "Content-Type": "application/json" },
      })
      const result = await response.json()

      if (!response.ok) throw new Error(result.error || "Withdrawal failed")

      if (result.requiresOtp) {
        setTransferCode(result.transferCode)
        setStep('otp')
        setIsLoading(false)
        toast({ title: "OTP Required", description: "Please enter the OTP sent to your phone." })
        return
      }

      setIsLoading(false)
      onSuccess()
      toast({ title: "Withdrawal requested", description: "Your withdrawal is being processed." })
      onClose()
    } catch (err: any) {
      setError(err.message || "Withdrawal failed")
      setIsLoading(false)
    }
  }

  const handleFinalize = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/wallet/withdraw/finalize", {
        method: "POST",
        body: JSON.stringify({ otp, transferCode }),
        headers: { "Content-Type": "application/json" },
      })
      const result = await response.json()

      if (!response.ok) throw new Error(result.error || "OTP Verification failed")

      setIsLoading(false)
      onSuccess()
      toast({ title: "Success", description: "Withdrawal confirmed successfully." })
      onClose()
    } catch (err: any) {
      setError(err.message || "Verification failed")
      setIsLoading(false)
    }
  }

  const handleSuccessClose = () => {
    onSuccess()
    onClose()
    // Reset state after close
    setTimeout(() => {
      setStep('amount')
      setAmount("")
      setOtp("")
      setPin("")
    }, 500)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleSuccessClose()}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-[#131321] border border-slate-100 dark:border-white/10 text-slate-900 dark:text-white rounded-3xl p-0 overflow-hidden shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        {/* iOS Grabber */}
        <div className="w-12 h-1.5 bg-slate-200 dark:bg-zinc-700 rounded-full mx-auto mt-3 mb-4"></div>

        {/* Header */}
        <div className="flex justify-between items-center px-6 mb-6">
          <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
            {step === 'amount' ? 'Withdraw Funds' : step === 'otp' ? 'Enter OTP' : 'Success'}
          </DialogTitle>
        </div>

        {step === 'amount' ? (
          <form className="space-y-6 px-6 pb-10" onSubmit={handleSubmit}>
            {/* Balance Display */}
            <div className="text-center mb-6">
              <p className="text-slate-500 dark:text-zinc-400 text-sm font-medium mb-2">Available Balance</p>
              <h3 className="text-[#47f0d1] text-3xl font-extrabold tracking-tight">
                {isLoadingData ? "..." : formatCurrency(userBalance)}
              </h3>
            </div>

            {error && (
              <Alert variant="destructive" className="rounded-xl border-red-500/20 bg-red-500/10 text-red-400">
                <AlertDescription className="font-medium text-center">{error}</AlertDescription>
              </Alert>
            )}

            {/* Amount Input */}
            <div>
              <Label htmlFor="amount" className="text-slate-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-widest mb-3 block">Amount to Withdraw</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/50 text-xl font-bold">₦</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min={100}
                  step={100}
                  required
                  className="w-full bg-slate-100 dark:bg-zinc-800/50 border-2 border-transparent focus:border-[#47f0d1] focus:ring-0 text-slate-900 dark:text-white text-2xl font-bold rounded-xl py-6 pl-10 pr-20 transition-all outline-none h-auto placeholder:text-slate-400 dark:placeholder:text-zinc-700"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-[#47f0d1]/20 hover:bg-[#47f0d1]/30 text-[#47f0d1] text-xs font-bold rounded-full transition-colors"
                  onClick={() => setAmount(userBalance.toString())}
                >
                  MAX
                </button>
              </div>
              <p className="text-xs text-zinc-600 mt-2 text-right">Min: ₦100</p>
            </div>

            {/* Bank Selection / Payout Account */}
            <div>
              <Label className="text-slate-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-widest mb-3 block">Send to</Label>
              {payoutAccount ? (
                <div className="flex items-center gap-4 bg-slate-100 dark:bg-zinc-800/50 border border-slate-200 dark:border-white/5 p-4 rounded-xl hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors group">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                    <span className="text-zinc-900 font-bold text-xl">{payoutAccount.bank.substring(0, 2).toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-900 dark:text-white font-semibold truncate">{payoutAccount.bank}</p>
                    <p className="text-slate-500 dark:text-zinc-500 text-sm truncate">{payoutAccount.accountNumber} • {payoutAccount.accountName}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-center">
                  <p className="text-sm text-red-400 mb-3">No payout account added.</p>
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => {
                      router.push('/profile')
                      onClose()
                    }}
                    className="bg-transparent border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-red-300 w-full"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Add Bank Details
                  </Button>
                </div>
              )}
            </div>

            {/* Summary Card */}
            {amount && Number.parseFloat(amount) >= 100 && (
              <div className="bg-slate-50 dark:bg-zinc-900/40 rounded-xl p-5 border border-slate-200 dark:border-white/5 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-zinc-500">Transaction Fee</span>
                  <span className="text-slate-900 dark:text-zinc-300">{formatCurrency(transactionFee)}</span>
                </div>
                <div className="h-px bg-slate-200 dark:bg-white/5"></div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-900 dark:text-zinc-300 font-medium">Final Amount</span>
                  <span className="text-[#47f0d1] text-lg font-bold">{formatCurrency(amountAfterFee)}</span>
                </div>
              </div>
            )}

            {/* Transaction PIN */}
            {amount && Number.parseFloat(amount) >= 100 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-[#47f0d1]" />
                  <Label htmlFor="pin" className="text-sm font-semibold text-slate-500 dark:text-zinc-400">Transaction PIN</Label>
                </div>
                <div className="flex justify-center py-1">
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
                          className="w-11 h-14 text-xl font-bold border-2 border-slate-200 dark:border-white/20 rounded-xl bg-slate-100 dark:bg-zinc-800/40 text-slate-900 dark:text-white data-[active=true]:border-[#47f0d1] data-[active=true]:ring-[#47f0d1]/20 transition-all text-center"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>
            )}

            {/* Primary CTA */}
            <Button
              type="submit"
              disabled={isLoading || !payoutAccount || !amount || Number.parseFloat(amount) > userBalance || pin.length !== 4}
              className="w-full bg-[#47f0d1] hover:bg-[#47f0d1]/90 text-[#131321] font-extrabold py-6 rounded-xl transition-all shadow-[0_4px_20px_rgba(71,240,209,0.3)] active:scale-[0.98] text-lg h-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                "Withdraw to Bank"
              )}
            </Button>

            {/* Trust Badge */}
            <div className="flex items-center justify-center gap-2 pt-2">
              <ShieldCheck className="text-[#47f0d1]/60 w-5 h-5" />
              <span className="text-zinc-500 text-xs font-medium uppercase tracking-widest">Secured by eGuy</span>
            </div>

          </form>
        ) : step === 'otp' ? (
          <form className="space-y-6 px-6 pb-10" onSubmit={handleFinalize}>
            <div className="text-center mb-4">
              <p className="text-slate-500 dark:text-zinc-400 text-sm">
                Please enter the OTP sent to your phone to confirm the withdrawal of <span className="text-[#47f0d1] font-bold">{formatCurrency(Number.parseFloat(amount))}</span>.
              </p>
            </div>

            {error && (
              <Alert variant="destructive" className="rounded-xl border-red-500/20 bg-red-500/10 text-red-400">
                <AlertDescription className="font-medium text-center">{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-center mb-6">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot index={0} className="w-10 h-14 text-lg font-bold border-2 border-slate-200 dark:border-white/20 rounded-lg text-slate-900 dark:text-white" />
                  <InputOTPSlot index={1} className="w-10 h-14 text-lg font-bold border-2 border-slate-200 dark:border-white/20 rounded-lg text-slate-900 dark:text-white" />
                  <InputOTPSlot index={2} className="w-10 h-14 text-lg font-bold border-2 border-slate-200 dark:border-white/20 rounded-lg text-slate-900 dark:text-white" />
                  <InputOTPSlot index={3} className="w-10 h-14 text-lg font-bold border-2 border-slate-200 dark:border-white/20 rounded-lg text-slate-900 dark:text-white" />
                  <InputOTPSlot index={4} className="w-10 h-14 text-lg font-bold border-2 border-slate-200 dark:border-white/20 rounded-lg text-slate-900 dark:text-white" />
                  <InputOTPSlot index={5} className="w-10 h-14 text-lg font-bold border-2 border-slate-200 dark:border-white/20 rounded-lg text-slate-900 dark:text-white" />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="w-full bg-[#47f0d1] hover:bg-[#47f0d1]/90 text-[#131321] font-extrabold py-6 rounded-xl transition-all shadow-[0_4px_20px_rgba(71,240,209,0.3)] active:scale-[0.98] text-lg h-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Confirm Withdrawal"
              )}
            </Button>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button type="button" onClick={() => setStep('amount')} className="text-zinc-500 text-xs font-medium uppercase tracking-widest hover:text-white transition-colors">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="px-6 pb-10 text-center space-y-6">
            <div className="w-20 h-20 bg-[#47f0d1]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-10 h-10 text-[#47f0d1]" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Withdrawal Successful</h3>
              <p className="text-slate-500 dark:text-zinc-400">
                Your request for <span className="text-[#47f0d1] font-bold">{formatCurrency(Number.parseFloat(amount))}</span> has been processed successfully.
              </p>
            </div>
            <Button
              onClick={handleSuccessClose}
              className="w-full bg-[#47f0d1] hover:bg-[#47f0d1]/90 text-[#131321] font-extrabold py-6 rounded-xl transition-all shadow-[0_4px_20px_rgba(71,240,209,0.3)] active:scale-[0.98] text-lg h-auto"
            >
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
