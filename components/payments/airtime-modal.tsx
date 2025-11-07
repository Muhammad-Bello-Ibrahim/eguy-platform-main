"use client"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Smartphone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { SuccessModal } from "@/components/ui/success-modal"
import { ErrorModal } from "@/components/ui/error-modal"

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
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [errorModalOpen, setErrorModalOpen] = useState(false)
  const [transactionData, setTransactionData] = useState<any>(null)
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
          // Fallback data if database is empty
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
      } catch (e) {
        // Fallback data if API fails
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
      setFetching(false);
    }
    fetchPlans();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Airtime purchase failed")
      }

      // Success - show success modal
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
    } catch (error) {
      // Error - show error modal
      setTransactionData({
        title: "Airtime Purchase Failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        errorCode: "AIRTIME_PURCHASE_ERROR"
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
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-blue-600" />
            </div>
            Buy Airtime
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Top up your phone or someone else's with airtime
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
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, network: value }))}
                >
                  <SelectTrigger className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Select network provider" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    {[...new Set(plans.map(p => p.network))].map((network) => (
                      <SelectItem key={network} value={network}>
                        <div className="flex items-center space-x-2">
                          <img src={`/${network.toLowerCase()}.jpeg`} alt={network + ' logo'} className="w-6 h-6 rounded-full object-contain" />
                          <span>{network}</span>
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
                  className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {formData.network && (
                <div className="space-y-3">
                  <Label htmlFor="amount" className="text-sm font-semibold text-gray-900">Amount</Label>
                  <Select
                    value={formData.amount}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, amount: value }))}
                  >
                    <SelectTrigger className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <SelectValue placeholder="Select airtime amount" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      {plans.filter(p => p.network === formData.network).map((plan) => (
                        <SelectItem key={plan._id} value={plan.amount.toString()}>
                          <div className="flex items-center justify-between w-full">
                            <span>₦{plan.amount}</span>
                            <span className="font-medium text-blue-600">₦{plan.price}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={isLoading || !formData.network || !formData.phone || !formData.amount}
                  className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-lg shadow-lg hover:shadow-blue-500/25 transition-all duration-200 border-0 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Buy Airtime"
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
