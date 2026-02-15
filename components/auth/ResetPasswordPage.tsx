"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!token) {
            setError('Invalid or missing reset token');
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });

            if (res.ok) {
                router.push('/reset-password/success');
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to reset password');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-[#131321] text-white min-h-screen flex items-center justify-center font-display antialiased">
            <div className="relative w-full max-w-[400px] h-screen sm:h-[844px] bg-[#131321] overflow-hidden flex flex-col px-8 pt-16 pb-12 shadow-2xl sm:rounded-3xl">
                {/* Status Bar Decoration (iOS Style) */}
                <div className="absolute top-0 left-0 w-full h-12 flex items-center justify-between px-8 text-xs font-semibold opacity-60 pointer-events-none">
                    <span>9:41</span>
                    <div className="flex items-center space-x-1.5">
                        <span className="material-icons-round text-[16px]">signal_cellular_alt</span>
                        <span className="material-icons-round text-[16px]">wifi</span>
                        <span className="material-icons-round text-[18px] rotate-90">battery_full</span>
                    </div>
                </div>

                <div className="mb-8">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    >
                        <span className="material-icons-round">arrow_back_ios_new</span>
                    </button>
                </div>

                <div className="flex flex-col items-center justify-center mb-10">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-primary/20 blur-[50px] rounded-full"></div>
                        <div className="relative w-24 h-24 bg-[#1a1a2e] border border-primary/20 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(70,240,210,0.15)] overflow-hidden">
                            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent"></div>
                            <span className="material-icons-round text-5xl text-primary drop-shadow-[0_0_10px_rgba(70,240,210,0.5)]">shield_lock</span>
                        </div>
                    </div>
                    <h1 className="mt-8 text-3xl font-extrabold tracking-tight text-center bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
                        Create New Password
                    </h1>
                    <p className="mt-3 text-center text-slate-400 font-medium px-4 leading-relaxed text-sm">
                        Your new password must be different from previous passwords.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex-grow flex flex-col space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-lg text-center font-bold">
                            {error}
                        </div>
                    )}
                    <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 ml-1" htmlFor="new-password">New Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className="material-icons-round text-slate-500 text-xl">lock</span>
                            </div>
                            <input
                                className="block w-full pl-12 pr-12 py-5 bg-[#1a1a2e] border-0 ring-1 ring-white/10 rounded-2xl focus:ring-2 focus:ring-primary focus:bg-[#1f1f3a] text-white placeholder-slate-600 transition-all duration-300 outline-none"
                                id="new-password"
                                placeholder="••••••••"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button type="button" className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-primary transition-colors">
                                <span className="material-icons-round text-xl">visibility</span>
                            </button>
                        </div>
                        <div className="mt-3 px-1">
                            <div className="flex justify-between items-center mb-1.5">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Strength: <span className="text-primary">Strong</span></span>
                                <span className="text-[10px] font-bold text-slate-500">80%</span>
                            </div>
                            <div className="flex space-x-1.5">
                                <div className="h-1.5 flex-1 rounded-full bg-primary"></div>
                                <div className="h-1.5 flex-1 rounded-full bg-primary"></div>
                                <div className="h-1.5 flex-1 rounded-full bg-primary"></div>
                                <div className="h-1.5 flex-1 rounded-full bg-white/10"></div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 ml-1" htmlFor="confirm-password">Confirm Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className="material-icons-round text-slate-500 text-xl">verified_user</span>
                            </div>
                            <input
                                className="block w-full pl-12 pr-12 py-5 bg-[#1a1a2e] border-0 ring-1 ring-white/10 rounded-2xl focus:ring-2 focus:ring-primary focus:bg-[#1f1f3a] text-white placeholder-slate-600 transition-all duration-300 outline-none"
                                id="confirm-password"
                                placeholder="••••••••"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <button type="button" className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-primary transition-colors">
                                <span className="material-icons-round text-xl">visibility</span>
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary hover:bg-[#3de0c3] active:scale-[0.98] text-[#131321] font-bold py-5 rounded-2xl shadow-lg shadow-primary/20 transition-all duration-300 flex items-center justify-center space-x-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        <span className="font-extrabold uppercase tracking-tight">{isLoading ? 'Saving...' : 'Save & Sign In'}</span>
                        {!isLoading && <span className="material-icons-round font-bold">login</span>}
                    </button>
                </form>

                <div className="mt-auto pt-6 text-center">
                    <p className="text-[11px] text-slate-500 font-medium">
                        Protected by eGuy Secure Network Protocol
                    </p>
                </div>

                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-white/10 rounded-full"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none"></div>
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none"></div>
            </div>
        </div>
    );
}
