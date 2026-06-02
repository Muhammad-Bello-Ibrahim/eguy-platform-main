"use client"
import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Smartphone, Check, KeyRound } from "lucide-react"
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

export function AirtimeModal({ isOpen, onClose, onSuccess }: AirtimeModalProps) {
  const [plans, setPlans] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    network: "",
    phone: "",
    amount: "",
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
    async function fetchPlans() {
      setFetching(true);
      try {
        const res = await fetch("/api/admin/airtime-plans");
        const data = await res.json();
        if (data && data.length > 0) {
          setPlans(data);
        } else {
          setPlans([
            { _id: '1', network: 'MTN', amount: 100, price: 95, apiPrice: 90 },
            { _id: '2', network: 'MTN', amount: 200, price: 190, apiPrice: 180 },
            { _id: '3', network: 'MTN', amount: 500, price: 475, apiPrice: 450 },
            { _id: '4', network: 'MTN', amount: 1000, price: 950, apiPrice: 900 },
            { _id: '5', network: 'AIRTEL', amount: 100, price: 95, apiPrice: 90 },
            { _id: '6', network: 'AIRTEL', amount: 200, price: 190, apiPrice: 180 },
            { _id: '7', network: 'AIRTEL', amount: 500, price: 475, apiPrice: 450 },
            { _id: '8', network: 'AIRTEL', amount: 1000, price: 950, apiPrice: 900 },
            { _id: '9', network: 'GLO', amount: 100, price: 95, apiPrice: 90 },
            { _id: '10', network: 'GLO', amount: 200, price: 190, apiPrice: 180 },
            { _id: '11', network: 'GLO', amount: 500, price: 475, apiPrice: 450 },
            { _id: '12', network: 'GLO', amount: 1000, price: 950, apiPrice: 900 },
            { _id: '13', network: '9MOBILE', amount: 100, price: 95, apiPrice: 90 },
            { _id: '14', network: '9MOBILE', amount: 200, price: 190, apiPrice: 180 },
            { _id: '15', network: '9MOBILE', amount: 500, price: 475, apiPrice: 450 },
            { _id: '16', network: '9MOBILE', amount: 1000, price: 950, apiPrice: 900 },
          ]);
        }
      } catch {
        setPlans([
          { _id: '1', network: 'MTN', amount: 100, price: 95, apiPrice: 90 },
          { _id: '2', network: 'MTN', amount: 200, price: 190, apiPrice: 180 },
        ]);
      }
      setFetching(false);
    }
    fetchPlans();
  }, []);

  // Show PIN section automatically once network + phone + amount are all filled
  useEffect(() => {
    const shouldShow = !!(formData.network && formData.phone && formData.amount)
    if (shouldShow && !showPin) {
      setShowPin(true)
      // Scroll PIN section into view after animation starts
      setTimeout(() => {
        pinSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
      }, 100)
    } else if (!shouldShow) {
      setShowPin(false)
      setPin("")
    }
  }, [formData.network, formData.phone, formData.amount])

  const handlePurchase = async (currentPin: string) => {
    setError("")
    setIsLoading(true)

    const amount = Number.parseFloat(formData.amount)
    if (!amount || amount < 50) {
      setError("Minimum airtime amount is ₦50")
      setIsLoading(false)
      return
    }

    if (!/^(234|0)[789]\d{9}$/.test(formData.phone)) {
      setError("Please enter a valid Nigerian phone number")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/payments/airtime", {
        method: "POST",
        body: JSON.stringify({ ...formData, pin: currentPin }),
        headers: { "Content-Type": "application/json" },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Airtime purchase failed")
      }

      setTransactionData({
        title: "Airtime Purchase Successful",
        description: `₦${amount} ${formData.network} airtime sent to ${formData.phone}`,
        amount: amount,
        service: `${formData.network} Airtime`,
        transactionId: data.reference
      })
      setSuccessModalOpen(true)
      onSuccess()
      onClose()
      setFormData({ network: "", phone: "", amount: "" })
      setPin("")
      setShowPin(false)
    } catch (error) {
      setTransactionData({
        title: "Airtime Purchase Failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        errorCode: "AIRTIME_PURCHASE_ERROR"
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

  const uniqueNetworks = [...new Set(plans.map(p => p.network))];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px] overflow-hidden">
          <DialogHeader className="flex flex-col items-center justify-center text-center pb-2">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 ring-8 ring-blue-50/50">
              <Smartphone className="w-8 h-8 text-blue-600" />
            </div>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Buy Airtime
            </DialogTitle>
            <DialogDescription className="text-gray-500 text-base max-w-[280px] mx-auto">
              Instant Top-up for all networks
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 pt-2">
            {error && (
              <Alert variant="destructive" className="rounded-2xl border-red-100 bg-red-50/50">
                <AlertDescription className="font-medium text-red-700 text-center">{error}</AlertDescription>
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
                {/* Network Select */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700 ml-1">Network Provider</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {uniqueNetworks.map((network) => (
                      <div
                        key={network}
                        onClick={() => setFormData(prev => ({ ...prev, network }))}
                        className={cn(
                          "flex flex-col items-center justify-center p-2 rounded-xl border cursor-pointer transition-all",
                          formData.network === network
                            ? "bg-blue-50 border-blue-500 ring-2 ring-blue-200"
                            : "bg-gray-50 border-gray-100 hover:border-blue-200 hover:bg-white"
                        )}
                      >
                        <div className="relative w-8 h-8 mb-1">
                          <img src={`/${network.toLowerCase()}.jpeg`} alt={network} className="w-full h-full rounded-full object-cover" />
                          {formData.network === network && (
                            <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-0.5">
                              <Check className="w-2.5 h-2.5" />
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-gray-700">{network}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Phone Input */}
                <div className="space-y-3">
                  <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 ml-1">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="080 1234 5678"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    className="h-14 rounded-2xl text-lg bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                    required
                  />
                </div>

                {/* Amount Select */}
                {formData.network && (
                  <div className="space-y-3">
                    <Label htmlFor="amount" className="text-sm font-semibold text-gray-700 ml-1">Amount</Label>
                    <Select
                      value={formData.amount}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, amount: value }))}
                    >
                      <SelectTrigger className="w-full h-14 rounded-xl border border-gray-200 bg-gray-50/50 px-4 text-base font-medium text-gray-900 focus:ring-2 focus:ring-blue-100">
                        <SelectValue placeholder="Select Amount" />
                      </SelectTrigger>
                      <SelectContent>
                        {plans.filter(p => p.network === formData.network).map((plan) => (
                          <SelectItem key={plan._id} value={plan.amount.toString()}>
                            <div className="flex items-center justify-between w-full min-w-[240px]">
                              <span className="font-semibold">₦{plan.amount}</span>
                              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Pays ₦{plan.price}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Transaction PIN — slides up when form is complete */}
                <div
                  ref={pinSectionRef}
                  className={cn(
                    "overflow-hidden transition-all duration-500 ease-out",
                    showPin
                      ? "max-h-[200px] opacity-100 translate-y-0"
                      : "max-h-0 opacity-0 translate-y-4"
                  )}
                  style={{
                    transform: showPin ? "translateY(0)" : "translateY(16px)",
                    transition: "max-height 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)"
                  }}
                >
                  <div className="pt-2 pb-1 space-y-3 border-t border-gray-100 mt-1">
                    <div className="flex items-center gap-2 mt-3">
                      <KeyRound className="w-4 h-4 text-blue-600" />
                      <Label className="text-sm font-semibold text-gray-700">Enter 4-digit PIN to confirm</Label>
                    </div>
                    <p className="text-xs text-gray-400 ml-6">Entering the last digit will auto-process your purchase</p>
                    <div className="flex justify-center py-2">
                      {isLoading ? (
                        <div className="flex items-center gap-3 py-4 text-blue-600">
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
                                className="w-14 h-16 text-xl font-black border-2 border-gray-200 rounded-2xl bg-gray-50 text-gray-900 data-[active=true]:border-blue-500 data-[active=true]:ring-blue-100 transition-all text-center"
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
