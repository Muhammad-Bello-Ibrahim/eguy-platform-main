"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RecoveryEmailSentPage() {
    const router = useRouter();

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-100 flex items-center justify-center min-h-screen">
            {/* Main Content Wrapper */}
            <div className="relative w-full max-w-md bg-background-light dark:bg-background-dark overflow-hidden flex flex-col items-center px-8 py-12 shadow-xl sm:border sm:border-slate-200 sm:dark:border-[#2a423d] sm:rounded-3xl">

                <div className="w-full flex flex-col justify-center items-center text-center">
                    {/* Success Icon Section */}
                    <div className="relative mb-10">
                        {/* Outer Glow */}
                        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
                        <div className="relative w-24 h-24 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center shadow-[0_10px_30px_-10px_rgba(71,240,209,0.2)]">
                            <span className="material-icons-round text-primary text-5xl">send_and_archive</span>
                        </div>
                        {/* Floating Small Icons */}
                        <div className="absolute -top-2 -right-2 bg-primary rounded-full p-1.5 shadow-lg">
                            <span className="material-icons-round text-background-dark text-xs font-bold">check</span>
                        </div>
                    </div>

                    {/* Text Content */}
                    <h1 className="text-3xl font-extrabold mb-4 tracking-tight">Check your Inbox</h1>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-12">
                        We've sent a password reset link to <br />
                        <span className="text-primary font-bold">user@email.com</span>. <br />
                        Please check your spam folder if you don't see it.
                    </p>

                    {/* Buttons Stack */}
                    <div className="w-full space-y-4">
                        {/* Primary Action */}
                        <button className="w-full bg-primary text-background-dark font-bold py-4 rounded-xl hover:opacity-90 transition-all flex items-center justify-center space-x-2">
                            <span>Resend Email</span>
                        </button>

                        {/* Secondary Action */}
                        <Link href="/login" className="w-full bg-transparent text-slate-500 dark:text-slate-400 font-semibold py-4 rounded-xl hover:text-primary transition-all flex items-center justify-center space-x-2">
                            <span className="material-icons-round text-sm">arrow_back</span>
                            <span>Back to Login</span>
                        </Link>
                    </div>

                    {/* Verification Image / Abstract Decor */}
                    <div className="mt-16 w-full opacity-30">
                        <div className="w-full h-24 rounded-2xl bg-gradient-to-r from-transparent via-primary/20 to-transparent flex items-center justify-center">
                            <span className="material-icons-round text-primary/40 text-6xl">security</span>
                        </div>
                    </div>
                </div>

                {/* Background Decorative Elements */}
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
            </div>
        </div>
    );
}
