"use client"
import { ResetRequestForm } from "@/components/auth/reset-request-form"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ShieldCheck } from "lucide-react"
import { Suspense } from "react"

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  )
}

function ResetPasswordContent() {
  const params = useSearchParams()
  const token = params.get("token") || ""

  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Left side - Visual & Brand */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-zinc-900 text-white p-12 flex-col justify-between">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 blur-[100px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tl from-yellow-500/20 to-amber-500/20 blur-[100px] animate-pulse delay-700" />
          <div className="absolute top-[40%] right-[30%] w-[30%] h-[30%] rounded-full bg-white/5 blur-[60px]" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors w-fit">
            <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">
              <span className="font-bold">eG</span>
            </div>
            <span className="font-medium tracking-tight">eGuy Platform</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-orange-200 mb-6 backdrop-blur-sm">
            <ShieldCheck className="mr-2 h-3.5 w-3.5" />
            <span className="font-medium">Secure & Protected</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-6 leading-tight">
            Restore access to your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">digital assets</span>.
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed">
            We use bank-grade encryption to ensure your account recovery is safe and seamless.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-sm text-zinc-500">
          <p>© 2026 eGuy Platform</p>
          <span className="w-1 h-1 rounded-full bg-zinc-700" />
          <Link href="#" className="hover:text-zinc-300 transition-colors">Privacy</Link>
          <span className="w-1 h-1 rounded-full bg-zinc-700" />
          <Link href="#" className="hover:text-zinc-300 transition-colors">Terms</Link>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 lg:p-12 relative bg-white/50 backdrop-blur-3xl">
        {/* Mobile Header / Brand */}
        <div className="w-full max-w-md mb-8 lg:hidden flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
              eG
            </div>
            <span className="font-semibold text-zinc-900">eGuy</span>
          </Link>
        </div>

        <div className="w-full max-w-[400px] space-y-6">
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
              {token ? "Set new password" : "Reset password"}
            </h2>
            <p className="text-zinc-500">
              {token
                ? "Create a strong password to secure your account."
                : "Enter your email and we'll send you a recovery link."}
            </p>
          </div>

          {token ? <ResetPasswordForm /> : <ResetRequestForm />}

          <div className="text-center lg:text-left mt-4">
            <Link href="/signin" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
