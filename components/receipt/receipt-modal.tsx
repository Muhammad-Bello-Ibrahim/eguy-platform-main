"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Mail,
  X,
  Receipt as ReceiptIcon,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Plus,
  Minus,
  ArrowUpRight,
  CreditCard,
  Smartphone,
  Zap,
  GraduationCap,
  ArrowDownLeft,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  type: "deposit" | "withdrawal" | "transfer" | "payment" | "referral_bonus" | "airtime" | "data" | "electricity" | "cable";
  amount: number;
  description: string;
  status: "pending" | "completed" | "failed" | "cancelled";
  reference?: string;
  createdAt: string;
  category?: string;
  recipient?: string;
  provider?: string;
  metadata?: any;
}

interface ReceiptModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ReceiptModal({ transaction, isOpen, onClose }: ReceiptModalProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  if (!transaction || !isOpen) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTransactionIcon = (type: string) => {
    const iconClass = "h-5 w-5";
    switch (type) {
      case "deposit":
        return <div className="p-3 bg-green-500/10 rounded-full text-green-500"><Plus className={iconClass} /></div>;
      case "withdrawal":
        return <div className="p-3 bg-red-500/10 rounded-full text-red-500"><Minus className={iconClass} /></div>;
      case "transfer":
        return <div className="p-3 bg-blue-500/10 rounded-full text-blue-500"><ArrowUpRight className={iconClass} /></div>;
      case "payment":
        return <div className="p-3 bg-orange-500/10 rounded-full text-orange-500"><CreditCard className={iconClass} /></div>;
      case "referral_bonus":
        return <div className="p-3 bg-purple-500/10 rounded-full text-purple-500"><Users className={iconClass} /></div>;
      case "airtime":
        return <div className="p-3 bg-cyan-500/10 rounded-full text-cyan-500"><Smartphone className={iconClass} /></div>;
      case "data":
        return <div className="p-3 bg-indigo-500/10 rounded-full text-indigo-500"><Smartphone className={iconClass} /></div>;
      case "electricity":
        return <div className="p-3 bg-yellow-500/10 rounded-full text-yellow-500"><Zap className={iconClass} /></div>;
      case "cable":
        return <div className="p-3 bg-pink-500/10 rounded-full text-pink-500"><GraduationCap className={iconClass} /></div>;
      default:
        return <div className="p-3 bg-slate-500/10 rounded-full text-slate-500"><ArrowDownLeft className={iconClass} /></div>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold border border-green-500/20">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Success</span>
          </div>
        );
      case "pending":
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-bold border border-yellow-500/20">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending</span>
          </div>
        );
      case "failed":
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-bold border border-red-500/20">
            <XCircle className="w-3.5 h-3.5" />
            <span>Failed</span>
          </div>
        );
      case "cancelled":
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-500/10 text-slate-500 text-xs font-bold border border-slate-500/20">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Cancelled</span>
          </div>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const response = await fetch("/api/receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId: transaction.id,
          action: "generate"
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate PDF receipt");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `eGuy-Receipt-${transaction.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (error: any) {
      console.error("Error generating PDF receipt:", error);
      alert(error.message || "Failed to generate PDF receipt.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const sendReceiptEmail = async () => {
    setIsSendingEmail(true);
    try {
      const response = await fetch("/api/receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId: transaction.id,
          action: "email"
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send receipt email");
      }

      const result = await response.json();
      alert(result.message || "Receipt sent successfully!");
    } catch (error: any) {
      console.error("Error sending email:", error);
      alert("Failed to send receipt email.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background-dark/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-card-dark rounded-3xl shadow-2xl border border-slate-800/50 overflow-hidden animate-in zoom-in-95 duration-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-primary/20 blur-[80px] rounded-full pointer-events-none" />

        {/* Header */}
        <div className="relative p-6 pb-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <ReceiptIcon className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-white">Receipt</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 relative">

          {/* Amount Section */}
          <div className="text-center space-y-2 py-4 border-b border-slate-800/50">
            <p className="text-slate-400 text-sm font-medium">Total Amount</p>
            <h1 className={cn(
              "text-3xl font-extrabold tracking-tight",
              transaction.type === 'deposit' || transaction.type === 'referral_bonus' ? "text-green-500" : "text-white"
            )}>
              {transaction.type === 'deposit' || transaction.type === 'referral_bonus' ? '+' : '-'}
              {formatCurrency(transaction.amount)}
            </h1>
            <div className="flex justify-center pt-1">
              {getStatusBadge(transaction.status)}
            </div>
          </div>

          {/* Details List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Transaction Type</span>
              <span className="text-white font-semibold capitalize">{transaction.type.replace(/_/g, " ")}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Date & Time</span>
              <span className="text-white font-medium">{formatDate(transaction.createdAt)}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Reference</span>
              <span className="text-white font-mono text-xs bg-slate-800/50 px-2 py-1 rounded select-all">
                {transaction.reference || (transaction.id ? transaction.id.slice(0, 18) + '...' : 'N/A')}
              </span>
            </div>

            {transaction.description && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Description</span>
                <span className="text-white font-medium text-right max-w-[60%] truncate">{transaction.description}</span>
              </div>
            )}
            
            {/* Withdrawal Specific Details */}
            {transaction.type === 'withdrawal' && transaction.metadata?.payoutAccount && (
              <>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Bank Name</span>
                  <span className="text-white font-medium text-right">{transaction.metadata.payoutAccount.bank || transaction.metadata.payoutAccount.bankCode}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Account Number</span>
                  <span className="text-white font-medium text-right">{transaction.metadata.payoutAccount.accountNumber}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Account Holder</span>
                  <span className="text-white font-medium text-right truncate max-w-[60%]">{transaction.metadata.payoutAccount.accountName}</span>
                </div>
              </>
            )}

            {/* Generic Provider/Recipient if not withdrawal */}
            {transaction.type !== 'withdrawal' && transaction.provider && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Provider</span>
                <span className="text-white font-medium text-right">{transaction.provider}</span>
              </div>
            )}
            {transaction.type !== 'withdrawal' && transaction.recipient && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Recipient</span>
                <span className="text-white font-medium text-right max-w-[60%] truncate">{transaction.recipient}</span>
              </div>
            )}
            
            {/* Any other flat metadata */}
            {transaction.metadata && Object.entries(transaction.metadata)
              .filter(([key, value]) => key !== 'payoutAccount' && key !== 'paystackTransfer' && typeof value === 'string')
              .map(([key, value]) => (
                <div key={key} className="flex items-center justify-between text-sm">
                  <span className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="text-white font-medium text-right max-w-[60%] truncate">{value as string}</span>
                </div>
              ))
            }
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button
              onClick={generatePDF}
              disabled={isGeneratingPDF}
              className="bg-slate-800 hover:bg-slate-700 text-white border-0 h-10 rounded-xl"
            >
              {isGeneratingPDF ? (
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Save PDF
            </Button>

            <Button
              onClick={sendReceiptEmail}
              disabled={isSendingEmail}
              className="bg-primary hover:bg-primary/90 text-background-dark font-bold h-10 rounded-xl"
            >
              {isSendingEmail ? (
                <span className="w-4 h-4 border-2 border-background-dark/20 border-t-background-dark rounded-full animate-spin mr-2" />
              ) : (
                <Mail className="w-4 h-4 mr-2" />
              )}
              Email
            </Button>
          </div>

          <p className="text-center text-[10px] text-slate-500 font-medium pt-2">
            eGuy Digital Wallet • Transaction Receipt
          </p>
        </div>
      </div>
    </div>
  );
}
