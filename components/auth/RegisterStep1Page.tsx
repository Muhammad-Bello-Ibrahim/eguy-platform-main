"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterStep1() {
    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [referralCode, setReferralCode] = useState('');

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        sessionStorage.setItem('register_fullName', fullName);
        sessionStorage.setItem('register_email', email);
        if (referralCode) sessionStorage.setItem('register_referralCode', referralCode);
        router.push('/register/details');
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-100 min-h-screen flex items-center justify-center p-0 m-0">
            {/* Mobile Device Container */}
            <div className="relative w-full max-w-[430px] h-full min-h-[844px] bg-background-light dark:bg-background-dark overflow-hidden shadow-2xl flex flex-col">
                {/* Background Decoration */}
                <div className="absolute inset-0 pointer-events-none opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(71, 240, 209, 0.05) 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px]"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px]"></div>

                {/* Content Area */}
                <div className="flex-1 px-8 pt-6 pb-12 relative z-10 flex flex-col">
                    {/* Back Button & Header */}
                    <div className="mb-10 pt-8">
                        <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-200 dark:bg-white/5 mb-6 hover:bg-primary/20 transition-colors">
                            <span className="material-icons-round text-primary">arrow_back_ios_new</span>
                        </button>
                        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Create Your Account</h1>
                        <p className="text-slate-400 font-medium">Join the network growth platform.</p>
                    </div>

                    {/* Step Indicator */}
                    <div className="mb-10">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-bold uppercase tracking-widest text-primary">Step 1 of 3</span>
                            <span className="text-xs font-medium text-slate-500">Account Info</span>
                        </div>
                        <div className="flex gap-2 h-1.5 w-full">
                            <div className="flex-1 bg-primary rounded-full shadow-[0_0_10px_rgba(71,240,209,0.5)]"></div>
                            <div className="flex-1 bg-slate-200 dark:bg-white/10 rounded-full"></div>
                            <div className="flex-1 bg-slate-200 dark:bg-white/10 rounded-full"></div>
                        </div>
                    </div>

                    {/* Registration Form */}
                    <form onSubmit={handleNext} className="space-y-5 flex-1">
                        {/* Full Name */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                            <div className="relative group">
                                <input
                                    className="w-full bg-slate-100 dark:bg-white/5 border-transparent focus:border-primary/50 focus:ring-4 focus:ring-primary/10 rounded-xl py-4 px-5 transition-all outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-600"
                                    placeholder="John Doe"
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                                <span className="material-icons-round absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-600 group-focus-within:text-primary">person_outline</span>
                            </div>
                        </div>

                        {/* Email Address */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                            <div className="relative group">
                                <input
                                    className="w-full bg-slate-100 dark:bg-white/5 border-transparent focus:border-primary/50 focus:ring-4 focus:ring-primary/10 rounded-xl py-4 px-5 transition-all outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-600"
                                    placeholder="name@email.com"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <span className="material-icons-round absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-600 group-focus-within:text-primary">mail_outline</span>
                            </div>
                        </div>

                        {/* Referral Code */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Referral Code <span className="text-slate-500 dark:text-slate-600 lowercase font-normal">(optional)</span></label>
                            <div className="relative group">
                                <input
                                    className="w-full bg-slate-100 dark:bg-white/5 border-transparent focus:border-primary/50 focus:ring-4 focus:ring-primary/10 rounded-xl py-4 px-5 transition-all outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-600"
                                    placeholder="Enter code"
                                    type="text"
                                    value={referralCode}
                                    onChange={(e) => setReferralCode(e.target.value)}
                                />
                                <span className="material-icons-round absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-600 group-focus-within:text-primary">confirmation_number</span>
                            </div>
                        </div>

                        {/* Continue Button */}
                        <div className="pt-4">
                            <button type="submit" className="w-full bg-primary text-background-dark font-bold text-lg py-4 rounded-full shadow-[0_8px_32px_rgba(71,240,209,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all">
                                Continue
                            </button>
                        </div>
                    </form>

                    {/* Footer Link */}
                    <div className="mt-8 text-center pb-8">
                        <p className="text-slate-400 font-medium">
                            Already have an account?
                            <Link className="text-primary font-bold ml-1 hover:underline" href="/login">Log In</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
