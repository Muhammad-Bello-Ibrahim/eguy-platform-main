"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const PaymentConfirmationContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const type = searchParams.get('type'); // airtime, data, cable
    const amount = searchParams.get('amount');
    const recipient = searchParams.get('recipient') || searchParams.get('phone');
    const provider = searchParams.get('provider') || searchParams.get('network');
    const bundleName = searchParams.get('bundleName');

    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [pin, setPin] = useState('');

    // Validate params
    const isValid = type && amount && recipient && provider;

    const handleConfirm = async () => {
        if (!isValid || isLoading) return;
        setIsLoading(true);
        setMessage('');

        try {
            let endpoint = '';
            let body = {};

             if (type === 'airtime') {
                endpoint = '/api/payments/airtime';
                body = { network: provider, phone: recipient, amount: amount, pin };
            } else if (type === 'data') {
                endpoint = '/api/payments/data';
                const planCode = searchParams.get('plan');
                body = { network: provider, phone: recipient, plan: planCode, amount: amount, pin };
            } else if (type === 'cable') {
                endpoint = '/api/payments/bills';
                // Pass dynamic data from frontend 
                const customerName = searchParams.get('customerName');
                const billsCode = searchParams.get('plan'); // Actual package ID needed by API

                body = {
                    serviceType: billsCode, // The bills_code from SubAndGain (e.g., 'gotv-jinja')
                    provider: provider,     // The service name (e.g., 'gotv')
                    recipient: recipient,   // Smartcard number
                    amount: Number(amount),
                    customerInfo: customerName || 'Customer',
                    pin
                };
            } else if (type === 'electricity') {
                endpoint = '/api/payments/electricity';
                const meterType = searchParams.get('meterType');

                body = {
                    disco: provider,        // The service ID (e.g., 'AEDC')
                    meterType: meterType,   // 'PRE' or 'POST'
                    meterNumber: recipient, // Meter number
                    amount: Number(amount),
                    pin
                };
            }

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Transaction failed');
            }

            setStatus('success');
            setMessage('Transaction Successful!');

            // Redirect after delay
            setTimeout(() => {
                router.push('/dashboard');
            }, 3000);

        } catch (error: any) {
            setStatus('error');
            setMessage(error.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    if (status === 'success') {
        return (
            <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex items-center justify-center font-[Manrope]">
                <div className="text-center p-8">
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
                    <p className="text-slate-500 mb-8">Your transaction has been processed.</p>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="bg-primary text-background-dark font-bold py-3 px-8 rounded-xl"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex items-center justify-center font-[Manrope]">
            {/* Background/Backdrop */}
            <div className="fixed inset-0 w-full h-full bg-[#10221ecc] backdrop-blur-[24px]"></div>

            {/* Modal Content */}
            <div className="w-full max-w-md mx-auto rounded-t-xl sm:rounded-xl border-t sm:border border-white/10 shadow-2xl relative overflow-hidden bg-[#10221ecc] z-10">

                <div className="px-6 py-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-white text-lg font-bold tracking-tight mb-2">
                            Confirm Transaction
                        </h2>
                        <p className="text-primary/70 text-sm font-medium uppercase tracking-wider">
                            {type === 'airtime' ? 'Airtime Top-up' : type === 'data' ? 'Data Bundle' : type === 'electricity' ? 'Electricity Bill' : 'Cable Subscription'}
                        </p>
                    </div>

                    {/* Main Icon & Provider */}
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4 ring-1 ring-primary/30">
                            <span className="material-icons-round text-primary text-4xl">
                                {type === 'airtime' ? 'smartphone' : type === 'data' ? 'wifi' : type === 'electricity' ? 'bolt' : 'tv'}
                            </span>
                        </div>
                        <h3 className="text-white text-xl font-bold uppercase">{provider}</h3>
                        {bundleName && <p className="text-white/60 text-sm mt-1">{bundleName}</p>}
                    </div>

                    {/* Transaction Details */}
                    <div className="bg-white/5 rounded-xl p-5 mb-8 border border-white/5">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-white/50 text-sm">Recipient</span>
                                <span className="text-white font-medium text-sm">{recipient}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-white/50 text-sm">Service Fee</span>
                                <span className="text-white font-medium text-sm">₦0.00</span>
                            </div>
                            <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                                <span className="text-white font-bold">Total Amount</span>
                                <span className="text-primary text-2xl font-extrabold tracking-tight">
                                    ₦{Number(amount).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {status === 'error' && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                            <p className="text-red-500 text-sm font-medium">{message}</p>
                        </div>
                    )}

                    {/* Authorization Section */}
                    {!isLoading && status !== 'error' && (
                        <div className="mb-10">
                            <p className="text-center text-white/60 text-xs uppercase tracking-widest font-bold mb-4">
                                Enter 4-Digit Transaction PIN
                            </p>
                            <div className="flex justify-center py-2">
                                <InputOTP
                                    maxLength={4}
                                    value={pin}
                                    onChange={(value) => setPin(value)}
                                >
                                    <InputOTPGroup className="gap-3">
                                        {[0, 1, 2, 3].map((i) => (
                                            <InputOTPSlot
                                                key={i}
                                                index={i}
                                                className="w-12 h-12 text-xl font-bold border-2 border-white/10 rounded-xl bg-white/5 text-white data-[active=true]:border-primary data-[active=true]:ring-primary/20 transition-all text-center"
                                            />
                                        ))}
                                    </InputOTPGroup>
                                </InputOTP>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="space-y-4">
                        <button
                            onClick={handleConfirm}
                            disabled={!isValid || isLoading || pin.length !== 4}
                            className="w-full bg-primary hover:bg-primary/90 text-background-dark font-extrabold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : (
                                <>
                                    <span>Confirm Payment</span>
                                    <span className="material-icons-round text-xl">arrow_forward</span>
                                </>
                            )}
                        </button>

                        <button
                            onClick={() => router.back()}
                            className="w-full pt-4 text-white/40 text-sm font-medium hover:text-white/60 transition-colors cursor-pointer"
                        >
                            Cancel &amp; Return
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

const PaymentConfirmationPage = () => {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#10221e] text-primary"><Loader2 className="animate-spin w-10 h-10" /></div>}>
            <PaymentConfirmationContent />
        </Suspense>
    )
}

export default PaymentConfirmationPage;
