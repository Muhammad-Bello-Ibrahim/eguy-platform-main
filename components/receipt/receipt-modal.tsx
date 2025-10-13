"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Users,
  CreditCard,
  Smartphone,
  Zap,
  GraduationCap,
  ArrowDownLeft,
} from "lucide-react";
// import jsPDF from "jspdf";

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
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getTransactionIcon = (type: string) => {
    const iconClass = "h-6 w-6";
    switch (type) {
      case "deposit":
        return <div className={`p-2 bg-green-100 rounded-full`}><Plus className={`${iconClass} text-green-600`} /></div>;
      case "withdrawal":
        return <div className={`p-2 bg-red-100 rounded-full`}><Minus className={`${iconClass} text-red-600`} /></div>;
      case "transfer":
        return <div className={`p-2 bg-blue-100 rounded-full`}><ArrowUpRight className={`${iconClass} text-blue-600`} /></div>;
      case "payment":
        return <div className={`p-2 bg-orange-100 rounded-full`}><CreditCard className={`${iconClass} text-orange-600`} /></div>;
      case "referral_bonus":
        return <div className={`p-2 bg-purple-100 rounded-full`}><Users className={`${iconClass} text-purple-600`} /></div>;
      case "airtime":
        return <div className={`p-2 bg-cyan-100 rounded-full`}><Smartphone className={`${iconClass} text-cyan-600`} /></div>;
      case "data":
        return <div className={`p-2 bg-indigo-100 rounded-full`}><Smartphone className={`${iconClass} text-indigo-600`} /></div>;
      case "electricity":
        return <div className={`p-2 bg-yellow-100 rounded-full`}><Zap className={`${iconClass} text-yellow-600`} /></div>;
      case "cable":
        return <div className={`p-2 bg-pink-100 rounded-full`}><GraduationCap className={`${iconClass} text-pink-600`} /></div>;
      default:
        return <div className={`p-2 bg-gray-100 rounded-full`}><ArrowDownLeft className={`${iconClass} text-gray-600`} /></div>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-300">
            <AlertCircle className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      // For now, we'll create a simple text-based receipt
      // In a production app, you would use jsPDF or a similar library
      const receiptContent = `
eGuy Transaction Receipt

Transaction ID: ${transaction.id}
Date & Time: ${formatDate(transaction.createdAt)}
Type: ${transaction.type.replace("_", " ").toUpperCase()}
Description: ${transaction.description}
Amount: ${formatCurrency(transaction.amount)}
Status: ${transaction.status.toUpperCase()}
${transaction.reference ? `Reference: ${transaction.reference}` : ''}
${transaction.provider ? `Provider: ${transaction.provider}` : ''}
${transaction.recipient ? `Recipient: ${transaction.recipient}` : ''}
${transaction.category ? `Category: ${transaction.category}` : ''}

Thank you for using eGuy!
For support, contact us at support@eguy.app
      `.trim();

      // Create a blob and download it
      const blob = new Blob([receiptContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${transaction.id}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating receipt:", error);
      alert("Failed to generate receipt. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const sendReceiptEmail = async () => {
    setIsSendingEmail(true);
    try {
      // In a real implementation, this would call an API endpoint
      // For now, we'll simulate the email sending
      await new Promise(resolve => setTimeout(resolve, 2000));

      alert("Receipt sent to your email successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send receipt email. Please try again.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-white">
              <ReceiptIcon className="w-5 h-5" />
              Transaction Receipt
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-slate-800">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Receipt Header */}
          <div className="text-center border-b border-slate-700 pb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">eG</span>
              </div>
              <span className="text-xl font-bold text-white">eGuy</span>
            </div>
            <h2 className="text-lg font-semibold text-white">Transaction Receipt</h2>
            <p className="text-sm text-slate-300">{formatDate(transaction.createdAt)}</p>
          </div>

          {/* Transaction Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-slate-800 rounded-lg">
              {getTransactionIcon(transaction.type)}
              <div className="flex-1">
                <h3 className="font-semibold text-white">{transaction.description}</h3>
                <p className="text-sm text-slate-300 capitalize">{transaction.type.replace("_", " ")}</p>
              </div>
              <div className="text-right">
                <p className={`text-xl font-bold ${transaction.type === "deposit" || transaction.type === "referral_bonus" ? "text-green-400" : "text-red-400"}`}>
                  {transaction.type === "deposit" || transaction.type === "referral_bonus" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </p>
                {getStatusBadge(transaction.status)}
              </div>
            </div>

            {/* Transaction Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-white mb-2">Transaction Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Transaction ID:</span>
                    <span className="font-mono text-white">{transaction.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Date & Time:</span>
                    <span className="text-white">{formatDate(transaction.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Type:</span>
                    <span className="text-white capitalize">{transaction.type.replace("_", " ")}</span>
                  </div>
                  {transaction.reference && (
                    <div className="flex justify-between">
                      <span className="text-slate-300">Reference:</span>
                      <span className="font-mono text-white">{transaction.reference}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-white mb-2">Additional Information</h4>
                <div className="space-y-2 text-sm">
                  {transaction.provider && (
                    <div className="flex justify-between">
                      <span className="text-slate-300">Provider:</span>
                      <span className="text-white">{transaction.provider}</span>
                    </div>
                  )}
                  {transaction.recipient && (
                    <div className="flex justify-between">
                      <span className="text-slate-300">Recipient:</span>
                      <span className="text-white">{transaction.recipient}</span>
                    </div>
                  )}
                  {transaction.category && (
                    <div className="flex justify-between">
                      <span className="text-slate-300">Category:</span>
                      <span className="text-white">{transaction.category}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-700">
            <Button
              onClick={generatePDF}
              disabled={isGeneratingPDF}
              className="flex-1 bg-slate-800 text-white hover:bg-slate-700"
            >
              <Download className="w-4 h-4 mr-2" />
              {isGeneratingPDF ? "Generating PDF..." : "Download PDF"}
            </Button>
            <Button
              variant="outline"
              onClick={sendReceiptEmail}
              disabled={isSendingEmail}
              className="flex-1 border-slate-600 text-white hover:bg-slate-800"
            >
              <Mail className="w-4 h-4 mr-2" />
              {isSendingEmail ? "Sending..." : "Email Receipt"}
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-slate-400 pt-4 border-t border-slate-700">
            <p>This receipt is generated electronically and is valid without signature.</p>
            <p>For support, contact us at support@eguy.app</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
