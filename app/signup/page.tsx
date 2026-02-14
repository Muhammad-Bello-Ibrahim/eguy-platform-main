"use client"
import { SignupForm } from "@/components/auth/signup-form"
import Link from "next/link"
import { ArrowLeft, Rocket } from "lucide-react"

export default function SignupPage() {
  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Left side - Visual & Brand */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-zinc-900 text-white p-12 flex-col justify-between">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] right-[-20%] w-[70%] h-[70%] rounded-full bg-gradient-to-bl from-emerald-500/20 to-teal-500/20 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-20%] left-[-20%] w-[70%] h-[70%] rounded-full bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 blur-[120px] animate-pulse delay-1000" />
          <div className="absolute top-[30%] left-[30%] w-[40%] h-[40%] rounded-full bg-white/5 blur-[80px]" />
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
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-emerald-200 mb-6 backdrop-blur-sm">
            <Rocket className="mr-2 h-3.5 w-3.5" />
            <span className="font-medium">Start Your Journey</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-6 leading-tight">
            Join the future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">digital banking</span>.
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed">
            Create an account in minutes. Enjoy zero fees, instant transfers, and rewards that grow with you.
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

      {/* Right side - Signup Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 lg:p-12 relative bg-white/50 backdrop-blur-3xl overflow-y-auto">
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
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Create account</h2>
            <p className="text-zinc-500">
              Already have an account?{" "}
              <Link href="/signin" className="font-medium text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline">
                Sign in instead
              </Link>
            </p>
          </div>

          <SignupForm />
        </div>
      </div>
    </div>
  )
}