"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AtSign, ArrowLeft, ArrowRight, KeyRound, Loader2 } from 'lucide-react';

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
            if (res.ok) { router.push('/forgot-password/sent'); }
            else { const data = await res.json(); setError(data.error || 'Failed to send reset link'); }
        } catch { setError('An error occurred. Please try again.'); }
        finally { setIsLoading(false); }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0e0e1a] flex items-center justify-center p-5 font-sans">
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#47f0d1]/[0.05] rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#47f0d1]/[0.03] rounded-full blur-[100px]" />
            </div>

            <div className="relative w-full max-w-[420px] bg-white dark:bg-[#13131f] border border-slate-100 dark:border-white/[0.06] rounded-3xl shadow-2xl shadow-black/5 dark:shadow-black/40 overflow-hidden">
                <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#47f0d1]/60 to-transparent" />

                <div className="p-8">
                    {/* Back button */}
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors mb-6"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>

                    {/* Icon */}
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="w-16 h-16 bg-[#47f0d1]/10 border border-[#47f0d1]/20 rounded-2xl flex items-center justify-center mb-5 shadow-[0_0_24px_rgba(71,240,209,0.15)]">
                            <KeyRound className="w-8 h-8 text-[#47f0d1]" />
                        </div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-2">Reset Password</h1>
                        <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed max-w-[280px]">
                            Enter your registered email and we'll send you a secure recovery link.
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-5 px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-500 ml-1">Email Address</label>
                            <div className="relative group">
                                <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-zinc-600 group-focus-within:text-[#47f0d1] transition-colors pointer-events-none" />
                                <input
                                    className="w-full bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-white/[0.08] rounded-2xl py-4 px-5 pl-12 text-base font-semibold placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:bg-white dark:focus:bg-[#1a1a2e] focus:border-[#47f0d1] focus:ring-4 focus:ring-[#47f0d1]/10 text-slate-900 dark:text-white transition-all outline-none"
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
                            className="w-full h-14 bg-[#47f0d1] hover:bg-[#3de0c3] text-[#0e0e1a] rounded-2xl font-black text-base shadow-[0_8px_24px_rgba(71,240,209,0.25)] hover:shadow-[0_8px_24px_rgba(71,240,209,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                        >
                            {isLoading
                                ? <><Loader2 className="w-5 h-5 animate-spin" /> Sending…</>
                                : <>Send Recovery Link <ArrowRight className="w-5 h-5" /></>
                            }
                        </button>
                    </form>

                    <div className="h-px bg-slate-100 dark:bg-white/[0.06] my-6" />

                    <div className="text-center">
                        <Link href="/login" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-zinc-400 hover:text-[#47f0d1] transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
