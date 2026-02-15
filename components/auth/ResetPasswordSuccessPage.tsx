"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ResetPasswordSuccessPage() {
    const router = useRouter();

    return (
        <div className="bg-background-light dark:bg-[#102214] text-slate-900 dark:text-slate-100 font-display selection:bg-primary selection:text-background-dark min-h-screen flex flex-col justify-center items-center overflow-hidden">
            {/* Background Decoration */}
            <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(71, 240, 102, 0.08) 0%, rgba(16, 34, 20, 0) 70%)' }}></div>
            <div className="fixed -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="fixed -bottom-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

            {/* Main Content Container */}
            <main className="relative w-full max-w-md mx-auto flex flex-col px-8 py-12 justify-center items-center overflow-hidden sm:bg-[#102214]/50 sm:backdrop-blur-xl sm:rounded-3xl sm:border sm:border-white/5">

                {/* Success Animation/Icon Section */}
                <div className="flex-1 flex flex-col items-center justify-center space-y-12 w-full">
                    {/* Icon Frame */}
                    <div className="relative group">
                        {/* Outer Glow Ring */}
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-all duration-700"></div>
                        {/* Circular Frame */}
                        <div className="relative w-40 h-40 rounded-full border border-primary/20 bg-primary/5 flex items-center justify-center shadow-[0_0_40px_rgba(71,240,102,0.15)] backdrop-blur-sm">
                            {/* Icon Inner Circle */}
                            <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center border border-primary/30">
                                <span className="material-icons-round text-7xl text-[#47f066] drop-shadow-[0_0_15px_rgba(71,240,102,0.6)]">
                                    check_circle
                                </span>
                            </div>
                        </div>
                        {/* Floating Particles (Abstract) */}
                        <div className="absolute -top-2 -right-2 w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                        <div className="absolute bottom-4 -left-3 w-2 h-2 bg-primary/40 rounded-full"></div>
                    </div>

                    {/* Text Content */}
                    <div className="text-center space-y-4">
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                            Password Secured
                        </h1>
                        <p className="text-slate-500 dark:text-[#47f066]/60 text-base leading-relaxed max-w-[280px] mx-auto">
                            Your password has been updated successfully. You can now use your new credentials to sign in.
                        </p>
                    </div>
                </div>

                {/* Action Section */}
                <div className="w-full space-y-6 pb-4 mt-12">
                    {/* Secondary Info (Optional Hint) */}
                    <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary/5 border border-primary/10">
                        <span className="material-icons-round text-[#47f066] text-sm">security</span>
                        <p className="text-[11px] uppercase tracking-[0.15em] font-bold text-[#47f066]/80">Account Protection Active</p>
                    </div>

                    {/* Primary CTA */}
                    <Link href="/login" className="w-full bg-[#47f066] hover:bg-[#47f066]/90 text-background-dark font-bold py-5 rounded-xl shadow-[0_10px_30px_-10px_rgba(71,240,102,0.4)] transition-all active:scale-[0.98] text-lg flex items-center justify-center gap-2">
                        Back to Login
                        <span className="material-icons-round">arrow_forward</span>
                    </Link>

                    {/* Footer Branding */}
                    <div className="flex flex-col items-center gap-2 opacity-40">
                        <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 bg-[#47f066] rounded-md flex items-center justify-center">
                                <span className="text-[10px] font-black text-background-dark">eG</span>
                            </div>
                            <span className="text-xs font-bold tracking-widest uppercase">eGuy Fintech</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
