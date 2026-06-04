"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    ArrowRight,
    Calendar,
    Phone,
    MapPin,
    ShieldCheck,
    Sparkles,
} from 'lucide-react';

export default function RegisterStep2Page() {
    const router = useRouter();
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
        <div className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 min-h-screen flex justify-center font-sans">
            <div className="w-full max-w-[430px] h-screen bg-white dark:bg-[#131321] relative overflow-hidden flex flex-col shadow-2xl border-x border-slate-100 dark:border-white/5">

                {/* Decorative Background Glows */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#47f0d1]/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#47f0d1]/5 rounded-full blur-3xl pointer-events-none" />

                {/* Header */}
                <header className="pt-14 pb-4 px-8 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-[#131321]/80 backdrop-blur-md z-20 border-b border-slate-100 dark:border-white/5">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-bold text-[#47f0d1] flex items-center gap-1">
                        Step 2 of 3
                    </span>
                    <div className="w-10" />
                </header>

                {/* Scrollable Content */}
                <main className="flex-1 px-8 pt-6 pb-8 overflow-y-auto flex flex-col justify-between" style={{ scrollbarWidth: 'none' }}>
                    <div>
                        {/* Title Section */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-black tracking-tight mb-2 bg-gradient-to-br from-slate-950 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                                Personal Details
                            </h1>
                            <p className="text-slate-500 dark:text-zinc-400 text-sm">
                                Provide your legal information to help us secure your eGuy account.
                            </p>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-8">
                            <div className="w-full h-1.5 bg-slate-100 dark:bg-zinc-800/50 rounded-full overflow-hidden">
                                <div className="h-full bg-[#47f0d1] w-2/3 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(71,240,209,0.4)]" />
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleNext} id="step2-form" className="space-y-5">

                            {/* Date of Birth */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
                                    Date of Birth
                                </label>
                                <div className="relative group">
                                    <input
                                        className="w-full bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-white/5 rounded-2xl py-4 px-5 pl-12 text-base font-bold placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:bg-white dark:focus:bg-[#18182d] focus:border-[#47f0d1] focus:ring-4 focus:ring-[#47f0d1]/10 text-slate-900 dark:text-white transition-all outline-none appearance-none"
                                        type="date"
                                        value={dob}
                                        onChange={(e) => setDob(e.target.value)}
                                    />
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-600 w-5 h-5 group-focus-within:text-[#47f0d1] transition-colors pointer-events-none" />
                                </div>
                            </div>

                            {/* Phone Number */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
                                    Phone Number
                                </label>
                                <div className="relative group">
                                    <input
                                        className="w-full bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-white/5 rounded-2xl py-4 px-5 pl-12 text-base font-bold placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:bg-white dark:focus:bg-[#18182d] focus:border-[#47f0d1] focus:ring-4 focus:ring-[#47f0d1]/10 text-slate-900 dark:text-white transition-all outline-none"
                                        placeholder="080 123 45678"
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        minLength={11}
                                        maxLength={11}
                                        required
                                    />
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-600 w-5 h-5 group-focus-within:text-[#47f0d1] transition-colors pointer-events-none" />
                                </div>
                            </div>

                            {/* Residential Address */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
                                    Residential Address
                                </label>
                                <div className="relative group">
                                    <textarea
                                        className="w-full bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-white/5 rounded-2xl py-4 px-5 pl-12 text-base font-bold placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:bg-white dark:focus:bg-[#18182d] focus:border-[#47f0d1] focus:ring-4 focus:ring-[#47f0d1]/10 text-slate-900 dark:text-white transition-all outline-none resize-none"
                                        placeholder="Street, City, State"
                                        rows={3}
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        maxLength={45}
                                        required
                                    />
                                    <MapPin className="absolute left-4 top-5 text-slate-400 dark:text-zinc-600 w-5 h-5 group-focus-within:text-[#47f0d1] transition-colors pointer-events-none" />
                                </div>
                            </div>

                            {/* KYC Info Card */}
                            <div className="flex gap-3 p-4 rounded-2xl bg-[#47f0d1]/5 border border-[#47f0d1]/15">
                                <ShieldCheck className="w-5 h-5 text-[#47f0d1] shrink-0 mt-0.5" />
                                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                                    Your information is encrypted and never shared. We only use this for regulatory compliance (KYC).
                                </p>
                            </div>
                        </form>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-8 space-y-5">
                        <button
                            type="submit"
                            form="step2-form"
                            className="w-full h-14 bg-[#47f0d1] hover:bg-[#47f0d1]/90 text-[#131321] py-4 rounded-2xl font-black text-lg shadow-[0_10px_30px_rgba(71,240,209,0.25)] hover:shadow-[0_10px_30px_rgba(71,240,209,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <span>Continue</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>

                        <p className="text-center text-sm font-semibold text-slate-400 dark:text-zinc-500">
                            Having trouble?{' '}
                            <button type="button" className="text-[#47f0d1] font-bold hover:underline">
                                Contact Support
                            </button>
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
}
