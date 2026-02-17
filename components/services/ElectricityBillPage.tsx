"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import { ElectricitySkeleton } from './skeletons';

const ElectricityBillPage = () => {
    const router = useRouter();
    const [disco, setDisco] = useState("");
    const [meterType, setMeterType] = useState('PRE'); // PRE or POST
    const [meterNumber, setMeterNumber] = useState("");
    const [amount, setAmount] = useState("");

    const [isValidating, setIsValidating] = useState(false);
    const [customerName, setCustomerName] = useState<string | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const [loading, setLoading] = useState(true);

    // Simulate initial load (for consistency with other pages)
    React.useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <ElectricitySkeleton />;
    }

    const discos = [
        { id: 'AEDC', name: 'Abuja Electric (AEDC)' },
        { id: 'EKEDC', name: 'Eko Electric (EKEDC)' },
        { id: 'KEDCO', name: 'Kano Electric (KEDCO)' },
        { id: 'PHED', name: 'Port Harcourt (PHED)' },
        { id: 'JED', name: 'Jos Electric (JED)' },
        { id: 'IBEDC', name: 'Ibadan Electric (IBEDC)' },
        { id: 'IKEDC', name: 'Ikeja Electric (IKEDC)' },
        { id: 'EEDC', name: 'Enugu Electric (EEDC)' },
        { id: 'BEDC', name: 'Benin Electric (BEDC)' },
        { id: 'YEDC', name: 'Yola Electric (YEDC)' },
    ];

    const handleMeterBlur = async () => {
        if (!disco || !meterNumber || meterNumber.length < 8) return;

        setIsValidating(true);
        setCustomerName(null);
        setValidationError(null);

        try {
            const res = await fetch('/api/services/electricity/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    disco,
                    meterNumber,
                    meterType
                })
            });

            const data = await res.json();

            if (!res.ok || data.error) {
                setValidationError(data.error || "Invalid Meter Number");
            } else {
                setCustomerName(data.customerName || "Verified Customer");
            }
        } catch (error) {
            setValidationError("Validation failed. Please check internet connection.");
        } finally {
            setIsValidating(false);
        }
    };

    const handleDiscoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setDisco(e.target.value);
        setCustomerName(null);
        setValidationError(null);
        // Re-validate if meter is already entered
        if (meterNumber.length >= 8) {
            // Triggered automatically by user action flow usually, but we clear valid state to force re-check
        }
    };

    const handleSubmit = () => {
        if (!meterNumber || !disco || !amount || !customerName) return;
        setProcessing(true);

        const queryParams = new URLSearchParams({
            type: 'electricity',
            provider: disco,
            recipient: meterNumber,
            amount: amount,
            meterType: meterType,
            customerName: customerName || ''
        });

        router.push(`/payment/confirmation?${queryParams.toString()}`);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-[Manrope] min-h-screen flex justify-center">
            <div className="w-full max-w-[430px] min-h-screen bg-background-dark relative overflow-hidden flex flex-col">
                {/* Header */}
                <header className="px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 bg-background-dark/80 backdrop-blur-md z-10">
                    <button onClick={() => router.back()} className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-white cursor-pointer hover:bg-white/10 transition-colors">
                        <span className="material-icons-round">arrow_back_ios_new</span>
                    </button>
                    <h1 className="text-xl font-bold tracking-tight text-white">Electricity</h1>
                    <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-white">
                        <span className="material-icons-round">history</span>
                    </button>
                </header>

                <main className="flex-1 px-6 pb-32 overflow-y-auto no-scrollbar">
                    {/* Form Fields */}
                    <div className="space-y-6">

                        {/* Disco Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-400 ml-1">
                                Distribution Company
                            </label>
                            <select
                                value={disco}
                                onChange={handleDiscoChange}
                                className="w-full bg-slate-800/50 border border-white/10 rounded-lg py-4 px-5 text-white focus:ring-primary focus:border-primary transition-all appearance-none outline-none"
                            >
                                <option value="" disabled>Select Provider</option>
                                {discos.map(d => (
                                    <option key={d.id} value={d.id} className="bg-slate-900">{d.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Meter Type */}
                        <div className="bg-slate-800/30 p-1 rounded-lg flex border border-white/5">
                            <button
                                onClick={() => { setMeterType('PRE'); setCustomerName(null); }}
                                className={`flex-1 py-3 text-sm font-bold rounded-md transition-all ${meterType === 'PRE' ? 'bg-primary text-background-dark shadow-md' : 'text-slate-400 hover:text-white'}`}
                            >
                                PREPAID
                            </button>
                            <button
                                onClick={() => { setMeterType('POST'); setCustomerName(null); }}
                                className={`flex-1 py-3 text-sm font-bold rounded-md transition-all ${meterType === 'POST' ? 'bg-primary text-background-dark shadow-md' : 'text-slate-400 hover:text-white'}`}
                            >
                                POSTPAID
                            </button>
                        </div>

                        {/* Meter Number */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-400 ml-1">
                                Meter Number
                            </label>
                            <div className="relative group">
                                <input
                                    className={`w-full bg-slate-800/50 border rounded-lg py-4 px-5 text-white placeholder:text-slate-600 focus:ring-primary focus:border-primary transition-all pr-12 ${validationError ? 'border-red-500' : 'border-white/10'}`}
                                    placeholder="Enter meter number"
                                    type="text"
                                    value={meterNumber}
                                    onChange={(e) => setMeterNumber(e.target.value)}
                                    onBlur={handleMeterBlur}
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    {isValidating ? (
                                        <Loader2 className="animate-spin text-primary" size={20} />
                                    ) : customerName ? (
                                        <CheckCircle className="text-green-500" size={20} />
                                    ) : validationError ? (
                                        <AlertCircle className="text-red-500" size={20} />
                                    ) : null}
                                </div>
                            </div>

                            {/* Validation Response */}
                            {customerName && (
                                <div className="flex items-center gap-2 px-1 text-sm animate-in fade-in slide-in-from-top-1">
                                    <span className="text-slate-400">Customer:</span>
                                    <span className="text-green-400 font-bold truncate">{customerName}</span>
                                </div>
                            )}
                            {validationError && (
                                <div className="flex items-center gap-2 px-1 text-sm animate-in fade-in slide-in-from-top-1">
                                    <span className="text-red-400">{validationError}</span>
                                </div>
                            )}
                        </div>

                        {/* Amount */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-400 ml-1">
                                Amount (₦)
                            </label>
                            <div className="relative">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₦</span>
                                <input
                                    className="w-full bg-slate-800/50 border border-white/10 rounded-lg py-4 pl-10 pr-5 text-white placeholder:text-slate-600 focus:ring-primary focus:border-primary transition-all font-bold text-lg"
                                    placeholder="0.00"
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                            <p className="text-xs text-slate-500 px-1">Minimum amount: ₦1,000</p>
                        </div>

                    </div>

                    {/* Summary Card */}
                    {amount && !isNaN(Number(amount)) && Number(amount) > 0 && (
                        <div className="mt-8 p-6 bg-gradient-to-br from-primary/20 to-transparent border border-primary/20 rounded-xl relative overflow-hidden group">
                            <div className="absolute -right-12 -top-12 w-32 h-32 bg-primary/10 blur-3xl group-hover:bg-primary/20 transition-all"></div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-4">
                                Payment Summary
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Amount</span>
                                    <span className="text-white font-semibold">₦{Number(amount).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Fee</span>
                                    <span className="text-white font-semibold">₦0.00</span>
                                </div>
                                <div className="pt-3 border-t border-white/10 flex justify-between items-end">
                                    <span className="text-sm text-slate-400 font-medium">Total Payable</span>
                                    <div className="text-right">
                                        <span className="block text-2xl font-extrabold text-primary">
                                            ₦{Number(amount).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>

                {/* Fixed Bottom Button */}
                <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-6 bg-background-dark/95 backdrop-blur-xl border-t border-white/5">
                    <button
                        onClick={handleSubmit}
                        disabled={!meterNumber || !disco || !amount || processing || !!validationError || isValidating || !customerName}
                        className="w-full bg-primary hover:bg-primary/90 text-background-dark font-extrabold py-5 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-[0.97] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processing ? <Loader2 className="animate-spin" /> : (
                            <>
                                <span className="material-icons-round text-xl">bolt</span>
                                <span>PAY BILL NOW </span>
                            </>
                        )}

                    </button>
                    <div className="mt-4 flex justify-center items-center gap-1">
                        <span className="material-icons-round text-slate-500 text-xs">
                            verified_user
                        </span>
                        <span className="text-10px text-slate-500 uppercase tracking-widest font-bold">
                            PCI-DSS Compliant Secure Gateway
                        </span>
                    </div>
                </div>

                {/* Floating UI Decoration */}
                <div className="absolute top-0 right-0 -z-10 w-64 h-64 bg-primary/5 blur-[100px] rounded-full"></div>
                <div className="absolute bottom-40 -left-20 -z-10 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full"></div>
            </div>
        </div>
    );
};

export default ElectricityBillPage;
