"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle, X, HelpCircle } from "lucide-react"

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
      <DialogContent className="sm:max-w-md bg-white border border-gray-100 shadow-2xl rounded-3xl p-8">
        <DialogHeader className="flex flex-col items-center justify-center text-center pb-2">
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center ring-8 ring-red-50/50">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-red-500 text-white rounded-full p-1.5 shadow-lg border-2 border-white">
              <X className="w-4 h-4" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-900 text-center mb-2">
            {title}
          </DialogTitle>
          <DialogDescription className="text-red-600/80 text-center text-base font-medium max-w-[90%] mx-auto bg-red-50 px-3 py-1 rounded-full">
            {description}
          </DialogDescription>
        </DialogHeader>

        {(errorCode || helpText) && (
          <div className="bg-gray-50/80 p-5 rounded-2xl space-y-4 border border-gray-100 mt-2">
            {errorCode && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Error Code</span>
                <span className="font-mono text-xs text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100">{errorCode}</span>
              </div>
            )}
            {helpText && (
              <div className="text-sm text-gray-600 flex gap-3 items-start">
                <HelpCircle className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-gray-900 block mb-1">Suggestion</span>
                  <p className="leading-relaxed">{helpText}</p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3 pt-6">
          <Button
            onClick={onClose}
            className="w-full h-12 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold text-lg shadow-lg transition-all duration-200"
          >
            Try Again
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
