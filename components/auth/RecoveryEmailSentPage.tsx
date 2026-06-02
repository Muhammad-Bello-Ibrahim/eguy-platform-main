"use client";

import React from 'react';
import Link from 'next/link';
import { Mail, CheckCircle2, ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react';

export default function RecoveryEmailSentPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0e0e1a] flex items-center justify-center p-5 font-sans">
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#47f0d1]/[0.05] rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#47f0d1]/[0.03] rounded-full blur-[100px]" />
            </div>

            <div className="relative w-full max-w-[420px] bg-white dark:bg-[#13131f] border border-slate-100 dark:border-white/[0.06] rounded-3xl shadow-2xl shadow-black/5 dark:shadow-black/40 overflow-hidden">
                <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#47f0d1]/60 to-transparent" />

                <div className="p-8 text-center">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-full bg-[#47f0d1]/15 shadow-[0_0_40px_rgba(71,240,209,0.25)] flex items-center justify-center">
                                <Mail className="w-9 h-9 text-[#47f0d1]" />
                            </div>
                            {/* Check badge */}
                            <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-[#47f0d1] flex items-center justify-center shadow-lg">
                                <CheckCircle2 className="w-4 h-4 text-[#0e0e1a]" />
                            </div>
                        </div>
                    </div>

                    <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-3">
                        Check Your Inbox
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed mb-8 max-w-[300px] mx-auto">
                        We&apos;ve sent a password reset link to your email address. Click the link to create a new password.
                        <br /><span className="text-[11px] mt-1 inline-block text-slate-400 dark:text-zinc-600">Don&apos;t see it? Check your spam folder.</span>
                    </p>

                    <div className="space-y-3">
                        {/* Resend */}
                        <Link
                            href="/forgot-password"
                            className="w-full h-14 rounded-2xl bg-slate-100 dark:bg-zinc-900/60 border border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-zinc-300 font-bold text-sm hover:bg-slate-200 dark:hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" /> Try a different email
                        </Link>

                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-px bg-slate-100 dark:bg-white/[0.06]" />
                            <span className="text-xs font-bold text-slate-400 dark:text-zinc-600 uppercase tracking-widest">or</span>
                            <div className="flex-1 h-px bg-slate-100 dark:bg-white/[0.06]" />
                        </div>

                        {/* Back to login */}
                        <Link
                            href="/login"
                            className="w-full h-14 bg-[#47f0d1] hover:bg-[#3de0c3] text-[#0e0e1a] rounded-2xl font-black text-sm shadow-[0_8px_24px_rgba(71,240,209,0.2)] hover:shadow-[0_8px_24px_rgba(71,240,209,0.35)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
