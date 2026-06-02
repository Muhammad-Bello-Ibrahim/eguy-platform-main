"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Mail } from "lucide-react";

export default function RecoveryEmailSentPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0e0e1a] flex items-center justify-center p-5 font-sans">
      {/* Glow orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#47f0d1]/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#47f0d1]/[0.03] rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-[420px] bg-white dark:bg-[#13131f] border border-slate-100 dark:border-white/[0.06] rounded-3xl shadow-2xl shadow-black/10 dark:shadow-black/40 overflow-hidden">
        <div className="p-8 flex flex-col items-center text-center">
          {/* Icon */}
          <div className="relative flex items-center justify-center w-20 h-20 bg-[#47f0d1]/15 rounded-full shadow-[0_0_40px_rgba(71,240,209,0.3)] mb-6">
            <Mail className="w-9 h-9 text-[#47f0d1]" />
            <span className="absolute -top-1 -right-1 w-6 h-6 bg-[#47f0d1] rounded-full flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-4 h-4 text-[#0e0e1a]" />
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
            Check Your Inbox
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed mb-8 max-w-[320px]">
            We sent a password reset link to your email address. Check your spam if you don&apos;t see it.
          </p>

          {/* Resend button (secondary style) */}
          <button
            type="button"
            className="w-full h-14 rounded-2xl bg-slate-100 dark:bg-zinc-900/60 border border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-zinc-300 font-bold text-sm hover:bg-slate-200 dark:hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
          >
            <Mail className="w-4 h-4" />
            Resend Email
          </button>

          {/* Divider */}
          <div className="h-px bg-slate-100 dark:bg-white/[0.06] w-full my-6" />

          {/* Back to Login CTA */}
          <Link
            href="/login"
            className="w-full h-14 bg-[#47f0d1] hover:bg-[#3de0c3] text-[#0e0e1a] rounded-2xl font-black text-base shadow-[0_8px_24px_rgba(71,240,209,0.25)] hover:shadow-[0_8px_24px_rgba(71,240,209,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            Back to Login
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
