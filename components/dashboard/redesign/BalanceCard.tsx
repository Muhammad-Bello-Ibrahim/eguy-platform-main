"use client";

import React from 'react';

interface BalanceCardProps {
    balance: number;
    onWithdraw: () => void;
}

export function BalanceCard({ balance, onWithdraw }: BalanceCardProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2
        }).format(amount);
    };

    return (
        <section className="relative overflow-hidden bg-card-dark rounded-2xl p-6 shadow-2xl border border-slate-800/50 text-white">
            {/* Decorative Gradient Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[80px] rounded-full"></div>

            <div className="relative z-10 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-slate-400 text-sm font-medium mb-1">Total Balance</p>
                        <h2 className="text-3xl font-extrabold text-primary">{formatCurrency(balance)}</h2>

                        {/* Static trend for now, can be dynamic later */}
                        <div className="flex items-center gap-1 mt-1 text-emerald-400 text-xs font-bold">
                            <span className="material-icons-round text-sm">trending_up</span>
                            <span>+12.5% this month</span>
                        </div>
                    </div>

                    <button
                        onClick={onWithdraw}
                        className="bg-primary hover:bg-primary/90 text-background-dark font-bold px-5 py-2.5 rounded-full text-sm transition-all shadow-lg shadow-primary/20 active:scale-95"
                    >
                        Withdraw
                    </button>
                </div>

                {/* Simple Sparkline Visual */}
                <div className="mt-4 h-20 w-full relative flex items-end gap-1 px-1">
                    <div className="flex-1 bg-primary/10 rounded-t-sm h-[40%] transition-all duration-500 hover:bg-primary/20"></div>
                    <div className="flex-1 bg-primary/10 rounded-t-sm h-[55%] transition-all duration-500 hover:bg-primary/20"></div>
                    <div className="flex-1 bg-primary/20 rounded-t-sm h-[45%] transition-all duration-500 hover:bg-primary/30"></div>
                    <div className="flex-1 bg-primary/30 rounded-t-sm h-[70%] transition-all duration-500 hover:bg-primary/40"></div>
                    <div className="flex-1 bg-primary/40 rounded-t-sm h-[60%] transition-all duration-500 hover:bg-primary/50"></div>
                    <div className="flex-1 bg-primary/60 rounded-t-sm h-[85%] transition-all duration-500 hover:bg-primary/70"></div>
                    <div className="flex-1 bg-primary rounded-t-sm h-[100%] transition-all duration-500 hover:bg-primary/90"></div>
                </div>
            </div>
        </section>
    );
}
