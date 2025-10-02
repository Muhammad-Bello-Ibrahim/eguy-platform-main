"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Pencil, X } from "lucide-react";
import PayoutAccountsModal from "@/components/dashboard/payout-accounts-modal";
import { Skeleton } from "@/components/ui/skeleton";

interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  referralCode: string;
  joined?: string;
  kycStatus: "pending" | "verified" | "rejected";
  packs?: string[];
  avatar?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [elevateXStatus, setElevateXStatus] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [payoutOpen, setPayoutOpen] = useState(false);
  const [savingPayout, setSavingPayout] = useState(false);
  const [payoutError, setPayoutError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/user");
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        setElevateXStatus(data.user?.packs?.includes("ElevateX"));
      }
      setLoading(false);
    }
    fetchUser();
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/signout", { method: "POST" });
    window.sessionStorage.clear(); // Clear all sessionStorage, including user
    router.push("/signin");
  }

  function EditProfileModal({ user, open, onClose, onSave }: { user: User; open: boolean; onClose: () => void; onSave: (u: Partial<User>) => void }) {
    const [form, setForm] = useState({
      fullName: user.fullName,
      phone: user.phone,
      avatar: user.avatar || ""
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    if (!open) return null;
    async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      setSaving(true);
      setError(null);
      try {
        const res = await fetch("/api/user", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        });
        if (!res.ok) {
          throw new Error("Failed to update profile");
        }
        onSave(form);
        onClose();
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setSaving(false);
      }
    }
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm relative">
          <button title="Close" className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100" onClick={onClose}><X className="h-5 w-5" /></button>
          <h2 className="text-lg font-bold mb-4 text-green-700">Edit Profile</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1" htmlFor="edit-fullname">Full Name</label>
              <input id="edit-fullname" type="text" value={form.fullName} placeholder="Full Name" onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1" htmlFor="edit-phone">Phone</label>
              <input id="edit-phone" type="text" value={form.phone} placeholder="Phone" onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1" htmlFor="edit-avatar">Avatar URL</label>
              <input id="edit-avatar" type="text" value={form.avatar} placeholder="Avatar URL" onChange={e => setForm(f => ({ ...f, avatar: e.target.value }))} className="w-full border rounded px-2 py-1" />
            </div>
            {error && <div className="text-red-600 text-xs mb-2">{error}</div>}
            <button type="submit" className="w-full mt-2 px-4 py-2 rounded bg-green-600 text-white font-semibold" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
          </form>
        </div>
      </div>
    );
  }

  const [copied, setCopied] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-10 w-2/3 rounded-xl" />
          <Skeleton className="h-8 w-full rounded-xl" />
          <Skeleton className="h-8 w-full rounded-xl" />
          <Skeleton className="h-8 w-1/2 rounded-xl" />
        </div>
      </div>
    );
  }
  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">User not found.</div>;
  }

  return (
    <>
      <EditProfileModal
        user={user}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={fields => setUser(u => u ? { ...u, ...fields } : u)}
      />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex flex-col items-center p-4 pb-24">
        <div className="w-full max-w-md mx-auto flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow mb-4">
            <div className="relative flex flex-col items-center pt-8 pb-4">
              <img
                src={user.avatar || "/placeholder-user.jpg"}
                alt={user.fullName}
                width={56}
                height={56}
                className="rounded-full border-2 border-green-200 mb-2"
              />
              <button
                className="absolute top-4 right-4 p-2 rounded-full bg-green-100 hover:bg-green-200 text-green-700 shadow"
                aria-label="Edit Profile"
                title="Edit Profile"
                onClick={() => setEditOpen(true)}
              >
                <Pencil className="h-5 w-5" />
              </button>
              <h1 className="text-lg font-bold text-green-700 mb-1">{user.fullName}</h1>
              <div className="text-sm text-gray-500 mb-1">{user.email}</div>
              <div className="text-xs text-gray-400 mb-2">{user.phone}</div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-xs font-semibold text-green-700">ElevateX:</span>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${elevateXStatus ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>{elevateXStatus ? "Activated" : "Inactive"}</span>
              </div>
            </div>
            <div className="px-6 pb-6">
              <div className="mb-4">
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={`${typeof window !== "undefined" ? window.location.origin : ""}/signup?ref=${user.referralCode}`}
                    readOnly
                    placeholder="Referral Link"
                    className="font-mono text-xs bg-gray-100 rounded px-2 py-1 w-full text-center border border-gray-200"
                  />
                  <button
                    className="px-4 py-2 rounded-xl bg-green-600 text-white font-semibold text-base shadow hover:bg-green-700 transition-all duration-200 active:scale-95"
                    title="Copy referral link"
                    onClick={() => {
                      const link = `${window.location.origin}/signup?ref=${user.referralCode}`;
                      navigator.clipboard.writeText(link);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-green-700">Payout Account</span>
                  <button
                    className="p-2 rounded-full bg-green-100 hover:bg-green-200 text-green-700"
                    title={user.payoutAccount ? "Edit payout account" : "Add payout account"}
                    onClick={() => setPayoutOpen(true)}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </div>
                {user.payoutAccount ? (
                  <div className="bg-gray-50 rounded-lg p-3 text-sm flex flex-col gap-1 border border-green-100">
                    <div><span className="font-semibold">Bank:</span> {user.payoutAccount.bank}</div>
                    <div><span className="font-semibold">Account Number:</span> {user.payoutAccount.accountNumber}</div>
                    <div><span className="font-semibold">Account Name:</span> {user.payoutAccount.accountName}</div>
                  </div>
                ) : (
                  <div className="text-xs text-gray-400">No payout account added yet.</div>
                )}
              </div>
              <PayoutAccountsModal
                open={payoutOpen}
                onClose={() => setPayoutOpen(false)}
                onSave={async account => {
                  setSavingPayout(true);
                  setPayoutError(null);
                  try {
                    const res = await fetch("/api/payout-account", {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(account)
                    });
                    const data = await res.json();
                    if (res.ok && data.user) {
                      setUser(u => u ? { ...u, payoutAccount: account } : u);
                      setPayoutOpen(false);
                    } else {
                      setPayoutError(data.error || "Failed to save payout account.");
                    }
                  } catch (err: any) {
                    setPayoutError("Network error.");
                  } finally {
                    setSavingPayout(false);
                  }
                }}
              />
              <button className="w-full mb-4 px-5 py-2 rounded-xl bg-green-600 text-white font-semibold text-base shadow hover:bg-green-700 transition-all duration-200 active:scale-95 flex items-center justify-between" onClick={() => router.push("/kyc")}> 
                <span className="text-left">KYC Status: <span className={`ml-2 text-xs font-bold px-2 py-1 rounded-full ${user.kycStatus === "verified" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{user.kycStatus}</span></span>
                <ChevronRight className="h-5 w-5 text-white" />
              </button>
              <button className="w-full mb-4 px-5 py-2 rounded-xl bg-green-600 text-white font-semibold text-base shadow hover:bg-green-700 transition-all duration-200 active:scale-95 flex items-center justify-between">
                <span className="text-left">Change Password</span>
                <ChevronRight className="h-5 w-5 text-white" />
              </button>
              <button className="w-full mb-4 px-5 py-2 rounded-xl bg-green-600 text-white font-semibold text-base shadow hover:bg-green-700 transition-all duration-200 active:scale-95 flex items-center justify-between">
                <span className="text-left">Settings</span>
                <ChevronRight className="h-5 w-5 text-white" />
              </button>
              <button
                className="w-full mb-4 px-5 py-2 rounded-xl font-semibold text-red-600 border border-red-200 bg-white hover:bg-red-50"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
