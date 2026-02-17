"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { AirtimeSkeleton } from './skeletons';

interface Plan {
    _id: string;
    network: string;
    amount: number;
    price: number;
    apiPrice: number;
    dataBundle?: string;
    dataPlan?: string;
    duration?: string;
    type?: string;
    status?: string;
}

const BuyAirtimePage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const typeParam = searchParams.get('type');

    // Initialize segment based on URL param
    const [segment, setSegment] = useState<'airtime' | 'data'>(
        typeParam === 'data' ? 'data' : 'airtime'
    );

    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    // Data State
    const [airtimePlans, setAirtimePlans] = useState<Plan[]>([]);
    const [dataPlans, setDataPlans] = useState<Plan[]>([]);

    // Form State
    const [selectedNetwork, setSelectedNetwork] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [selectedDataPlan, setSelectedDataPlan] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [airtimeRes, dataRes] = await Promise.all([
                    fetch("/api/admin/airtime-plans"),
                    fetch("/api/admin/data-plans")
                ]);

                const airtimeData = await airtimeRes.json();
                const dataData = await dataRes.json();

                if (Array.isArray(airtimeData)) setAirtimePlans(airtimeData);
                if (Array.isArray(dataData)) setDataPlans(dataData);
            } catch (error) {
                console.error("Failed to fetch plans", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <AirtimeSkeleton />;
    }

    const handleNetworkSelect = (network: string) => {
        setSelectedNetwork(network);
        // Reset plan/amount when network changes
        setAmount("");
        setSelectedDataPlan("");
    };

    const handleSubmit = () => {
        if (!selectedNetwork || !phoneNumber) return;

        setProcessing(true);

        const queryParams = new URLSearchParams({
            type: segment,
            network: selectedNetwork,
            phone: phoneNumber,
        });

        if (segment === 'airtime') {
            if (!amount) return;
            queryParams.append('amount', amount);
        } else {
            if (!selectedDataPlan) return;
            const plan = dataPlans.find(p => p.dataPlan === selectedDataPlan);
            if (!plan) return;
            queryParams.append('plan', selectedDataPlan);
            queryParams.append('amount', plan.price.toString());
            queryParams.append('bundleName', `${plan.dataBundle} ${plan.duration}`);
        }

        router.push(`/payment/confirmation?${queryParams.toString()}`);
    };

    const filteredDataPlans = dataPlans.filter(p => p.network === selectedNetwork && p.status !== 'Inactive');

    const networks = ['MTN', 'AIRTEL', 'GLO', '9MOBILE'];

    const getNetworkColor = (net: string) => {
        switch (net) {
            case 'MTN': return 'bg-yellow-400';
            case 'AIRTEL': return 'bg-red-600';
            case 'GLO': return 'bg-green-600';
            case '9MOBILE': return 'bg-emerald-900';
            default: return 'bg-slate-400';
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex justify-center font-[Manrope]">
            <div className="w-full max-w-[430px] min-h-screen bg-background-light dark:bg-background-dark relative overflow-hidden flex flex-col">
                {/* Header */}
                <header className="pt-12 pb-6 px-6 flex items-center justify-between sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-20">
                    <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-200/50 dark:bg-primary/10 text-slate-900 dark:text-primary cursor-pointer hover:bg-slate-300/50 dark:hover:bg-primary/20 transition-colors">
                        <span className="material-icons-round">arrow_back_ios_new</span>
                    </button>
                    <h1 className="text-xl font-bold tracking-tight">Airtime &amp; Data</h1>
                    <div className="w-10"></div>
                </header>

                {/* Main Scrollable Content */}
                <main className="flex-1 px-6 pb-32 overflow-y-auto no-scrollbar">
                    {/* Segmented Control */}
                    <div className="bg-slate-200/50 dark:bg-surface-dark p-1.5 rounded-xl flex mb-8">
                        <button
                            onClick={() => setSegment('airtime')}
                            className={`flex-1 py-2.5 rounded-lg font-bold shadow-sm transition-all ${segment === 'airtime'
                                ? 'bg-white dark:bg-primary text-slate-900'
                                : 'text-slate-500 dark:text-slate-400'
                                }`}
                        >
                            Airtime
                        </button>
                        <button
                            onClick={() => setSegment('data')}
                            className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${segment === 'data'
                                ? 'bg-white dark:bg-primary text-slate-900'
                                : 'text-slate-500 dark:text-slate-400'
                                }`}
                        >
                            Data Bundle
                        </button>
                    </div>

                    {/* Provider Selection */}
                    <section className="mb-8">
                        <label className="text-sm font-semibold text-slate-500 dark:text-primary/60 uppercase tracking-wider mb-4 block">
                            Select Network
                        </label>
                        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                            {networks.map((net) => (
                                <div
                                    key={net}
                                    onClick={() => handleNetworkSelect(net)}
                                    className={`flex-shrink-0 flex flex-col items-center gap-2 group cursor-pointer transition-all ${selectedNetwork === net ? 'scale-105' : 'opacity-60 hover:opacity-100'}`}
                                >
                                    <div className={`w-16 h-16 rounded-2xl p-0.5 border-2 ${selectedNetwork === net ? 'border-primary shadow-[0_0_15px_rgba(71,240,209,0.2)]' : 'border-transparent'}`}>
                                        <div className={`w-full h-full rounded-xl overflow-hidden ${getNetworkColor(net)} flex items-center justify-center`}>
                                            <span className="text-white font-bold text-[10px]">{net}</span>
                                        </div>
                                    </div>
                                    <span className={`text-xs font-bold ${selectedNetwork === net ? 'text-primary' : 'text-slate-500'}`}>{net}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Input Fields Card */}
                    <section className="space-y-6">
                        {/* Phone Number */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 ml-1">
                                Phone Number
                            </label>
                            <div className="relative group">
                                <input
                                    className="w-full bg-slate-100 dark:bg-black/20 border-none rounded-2xl py-4 px-5 text-lg font-bold placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-primary transition-all"
                                    placeholder="0801 234 5678"
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-primary bg-primary/10 p-2 rounded-xl">
                                    <span className="material-icons-round text-xl">contact_phone</span>
                                </button>
                            </div>
                        </div>

                        {/* Content based on Segment */}
                        {segment === 'airtime' ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                                        Select Amount
                                    </label>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    {[100, 200, 500, 1000, 2000, 5000].map((amt) => (
                                        <button
                                            key={amt}
                                            onClick={() => setAmount(amt.toString())}
                                            className={`py-4 rounded-2xl font-bold border-2 transition-all ${amount === amt.toString()
                                                ? 'bg-primary/20 dark:bg-primary/20 text-primary border-primary'
                                                : 'bg-slate-100 dark:bg-black/20 text-slate-900 dark:text-slate-100 border-transparent hover:border-primary'
                                                }`}
                                        >
                                            ₦{amt}
                                        </button>
                                    ))}
                                </div>
                                <div className="relative group mt-2">
                                    <input
                                        className="w-full bg-slate-100 dark:bg-black/20 border-none rounded-2xl py-4 px-5 text-lg font-bold placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-primary transition-all"
                                        placeholder="Enter Custom Amount"
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                                        Select Data Plan
                                    </label>
                                </div>
                                {!selectedNetwork ? (
                                    <div className="text-center p-8 text-slate-500">Select a network to see plans</div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-3">
                                        {filteredDataPlans.length === 0 && !loading ? (
                                            <div className="text-center p-4">No plans available</div>
                                        ) : (
                                            filteredDataPlans.map((plan) => (
                                                <div
                                                    key={plan.dataPlan}
                                                    onClick={() => setSelectedDataPlan(plan.dataPlan)}
                                                    className={`p-4 rounded-2xl border-2 cursor-pointer flex justify-between items-center transition-all ${selectedDataPlan === plan.dataPlan
                                                        ? 'bg-primary/10 border-primary'
                                                        : 'bg-slate-100 dark:bg-surface-dark border-transparent hover:border-primary/50'
                                                        }`}
                                                >
                                                    <div>
                                                        <p className="font-bold text-slate-900 dark:text-slate-100">{plan.dataBundle} {plan.duration}</p>
                                                        <p className="text-xs text-slate-500">{plan.type}</p>
                                                    </div>
                                                    <p className="font-bold text-primary">₦{plan.price}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                    </section>

                </main>

                {/* Fixed Footer Action */}
                <footer className="absolute bottom-0 left-0 w-full p-6 pt-10 bg-gradient-to-t from-background-light dark:from-background-dark via-background-light dark:via-background-dark to-transparent z-30">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <span className="text-sm font-medium text-slate-500">Total Payment</span>
                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                            {segment === 'airtime' ? (amount ? `₦${amount}` : '₦0.00') : (
                                selectedDataPlan ? `₦${filteredDataPlans.find(p => p.dataPlan === selectedDataPlan)?.price || 0}` : '₦0.00'
                            )}
                        </span>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={!phoneNumber || !selectedNetwork || (segment === 'airtime' && !amount) || (segment === 'data' && !selectedDataPlan) || processing}
                        className="w-full bg-primary text-background-dark py-4 rounded-2xl font-extrabold text-lg shadow-[0_10px_30px_rgba(71,240,209,0.3)] active:scale-95 transition-transform flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processing ? <Loader2 className="animate-spin" /> : (
                            <>
                                Buy Now
                                <span className="material-icons-round">arrow_forward</span>
                            </>
                        )}
                    </button>
                </footer>

                {/* Floating Abstract Background Elements */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute top-1/2 -left-32 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
            </div>
        </div>
    );
};

export default BuyAirtimePage;
