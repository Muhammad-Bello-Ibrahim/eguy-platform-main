"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Wifi, Check, Sparkles, KeyRound, ArrowLeft, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { SuccessModal } from "@/components/ui/success-modal"
import { ErrorModal } from "@/components/ui/error-modal"
import { cn } from "@/lib/utils"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

interface DataModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const networkImages: Record<string, string> = {
  MTN: "/mtn.jpeg",
  AIRTEL: "/airtel.jpeg",
  GLO: "/glo.jpeg",
  "9MOBILE": "/9mobile.jpeg",
}

type DataPlan = {
  dataBundle: string
  dataPlan: string
  duration: string
  type: string
  status: string
  price: number
  apiPrice: number
}

type BundlesResponse = {
  NETWORK: string
  BUNDLE: DataPlan[]
}

export function DataModal({ isOpen, onClose, onSuccess }: DataModalProps) {
  const [bundles, setBundles] = useState<BundlesResponse[]>([])
  const [fetching, setFetching] = useState(true)
  const [formData, setFormData] = useState({ network: "", phone: "", type: "", plan: "" })
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
    async function fetchBundles() {
      setFetching(true)
      try {
        const res = await fetch("/api/admin/data-plans")
        const data = await res.json()
        if (data && data.length > 0) {
          const grouped = data.reduce((acc: any, plan: any) => {
            if (!acc[plan.network]) acc[plan.network] = []
            acc[plan.network].push(plan)
            return acc
          }, {})
          setBundles(Object.keys(grouped).map((network) => ({ NETWORK: network, BUNDLE: grouped[network] })))
        } else {
          const fallbackData = [
            { _id: "1", network: "MTN", dataBundle: "500MB", dataPlan: "MTN_500MB_SME", duration: "30 Days", type: "SME", status: "Active", price: 125, apiPrice: 119 },
            { _id: "2", network: "MTN", dataBundle: "1GB", dataPlan: "MTN_1GB_SME", duration: "30 Days", type: "SME", status: "Active", price: 245, apiPrice: 239 },
            { _id: "3", network: "MTN", dataBundle: "2GB", dataPlan: "MTN_2GB_SME", duration: "30 Days", type: "SME", status: "Active", price: 490, apiPrice: 480 },
            { _id: "4", network: "MTN", dataBundle: "5GB", dataPlan: "MTN_5GB_SME", duration: "30 Days", type: "SME", status: "Active", price: 1225, apiPrice: 1200 },
            { _id: "5", network: "MTN", dataBundle: "1GB", dataPlan: "MTN_1GB_GIFTING", duration: "30 Days", type: "GIFTING", status: "Active", price: 290, apiPrice: 280 },
            { _id: "6", network: "AIRTEL", dataBundle: "1GB", dataPlan: "AIRTEL_1GB_SME", duration: "30 Days", type: "SME", status: "Active", price: 235, apiPrice: 230 },
            { _id: "7", network: "AIRTEL", dataBundle: "2GB", dataPlan: "AIRTEL_2GB_SME", duration: "30 Days", type: "SME", status: "Active", price: 470, apiPrice: 460 },
            { _id: "11", network: "GLO", dataBundle: "1GB", dataPlan: "GLO_1GB_CG", duration: "30 Days", type: "CORPORATE GIFTING", status: "Active", price: 250, apiPrice: 240 },
            { _id: "12", network: "GLO", dataBundle: "2GB", dataPlan: "GLO_2GB_CG", duration: "30 Days", type: "CORPORATE GIFTING", status: "Active", price: 500, apiPrice: 480 },
            { _id: "16", network: "9MOBILE", dataBundle: "1GB", dataPlan: "9MOBILE_1GB_GIFTING", duration: "30 Days", type: "GIFTING", status: "Active", price: 400, apiPrice: 380 },
          ]
          const grouped = fallbackData.reduce((acc: any, plan: any) => {
            if (!acc[plan.network]) acc[plan.network] = []
            acc[plan.network].push(plan)
            return acc
          }, {})
          setBundles(Object.keys(grouped).map((network) => ({ NETWORK: network, BUNDLE: grouped[network] })))
        }
      } catch (e) {
        console.error("Bundles load error", e)
      }
      setFetching(false)
    }
    fetchBundles()
  }, [])

  // When step changes to "pin", animate in after a tiny delay
  useEffect(() => {
    if (step === "pin") {
      setTimeout(() => setPinVisible(true), 30)
    } else {
      setPinVisible(false)
    }
  }, [step])

  // Auto-submit when PIN reaches 4 digits
  useEffect(() => {
    if (pin.length === 4 && step === "pin" && !submittingRef.current) {
      handlePinComplete(pin)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin])

  // Auto-advance to PIN when plan is selected
  useEffect(() => {
    if (formData.plan && formData.phone && formData.network) {
      const phone = formData.phone
      if (/^(\+234|0)[789]\d{9}$/.test(phone)) {
        setError("")
        setPin("")
        setStep("pin")
      }
    }
  }, [formData.plan])

  const availableTypes = formData.network
    ? Array.from(
        new Set(
          bundles
            .find((b) => b.NETWORK === formData.network)
            ?.BUNDLE.filter((plan) => plan.status === "Active")
            .map((plan) => plan.type) || []
        )
      )
    : []

  const filteredPlans =
    formData.network && formData.type
      ? bundles.find((b) => b.NETWORK === formData.network)?.BUNDLE.filter(
          (plan) => plan.status === "Active" && plan.type === formData.type
        ) || []
      : []

  const selectedPlan =
    formData.network && formData.plan
      ? bundles.find((b) => b.NETWORK === formData.network)?.BUNDLE.find((p) => p.dataPlan === formData.plan)
      : null

  const handlePinComplete = async (completedPin: string) => {
    if (submittingRef.current) return
    submittingRef.current = true
    setError("")
    setIsLoading(true)

    if (!selectedPlan) {
      setError("Please select a data plan")
      setIsLoading(false)
      submittingRef.current = false
      return
    }

    try {
      const response = await fetch("/api/payments/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          network: formData.network,
          phone: formData.phone,
          plan: selectedPlan.dataPlan,
          amount: selectedPlan.price,
          pin: completedPin,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Data purchase failed")
      }

      setTransactionData({
        title: "Data Purchase Successful",
        description: `${selectedPlan.dataBundle} ${formData.network} data sent to ${formData.phone}`,
        amount: selectedPlan.price,
        service: `${formData.network} Data`,
        transactionId: data.reference,
      })
      setSuccessModalOpen(true)
      onSuccess()
      onClose()
      resetForm()
    } catch (error) {
      setTransactionData({
        title: "Data Purchase Failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        errorCode: "DATA_PURCHASE_ERROR",
      })
      setErrorModalOpen(true)
      setPin("")
    } finally {
      setIsLoading(false)
      submittingRef.current = false
    }
  }

  const resetForm = () => {
    setFormData({ network: "", phone: "", type: "", plan: "" })
    setPin("")
    setStep("form")
    setPinVisible(false)
    setError("")
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const formatPlanType = (type: string) => {
    if (!type) return ""
    return type
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[440px] overflow-hidden p-0 border-0 bg-transparent shadow-none">
          <div className="relative bg-white dark:bg-[#0f1117] rounded-[2rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-white/8 min-h-[520px]">

            {/* ── FORM STEP ─────────────────────────────────────── */}
            <div
              className="transition-all duration-500 ease-in-out"
              style={{ display: step === "pin" && pinVisible ? "none" : "block" }}
            >
              {/* Drag pill */}
              <div className="w-10 h-1.5 bg-slate-200 dark:bg-zinc-700/50 rounded-full mx-auto pt-0 mt-3" />

              {/* Header */}
              <div className="flex flex-col items-center pt-5 pb-4 px-6 bg-gradient-to-b from-[#47f0d1]/5 to-white dark:from-[#131321] dark:to-[#0f1117]">
                <div className="w-16 h-16 bg-[#47f0d1]/10 dark:bg-[#47f0d1]/10 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-[#47f0d1]/10 ring-8 ring-[#47f0d1]/5">
                  <Wifi className="w-8 h-8 text-[#47f0d1]" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  Buy Data Bundle <Sparkles className="w-5 h-5 text-[#47f0d1] animate-pulse" />
                </h2>
                <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">Affordable internet for all networks</p>
              </div>

              <div className="px-6 pb-8 space-y-5">
                {error && (
                  <Alert variant="destructive" className="rounded-2xl border-red-500/20 bg-red-500/10">
                    <AlertDescription className="font-semibold text-red-500 dark:text-red-400 text-center text-sm">{error}</AlertDescription>
                  </Alert>
                )}

                {fetching ? (
                  <div className="space-y-4">
                    <Skeleton className="h-16 w-full rounded-2xl bg-slate-100 dark:bg-zinc-800/50" />
                    <Skeleton className="h-16 w-full rounded-2xl bg-slate-100 dark:bg-zinc-800/50" />
                    <Skeleton className="h-16 w-full rounded-2xl bg-slate-100 dark:bg-zinc-800/50" />
                  </div>
                ) : (
                  <>
                    {/* Network Selector */}
                    <div className="space-y-2.5">
                      <Label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Network Provider</Label>
                      <div className="grid grid-cols-4 gap-2.5">
                        {bundles.map((bundle) => {
                          const isSelected = formData.network === bundle.NETWORK
                          return (
                            <div
                              key={bundle.NETWORK}
                              onClick={() => setFormData((prev) => ({ ...prev, network: bundle.NETWORK, type: "", plan: "" }))}
                              className={cn(
                                "flex flex-col items-center justify-center p-2.5 rounded-2xl border cursor-pointer transition-all duration-300 select-none group",
                                isSelected
                                  ? "bg-[#47f0d1]/10 border-[#47f0d1] ring-2 ring-[#47f0d1]/10"
                                  : "bg-slate-50 dark:bg-zinc-800/30 border-slate-100 dark:border-white/5 hover:border-[#47f0d1]/30 hover:bg-slate-100/50 dark:hover:bg-zinc-800/50"
                              )}
                            >
                              <div className="relative w-9 h-9 mb-1.5 transition-transform duration-300 group-hover:scale-105">
                                <img
                                  src={networkImages[bundle.NETWORK] || "/placeholder-logo.png"}
                                  alt={bundle.NETWORK}
                                  className="w-full h-full rounded-full object-cover shadow-sm border border-slate-200/20"
                                />
                                {isSelected && (
                                  <div className="absolute -bottom-1 -right-1 bg-[#47f0d1] text-[#131321] rounded-full p-0.5 shadow-md">
                                    <Check className="w-2.5 h-2.5 stroke-[4]" />
                                  </div>
                                )}
                              </div>
                              <span className={cn(
                                "text-[9px] font-extrabold uppercase tracking-tight",
                                isSelected ? "text-[#47f0d1]" : "text-slate-600 dark:text-zinc-400"
                              )}>
                                {bundle.NETWORK}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Phone Input */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="080 1234 5678"
                        value={formData.phone}
                        onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                        className="h-14 rounded-2xl text-base font-semibold bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-white/5 focus:bg-white dark:focus:bg-[#18182d] focus:border-[#47f0d1] focus:ring-4 focus:ring-[#47f0d1]/10 text-slate-900 dark:text-white transition-all placeholder:text-slate-300 dark:placeholder:text-zinc-600"
                        required
                      />
                    </div>

                    {/* Type Selection */}
                    {formData.network && (
                      <div className="space-y-2">
                        <Label htmlFor="type" className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Data Type</Label>
                        <Select
                          value={formData.type}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value, plan: "" }))}
                        >
                          <SelectTrigger className="w-full h-14 rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-zinc-800/40 px-4 text-base font-semibold text-slate-900 dark:text-white focus:ring-4 focus:ring-[#47f0d1]/10">
                            <SelectValue placeholder="Choose type (e.g. SME, Gifting)" />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-[#131321] border border-slate-100 dark:border-white/10 rounded-2xl shadow-xl">
                            {availableTypes.map((type) => (
                              <SelectItem key={type} value={type} className="text-sm font-semibold text-slate-700 dark:text-zinc-300 focus:bg-[#47f0d1]/10 focus:text-slate-950 dark:focus:text-white">
                                {formatPlanType(type)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Plan Selection — selecting a plan auto-advances to PIN */}
                    {formData.network && formData.type && (
                      <div className="space-y-2">
                        <Label htmlFor="plan" className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Available Bundles</Label>
                        <Select
                          value={formData.plan}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, plan: value }))}
                        >
                          <SelectTrigger className="w-full h-14 rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-zinc-800/40 px-4 text-base font-semibold text-slate-900 dark:text-white focus:ring-4 focus:ring-[#47f0d1]/10">
                            <SelectValue placeholder="Select bundle — PIN screen opens" />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-[#131321] border border-slate-100 dark:border-white/10 rounded-2xl shadow-xl max-h-[220px]">
                            {filteredPlans.map((plan) => (
                              <SelectItem key={plan.dataPlan} value={plan.dataPlan} className="text-sm font-semibold text-slate-700 dark:text-zinc-300 focus:bg-[#47f0d1]/10 focus:text-slate-950 dark:focus:text-white">
                                <div className="flex items-center justify-between w-full min-w-[260px]">
                                  <span>{plan.dataBundle} – {plan.duration}</span>
                                  <span className="font-black text-[#47f0d1] ml-2">₦{plan.price}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-slate-400 dark:text-zinc-500 ml-1">Select a bundle to open the PIN screen</p>
                      </div>
                    )}
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
              <div className="h-full bg-white dark:bg-[#0f1117] flex flex-col rounded-[2rem]">
                {/* PIN Header */}
                <div className="flex flex-col items-center pt-8 pb-4 px-6 bg-gradient-to-b from-[#47f0d1]/5 to-white dark:from-[#131321] dark:to-[#0f1117] relative">
                  <button
                    onClick={() => { setStep("form"); setPin(""); setError("") }}
                    className="absolute top-5 left-5 p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <div className="w-16 h-16 bg-[#47f0d1]/10 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-[#47f0d1]/10">
                    <Shield className="w-8 h-8 text-[#47f0d1]" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Enter PIN</h2>

                  {/* Summary Card */}
                  {selectedPlan && (
                    <div className="mt-3 w-full bg-[#47f0d1]/5 border border-[#47f0d1]/15 rounded-2xl px-4 py-3 flex justify-between items-center">
                      <div>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 font-bold uppercase tracking-wider">Paying for</p>
                        <p className="text-sm font-black text-slate-900 dark:text-white">
                          {selectedPlan.dataBundle} {formData.network} Data
                        </p>
                        <p className="text-xs text-slate-400 dark:text-zinc-500">{formData.phone}</p>
                      </div>
                      <span className="text-2xl font-black text-[#47f0d1]">₦{selectedPlan.price}</span>
                    </div>
                  )}
                </div>

                <div className="px-6 pb-8 space-y-5 flex-1">
                  {error && (
                    <Alert variant="destructive" className="rounded-2xl border-red-500/20 bg-red-500/10">
                      <AlertDescription className="font-semibold text-red-500 dark:text-red-400 text-center text-sm">{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex flex-col items-center space-y-6 pt-2">
                    <div className="flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-[#47f0d1]" />
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
                            className="w-14 h-16 text-2xl font-black border-2 border-slate-200 dark:border-white/10 rounded-2xl bg-slate-50 dark:bg-zinc-800/40 text-slate-900 dark:text-white data-[active=true]:border-[#47f0d1] data-[active=true]:ring-4 data-[active=true]:ring-[#47f0d1]/15 dark:data-[active=true]:bg-[#18182d] transition-all text-center shadow-sm"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>

                    {isLoading && (
                      <div className="flex items-center gap-2 text-[#47f0d1] animate-pulse">
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
