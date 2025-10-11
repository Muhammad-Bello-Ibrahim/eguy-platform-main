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
  ProfileIcon,
  EyeOffIcon,
  AddMoneyIcon,
  AirtimeIcon,
  DataIcon,
  ElectricityIcon,
  ExamPinIcon,
  ReferEarnIcon
} from "@/components/ui/material-dashboard-icons";
import { useRouter } from "next/navigation";
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
  User,
  Home,
  Receipt,
  Settings,
  Bell,
  TrendingUp
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();

  // Dashboard analytics state
  const [analytics, setAnalytics] = useState({
    totalSpent: 0,
    totalReceived: 0,
    monthlyGoal: 100000,
    goalProgress: 0,
    transactionsCount: 0,
    avgTransaction: 0
  });

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

  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isAirtimeModalOpen, setIsAirtimeModalOpen] = useState(false);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [isBillsModalOpen, setIsBillsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTransactionSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };
  const handleWithdrawSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // Paystack verification logic
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reference = params.get("reference") || params.get("trxref");
    if (reference) {
      fetch("/api/user")
        .then((res) => res.json())
        .then((data) => {
          if (data.user && data.user.id) {
            fetch("/api/wallet/deposit/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ reference, userId: data.user.id }),
            })
              .then((res) => res.json())
              .then((result) => {
                if (result.error) {
                  console.error("Deposit verification failed:", result.error);
                } else {
                  console.log("Deposit verification successful:", result.message);
                }
                setRefreshKey((prev) => prev + 1);
                const url = new URL(window.location.href);
                url.searchParams.delete("reference");
                url.searchParams.delete("trxref");
                window.history.replaceState({}, document.title, url.pathname);
              })
              .catch((error) => {
                console.error("Deposit verification error:", error);
                setRefreshKey((prev) => prev + 1);
                const url = new URL(window.location.href);
                url.searchParams.delete("reference");
                url.searchParams.delete("trxref");
                window.history.replaceState({}, document.title, url.pathname);
              });
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
        if (data.user && data.user.username) {
          setUsername(data.user.username.trim());
        }
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
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-900 font-medium">{username || "User"}</span>
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
        {/* Wallet Card - Clean and Prominent */}
        <div className="mb-8">
          <div className="max-w-md mx-auto">
            <WalletCard
              onDeposit={() => setIsDepositModalOpen(true)}
              onWithdraw={() => setIsWithdrawModalOpen(true)}
              onTransfer={() => {}}
              key={refreshKey}
            />
          </div>
        </div>

        {/* Quick Actions - Clean Grid */}
        <div className="mb-8">
          <div className="max-w-lg mx-auto">
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  icon: AirtimeIcon,
                  label: "Airtime",
                  color: "bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200",
                  onClick: () => setIsAirtimeModalOpen(true)
                },
                {
                  icon: DataIcon,
                  label: "Data",
                  color: "bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200",
                  onClick: () => setIsDataModalOpen(true)
                },
                {
                  icon: ElectricityIcon,
                  label: "Bills",
                  color: "bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200",
                  onClick: () => setIsBillsModalOpen(true)
                },
                {
                  icon: ExamPinIcon,
                  label: "Cable TV",
                  color: "bg-green-50 hover:bg-green-100 text-green-700 border border-green-200",
                  onClick: () => setIsBillsModalOpen(true)
                },
                {
                  icon: ExamPinIcon,
                  label: "Exam Pin",
                  color: "bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200",
                  onClick: () => setIsBillsModalOpen(true)
                },
                {
                  icon: ReferEarnIcon,
                  label: "Refer",
                  color: "bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200",
                  onClick: () => {}
                }
              ].map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`p-4 rounded-xl transition-all duration-200 ${action.color} hover:shadow-md flex flex-col items-center gap-2`}
                >
                  <action.icon className="w-6 h-6" />
                  <span className="text-sm font-medium">{action.label}</span>
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

      {/* Modals */}
      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        onSuccess={handleTransactionSuccess}
      />
      <AirtimeModal
        isOpen={isAirtimeModalOpen}
        onClose={() => setIsAirtimeModalOpen(false)}
        onSuccess={handleTransactionSuccess}
      />
      <DataModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
        onSuccess={handleTransactionSuccess}
      />
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