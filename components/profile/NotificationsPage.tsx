"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <div
        onClick={onChange}
        className={`relative inline-flex items-center cursor-pointer w-11 h-6 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
    >
        <div className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-transform shadow-sm ${checked ? 'left-[22px]' : 'left-1'}`}></div>
    </div>
);

export default function NotificationsPage() {
    const router = useRouter();

    const [settings, setSettings] = useState({
        push: { network: true, earnings: true, security: true, marketing: false },
        email: { network: false, earnings: true, security: true, marketing: false },
        sms: { network: false, earnings: true, security: true, marketing: false }
    });

    const toggleSetting = (type: 'push' | 'email' | 'sms', key: string) => {
        setSettings(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                //@ts-ignore
                [key]: !prev[type][key]
            }
        }));
    };

    const sections = [
        {
            id: 'push',
            title: 'Push Notifications',
            icon: 'notifications_active',
            items: [
                { key: 'network', title: 'Network Activity', subtitle: 'New followers and interactions' },
                { key: 'earnings', title: 'Earnings & Payouts', subtitle: 'Direct deposits and bonuses' },
                { key: 'security', title: 'Security Alerts', subtitle: 'Logins and account changes' },
                { key: 'marketing', title: 'Marketing', subtitle: 'New features and promotions' }
            ]
        },
        {
            id: 'email',
            title: 'Email Notifications',
            icon: 'mail',
            items: [
                { key: 'network', title: 'Network Activity', subtitle: 'Weekly network summary' },
                { key: 'earnings', title: 'Earnings & Payouts', subtitle: 'Monthly tax invoices' },
                { key: 'security', title: 'Security Alerts', subtitle: 'Critical account changes' },
                { key: 'marketing', title: 'Marketing', subtitle: 'Product updates & insights' }
            ]
        },
        {
            id: 'sms',
            title: 'SMS Notifications',
            icon: 'chat_bubble',
            items: [
                { key: 'network', title: 'Network Activity', subtitle: 'Urgent connection requests' },
                { key: 'earnings', title: 'Earnings & Payouts', subtitle: 'Transaction confirmations' },
                { key: 'security', title: 'Security Alerts', subtitle: 'Login verification codes' },
                { key: 'marketing', title: 'Marketing', subtitle: 'Limited time offers' }
            ]
        }
    ];

    return (
        <div className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans min-h-screen pb-32">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 pt-14 pb-4 flex items-center justify-between border-b border-slate-200 dark:border-white/5">
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 flex items-center justify-start text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                    <span className="material-icons-round">arrow_back_ios</span>
                </button>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">Notification Preferences</h1>
                <div className="w-10"></div>
            </header>

            <main className="px-5 pt-6 space-y-8 pb-32">
                {sections.map((section) => (
                    <section key={section.id}>
                        <div className="flex items-center gap-2 mb-3 px-1">
                            <span className="material-icons-round text-primary text-xl">{section.icon}</span>
                            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">{section.title}</h2>
                        </div>
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden">
                            {section.items.map((item, index) => (
                                <div
                                    key={item.key}
                                    className={`flex items-center justify-between p-4 ${index !== section.items.length - 1 ? 'border-b border-slate-100 dark:border-white/5' : ''}`}
                                >
                                    <div className="flex flex-col">
                                        <p className="text-[15px] font-semibold text-slate-900 dark:text-white">{item.title}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-500">{item.subtitle}</p>
                                    </div>
                                    <Toggle
                                        //@ts-ignore
                                        checked={settings[section.id][item.key]}
                                        //@ts-ignore
                                        onChange={() => toggleSetting(section.id, item.key)}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                ))}

                <p className="text-center text-slate-600 text-[10px] uppercase tracking-[0.2em] font-bold py-4">
                    Changes are saved automatically
                </p>
            </main>
        </div>
    );
}
