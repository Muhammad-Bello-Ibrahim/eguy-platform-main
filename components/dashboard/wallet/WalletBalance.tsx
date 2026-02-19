"use client";

import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface WalletBalanceProps {
    balance: number;
    pendingBalance?: number;
    onWithdraw: () => void;
    isLoading?: boolean;
}

export function WalletBalance({ balance, pendingBalance = 0, onWithdraw, isLoading }: WalletBalanceProps) {
    const [showBalance, setShowBalance] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Load saved preference
        const saved = localStorage.getItem("showBalance");
        if (saved !== null) {
            setShowBalance(saved === "true");
        }
    }, []);

    const toggleBalance = () => {
        const newState = !showBalance;
        setShowBalance(newState);
        localStorage.setItem("showBalance", String(newState));
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    // Split balance for styling
    const formattedBalance = formatCurrency(balance);
    const [mainPart, decimalPart] = formattedBalance.split('.');

    if (isLoading) {
        return (
            <section className="mt-4">
                <div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800/50 p-6 rounded-2xl shadow-lg relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                        <Skeleton className="h-4 w-32 bg-slate-200 dark:bg-slate-800" />
                        <Skeleton className="h-5 w-5 rounded-full bg-slate-200 dark:bg-slate-800" />
                    </div>
                    
                    <Skeleton className="h-12 w-48 bg-slate-200 dark:bg-slate-800 mb-6" />
                    
                    <div className="flex items-center gap-4 py-3 border-y border-slate-200 dark:border-slate-800/40 mb-6">
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-3 w-20 bg-slate-200 dark:bg-slate-800" />
                            <Skeleton className="h-5 w-28 bg-slate-200 dark:bg-slate-800" />
                        </div>
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-3 w-20 bg-slate-200 dark:bg-slate-800" />
                            <Skeleton className="h-5 w-28 bg-slate-200 dark:bg-slate-800" />
                        </div>
                    </div>
                    
                    <div className="flex gap-3">
                        <Skeleton className="flex-1 h-12 rounded-xl bg-slate-200 dark:bg-slate-800" />
                        <Skeleton className="flex-1 h-12 rounded-xl bg-slate-200 dark:bg-slate-800" />
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="mt-4">
            <div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800/50 p-6 rounded-2xl shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full -mr-16 -mt-16 pointer-events-none"></div>

                <div className="flex items-center justify-between mb-1 relative z-10">
                    <p className="text-primary text-sm font-semibold uppercase tracking-widest">Available Balance</p>
                    <button onClick={toggleBalance} className="text-slate-400 hover:text-primary transition-colors">
                        {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                </div>

                <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4 relative z-10">
                    {mounted && !showBalance ? '₦ ****' : (
                        <>
                            {mainPart}
                            <span className="text-lg font-medium text-slate-400 dark:text-slate-400 ml-1">.{decimalPart}</span>
                        </>
                    )}
                </h2>

                <div className="flex items-center gap-4 py-3 border-y border-slate-200 dark:border-slate-800/40 mb-6 relative z-10">
                    <div className="flex-1">
                        <p className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold tracking-tighter">Withdrawable</p>
                        <p className="text-slate-900 dark:text-white text-sm font-semibold">
                            {mounted && !showBalance ? '₦ ****' : formatCurrency(balance)}
                        </p>
                    </div>
                    <div className="w-px h-8 bg-slate-200 dark:bg-slate-800/60"></div>
                    <div className="flex-1">
                        <p className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold tracking-tighter">Pending</p>
                        <p className="text-slate-900 dark:text-white text-sm font-semibold">
                            {mounted && !showBalance ? '₦ ****' : formatCurrency(pendingBalance)}
                        </p>
                    </div>
                </div>

                <div className="flex gap-3 relative z-10">
                    <button
                        onClick={onWithdraw}
                        className="flex-1 bg-primary hover:bg-primary/90 text-background-dark h-12 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-primary/20"
                    >
                        <span className="material-icons-round text-xl">payments</span>
                        Withdraw
                    </button>
                    <button
                        onClick={() => { }}
                        className="flex-1 bg-white dark:bg-card-dark text-slate-900 dark:text-slate-200 h-12 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all border border-slate-200 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >
                        <span className="material-icons-round text-xl">add_circle</span>
                        Add Funds
                    </button>
                </div>
            </div>
        </section>
    );
}
