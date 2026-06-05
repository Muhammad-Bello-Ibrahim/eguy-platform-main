"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, ShieldCheck } from 'lucide-react';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"

export default function ChangePinPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [newPin, setNewPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (newPin.length !== 4) {
            toast({ title: 'Error', description: 'New PIN must be 4 digits', variant: 'destructive' });
            return;
        }

        if (newPin !== confirmPin) {
            toast({ title: 'Error', description: 'New PIN and Confirm PIN do not match', variant: 'destructive' });
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/change-pin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newPin }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast({ title: 'Error', description: data.error || 'Failed to change PIN', variant: 'destructive' });
            } else {
                toast({ title: 'Success', description: 'Transaction PIN changed successfully' });
                router.push('/profile');
            }
        } catch (error) {
            toast({ title: 'Error', description: 'An unexpected error occurred', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-900 min-h-screen text-slate-900 dark:text-slate-100 pb-24">
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 pt-14 pb-4 flex items-center gap-4 border-b border-slate-200 dark:border-white/5">
                <button
                    onClick={() => router.back()}
                    className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                </button>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">Change PIN</h1>
            </header>

            <main className="px-5 mt-6">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-white/5">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">Secure Your Wallet</h2>
                            <p className="text-sm text-slate-500">Your 4-digit PIN is used to authorize all transactions.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8 flex flex-col items-center">
                        <div className="space-y-4 w-full flex flex-col items-center">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 text-center">New PIN</label>
                            <InputOTP
                                maxLength={4}
                                value={newPin}
                                onChange={setNewPin}
                            >
                                <InputOTPGroup className="gap-3">
                                    <InputOTPSlot index={0} className="w-14 h-14 text-2xl font-bold rounded-xl border-slate-200 dark:border-white/10 dark:bg-slate-900/60" />
                                    <InputOTPSlot index={1} className="w-14 h-14 text-2xl font-bold rounded-xl border-slate-200 dark:border-white/10 dark:bg-slate-900/60" />
                                    <InputOTPSlot index={2} className="w-14 h-14 text-2xl font-bold rounded-xl border-slate-200 dark:border-white/10 dark:bg-slate-900/60" />
                                    <InputOTPSlot index={3} className="w-14 h-14 text-2xl font-bold rounded-xl border-slate-200 dark:border-white/10 dark:bg-slate-900/60" />
                                </InputOTPGroup>
                            </InputOTP>
                        </div>

                        <div className="space-y-4 w-full flex flex-col items-center pt-6 border-t border-slate-100 dark:border-white/5">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 text-center">Confirm New PIN</label>
                            <InputOTP
                                maxLength={4}
                                value={confirmPin}
                                onChange={setConfirmPin}
                            >
                                <InputOTPGroup className="gap-3">
                                    <InputOTPSlot index={0} className="w-14 h-14 text-2xl font-bold rounded-xl border-slate-200 dark:border-white/10 dark:bg-slate-900/60" />
                                    <InputOTPSlot index={1} className="w-14 h-14 text-2xl font-bold rounded-xl border-slate-200 dark:border-white/10 dark:bg-slate-900/60" />
                                    <InputOTPSlot index={2} className="w-14 h-14 text-2xl font-bold rounded-xl border-slate-200 dark:border-white/10 dark:bg-slate-900/60" />
                                    <InputOTPSlot index={3} className="w-14 h-14 text-2xl font-bold rounded-xl border-slate-200 dark:border-white/10 dark:bg-slate-900/60" />
                                </InputOTPGroup>
                            </InputOTP>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || newPin.length !== 4 || confirmPin.length !== 4}
                            className="w-full bg-primary hover:bg-primary/90 text-slate-900 dark:text-background-dark rounded-2xl font-black py-4 mt-6 shadow-lg shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <><Loader2 className="w-5 h-5 animate-spin" /> Updating...</>
                            ) : (
                                'Update PIN'
                            )}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
