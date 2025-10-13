"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Receipt } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BillsModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const billTypes = [
  { value: "electricity", label: "Electricity", icon: "⚡", color: "text-yellow-600" },
  { value: "water", label: "Water", icon: "💧", color: "text-blue-600" },
  { value: "tv", label: "TV Subscription", icon: "📺", color: "text-purple-600" },
  { value: "education", label: "Education", icon: "🎓", color: "text-green-600" },
]

const providers = {
  electricity: [
    { value: "ekedc", label: "Eko Electricity (EKEDC)" },
    { value: "ikedc", label: "Ikeja Electric (IKEDC)" },
    { value: "aedc", label: "Abuja Electricity (AEDC)" },
    { value: "phed", label: "Port Harcourt Electric (PHED)" },
  ],
  water: [
    { value: "lagos-water", label: "Lagos Water Corporation" },
    { value: "abuja-water", label: "FCT Water Board" },
    { value: "kano-water", label: "Kano State Water Board" },
  ],
  tv: [
    { value: "dstv", label: "DSTV" },
    { value: "gotv", label: "GOtv" },
    { value: "startimes", label: "StarTimes" },
    { value: "showmax", label: "Showmax" },
  ],
  education: [
    { value: "waec", label: "WAEC" },
    { value: "jamb", label: "JAMB" },
    { value: "neco", label: "NECO" },
  ],
}

export function BillsModal({ isOpen, onClose, onSuccess }: BillsModalProps) {
  const [formData, setFormData] = useState({
    serviceType: "",
    provider: "",
    recipient: "",
    amount: "",
    customerInfo: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const amount = Number.parseFloat(formData.amount)
    if (!amount || amount < 100) {
      setError("Minimum bill payment amount is ₦100")
      setIsLoading(false)
      return
    }

    try {
      // Use specific API endpoints for different services
      let endpoint = "/api/payments/bills"
      let requestBody: any = {
        serviceType: formData.serviceType,
        provider: formData.provider,
        amount: amount,
        recipient: formData.recipient,
        customerInfo: formData.customerInfo,
      }

      // Use specific APIs for better integration
      if (formData.serviceType === "water") {
        endpoint = "/api/payments/water"
        requestBody = {
          provider: formData.provider,
          meterNumber: formData.recipient,
          amount: amount,
          customerInfo: formData.customerInfo,
        }
      } else if (formData.serviceType === "electricity") {
        endpoint = "/api/payments/electricity"
        requestBody = {
          disco: formData.provider,
          meterType: "prepaid", // Default to prepaid
          meterNumber: formData.recipient,
          amount: amount,
        }
      } else if (formData.serviceType === "education") {
        endpoint = "/api/payments/education"
        requestBody = {
          service: formData.provider,
          bills_code: formData.serviceType,
          regNumber: formData.recipient,
          amount: amount,
        }
      }
      // TV subscriptions use the general bills API

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Bill payment failed")
      }

      toast({
        title: "Bill Payment Successful",
        description: `₦${amount.toLocaleString()} ${formData.serviceType} payment completed`,
      })

      onSuccess()
      onClose()
      setFormData({ serviceType: "", provider: "", recipient: "", amount: "", customerInfo: "" })
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const selectedBillType = billTypes.find((type) => type.value === formData.serviceType)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white border border-gray-200 shadow-lg">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Receipt className="w-5 h-5 text-purple-600" />
            </div>
            Pay Bills
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Pay your utility bills quickly and securely
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive" className="rounded-lg border-red-200 bg-red-50">
              <AlertDescription className="font-medium text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <Label htmlFor="serviceType" className="text-sm font-semibold text-gray-900">Service Type</Label>
            <Select
              value={formData.serviceType}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, serviceType: value, provider: "" }))}
            >
              <SelectTrigger className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {billTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center space-x-2">
                      <span>{type.icon}</span>
                      <span>{type.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.serviceType && (
            <div className="space-y-3">
              <Label htmlFor="provider" className="text-sm font-semibold text-gray-900">Provider</Label>
              <Select
                value={formData.provider}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, provider: value }))}
              >
                <SelectTrigger className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  {providers[formData.serviceType as keyof typeof providers]?.map((provider) => (
                    <SelectItem key={provider.value} value={provider.value}>
                      {provider.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-3">
            <Label htmlFor="recipient">
              {formData.serviceType === "electricity"
                ? "Meter Number"
                : formData.serviceType === "water"
                  ? "Account Number"
                  : formData.serviceType === "tv"
                    ? "Smart Card Number"
                    : formData.serviceType === "education"
                      ? "Registration Number"
                      : "Account/Reference Number"}
            </Label>
            <Input
              id="recipient"
              type="text"
              placeholder={
                formData.serviceType === "electricity"
                  ? "Enter meter number"
                  : formData.serviceType === "water"
                    ? "Enter account number"
                    : formData.serviceType === "tv"
                      ? "Enter smart card number"
                      : formData.serviceType === "education"
                        ? "Enter registration number"
                        : "Enter account/reference number"
              }
              value={formData.recipient}
              onChange={(e) => setFormData((prev) => ({ ...prev, recipient: e.target.value }))}
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="amount" className="text-sm font-semibold text-gray-900">Amount (₦)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
              min="100"
              step="1"
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="customerInfo" className="text-sm font-semibold text-gray-900">Customer Name (Optional)</Label>
            <Input
              id="customerInfo"
              type="text"
              placeholder="Enter customer name"
              value={formData.customerInfo}
              onChange={(e) => setFormData((prev) => ({ ...prev, customerInfo: e.target.value }))}
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={
                isLoading || !formData.serviceType || !formData.provider || !formData.recipient || !formData.amount
              }
              className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold text-lg shadow-lg hover:shadow-purple-500/25 transition-all duration-200 border-0 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Pay Bill"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
