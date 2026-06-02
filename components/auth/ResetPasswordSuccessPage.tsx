"use client";

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

export default function ResetPasswordSuccessPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0e0e1a] flex items-center justify-center p-5 font-sans">
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#47f0d1]/[0.05] rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#47f0d1]/[0.03] rounded-full blur-[100px]" />
            </div>

            <div className="relative w-full max-w-[420px] bg-white dark:bg-[#13131f] border border-slate-100 dark:border-white/[0.06] rounded-3xl shadow-2xl shadow-black/5 dark:shadow-black/40 overflow-hidden">
                <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#47f0d1]/60 to-transparent" />

                <div className="p-8 text-center">
                    {/* Success Icon */}
                    <div className="flex justify-center mb-7">
                        <div className="relative">
                            {/* Outer ring */}
                            <div className="w-28 h-28 rounded-full border-2 border-[#47f0d1]/20 flex items-center justify-center">
                                {/* Middle ring */}
                                <div className="w-20 h-20 rounded-full bg-[#47f0d1]/12 shadow-[0_0_50px_rgba(71,240,209,0.3)] flex items-center justify-center">
                                    <CheckCircle2 className="w-11 h-11 text-[#47f0d1]" />
                                </div>
                            </div>
                            {/* Pulse dot */}
                            <div className="absolute top-1 right-1 w-3 h-3 bg-[#47f0d1] rounded-full animate-pulse shadow-[0_0_10px_rgba(71,240,209,0.6)]" />
                        </div>
                    </div>

                    <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-3">
                        Password Updated!
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed mb-8 max-w-[300px] mx-auto">
                        Your password has been changed successfully. You can now sign in with your new credentials.
                    </p>

                    {/* Security strip */}
                    <div className="flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-[#47f0d1]/5 border border-[#47f0d1]/15 mb-6">
                        <ShieldCheck className="w-4 h-4 text-[#47f0d1]" />
                        <span className="text-[11px] font-black uppercase tracking-[0.14em] text-[#47f0d1]/80">Account Protection Active</span>
                    </div>

                    <Link
                        href="/login"
                        className="w-full h-14 bg-[#47f0d1] hover:bg-[#3de0c3] text-[#0e0e1a] rounded-2xl font-black text-base shadow-[0_8px_24px_rgba(71,240,209,0.25)] hover:shadow-[0_8px_24px_rgba(71,240,209,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        Sign In Now <ArrowRight className="w-5 h-5" />
                    </Link>

                    {/* Brand mark */}
                    <div className="flex items-center justify-center gap-1.5 mt-6 opacity-30">
                        <div className="w-5 h-5 bg-[#47f0d1] rounded-md flex items-center justify-center">
                            <span className="text-[10px] font-black text-[#0e0e1a]">eG</span>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">eGuy Fintech</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
