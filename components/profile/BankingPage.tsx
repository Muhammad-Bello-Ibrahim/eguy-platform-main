"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export default function BankingPage() {
    const router = useRouter();

    return (
        <div className="bg-primary/20 text-slate-100 font-sans min-h-screen pb-32">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-background-dark/80 backdrop-blur-md px-6 pt-14 pb-4 flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                    <span className="material-icons-round text-slate-300">chevron_left</span>
                </button>
                <h1 className="text-lg font-bold text-white">Linked Accounts</h1>
                <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                    <span className="material-icons-round text-slate-300">more_horiz</span>
                </button>
            </header>

            <main className="px-5 pt-6 pb-32 space-y-8">
                {/* Connected Banks */}
                <section>
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Connected Banks</h2>
                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">2 ACCOUNTS</span>
                    </div>
                    <div className="space-y-4">
                        {/* Account 1 */}
                        <div className="bg-slate-800 border border-white/5 rounded-2xl p-5 relative overflow-hidden">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center">
                                        <span className="material-icons-round text-blue-400 text-3xl">account_balance</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-base">Chase Sapphire</p>
                                        <p className="text-xs text-slate-500 font-medium">Checking •••• 8829</p>
                                    </div>
                                </div>
                                <div className="bg-primary/20 text-primary text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-tighter">Verified</div>
                            </div>
                            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-slate-500 font-bold uppercase">Primary Payout</span>
                                    <span className="text-xs text-primary font-medium">Active for withdrawals</span>
                                </div>
                                <div className="relative inline-flex items-center cursor-pointer">
                                    <div className="w-11 h-6 bg-primary rounded-full"></div>
                                    <div className="absolute left-[22px] top-1 bg-white w-4 h-4 rounded-full shadow-sm"></div>
                                </div>
                            </div>
                        </div>

                        {/* Account 2 */}
                        <div className="bg-slate-800 border border-white/5 rounded-2xl p-5">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                                        <span className="material-icons-round text-orange-400 text-3xl">account_balance</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-base">Goldman Sachs</p>
                                        <p className="text-xs text-slate-500 font-medium">Savings •••• 4401</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                                <div className="flex flex-col text-slate-400">
                                    <span className="text-[10px] font-bold uppercase">Set as Primary</span>
                                </div>
                                <div className="relative inline-flex items-center cursor-pointer">
                                    <div className="w-11 h-6 bg-slate-500 rounded-full"></div>
                                    <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow-sm"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Cards */}
                <section>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 px-1">Debit & Credit Cards</h2>
                    <div className="bg-slate-800 border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
                        <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-7 bg-slate-800 rounded flex items-center justify-center overflow-hidden">
                                    <div className="w-full h-full flex items-center justify-center gap-0.5">
                                        <div className="w-3 h-3 rounded-full bg-red-500 opacity-80"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500 -ml-1.5 opacity-80"></div>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">Mastercard Premium</p>
                                    <p className="text-[11px] text-slate-500">Expires 09/27</p>
                                </div>
                            </div>
                            <span className="material-icons-round text-slate-600 text-lg">chevron_right</span>
                        </div>
                        <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-7 bg-[#1A1F71] rounded flex items-center justify-center italic font-black text-[10px] text-white tracking-tighter">VISA</div>
                                <div>
                                    <p className="text-sm font-semibold">Visa Business Platinum</p>
                                    <p className="text-[11px] text-slate-500">Expires 12/25</p>
                                </div>
                            </div>
                            <span className="material-icons-round text-slate-600 text-lg">chevron_right</span>
                        </div>
                    </div>
                </section>

                {/* Add New */}
                <button className="w-full py-6 rounded-2xl border-2 border-dashed border-primary/20 flex flex-col items-center justify-center gap-2 group hover:bg-primary/5 transition-all">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <span className="material-icons-round">add</span>
                    </div>
                    <span className="text-sm font-bold text-primary uppercase tracking-widest">Add New Account</span>
                </button>

                {/* Security Note */}
                <div className="px-4 py-6 bg-primary/5 rounded-2xl border border-primary/10">
                    <div className="flex gap-3">
                        <span className="material-icons-round text-primary text-xl">security</span>
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-200">Bank-level Security</p>
                            <p className="text-[11px] text-slate-500 leading-relaxed">eGuy uses 256-bit encryption to protect your financial data. Your credentials are never stored on our servers.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
