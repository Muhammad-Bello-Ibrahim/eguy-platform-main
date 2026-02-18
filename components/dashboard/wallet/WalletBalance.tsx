"use client";

import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

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

    return (
        <section className="mt-4">
            <div className="bg-[linear-gradient(135deg,#1c3a34_0%,#10221e_100%)] border border-white/5 p-6 rounded-2xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#47f0d1]/10 blur-[60px] rounded-full -mr-16 -mt-16 pointer-events-none"></div>

                <div className="flex items-center justify-between mb-1">
                    <p className="text-[#47f0d1]/70 text-sm font-semibold uppercase tracking-widest">Available Balance</p>
                    <button onClick={toggleBalance} className="text-white/20 hover:text-white transition-colors">
                        {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                </div>

                <h2 className="text-4xl font-extrabold text-white mb-4">
                    {mounted && !showBalance ? '₦ ****' : (
                        <>
                            {mainPart}
                            <span className="text-lg font-medium text-white/50 ml-1">.{decimalPart}</span>
                        </>
                    )}
                </h2>

                <div className="flex items-center gap-4 py-3 border-y border-white/5 mb-6">
                    <div className="flex-1">
                        <p className="text-white/40 text-xs uppercase font-bold tracking-tighter">Withdrawable</p>
                        <p className="text-white text-sm font-semibold">
                            {mounted && !showBalance ? '₦ ****' : formatCurrency(balance)}
                        </p>
                    </div>
                    <div className="w-px h-8 bg-white/10"></div>
                    <div className="flex-1">
                        <p className="text-white/40 text-xs uppercase font-bold tracking-tighter">Pending</p>
                        <p className="text-white text-sm font-semibold">
                            {mounted && !showBalance ? '₦ ****' : formatCurrency(pendingBalance)}
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onWithdraw}
                        className="flex-1 bg-[#47f0d1] text-[#10221e] h-12 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
                    >
                        <span className="material-icons-round text-xl">payments</span>
                        Withdraw
                    </button>
                    <button
                        onClick={() => { }}
                        className="flex-1 bg-white/10 text-white h-12 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform border border-white/10"
                    >
                        <span className="material-icons-round text-xl">add_circle</span>
                        Add Funds
                    </button>
                </div>
            </div>
        </section>
    );
}
