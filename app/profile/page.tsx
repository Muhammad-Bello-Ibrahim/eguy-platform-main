"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Pencil, X, ArrowLeft } from "lucide-react";
import PayoutAccountsModal from "@/components/dashboard/payout-accounts-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface User {
  id: string;
  fullName?: string;
  name?: string;
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
    swiftCode?: string;
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

  async function fetchUser() {
    try {
      const res = await fetch("/api/user");
      const data = await res.json();

      console.log("Profile API response:", data); // Debug log
      console.log("User object:", data.user); // Debug log

      if (data.user) {
        setUser(data.user);
        setElevateXStatus(data.user?.packs?.includes("ElevateX"));
      } else if (data.error) {
        console.error("API Error:", data.error);
      }
    } catch (error) {
      console.error("Fetch user error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  async function handleSavePayoutAccount(account: any) {
    setSavingPayout(true);
    setPayoutError(null);
    try {
      const response = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payoutAccount: account })
      });

      if (!response.ok) {
        throw new Error("Failed to save payout account");
      }

      // Refresh user data from database to get updated payout account
      await fetchUser();

      setPayoutOpen(false);
    } catch (error: any) {
      setPayoutError(error.message || "Failed to save payout account");
    } finally {
      setSavingPayout(false);
    }
  }

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
          <button title="Close" className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100" onClick={onClose}><X className="h-5 w-5 text-gray-600" /></button>
          <h2 className="text-lg font-bold mb-4 text-gray-900">Edit Profile</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-700" htmlFor="edit-fullname">Full Name</label>
              <input id="edit-fullname" type="text" value={form.fullName} placeholder="Full Name" onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-gray-900" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-700" htmlFor="edit-phone">Phone</label>
              <input id="edit-phone" type="text" value={form.phone} placeholder="Phone" onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-gray-900" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-700" htmlFor="edit-avatar">Avatar URL</label>
              <input id="edit-avatar" type="text" value={form.avatar} placeholder="Avatar URL" onChange={e => setForm(f => ({ ...f, avatar: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-gray-900" />
            </div>
            {error && <div className="text-red-600 text-xs mb-2 bg-red-50 p-2 rounded">{error}</div>}
            <button type="submit" className="w-full mt-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
          </form>
        </div>
      </div>
    );
  }

  const [copied, setCopied] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }
  if (!user) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-600">User not found.</div>;
  }

  return (
    <>
      <EditProfileModal
        user={user}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={fields => setUser(u => u ? { ...u, ...fields } : u)}
      />
      <PayoutAccountsModal
        open={payoutOpen}
        onClose={() => setPayoutOpen(false)}
        onSave={handleSavePayoutAccount}
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        {/* Main Content */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
          <div className="max-w-lg mx-auto space-y-6">
            {/* Profile Card */}
            <Card className="bg-white border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="relative inline-block mb-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      {user?.fullName?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <button
                      className="absolute -bottom-2 -right-2 p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-200 hover:scale-105"
                      aria-label="Edit Profile"
                      title="Edit Profile"
                      onClick={() => setEditOpen(true)}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{user?.fullName || user?.name || "Unknown User"}</h2>
                  <p className="text-gray-600 mb-1 text-lg">{user?.email || "No email"}</p>
                  <p className="text-gray-500 mb-6">{user?.phone || "No phone"}</p>

                  {/* ElevateX Status */}
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <span className="text-sm font-medium text-gray-700">ElevateX Status:</span>
                    <Badge className={`${elevateXStatus ? "bg-green-100 text-green-800 border-green-300 hover:bg-green-200" : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"} px-3 py-1`}>
                      {elevateXStatus ? "✅ Activated" : "⏸️ Inactive"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Referral Link */}
            <Card className="bg-white border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Referral Link</h3>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={`${typeof window !== "undefined" ? window.location.origin : ""}/signup?ref=${user?.referralCode || ""}`}
                      readOnly
                      placeholder="Referral Link"
                      className="font-mono text-sm bg-gray-50 px-4 py-3 rounded-lg w-full text-center border border-gray-200 focus:border-blue-500 focus:outline-none"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const link = `${window.location.origin}/signup?ref=${user?.referralCode || ""}`;
                        navigator.clipboard.writeText(link);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className={`shrink-0 px-4 py-2 ${copied ? "bg-green-100 text-green-700 border-green-300" : "hover:bg-gray-50"}`}
                    >
                      {copied ? "✅ Copied!" : "📋 Copy"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payout Account */}
            <Card className="bg-white border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-gray-900">Payout Account</CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPayoutOpen(true)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    {user?.payoutAccount ? "Edit" : "Add"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {user?.payoutAccount ? (
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-200">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Bank:</span>
                        <span className="text-sm font-semibold text-gray-900">{user?.payoutAccount?.bank || "N/A"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Account Number:</span>
                        <span className="text-sm font-mono font-semibold text-gray-900">{user?.payoutAccount?.accountNumber || "N/A"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Account Name:</span>
                        <span className="text-sm font-semibold text-gray-900">{user?.payoutAccount?.accountName || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <span className="text-yellow-600 text-sm">⚠️</span>
                      </div>
                      <div>
                        <p className="text-yellow-800 font-medium">No payout account added</p>
                        <p className="text-yellow-700 text-sm">Add your bank details for withdrawals</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => router.push("/kyc")}
              >
                <span className="mr-3">KYC Verification</span>
                <Badge className={`px-2 py-1 ${user?.kycStatus === "verified" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                  {user?.kycStatus === "verified" ? "✅ Verified" : "⏳ Pending"}
                </Badge>
                <ChevronRight className="h-5 w-5 ml-auto" />
              </Button>

              <Button
                variant="outline"
                className="w-full border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-700 font-semibold py-4 rounded-xl transition-all duration-200"
                onClick={() => router.push("/settings")}
              >
                <span className="mr-3">Account Settings</span>
                <ChevronRight className="h-5 w-5 ml-auto" />
              </Button>

              <Button
                variant="outline"
                className="w-full border-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 font-semibold py-4 rounded-xl transition-all duration-200"
                onClick={handleLogout}
              >
                <span className="mr-3">Sign Out</span>
                <ArrowLeft className="h-5 w-5 ml-auto rotate-180" />
              </Button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
