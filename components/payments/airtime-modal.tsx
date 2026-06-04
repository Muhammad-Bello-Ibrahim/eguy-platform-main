"use client"
import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Smartphone, Check, KeyRound, ArrowLeft, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { SuccessModal } from "@/components/ui/success-modal"
import { ErrorModal } from "@/components/ui/error-modal"
import { cn } from "@/lib/utils"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

interface AirtimeModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const PRESET_AMOUNTS = ["100", "200", "500", "1000", "2000", "5000"]

export function AirtimeModal({ isOpen, onClose, onSuccess }: AirtimeModalProps) {
  const [plans, setPlans] = useState<any[]>([])
  const [fetching, setFetching] = useState(true)
  const [formData, setFormData] = useState({ network: "", phone: "", amount: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [pin, setPin] = useState("")
  const [step, setStep] = useState<"form" | "pin">("form")
  const [pinVisible, setPinVisible] = useState(false)
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [errorModalOpen, setErrorModalOpen] = useState(false)
  const [transactionData, setTransactionData] = useState<any>(null)
  const { toast } = useToast()
  const submittingRef = useRef(false)

  useEffect(() => {
    async function fetchPlans() {
      setFetching(true)
      try {
        const res = await fetch("/api/admin/airtime-plans")
        const data = await res.json()
        if (data && data.length > 0) {
          setPlans(data)
        } else {
          setPlans([
            { _id: "1", network: "MTN", amount: 100, price: 95 },
            { _id: "2", network: "MTN", amount: 200, price: 190 },
            { _id: "3", network: "MTN", amount: 500, price: 475 },
            { _id: "4", network: "MTN", amount: 1000, price: 950 },
            { _id: "5", network: "AIRTEL", amount: 100, price: 95 },
            { _id: "6", network: "AIRTEL", amount: 200, price: 190 },
            { _id: "7", network: "AIRTEL", amount: 500, price: 475 },
            { _id: "8", network: "AIRTEL", amount: 1000, price: 950 },
            { _id: "9", network: "GLO", amount: 100, price: 95 },
            { _id: "10", network: "GLO", amount: 200, price: 190 },
            { _id: "11", network: "GLO", amount: 500, price: 475 },
            { _id: "12", network: "GLO", amount: 1000, price: 950 },
            { _id: "13", network: "9MOBILE", amount: 100, price: 95 },
            { _id: "14", network: "9MOBILE", amount: 200, price: 190 },
            { _id: "15", network: "9MOBILE", amount: 500, price: 475 },
            { _id: "16", network: "9MOBILE", amount: 1000, price: 950 },
          ])
        }
      } catch {
        setPlans([
          { _id: "1", network: "MTN", amount: 100, price: 95 },
          { _id: "2", network: "MTN", amount: 200, price: 190 },
        ])
      }
      setFetching(false)
    }
    fetchPlans()
  }, [])

  // When step changes to "pin", animate in after a tiny delay
  useEffect(() => {
    if (step === "pin") {
      setTimeout(() => setPinVisible(true), 30)
    } else {
      setPinVisible(false)
    }
  }, [step])

  // Auto-submit on 4th digit
  useEffect(() => {
    if (pin.length === 4 && step === "pin" && !submittingRef.current) {
      handlePinComplete(pin)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin])

  const isFormComplete =
    formData.network &&
    formData.phone &&
    formData.amount &&
    Number(formData.amount) >= 50 &&
    /^(234|0)[789]\d{9}$/.test(formData.phone)

  const handleContinueToPIN = () => {
    setError("")
    const amount = Number.parseFloat(formData.amount)
    if (!formData.network) return setError("Please select a network provider")
    if (!formData.phone || !/^(234|0)[789]\d{9}$/.test(formData.phone))
      return setError("Please enter a valid Nigerian phone number")
    if (!amount || amount < 50) return setError("Minimum airtime amount is ₦50")
    setError("")
    setPin("")
    setStep("pin")
  }

  const handlePinComplete = async (completedPin: string) => {
    if (submittingRef.current) return
    submittingRef.current = true
    setError("")
    setIsLoading(true)

    const amount = Number.parseFloat(formData.amount)

    try {
      const response = await fetch("/api/payments/airtime", {
        method: "POST",
        body: JSON.stringify({ ...formData, pin: completedPin }),
        headers: { "Content-Type": "application/json" },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Airtime purchase failed")
      }

      setTransactionData({
        title: "Airtime Purchase Successful",
        description: `₦${amount} ${formData.network} airtime sent to ${formData.phone}`,
        amount,
        service: `${formData.network} Airtime`,
        transactionId: data.reference,
      })
      setSuccessModalOpen(true)
      onSuccess()
      onClose()
      resetForm()
    } catch (error) {
      setTransactionData({
        title: "Airtime Purchase Failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        errorCode: "AIRTIME_PURCHASE_ERROR",
      })
      setErrorModalOpen(true)
      setPin("")
    } finally {
      setIsLoading(false)
      submittingRef.current = false
    }
  }

  const resetForm = () => {
    setFormData({ network: "", phone: "", amount: "" })
    setPin("")
    setStep("form")
    setPinVisible(false)
    setError("")
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const uniqueNetworks = [...new Set(plans.map((p) => p.network))]
  const networkPlans = formData.network
    ? plans.filter((p) => p.network === formData.network)
    : []

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px] overflow-hidden p-0 border-0 bg-transparent shadow-none">
          <div className="relative bg-white dark:bg-[#0f1117] rounded-[2rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-white/8">

            {/* ── FORM STEP ─────────────────────────────────────── */}
            <div
              className="transition-all duration-500 ease-in-out"
              style={{ display: step === "pin" && pinVisible ? "none" : "block" }}
            >
              {/* Header */}
              <div className="flex flex-col items-center pt-8 pb-4 px-6 bg-gradient-to-b from-blue-50/60 to-white dark:from-[#131321] dark:to-[#0f1117]">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-100 dark:shadow-blue-500/10">
                  <Smartphone className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Buy Airtime</h2>
                <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">Instant top-up for all networks</p>
              </div>

              <div className="px-6 pb-8 space-y-5">
                {error && (
                  <Alert variant="destructive" className="rounded-2xl border-red-100 bg-red-50 dark:bg-red-500/10 dark:border-red-500/20">
                    <AlertDescription className="font-semibold text-red-700 dark:text-red-400 text-center text-sm">{error}</AlertDescription>
                  </Alert>
                )}

                {fetching ? (
                  <div className="space-y-4">
                    <Skeleton className="h-14 w-full rounded-2xl" />
                    <Skeleton className="h-14 w-full rounded-2xl" />
                    <Skeleton className="h-14 w-full rounded-2xl" />
                  </div>
                ) : (
                  <>
                    {/* Network Selector */}
                    <div className="space-y-2.5">
                      <Label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
                        Network Provider
                      </Label>
                      <div className="grid grid-cols-4 gap-2">
                        {uniqueNetworks.map((network) => (
                          <div
                            key={network}
                            onClick={() => setFormData((prev) => ({ ...prev, network, amount: "" }))}
                            className={cn(
                              "flex flex-col items-center justify-center p-2.5 rounded-2xl border cursor-pointer transition-all duration-300 select-none",
                              formData.network === network
                                ? "bg-blue-50 dark:bg-blue-500/10 border-blue-500 ring-2 ring-blue-200 dark:ring-blue-500/20"
                                : "bg-slate-50 dark:bg-zinc-800/30 border-slate-100 dark:border-white/5 hover:border-blue-300 hover:bg-white dark:hover:bg-zinc-800/60"
                            )}
                          >
                            <div className="relative w-9 h-9 mb-1.5">
                              <img
                                src={`/${network.toLowerCase()}.jpeg`}
                                alt={network}
                                className="w-full h-full rounded-full object-cover shadow-sm border border-slate-100/30"
                              />
                              {formData.network === network && (
                                <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-0.5 shadow">
                                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                                </div>
                              )}
                            </div>
                            <span className={cn(
                              "text-[9px] font-extrabold uppercase tracking-tight",
                              formData.network === network ? "text-blue-600 dark:text-blue-400" : "text-slate-600 dark:text-zinc-400"
                            )}>
                              {network}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Phone Input */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="080 1234 5678"
                        value={formData.phone}
                        onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                        className="h-14 rounded-2xl text-base font-semibold bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-white/5 focus:bg-white dark:focus:bg-[#18182d] focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-500/10 text-slate-900 dark:text-white transition-all placeholder:text-slate-300 dark:placeholder:text-zinc-600"
                        required
                      />
                    </div>

                    {/* Amount – preset chips + custom input */}
                    {formData.network && (
                      <div className="space-y-2.5">
                        <Label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
                          Amount (₦)
                        </Label>
                        {/* Preset chips from plans */}
                        {networkPlans.length > 0 ? (
                          <div className="grid grid-cols-3 gap-2">
                            {networkPlans.map((plan) => (
                              <div
                                key={plan._id}
                                onClick={() => setFormData((prev) => ({ ...prev, amount: plan.amount.toString() }))}
                                className={cn(
                                  "flex flex-col items-center justify-center py-3 px-2 rounded-2xl border cursor-pointer transition-all duration-200 select-none",
                                  formData.amount === plan.amount.toString()
                                    ? "bg-blue-50 dark:bg-blue-500/10 border-blue-500 ring-2 ring-blue-200 dark:ring-blue-500/20"
                                    : "bg-slate-50 dark:bg-zinc-800/30 border-slate-100 dark:border-white/5 hover:border-blue-300 hover:bg-white dark:hover:bg-zinc-800/60"
                                )}
                              >
                                <span className={cn(
                                  "text-base font-black",
                                  formData.amount === plan.amount.toString() ? "text-blue-600 dark:text-blue-400" : "text-slate-800 dark:text-white"
                                )}>
                                  ₦{plan.amount}
                                </span>
                                <span className="text-[9px] text-slate-400 dark:text-zinc-500 mt-0.5">Pay ₦{plan.price}</span>
                              </div>
                            ))}
                          </div>
                        ) : null}
                        {/* Custom amount input */}
                        <Input
                          type="number"
                          placeholder="Or enter custom amount..."
                          value={formData.amount}
                          onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                          className="h-12 rounded-2xl text-base font-semibold bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-white/5 focus:bg-white dark:focus:bg-[#18182d] focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-500/10 text-slate-900 dark:text-white transition-all placeholder:text-slate-300 dark:placeholder:text-zinc-600"
                          min="50"
                        />
                      </div>
                    )}

                    {/* Continue CTA */}
                    <button
                      type="button"
                      onClick={handleContinueToPIN}
                      disabled={!isFormComplete}
                      className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] text-white font-black text-base shadow-xl shadow-blue-200 dark:shadow-blue-900/20 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2 mt-1"
                    >
                      Continue to PIN
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* ── PIN STEP (slide up) ───────────────────────────── */}
            <div
              className={cn(
                "absolute inset-0 transition-all duration-500 ease-out",
                step === "pin"
                  ? pinVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-full opacity-0"
                  : "translate-y-full opacity-0 pointer-events-none"
              )}
            >
              <div className="h-full bg-white dark:bg-[#0f1117] flex flex-col">
                {/* PIN Header */}
                <div className="flex flex-col items-center pt-8 pb-4 px-6 bg-gradient-to-b from-indigo-50/60 to-white dark:from-[#131321] dark:to-[#0f1117]">
                  <button
                    onClick={() => { setStep("form"); setPin(""); setError("") }}
                    className="absolute top-5 left-5 p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-100 dark:shadow-indigo-500/10">
                    <Shield className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Enter PIN</h2>
                  <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 text-center">
                    Confirm payment of{" "}
                    <span className="font-bold text-slate-800 dark:text-white">
                      ₦{formData.amount}
                    </span>{" "}
                    {formData.network} airtime to{" "}
                    <span className="font-bold text-slate-800 dark:text-white">{formData.phone}</span>
                  </p>
                </div>

                <div className="px-6 pb-8 space-y-5 flex-1">
                  {error && (
                    <Alert variant="destructive" className="rounded-2xl border-red-100 bg-red-50 dark:bg-red-500/10 dark:border-red-500/20">
                      <AlertDescription className="font-semibold text-red-700 dark:text-red-400 text-center text-sm">{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* OTP PIN */}
                  <div className="flex flex-col items-center space-y-6 pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <KeyRound className="w-4 h-4 text-indigo-500" />
                      <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest">
                        4-Digit Transaction PIN
                      </span>
                    </div>

                    <InputOTP
                      maxLength={4}
                      value={pin}
                      onChange={(value) => setPin(value)}
                      disabled={isLoading}
                    >
                      <InputOTPGroup className="gap-4">
                        {[0, 1, 2, 3].map((i) => (
                          <InputOTPSlot
                            key={i}
                            index={i}
                            className="w-14 h-16 text-2xl font-black border-2 border-slate-200 dark:border-white/10 rounded-2xl bg-slate-50 dark:bg-zinc-800/40 text-slate-900 dark:text-white data-[active=true]:border-indigo-500 data-[active=true]:ring-4 data-[active=true]:ring-indigo-100 dark:data-[active=true]:ring-indigo-500/20 dark:data-[active=true]:bg-[#18182d] transition-all text-center shadow-sm"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>

                    {isLoading && (
                      <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 animate-pulse">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-sm font-semibold">Processing payment…</span>
                      </div>
                    )}

                    <p className="text-xs text-slate-400 dark:text-zinc-500 text-center">
                      Payment triggers automatically on the 4th digit
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      {transactionData && (
        <SuccessModal
          isOpen={successModalOpen}
          onClose={() => { setSuccessModalOpen(false); setTransactionData(null) }}
          title={transactionData.title}
          description={transactionData.description}
          transactionId={transactionData.transactionId}
          amount={transactionData.amount}
          service={transactionData.service}
        />
      )}

      {/* Error Modal */}
      {transactionData && (
        <ErrorModal
          isOpen={errorModalOpen}
          onClose={() => { setErrorModalOpen(false); setTransactionData(null) }}
          title={transactionData.title}
          description={transactionData.description}
          errorCode={transactionData.errorCode}
        />
      )}
    </>
  )
}
