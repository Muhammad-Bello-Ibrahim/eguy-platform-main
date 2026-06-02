"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, Mail, Tag, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function RegisterStep1() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [referralCode, setReferralCode] = useState('');

    React.useEffect(() => {
        const ref = searchParams.get('ref');
        if (ref) {
            setReferralCode(ref);
        }
    }, [searchParams]);

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        sessionStorage.setItem('register_fullName', fullName);
        sessionStorage.setItem('register_email', email);
        if (referralCode) sessionStorage.setItem('register_referralCode', referralCode);
        router.push('/register/details');
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 min-h-screen flex justify-center font-sans">
            <div className="w-full max-w-[430px] h-screen bg-white dark:bg-[#131321] relative overflow-hidden flex flex-col shadow-2xl border-x border-slate-100 dark:border-white/5">
                
                {/* Header */}
                <header className="pt-14 pb-4 px-8 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-[#131321]/80 backdrop-blur-md z-20 border-b border-slate-100 dark:border-white/5">
                    <button 
                        onClick={() => router.back()} 
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-bold text-[#47f0d1] flex items-center gap-1">
                        Step 1 of 3 <Sparkles className="w-4 h-4 animate-pulse" />
                    </span>
                    <div className="w-10"></div>
                </header>

                {/* Scrollable Content Area */}
                <main className="flex-1 px-8 pt-6 pb-8 overflow-y-auto no-scrollbar flex flex-col justify-between">
                    <div>
                        {/* Title Section */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-black tracking-tight mb-2 bg-gradient-to-br from-slate-950 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                                Create Account
                            </h1>
                            <p className="text-slate-500 dark:text-zinc-400 text-sm">
                                Enter your basic credentials to begin your journey.
                            </p>
                        </div>

                        {/* Step Indicator Progress Bar */}
                        <div className="mb-8">
                            <div className="w-full h-1.5 bg-slate-100 dark:bg-zinc-800/50 rounded-full overflow-hidden">
                                <div className="h-full bg-[#47f0d1] w-1/3 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(71,240,209,0.4)]"></div>
                            </div>
                        </div>

                        {/* Registration Form */}
                        <form onSubmit={handleNext} id="step1-form" className="space-y-5">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Full Name</label>
                                <div className="relative group">
                                    <input
                                        className="w-full bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-white/5 rounded-2xl py-4 px-5 pl-12 text-base font-bold placeholder:text-slate-400 dark:placeholder:text-zinc-650 focus:bg-white dark:focus:bg-[#18182d] focus:border-[#47f0d1] focus:ring-4 focus:ring-[#47f0d1]/10 text-slate-900 dark:text-white transition-all outline-none"
                                        placeholder="John Doe"
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                    />
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-600 w-5 h-5 group-focus-within:text-[#47f0d1] transition-colors" />
                                </div>
                            </div>

                            {/* Email Address */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative group">
                                    <input
                                        className="w-full bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-white/5 rounded-2xl py-4 px-5 pl-12 text-base font-bold placeholder:text-slate-400 dark:placeholder:text-zinc-650 focus:bg-white dark:focus:bg-[#18182d] focus:border-[#47f0d1] focus:ring-4 focus:ring-[#47f0d1]/10 text-slate-900 dark:text-white transition-all outline-none"
                                        placeholder="name@email.com"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-600 w-5 h-5 group-focus-within:text-[#47f0d1] transition-colors" />
                                </div>
                            </div>

                            {/* Referral Code */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
                                    Referral Code <span className="lowercase font-normal text-slate-400">(optional)</span>
                                </label>
                                <div className="relative group">
                                    <input
                                        className="w-full bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-white/5 rounded-2xl py-4 px-5 pl-12 text-base font-bold placeholder:text-slate-400 dark:placeholder:text-zinc-650 focus:bg-white dark:focus:bg-[#18182d] focus:border-[#47f0d1] focus:ring-4 focus:ring-[#47f0d1]/10 text-slate-900 dark:text-white transition-all outline-none"
                                        placeholder="Enter invite code"
                                        type="text"
                                        value={referralCode}
                                        onChange={(e) => setReferralCode(e.target.value)}
                                    />
                                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-600 w-5 h-5 group-focus-within:text-[#47f0d1] transition-colors" />
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-8 space-y-5">
                        <button 
                            type="submit" 
                            form="step1-form"
                            className="w-full h-14 bg-[#47f0d1] hover:bg-[#47f0d1]/90 text-[#131321] py-4 rounded-2xl font-black text-lg shadow-[0_10px_30px_rgba(71,240,209,0.25)] hover:shadow-[0_10px_30px_rgba(71,240,209,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <span>Continue</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>

                        <p className="text-center text-sm font-semibold text-slate-400 dark:text-zinc-500">
                            Already have an account?
                            <Link className="text-[#47f0d1] font-bold ml-1.5 hover:underline" href="/login">Log In</Link>
                        </p>
                    </div>
                </main>

                {/* Floating Abstract Background Elements */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#47f0d1]/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#47f0d1]/5 rounded-full blur-3xl pointer-events-none"></div>
            </div>
        </div>
    );
}
