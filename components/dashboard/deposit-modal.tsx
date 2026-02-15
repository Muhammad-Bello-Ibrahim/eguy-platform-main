"use client"
import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Copy, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface DepositModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function DepositModal({ isOpen, onClose, onSuccess }: DepositModalProps) {
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState<"automatic" | "manual">("automatic")
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const depositAmount = Number.parseFloat(amount)
    if (!depositAmount || depositAmount < 100) {
      setError("Minimum deposit amount is ₦100")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/wallet/deposit", {
        method: "POST",
        body: JSON.stringify({ amount: depositAmount }),
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Deposit failed")
      }

      const data = await response.json();
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        throw new Error("Could not get payment link.");
      }
    } catch (err: any) {
      setError(err.message || "Deposit failed")
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: "Copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  }

  const quickAmounts = [500, 1000, 2000, 5000];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] overflow-hidden bg-[#131321] border border-white/10 text-white rounded-3xl p-0">
        {/* Header */}
        <div className="flex flex-col items-center pt-3 pb-6 relative">
          <div className="w-12 h-1.5 bg-white/20 rounded-full mb-6"></div>
          <div className="flex justify-between items-center w-full px-6">
            <DialogTitle className="text-xl font-bold text-white">Fund Wallet</DialogTitle>
            <div className="w-8"></div> {/* Spacer to center title if close button is handled by DialogPrimitive, but let's keep visual balance */}
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 mb-6">
          <div className="bg-white/5 p-1 rounded-full flex relative">
            <button
              onClick={() => setActiveTab("automatic")}
              className={cn(
                "flex-1 py-2.5 text-sm font-semibold rounded-full transition-all",
                activeTab === "automatic" ? "bg-[#47f0d1] text-[#131321] shadow-[0_4px_12px_rgba(71,240,209,0.2)]" : "text-white/60 hover:text-white"
              )}
            >
              Automatic
            </button>
            <button
              onClick={() => setActiveTab("manual")}
              className={cn(
                "flex-1 py-2.5 text-sm font-semibold rounded-full transition-all",
                activeTab === "manual" ? "bg-[#47f0d1] text-[#131321] shadow-[0_4px_12px_rgba(71,240,209,0.2)]" : "text-white/60 hover:text-white"
              )}
            >
              Manual Transfer
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-8 overflow-y-auto max-h-[60vh]">
          {activeTab === "automatic" ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <Alert variant="destructive" className="rounded-xl border-red-500/20 bg-red-500/10 text-red-400">
                  <AlertDescription className="text-center">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-3">
                <Label htmlFor="amount" className="text-sm font-semibold text-slate-300 ml-1">
                  Enter Amount
                </Label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium text-lg">₦</div>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min={100}
                    step={100}
                    required
                    className="pl-10 h-14 rounded-2xl text-lg font-bold bg-white/5 border-white/10 text-white focus:bg-white/10 focus:border-[#47f0d1] transition-all shadow-sm placeholder:text-slate-600"
                  />
                </div>

                <div className="flex gap-2 flex-wrap justify-center mt-2">
                  {quickAmounts.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAmount(amt.toString())}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                        amount === amt.toString()
                          ? "bg-[#47f0d1] border-[#47f0d1] text-[#131321]"
                          : "bg-transparent border-white/10 text-slate-400 hover:border-[#47f0d1]/50 hover:text-[#47f0d1]"
                      )}
                    >
                      ₦{amt.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="group relative">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#00c3f7]/10 hover:bg-[#00c3f7]/20 border border-[#00c3f7]/30 p-6 h-auto rounded-xl flex items-center justify-between transition-all group-hover:border-[#00c3f7]/50"
                >
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden p-1.5">
                      {/* Paystack Icon/Logo Placeholder */}
                      <div className="w-full h-full bg-[#00c3f7] rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-white font-bold text-base">Pay with Paystack</p>
                      <p className="text-white/50 text-xs font-normal">Card, Bank Transfer, USSD</p>
                    </div>
                  </div>
                  {isLoading ? <Loader2 className="animate-spin text-[#00c3f7]" /> : <span className="text-[#00c3f7] font-bold text-xl">→</span>}
                </Button>
                <div className="absolute -inset-1 bg-[#00c3f7]/10 rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none"></div>
              </div>
            </form>
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              {/* Static Bank Card 1 */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#47f0d1]/10 flex items-center justify-center">
                      <span className="font-bold text-[#47f0d1]">W</span>
                    </div>
                    <div>
                      <p className="text-white/50 text-[10px] uppercase font-bold tracking-wider">Bank Name</p>
                      <p className="text-white font-semibold">Wema Bank</p>
                    </div>
                  </div>
                  <button onClick={() => copyToClipboard("0123456789")} className="w-10 h-10 bg-[#47f0d1] rounded-full flex items-center justify-center text-[#131321] active:scale-95 transition-transform hover:bg-white">
                    {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                  <div>
                    <p className="text-white/50 text-[10px] uppercase font-bold tracking-wider">Account Number</p>
                    <p className="text-xl font-bold text-white tracking-widest mt-1 font-mono">0123456789</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-[10px] uppercase font-bold tracking-wider">Account Name</p>
                    <p className="text-sm font-semibold text-white mt-1">eGuy Platform</p>
                  </div>
                </div>
              </div>

              {/* Info Note */}
              <div className="bg-[#47f0d1]/5 p-4 rounded-xl border border-[#47f0d1]/10 mt-2">
                <p className="text-xs text-white/70 leading-relaxed italic text-center">
                  Transfer to this account and your wallet will be credited automatically.
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
