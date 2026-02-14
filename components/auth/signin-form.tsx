"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react"
import { useGoogleLogin } from "@react-oauth/google"

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

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        // Exchange access token for user info or send directly to backend
        // Here we send the access token to backend to verify and get user info
        // Note: @react-oauth/google useGoogleLogin returns access_token, not id_token by default unless configured.
        // But the common flow is to send the token to backend.
        // Let's use the ID token flow for simplicity if possible, but useGoogleLogin is more flexible.
        // Actually, for backend verification, ID token is better.
        // Let's switch to flow: 'auth-code' or just use the button component?
        // The user wanted "connect with google", often implying a custom button.
        // useGoogleLogin with flow: 'implicit' (default) returns access_token.
        // To get id_token we can use flow: 'idToken' but that is deprecated?
        // Let's use the USER INFO endpoint on backend or frontend using the access token.
        // Wait, the documentation says verifyIdToken requires an ID Token.
        // useGoogleLogin returns an access token.
        // To get an ID token we need to use the GoogleLogin component OR configured useGoogleLogin.
        // Let's use the access token and fetch user info on the backend for this implementation?
        // OR better: use the access token to get user info on frontend and then send to backend? No, insecure.
        // Let's fetch user info on backend using access token.
        // Wait, I implemented the backend to expect `credential` (which usually implies ID token from GoogleOneTap or GoogleLogin component).
        // If I want to use a CUSTOM button, I should use `useGoogleLogin`.
        // `useGoogleLogin` returns `access_token`.
        // I should update the backend to verification logic or use the ID token.
        // Let's update the backend to verify access token or fetch user info.

        // Actually, let's fetch the user info here using the access token to get the email, then send it to backend? No.
        // Let's send the access token to backend.

        // CORRECT PATH: Update backend to accept access_token and use it to get user info.
        // But wait, I already wrote the backend to expect `credential` (ID token).
        // I can change the frontend to use `GoogleLogin` component?
        // The user wants a CUSTOM button ("Connect with Google" replacing the old one).
        // `GoogleLogin` component has limited customization.
        // So `useGoogleLogin` is correct.
        // `useGoogleLogin` gives an access token.
        // I need to change backend to use `https://www.googleapis.com/oauth2/v3/userinfo` with the access token.

        // I will update this file to send `accessToken` instead of `credential`.
        // And I will update the backend in the next step to handle it.

        const res = await fetch("/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken: tokenResponse.access_token }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Google login failed");

        if (typeof window !== "undefined") {
          sessionStorage.setItem("user", JSON.stringify(data.user));
        }
        router.push("/dashboard");

      } catch (err) {
        setError("Google authentication failed");
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => setError("Google login failed"),
  });

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

      <div className="grid grid-cols-1 gap-3">
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          onClick={() => googleLogin()}
          className="h-10 rounded-lg border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900"
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google
        </Button>
      </div>
    </div>
  )
}
