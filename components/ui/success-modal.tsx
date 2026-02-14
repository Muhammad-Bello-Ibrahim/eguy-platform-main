"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle, Check } from "lucide-react"

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
  transactionId?: string
  amount?: number
  service?: string
}

export function SuccessModal({ isOpen, onClose, title, description, transactionId, amount, service }: SuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white border border-gray-100 shadow-2xl rounded-3xl p-8">
        <DialogHeader className="flex flex-col items-center justify-center text-center pb-2">
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center ring-8 ring-green-50/50 animate-pulse-slow">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1.5 shadow-lg border-2 border-white">
              <Check className="w-4 h-4" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-900 text-center mb-2">
            {title}
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-center text-base max-w-[90%] mx-auto">
            {description}
          </DialogDescription>
        </DialogHeader>

        {(transactionId || amount || service) && (
          <div className="bg-gray-50 p-5 rounded-2xl space-y-3 border border-gray-100 mt-2">
            {transactionId && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Transaction ID</span>
                <span className="font-mono text-gray-900 bg-white px-2 py-1 rounded border border-gray-200 text-xs">{transactionId}</span>
              </div>
            )}
            {service && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Service</span>
                <span className="font-semibold text-gray-900">{service}</span>
              </div>
            )}
            {amount && (
              <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-200">
                <span className="text-gray-900 font-bold">Amount Paid</span>
                <span className="font-bold text-lg text-green-600">₦{amount.toLocaleString()}</span>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3 pt-6">
          <Button
            onClick={onClose}
            className="w-full h-12 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-lg shadow-lg hover:shadow-green-500/25 transition-all duration-200"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
