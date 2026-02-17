"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { CableSkeleton } from './skeletons';

interface CablePackage {
    billsCode: string;
    package: string;
    status: string;
    price: string;
}

interface ProviderBundles {
    SERVICE: string;
    BUNDLE: CablePackage[];
}

const CableSubscriptionPage = () => {
    const router = useRouter();
    const [provider, setProvider] = useState<'dstv' | 'gotv' | 'startimes' | 'showmax'>('dstv');
    const [smartcardNumber, setSmartcardNumber] = useState("");
    const [isValidating, setIsValidating] = useState(false);
    const [customerName, setCustomerName] = useState<string | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [autoRenewal, setAutoRenewal] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [bundles, setBundles] = useState<ProviderBundles[]>([]);
    const [loadingBundles, setLoadingBundles] = useState(true);

    // Selected Package ID (billsCode)
    const [selectedPackage, setSelectedPackage] = useState<string>("");

    useEffect(() => {
        const fetchBundles = async () => {
            try {
                const res = await fetch('/api/bundles/cable');
                if (!res.ok) throw new Error('Failed to fetch bundles');
                const data = await res.json();
                setBundles(data);
            } catch (error) {
                console.error("Error fetching bundles:", error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to load subscription packages.",
                });
            } finally {
                setLoadingBundles(false);
            }
        };

        fetchBundles();
    }, []);

    if (loadingBundles) {
        return <CableSkeleton />;
    }

    const getProviderName = (p: string) => {
        switch (p) {
            case 'dstv': return 'DStv';
            case 'gotv': return 'GOtv';
            case 'startimes': return 'StarTimes';
            case 'showmax': return 'Showmax';
            default: return p.toUpperCase();
        }
    }

    const handleSmartcardBlur = async () => {
        if (!smartcardNumber || smartcardNumber.length < 5) return;

        setIsValidating(true);
        setCustomerName(null);
        setValidationError(null);

        try {
            const res = await fetch('/api/services/cable/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    provider: provider.toUpperCase(),
                    smartcardNumber
                })
            });

            const data = await res.json();

            if (!res.ok || data.error) {
                setValidationError(data.error || "Invalid Smartcard Number");
            } else {
                setCustomerName(data.customerName || "Verified Customer");
            }
        } catch (error) {
            setValidationError("Validation failed. Please check internet connection.");
        } finally {
            setIsValidating(false);
        }
    };

    const handleProviderChange = (newProvider: 'dstv' | 'gotv' | 'startimes' | 'showmax') => {
        setProvider(newProvider);
        setSelectedPackage('');
        setCustomerName(null);
        setValidationError(null);
        setSmartcardNumber('');
    };

    const handleSubmit = () => {
        if (!smartcardNumber || !selectedPackage) return;
        setProcessing(true);

        const currentProviderBundles = bundles.find(b => b.SERVICE.toLowerCase() === provider.toLowerCase())?.BUNDLE || [];
        const pack = currentProviderBundles.find(p => p.billsCode === selectedPackage);
        const amount = pack ? pack.price : 0;

        const queryParams = new URLSearchParams({
            type: 'cable',
            provider: provider,
            recipient: smartcardNumber,
            amount: amount.toString(),
            bundleName: pack ? pack.package : 'Unknown Package',
            // Pass the billsCode as the 'plan' or 'serviceType' for the backend
            plan: selectedPackage,
            customerName: customerName || ''
        });

        router.push(`/payment/confirmation?${queryParams.toString()}`);
    };

    // Filter bundles for current provider
    const currentProviderData = bundles.find(b => b.SERVICE.toLowerCase() === provider.toLowerCase());
    const currentPackages = currentProviderData ? currentProviderData.BUNDLE : [];

    const selectedPackageDetails = currentPackages.find(p => p.billsCode === selectedPackage);

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-[Manrope] min-h-screen flex justify-center">
            <div className="w-full max-w-[430px] min-h-screen bg-white dark:bg-background-dark relative overflow-hidden flex flex-col">
                {/* Header */}
                <header className="px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md z-10 border-b border-slate-100 dark:border-transparent">
                    <button onClick={() => router.back()} className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white cursor-pointer hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                        <span className="material-icons-round">arrow_back_ios_new</span>
                    </button>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Cable TV</h1>
                    <button className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white">
                        <span className="material-icons-round">history</span>
                    </button>
                </header>

                <main className="flex-1 px-6 pb-32 overflow-y-auto no-scrollbar">
                    {/* Provider Selection */}
                    <section className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                                Select Provider
                            </h2>
                        </div>
                        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                            {/* DStv */}
                            {/* DStv */}
                            <div
                                onClick={() => handleProviderChange('dstv')}
                                className={`flex-shrink-0 w-24 h-24 rounded-xl flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${provider === 'dstv'
                                    ? 'border-2 border-[#47f0d1] bg-[#47f0d1]/15'
                                    : 'bg-white dark:glass-card border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none'
                                    }`}
                            >
                                <div className="w-12 h-12 mb-2 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center border border-white/10">
                                    <img
                                        className="w-full h-full object-cover"
                                        alt="DStv"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsRqgGLe4H6lXb740sBZzO5NFWn9UKloQORXhoJBUxC1zVDpvwaVFySJTPINA9eDpR-wYJ_nMIOzZ9LkD4bVvpJoc4WlnYieUT_72WepMEGGqiIipyajglxal4MEWbWicq0hJRaTwraUlxIHtsaEj1d7V-Zt_xdvBiKG1p7CG3QMIHEWBekZ9-k0a2uZYFsZB8yQ-YgpoT4EJOF04fhaEss4dpVfGBhnUelsC4hQ8Ob5GrmqBkk8SpFE7dGofIEYowzG0V_ZBU5Uw"
                                    />
                                </div>
                                <span className={`text-xs font-bold ${provider === 'dstv' ? 'text-primary' : 'text-slate-400'}`}>
                                    DStv
                                </span>
                            </div>
                            {/* GOtv */}
                            <div
                                onClick={() => handleProviderChange('gotv')}
                                className={`flex-shrink-0 w-24 h-24 rounded-xl flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${provider === 'gotv'
                                    ? 'border-2 border-[#47f0d1] bg-[#47f0d1]/15'
                                    : 'bg-white dark:glass-card border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none'
                                    }`}
                            >
                                <div className="w-12 h-12 mb-2 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center border border-white/10">
                                    <img
                                        className="w-full h-full object-cover"
                                        alt="GOtv"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBW8N_eGXOdXMcaQ88w4mrUVL82fbmAUzsUO3gxv4Dw5ItXbekqTJSibn_UO7UMjUwKTTnjC_z6wpuc0Nj4ErCVyoF6qv8rDwPilCEiFSNDr3oO-tSt7cF82lSg0Qqb2OWs1FZnZ7UkSO1Mpud7S8TZSNhXufUFN-qn50ldvHSPeqrsJ2ZQ8P3sy4PbXDetM3QmCi7-VHWnyZCMe3-F3mOmYMIZ2rDnecMnVArD9IRegwCeNVIIzZazk1I1ajEXQ-w5DyDzP_uEW3M"
                                    />
                                </div>
                                <span className={`text-xs font-medium ${provider === 'gotv' ? 'text-primary' : 'text-slate-400'}`}>
                                    GOtv
                                </span>
                            </div>
                            {/* StarTimes */}
                            <div
                                onClick={() => handleProviderChange('startimes')}
                                className={`flex-shrink-0 w-24 h-24 rounded-xl flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${provider === 'startimes'
                                    ? 'border-2 border-[#47f0d1] bg-[#47f0d1]/15'
                                    : 'bg-white dark:glass-card border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none'
                                    }`}
                            >
                                <div className="w-12 h-12 mb-2 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center border border-white/10">
                                    <img
                                        className="w-full h-full object-cover"
                                        alt="StarTimes"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBo6ovzR-NsCu-5dVUY4A1MQuBjUV0IzCYPRaf8uxStk1lNXlY1XC40GnRvfWsLJaBOmxzows9ya1eKbajHA08qS9m6CHBfzi69sZyXL65NUBPCWf0uoxSu6-FvBhyD5uMa137Zjt8GBoAYjR2YOKJl1kjJGVSoTVSDuGHqe8jjjy7m4A0rNQsOAqUYErHDXDPRft3zbP2Mn6CcFmRbOK7WW2AFZ18awHNlXxAVSfmorar9PfmqvAjAZzdTfoMl2HWoEQyFl7eqXyo"
                                    />
                                </div>
                                <span className={`text-xs font-medium ${provider === 'startimes' ? 'text-primary' : 'text-slate-400'}`}>
                                    StarTimes
                                </span>
                            </div>
                            {/* Showmax */}
                            <div
                                onClick={() => handleProviderChange('showmax')}
                                className={`flex-shrink-0 w-24 h-24 rounded-xl flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${provider === 'showmax'
                                    ? 'border-2 border-[#47f0d1] bg-[#47f0d1]/15'
                                    : 'bg-white dark:glass-card border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none'
                                    }`}
                            >
                                <div className="w-12 h-12 mb-2 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center border border-white/10">
                                    <img
                                        className="w-full h-full object-cover"
                                        alt="Showmax"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGVeGWVqEL26vUn-Hh2-e8vsddvIX0t9-C76nXp10yoCzTaMMHf4agEoVKeWUl3Pa_CVAfLhe1Lk4FTDJXAhMoWai3xq8qnPG9nJXI4LX9JQznU-ElNKpTvePbmBcf11yXzCnrKsOaWDiWI4YU-uwebizBGZK2HTai7Ufq890q12VDiohng9Cl8XCY0NZKQM9gko33pWu4PRJfw_pFMv1dE18Sh-5fSfGbLD2Ss2wr5fdukhtNaZrnx001Lg82uCMuBmVCBrsQhlo"
                                    />
                                </div>
                                <span className={`text-xs font-medium ${provider === 'showmax' ? 'text-primary' : 'text-slate-400'}`}>
                                    Showmax
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Form Fields */}
                    <div className="space-y-6">
                        {/* Smartcard Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-400 ml-1">
                                Smartcard / IUC Number
                            </label>
                            <div className="relative group">
                                <input
                                    className={`w-full bg-slate-100 dark:bg-slate-800/50 border rounded-lg py-4 px-5 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-600 focus:ring-primary focus:border-primary transition-all pr-12 ${validationError ? 'border-red-500' : 'border-slate-200 dark:border-white/10'}`}
                                    placeholder="Enter number"
                                    type="text"
                                    value={smartcardNumber}
                                    onChange={(e) => setSmartcardNumber(e.target.value)}
                                    onBlur={handleSmartcardBlur}
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
                                    <span className="text-slate-500 dark:text-slate-400">Customer:</span>
                                    <span className="text-green-600 dark:text-green-400 font-bold truncate">{customerName}</span>
                                </div>
                            )}
                            {validationError && (
                                <div className="flex items-center gap-2 px-1 text-sm animate-in fade-in slide-in-from-top-1">
                                    <span className="text-red-400">{validationError}</span>
                                </div>
                            )}
                        </div>

                        {/* Package Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-400 ml-1">
                                Select Package
                            </label>
                            {loadingBundles ? (
                                <div className="flex gap-2 justify-center py-8">
                                    <Loader2 className="animate-spin text-primary" />
                                    <span className="text-slate-500 text-sm">Loading packages...</span>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-2">
                                    {currentPackages.length > 0 ? (
                                        currentPackages.map(pack => (
                                            <div
                                                key={pack.billsCode}
                                                onClick={() => setSelectedPackage(pack.billsCode)}
                                                className={`p-3 rounded-lg border flex justify-between items-center cursor-pointer transition-all ${selectedPackage === pack.billsCode
                                                    ? 'bg-primary/20 border-primary'
                                                    : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-800'
                                                    }`}
                                            >
                                                <span className="text-slate-900 dark:text-white font-medium text-sm">{pack.package}</span>
                                                <span className="text-primary font-bold text-sm">₦{Number(pack.price).toLocaleString()}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-4 text-slate-500 text-sm">
                                            No packages available for this provider.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Auto-renewal Toggle */}
                        <div className="flex items-center justify-between p-4 bg-white dark:glass-card rounded-lg border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <span className="material-icons-round">sync</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">Enable Auto-renewal</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Never miss a match</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    checked={autoRenewal}
                                    onChange={(e) => setAutoRenewal(e.target.checked)}
                                    className="sr-only peer"
                                    type="checkbox"
                                />
                                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>
                    </div>

                    {/* Summary Card */}
                    {selectedPackageDetails && (
                        <div className="mt-8 p-6 bg-gradient-to-br from-primary/20 to-transparent border border-primary/20 rounded-xl relative overflow-hidden group">
                            <div className="absolute -right-12 -top-12 w-32 h-32 bg-primary/10 blur-3xl group-hover:bg-primary/20 transition-all"></div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-4">
                                Payment Summary
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Package Amount</span>
                                    <span className="text-white font-semibold">₦{Number(selectedPackageDetails.price).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Convenience Fee</span>
                                    <span className="text-white font-semibold">₦0.00</span>
                                </div>
                                <div className="pt-3 border-t border-white/10 flex justify-between items-end">
                                    <span className="text-sm text-slate-400 font-medium">Total Payable</span>
                                    <div className="text-right">
                                        <span className="block text-2xl font-extrabold text-primary">
                                            ₦{Number(selectedPackageDetails.price).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>

                {/* Fixed Bottom Button */}
                <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-6 bg-white/95 dark:bg-background-dark/95 backdrop-blur-xl border-t border-slate-100 dark:border-white/5">
                    <button
                        onClick={handleSubmit}
                        disabled={!smartcardNumber || !selectedPackage || processing || !!validationError || isValidating}
                        className="w-full bg-primary hover:bg-primary/90 text-background-dark font-extrabold py-5 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-[0.97] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processing ? <Loader2 className="animate-spin" /> : (
                            <>
                                <span className="material-icons-round text-xl">lock</span>
                                <span>SECURELY PAY NOW </span>
                            </>
                        )}

                    </button>
                </div>

                {/* Floating UI Decoration */}
                <div className="absolute top-0 right-0 -z-10 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-40 -left-20 -z-10 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>
            </div>
        </div>
    );
};

export default CableSubscriptionPage;
