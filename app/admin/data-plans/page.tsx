"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

interface DataPlan {
  _id?: string;
  network: string;
  dataBundle: string;
  dataPlan: string;
  duration: string;
  type: string;
  status: string;
  price: number;
  apiPrice: number;
}

export default function DataPlansAdminPage() {
  const [plans, setPlans] = useState<DataPlan[]>([]);
  const [form, setForm] = useState<Partial<DataPlan>>({ network: "", dataBundle: "", dataPlan: "", duration: "", type: "", status: "Active", price: 0, apiPrice: 0 });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  async function fetchPlans() {
    setFetching(true);
    const res = await fetch("/api/admin/data-plans");
    let data = await res.json();
    if (!data || data.length === 0) {
      // Provide mock data if DB is empty
      data = [
        { _id: "mock1", network: "MTN", dataBundle: "1GB", dataPlan: "1", duration: "30 Days", type: "SME", status: "Active", price: 700, apiPrice: 650 },
        { _id: "mock2", network: "AIRTEL", dataBundle: "2GB", dataPlan: "20", duration: "30 Days", type: "GIFTING", status: "Active", price: 1400, apiPrice: 1300 },
        { _id: "mock3", network: "GLO", dataBundle: "3GB", dataPlan: "59", duration: "30 Days", type: "CORPORATE GIFTING", status: "Active", price: 2100, apiPrice: 2000 },
      ];
    }
    setPlans(data);
    setFetching(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    if (editingId) {
      await fetch(`/api/admin/data-plans/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/admin/data-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setForm({ network: "", dataBundle: "", dataPlan: "", duration: "", type: "", status: "Active", price: 0, apiPrice: 0 });
    setEditingId(null);
    setLoading(false);
    fetchPlans();
  }

  function handleEdit(plan: DataPlan) {
    setForm(plan);
    setEditingId(plan._id!);
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/data-plans/${id}`, { method: "DELETE" });
    fetchPlans();
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Data Plans</h1>
      <form onSubmit={handleSubmit} className="space-y-2 mb-8">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label>Network</Label>
            <Input value={form.network || ""} onChange={e => setForm(f => ({ ...f, network: e.target.value }))} required />
          </div>
          <div>
            <Label>Bundle</Label>
            <Input value={form.dataBundle || ""} onChange={e => setForm(f => ({ ...f, dataBundle: e.target.value }))} required />
          </div>
          <div>
            <Label>Plan Code</Label>
            <Input value={form.dataPlan || ""} onChange={e => setForm(f => ({ ...f, dataPlan: e.target.value }))} required />
          </div>
          <div>
            <Label>Duration</Label>
            <Input value={form.duration || ""} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} required />
          </div>
          <div>
            <Label>Type</Label>
            <Input value={form.type || ""} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} required />
          </div>
          <div>
            <Label>Status</Label>
            <Input value={form.status || ""} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} required />
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
        {editingId && <Button type="button" variant="outline" onClick={() => { setForm({ network: "", dataBundle: "", dataPlan: "", duration: "", type: "", status: "Active", price: 0, apiPrice: 0 }); setEditingId(null); }}>Cancel</Button>}
      </form>
      {fetching ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex space-x-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
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
              <th className="p-2">Bundle</th>
              <th className="p-2">Plan Code</th>
              <th className="p-2">Duration</th>
              <th className="p-2">Type</th>
              <th className="p-2">Status</th>
              <th className="p-2">Your Price</th>
              <th className="p-2">API Price</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map(plan => (
              <tr key={plan._id} className="border-t">
                <td className="p-2">{plan.network}</td>
                <td className="p-2">{plan.dataBundle}</td>
                <td className="p-2">{plan.dataPlan}</td>
                <td className="p-2">{plan.duration}</td>
                <td className="p-2">{plan.type}</td>
                <td className="p-2">{plan.status}</td>
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
