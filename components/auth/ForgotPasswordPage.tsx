"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/reset-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (res.ok) {
                router.push('/forgot-password/sent');
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to send reset link');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-background-light dark:bg-[#131321] text-slate-900 dark:text-white min-h-screen flex items-center justify-center font-display antialiased">
            {/* Main Mobile Container */}
            <div className="relative w-full max-w-[400px] h-screen sm:h-[844px] bg-background-light dark:bg-[#131321] overflow-hidden flex flex-col px-8 pt-16 pb-12 shadow-2xl sm:rounded-xl">
                {/* Status Bar Decoration (iOS Style) */}
                <div className="absolute top-0 left-0 w-full h-12 flex items-center justify-between px-8 text-xs font-semibold opacity-60 pointer-events-none">
                    <span>9:41</span>
                    <div className="flex items-center space-x-1.5">
                        <span className="material-icons-round text-[14px]">signal_cellular_alt</span>
                        <span className="material-icons-round text-[14px]">wifi</span>
                        <span className="material-icons-round text-[16px]">battery_full</span>
                    </div>
                </div>

                {/* Back Button Area */}
                <div className="mb-12">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    >
                        <span className="material-icons-round">arrow_back_ios_new</span>
                    </button>
                </div>

                {/* Central Icon/Hero Section */}
                <div className="flex flex-col items-center justify-center mb-10">
                    <div className="relative group">
                        {/* Soft Glow Background */}
                        <div className="absolute inset-0 bg-primary/20 blur-[50px] rounded-full group-hover:bg-primary/30 transition-all"></div>
                        {/* Icon Container */}
                        <div className="relative w-24 h-24 bg-[#1a1a2e] border border-primary/20 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(71,240,209,0.15)] overflow-hidden">
                            {/* Subtle Mesh Pattern */}
                            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent"></div>
                            <span className="material-icons-round text-5xl text-primary drop-shadow-[0_0_10px_rgba(71,240,209,0.5)]">lock_reset</span>
                        </div>
                    </div>
                    <h1 className="mt-8 text-3xl font-extrabold tracking-tight text-center bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent bg-background-dark dark:text-white">
                        Reset Password
                    </h1>
                    <p className="mt-4 text-center text-slate-500 dark:text-slate-400 font-medium px-4 leading-relaxed">
                        Enter your registered email below to receive secure recovery instructions.
                    </p>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit} className="flex-grow flex flex-col space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-lg text-center font-bold">
                            {error}
                        </div>
                    )}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-primary/80 ml-1" htmlFor="email">Email Address</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className="material-icons-round text-slate-500 text-xl group-focus-within:text-primary transition-colors">alternate_email</span>
                            </div>
                            <input
                                className="block w-full pl-12 pr-4 py-5 bg-white dark:bg-[#1a1a2e] border-0 ring-1 ring-slate-200 dark:ring-white/10 rounded-2xl focus:ring-2 focus:ring-primary focus:bg-slate-50 dark:focus:bg-[#1f1f3a] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 transition-all duration-300 outline-none"
                                id="email"
                                placeholder="name@example.com"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary hover:bg-primary/90 active:scale-[0.98] text-[#131321] font-bold py-5 rounded-full shadow-lg shadow-primary/20 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        <span>{isLoading ? 'Sending...' : 'Send Recovery Link'}</span>
                        {!isLoading && <span className="material-icons-round text-lg">arrow_forward</span>}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-auto pt-8 text-center">
                    <Link href="/login" className="inline-flex items-center text-sm font-semibold text-slate-400 hover:text-primary transition-colors">
                        <span className="material-icons-round text-base mr-1">keyboard_return</span>
                        Back to Login
                    </Link>
                </div>

                {/* Home Indicator (iOS Style) */}
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-slate-200 dark:bg-white/20 rounded-full"></div>

                {/* Abstract Background Decoration */}
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none"></div>
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none"></div>
            </div>
        </div>
    );
}
