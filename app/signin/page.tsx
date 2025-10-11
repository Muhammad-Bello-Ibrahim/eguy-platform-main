"use client"
import { SigninForm } from "@/components/auth/signin-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function SigninPage() {
  return (
    <div className="min-h-screen w-full flex bg-gray-50">
      {/* Left side - Large Typography Design */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-50 p-8 relative">
        {/* Animated background patterns */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,_rgba(59,130,246,0.03),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,_rgba(147,197,253,0.03),transparent_50%)]"></div>

        {/* Floating orbs */}
        <div className="absolute top-16 left-16 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-32 right-32 w-24 h-24 bg-gradient-to-r from-indigo-400 to-pink-400 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full blur-3xl opacity-15 animate-pulse delay-500"></div>

        <div className="relative z-10 w-full h-full flex flex-col justify-center">
          <div className="space-y-8">
            {/* Main headline */}
            <div className="space-y-4">
              <h1 className="text-6xl md:text-7xl font-black text-gray-900 leading-tight">
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Welcome
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                  Back
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 font-light leading-relaxed max-w-lg">
                Your financial journey continues. Access your dashboard and take control of your digital assets with confidence.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Secure Access</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Bank-level encryption protecting your account and transactions
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Instant Processing</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Lightning-fast transactions and real-time balance updates
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Smart Analytics</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    AI-powered insights to optimize your financial decisions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Back to home link */}
        <div className="absolute top-6 left-6 z-10">
          <Link href="/" className="group flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all duration-300">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <SigninForm />
          </div>
        </div>
      </div>
    </div>
  )
}