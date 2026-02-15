"use client";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { DashboardHeader } from "@/components/dashboard/redesign/DashboardHeader";
import { BalanceCard } from "@/components/dashboard/redesign/BalanceCard";
import { QuickActions } from "@/components/dashboard/redesign/QuickActions";
import { ElevateXStats } from "@/components/dashboard/redesign/ElevateXStats";
import { RecentActivity } from "@/components/dashboard/redesign/RecentActivity";

import { DepositModal } from "@/components/dashboard/deposit-modal";
import { WithdrawModal } from "@/components/dashboard/withdraw-modal";
import { BillsModal } from "@/components/payments/bills-modal";
import { useRouter } from "next/navigation";

// Interface for Transaction (matching the one used in RecentActivity/API)
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

export default function DashboardPage() {
  const router = useRouter();

  // User data state
  const [user, setUser] = useState<any>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // Transaction state
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);

  const [refreshKey, setRefreshKey] = useState(0);
  const { toast } = useToast();

  // Modals state
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isBillsModalOpen, setIsBillsModalOpen] = useState(false);

  // Load user data
  useEffect(() => {
    fetchUserData();
    fetchTransactions();

    // Set up polling
    const interval = setInterval(() => {
      fetchUserData();
      // Optionally poll transactions too, or just on refreshKey
    }, 30000);

    return () => clearInterval(interval);
  }, [refreshKey]);

  const fetchUserData = async () => {
    try {
      setIsLoadingUser(true);
      const response = await fetch("/api/user");
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
    } finally {
      setIsLoadingUser(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      setIsLoadingTransactions(true);
      const response = await fetch("/api/wallet/transactions");
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions || []);
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  const handleTransactionSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleWithdrawSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // Paystack verification logic
  // Paystack verification logic
  const isVerifying = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reference = params.get("reference") || params.get("trxref");

    if (reference && !isVerifying.current) {
      isVerifying.current = true;
      console.log("Processing Paystack callback Reference:", reference);
      // alert("Processing Paystack callback: " + reference); // Temporary alert for debugging

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
              setRefreshKey((prev) => prev + 1);
            } else {
              // Only show error if it's not "Already credited"
              if (result.message !== "Already credited") {
                toast({
                  title: "Verification Failed",
                  description: result.error,
                  variant: "destructive",
                });
              } else {
                // Still refresh if it was already credited but we just got back
                setRefreshKey((prev) => prev + 1);
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
          // Clean up URL
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

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display pb-24">
      {/* Top Navigation Bar */}
      <DashboardHeader user={user} />

      <main className="px-6 space-y-6 mt-6">
        {/* Total Balance Hero Card */}
        <BalanceCard
          balance={user?.walletBalance || 0}
          onWithdraw={() => setIsWithdrawModalOpen(true)}
        />

        {/* Quick Actions Horizontal Scroll */}
        <QuickActions
          onAction={(type) => {
            if (type === 'more') {
              // Handle more actions logic or routing
            }
          }}
        />

        {/* ElevateX Stats Section */}
        <ElevateXStats />

        {/* Recent Activity */}
        <RecentActivity
          transactions={transactions}
          isLoading={isLoadingTransactions}
        />
      </main>

      {/* Modals */}
      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        onSuccess={handleTransactionSuccess}
      />
      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        onSuccess={handleWithdrawSuccess}
      />
      <BillsModal
        isOpen={isBillsModalOpen}
        onClose={() => setIsBillsModalOpen(false)}
        onSuccess={handleTransactionSuccess}
      />
    </div>
  );
}