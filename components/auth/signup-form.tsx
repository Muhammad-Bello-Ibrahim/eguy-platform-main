"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Eye, EyeOff, User, Mail, Phone, Lock, Gift, ArrowRight } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";

export function SignupForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          referralCode: formData.referralCode,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      router.push(`/verify-prompt?email=${encodeURIComponent(formData.email)}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
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
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

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

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-xs font-medium text-zinc-700 uppercase tracking-wide">
                Full Name
              </Label>
              <div className="relative group">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="John Doe"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="pl-9 h-10 bg-zinc-50/50 border-zinc-200 focus:bg-white transition-all duration-200 rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-xs font-medium text-zinc-700 uppercase tracking-wide">
                Phone
              </Label>
              <div className="relative group">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                <Input
                  id="phone"
                  name="phone"
                  placeholder="08012345678"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="pl-9 h-10 bg-zinc-50/50 border-zinc-200 focus:bg-white transition-all duration-200 rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-medium text-zinc-700 uppercase tracking-wide">
              Email Address
            </Label>
            <div className="relative group">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
              <Input
                id="email"
                name="email"
                placeholder="john@example.com"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="pl-9 h-10 bg-zinc-50/50 border-zinc-200 focus:bg-white transition-all duration-200 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-medium text-zinc-700 uppercase tracking-wide">
                Password
              </Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                <Input
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-9 pr-8 h-10 bg-zinc-50/50 border-zinc-200 focus:bg-white transition-all duration-200 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-2.5 text-zinc-400 hover:text-zinc-600 focus:outline-none transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-xs font-medium text-zinc-700 uppercase tracking-wide">
                Confirm
              </Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="••••••••"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pl-9 pr-8 h-10 bg-zinc-50/50 border-zinc-200 focus:bg-white transition-all duration-200 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-2.5 text-zinc-400 hover:text-zinc-600 focus:outline-none transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="referralCode" className="text-xs font-medium text-zinc-700 uppercase tracking-wide flex justify-between">
              Referral Code <span className="text-zinc-400 normal-case font-normal">(Optional)</span>
            </Label>
            <div className="relative group">
              <Gift className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
              <Input
                id="referralCode"
                name="referralCode"
                placeholder="Enter code"
                type="text"
                value={formData.referralCode}
                onChange={handleChange}
                className="pl-9 h-10 bg-zinc-50/50 border-zinc-200 focus:bg-white transition-all duration-200 rounded-lg"
              />
            </div>
          </div>
        </div>

        <Button
          className="w-full bg-primary hover:bg-primary/90 text-white font-semibold h-10 rounded-lg transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-primary/30 mt-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <span className="flex items-center gap-2">Create Account <ArrowRight className="w-4 h-4" /></span>
          )}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-zinc-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-zinc-500">
            Or register with
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

      <p className="px-8 text-center text-xs text-zinc-500 leading-relaxed">
        By clicking create account, you agree to our{" "}
        <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
