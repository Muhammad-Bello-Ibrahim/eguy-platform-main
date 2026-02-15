"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export default function EmailVerifiedPage() {
    const router = useRouter();

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex items-center justify-center p-4">
            {/* iOS Frame Mockup */}
            <div className="relative w-full max-w-[390px] h-[844px] bg-background-light dark:bg-background-dark rounded-[3rem] shadow-2xl overflow-hidden border-8 border-slate-200 dark:border-slate-800 flex flex-col">
                {/* Status Bar */}
                <div className="h-11 flex justify-between items-center px-8 w-full shrink-0">
                    <span className="text-sm font-semibold">9:41</span>
                    <div className="flex items-center space-x-1.5">
                        <span className="material-icons-round text-base">signal_cellular_alt</span>
                        <span className="material-icons-round text-base">wifi</span>
                        <span className="material-icons-round text-base rotate-90">battery_full</span>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col items-center justify-center px-8 relative">
                    {/* Abstract Background Decorative Elements */}
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10"></div>

                    {/* Hero Success Icon */}
                    <div className="relative mb-10">
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
                        <div className="relative w-28 h-28 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
                            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-[0_0_30px_rgba(71,240,209,0.4)]">
                                <span className="material-icons-round text-background-dark text-5xl font-bold">check</span>
                            </div>
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="text-center space-y-4">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Email Verified Successfully
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed max-w-[280px] mx-auto">
                            Your email has been confirmed. You can now access all the features of the <span className="text-primary font-medium">eGuy</span> ecosystem.
                        </p>
                    </div>

                    {/* Features Quick Look (Cards) */}
                    <div className="mt-12 w-full grid grid-cols-2 gap-3">
                        <div className="bg-white/50 dark:bg-surface-dark/40 p-4 rounded-xl border border-slate-200 dark:border-white/5 backdrop-blur-sm">
                            <span className="material-icons-round text-primary mb-2">payments</span>
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Fintech</h3>
                            <p className="text-sm font-medium">Global Transfers</p>
                        </div>
                        <div className="bg-white/50 dark:bg-surface-dark/40 p-4 rounded-xl border border-slate-200 dark:border-white/5 backdrop-blur-sm">
                            <span className="material-icons-round text-primary mb-2">hub</span>
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Network</h3>
                            <p className="text-sm font-medium">Growth Tools</p>
                        </div>
                    </div>
                </div>

                {/* Action Section */}
                <div className="p-8 pb-12 space-y-4 shrink-0">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="w-full bg-primary hover:bg-primary/90 text-background-dark font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group active:scale-[0.98]"
                    >
                        <span>Continue to Dashboard</span>
                        <span className="material-icons-round text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                    <button className="w-full py-2 text-slate-500 dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors">
                        Contact Support
                    </button>
                </div>

                {/* Home Indicator */}
                <div className="h-2 w-full relative flex justify-center pb-2">
                    <div className="w-32 h-1 bg-slate-300 dark:bg-white/20 rounded-full"></div>
                </div>
            </div>

            {/* Background Decoration (External to phone) */}
            <div className="fixed top-0 left-0 -z-50 w-full h-full opacity-30 dark:opacity-20 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]"></div>
            </div>
        </div>
    );
}
