"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle, X } from "lucide-react"

interface ErrorModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
  errorCode?: string
  helpText?: string
}

export function ErrorModal({ isOpen, onClose, title, description, errorCode, helpText }: ErrorModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white border border-red-200 shadow-lg">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <DialogTitle className="text-xl font-bold text-gray-900 text-center">
            {title}
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-center">
            {description}
          </DialogDescription>
        </DialogHeader>

        {(errorCode || helpText) && (
          <div className="bg-red-50 p-4 rounded-lg space-y-2">
            {errorCode && (
              <div className="flex justify-between text-sm">
                <span className="text-red-600">Error Code:</span>
                <span className="font-mono text-red-800">{errorCode}</span>
              </div>
            )}
            {helpText && (
              <div className="text-sm text-red-700">
                <span className="font-medium">What to do:</span>
                <p className="mt-1">{helpText}</p>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button
            onClick={onClose}
            className="flex-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold"
          >
            Try Again
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
