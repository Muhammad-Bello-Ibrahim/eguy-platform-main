"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

interface QuickActionsProps {
    onAction: (actionType: string) => void;
}

export function QuickActions({ onAction }: QuickActionsProps) {
    const router = useRouter();

    const actions = [
        {
            label: "Airtime",
            icon: "phone_android",
            onClick: () => router.push('/services/airtime')
        },
        {
            label: "Data",
            icon: "wifi",
            onClick: () => router.push('/services/airtime?type=data')
        },
        {
            label: "Cable",
            icon: "live_tv",
            onClick: () => router.push('/services/cable')
        },
        {
            label: "Referrals",
            icon: "group_add",
            onClick: () => router.push('/elevatex')
        },
        {
            label: "More",
            icon: "apps",
            onClick: () => onAction('more') // Or navigate to a services page
        }
    ];

    return (
        <section>
            <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Quick Actions</h3>
            </div>

            <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6 pb-2">
                {actions.map((action, index) => (
                    <div key={index} className="flex flex-col items-center gap-2 min-w-[72px]">
                        <button
                            onClick={action.onClick}
                            className="w-14 h-14 rounded-2xl bg-white dark:bg-card-dark text-primary flex items-center justify-center border border-primary/10 hover:border-primary/40 hover:bg-primary/5 transition-all active:scale-95 shadow-sm"
                        >
                            <span className="material-icons-round">{action.icon}</span>
                        </button>
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{action.label}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}
