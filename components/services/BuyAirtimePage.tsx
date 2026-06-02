"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Wifi, Smartphone, ArrowLeft, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { AirtimeSkeleton } from './skeletons';
import { cn } from '@/lib/utils';

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

const networkImages: Record<string, string> = {
    MTN: "/mtn.jpeg",
    AIRTEL: "/airtel.jpeg",
    GLO: "/glo.jpeg",
    "9MOBILE": "/9mobile.jpeg",
};

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
    const [selectedDataType, setSelectedDataType] = useState<string>("");
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
        setSelectedDataType("");
        setSelectedDataPlan("");
        setAmount("");
    };

    const handleTypeSelect = (type: string) => {
        setSelectedDataType(type);
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

    // Get available plan types for selected network
    const availableDataTypes = selectedNetwork
        ? Array.from(new Set(
            dataPlans
                .filter(p => p.network === selectedNetwork && p.status !== 'Inactive')
                .map(p => p.type || "SME")
          ))
        : [];

    // Filter plans based on selected network AND selected type
    const filteredDataPlans = selectedNetwork && selectedDataType
        ? dataPlans.filter(
            p => p.network === selectedNetwork && p.status !== 'Inactive' && (p.type || "SME") === selectedDataType
          )
        : [];

    const networks = ['MTN', 'AIRTEL', 'GLO', '9MOBILE'];

    // Format type nicely for UI
    const formatPlanType = (type: string) => {
        if (!type) return "";
        return type
            .toLowerCase()
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 min-h-screen flex justify-center font-sans">
            <div className="w-full max-w-[430px] h-screen bg-white dark:bg-[#131321] relative overflow-hidden flex flex-col shadow-2xl border-x border-slate-100 dark:border-white/5">
                
                {/* Header */}
                <header className="pt-14 pb-6 px-6 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-[#131321]/80 backdrop-blur-md z-20 border-b border-slate-100 dark:border-white/5">
                    <button 
                        onClick={() => router.back()} 
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Airtime &amp; Data</h1>
                    <div className="w-10"></div>
                </header>

                {/* Main Scrollable Content */}
                <main className="flex-1 px-6 pt-6 pb-6 overflow-y-auto no-scrollbar space-y-6">
                    
                    {/* Segmented Control (Airtime vs Data) */}
                    <div className="bg-slate-100 dark:bg-zinc-800/40 p-1.5 rounded-2xl flex border border-slate-200/50 dark:border-white/5 shadow-inner">
                        <button
                            onClick={() => setSegment('airtime')}
                            className={cn(
                                "flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2",
                                segment === 'airtime'
                                    ? "bg-white dark:bg-[#47f0d1] text-slate-900 shadow-md font-black"
                                    : "text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-white"
                            )}
                        >
                            <Smartphone className="w-4 h-4" />
                            Airtime
                        </button>
                        <button
                            onClick={() => setSegment('data')}
                            className={cn(
                                "flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2",
                                segment === 'data'
                                    ? "bg-white dark:bg-[#47f0d1] text-slate-900 shadow-md font-black"
                                    : "text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-white"
                            )}
                        >
                            <Wifi className="w-4 h-4" />
                            Data Bundle
                        </button>
                    </div>

                    {/* Provider Selection */}
                    <section className="space-y-3">
                        <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
                            Select Network
                        </label>
                        <div className="grid grid-cols-4 gap-2.5">
                            {networks.map((net) => {
                                const isSelected = selectedNetwork === net;
                                return (
                                    <div
                                        key={net}
                                        onClick={() => handleNetworkSelect(net)}
                                        className={cn(
                                            "flex flex-col items-center justify-center p-2.5 rounded-2xl border cursor-pointer transition-all duration-300 relative overflow-hidden group select-none",
                                            isSelected
                                                ? "bg-[#47f0d1]/10 border-[#47f0d1] ring-2 ring-[#47f0d1]/10"
                                                : "bg-slate-50 dark:bg-zinc-800/30 border-slate-100 dark:border-white/5 hover:border-[#47f0d1]/30 hover:bg-slate-100/50 dark:hover:bg-zinc-800/50"
                                        )}
                                    >
                                        <div className="relative w-9 h-9 mb-1.5 transition-transform duration-300 group-hover:scale-105">
                                            <img 
                                                src={networkImages[net] || "/placeholder-logo.png"} 
                                                alt={net} 
                                                className="w-full h-full rounded-full object-cover shadow-sm border border-slate-200/20" 
                                            />
                                            {isSelected && (
                                                <div className="absolute -bottom-1 -right-1 bg-[#47f0d1] text-[#131321] rounded-full p-0.5 shadow-md">
                                                    <Check className="w-2.5 h-2.5 stroke-[4]" />
                                                </div>
                                            )}
                                        </div>
                                        <span className={cn(
                                            "text-[10px] font-extrabold uppercase tracking-tight",
                                            isSelected ? "text-[#47f0d1]" : "text-slate-600 dark:text-zinc-400"
                                        )}>{net}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Input Fields Card */}
                    <section className="space-y-5">
                        {/* Phone Number */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
                                Phone Number
                            </label>
                            <div className="relative group">
                                <input
                                    className="w-full bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-white/5 rounded-2xl py-4 px-5 text-lg font-bold placeholder:text-slate-400 dark:placeholder:text-zinc-650 focus:bg-white dark:focus:bg-[#18182d] focus:border-[#47f0d1] focus:ring-4 focus:ring-[#47f0d1]/10 text-slate-900 dark:text-white transition-all outline-none"
                                    placeholder="0801 234 5678"
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#47f0d1] bg-[#47f0d1]/10 p-2.5 rounded-xl">
                                    <span className="material-icons-round text-xl block">contact_phone</span>
                                </div>
                            </div>
                        </div>

                        {/* Content based on Segment */}
                        {segment === 'airtime' ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest">
                                        Select Amount
                                    </label>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    {[100, 200, 500, 1000, 2000, 5000].map((amt) => (
                                        <button
                                            key={amt}
                                            type="button"
                                            onClick={() => setAmount(amt.toString())}
                                            className={`py-4 rounded-2xl font-black border-2 transition-all duration-300 ${amount === amt.toString()
                                                ? 'bg-[#47f0d1]/15 text-[#47f0d1] border-[#47f0d1] shadow-[0_0_15px_rgba(71,240,209,0.1)]'
                                                : 'bg-slate-50 dark:bg-zinc-800/30 border-transparent text-slate-800 dark:text-slate-200 hover:border-[#47f0d1]/30 hover:bg-slate-100/50'
                                                }`}
                                        >
                                            ₦{amt}
                                        </button>
                                    ))}
                                </div>
                                <div className="relative group mt-2">
                                    <input
                                        className="w-full bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-white/5 rounded-2xl py-4 px-5 text-lg font-bold placeholder:text-slate-400 dark:placeholder:text-zinc-650 focus:bg-white dark:focus:bg-[#18182d] focus:border-[#47f0d1] focus:ring-4 focus:ring-[#47f0d1]/10 text-slate-900 dark:text-white transition-all outline-none"
                                        placeholder="Enter Custom Amount"
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {!selectedNetwork ? (
                                    <div className="text-center p-8 text-slate-400 dark:text-zinc-500 bg-slate-50 dark:bg-zinc-800/20 border border-dashed border-slate-200 dark:border-white/5 rounded-2xl font-semibold">
                                        Select a network to see data options
                                    </div>
                                ) : (
                                    <>
                                        {/* Data Type Selection */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
                                                Select Data Type
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={selectedDataType}
                                                    onChange={(e) => handleTypeSelect(e.target.value)}
                                                    className="w-full bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-white/5 rounded-2xl py-4 px-5 text-base font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-[#47f0d1]/10 appearance-none cursor-pointer outline-none transition-all"
                                                >
                                                    <option value="" className="bg-white dark:bg-[#131321] text-slate-900 dark:text-white">Choose data type (e.g. SME, Gifting)</option>
                                                    {availableDataTypes.map((type) => (
                                                        <option key={type} value={type} className="bg-white dark:bg-[#131321] text-slate-900 dark:text-white">
                                                            {formatPlanType(type)}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                    <span className="material-icons-round block">expand_more</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Plan Selection */}
                                        {selectedDataType && (
                                            <div className="space-y-3">
                                                <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
                                                    Select Data Plan
                                                </label>
                                                <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
                                                    {filteredDataPlans.length === 0 ? (
                                                        <div className="text-center p-6 text-slate-400 dark:text-zinc-500 bg-slate-50 dark:bg-zinc-800/20 border border-slate-150 dark:border-white/5 rounded-2xl font-semibold">
                                                            No plans available for this type
                                                        </div>
                                                    ) : (
                                                        filteredDataPlans.map((plan) => (
                                                            <div
                                                                key={plan.dataPlan}
                                                                onClick={() => setSelectedDataPlan(plan.dataPlan!)}
                                                                className={cn(
                                                                    "p-4.5 rounded-2xl border-2 cursor-pointer flex justify-between items-center transition-all duration-300 select-none",
                                                                    selectedDataPlan === plan.dataPlan
                                                                        ? "bg-[#47f0d1]/10 border-[#47f0d1] shadow-[0_0_20px_rgba(71,240,209,0.1)]"
                                                                        : "bg-slate-50 dark:bg-zinc-800/30 border-transparent text-slate-900 dark:text-slate-100 hover:border-[#47f0d1]/30 hover:bg-slate-100/50"
                                                                )}
                                                            >
                                                                <div>
                                                                    <p className="font-extrabold text-slate-900 dark:text-slate-100">{plan.dataBundle} {plan.duration}</p>
                                                                    <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">{formatPlanType(plan.type || "SME")}</p>
                                                                </div>
                                                                <p className="font-black text-[#47f0d1] text-lg">₦{plan.price}</p>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}

                    </section>

                </main>

                {/* Fixed Footer Action */}
                <footer className="w-full p-6 bg-white dark:bg-[#131321] border-t border-slate-100 dark:border-white/5 z-20 shadow-md">
                    <div className="flex items-center justify-between mb-5 px-2">
                        <span className="text-sm font-medium text-slate-500 dark:text-zinc-400">Total Payment</span>
                        <span className="text-xl font-black text-[#47f0d1]">
                            {segment === 'airtime' ? (amount ? `₦${amount}` : '₦0.00') : (
                                selectedDataPlan ? `₦${filteredDataPlans.find(p => p.dataPlan === selectedDataPlan)?.price || 0}` : '₦0.00'
                            )}
                        </span>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={!phoneNumber || !selectedNetwork || (segment === 'airtime' && !amount) || (segment === 'data' && !selectedDataPlan) || processing}
                        className="w-full bg-[#47f0d1] hover:bg-[#47f0d1]/90 text-[#131321] py-4 rounded-2xl font-black text-lg shadow-[0_10px_30px_rgba(71,240,209,0.25)] hover:shadow-[0_10px_30px_rgba(71,240,209,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processing ? <Loader2 className="animate-spin w-5 h-5 text-[#131321]" /> : (
                            <>
                                Buy Now
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                    {/* Security stamp */}
                    <div className="flex items-center justify-center gap-1.5 pt-4 opacity-60">
                        <ShieldCheck className="text-[#47f0d1]/80 w-4 h-4" />
                        <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Secured by eGuy</span>
                    </div>
                </footer>

                {/* Floating Abstract Background Elements */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#47f0d1]/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute top-1/2 -left-32 w-80 h-80 bg-[#47f0d1]/5 rounded-full blur-3xl pointer-events-none"></div>
            </div>
        </div>
    );
};

export default BuyAirtimePage;
