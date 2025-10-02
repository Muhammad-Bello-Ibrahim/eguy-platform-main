"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Zap, Tv, GraduationCap, Droplets } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BillsModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const billTypes = [
  { value: "electricity", label: "Electricity", icon: Zap, color: "text-yellow-600" },
  { value: "water", label: "Water", icon: Droplets, color: "text-blue-600" },
  { value: "tv", label: "TV Subscription", icon: Tv, color: "text-purple-600" },
  { value: "education", label: "Education", icon: GraduationCap, color: "text-green-600" },
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
      const response = await fetch("/api/payments/bills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceType: formData.serviceType,
          provider: formData.provider,
          amount: amount,
          recipient: formData.recipient,
          customerInfo: formData.customerInfo,
        }),
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {selectedBillType ? (
              <selectedBillType.icon className={`h-5 w-5 ${selectedBillType.color}`} />
            ) : (
              <Zap className="h-5 w-5" />
            )}
            <span>Pay Bills</span>
          </DialogTitle>
          <DialogDescription>Pay your utility bills quickly and securely</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2 w-full">
            <Label htmlFor="serviceType" className="text-sm font-semibold text-green-700 mb-1">Service Type</Label>
            <Select
              value={formData.serviceType}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, serviceType: value, provider: "" }))}
            >
              <SelectTrigger className="w-full rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-base font-semibold text-green-700 focus:outline-none">
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {billTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center space-x-2">
                      <type.icon className={`w-4 h-4 ${type.color}`} />
                      <span>{type.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.serviceType && (
            <div className="space-y-2 w-full">
              <Label htmlFor="provider" className="text-sm font-semibold text-green-700 mb-1">Provider</Label>
              <Select
                value={formData.provider}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, provider: value }))}
              >
                <SelectTrigger className="w-full rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-base font-semibold text-green-700 focus:outline-none">
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

          <div className="space-y-2">
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
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (NGN)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
              min="100"
              step="1"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerInfo">Customer Name (Optional)</Label>
            <Input
              id="customerInfo"
              type="text"
              placeholder="Enter customer name"
              value={formData.customerInfo}
              onChange={(e) => setFormData((prev) => ({ ...prev, customerInfo: e.target.value }))}
            />
          </div>

          <div className="flex space-x-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isLoading || !formData.serviceType || !formData.provider || !formData.recipient || !formData.amount
              }
              className="flex-1"
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
