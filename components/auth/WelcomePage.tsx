"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export default function WelcomePage() {
    const router = useRouter();

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-sans min-h-screen flex items-center justify-center p-4">
            {/* Mobile Screen Wrapper */}
            <div className="relative w-full max-w-[390px] h-[844px] overflow-hidden bg-background-light dark:bg-background-dark border-x border-slate-200 dark:border-slate-800 flex flex-col items-center justify-between py-12 px-6 shadow-2xl rounded-[3rem]">
                {/* Abstract Background Glows */}
                <div className="absolute top-[-100px] left-[-100px] w-64 h-64 bg-primary/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-100px] right-[-100px] w-64 h-64 bg-primary/20 rounded-full blur-[100px]"></div>

                {/* Success Animation / Icon Section */}
                <div className="relative z-10 flex flex-col items-center mt-8">
                    <div className="relative flex items-center justify-center w-32 h-32 rounded-full bg-primary/10 animate-pulse">
                        <div className="absolute inset-0 rounded-full border-2 border-primary/30"></div>
                        <div className="flex items-center justify-center w-24 h-24 rounded-full bg-primary text-background-dark">
                            <span className="material-icons-round text-5xl">check_circle</span>
                        </div>
                    </div>
                    <div className="mt-10 text-center">
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            Welcome to <span className="text-primary">eGuy!</span>
                        </h1>
                        <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm leading-relaxed px-4">
                            Your account is ready. You're now part of the future of fintech growth and networking.
                        </p>
                    </div>
                </div>

                {/* Referral Code Card */}
                <div className="relative z-10 w-full mt-4">
                    <div className="bg-surface-dark/60 backdrop-blur-xl border border-primary/10 rounded-xl p-6 flex flex-col items-center space-y-4">
                        <div className="text-center">
                            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary/70">Your Unique Growth Code</span>
                        </div>
                        <div className="w-full flex items-center justify-between bg-black/20 dark:bg-white/5 rounded-lg border border-primary/20 px-4 py-3 group">
                            <span className="text-xl font-mono font-bold tracking-wider text-primary">EGUY-77X-99</span>
                            <button className="flex items-center justify-center p-2 rounded-full hover:bg-primary/10 transition-colors">
                                <span className="material-icons-round text-primary text-xl">content_copy</span>
                            </button>
                        </div>
                        <button className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-primary transition-colors">
                            <span className="material-icons-round text-base">share</span>
                            <span>Share with your network</span>
                        </button>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="relative z-10 w-full flex flex-col gap-4 mb-8">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="w-full bg-primary text-background-dark font-bold py-4 rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        <span>Go to Dashboard</span>
                        <span className="material-icons-round text-xl">arrow_forward</span>
                    </button>
                    <button className="w-full py-4 rounded-xl font-bold border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 active:scale-95 transition-all">
                        Take a Tour
                    </button>
                </div>

                {/* Footer Logo/Branding */}
                <div className="relative z-10 opacity-30 flex items-center gap-1">
                    <div className="w-5 h-5 bg-primary rounded-sm rotate-45"></div>
                    <span className="text-xs font-bold uppercase tracking-widest">eGuy Platform</span>
                </div>
            </div>
        </div>
    );
}
