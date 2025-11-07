"use client"
import React, { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, ArrowLeft, Mail, CheckCircle, AlertCircle } from "lucide-react"

export function VerifyEmailPrompt() {
  const params = useSearchParams()
  const router = useRouter()
  const token = params.get("token") || ""
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle")
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!token) return
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
          setMessage("Your email is verified! Please log in to continue.")
        }
      })
      .catch(() => {
        setStatus("error")
        setMessage("Something went wrong.")
      })
  }, [token])

  return (
    <div className="min-h-screen w-full flex bg-gray-50">
      {/* Left side - Large Typography Design */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-50 p-8 relative">
        {/* Animated background patterns */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,_rgba(34,197,94,0.03),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,_rgba(74,222,128,0.03),transparent_50%)]"></div>

        {/* Floating orbs */}
        <div className="absolute top-16 left-16 w-32 h-32 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-32 right-32 w-24 h-24 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full blur-3xl opacity-15 animate-pulse delay-500"></div>

        <div className="relative z-10 w-full h-full flex flex-col justify-center">
          <div className="space-y-8">
            {/* Main headline */}
            <div className="space-y-4">
              <h1 className="text-6xl md:text-7xl font-black text-gray-900 leading-tight">
                <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Verify
                </span>
                <br />
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent">
                  Email
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 font-light leading-relaxed max-w-lg">
                Complete your account setup by verifying your email address. This helps us keep your account secure and provides you with important updates.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Email Confirmation</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Check your inbox for a verification link to activate your account
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Account Activation</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Once verified, you'll have full access to all platform features
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Security First</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Email verification ensures only you can access your account
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
          <Card className="w-full max-w-md bg-white border border-gray-200 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-gray-900 text-center">
                {status === "idle" ? "Check Your Email" : status === "loading" ? "Verifying..." : status === "success" ? "Email Verified!" : "Verification Failed"}
              </CardTitle>
              <CardDescription className="text-center text-gray-600">
                {status === "idle" && "We've sent a verification link to your email address"}
                {status === "loading" && "Please wait while we verify your email"}
                {status === "success" && "Your email has been successfully verified"}
                {status === "error" && "There was an issue verifying your email"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {status === "loading" && (
                <Alert className="rounded-lg border-blue-200 bg-blue-50">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <AlertDescription className="font-medium text-blue-800">Verifying your email address...</AlertDescription>
                </Alert>
              )}

              {status === "success" && (
                <div className="space-y-4">
                  <Alert className="rounded-lg border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <AlertDescription className="font-medium text-green-800">{message}</AlertDescription>
                  </Alert>
                  <Button
                    className="w-full py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium text-sm shadow-sm hover:shadow-green-500/25 transition-all duration-200 border-0"
                    onClick={() => router.push("/signin")}
                  >
                    Continue to Sign In
                  </Button>
                </div>
              )}

              {status === "error" && (
                <div className="space-y-4">
                  <Alert variant="destructive" className="rounded-lg border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <AlertDescription className="font-medium text-red-800">{message}</AlertDescription>
                  </Alert>
                  <Button
                    className="w-full py-2.5 rounded-lg bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-medium text-sm shadow-sm hover:shadow-gray-500/25 transition-all duration-200 border-0"
                    onClick={() => router.push("/signup")}
                  >
                    Try Again
                  </Button>
                </div>
              )}

              {status === "idle" && (
                <div className="space-y-4">
                  <Alert className="rounded-lg border-blue-200 bg-blue-50">
                    <Mail className="h-4 w-4 mr-2" />
                    <AlertDescription className="font-medium text-blue-800">
                      Click the verification link in your email to verify your account.
                    </AlertDescription>
                  </Alert>
                  <div className="text-center">
                    <p className="text-gray-600 text-sm mb-4">
                      Didn't receive the email? Check your spam folder or{" "}
                      <button
                        className="text-green-600 hover:text-green-700 font-medium"
                        onClick={() => window.location.reload()}
                      >
                        resend verification
                      </button>
                    </p>
                    <Button
                      className="w-full py-2.5 rounded-lg bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-medium text-sm shadow-sm hover:shadow-gray-500/25 transition-all duration-200 border-0"
                      onClick={() => router.push("/signin")}
                    >
                      Back to Sign In
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
