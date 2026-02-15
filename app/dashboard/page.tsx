"use client";
import { useState, useEffect } from "react";
import { WalletCard } from "@/components/dashboard/wallet-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { TransactionHistory } from "@/components/dashboard/transaction-history";
import { DepositModal } from "@/components/dashboard/deposit-modal";
import { WithdrawModal } from "@/components/dashboard/withdraw-modal";
import { AirtimeModal } from "@/components/payments/airtime-modal";
import { DataModal } from "@/components/payments/data-modal";
import { BillsModal } from "@/components/payments/bills-modal";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  Smartphone,
  Zap,
  GraduationCap,
  Users,
  Plus,
  ArrowRight,
  CheckCircle,
  CreditCard,
  ArrowUpRight,
  Eye,
  User as UserIcon,
  Home,
  Receipt,
  Settings,
  Bell,
  TrendingUp,
  RefreshCw
} from "lucide-react";
import { ProfileIcon, EyeOffIcon, AddMoneyIcon, AirtimeIcon, DataIcon, ElectricityIcon, CableIcon, ExamPinIcon, ReferEarnIcon } from "@/components/ui/material-dashboard-icons";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  // User data state
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // Dashboard analytics state
  const [analytics, setAnalytics] = useState({
    totalSpent: 0,
    totalReceived: 0,
    monthlyGoal: 100000,
    goalProgress: 0,
    transactionsCount: 0,
    avgTransaction: 0
  });

  // Load user data
  useEffect(() => {
    fetchUserData();

    // Set up polling to check for balance updates every 30 seconds
    const interval = setInterval(() => {
      fetchUserData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Load analytics data
  useEffect(() => {
    fetch("/api/dashboard/analytics")
      .then((res) => res.json())
      .then((data) => {
        if (data.analytics) {
          setAnalytics(data.analytics);
        }
      })
      .catch((error) => console.error("Failed to load analytics:", error));
  }, []);

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

  const refreshBalance = () => {
    fetchUserData();
  };

  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isAirtimeModalOpen, setIsAirtimeModalOpen] = useState(false);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [isBillsModalOpen, setIsBillsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTransactionSuccess = () => {
    setRefreshKey((prev) => prev + 1);
    // Refresh user balance after successful transaction
    setTimeout(() => {
      refreshBalance();
    }, 1000);
  };

  const handleWithdrawSuccess = () => {
    setRefreshKey((prev) => prev + 1);
    // Refresh user balance after successful withdrawal
    setTimeout(() => {
      refreshBalance();
    }, 1000);
  };

  // Paystack verification logic
  useEffect(() => {
    let isVerifying = false; // Prevent duplicate calls

    const params = new URLSearchParams(window.location.search);
    const reference = params.get("reference") || params.get("trxref");

    if (reference && !isVerifying) {
      isVerifying = true;
      console.log("Processing Paystack callback with reference:", reference);

      fetch("/api/user")
        .then((res) => res.json())
        .then((data) => {
          if (data.user && data.user.id) {
            console.log("Verifying payment for user:", data.user.id);

            fetch("/api/wallet/deposit/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ reference, userId: data.user.id }),
            })
              .then((res) => res.json())
              .then((result) => {
                console.log("Verification result:", result);

                if (result.error) {
                  console.error("Deposit verification failed:", result.error);
                  // Could show error toast here
                } else {
                  console.log("Deposit verification successful:", result.message);
                  // Refresh the page data to show updated balance
                  setRefreshKey((prev) => prev + 1);
                  fetchUserData();
                }

                // Clean up URL parameters
                const url = new URL(window.location.href);
                url.searchParams.delete("reference");
                url.searchParams.delete("trxref");
                window.history.replaceState({}, document.title, url.pathname);
              })
              .catch((error) => {
                console.error("Deposit verification error:", error);
                setRefreshKey((prev) => prev + 1);

                // Clean up URL parameters even on error
                const url = new URL(window.location.href);
                url.searchParams.delete("reference");
                url.searchParams.delete("trxref");
                window.history.replaceState({}, document.title, url.pathname);
              })
              .finally(() => {
                isVerifying = false;
              });
          } else {
            console.error("No user found for verification");
            isVerifying = false;
          }
        })
        .catch((error) => {
          console.error("Failed to get user for verification:", error);
        });
    }
  }, []);

  const [username, setUsername] = useState<string>("");
  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => {
        console.log("User data received:", data); // Debug log
        if (data.user) {
          let displayName = "User"; // Default fallback

          // Try different name fields
          if (data.user.fullName) {
            displayName = data.user.fullName.trim().split(' ')[0];
          } else if (data.user.firstName) {
            displayName = data.user.firstName;
          } else if (data.user.name) {
            displayName = data.user.name.trim().split(' ')[0];
          } else if (data.user.username) {
            displayName = data.user.username.trim().split(' ')[0];
          }

          setUsername(displayName);
          console.log("Setting username to:", displayName); // Debug log
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean Header */}
      <header className="sticky z-40 py-4 -my-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/profile')}
                className="flex items-center gap-3 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-900 font-medium">Hi, {username || "User"}</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              {/* Quick actions could go here */}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -my-12">
        {/* Wallet Card - Clean Design */}
        <div className="max-w-md mx-auto mb-8">
          <WalletCard
            onDeposit={() => setIsDepositModalOpen(true)}
            onWithdraw={() => setIsWithdrawModalOpen(true)}
            onTransfer={() => setIsWithdrawModalOpen(true)}
            refreshTrigger={refreshKey}
          />
        </div>

        {/* Quick Actions - Modern Grid */}
        <div className="mb-8">
          <div className="max-w-lg mx-auto">
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  icon: AirtimeIcon,
                  label: "Airtime",
                  color: "bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 border border-blue-100",
                  onClick: () => router.push('/services/airtime')
                },
                {
                  icon: DataIcon,
                  label: "Data",
                  color: "bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 border border-purple-100",
                  onClick: () => router.push('/services/airtime')
                },
                {
                  icon: ElectricityIcon,
                  label: "Bills",
                  color: "bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 border border-amber-100",
                  onClick: () => setIsBillsModalOpen(true)
                },
                {
                  icon: ExamPinIcon,
                  label: "Cable TV",
                  color: "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 border border-emerald-100",
                  onClick: () => router.push('/services/cable')
                },
                {
                  icon: CableIcon,
                  label: "Exam Pin",
                  color: "bg-pink-500/10 hover:bg-pink-500/20 text-pink-600 border border-pink-100",
                  onClick: () => setIsBillsModalOpen(true)
                },
                {
                  icon: ReferEarnIcon,
                  label: "Refer",
                  color: "bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 border border-indigo-100",
                  onClick: () => router.push('/elevatex')
                }
              ].map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`p-4 rounded-2xl transition-all duration-300 ${action.color} hover:shadow-lg hover:-translate-y-1 flex flex-col items-center gap-3 active:scale-95`}
                >
                  <div className="p-2 bg-white rounded-full shadow-sm">
                    <action.icon className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-semibold">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Transaction History - Clean Card */}
        <div className="max-w-4xl mx-auto">
          <TransactionHistory refreshKey={refreshKey} />
        </div>
      </main>

      {/* Modals with consistent styling */}
      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        onSuccess={handleTransactionSuccess}
      />
      {/* <AirtimeModal
        isOpen={isAirtimeModalOpen}
        onClose={() => setIsAirtimeModalOpen(false)}
        onSuccess={handleTransactionSuccess}
      />
      <DataModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
        onSuccess={handleTransactionSuccess}
      /> */}
      <BillsModal
        isOpen={isBillsModalOpen}
        onClose={() => setIsBillsModalOpen(false)}
        onSuccess={handleTransactionSuccess}
      />
      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        onSuccess={handleWithdrawSuccess}
      />
    </div>
  );
}