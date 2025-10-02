"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Eye, EyeOff } from "lucide-react";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Card className="w-full rounded-xl border border-green-100 bg-white p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        {success && (
          <div className="flex flex-col gap-4 mt-6">
            <Button type="button" variant="outline" className="w-full" onClick={async () => {
              setIsLoading(true);
              setError("");
              try {
                const response = await fetch("/api/auth/verify-request", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email: formData.email })
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || "Something went wrong");
                setSuccess("Verification link resent! Please check your email.");
              } catch (err) {
                setError(err instanceof Error ? err.message : "Something went wrong");
              } finally {
                setIsLoading(false);
              }
            }}>
              Resend Verification Link
            </Button>
            <Button type="button" className="w-full" onClick={() => router.push("/signin")}>Login</Button>
          </div>
        )}
        {!success && (
          <div className="space-y-2 w-full">
            <Label htmlFor="fullName" className="text-sm font-semibold text-green-700 mb-1">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-base font-semibold text-green-700 focus:outline-none"
            />
          </div>
        )}
        <div className="space-y-2 w-full">
          <Label htmlFor="email" className="text-sm font-semibold text-green-700 mb-1">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-base font-semibold text-green-700 focus:outline-none"
          />
        </div>
        <div className="space-y-2 w-full">
          <Label htmlFor="phone" className="text-sm font-semibold text-green-700 mb-1">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            className="w-full rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-base font-semibold text-green-700 focus:outline-none"
          />
        </div>
        <div className="space-y-2 w-full">
          <Label htmlFor="password" className="text-sm font-semibold text-green-700 mb-1">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="w-full rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-base font-semibold text-green-700 focus:outline-none pr-10"
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-green-700 hover:text-green-900 focus:outline-none"
              tabIndex={0}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        <div className="space-y-2 w-full">
          <Label htmlFor="confirmPassword" className="text-sm font-semibold text-green-700 mb-1">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="w-full rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-base font-semibold text-green-700 focus:outline-none pr-10"
            />
            <button
              type="button"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-green-700 hover:text-green-900 focus:outline-none"
              tabIndex={0}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        <div className="space-y-2 w-full">
          <Label htmlFor="referralCode" className="text-sm font-semibold text-green-700 mb-1">Referral Code (Optional)</Label>
          <Input
            id="referralCode"
            name="referralCode"
            type="text"
            value={formData.referralCode}
            onChange={handleChange}
            placeholder="Enter referral code if you have one"
            className="w-full rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-base font-semibold text-green-700 focus:outline-none"
          />
        </div>
        <Button type="submit" className="w-full py-3 rounded-xl bg-green-600 text-white font-bold text-base transition-all duration-200 active:scale-95" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>
    </Card>
  );
}
