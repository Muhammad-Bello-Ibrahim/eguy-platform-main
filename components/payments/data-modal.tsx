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
  price: { api_user: string }[];
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
      } catch (e) {
        // fallback: do nothing
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

      toast({
        title: "Data Purchase Successful",
        description: `${selectedPlan.dataBundle} ${formData.network} data sent to ${formData.phone}`,
      })

      onSuccess()
      onClose()
      setFormData({ network: "", phone: "", plan: "" })
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Wifi className="w-7 h-7" />
            <span>Buy Data Bundle</span>
          </DialogTitle>
          <DialogDescription>Purchase data bundles for internet access</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {fetching ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ) : (
            <>
              <div className="space-y-2 w-full">
                <Label htmlFor="network" className="text-sm font-semibold text-green-700 mb-1">Network</Label>
                <Select
                  value={formData.network}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, network: value, plan: "" }))}
                >
                  <SelectTrigger className="w-full rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-base font-semibold text-green-700 focus:outline-none">
                    <SelectValue placeholder="Select network" />
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

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="08012345678"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  required
                />
              </div>

              {formData.network && (
                <div className="space-y-2 w-full">
                  <Label htmlFor="plan" className="text-sm font-semibold text-green-700 mb-1">Data Plan</Label>
                  <Select
                    value={formData.plan}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, plan: value }))}
                  >
                    <SelectTrigger className="w-full rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-base font-semibold text-green-700 focus:outline-none">
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
                              <span className="font-medium">₦{plan.price}</span>
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedPlan && (
                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Amount:</span>
                    <span className="font-bold text-primary">₦{selectedPlan.price}</span>
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !formData.network || !formData.phone || !formData.plan}
                  className="flex-1"
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
  )
}
