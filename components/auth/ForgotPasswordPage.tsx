"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, AtSign, KeyRound } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/reset-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        router.push("/forgot-password/sent");
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data?.message || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
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
          {/* Back button */}
          <Link href="/login" className="inline-flex mb-6">
            <span className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </span>
          </Link>

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#47f0d1]/10 border border-[#47f0d1]/20 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(71,240,209,0.2)]">
              <KeyRound className="w-7 h-7 text-[#47f0d1]" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-black text-slate-900 dark:text-white text-center mb-2">
            Reset Password
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 text-center mb-8 leading-relaxed">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email field */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-500 mb-2">
                Email Address
              </p>
              <div className="relative group">
                <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-zinc-600 group-focus-within:text-[#47f0d1] transition-colors pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-white/[0.08] rounded-2xl py-4 px-5 pl-12 text-base font-semibold placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:bg-white dark:focus:bg-[#1a1a2e] focus:border-[#47f0d1] focus:ring-4 focus:ring-[#47f0d1]/10 text-slate-900 dark:text-white transition-all outline-none"
                />
              </div>
            </div>

            {/* CTA */}
            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full h-14 bg-[#47f0d1] hover:bg-[#3de0c3] text-[#0e0e1a] rounded-2xl font-black text-base shadow-[0_8px_24px_rgba(71,240,209,0.25)] hover:shadow-[0_8px_24px_rgba(71,240,209,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  Send Recovery Link
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="h-px bg-slate-100 dark:bg-white/[0.06] my-6" />

          {/* Back to login */}
          <p className="text-center text-sm text-slate-500 dark:text-zinc-400">
            Remembered your password?{" "}
            <Link
              href="/login"
              className="text-[#47f0d1] font-bold hover:underline transition-colors"
            >
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
