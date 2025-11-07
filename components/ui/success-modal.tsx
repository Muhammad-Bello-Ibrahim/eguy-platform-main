"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle, X } from "lucide-react"

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
      <DialogContent className="sm:max-w-md bg-white border border-green-200 shadow-lg">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <DialogTitle className="text-xl font-bold text-gray-900 text-center">
            {title}
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-center">
            {description}
          </DialogDescription>
        </DialogHeader>

        {(transactionId || amount || service) && (
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            {transactionId && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-mono text-gray-900">{transactionId}</span>
              </div>
            )}
            {amount && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Amount:</span>
                <span className="font-semibold text-gray-900">₦{amount}</span>
              </div>
            )}
            {service && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Service:</span>
                <span className="font-semibold text-gray-900">{service}</span>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button
            onClick={onClose}
            className="flex-1 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
