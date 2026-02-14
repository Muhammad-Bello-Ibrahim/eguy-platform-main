"use client"
import React, { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, ArrowRight, CheckCircle2, XCircle, ShieldCheck } from "lucide-react"

export function VerifyEmailPrompt() {
  const params = useSearchParams()
  const router = useRouter()
  const token = params.get("token") || ""
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
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
      body: JSON.stringify({ token })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setStatus("error")
          setMessage(data.error)
        } else {
          setStatus("success")
          setMessage("Your email has been successfully verified.")
        }
      })
      .catch(() => {
        setStatus("error")
        setMessage("Something went wrong. Please try again.")
      })
  }, [token])

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-bl from-green-500/10 to-emerald-500/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-teal-500/10 to-cyan-500/10 blur-[100px]" />
      </div>

      <div className="w-full max-w-md bg-white/50 backdrop-blur-3xl rounded-3xl border border-white/20 shadow-2xl p-8 lg:p-10 relative z-10 text-center animate-in fade-in zoom-in-95 duration-300">

        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-slow
                ${status === 'loading' ? 'bg-blue-50 text-blue-500' :
            status === 'success' ? 'bg-green-50 text-green-500' :
              'bg-red-50 text-red-500'}`}>
          {status === 'loading' && <Loader2 className="w-10 h-10 animate-spin" />}
          {status === 'success' && <CheckCircle2 className="w-10 h-10" />}
          {(status === 'error' || status === 'idle') && <XCircle className="w-10 h-10" />}
        </div>

        <h1 className="text-2xl font-bold text-zinc-900 mb-2">
          {status === 'loading' && "Verifying Email..."}
          {status === 'success' && "Email Verified!"}
          {status === 'error' && "Verification Failed"}
          {status === 'idle' && "Invalid Link"}
        </h1>

        <p className="text-zinc-500 mb-8 leading-relaxed">
          {status === 'loading' && "Please wait while we secure your account."}
          {status === 'success' && "Thank you for verifying your email. You can now access all features of the platform."}
          {status === 'error' && (message || "The verification link is invalid or has expired.")}
          {status === 'idle' && "The link you followed is invalid."}
        </p>

        <div className="space-y-4">
          {status === 'success' && (
            <Button
              onClick={() => router.push("/signin")}
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium shadow-lg hover:shadow-primary/20 transition-all"
            >
              Continue to Sign In <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}

          {(status === 'error' || status === 'idle') && (
            <div className="space-y-3">
              <Button
                onClick={() => router.push("/verify-prompt")}
                variant="outline"
                className="w-full h-12 rounded-xl border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 font-medium transition-all"
              >
                Resend Verification Link
              </Button>
              <Link href="/signin" className="block w-full">
                <Button variant="ghost" className="w-full h-12 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100">
                  Back to Sign In
                </Button>
              </Link>
            </div>
          )}
        </div>

        {status === 'success' && (
          <div className="mt-8 pt-6 border-t border-zinc-100">
            <div className="flex items-center justify-center gap-2 text-xs text-zinc-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Secure Verification</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
