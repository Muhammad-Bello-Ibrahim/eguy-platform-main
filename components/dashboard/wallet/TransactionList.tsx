"use client";

import React from 'react';
import { format } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";

interface Transaction {
    id: string;
    type: "deposit" | "withdrawal" | "transfer" | "payment" | "referral_bonus" | "airtime" | "data" | "electricity" | "cable";
    amount: number;
    description: string;
    status: "pending" | "completed" | "failed" | "cancelled";
    createdAt: string;
}

interface TransactionListProps {
    transactions: Transaction[];
    isLoading?: boolean;
}

export function TransactionList({ transactions, isLoading }: TransactionListProps) {
    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full rounded-2xl bg-white/5" />
                ))}
            </div>
        );
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const getShortId = (id: string) => {
        if (!id) return 'UNKNOWN';
        return `EG-${id.slice(-6).toUpperCase()}`;
    };

    const getIconName = (type: string) => {
        switch (type) {
            case 'deposit': return 'arrow_downward';
            case 'withdrawal': return 'arrow_upward';
            case 'referral_bonus': return 'redeem';
            case 'payment': return 'payments';
            case 'airtime': return 'smartphone';
            case 'data': return 'wifi';
            case 'electricity': return 'bolt';
            case 'cable': return 'tv';
            default: return 'pending'; // Default 
        }
    };

    return (
        <section className="mt-10">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Transaction History</h3>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1c3a34] text-[#47f0d1]">
                    <span className="material-icons-round text-xl">tune</span>
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-[#162e29] rounded-xl mb-6">
                <button className="flex-1 py-2 text-sm font-bold rounded-lg bg-[#47f0d1] text-[#10221e]">All</button>
                <button className="flex-1 py-2 text-sm font-bold text-white/60">Credits</button>
                <button className="flex-1 py-2 text-sm font-bold text-white/60">Debits</button>
            </div>

            <div className="space-y-4">
                {transactions.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">No recent transactions</div>
                ) : (
                    transactions.slice(0, 5).map((tx) => (
                        <div
                            key={tx.id}
                            className="flex items-center justify-between p-4 bg-[#162e29] rounded-2xl border border-white/5"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full ${['deposit', 'referral_bonus'].includes(tx.type) ? 'bg-[#47f0d1]/10' : 'bg-rose-500/10'} flex items-center justify-center`}>
                                    <span className={`material-icons-round text-2xl ${['deposit', 'referral_bonus'].includes(tx.type) ? 'text-[#47f0d1]' : 'text-rose-500'}`}>
                                        {getIconName(tx.type)}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-bold text-white">{tx.description}</p>
                                    <p className="text-white/40 text-xs uppercase tracking-tighter">
                                        ID: {getShortId(tx.id)} • {format(new Date(tx.createdAt), 'MMM d')}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`font-extrabold ${['deposit', 'referral_bonus'].includes(tx.type) ? 'text-[#47f0d1]' : 'text-white'}`}>
                                    {['deposit', 'referral_bonus'].includes(tx.type) ? '+' : '-'}{formatCurrency(tx.amount)}
                                </p>
                                <p className={`text-[10px] font-bold px-2 py-0.5 rounded inline-block uppercase mt-1
                                    ${tx.status === 'completed' ? 'bg-[#47f0d1]/10 text-[#47f0d1]/50' :
                                        tx.status === 'pending' ? 'bg-amber-500/10 text-amber-500/50' :
                                            'bg-white/5 text-white/30'}`}
                                >
                                    {tx.status}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}
