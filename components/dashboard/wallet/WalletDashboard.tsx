"use client";

import React, { useState, useEffect } from "react";
import { WalletBalance } from "./WalletBalance";
import { EarningsGrid } from "./EarningsGrid";
import { TransactionList } from "./TransactionList";
import { DashboardHeader } from "@/components/dashboard/redesign/DashboardHeader";
import { DepositModal } from "@/components/dashboard/deposit-modal";
import { WithdrawModal } from "@/components/dashboard/withdraw-modal";
import { BillsModal } from "@/components/payments/bills-modal";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

// Interface for Transaction matches typical usage
interface Transaction {
    id: string;
    type: "deposit" | "withdrawal" | "transfer" | "payment" | "referral_bonus" | "airtime" | "data" | "electricity" | "cable";
    amount: number;
    description: string;
    status: "pending" | "completed" | "failed" | "cancelled";
    createdAt: string;
    reference?: string;
    category?: string;
}

export function WalletDashboard() {
    const router = useRouter();
    const { toast } = useToast();

    // Data State
    const [user, setUser] = useState<any>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [stats, setStats] = useState<any>(null);

    // Loading State
    const [isLoading, setIsLoading] = useState(true);

    // Modals
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [isBillsModalOpen, setIsBillsModalOpen] = useState(false);

    // Poll key
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, [refreshKey]);

    const fetchData = async () => {
        try {
            // Parallel fetch for speed
            const [userRes, txRes, statsRes] = await Promise.all([
                fetch("/api/user"),
                fetch("/api/wallet/transactions"),
                fetch("/api/referrals/stats")
            ]);

            if (userRes.ok) {
                const userData = await userRes.json();
                setUser(userData.user);
            }

            if (txRes.ok) {
                const txData = await txRes.json();
                setTransactions(txData.transactions || []);
            }

            if (statsRes.ok) {
                const statsData = await statsRes.json();
                setStats(statsData);
            }

        } catch (error) {
            console.error("Dashboard fetch error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = () => setRefreshKey(prev => prev + 1);

    // Paystack verification logic
    const isVerifying = React.useRef(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const reference = params.get("reference") || params.get("trxref");

        if (reference && !isVerifying.current) {
            isVerifying.current = true;
            console.log("Processing Paystack callback Reference:", reference);

            const verifyTransaction = async () => {
                try {
                    // Get user ID first
                    const userRes = await fetch("/api/user");
                    const userData = await userRes.json();

                    if (userData.user && userData.user.id) {
                        const verifyRes = await fetch("/api/wallet/deposit/verify", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ reference, userId: userData.user.id }),
                        });

                        const result = await verifyRes.json();

                        if (!result.error) {
                            toast({
                                title: "Deposit Successful",
                                description: `Your wallet has been credited with ₦${result.amount?.toLocaleString() || '...'}`,
                                duration: 5000,
                            });
                            handleRefresh();
                        } else {
                            if (result.message !== "Already credited") {
                                toast({
                                    title: "Verification Failed",
                                    description: result.error,
                                    variant: "destructive",
                                });
                            } else {
                                handleRefresh();
                            }
                        }
                    }
                } catch (error) {
                    console.error("Verification error:", error);
                    toast({
                        title: "Verification Error",
                        description: "Could not verify transaction status. Please check your wallet.",
                        variant: "destructive",
                    });
                } finally {
                    const url = new URL(window.location.href);
                    url.searchParams.delete("reference");
                    url.searchParams.delete("trxref");
                    window.history.replaceState({}, document.title, url.toString());
                    isVerifying.current = false;
                }
            };

            verifyTransaction();
        }
    }, []);

    // Derived Data
    const pendingBalance = transactions
        .filter(t => t.status === 'pending')
        .reduce((sum, t) => sum + t.amount, 0);

    // Cashback calculation (mock or filtered)
    // Currently assuming 'referral_bonus' covers all earnings, but we can filter description for 'Cashback' if needed
    // For now, let's assume stats.totalEarnings covers everything, and simple subtraction for cashback
    // Or better, just passing 0 for cashback until we have a dedicated field, to be safe.
    const cashback = 0;

    return (
        <div className="min-h-screen bg-[#10221e] text-slate-100 font-display pb-24">
            {/* Header */}
            <DashboardHeader user={user} />

            <main className="px-5 space-y-6 mt-6 max-w-md mx-auto lg:max-w-4xl">
                {/* Available Balance using new Stitch design */}
                <WalletBalance
                    balance={user?.walletBalance || 0}
                    pendingBalance={pendingBalance}
                    onWithdraw={() => setIsWithdrawModalOpen(true)}
                    isLoading={isLoading}
                />

                {/* Quick Actions (Floating or just rely on bottom nav/modals) */}
                {/* We can keep QuickActions if needed, but Stitch design focuses on Stats grid */}

                {/* Earnings Breakdown */}
                <EarningsGrid
                    directEarnings={stats?.directEarnings || 0}
                    networkEarnings={stats?.networkEarnings || 0}
                    bonus={stats?.totalEarnings || 0} // Using total as bonus for now, or separate if API allows
                    cashback={cashback}
                    isLoading={isLoading}
                />

                {/* Transaction History */}
                <TransactionList
                    transactions={transactions}
                    isLoading={isLoading}
                />
            </main>

            {/* Modals */}
            <DepositModal
                isOpen={isDepositModalOpen}
                onClose={() => setIsDepositModalOpen(false)}
                onSuccess={handleRefresh}
            />
            <WithdrawModal
                isOpen={isWithdrawModalOpen}
                onClose={() => setIsWithdrawModalOpen(false)}
                onSuccess={handleRefresh}
            />
            <BillsModal
                isOpen={isBillsModalOpen}
                onClose={() => setIsBillsModalOpen(false)}
                onSuccess={handleRefresh}
            />
        </div>
    );
}
