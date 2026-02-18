"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, ChevronRight, Building2, Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Bank {
    id: number;
    name: string;
    slug: string;
    code: string;
    longcode: string;
    gateway: string | null;
    pay_with_bank: boolean;
    active: boolean;
    is_deleted: boolean;
    country: string;
    currency: string;
    type: string;
    createdAt: string;
    updatedAt: string;
}

interface SelectBankModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (bankName: string, accountNumber: string, accountName: string, bankCode: string) => Promise<void>;
}

const POPULAR_BANKS_UI = [
    { name: "Access Bank", color: "bg-orange-100", iconColor: "text-orange-600" },
    { name: "Guaranty Trust Bank", color: "bg-red-100", iconColor: "text-red-600", shortName: "GTBank" },
    { name: "Zenith Bank", color: "bg-gray-100", iconColor: "text-gray-600" },
    { name: "United Bank for Africa", color: "bg-red-50", iconColor: "text-red-800", shortName: "UBA" },
    { name: "First Bank of Nigeria", color: "bg-blue-100", iconColor: "text-blue-800", shortName: "First Bank" },
    { name: "OPay Digital Services Limited (OPay)", color: "bg-green-100", iconColor: "text-green-600", shortName: "Opay" },
    { name: "PalmPay", color: "bg-purple-100", iconColor: "text-purple-600" },
    { name: "Kuda Bank", color: "bg-indigo-100", iconColor: "text-indigo-600", shortName: "Kuda" },
];

export function SelectBankModal({ isOpen, onClose, onSelect }: SelectBankModalProps) {
    const { toast } = useToast();
    const [step, setStep] = useState<'select' | 'details'>('select');
    const [banks, setBanks] = useState<Bank[]>([]);
    const [loadingBanks, setLoadingBanks] = useState(true);
    const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Form State
    const [accountNumber, setAccountNumber] = useState('');
    const [accountName, setAccountName] = useState('');
    const [resolvingName, setResolvingName] = useState(false);
    const [resolveError, setResolveError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen && banks.length === 0) {
            fetchBanks();
        }
    }, [isOpen]);

    const fetchBanks = async () => {
        setLoadingBanks(true);
        try {
            const res = await fetch('/api/paystack-banks');
            const data = await res.json();
            if (data.banks) {
                setBanks(data.banks);
            }
        } catch (error) {
            console.error("Failed to fetch banks", error);
            toast({
                title: "Error",
                description: "Failed to load bank list. Please check your connection.",
                variant: "destructive",
            });
        } finally {
            setLoadingBanks(false);
        }
    };

    const filteredBanks = banks.filter(bank =>
        bank.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleBankSelect = (bank: Bank) => {
        setSelectedBank(bank);
        setStep('details');
        setAccountNumber('');
        setAccountName('');
        setResolveError('');
    };

    const handlePopularBankSelect = (name: string) => {
        // Find the bank in the full list
        // Note: We try to match by name or by contains for broader matching if names differ slightly
        const bank = banks.find(b => b.name === name || b.name.includes(name));
        if (bank) {
            handleBankSelect(bank);
        } else {
            // Fallback search in the Search view
            setSearchQuery(name);
        }
    };

    // Account Resolution Effect
    useEffect(() => {
        const resolveAccount = async () => {
            if (accountNumber.length === 10 && selectedBank) {
                setResolvingName(true);
                setResolveError('');
                setAccountName(''); // Clear previous name
                try {
                    const res = await fetch('/api/resolve-account', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            account_number: accountNumber,
                            bank_code: selectedBank.code
                        })
                    });
                    const data = await res.json();
                    if (data.account_name) {
                        setAccountName(data.account_name);
                    } else {
                        setResolveError(data.error || "Could not resolve account name");
                    }
                } catch (error) {
                    console.error(error);
                    setResolveError("Failed to resolve account. Please check details.");
                } finally {
                    setResolvingName(false);
                }
            } else {
                setAccountName('');
                setResolveError('');
            }
        };

        const timeoutId = setTimeout(() => {
            if (accountNumber.length === 10) resolveAccount();
        }, 500); // Debounce slightly to avoid rapid calls if user types fast (though 10 digits is exact)

        return () => clearTimeout(timeoutId);
    }, [accountNumber, selectedBank]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!accountName || resolveError) return;

        setSubmitting(true);
        try {
            await onSelect(selectedBank!.name, accountNumber, accountName, selectedBank!.code);
            onClose();
            // Reset state
            setTimeout(() => {
                setStep('select');
                setSelectedBank(null);
                setAccountNumber('');
                setAccountName('');
            }, 300);
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-white border border-slate-100 text-slate-900 rounded-3xl p-0 overflow-hidden shadow-2xl h-[80vh] flex flex-col">
                {step === 'select' ? (
                    <>
                        {/* Header */}
                        <div className="bg-slate-50 p-6 border-b border-slate-100">
                            <DialogTitle className="text-xl font-bold text-slate-900 mb-2">Select Your Bank</DialogTitle>
                            <DialogDescription className="text-sm text-slate-500">
                                Choose your institution to securely link your account.
                            </DialogDescription>

                            {/* Search */}
                            <div className="mt-4 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <Input
                                    className="bg-white border-slate-200 pl-10 h-10 rounded-xl focus:ring-primary/20 focus:border-primary"
                                    placeholder="Search for your bank..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                            {loadingBanks ? (
                                <div className="flex flex-col items-center justify-center py-10 text-slate-400 gap-2">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                    <p className="text-xs">Loading banks...</p>
                                </div>
                            ) : (
                                <>
                                    {/* Popular Banks */}
                                    {!searchQuery && (
                                        <div className="mb-8">
                                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Popular Banks</h3>
                                            <div className="grid grid-cols-4 gap-4">
                                                {POPULAR_BANKS_UI.map((bank) => (
                                                    <button
                                                        key={bank.name}
                                                        onClick={() => handlePopularBankSelect(bank.name)}
                                                        className="flex flex-col items-center gap-2 group"
                                                    >
                                                        <div className={`w-12 h-12 rounded-xl ${bank.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                                                            <Building2 className={`w-6 h-6 ${bank.iconColor}`} />
                                                        </div>
                                                        <span className="text-[10px] font-medium text-slate-600 text-center leading-tight">{bank.shortName || bank.name}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* All Banks List */}
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                                            {searchQuery ? 'Search Results' : 'All Banks'}
                                        </h3>
                                        <div className="space-y-1">
                                            {filteredBanks.map((bank) => (
                                                <button
                                                    key={bank.id}
                                                    onClick={() => handleBankSelect(bank)}
                                                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                                            <Building2 className="w-4 h-4" />
                                                        </div>
                                                        <span className="text-sm font-medium text-slate-900 line-clamp-1">{bank.name}</span>
                                                    </div>
                                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                                                </button>
                                            ))}
                                            {filteredBanks.length === 0 && (
                                                <div className="text-center py-8 text-slate-400 text-sm">
                                                    No banks found matching "{searchQuery}"
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col h-full">
                        {/* Detail Header */}
                        <div className="bg-slate-50 p-6 border-b border-slate-100 flex items-center gap-2">
                            <button
                                onClick={() => setStep('select')}
                                className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center hover:bg-slate-300 transition-colors"
                            >
                                <span className="material-icons-round text-slate-600 text-sm">arrow_back</span>
                            </button>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Enter Account Details</h3>
                                <p className="text-xs text-slate-500">Link your {selectedBank?.name} account</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 p-6 flex flex-col">
                            <div className="space-y-4 flex-1">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">Account Number</label>
                                    <div className="relative">
                                        <Input
                                            type="tel"
                                            maxLength={10}
                                            required
                                            className={`bg-slate-50 border-slate-200 h-10 text-sm pr-10 ${resolveError ? 'border-red-300 focus:border-red-500' : ''}`}
                                            placeholder="1234567890"
                                            value={accountNumber}
                                            onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                                        />
                                        {resolvingName && (
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                            </div>
                                        )}
                                    </div>
                                    {resolveError && (
                                        <div className="flex items-center gap-1 mt-1.5 text-red-500">
                                            <AlertCircle className="w-3 h-3" />
                                            <p className="text-[10px] font-medium">{resolveError}</p>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">Account Name</label>
                                    <Input
                                        type="text"
                                        required
                                        readOnly
                                        className="bg-slate-100 border-slate-200 h-10 text-sm text-slate-600 cursor-not-allowed"
                                        placeholder="Account Name will appear here"
                                        value={accountName}
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1.5">Matches automatically with bank records.</p>
                                </div>
                                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3">
                                    <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                    <p className="text-xs text-blue-800 leading-relaxed">
                                        Your connection to {selectedBank?.name} is encrypted and secure. We do not store your online banking credentials.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting || accountNumber.length < 10 || !accountName || loadingBanks}
                                className="w-full py-4 bg-primary text-slate-900 font-bold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                {submitting ? 'Linking...' : 'Link Account'}
                            </button>
                        </form>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
