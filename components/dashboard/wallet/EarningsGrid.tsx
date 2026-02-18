"use client";

import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

interface EarningsGridProps {
    directEarnings: number;
    networkEarnings: number;
    bonus: number;
    cashback: number;
    isLoading?: boolean;
}

export function EarningsGrid({ directEarnings, networkEarnings, bonus, cashback, isLoading }: EarningsGridProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const items = [
        { title: "Direct Referral", amount: directEarnings, icon: "group" },
        { title: "Network", amount: networkEarnings, icon: "hub" },
        { title: "Bonus", amount: bonus, icon: "featured_seasonal_and_gifts" },
        { title: "Cashback", amount: cashback, icon: "loyalty" },
    ];

    if (isLoading) {
        return (
            <section className="mt-8">
                <div className="flex items-center justify-between mb-4">
                    <Skeleton className="h-5 w-48 bg-slate-100 dark:bg-slate-800/60" />
                    <Skeleton className="h-4 w-20 bg-slate-100 dark:bg-slate-800/60" />
                </div>
                <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="min-w-[140px] bg-white dark:bg-card-dark p-4 rounded-xl border border-slate-200 dark:border-slate-800/30 flex-shrink-0 shadow-sm"
                        >
                            <Skeleton className="h-6 w-6 mb-3 bg-slate-100 dark:bg-slate-800/60" />
                            <Skeleton className="h-3 w-24 mb-2 bg-slate-100 dark:bg-slate-800/60" />
                            <Skeleton className="h-5 w-20 bg-slate-100 dark:bg-slate-800/60" />
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section className="mt-8">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Earnings Breakdown</h3>
                <span className="text-primary text-xs font-bold uppercase tracking-widest cursor-pointer">See Stats</span>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-4">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="min-w-[140px] bg-white dark:bg-card-dark p-4 rounded-xl border border-slate-200 dark:border-slate-800/30 flex-shrink-0 shadow-sm"
                    >
                        <span className="material-icons-round text-primary mb-2 text-2xl block">{item.icon}</span>
                        <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">{item.title}</p>
                        <p className="text-slate-900 dark:text-white font-bold text-lg">{formatCurrency(item.amount)}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
