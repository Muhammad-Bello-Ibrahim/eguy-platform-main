"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, ArrowLeft } from "lucide-react"

export function ResetRequestForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/reset-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Something went wrong")
      setSuccess("Reset link sent! Check your email.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full rounded-3xl border-0 bg-white/80 backdrop-blur-sm shadow-2xl p-8 animate-fade-in-up">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-bold text-center text-foreground">
          Forgot Your Password?
        </CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Enter your email address and we'll send you a link to reset your password
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive" className="rounded-2xl">
              <AlertDescription className="font-medium">{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="rounded-2xl">
              <AlertDescription className="font-medium">{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold text-foreground">
              Email Address
            </Label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors duration-300" />
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full rounded-2xl border border-primary/20 bg-white/50 backdrop-blur-sm px-12 py-4 text-base font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-bold text-lg shadow-xl hover:shadow-primary/25 transition-all duration-500 hover:scale-[1.02] border-0"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                Sending Reset Link...
              </>
            ) : (
              <>
                <span className="mr-2">Send Reset Link</span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </>
            )}
          </Button>

          <div className="text-center pt-2">
            <Link href="/signin" className="group flex items-center justify-center gap-2 text-primary hover:text-primary/80 transition-colors duration-300 font-medium text-sm">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-300" />
              Back to Sign In
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
