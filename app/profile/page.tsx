"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Pencil, X, ArrowLeft } from "lucide-react";
import PayoutAccountsModal from "@/components/dashboard/payout-accounts-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  payoutAccount?: {
    bank: string;
    accountNumber: string;
    accountName: string;
  };
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
          <button title="Close" className="absolute top-3 right-3 p-2 rounded-full hover:bg-slate-100" onClick={onClose}><X className="h-5 w-5" /></button>
          <h2 className="text-lg font-bold mb-4 text-slate-900">Edit Profile</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1" htmlFor="edit-fullname">Full Name</label>
              <input id="edit-fullname" type="text" value={form.fullName} placeholder="Full Name" onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-300 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1" htmlFor="edit-phone">Phone</label>
              <input id="edit-phone" type="text" value={form.phone} placeholder="Phone" onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-300 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1" htmlFor="edit-avatar">Avatar URL</label>
              <input id="edit-avatar" type="text" value={form.avatar} placeholder="Avatar URL" onChange={e => setForm(f => ({ ...f, avatar: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-300 focus:outline-none" />
            </div>
            {error && <div className="text-red-600 text-xs mb-2">{error}</div>}
            <button type="submit" className="w-full mt-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
          </form>
        </div>
      </div>
    );
  }

  const [copied, setCopied] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
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
    return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center text-slate-500">User not found.</div>;
  }

  return (
    <>
      <EditProfileModal
        user={user}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={fields => setUser(u => u ? { ...u, ...fields } : u)}
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        {/* Header */}
        <header className="sticky top-0 z-40 py-4 bg-white/80 backdrop-blur-sm border-b border-slate-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </button>
              <h1 className="text-xl font-bold text-slate-900">Profile</h1>
              <div className="w-20"></div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
          <div className="max-w-md mx-auto space-y-6">
            {/* Profile Card */}
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <img
                      src={user.avatar || "/placeholder-user.jpg"}
                      alt={user.fullName}
                      className="w-20 h-20 rounded-full border-4 border-blue-100 object-cover"
                    />
                    <button
                      className="absolute -bottom-1 -right-1 p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-colors"
                      aria-label="Edit Profile"
                      title="Edit Profile"
                      onClick={() => setEditOpen(true)}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-1">{user.fullName}</h2>
                  <p className="text-slate-600 mb-1">{user.email}</p>
                  <p className="text-sm text-slate-500 mb-4">{user.phone}</p>

                  {/* ElevateX Status */}
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-sm font-medium text-slate-700">ElevateX:</span>
                    <Badge className={`${elevateXStatus ? "bg-green-100 text-green-800 border-green-300" : "bg-slate-100 text-slate-600 border-slate-300"}`}>
                      {elevateXStatus ? "Activated" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Referral Link */}
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={`${typeof window !== "undefined" ? window.location.origin : ""}/signup?ref=${user.referralCode}`}
                    readOnly
                    placeholder="Referral Link"
                    className="font-mono text-sm bg-slate-50 px-3 py-2 rounded-lg w-full text-center border border-slate-200"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const link = `${window.location.origin}/signup?ref=${user.referralCode}`;
                      navigator.clipboard.writeText(link);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="shrink-0"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Payout Account */}
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-900">Payout Account</CardTitle>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setPayoutOpen(true)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {user.payoutAccount ? (
                  <div className="bg-slate-50 rounded-lg p-4 text-sm space-y-2 border border-slate-200">
                    <div><span className="font-medium text-slate-700">Bank:</span> <span className="text-slate-900">{user.payoutAccount.bank}</span></div>
                    <div><span className="font-medium text-slate-700">Account Number:</span> <span className="text-slate-900">{user.payoutAccount.accountNumber}</span></div>
                    <div><span className="font-medium text-slate-700">Account Name:</span> <span className="text-slate-900">{user.payoutAccount.accountName}</span></div>
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">No payout account added yet.</p>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-sm"
                onClick={() => router.push("/kyc")}
              >
                <span>KYC Status: </span>
                <Badge className={`ml-2 ${user.kycStatus === "verified" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                  {user.kycStatus}
                </Badge>
                <ChevronRight className="h-5 w-5 ml-auto" />
              </Button>

              <Button
                variant="outline"
                className="w-full border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-3 rounded-xl"
                onClick={() => router.push("/settings")}
              >
                <span>Settings</span>
                <ChevronRight className="h-5 w-5 ml-auto" />
              </Button>

              <Button
                variant="outline"
                className="w-full border-red-200 text-red-600 hover:bg-red-50 font-semibold py-3 rounded-xl"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
