"use client"
import React, { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Loader2, CheckCircle2, XCircle, ShieldCheck, ArrowRight } from "lucide-react"

export function VerifyEmailPrompt() {
  const params = useSearchParams()
  const router = useRouter()
  const token = params.get("token") || ""
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "already_verified" | "error">("idle")
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setMessage("Missing verification token.")
      return
    }
    setStatus("loading")
    fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.alreadyVerified) {
          setStatus("already_verified")
          // Auto-redirect quickly
          setTimeout(() => router.push("/dashboard"), 2000)
        } else if (data.error) {
          setStatus("error")
          setMessage(data.error)
        } else {
          setStatus("success")
          // Redirect to dashboard after session is refreshed
          setTimeout(() => router.push("/dashboard"), 2500)
        }
      })
      .catch(() => {
        setStatus("error")
        setMessage("Something went wrong. Please try again.")
      })
  }, [token, router])

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-50 dark:bg-[#131321] relative overflow-hidden">
      {/* Glows */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#47f0d1]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#47f0d1]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-[400px] bg-white dark:bg-[#131321] border border-slate-100 dark:border-white/10 rounded-3xl shadow-2xl p-8 text-center animate-in fade-in zoom-in-95 duration-300 overflow-hidden">

        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#47f0d1]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-[#47f0d1]/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Icon */}
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-500 ${status === "loading"
            ? "bg-slate-100 dark:bg-zinc-800/60"
            : (status === "success" || status === "already_verified")
              ? "bg-[#47f0d1]/15 shadow-[0_0_30px_rgba(71,240,209,0.3)]"
              : "bg-red-50 dark:bg-red-500/10"
            }`}>
            {status === "loading" && <Loader2 className="w-10 h-10 text-[#47f0d1] animate-spin" />}
            {(status === "success" || status === "already_verified") && (
              <CheckCircle2 className="w-10 h-10 text-[#47f0d1]" />
            )}
            {(status === "error" || status === "idle") && <XCircle className="w-10 h-10 text-red-400" />}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-black tracking-tight mb-2 bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
            {status === "loading" && "Verifying…"}
            {status === "success" && "Email Verified! 🎉"}
            {status === "already_verified" && "Already Verified! ✅"}
            {status === "error" && "Verification Failed"}
            {status === "idle" && "Invalid Link"}
          </h1>

          {/* Message */}
          <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed mb-8">
            {status === "loading" && "Please wait while we secure your account…"}
            {status === "success" && (
              <>Your email has been verified successfully! Redirecting you to your dashboard<span className="inline-flex gap-0.5 ml-1"><span className="animate-bounce">.</span><span className="animate-bounce delay-75">.</span><span className="animate-bounce delay-150">.</span></span></>
            )}
            {status === "already_verified" && (
              <>Your email is already verified. Taking you to your dashboard<span className="inline-flex gap-0.5 ml-1"><span className="animate-bounce">.</span><span className="animate-bounce delay-75">.</span><span className="animate-bounce delay-150">.</span></span></>
            )}
            {status === "error" && (message || "The verification link is invalid or has expired.")}
            {status === "idle" && "The link you followed is invalid."}
          </p>

          {/* Actions */}
          {(status === "success" || status === "already_verified") && (
            <div className="space-y-3">
              <button
                onClick={() => router.push("/dashboard")}
                className="w-full h-12 rounded-2xl bg-[#47f0d1] hover:bg-[#47f0d1]/90 text-[#131321] font-black text-sm shadow-[0_8px_20px_rgba(71,240,209,0.25)] hover:shadow-[0_8px_20px_rgba(71,240,209,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                Go to Dashboard <ArrowRight className="w-4 h-4" />
              </button>
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-zinc-500 mt-2">
                <ShieldCheck className="w-4 h-4 text-[#47f0d1]" />
                <span>Account secured &amp; verified</span>
              </div>
            </div>
          )}

          {(status === "error" || status === "idle") && (
            <div className="space-y-3">
              <button
                onClick={() => router.push("/verify-prompt")}
                className="w-full h-12 rounded-2xl bg-slate-100 dark:bg-zinc-800/60 text-slate-700 dark:text-zinc-200 font-bold text-sm hover:bg-slate-200 dark:hover:bg-zinc-700/60 transition-all"
              >
                Request New Link
              </button>
              <button
                onClick={() => router.push("/login")}
                className="w-full h-12 rounded-2xl bg-[#47f0d1] hover:bg-[#47f0d1]/90 text-[#131321] font-black text-sm shadow-[0_8px_20px_rgba(71,240,209,0.2)] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                Back to Login <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
