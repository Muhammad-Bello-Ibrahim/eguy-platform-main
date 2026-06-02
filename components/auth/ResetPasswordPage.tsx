"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  ShieldAlert,
} from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const token = searchParams.get("token");

  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Invalid or missing reset token. Please request a new link.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (res.ok) {
        router.push("/reset-password/success");
      } else {
        const data = await res.json().catch(() => ({}));
        setError(
          data?.message || "Failed to reset password. Please try again."
        );
      }
    } catch {
      setError("Something went wrong. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0e0e1a] flex items-center justify-center p-5 font-sans">
      {/* Glow orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#47f0d1]/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#47f0d1]/[0.03] rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-[420px] bg-white dark:bg-[#13131f] border border-slate-100 dark:border-white/[0.06] rounded-3xl shadow-2xl shadow-black/10 dark:shadow-black/40 overflow-hidden">
        <div className="p-8">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors mb-8"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Lock Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#47f0d1]/10 border border-[#47f0d1]/20 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(71,240,209,0.12)]">
              <Lock className="w-7 h-7 text-[#47f0d1]" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-black text-center text-slate-900 dark:text-white mb-2">
            New Password
          </h1>
          <p className="text-sm text-center text-slate-500 dark:text-zinc-400 mb-8 leading-relaxed">
            Your new password must be different from previous ones.
          </p>

          {/* Error Banner */}
          {error && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl px-4 py-3.5 mb-6 text-sm font-medium">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* New Password */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-500 mb-2">
                New Password
              </p>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-zinc-600 group-focus-within:text-[#47f0d1] transition-colors pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  required
                  autoComplete="new-password"
                  className="w-full bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-white/[0.08] rounded-2xl py-4 px-5 pl-12 pr-12 text-base font-semibold placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:bg-white dark:focus:bg-[#1a1a2e] focus:border-[#47f0d1] focus:ring-4 focus:ring-[#47f0d1]/10 text-slate-900 dark:text-white transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-600 hover:text-slate-600 dark:hover:text-zinc-400 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-500 mb-2">
                Confirm Password
              </p>
              <div className="relative group">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-zinc-600 group-focus-within:text-[#47f0d1] transition-colors pointer-events-none" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  required
                  autoComplete="new-password"
                  className={`w-full bg-slate-50 dark:bg-zinc-900/60 border rounded-2xl py-4 px-5 pl-12 pr-12 text-base font-semibold placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:bg-white dark:focus:bg-[#1a1a2e] text-slate-900 dark:text-white transition-all outline-none ${
                    passwordsMismatch
                      ? "border-red-500/40 focus:border-red-500/60 focus:ring-4 focus:ring-red-500/10"
                      : passwordsMatch
                      ? "border-[#47f0d1]/40 focus:border-[#47f0d1] focus:ring-4 focus:ring-[#47f0d1]/10"
                      : "border-slate-200 dark:border-white/[0.08] focus:border-[#47f0d1] focus:ring-4 focus:ring-[#47f0d1]/10"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-600 hover:text-slate-600 dark:hover:text-zinc-400 transition-colors"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Match Indicator */}
              <div className="mt-2.5 flex items-center gap-2">
                <div
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    confirmPassword.length === 0
                      ? "bg-slate-100 dark:bg-white/[0.06]"
                      : passwordsMatch
                      ? "bg-[#47f0d1]"
                      : "bg-red-500/50"
                  }`}
                />
                {confirmPassword.length > 0 && (
                  <span
                    className={`text-xs font-semibold transition-all ${
                      passwordsMatch ? "text-[#47f0d1]" : "text-red-400"
                    }`}
                  >
                    {passwordsMatch ? "Passwords match" : "Does not match"}
                  </span>
                )}
              </div>
            </div>

            {/* CTA */}
            <button
              type="submit"
              disabled={isLoading || !password || !confirmPassword}
              className="w-full h-14 bg-[#47f0d1] hover:bg-[#3de0c3] text-[#0e0e1a] rounded-2xl font-black text-base shadow-[0_8px_24px_rgba(71,240,209,0.25)] hover:shadow-[0_8px_24px_rgba(71,240,209,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Saving…
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  Save &amp; Sign In
                </>
              )}
            </button>
          </form>

          {/* Security Note */}
          <div className="mt-6 flex items-start gap-2.5 bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.05] rounded-2xl px-4 py-3.5">
            <ShieldAlert className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-400 dark:text-zinc-500" />
            <p className="text-xs text-slate-500 dark:text-zinc-500 leading-relaxed">
              For your security, you'll be signed out of all other devices after
              resetting your password.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
