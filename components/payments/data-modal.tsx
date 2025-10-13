"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Wifi } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { SuccessModal } from "@/components/ui/success-modal"
import { ErrorModal } from "@/components/ui/error-modal"

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
  useEffect(() => {
    async function fetchBundles() {
      setFetching(true);
      try {
        const res = await fetch("/api/admin/data-plans");
        const data = await res.json();
        if (data && data.length > 0) {
          // Group by network for dropdown compatibility
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
          // Fallback data if database is empty
          const fallbackData = [
            // MTN Plans
            { _id: '1', network: 'MTN', dataBundle: '100MB', dataPlan: 'MTN_100MB', duration: '1 Day', type: 'Daily', status: 'Active', price: 100, apiPrice: 90 },
            { _id: '2', network: 'MTN', dataBundle: '500MB', dataPlan: 'MTN_500MB', duration: '1 Day', type: 'Daily', status: 'Active', price: 150, apiPrice: 135 },
            { _id: '3', network: 'MTN', dataBundle: '1GB', dataPlan: 'MTN_1GB', duration: '1 Day', type: 'Daily', status: 'Active', price: 250, apiPrice: 225 },
            { _id: '4', network: 'MTN', dataBundle: '2GB', dataPlan: 'MTN_2GB', duration: '3 Days', type: 'Weekly', status: 'Active', price: 500, apiPrice: 450 },
            { _id: '5', network: 'MTN', dataBundle: '5GB', dataPlan: 'MTN_5GB', duration: '7 Days', type: 'Weekly', status: 'Active', price: 1000, apiPrice: 900 },
            // Airtel Plans
            { _id: '6', network: 'AIRTEL', dataBundle: '100MB', dataPlan: 'AIRTEL_100MB', duration: '1 Day', type: 'Daily', status: 'Active', price: 100, apiPrice: 90 },
            { _id: '7', network: 'AIRTEL', dataBundle: '500MB', dataPlan: 'AIRTEL_500MB', duration: '1 Day', type: 'Daily', status: 'Active', price: 150, apiPrice: 135 },
            { _id: '8', network: 'AIRTEL', dataBundle: '1GB', dataPlan: 'AIRTEL_1GB', duration: '1 Day', type: 'Daily', status: 'Active', price: 250, apiPrice: 225 },
            { _id: '9', network: 'AIRTEL', dataBundle: '2GB', dataPlan: 'AIRTEL_2GB', duration: '3 Days', type: 'Weekly', status: 'Active', price: 500, apiPrice: 450 },
            { _id: '10', network: 'AIRTEL', dataBundle: '5GB', dataPlan: 'AIRTEL_5GB', duration: '7 Days', type: 'Weekly', status: 'Active', price: 1000, apiPrice: 900 },
            // GLO Plans
            { _id: '11', network: 'GLO', dataBundle: '100MB', dataPlan: 'GLO_100MB', duration: '1 Day', type: 'Daily', status: 'Active', price: 100, apiPrice: 90 },
            { _id: '12', network: 'GLO', dataBundle: '500MB', dataPlan: 'GLO_500MB', duration: '1 Day', type: 'Daily', status: 'Active', price: 150, apiPrice: 135 },
            { _id: '13', network: 'GLO', dataBundle: '1GB', dataPlan: 'GLO_1GB', duration: '1 Day', type: 'Daily', status: 'Active', price: 250, apiPrice: 225 },
            { _id: '14', network: 'GLO', dataBundle: '2GB', dataPlan: 'GLO_2GB', duration: '3 Days', type: 'Weekly', status: 'Active', price: 500, apiPrice: 450 },
            { _id: '15', network: 'GLO', dataBundle: '5GB', dataPlan: 'GLO_5GB', duration: '7 Days', type: 'Weekly', status: 'Active', price: 1000, apiPrice: 900 },
            // 9MOBILE Plans
            { _id: '16', network: '9MOBILE', dataBundle: '100MB', dataPlan: '9MOBILE_100MB', duration: '1 Day', type: 'Daily', status: 'Active', price: 100, apiPrice: 90 },
            { _id: '17', network: '9MOBILE', dataBundle: '500MB', dataPlan: '9MOBILE_500MB', duration: '1 Day', type: 'Daily', status: 'Active', price: 150, apiPrice: 135 },
            { _id: '18', network: '9MOBILE', dataBundle: '1GB', dataPlan: '9MOBILE_1GB', duration: '1 Day', type: 'Daily', status: 'Active', price: 250, apiPrice: 225 },
            { _id: '19', network: '9MOBILE', dataBundle: '2GB', dataPlan: '9MOBILE_2GB', duration: '3 Days', type: 'Weekly', status: 'Active', price: 500, apiPrice: 450 },
            { _id: '20', network: '9MOBILE', dataBundle: '5GB', dataPlan: '9MOBILE_5GB', duration: '7 Days', type: 'Weekly', status: 'Active', price: 1000, apiPrice: 900 },
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
        // Fallback data if API fails
        const fallbackData = [
          // MTN Plans
          { _id: '1', network: 'MTN', dataBundle: '100MB', dataPlan: 'MTN_100MB', duration: '1 Day', type: 'Daily', status: 'Active', price: 100, apiPrice: 90 },
          { _id: '2', network: 'MTN', dataBundle: '500MB', dataPlan: 'MTN_500MB', duration: '1 Day', type: 'Daily', status: 'Active', price: 150, apiPrice: 135 },
          { _id: '3', network: 'MTN', dataBundle: '1GB', dataPlan: 'MTN_1GB', duration: '1 Day', type: 'Daily', status: 'Active', price: 250, apiPrice: 225 },
          { _id: '4', network: 'MTN', dataBundle: '2GB', dataPlan: 'MTN_2GB', duration: '3 Days', type: 'Weekly', status: 'Active', price: 500, apiPrice: 450 },
          { _id: '5', network: 'MTN', dataBundle: '5GB', dataPlan: 'MTN_5GB', duration: '7 Days', type: 'Weekly', status: 'Active', price: 1000, apiPrice: 900 },
          // Airtel Plans
          { _id: '6', network: 'AIRTEL', dataBundle: '100MB', dataPlan: 'AIRTEL_100MB', duration: '1 Day', type: 'Daily', status: 'Active', price: 100, apiPrice: 90 },
          { _id: '7', network: 'AIRTEL', dataBundle: '500MB', dataPlan: 'AIRTEL_500MB', duration: '1 Day', type: 'Daily', status: 'Active', price: 150, apiPrice: 135 },
          { _id: '8', network: 'AIRTEL', dataBundle: '1GB', dataPlan: 'AIRTEL_1GB', duration: '1 Day', type: 'Daily', status: 'Active', price: 250, apiPrice: 225 },
          { _id: '9', network: 'AIRTEL', dataBundle: '2GB', dataPlan: 'AIRTEL_2GB', duration: '3 Days', type: 'Weekly', status: 'Active', price: 500, apiPrice: 450 },
          { _id: '10', network: 'AIRTEL', dataBundle: '5GB', dataPlan: 'AIRTEL_5GB', duration: '7 Days', type: 'Weekly', status: 'Active', price: 1000, apiPrice: 900 },
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
      setFetching(false);
    }
    fetchBundles();
  }, []);
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

      // Success - show success modal
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
      // Error - show error modal
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
      <DialogContent className="sm:max-w-md bg-white border border-gray-200 shadow-lg">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
              <Wifi className="w-5 h-5 text-teal-600" />
            </div>
            Buy Data Bundle
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Purchase data bundles for internet access
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive" className="rounded-lg border-red-200 bg-red-50">
              <AlertDescription className="font-medium text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          {fetching ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <Label htmlFor="network" className="text-sm font-semibold text-gray-900">Network Provider</Label>
                <Select
                  value={formData.network}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, network: value, plan: "" }))}
                >
                  <SelectTrigger className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <SelectValue placeholder="Select network provider" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    {bundles.map((bundle) => (
                      <SelectItem key={bundle.NETWORK} value={bundle.NETWORK}>
                        <div className="flex items-center space-x-2">
                          <img src={networkImages[bundle.NETWORK] || "/placeholder-logo.png"} alt={bundle.NETWORK + ' logo'} className="w-6 h-6 rounded-full object-contain" />
                          <span>{bundle.NETWORK}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="phone" className="text-sm font-semibold text-gray-900">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="08012345678"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              {formData.network && (
                <div className="space-y-3">
                  <Label htmlFor="plan" className="text-sm font-semibold text-gray-900">Data Plan</Label>
                  <Select
                    value={formData.plan}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, plan: value }))}
                  >
                    <SelectTrigger className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500">
                      <SelectValue placeholder="Select data plan" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      {bundles
                        .find((b) => b.NETWORK === formData.network)?.BUNDLE
                        .filter((plan) => plan.status === "Active")
                        .map((plan) => (
                          <SelectItem key={plan.dataPlan} value={plan.dataPlan}>
                            <div className="flex items-center justify-between w-full">
                              <span>{plan.dataBundle} {plan.duration} ({plan.type})</span>
                              <span className="font-medium text-teal-600">₦{plan.price}</span>
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedPlan && (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">Total Amount:</span>
                    <span className="font-bold text-teal-600">₦{selectedPlan.price}</span>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={isLoading || !formData.network || !formData.phone || !formData.plan}
                  className="flex-1 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold text-lg shadow-lg hover:shadow-teal-500/25 transition-all duration-200 border-0 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Buy Data - ₦${selectedPlan?.price || 0}`
                  )}
                </Button>
              </div>
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
