"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Receipt, Lightbulb, Droplets, Tv, GraduationCap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface BillsModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const billTypes = [
  { value: "electricity", label: "Electricity", icon: Lightbulb, color: "text-amber-500", bgColor: "bg-amber-100", ringColor: "ring-amber-500/20" },
  { value: "water", label: "Water", icon: Droplets, color: "text-cyan-500", bgColor: "bg-cyan-100", ringColor: "ring-cyan-500/20" },
  { value: "tv", label: "TV Subscription", icon: Tv, color: "text-rose-500", bgColor: "bg-rose-100", ringColor: "ring-rose-500/20" },
  { value: "education", label: "Education", icon: GraduationCap, color: "text-blue-500", bgColor: "bg-blue-100", ringColor: "ring-blue-500/20" },
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
      <DialogContent className="sm:max-w-[480px] overflow-hidden">
        <DialogHeader className="flex flex-col items-center justify-center text-center pb-2">
          <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4 ring-8 ring-purple-50/50">
            <Receipt className="w-8 h-8 text-purple-600" />
          </div>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Pay Bills
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-base max-w-[280px] mx-auto">
            Pay your utility bills quickly and securely
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          {error && (
            <Alert variant="destructive" className="rounded-2xl border-red-100 bg-red-50/50">
              <AlertDescription className="font-medium text-red-700 text-center">{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <Label className="text-sm font-semibold text-gray-700 ml-1">Service Type</Label>
            <div className="grid grid-cols-2 gap-3">
              {billTypes.map((type) => (
                <div
                  key={type.value}
                  onClick={() => setFormData(prev => ({ ...prev, serviceType: type.value, provider: "" }))}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all hover:bg-white hover:border-purple-200 hover:shadow-sm",
                    formData.serviceType === type.value
                      ? `bg-white border-purple-500 ring-2 ${type.ringColor}`
                      : "bg-gray-50 border-gray-100"
                  )}
                >
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", type.bgColor)}>
                    <type.icon className={cn("w-5 h-5", type.color)} />
                  </div>
                  <span className="font-semibold text-gray-700 text-sm">{type.label}</span>
                </div>
              ))}
            </div>
          </div>

          {formData.serviceType && (
            <div className="space-y-3">
              <Label htmlFor="provider" className="text-sm font-semibold text-gray-700 ml-1">Provider</Label>
              <Select
                value={formData.provider}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, provider: value }))}
              >
                <SelectTrigger className="w-full h-14 rounded-xl border border-gray-200 bg-gray-50/50 px-4 text-base font-medium text-gray-900 focus:ring-2 focus:ring-purple-100">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
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
            <Label htmlFor="recipient" className="text-sm font-semibold text-gray-700 ml-1">
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
              className="h-14 rounded-2xl text-lg bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
              required
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="amount" className="text-sm font-semibold text-gray-700 ml-1">Amount (₦)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
              min="100"
              step="1"
              className="h-14 rounded-2xl text-lg bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
              required
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="customerInfo" className="text-sm font-semibold text-gray-700 ml-1">Customer Name (Optional)</Label>
            <Input
              id="customerInfo"
              type="text"
              placeholder="Enter customer name"
              value={formData.customerInfo}
              onChange={(e) => setFormData((prev) => ({ ...prev, customerInfo: e.target.value }))}
              className="h-14 rounded-2xl text-lg bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
            />
          </div>

          <Button
            type="submit"
            disabled={
              isLoading || !formData.serviceType || !formData.provider || !formData.recipient || !formData.amount
            }
            className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-lg shadow-xl shadow-purple-200 transition-all duration-200 disabled:opacity-70 mt-4"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              "Pay Bill"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
