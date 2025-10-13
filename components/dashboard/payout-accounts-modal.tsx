import React, { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Bank {
  name: string;
  code: string;
}

export interface PayoutAccount {
  bank: string;
  accountNumber: string;
  accountName: string;
}

export default function PayoutAccountsModal({ open, onClose, onSave }: {
  open: boolean;
  onClose: () => void;
  onSave: (account: PayoutAccount) => void;
}) {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionTriggered, setDetectionTriggered] = useState(false);

  useEffect(() => {
    async function fetchBanks() {
      try {
        const res = await fetch("/api/paystack-banks");
        const data = await res.json();
        if (data.banks) setBanks(data.banks);
      } catch (error) {
        console.error("Failed to fetch banks:", error);
      }
    }
    if (open) fetchBanks();
  }, [open]);

  // Auto-detect account name when user finishes typing 10 digits
  useEffect(() => {
    if (accountNumber.length === 10 && bankCode && !detectionTriggered) {
      setDetectionTriggered(true);
      handleDetectName();
    } else if (accountNumber.length < 10) {
      setDetectionTriggered(false);
    }
  }, [accountNumber, bankCode, detectionTriggered]);

  async function handleDetectName() {
    if (!bankCode || accountNumber.length !== 10) {
      setError("Please select a bank and enter a 10-digit account number.");
      return;
    }

    setIsDetecting(true);
    setError(null);

    try {
      const res = await fetch("/api/resolve-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account_number: accountNumber, bank_code: bankCode })
      });

      const data = await res.json();

      if (data.account_name) {
        setAccountName(data.account_name);
        setError(null);
      } else {
        setError(data.error || "Could not resolve account name.");
        setAccountName("");
      }
    } catch (err: any) {
      setError("Failed to detect account name. Please try again.");
      setAccountName("");
    } finally {
      setIsDetecting(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    const bankObj = banks.find(b => b.code === bankCode);
    if (!bankObj || !accountNumber || !accountName) {
      setError("Please fill all fields and ensure account name is detected.");
      return;
    }

    if (accountNumber.length !== 10) {
      setError("Account number must be exactly 10 digits.");
      return;
    }

    setIsDetecting(true);
    setError(null);

    try {
      // Save to database
      const response = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payoutAccount: {
            bank: bankObj.name,
            accountNumber,
            accountName
          }
        })
      });

      if (!response.ok) {
        throw new Error("Failed to save payout account");
      }

      // Update local state to reflect the saved account
      onSave({ bank: bankObj.name, accountNumber, accountName });
      onClose();
    } catch (error: any) {
      setError(error.message || "Failed to save payout account");
    } finally {
      setIsDetecting(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 relative transform transition-all duration-200">
        <button
          title="Close"
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          onClick={onClose}
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Add Payout Account</h2>
          <p className="text-gray-600 text-sm">Link your bank account for secure withdrawals. Account name will be auto-detected for verification.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700" htmlFor="bank">
              Select Bank/Fintech
            </label>
            <div className="relative">
              <select
                id="bank"
                value={bankCode}
                onChange={e => setBankCode(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
              >
                <option value="">Choose your bank...</option>
                {banks.map(bank => (
                  <option key={bank.code} value={bank.code}>{bank.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700" htmlFor="accountNumber">
              Account Number
            </label>
            <div className="relative">
              <input
                id="accountNumber"
                type="text"
                value={accountNumber}
                maxLength={10}
                placeholder="Enter 10-digit account number"
                onChange={e => {
                  const value = e.target.value.replace(/\D/g, "");
                  setAccountNumber(value);
                  if (value.length === 10 && bankCode) {
                    setDetectionTriggered(true);
                  }
                }}
                className={`w-full border-2 rounded-lg px-4 py-3 text-gray-900 focus:outline-none transition-all ${
                  accountNumber.length === 10
                    ? "border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                    : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                }`}
              />
              {accountNumber.length === 10 && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500">
              {accountNumber.length}/10 digits • Auto-detection will trigger when complete
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700" htmlFor="accountName">
              Account Name
            </label>
            <div className="relative">
              <input
                id="accountName"
                type="text"
                value={accountName}
                placeholder={
                  accountNumber.length === 10 && bankCode
                    ? (isDetecting ? "Detecting account name..." : "Account name will be auto-detected")
                    : "Enter 10-digit account number to detect name"
                }
                readOnly
                className={`w-full border-2 rounded-lg px-4 py-3 text-gray-900 transition-all ${
                  isDetecting
                    ? "bg-blue-50 border-blue-300"
                    : accountName
                    ? "bg-green-50 border-green-500"
                    : "bg-gray-50 border-gray-200"
                }`}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                {isDetecting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                    <span className="text-xs text-blue-600 font-medium">Detecting...</span>
                  </>
                ) : accountName ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-xs text-green-600 font-medium">Verified</span>
                  </>
                ) : accountNumber.length === 10 && bankCode ? (
                  <>
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                    <span className="text-xs text-orange-600 font-medium">Ready to detect</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-5 w-5 text-gray-400" />
                    <span className="text-xs text-gray-500 font-medium">Waiting</span>
                  </>
                )}
              </div>
            </div>

            {/* Status messages */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                {isDetecting && (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border border-blue-500 border-t-transparent"></div>
                    <span className="text-blue-600">Detecting account name...</span>
                  </>
                )}
                {accountName && !isDetecting && (
                  <span className="text-green-600 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Account verified successfully
                  </span>
                )}
                {accountNumber.length === 10 && bankCode && !accountName && !isDetecting && (
                  <span className="text-orange-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Click detect or wait for auto-detection
                  </span>
                )}
              </div>

              {accountNumber.length === 10 && bankCode && !accountName && !isDetecting && (
                <button
                  type="button"
                  onClick={handleDetectName}
                  className="text-blue-600 hover:text-blue-700 font-medium underline"
                >
                  Detect Now
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={!bankCode || !accountNumber || !accountName || accountNumber.length !== 10 || isDetecting}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Save Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
