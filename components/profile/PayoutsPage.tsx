"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PayoutsPage() {
    const router = useRouter();
    const [frequency, setFrequency] = useState('weekly');
    const [minPayout, setMinPayout] = useState(1500);
    const [preferredDay, setPreferredDay] = useState('F');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    React.useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/user/payouts');
            const data = await res.json();
            if (data.payoutSchedule) {
                setFrequency(data.payoutSchedule.frequency);
                setMinPayout(data.payoutSchedule.minPayout);
                if (data.payoutSchedule.preferredDay) {
                    setPreferredDay(data.payoutSchedule.preferredDay);
                }
            }
        } catch (error) {
            console.error("Failed to fetch payout settings", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/user/payouts', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    frequency,
                    minPayout,
                    preferredDay
                })
            });

            if (res.ok) {
                alert("Settings saved successfully!");
            } else {
                alert("Failed to save settings");
            }
        } catch (error) {
            console.error("Error saving settings", error);
            alert("An error occurred");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans min-h-screen pb-32">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 pt-14 pb-4 flex items-center gap-4 border-b border-slate-200 dark:border-white/5">
                <button
                    onClick={() => router.back()}
                    className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                >
                    <span className="material-icons-round text-slate-600 dark:text-slate-300">arrow_back_ios_new</span>
                </button>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">Payout Schedule</h1>
            </header>

            <main className="px-5 space-y-6 pb-32">
                {/* Next Payout Card */}
                <section className="mt-4">
                    <div className="bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-primary/80 mb-1">Next Payout</p>
                                <h2 className="text-3xl font-extrabold text-white">Oct 27, 2023</h2>
                            </div>
                            <div className="bg-primary/10 p-3 rounded-xl">
                                <span className="material-icons-round text-primary">schedule_send</span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400">Estimated Amount</span>
                                <span className="font-bold text-primary">$1,240.50</span>
                            </div>
                            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-primary h-full w-[82%]"></div>
                            </div>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider text-center">82% of minimum threshold reached</p>
                        </div>
                    </div>
                </section>

                {/* Payout Frequency */}
                <section>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 px-1">Payout Frequency</h2>
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-2xl p-2 space-y-1">
                        <label
                            className={`flex items-center justify-between p-4 rounded-xl transition-colors cursor-pointer group ${frequency === 'daily' ? 'bg-primary/5 border border-primary/20' : 'hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent'}`}
                            onClick={() => setFrequency('daily')}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-primary ${frequency === 'daily' ? 'bg-primary/20' : 'bg-primary/10'}`}>
                                    <span className="material-icons-round">calendar_today</span>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">Daily</p>
                                    <p className="text-xs text-slate-500">Processed every 24 hours</p>
                                </div>
                            </div>
                            <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${frequency === 'daily' ? 'border-primary' : 'border-slate-700'}`}>
                                {frequency === 'daily' && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                            </div>
                        </label>

                        <label
                            className={`flex items-center justify-between p-4 rounded-xl transition-colors cursor-pointer group ${frequency === 'weekly' ? 'bg-primary/5 border border-primary/20' : 'hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent'}`}
                            onClick={() => setFrequency('weekly')}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-primary ${frequency === 'weekly' ? 'bg-primary/20' : 'bg-primary/10'}`}>
                                    <span className="material-icons-round">date_range</span>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">Weekly</p>
                                    <p className={`text-xs ${frequency === 'weekly' ? 'text-primary/70' : 'text-slate-500'}`}>Every Friday</p>
                                </div>
                            </div>
                            <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${frequency === 'weekly' ? 'border-primary' : 'border-slate-700'}`}>
                                {frequency === 'weekly' && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                            </div>
                        </label>

                        <label
                            className={`flex items-center justify-between p-4 rounded-xl transition-colors cursor-pointer group ${frequency === 'monthly' ? 'bg-primary/5 border border-primary/20' : 'hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent'}`}
                            onClick={() => setFrequency('monthly')}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-primary ${frequency === 'monthly' ? 'bg-primary/20' : 'bg-primary/10'}`}>
                                    <span className="material-icons-round">event_note</span>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">Monthly</p>
                                    <p className="text-xs text-slate-500">1st of every month</p>
                                </div>
                            </div>
                            <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${frequency === 'monthly' ? 'border-primary' : 'border-slate-700'}`}>
                                {frequency === 'monthly' && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                            </div>
                        </label>
                    </div>
                </section>

                {/* Preferred Day (Only show for Weekly) */}
                {frequency === 'weekly' && (
                    <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-2xl p-5">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Preferred Payout Day</h2>
                        <div className="flex justify-between items-center gap-2">
                            {['M', 'T', 'W', 'Th', 'F', 'Sa', 'Su'].map((day, i) => (
                                <button
                                    key={i}
                                    onClick={() => setPreferredDay(day)}
                                    className={`w-10 h-10 rounded-lg text-xs font-bold transition-colors ${preferredDay === day ? 'bg-primary text-slate-900 dark:text-background-dark font-black' : 'border border-slate-200 dark:border-white/5 hover:bg-primary/10 text-slate-600 dark:text-slate-400'}`}
                                >{day}</button>
                            ))}
                        </div>
                    </section>
                )}

                {/* Minimum Payout Slider */}
                <section>
                    <div className="flex justify-between items-end mb-3 px-1">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Minimum Payout</h2>
                        <span className="text-xl font-extrabold text-primary">${minPayout.toLocaleString()}</span>
                    </div>
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-2xl p-6">
                        <input
                            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                            max="5000"
                            min="100"
                            step="100"
                            type="range"
                            value={minPayout}
                            onChange={(e) => setMinPayout(Number(e.target.value))}
                        />
                        <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                            <span>$100 Min</span>
                            <span>$5,000 Max</span>
                        </div>
                    </div>
                    <p className="mt-3 px-2 text-xs text-slate-500 leading-relaxed italic">
                        * Payouts are only triggered once your available balance exceeds this threshold on your scheduled day.
                    </p>
                </section>

                <div className="pt-6 pb-12">
                    <button
                        onClick={handleSave}
                        disabled={saving || loading}
                        className="w-full bg-primary text-slate-900 dark:text-background-dark font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? "SAVING..." : "SAVE SETTINGS"}
                    </button>
                </div>
            </main>
        </div>
    );
}
