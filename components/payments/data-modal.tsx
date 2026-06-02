"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Wifi, Check, Sparkles, KeyRound } from "lucide-react"
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
};

type DataPlan = {
  dataBundle: string;
  dataPlan: string;
  duration: string;
  type: string;
  status: string;
  price: number;
  apiPrice: number;
};

type BundlesResponse = {
  NETWORK: string;
  BUNDLE: DataPlan[];
};

export function DataModal({ isOpen, onClose, onSuccess }: DataModalProps) {
  const [bundles, setBundles] = useState<BundlesResponse[]>([]);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    network: "",
    phone: "",
    type: "",
    plan: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [pin, setPin] = useState("")
  const [showPin, setShowPin] = useState(false)
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [errorModalOpen, setErrorModalOpen] = useState(false)
  const [transactionData, setTransactionData] = useState<any>(null)
  const pinSectionRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchBundles() {
      setFetching(true);
      try {
        const res = await fetch("/api/admin/data-plans");
        const data = await res.json();
        if (data && data.length > 0) {
          const grouped = data.reduce((acc: any, plan: any) => {
            if (!acc[plan.network]) acc[plan.network] = [];
            acc[plan.network].push(plan);
            return acc;
          }, {});
          setBundles(
            Object.keys(grouped).map((network) => ({
              NETWORK: network,
              BUNDLE: grouped[network],
            }))
          );
        } else {
          const fallbackData = [
            { _id: '1', network: 'MTN', dataBundle: '500MB', dataPlan: 'MTN_500MB_SME', duration: '30 Days', type: 'SME', status: 'Active', price: 125, apiPrice: 119 },
            { _id: '2', network: 'MTN', dataBundle: '1GB', dataPlan: 'MTN_1GB_SME', duration: '30 Days', type: 'SME', status: 'Active', price: 245, apiPrice: 239 },
            { _id: '3', network: 'MTN', dataBundle: '2GB', dataPlan: 'MTN_2GB_SME', duration: '30 Days', type: 'SME', status: 'Active', price: 490, apiPrice: 480 },
            { _id: '4', network: 'MTN', dataBundle: '5GB', dataPlan: 'MTN_5GB_SME', duration: '30 Days', type: 'SME', status: 'Active', price: 1225, apiPrice: 1200 },
            { _id: '5', network: 'MTN', dataBundle: '1GB', dataPlan: 'MTN_1GB_GIFTING', duration: '30 Days', type: 'GIFTING', status: 'Active', price: 290, apiPrice: 280 },
            { _id: '6', network: 'AIRTEL', dataBundle: '1GB', dataPlan: 'AIRTEL_1GB_SME', duration: '30 Days', type: 'SME', status: 'Active', price: 235, apiPrice: 230 },
            { _id: '7', network: 'AIRTEL', dataBundle: '2GB', dataPlan: 'AIRTEL_2GB_SME', duration: '30 Days', type: 'SME', status: 'Active', price: 470, apiPrice: 460 },
            { _id: '11', network: 'GLO', dataBundle: '1GB', dataPlan: 'GLO_1GB_CG', duration: '30 Days', type: 'CORPORATE GIFTING', status: 'Active', price: 250, apiPrice: 240 },
            { _id: '12', network: 'GLO', dataBundle: '2GB', dataPlan: 'GLO_2GB_CG', duration: '30 Days', type: 'CORPORATE GIFTING', status: 'Active', price: 500, apiPrice: 480 },
            { _id: '16', network: '9MOBILE', dataBundle: '1GB', dataPlan: '9MOBILE_1GB_GIFTING', duration: '30 Days', type: 'GIFTING', status: 'Active', price: 400, apiPrice: 380 },
          ];

          const grouped = fallbackData.reduce((acc: any, plan: any) => {
            if (!acc[plan.network]) acc[plan.network] = [];
            acc[plan.network].push(plan);
            return acc;
          }, {});
          setBundles(
            Object.keys(grouped).map((network) => ({
              NETWORK: network,
              BUNDLE: grouped[network],
            }))
          );
        }
      } catch (e) {
        console.error("Bundles load error", e)
      }
      setFetching(false);
    }
    fetchBundles();
  }, []);

  const availableTypes = formData.network
    ? Array.from(new Set(
        bundles
          .find((b) => b.NETWORK === formData.network)
          ?.BUNDLE.filter((plan) => plan.status === "Active")
          .map((plan) => plan.type) || []
      ))
    : [];

  const filteredPlans = formData.network && formData.type
    ? bundles
        .find((b) => b.NETWORK === formData.network)
        ?.BUNDLE.filter((plan) => plan.status === "Active" && plan.type === formData.type) || []
    : [];

  const selectedPlan =
    formData.network && formData.plan
      ? bundles
        .find((b) => b.NETWORK === formData.network)
        ?.BUNDLE.find((p) => p.dataPlan === formData.plan)
      : null;

  // Show PIN section automatically once bundle is selected
  useEffect(() => {
    const shouldShow = !!(formData.network && formData.phone && formData.plan && selectedPlan)
    if (shouldShow && !showPin) {
      setShowPin(true)
      setTimeout(() => {
        pinSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
      }, 100)
    } else if (!shouldShow) {
      setShowPin(false)
      setPin("")
    }
  }, [formData.network, formData.phone, formData.plan, selectedPlan])

  const handlePurchase = async (currentPin: string) => {
    setError("")
    setIsLoading(true)

    if (!selectedPlan) {
      setError("Please select a data plan")
      setIsLoading(false)
      return
    }

    if (!/^(\+234|0)[789]\d{9}$/.test(formData.phone)) {
      setError("Please enter a valid Nigerian phone number")
      setIsLoading(false)
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
          pin: currentPin,
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
        transactionId: data.reference
      })
      setSuccessModalOpen(true)
      onSuccess()
      onClose()
      setFormData({ network: "", phone: "", type: "", plan: "" })
      setPin("")
      setShowPin(false)
    } catch (error) {
      setTransactionData({
        title: "Data Purchase Failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        errorCode: "DATA_PURCHASE_ERROR"
      })
      setErrorModalOpen(true)
      setPin("")
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-trigger when 4th digit entered
  const handlePinChange = (value: string) => {
    setPin(value)
    if (value.length === 4 && !isLoading) {
      handlePurchase(value)
    }
  }

  const formatPlanType = (type: string) => {
    if (!type) return "";
    return type
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[440px] overflow-hidden bg-white/95 dark:bg-[#131321]/95 backdrop-blur-xl border border-slate-100 dark:border-white/10 text-slate-900 dark:text-white rounded-[2.5rem] p-6 shadow-2xl transition-all duration-300">
          
          {/* Top aesthetic pill grabber */}
          <div className="w-12 h-1.5 bg-slate-200 dark:bg-zinc-700/50 rounded-full mx-auto -mt-1 mb-4"></div>

          <DialogHeader className="flex flex-col items-center justify-center text-center pb-2">
            <div className="w-16 h-16 bg-[#47f0d1]/10 rounded-full flex items-center justify-center mb-4 ring-8 ring-[#47f0d1]/5 text-[#47f0d1] hover:scale-105 transition-transform duration-300">
              <Wifi className="w-8 h-8" />
            </div>
            <DialogTitle className="text-2xl font-black tracking-tight bg-gradient-to-br from-slate-950 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent flex items-center gap-2">
              Buy Data Bundle <Sparkles className="w-5 h-5 text-[#47f0d1] animate-pulse" />
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-zinc-400 text-sm max-w-[280px] mx-auto leading-relaxed">
              Get connected with affordable internet packages
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 pt-2">
            {error && (
              <Alert variant="destructive" className="rounded-2xl border-red-500/20 bg-red-500/10 text-red-500 dark:text-red-400">
                <AlertDescription className="font-semibold text-center">{error}</AlertDescription>
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
                {/* Network Select */}
                <div className="space-y-2.5">
                  <Label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Network Provider</Label>
                  <div className="grid grid-cols-4 gap-2.5">
                    {bundles.map((bundle) => {
                      const isSelected = formData.network === bundle.NETWORK;
                      return (
                        <div
                          key={bundle.NETWORK}
                          onClick={() => setFormData(prev => ({ ...prev, network: bundle.NETWORK, type: "", plan: "" }))}
                          className={cn(
                            "flex flex-col items-center justify-center p-2.5 rounded-2xl border cursor-pointer transition-all duration-300 relative overflow-hidden group select-none",
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
                            "text-[10px] font-extrabold uppercase tracking-tight",
                            isSelected ? "text-[#47f0d1]" : "text-slate-600 dark:text-zinc-400"
                          )}>{bundle.NETWORK}</span>
                        </div>
                      );
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
                    className="h-14 rounded-2xl text-lg bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-white/5 focus:bg-white dark:focus:bg-[#18182d] focus:border-[#47f0d1] focus:ring-4 focus:ring-[#47f0d1]/10 text-slate-900 dark:text-white font-bold transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-600"
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
                      <SelectTrigger className="w-full h-14 rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-zinc-800/40 px-4 text-base font-semibold text-slate-955 dark:text-white focus:ring-4 focus:ring-[#47f0d1]/10">
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

                {/* Plan Selection */}
                {formData.network && formData.type && (
                  <div className="space-y-2">
                    <Label htmlFor="plan" className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Available Bundles</Label>
                    <Select
                      value={formData.plan}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, plan: value }))}
                    >
                      <SelectTrigger className="w-full h-14 rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-zinc-800/40 px-4 text-base font-semibold text-slate-955 dark:text-white focus:ring-4 focus:ring-[#47f0d1]/10">
                        <SelectValue placeholder="Select bundle package" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-[#131321] border border-slate-100 dark:border-white/10 rounded-2xl shadow-xl max-h-[220px]">
                        {filteredPlans.map((plan) => (
                          <SelectItem key={plan.dataPlan} value={plan.dataPlan} className="text-sm font-semibold text-slate-700 dark:text-zinc-300 focus:bg-[#47f0d1]/10 focus:text-slate-950 dark:focus:text-white">
                            <div className="flex items-center justify-between w-full min-w-[260px]">
                              <span>{plan.dataBundle} - {plan.duration}</span>
                              <span className="font-bold text-[#47f0d1] ml-2">₦{plan.price}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Summary Box */}
                {selectedPlan && (
                  <div className="bg-[#47f0d1]/5 border border-[#47f0d1]/10 p-4 rounded-2xl transition-all duration-300">
                    <div className="flex justify-between items-center">
                      <div className="space-y-0.5">
                        <span className="text-xs text-slate-500 dark:text-zinc-500 font-bold uppercase tracking-widest">Total Amount</span>
                        <p className="text-xs text-slate-400 dark:text-zinc-400">{selectedPlan.dataBundle} ({formatPlanType(formData.type)})</p>
                      </div>
                      <span className="text-2xl font-black text-[#47f0d1]">₦{selectedPlan.price}</span>
                    </div>
                  </div>
                )}

                {/* Transaction PIN — slides up when bundle is selected */}
                <div
                  ref={pinSectionRef}
                  className={cn(
                    "overflow-hidden transition-all duration-500 ease-out"
                  )}
                  style={{
                    maxHeight: showPin ? "220px" : "0px",
                    opacity: showPin ? 1 : 0,
                    transform: showPin ? "translateY(0)" : "translateY(16px)",
                    transition: "max-height 0.55s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease, transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)"
                  }}
                >
                  <div className="pt-2 pb-1 space-y-3 border-t border-[#47f0d1]/10 mt-1">
                    <div className="flex items-center gap-2 mt-3">
                      <KeyRound className="w-4 h-4 text-[#47f0d1]" />
                      <Label className="text-sm font-semibold text-slate-700 dark:text-zinc-300">Enter 4-digit PIN to confirm</Label>
                    </div>
                    <p className="text-xs text-slate-400 dark:text-zinc-500 ml-6">Entering the last digit will auto-process your purchase</p>
                    <div className="flex justify-center py-2">
                      {isLoading ? (
                        <div className="flex items-center gap-3 py-4 text-[#47f0d1]">
                          <Loader2 className="w-6 h-6 animate-spin" />
                          <span className="font-semibold text-sm">Processing purchase...</span>
                        </div>
                      ) : (
                        <InputOTP
                          maxLength={4}
                          value={pin}
                          onChange={handlePinChange}
                          autoFocus
                        >
                          <InputOTPGroup className="gap-3">
                            {[0, 1, 2, 3].map((i) => (
                              <InputOTPSlot
                                key={i}
                                index={i}
                                className="w-14 h-16 text-xl font-black border-2 border-slate-100 dark:border-white/10 rounded-2xl bg-slate-50 dark:bg-zinc-800/40 text-slate-900 dark:text-white data-[active=true]:border-[#47f0d1] data-[active=true]:ring-[#47f0d1]/20 data-[active=true]:bg-white dark:data-[active=true]:bg-[#18182d] transition-all text-center"
                              />
                            ))}
                          </InputOTPGroup>
                        </InputOTP>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      {transactionData && (
        <SuccessModal
          isOpen={successModalOpen}
          onClose={() => {
            setSuccessModalOpen(false)
            setTransactionData(null)
          }}
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
          onClose={() => {
            setErrorModalOpen(false)
            setTransactionData(null)
          }}
          title={transactionData.title}
          description={transactionData.description}
          errorCode={transactionData.errorCode}
        />
      )}
    </>
  )
}
