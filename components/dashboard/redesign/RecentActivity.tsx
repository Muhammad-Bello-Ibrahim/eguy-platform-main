"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

interface Transaction {
    id: string;
    type: "deposit" | "withdrawal" | "transfer" | "payment" | "referral_bonus" | "airtime" | "data" | "electricity" | "cable";
    amount: number;
    description: string;
    status: "pending" | "completed" | "failed" | "cancelled";
    createdAt: string;
    reference?: string;
    category?: string;
}

interface RecentActivityProps {
    transactions: Transaction[];
    isLoading: boolean;
}

export function RecentActivity({ transactions, isLoading }: RecentActivityProps) {
    const router = useRouter();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-NG", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'deposit': return 'add_circle';
            case 'withdrawal': return 'remove_circle';
            case 'airtime': return 'phone_android';
            case 'data': return 'wifi';
            case 'electricity': return 'bolt';
            case 'cable': return 'live_tv';
            case 'referral_bonus': return 'wallet';
            default: return 'payments';
        }
    };

    const isPositive = (type: string) => {
        return type === 'deposit' || type === 'referral_bonus';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            case 'pending': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
            case 'failed': return 'text-red-400 bg-red-500/10 border-red-500/20';
            default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
        }
    };

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Recent Activity</h3>
                <button
                    onClick={() => router.push('/transactions')}
                    className="text-primary text-xs font-bold hover:underline"
                >
                    View All
                </button>
            </div>

            <div className="space-y-3">
                {isLoading ? (
                    // Skeleton loading
                    [...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800/30 animate-pulse">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                                <div className="space-y-2">
                                    <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
                                    <div className="h-3 w-32 bg-slate-200 dark:bg-slate-800 rounded"></div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : transactions.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-sm bg-white dark:bg-card-dark rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                        No recent activity found.
                    </div>
                ) : (
                    transactions.slice(0, 5).map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between p-4 bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800/30 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-neutral-dark flex items-center justify-center text-primary border border-slate-100 dark:border-slate-800">
                                    <span className="material-icons-round">{getIcon(tx.type)}</span>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white capitalize">
                                        {tx.description || tx.type.replace('_', ' ')}
                                    </h4>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                        {formatDate(tx.createdAt)}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`text-sm font-bold ${isPositive(tx.type) ? 'text-primary' : 'text-slate-700 dark:text-slate-200'}`}>
                                    {isPositive(tx.type) ? '+' : '-'}{formatCurrency(tx.amount)}
                                </p>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold capitalize ${getStatusColor(tx.status)}`}>
                                    {tx.status}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}
