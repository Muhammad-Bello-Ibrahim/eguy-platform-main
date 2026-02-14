"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Pencil, Copy, LogOut, Shield, CreditCard, User as UserIcon, CheckCircle2, AlertCircle } from "lucide-react";
import PayoutAccountsModal from "@/components/dashboard/payout-accounts-modal";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [elevateXStatus, setElevateXStatus] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [payoutOpen, setPayoutOpen] = useState(false);
  const [savingPayout, setSavingPayout] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    fullName: "",
    phone: "",
    avatar: ""
  });
  const [saving, setSaving] = useState(false);

  async function fetchUser() {
    try {
      const res = await fetch("/api/user");
      const data = await res.json();

      if (data.user) {
        setUser(data.user);
        setElevateXStatus(data.user?.packs?.includes("ElevateX"));
        setEditForm({
          fullName: data.user.fullName || data.user.name || "",
          phone: data.user.phone || "",
          avatar: data.user.avatar || ""
        });
      } else if (data.error) {
        console.error("API Error:", data.error);
        toast({ title: "Error", description: "Failed to load profile", variant: "destructive" });
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
    try {
      const response = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payoutAccount: account })
      });

      if (!response.ok) throw new Error("Failed to save payout account");

      await fetchUser();
      setPayoutOpen(false);
      toast({ title: "Success", description: "Payout account updated successfully" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to save payout account", variant: "destructive" });
    } finally {
      setSavingPayout(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/signout", { method: "POST" });
    window.sessionStorage.clear();
    router.push("/signin");
  }

  const handleEditSubmit = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm)
      });

      if (!res.ok) throw new Error("Failed to update profile");

      setUser(prev => prev ? ({ ...prev, ...editForm }) : null);
      setEditOpen(false);
      toast({ title: "Success", description: "Profile updated successfully" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to update profile", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}/signup?ref=${user?.referralCode || ""}`;
    navigator.clipboard.writeText(link);
    toast({ title: "Copied!", description: "Referral link copied to clipboard" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">User not found</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="bg-gradient-to-b from-blue-600 to-blue-800 pb-32 pt-12 px-4">
        <div className="container max-w-lg mx-auto text-center text-white">
          <h1 className="text-2xl font-bold mb-2">My Profile</h1>
          <p className="text-blue-100">Manage your account settings</p>
        </div>
      </div>

      <div className="container max-w-lg mx-auto px-4 -mt-24 space-y-6">
        {/* Profile Stats Card */}
        <Card className="border-0 shadow-xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-slate-100 text-slate-400 text-2xl">
                    {user.fullName?.charAt(0) || user.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={() => setEditOpen(true)}
                  className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>

              <h2 className="text-xl font-bold text-slate-900">{user.fullName || user.name}</h2>
              <p className="text-slate-500 mb-4">{user.email}</p>

              <div className="flex gap-2 mb-6">
                <Badge variant="secondary" className={`px-3 py-1 ${elevateXStatus ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>
                  {elevateXStatus ? "ElevateX Active" : "In Free Tier"}
                </Badge>
                <Badge variant="outline" className={user.kycStatus === 'verified' ? "text-green-600 border-green-200" : "text-amber-600 border-amber-200"}>
                  KYC: {user.kycStatus || "Pending"}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <p className="text-xs text-slate-500 mb-1">Joined</p>
                  <p className="font-semibold text-slate-900">{new Date(user.joined || Date.now()).toLocaleDateString()}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <p className="text-xs text-slate-500 mb-1">Referral Code</p>
                  <p className="font-mono font-semibold text-slate-900">{user.referralCode || "---"}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payout & Settings Grid */}
        <div className="grid gap-4">
          <Card className="border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setPayoutOpen(true)}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Payout Account</h3>
                  <p className="text-sm text-slate-500">
                    {user.payoutAccount ? `${user.payoutAccount.bank} ••••${user.payoutAccount.accountNumber.slice(-4)}` : "Not set up"}
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-300" />
            </CardContent>
          </Card>

          <Card className="border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={copyReferralLink}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                  <UserIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Refer & Earn</h3>
                  <p className="text-sm text-slate-500">Share your link with friends</p>
                </div>
              </div>
              <Copy className="h-5 w-5 text-slate-300" />
            </CardContent>
          </Card>
        </div>

        {/* Logout Button */}
        <Button
          variant="ghost"
          className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 py-6"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Sign Out
        </Button>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Update your personal information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={editForm.fullName}
                onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatar">Avatar URL</Label>
              <Input
                id="avatar"
                value={editForm.avatar}
                onChange={(e) => setEditForm({ ...editForm, avatar: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleEditSubmit} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payout Modal - Reuse existing component or modernize if needed */}
      <PayoutAccountsModal
        open={payoutOpen}
        onClose={() => setPayoutOpen(false)}
        onSave={handleSavePayoutAccount}
      />
    </div>
  );
}



