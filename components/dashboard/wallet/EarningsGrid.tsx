"use client";

import React from 'react';

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

    if (isLoading) return null; // Or skeleton

    return (
        <section className="mt-8">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Earnings Breakdown</h3>
                <span className="text-[#47f0d1] text-xs font-bold uppercase tracking-widest cursor-pointer">See Stats</span>
            </div>
            <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-4 px-4 pb-4">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="min-w-[140px] bg-[#162e29] p-4 rounded-xl border border-white/5 flex-shrink-0"
                    >
                        <span className="material-icons-round text-[#47f0d1] mb-2 text-2xl block">{item.icon}</span>
                        <p className="text-white/50 text-xs font-medium mb-1">{item.title}</p>
                        <p className="text-white font-bold text-lg">{formatCurrency(item.amount)}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
