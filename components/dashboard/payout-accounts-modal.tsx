import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

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

  useEffect(() => {
    async function fetchBanks() {
      const res = await fetch("/api/paystack-banks");
      const data = await res.json();
      if (data.banks) setBanks(data.banks);
    }
    if (open) fetchBanks();
  }, [open]);

  async function handleDetectName() {
    setLoading(true);
    setError(null);
    try {
      if (accountNumber.length === 10 && bankCode) {
        const res = await fetch("/api/resolve-account", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ account_number: accountNumber, bank_code: bankCode })
        });
        const data = await res.json();
        if (data.account_name) {
          setAccountName(data.account_name);
        } else {
          setError(data.error || "Could not resolve account name.");
        }
      } else {
        setError("Enter a valid account number and select a bank.");
      }
    } catch (err: any) {
      setError("Failed to detect account name.");
    } finally {
      setLoading(false);
    }
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const bankObj = banks.find(b => b.code === bankCode);
    if (!bankObj || !accountNumber || !accountName) {
      setError("Please fill all fields.");
      return;
    }
    onSave({ bank: bankObj.name, accountNumber, accountName });
    onClose();
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm relative">
        <button title="Close" className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100" onClick={onClose}><X className="h-5 w-5" /></button>
        <h2 className="text-lg font-bold mb-2 text-green-700">Add Payout Account</h2>
        <p className="text-sm text-gray-500 mb-4">Link your bank or fintech account for payouts. Your account name will be auto-detected for security.</p>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1" htmlFor="bank">Bank/Fintech</label>
            <select id="bank" value={bankCode} onChange={e => setBankCode(e.target.value)} className="w-full border rounded px-2 py-1">
              <option value="">Select Bank/Fintech</option>
              {banks.map(b => <option key={b.code} value={b.code}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1" htmlFor="accountNumber">Account Number</label>
            <input id="accountNumber" type="text" value={accountNumber} maxLength={10} placeholder="Account Number" onChange={e => setAccountNumber(e.target.value.replace(/\D/g, ""))} className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1" htmlFor="accountName">Account Name</label>
            <div className="flex gap-2">
              <input id="accountName" type="text" value={accountName} placeholder="Account Name" readOnly className="w-full border rounded px-2 py-1" />
              <button type="button" className="px-3 py-1 rounded bg-green-100 text-green-700 font-semibold" onClick={handleDetectName} disabled={loading || !bankCode || accountNumber.length !== 10}>{loading ? "Detecting..." : "Detect"}</button>
            </div>
          </div>
          {error && <div className="text-red-600 text-xs mb-2">{error}</div>}
          <button type="submit" className="w-full mt-2 px-4 py-2 rounded bg-green-600 text-white font-semibold">Save</button>
        </form>
      </div>
    </div>
  );
}
