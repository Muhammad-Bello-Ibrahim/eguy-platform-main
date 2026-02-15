"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const CableSubscriptionPage = () => {
    const router = useRouter();
    const [provider, setProvider] = useState<'dstv' | 'gotv' | 'startimes' | 'showmax'>('dstv');
    const [smartcardNumber, setSmartcardNumber] = useState("");
    const [autoRenewal, setAutoRenewal] = useState(true);
    const [processing, setProcessing] = useState(false);

    // Mock Packages (Real app would fetch from API based on provider/smartcard)
    const [selectedPackage, setSelectedPackage] = useState<string>("");

    const mockPackages = {
        dstv: [
            { id: 'padi', name: 'DStv Padi', price: 2500 },
            { id: 'yanga', name: 'DStv Yanga', price: 4200 },
            { id: 'confam', name: 'DStv Confam', price: 7400 },
            { id: 'premium', name: 'DStv Premium', price: 24500 },
        ],
        gotv: [
            { id: 'smallie', name: 'GOtv Smallie', price: 1300 },
            { id: 'jinja', name: 'GOtv Jinja', price: 2700 },
            { id: 'jolli', name: 'GOtv Jolli', price: 3950 },
            { id: 'max', name: 'GOtv Max', price: 5700 },
        ],
        startimes: [
            { id: 'nova', name: 'Nova', price: 1200 },
            { id: 'basic', name: 'Basic', price: 2100 },
            { id: 'smart', name: 'Smart', price: 3300 },
            { id: 'classic', name: 'Classic', price: 3800 },
        ],
        showmax: [
            { id: 'mobile', name: 'Showmax Mobile', price: 1200 },
            { id: 'pro', name: 'Showmax Pro', price: 3200 },
        ]
    };

    const getProviderName = (p: string) => {
        switch (p) {
            case 'dstv': return 'DStv';
            case 'gotv': return 'GOtv';
            case 'startimes': return 'StarTimes';
            case 'showmax': return 'Showmax';
            default: return p.toUpperCase();
        }
    }

    const handleSmartcardBlur = () => {
        // Logic to validate smartcard name would go here
    };

    const handleSubmit = () => {
        if (!smartcardNumber || !selectedPackage) return;
        setProcessing(true);

        const pack = mockPackages[provider].find(p => p.id === selectedPackage);
        const amount = pack ? pack.price : 0;

        const queryParams = new URLSearchParams({
            type: 'cable',
            provider: provider,
            recipient: smartcardNumber,
            amount: amount.toString(),
            bundleName: pack ? pack.name : 'Unknown Package'
        });

        router.push(`/payment/confirmation?${queryParams.toString()}`);
    };

    const currentPackages = mockPackages[provider] || [];
    const selectedPackageDetails = currentPackages.find(p => p.id === selectedPackage);

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-[Manrope] min-h-screen flex justify-center">
            <div className="w-full max-w-[430px] min-h-screen bg-background-dark relative overflow-hidden flex flex-col">
                {/* Header */}
                <header className="px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 bg-background-dark/80 backdrop-blur-md z-10">
                    <button onClick={() => router.back()} className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-white cursor-pointer hover:bg-white/10 transition-colors">
                        <span className="material-icons-round">arrow_back_ios_new</span>
                    </button>
                    <h1 className="text-xl font-bold tracking-tight text-white">Cable TV</h1>
                    <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-white">
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
                            <div
                                onClick={() => { setProvider('dstv'); setSelectedPackage(''); }}
                                className={`flex-shrink-0 w-24 h-24 rounded-xl flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${provider === 'dstv'
                                        ? 'border-2 border-[#47f0d1] bg-[#47f0d1]/15'
                                        : 'glass-card'
                                    }`}
                            >
                                <div className="w-12 h-12 mb-2 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center border border-white/10">
                                    <img
                                        className="w-full h-full object-cover"
                                        alt="Blue and white DStv brand logo"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsRqgGLe4H6lXb740sBZzO5NFWn9UKloQORXhoJBUxC1zVDpvwaVFySJTPINA9eDpR-wYJ_nMIOzZ9LkD4bVvpJoc4WlnYieUT_72WepMEGGqiIipyajglxal4MEWbWicq0hJRaTwraUlxIHtsaEj1d7V-Zt_xdvBiKG1p7CG3QMIHEWBekZ9-k0a2uZYFsZB8yQ-YgpoT4EJOF04fhaEss4dpVfGBhnUelsC4hQ8Ob5GrmqBkk8SpFE7dGofIEYowzG0V_ZBU5Uw"
                                    />
                                </div>
                                <span className={`text-xs font-bold ${provider === 'dstv' ? 'text-primary' : 'text-slate-400'}`}>
                                    DStv
                                </span>
                            </div>
                            {/* GOtv */}
                            <div
                                onClick={() => { setProvider('gotv'); setSelectedPackage(''); }}
                                className={`flex-shrink-0 w-24 h-24 rounded-xl flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${provider === 'gotv'
                                        ? 'border-2 border-[#47f0d1] bg-[#47f0d1]/15'
                                        : 'glass-card'
                                    }`}
                            >
                                <div className="w-12 h-12 mb-2 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center border border-white/10">
                                    <img
                                        className="w-full h-full object-cover"
                                        alt="Green and neon GOtv brand logo"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBW8N_eGXOdXMcaQ88w4mrUVL82fbmAUzsUO3gxv4Dw5ItXbekqTJSibn_UO7UMjUwKTTnjC_z6wpuc0Nj4ErCVyoF6qv8rDwPilCEiFSNDr3oO-tSt7cF82lSg0Qqb2OWs1FZnZ7UkSO1Mpud7S8TZSNhXufUFN-qn50ldvHSPeqrsJ2ZQ8P3sy4PbXDetM3QmCi7-VHWnyZCMe3-F3mOmYMIZ2rDnecMnVArD9IRegwCeNVIIzZazk1I1ajEXQ-w5DyDzP_uEW3M"
                                    />
                                </div>
                                <span className={`text-xs font-medium ${provider === 'gotv' ? 'text-primary' : 'text-slate-400'}`}>
                                    GOtv
                                </span>
                            </div>
                            {/* StarTimes */}
                            <div
                                onClick={() => { setProvider('startimes'); setSelectedPackage(''); }}
                                className={`flex-shrink-0 w-24 h-24 rounded-xl flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${provider === 'startimes'
                                        ? 'border-2 border-[#47f0d1] bg-[#47f0d1]/15'
                                        : 'glass-card'
                                    }`}
                            >
                                <div className="w-12 h-12 mb-2 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center border border-white/10">
                                    <img
                                        className="w-full h-full object-cover"
                                        alt="Red and white StarTimes brand logo"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBo6ovzR-NsCu-5dVUY4A1MQuBjUV0IzCYPRaf8uxStk1lNXlY1XC40GnRvfWsLJaBOmxzows9ya1eKbajHA08qS9m6CHBfzi69sZyXL65NUBPCWf0uoxSu6-FvBhyD5uMa137Zjt8GBoAYjR2YOKJl1kjJGVSoTVSDuGHqe8jjjy7m4A0rNQsOAqUYErHDXDPRft3zbP2Mn6CcFmRbOK7WW2AFZ18awHNlXxAVSfmorar9PfmqvAjAZzdTfoMl2HWoEQyFl7eqXyo"
                                    />
                                </div>
                                <span className={`text-xs font-medium ${provider === 'startimes' ? 'text-primary' : 'text-slate-400'}`}>
                                    StarTimes
                                </span>
                            </div>
                            {/* Showmax */}
                            <div
                                onClick={() => { setProvider('showmax'); setSelectedPackage(''); }}
                                className={`flex-shrink-0 w-24 h-24 rounded-xl flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${provider === 'showmax'
                                        ? 'border-2 border-[#47f0d1] bg-[#47f0d1]/15'
                                        : 'glass-card'
                                    }`}
                            >
                                <div className="w-12 h-12 mb-2 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center border border-white/10">
                                    <img
                                        className="w-full h-full object-cover"
                                        alt="Red and black streaming service logo"
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
                                    className="w-full bg-slate-800/50 border-white/10 rounded-lg py-4 px-5 text-white placeholder:text-slate-600 focus:ring-primary focus:border-primary transition-all pr-12"
                                    placeholder="Enter 10-digit number"
                                    type="text"
                                    value={smartcardNumber}
                                    onChange={(e) => setSmartcardNumber(e.target.value)}
                                    onBlur={handleSmartcardBlur}
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-primary">
                                    <span className="material-icons-round">check_circle</span>
                                </div>
                            </div>
                            {/* Validation Response (Mock) */}
                            {smartcardNumber.length > 9 && (
                                <div className="flex items-center gap-2 px-1 text-sm">
                                    <span className="text-slate-400">Customer:</span>
                                    <span className="text-white font-bold">VERIFIED USER</span>
                                </div>
                            )}
                        </div>

                        {/* Package Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-400 ml-1">
                                Select Package
                            </label>
                            <div className="grid grid-cols-1 gap-2">
                                {currentPackages.map(pack => (
                                    <div
                                        key={pack.id}
                                        onClick={() => setSelectedPackage(pack.id)}
                                        className={`p-3 rounded-lg border flex justify-between items-center cursor-pointer transition-all ${selectedPackage === pack.id
                                                ? 'bg-primary/20 border-primary'
                                                : 'bg-slate-800/50 border-white/10 hover:bg-slate-800'
                                            }`}
                                    >
                                        <span className="text-white font-medium">{pack.name}</span>
                                        <span className="text-primary font-bold">₦{pack.price.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Auto-renewal Toggle */}
                        <div className="flex items-center justify-between p-4 glass-card rounded-lg border border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <span className="material-icons-round">sync</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">Enable Auto-renewal</p>
                                    <p className="text-xs text-slate-400">Never miss a match</p>
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
                                    <span className="text-white font-semibold">₦{selectedPackageDetails.price.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Convenience Fee</span>
                                    <span className="text-white font-semibold">₦0.00</span>
                                </div>
                                <div className="pt-3 border-t border-white/10 flex justify-between items-end">
                                    <span className="text-sm text-slate-400 font-medium">Total Payable</span>
                                    <div className="text-right">
                                        <span className="block text-2xl font-extrabold text-primary">
                                            ₦{selectedPackageDetails.price.toLocaleString()}
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
                        disabled={!smartcardNumber || !selectedPackage || processing}
                        className="w-full bg-primary hover:bg-primary/90 text-background-dark font-extrabold py-5 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-[0.97] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processing ? <Loader2 className="animate-spin" /> : (
                            <>
                                <span className="material-icons-round text-xl">lock</span>
                                <span>SECURELY PAY NOW </span>
                            </>
                        )}

                    </button>
                    <div className="mt-4 flex justify-center items-center gap-1">
                        <span className="material-icons-round text-slate-500 text-xs">
                            verified_user
                        </span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                            PCI-DSS Compliant Secure Gateway
                        </span>
                    </div>
                </div>

                {/* Floating UI Decoration */}
                <div className="absolute top-0 right-0 -z-10 w-64 h-64 bg-primary/5 blur-[100px] rounded-full"></div>
                <div className="absolute bottom-40 -left-20 -z-10 w-64 h-64 bg-primary/10 blur-[100px] rounded-full"></div>
            </div>
        </div>
    );
};

export default CableSubscriptionPage;
