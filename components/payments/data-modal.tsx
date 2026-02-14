"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Wifi, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { SuccessModal } from "@/components/ui/success-modal"
import { ErrorModal } from "@/components/ui/error-modal"
import { cn } from "@/lib/utils"

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
    plan: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [errorModalOpen, setErrorModalOpen] = useState(false)
  const [transactionData, setTransactionData] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchBundles() {
      setFetching(true);
      try {
        const res = await fetch("/api/admin/data-plans");
        const data = await res.json();
        if (data && data.length > 0) {
          // Group by network
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
          // Fallback data
          const fallbackData = [
            // MTN Plans
            { _id: '1', network: 'MTN', dataBundle: '100MB', dataPlan: 'MTN_100MB', duration: '1 Day', type: 'Daily', status: 'Active', price: 100, apiPrice: 90 },
            { _id: '2', network: 'MTN', dataBundle: '500MB', dataPlan: 'MTN_500MB', duration: '1 Day', type: 'Daily', status: 'Active', price: 150, apiPrice: 135 },
            { _id: '3', network: 'MTN', dataBundle: '1GB', dataPlan: 'MTN_1GB', duration: '1 Day', type: 'Daily', status: 'Active', price: 250, apiPrice: 225 },
            { _id: '4', network: 'MTN', dataBundle: '2GB', dataPlan: 'MTN_2GB', duration: '3 Days', type: 'Weekly', status: 'Active', price: 500, apiPrice: 450 },
            { _id: '5', network: 'MTN', dataBundle: '5GB', dataPlan: 'MTN_5GB', duration: '7 Days', type: 'Weekly', status: 'Active', price: 1000, apiPrice: 900 },
            // ... minimal fallback
            { _id: '6', network: 'AIRTEL', dataBundle: '100MB', dataPlan: 'AIRTEL_100MB', duration: '1 Day', type: 'Daily', status: 'Active', price: 100, apiPrice: 90 },
            { _id: '11', network: 'GLO', dataBundle: '100MB', dataPlan: 'GLO_100MB', duration: '1 Day', type: 'Daily', status: 'Active', price: 100, apiPrice: 90 },
            { _id: '16', network: '9MOBILE', dataBundle: '100MB', dataPlan: '9MOBILE_100MB', duration: '1 Day', type: 'Daily', status: 'Active', price: 100, apiPrice: 90 },
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
        // Error handling
      }
      setFetching(false);
    }
    fetchBundles();
  }, []);

  const selectedPlan =
    formData.network && formData.plan
      ? bundles
        .find((b) => b.NETWORK === formData.network)
        ?.BUNDLE.find((p) => p.dataPlan === formData.plan)
      : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          network: formData.network,
          phone: formData.phone,
          plan: selectedPlan.dataPlan,
          amount: selectedPlan.price,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Data purchase failed")
      }

      // Success
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
      setFormData({ network: "", phone: "", plan: "" })
    } catch (error) {
      // Error
      setTransactionData({
        title: "Data Purchase Failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        errorCode: "DATA_PURCHASE_ERROR"
      })
      setErrorModalOpen(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px] overflow-hidden">
          <DialogHeader className="flex flex-col items-center justify-center text-center pb-2">
            <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-4 ring-8 ring-teal-50/50">
              <Wifi className="w-8 h-8 text-teal-600" />
            </div>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Buy Data Bundle
            </DialogTitle>
            <DialogDescription className="text-gray-500 text-base max-w-[280px] mx-auto">
              Get connected with affordable data plans
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 pt-2">
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
                    {bundles.map((bundle) => (
                      <div
                        key={bundle.NETWORK}
                        onClick={() => setFormData(prev => ({ ...prev, network: bundle.NETWORK, plan: "" }))}
                        className={cn(
                          "flex flex-col items-center justify-center p-2 rounded-xl border cursor-pointer transition-all",
                          formData.network === bundle.NETWORK
                            ? "bg-teal-50 border-teal-500 ring-2 ring-teal-200"
                            : "bg-gray-50 border-gray-100 hover:border-teal-200 hover:bg-white"
                        )}
                      >
                        <div className="relative w-8 h-8 mb-1">
                          <img src={networkImages[bundle.NETWORK] || "/placeholder-logo.png"} alt={bundle.NETWORK} className="w-full h-full rounded-full object-cover" />
                          {formData.network === bundle.NETWORK && (
                            <div className="absolute -bottom-1 -right-1 bg-teal-500 text-white rounded-full p-0.5">
                              <Check className="w-2.5 h-2.5" />
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-gray-700">{bundle.NETWORK}</span>
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

                {formData.network && (
                  <div className="space-y-3">
                    <Label htmlFor="plan" className="text-sm font-semibold text-gray-700 ml-1">Data Plan</Label>
                    <Select
                      value={formData.plan}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, plan: value }))}
                    >
                      <SelectTrigger className="w-full h-14 rounded-xl border border-gray-200 bg-gray-50/50 px-4 text-base font-medium text-gray-900 focus:ring-2 focus:ring-teal-100">
                        <SelectValue placeholder="Select data plan" />
                      </SelectTrigger>
                      <SelectContent>
                        {bundles
                          .find((b) => b.NETWORK === formData.network)?.BUNDLE
                          .filter((plan) => plan.status === "Active")
                          .map((plan) => (
                            <SelectItem key={plan.dataPlan} value={plan.dataPlan}>
                              <div className="flex items-center justify-between w-full min-w-[240px]">
                                <span>{plan.dataBundle} {plan.duration} ({plan.type})</span>
                                <span className="font-semibold text-teal-600">₦{plan.price}</span>
                              </div>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {selectedPlan && (
                  <div className="bg-teal-50/50 p-4 rounded-xl border border-teal-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900">Total Amount</span>
                      <span className="text-xl font-bold text-teal-700">₦{selectedPlan.price}</span>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading || !formData.network || !formData.phone || !formData.plan}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-lg shadow-xl shadow-teal-200 transition-all duration-200 disabled:opacity-70 mt-4"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Buy Data Bundle"
                  )}
                </Button>
              </>
            )}
          </form>
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
