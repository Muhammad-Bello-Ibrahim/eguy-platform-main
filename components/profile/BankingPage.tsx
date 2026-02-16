"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LinkedAccount } from '@/lib/database';
import { SelectBankModal } from './SelectBankModal';

export default function BankingPage() {
    const router = useRouter();
    const [accounts, setAccounts] = useState<LinkedAccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            const res = await fetch('/api/user/banking');
            const data = await res.json();
            if (data.linkedAccounts) {
                setAccounts(data.linkedAccounts);
            }
        } catch (error) {
            console.error("Failed to fetch accounts", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddAccount = async (bankName: string, accountNumber: string, accountName: string) => {
        try {
            const res = await fetch('/api/user/banking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bank: bankName,
                    accountNumber,
                    accountName
                })
            });

            const data = await res.json();

            if (res.ok) {
                await fetchAccounts();
                setIsModalOpen(false); // Close modal on success
            } else {
                alert(data.error || "Failed to add account");
            }
        } catch (error) {
            console.error("Error adding account", error);
            alert("An error occurred");
        }
    };

    const handleDelete = async (id: string, isPrimary: boolean) => {
        if (isPrimary) {
            alert("Cannot delete primary account. Please set another account as primary first.");
            return;
        }

        if (!confirm("Are you sure you want to remove this account?")) return;

        try {
            const res = await fetch(`/api/user/banking?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setAccounts(prev => prev.filter(a => a.id !== id));
            } else {
                alert("Failed to delete account");
            }
        } catch (error) {
            console.error("Error deleting account", error);
        }
    };

    const handleSetPrimary = async (id: string) => {
        try {
            // Optimistic update
            setAccounts(prev => prev.map(a => ({
                ...a,
                isPrimary: a.id === id
            })));

            const res = await fetch('/api/user/banking', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accountId: id, action: 'setPrimary' })
            });

            if (!res.ok) {
                // Revert on failure
                fetchAccounts();
                alert("Failed to set primary account");
            }
        } catch (error) {
            console.error("Error setting primary", error);
            fetchAccounts();
        }
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans min-h-screen pb-32">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 pt-14 pb-4 flex items-center justify-between border-b border-slate-200 dark:border-white/5">
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                >
                    <span className="material-icons-round text-slate-600 dark:text-slate-300">chevron_left</span>
                </button>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">Linked Accounts</h1>
                <div className="w-10" />
            </header>

            <main className="px-5 pt-6 pb-32 space-y-8">
                {/* Connected Banks */}
                <section>
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Connected Banks</h2>
                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">{accounts.length} ACCOUNTS</span>
                    </div>

                    {loading ? (
                        <div className="text-center py-10 text-slate-500 dark:text-slate-400">Loading accounts...</div>
                    ) : accounts.length === 0 ? (
                        <div className="text-center py-10 text-slate-500 dark:text-slate-400 bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5">
                            <p>No linked accounts found.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {accounts.map((account) => (
                                <div key={account.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-2xl p-5 relative overflow-hidden group">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${account.isPrimary ? 'bg-blue-50 dark:bg-blue-600/20' : 'bg-slate-100 dark:bg-slate-700/50'}`}>
                                                <span className={`material-icons-round text-3xl ${account.isPrimary ? 'text-blue-500 dark:text-blue-400' : 'text-slate-400 dark:text-slate-400'}`}>account_balance</span>
                                            </div>
                                            <div>
                                                <p className="font-bold text-base text-slate-900 dark:text-white">{account.bank}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-500 font-medium">{account.accountName}</p>
                                                <p className="text-xs text-slate-400 dark:text-slate-400 font-mono mt-0.5">••• {account.accountNumber.slice(-4)}</p>
                                            </div>
                                        </div>
                                        {account.isPrimary && (
                                            <div className="bg-blue-500/20 text-blue-400 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-tighter">Primary</div>
                                        )}
                                        {!account.isPrimary && (
                                            <button
                                                onClick={() => handleDelete(account.id, account.isPrimary)}
                                                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-500/20 text-slate-400 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <span className="material-icons-round text-lg">delete</span>
                                            </button>
                                        )}
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-slate-500 dark:text-slate-500 font-bold uppercase">{account.isPrimary ? 'Primary Payout' : 'Set as Primary'}</span>
                                            <span className={`text-xs font-medium ${account.isPrimary ? 'text-blue-500 dark:text-blue-400' : 'text-slate-400 dark:text-slate-400'}`}>
                                                {account.isPrimary ? 'Active for withdrawals' : 'Tap switch to activate'}
                                            </span>
                                        </div>
                                        <div
                                            onClick={() => !account.isPrimary && handleSetPrimary(account.id)}
                                            className={`relative inline-flex items-center cursor-pointer ${account.isPrimary ? '' : 'hover:opacity-80'}`}
                                        >
                                            <div className={`w-11 h-6 rounded-full transition-colors ${account.isPrimary ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-600'}`}></div>
                                            <div className={`absolute top-1 bg-white w-4 h-4 rounded-full shadow-sm transition-all ${account.isPrimary ? 'left-[22px]' : 'left-1'}`}></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Add New Button */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full py-6 rounded-2xl border-2 border-dashed border-primary/20 flex flex-col items-center justify-center gap-2 group hover:bg-primary/5 transition-all"
                >
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
                            <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Bank-level Security</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-500 leading-relaxed">eGuy uses 256-bit encryption to protect your financial data. Your credentials are never stored on our servers.</p>
                        </div>
                    </div>
                </div>
            </main>

            <SelectBankModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelect={handleAddAccount}
            />
        </div>
    );
}
