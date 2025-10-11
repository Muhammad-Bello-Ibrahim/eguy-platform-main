"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface AirtimePlan {
  _id?: string;
  network: string;
  amount: number;
  price: number;
  apiPrice: number;
}

const networks = [
  { value: "MTN", label: "MTN" },
  { value: "AIRTEL", label: "Airtel" },
  { value: "GLO", label: "Glo" },
  { value: "9MOBILE", label: "9Mobile" },
];

export default function AirtimePlansAdminPage() {
  const [plans, setPlans] = useState<AirtimePlan[]>([]);
  const [form, setForm] = useState<Partial<AirtimePlan>>({ network: "", amount: 0, price: 0, apiPrice: 0 });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  async function fetchPlans() {
    setFetching(true);
    const res = await fetch("/api/admin/airtime-plans");
    let data = await res.json();
    if (!data || data.length === 0) {
      // Mock data
      data = [
        { _id: "mock1", network: "MTN", amount: 100, price: 105, apiPrice: 100 },
        { _id: "mock2", network: "AIRTEL", amount: 200, price: 210, apiPrice: 200 },
      ];
    }
    setPlans(data);
    setFetching(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    if (editingId) {
      await fetch(`/api/admin/airtime-plans/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/admin/airtime-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setForm({ network: "", amount: 0, price: 0, apiPrice: 0 });
    setEditingId(null);
    setLoading(false);
    fetchPlans();
  }

  function handleEdit(plan: AirtimePlan) {
    setForm(plan);
    setEditingId(plan._id!);
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/airtime-plans/${id}`, { method: "DELETE" });
    fetchPlans();
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Airtime Plans</h1>
      <form onSubmit={handleSubmit} className="space-y-2 mb-8">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label>Network</Label>
            <Select value={form.network || ""} onValueChange={v => setForm(f => ({ ...f, network: v }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select network" />
              </SelectTrigger>
              <SelectContent>
                {networks.map(n => (
                  <SelectItem key={n.value} value={n.value}>{n.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Amount (₦)</Label>
            <Input type="number" value={form.amount || 0} onChange={e => setForm(f => ({ ...f, amount: Number(e.target.value) }))} required />
          </div>
          <div>
            <Label>Your Price (₦)</Label>
            <Input type="number" value={form.price || 0} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} required />
          </div>
          <div>
            <Label>API Price (₦)</Label>
            <Input type="number" value={form.apiPrice || 0} onChange={e => setForm(f => ({ ...f, apiPrice: Number(e.target.value) }))} required />
          </div>
        </div>
        <Button type="submit" disabled={loading}>{editingId ? "Update" : "Add"} Plan</Button>
        {editingId && <Button type="button" variant="outline" onClick={() => { setForm({ network: "", amount: 0, price: 0, apiPrice: 0 }); setEditingId(null); }}>Cancel</Button>}
      </form>
      {fetching ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex space-x-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-32" />
            </div>
          ))}
        </div>
      ) : (
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Network</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Your Price</th>
              <th className="p-2">API Price</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map(plan => (
              <tr key={plan._id} className="border-t">
                <td className="p-2">{plan.network}</td>
                <td className="p-2">₦{plan.amount}</td>
                <td className="p-2">₦{plan.price}</td>
                <td className="p-2">₦{plan.apiPrice}</td>
                <td className="p-2">
                  <Button size="sm" onClick={() => handleEdit(plan)}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(plan._id!)} className="ml-2">Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
