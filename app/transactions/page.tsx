"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Search, Download, ArrowDownLeft, ArrowUpRight,
  Wifi, Smartphone, CreditCard, Zap, Tv, Gift, HelpCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ReceiptModal } from "@/components/receipt/receipt-modal";
import { cn } from "@/lib/utils";
import { TransactionsListSkeleton } from "@/components/dashboard/skeletons";

interface Transaction {
  id: string;
  type: "deposit" | "withdrawal" | "transfer" | "payment" | "referral_bonus" | "airtime" | "data" | "electricity" | "cable";
  amount: number;
  description: string;
  status: "pending" | "completed" | "failed" | "cancelled";
  createdAt: string;
  category?: string;
  reference?: string;
  provider?: string;
  recipient?: string;
}

export default function AllTransactionsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"All" | "Inflow" | "Outflow" | "Service">("All");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/wallet/transactions");
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions || []);
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const openReceipt = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsReceiptModalOpen(true);
  };

  const closeReceipt = () => {
    setIsReceiptModalOpen(false);
    setSelectedTransaction(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isDeposit = (type: string) => ["deposit", "referral_bonus"].includes(type);
  const isService = (type: string) => ["airtime", "data", "electricity", "cable", "payment"].includes(type);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
      case "referral_bonus":
        return <ArrowDownLeft className="w-6 h-6" />;
      case "withdrawal":
      case "transfer":
        return <ArrowUpRight className="w-6 h-6" />;
      case "airtime":
      case "data":
        return <Smartphone className="w-6 h-6" />;
      case "electricity":
        return <Zap className="w-6 h-6" />;
      case "cable":
        return <Tv className="w-6 h-6" />;
      default:
        return <CreditCard className="w-6 h-6" />;
    }
  };

  const getTransactionColor = (type: string) => {
    if (isDeposit(type)) return "text-primary bg-primary/20";
    if (type === "withdrawal" || type === "transfer") return "text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800";
    return "text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800";
  };

  const filteredTransactions = transactions
    .filter((t) => {
      // Search filter
      const matchesSearch =
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.amount.toString().includes(searchTerm)) ||
        (t.reference && t.reference.toLowerCase().includes(searchTerm.toLowerCase()));

      // Category filter
      let matchesCategory = true;
      if (filter === "Inflow") matchesCategory = isDeposit(t.type);
      else if (filter === "Outflow") matchesCategory = ["withdrawal", "transfer"].includes(t.type);
      else if (filter === "Service") matchesCategory = isService(t.type);

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Group by date
  const groupedTransactions: Record<string, Transaction[]> = {};
  filteredTransactions.forEach((t) => {
    const dateClient = new Date(t.createdAt);
    // Reset hours to compare dates only
    dateClient.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let key = dateClient.toDateString();
    if (dateClient.getTime() === today.getTime()) key = "Today";
    else if (dateClient.getTime() === yesterday.getTime()) key = "Yesterday";
    else key = dateClient.toLocaleDateString("en-GB", { day: "numeric", month: "long" });

    if (!groupedTransactions[key]) groupedTransactions[key] = [];
    groupedTransactions[key].push(t);
  });

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display pb-24">
      {/* Search & Header */}
      <header className="sticky top-0 z-40 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md pt-8 pb-4 px-6 border-b border-slate-200 dark:border-primary/10">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-card-dark text-slate-600 dark:text-primary transition-transform active:scale-90"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-extrabold tracking-tight">Transactions</h1>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary transition-transform active:scale-90">
            <Download className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5 group-focus-within:text-primary transition-colors" />
          <input
            className="w-full bg-slate-100 dark:bg-card-dark border-none rounded-full py-3.5 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none"
            placeholder="Search by name, service or amount"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 mt-5 overflow-x-auto no-scrollbar -mx-2 px-2 pb-2">
          {["All", "Inflow", "Outflow", "Service"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={cn(
                "px-6 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all",
                filter === f
                  ? "bg-primary text-background-dark shadow-lg shadow-primary/20"
                  : "bg-slate-100 dark:bg-card-dark text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-primary/20"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      <main className="px-6 pt-4">
        {loading ? (
          <TransactionsListSkeleton />
        ) : Object.keys(groupedTransactions).length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <div className="w-16 h-16 bg-slate-100 dark:bg-card-dark rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 opacity-50" />
            </div>
            <p>No transactions found</p>
          </div>
        ) : (
          Object.entries(groupedTransactions).map(([date, dateTransactions]) => (
            <div key={date} className="mb-8">
              <h3 className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-4 px-1">
                {date}
              </h3>
              <div className="space-y-3">
                {dateTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    onClick={() => openReceipt(transaction)}
                    className="flex items-center p-4 bg-white dark:bg-card-dark/40 border border-slate-100 dark:border-primary/5 rounded-2xl active:scale-[0.98] transition-all cursor-pointer hover:border-primary/20"
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                      getTransactionColor(transaction.type)
                    )}>
                      {getTransactionIcon(transaction.type)}
                    </div>

                    <div className="ml-4 flex-1 min-w-0">
                      <h4 className="text-[15px] font-bold text-slate-800 dark:text-slate-100 truncate">
                        {transaction.description}
                      </h4>
                      <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                        {formatTime(transaction.createdAt)} • {transaction.category || transaction.type}
                      </p>
                    </div>

                    <div className="text-right whitespace-nowrap">
                      <span className={cn(
                        "text-[16px] font-extrabold",
                        isDeposit(transaction.type) ? "text-primary" : "text-slate-800 dark:text-slate-100"
                      )}>
                        {isDeposit(transaction.type) ? "+" : "-"}{formatCurrency(transaction.amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </main>

      {/* Floating Background Elements */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[5%] left-[-20%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px]"></div>
      </div>

      <ReceiptModal
        transaction={selectedTransaction}
        isOpen={isReceiptModalOpen}
        onClose={closeReceipt}
      />
    </div>
  );
}
