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
            <section className="mt-10">
                <div className="flex items-center justify-between mb-4">
                    <Skeleton className="h-6 w-48 bg-slate-200 dark:bg-slate-800" />
                    <Skeleton className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-800" />
                </div>
                
                <div className="flex gap-2 p-1 bg-slate-100 dark:bg-neutral-dark rounded-xl mb-6">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="flex-1 h-10 rounded-lg bg-slate-200 dark:bg-slate-800" />
                    ))}
                </div>
                
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-card-dark rounded-2xl border border-slate-200 dark:border-slate-800/30">
                            <div className="flex items-center gap-4 flex-1">
                                <Skeleton className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-800" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-32 bg-slate-200 dark:bg-slate-800" />
                                    <Skeleton className="h-3 w-48 bg-slate-200 dark:bg-slate-800" />
                                </div>
                            </div>
                            <div className="text-right space-y-2">
                                <Skeleton className="h-5 w-20 ml-auto bg-slate-200 dark:bg-slate-800" />
                                <Skeleton className="h-4 w-16 ml-auto bg-slate-200 dark:bg-slate-800" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
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
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Transaction History</h3>
                <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-card-dark text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors shadow-sm">
                    <span className="material-icons-round text-xl">tune</span>
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-slate-100 dark:bg-neutral-dark rounded-xl mb-6">
                <button className="flex-1 py-2 text-sm font-bold rounded-lg bg-primary text-background-dark transition-all hover:shadow-lg shadow-primary/20">All</button>
                <button className="flex-1 py-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Credits</button>
                <button className="flex-1 py-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Debits</button>
            </div>

            <div className="space-y-3">
                {transactions.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
                            <span className="material-icons-round text-slate-300 dark:text-slate-600 text-2xl">history</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">No recent transactions</p>
                    </div>
                ) : (
                    transactions.slice(0, 5).map((tx) => (
                        <div
                            key={tx.id}
                            className="flex items-center justify-between p-4 bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800/30 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700/50 transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${
                                    ['deposit', 'referral_bonus'].includes(tx.type) 
                                        ? 'bg-primary/15 border-primary/30 text-primary' 
                                        : 'bg-rose-500/15 border-rose-500/30 text-rose-500'
                                }`}>
                                    <span className="material-icons-round text-xl">
                                        {getIconName(tx.type)}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-slate-900 dark:text-white truncate">{tx.description}</p>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-tighter">
                                        ID: {getShortId(tx.id)} • {format(new Date(tx.createdAt), 'MMM d')}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right flex-shrink-0 ml-4">
                                <p className={`font-extrabold text-base ${['deposit', 'referral_bonus'].includes(tx.type) ? 'text-primary' : 'text-slate-900 dark:text-slate-100'}`}>
                                    {['deposit', 'referral_bonus'].includes(tx.type) ? '+' : '-'}{formatCurrency(tx.amount)}
                                </p>
                                <p className={`text-[10px] font-bold px-2 py-0.5 rounded inline-block uppercase mt-1 border ${
                                    tx.status === 'completed' ? 'text-emerald-600 bg-emerald-500/10 border-emerald-500/30' :
                                    tx.status === 'pending' ? 'text-amber-600 dark:text-amber-500 bg-amber-500/10 border-amber-500/30' :
                                    'text-slate-500 dark:text-slate-400 bg-slate-500/10 border-slate-500/20'
                                }`}>
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
