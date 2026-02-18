"use client";

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { DepositModal } from '../deposit-modal';

export function BottomNav() {
    const router = useRouter();
    const pathname = usePathname();
    const [showDepositModal, setShowDepositModal] = useState(false);

    const getLinkClass = (path: string) => {
        // Active if current path starts with the link path (simple check)
        // Special case for Home/Wallet both pointing to dashboard roughly
        const isActive = pathname === path || (path === '/dashboard' && pathname === '/');

        return isActive
            ? "flex flex-col items-center gap-1 text-primary transition-colors"
            : "flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors";
    };

    return (
        <>
            <nav className="fixed bottom-0 inset-x-0 bg-white/90 dark:bg-card-dark/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800/50 px-8 py-3 pb-8 flex justify-between items-center z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                <button
                    onClick={() => router.push('/dashboard')}
                    className={getLinkClass('/dashboard')}
                >
                    <span className="material-icons-round">dashboard</span>
                    <span className="text-[10px] font-bold">Home</span>
                </button>

                <button
                    onClick={() => router.push('/wallet')}
                    className={pathname === '/wallet' ? getLinkClass('/wallet') : "flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"}
                >
                    <span className="material-icons-round">account_balance_wallet</span>
                    <span className="text-[10px] font-bold">Wallet</span>
                </button>

                {/* Floating Add Button */}
                <button
                    onClick={() => setShowDepositModal(true)}
                    className="group relative w-14 h-14 -mt-10 bg-primary text-background-dark rounded-full shadow-lg shadow-primary/30 flex items-center justify-center border-4 border-background-light dark:border-background-dark transition-transform active:scale-95"
                >
                    <span className="material-icons-round text-3xl group-hover:rotate-90 transition-transform">add</span>
                </button>

                <button
                    onClick={() => router.push('/elevatex')}
                    className={getLinkClass('/elevatex')}
                >
                    <span className="material-icons-round">insights</span>
                    <span className="text-[10px] font-bold">Growth</span>
                </button>

                <button
                    onClick={() => router.push('/profile')}
                    className={getLinkClass('/profile')}
                >
                    <span className="material-icons-round">person</span>
                    <span className="text-[10px] font-bold">Profile</span>
                </button>
            </nav>

            {/* iOS Home Indicator Spacer */}
            <div className="fixed bottom-1 inset-x-0 flex justify-center z-[60] pointer-events-none">
                <div className="w-32 h-1.5 bg-slate-900/10 dark:bg-slate-100/10 rounded-full"></div>
            </div>

            <DepositModal
                isOpen={showDepositModal}
                onClose={() => setShowDepositModal(false)}
                onSuccess={() => setShowDepositModal(false)}
            />
        </>
    );
}
