"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export function ElevateXStats() {
    const router = useRouter();

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
                    <h3 className="font-bold text-slate-800 dark:text-slate-200">ElevateX Progress</h3>
                </div>
                <span className="text-xs font-bold text-primary">65% Complete</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-slate-200 dark:bg-neutral-dark rounded-full overflow-hidden mb-3">
                <div
                    className="h-full bg-gradient-to-r from-primary/60 to-primary rounded-full shadow-[0_0_12px_rgba(71,240,209,0.3)]"
                    style={{ width: '65%' }}
                ></div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
                Earn <span className="text-slate-900 dark:text-slate-200 font-bold">₦12,500</span> more to unlock Cycle 4 rewards.
            </p>
        </section>
    );
}
