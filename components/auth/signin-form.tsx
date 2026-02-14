"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Eye, EyeOff, Mail, Lock, ArrowRight, Github } from "lucide-react"

export function SigninForm() {
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong")
      }

      // Store user data in sessionStorage for admin panel access
      if (typeof window !== "undefined") {
        sessionStorage.setItem("user", JSON.stringify(data.user))
      }

      router.push("/dashboard")
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive" className="rounded-xl border-red-200 bg-red-50 text-red-800 animate-in fade-in zoom-in-95 duration-200">
            <AlertDescription className="flex items-center gap-2 font-medium">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="emailOrPhone" className="text-sm font-medium text-zinc-700">
            Email or Phone
          </Label>
          <div className="relative group">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
            <Input
              id="emailOrPhone"
              name="emailOrPhone"
              placeholder="name@example.com"
              type="text"
              autoCapitalize="none"
              autoComplete="username"
              autoCorrect="off"
              disabled={isLoading}
              required
              value={formData.emailOrPhone}
              onChange={handleChange}
              className="pl-9 h-10 bg-zinc-50/50 border-zinc-200 focus:bg-white transition-all duration-200 rounded-lg"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium text-zinc-700">
              Password
            </Label>
            <Link
              href="/reset-password"
              className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative group">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
            <Input
              id="password"
              name="password"
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              disabled={isLoading}
              required
              value={formData.password}
              onChange={handleChange}
              className="pl-9 pr-10 h-10 bg-zinc-50/50 border-zinc-200 focus:bg-white transition-all duration-200 rounded-lg"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600 focus:outline-none transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <Button
          className="w-full bg-primary hover:bg-primary/90 text-white font-semibold h-10 rounded-lg transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-primary/30"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <span className="flex items-center gap-2">Sign In <ArrowRight className="w-4 h-4" /></span>
          )}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-zinc-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-zinc-500">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" type="button" disabled={isLoading} className="h-10 rounded-lg border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900">
          <Github className="mr-2 h-4 w-4" /> Google
        </Button>
        <Button variant="outline" type="button" disabled={isLoading} className="h-10 rounded-lg border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900">
          <div className="mr-2 h-4 w-4 bg-zinc-900 rounded-full" /> Apple
        </Button>
      </div>
    </div>
  )
}
