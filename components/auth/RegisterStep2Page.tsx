"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterStep2Page() {
    const router = useRouter();
    // State for form fields
    const [dob, setDob] = useState('1995-01-01');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        sessionStorage.setItem('register_dob', dob);
        sessionStorage.setItem('register_phone', phone);
        sessionStorage.setItem('register_address', address);
        router.push('/register/secure');
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex justify-center">
            {/* Phone Wrapper (iOS Form Factor) */}
            <div className="w-full max-w-md bg-background-light dark:bg-background-dark min-h-screen flex flex-col relative overflow-hidden shadow-2xl">
                {/* Background Elements for Premium Feel */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-40 -left-24 w-48 h-48 bg-primary/5 rounded-full blur-[80px] pointer-events-none"></div>

                {/* Status Bar Space (iOS) */}
                <div className="h-12 w-full"></div>

                {/* Header & Progress */}
                <header className="px-6 py-4 flex flex-col gap-6 relative z-10">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => router.back()}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-200 dark:bg-surface-dark/50 text-slate-700 dark:text-slate-200 transition-all active:scale-95 hover:bg-slate-300 dark:hover:bg-surface-dark"
                        >
                            <span className="material-icons-round">chevron_left</span>
                        </button>
                        <span className="text-sm font-semibold text-slate-500 dark:text-primary/70">Step 2 of 3</span>
                        <div className="w-10"></div> {/* Spacer for symmetry */}
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-primary/10 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-2/3 transition-all duration-500 shadow-[0_0_8px_rgba(71,240,209,0.5)]"></div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 px-6 pt-4 pb-12 overflow-y-auto relative z-10">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2 tracking-tight">Personal Details</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                            Please provide your legal information to help us secure your eGuy account.
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleNext}>
                        {/* Date of Birth */}
                        <div className="space-y-2">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-primary/60 ml-1">
                                Date of Birth
                            </label>
                            <div className="relative">
                                <input
                                    className="w-full h-14 bg-white dark:bg-surface-dark border-0 rounded-2xl px-5 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary appearance-none outline-none"
                                    type="date"
                                    value={dob}
                                    onChange={(e) => setDob(e.target.value)}
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <span className="material-icons-round text-xl">calendar_today</span>
                                </div>
                            </div>
                        </div>

                        {/* Phone Number */}
                        <div className="space-y-2">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-primary/60 ml-1">
                                Phone Number
                            </label>
                            <div className="flex gap-3">
                                <div className="w-28 relative">
                                    <div className="h-14 bg-white dark:bg-surface-dark rounded-2xl flex items-center justify-center gap-2 px-3 border-0 cursor-pointer">
                                        <span className="text-xl">🇺🇸</span>
                                        <span className="text-sm font-medium">+1</span>
                                        <span className="material-icons-round text-sm text-slate-400">expand_more</span>
                                    </div>
                                </div>
                                <input
                                    className="flex-1 h-14 bg-white dark:bg-surface-dark border-0 rounded-2xl px-5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="201 555 0123"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Residential Address */}
                        <div className="space-y-2">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-primary/60 ml-1">
                                Residential Address
                            </label>
                            <div className="relative">
                                <textarea
                                    className="w-full bg-white dark:bg-surface-dark border-0 rounded-2xl px-5 py-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary resize-none outline-none"
                                    placeholder="Street, City, Zip Code"
                                    rows={3}
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                ></textarea>
                                <div className="absolute right-4 top-4 text-slate-400">
                                    <span className="material-icons-round text-xl">location_on</span>
                                </div>
                            </div>
                        </div>

                        {/* Info Card */}
                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex gap-3">
                            <span className="material-icons-round text-primary text-xl">verified_user</span>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                                Your information is encrypted and never shared. We only use this for regulatory compliance (KYC).
                            </p>
                        </div>

                        {/* Footer / Action Button */}
                        <div className="pt-6">
                            <button
                                type="submit"
                                className="w-full h-14 bg-primary text-[#10221e] font-bold text-lg rounded-2xl shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                                Continue
                                <span className="material-icons-round">arrow_forward</span>
                            </button>
                            <p className="text-center mt-4 text-xs text-slate-400">
                                Having trouble? <button className="text-primary font-medium hover:underline">Contact Support</button>
                            </p>
                        </div>
                    </form>
                </main>

                {/* Bottom Home Indicator (iOS) */}
                <div className="h-8 w-full flex justify-center items-end pb-2">
                    <div className="w-32 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
                </div>
            </div>
        </div>
    );
}
