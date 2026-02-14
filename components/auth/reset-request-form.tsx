"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, ArrowRight } from "lucide-react"

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
    <div className="grid gap-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive" className="rounded-xl border-red-200 bg-red-50 text-red-800 animate-in fade-in zoom-in-95 duration-200">
            <AlertDescription className="font-medium">{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="rounded-xl border-emerald-200 bg-emerald-50 text-emerald-800 animate-in fade-in zoom-in-95 duration-200">
            <AlertDescription className="font-medium">{success}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-zinc-700">
            Email Address
          </Label>
          <div className="relative group">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
            <Input
              id="email"
              name="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              disabled={isLoading}
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="pl-9 h-10 bg-zinc-50/50 border-zinc-200 focus:bg-white transition-all duration-200 rounded-lg"
            />
          </div>
        </div>

        <Button
          className="w-full bg-primary hover:bg-primary/90 text-white font-semibold h-10 rounded-lg transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-primary/30"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <span className="flex items-center gap-2">Send Reset Link <ArrowRight className="w-4 h-4" /></span>
          )}
        </Button>
      </form>
    </div>
  )
}
