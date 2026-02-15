"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export function ElevateXStats() {
    const router = useRouter();
    const [stats, setStats] = React.useState<{ totalEarnings: number } | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        fetch('/api/referrals/stats')
            .then(res => res.json())
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    // Define Cycles/Levels based on Total Earnings
    const CYCLES = [
        { level: 1, target: 5000, reward: "Cycle 1" },
        { level: 2, target: 15000, reward: "Cycle 2" },
        { level: 3, target: 30000, reward: "Cycle 3" },
        { level: 4, target: 50000, reward: "Cycle 4" },
        { level: 5, target: 100000, reward: "Cycle 5" },
    ];

    const currentEarnings = stats?.totalEarnings || 0;

    // Find current cycle
    const currentCycleIndex = CYCLES.findIndex(c => currentEarnings < c.target);
    const currentCycle = currentCycleIndex !== -1 ? CYCLES[currentCycleIndex] : CYCLES[CYCLES.length - 1];
    const prevTarget = currentCycleIndex > 0 ? CYCLES[currentCycleIndex - 1].target : 0;

    // Calculate progress
    const totalNeeded = currentCycle.target - prevTarget;
    const currentProgress = currentEarnings - prevTarget;
    const percentage = Math.min(100, Math.max(0, (currentProgress / totalNeeded) * 100));

    const remaining = currentCycle.target - currentEarnings;
    const isMaxLevel = currentCycleIndex === -1;

    if (loading) return <div className="h-32 bg-card-dark/40 rounded-2xl animate-pulse" />;

    return (
        <section
            onClick={() => router.push('/elevatex')}
            className="bg-card-dark/40 border border-slate-800/40 rounded-2xl p-5 cursor-pointer hover:bg-card-dark/60 transition-colors"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                        <span className="material-icons-round text-primary text-sm">auto_graph</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 dark:text-slate-200">ElevateX Progress</h3>
                        <p className="text-[10px] text-slate-500">
                            {isMaxLevel ? "Max Level Reached" : `Next: ${currentCycle.reward}`}
                        </p>
                    </div>
                </div>
                <span className="text-xs font-bold text-primary">{Math.round(percentage)}% Complete</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-slate-200 dark:bg-neutral-dark rounded-full overflow-hidden mb-3">
                <div
                    className="h-full bg-gradient-to-r from-primary/60 to-primary rounded-full shadow-[0_0_12px_rgba(71,240,209,0.3)] transition-all duration-1000 ease-out"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
                {isMaxLevel ? (
                    "You have unlocked all current rewards!"
                ) : (
                    <>
                        Earn <span className="text-slate-900 dark:text-slate-200 font-bold">₦{remaining.toLocaleString()}</span> more to unlock {currentCycle.reward} rewards.
                    </>
                )}
            </p>
        </section>
    );
}
