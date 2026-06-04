"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PayoutsSkeleton } from './skeletons';

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

    if (loading) {
        return <PayoutsSkeleton />;
    }

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

            <main className="px-5 pb-32 flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <span className="material-icons-round text-primary text-5xl">auto_awesome</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Coming Soon</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-[280px] mb-8">
                    We are working hard to bring you advanced payout scheduling. Stay tuned!
                </p>
                <button
                    onClick={() => router.push('/dashboard')}
                    className="bg-primary text-slate-900 dark:text-background-dark font-bold py-3 px-8 rounded-xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
                >
                    Go to Dashboard
                </button>
            </main>
        </div>
    );
}
