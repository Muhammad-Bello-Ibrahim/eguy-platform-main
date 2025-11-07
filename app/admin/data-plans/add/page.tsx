"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DataPlan {
  network: string;
  dataBundle: string;
  dataPlan: string;
  duration: string;
  type: string;
  status: string;
  price: number;
  apiPrice: number;
}

export default function AddDataPlanPage() {
  const router = useRouter();
  const [form, setForm] = useState<Partial<DataPlan>>({
    network: "",
    dataBundle: "",
    dataPlan: "",
    duration: "",
    type: "",
    status: "Active",
    price: 0,
    apiPrice: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/data-plans/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push("/admin/data-plans");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create data plan");
      }
    } catch (error) {
      setError("Network error occurred");
    }

    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          onClick={() => router.push("/admin/data-plans")}
          className="flex items-center gap-2"
        >
          ← Back to Data Plans
        </Button>
        <h1 className="text-2xl font-bold">Add New Data Plan</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="network">Network</Label>
            <Input
              id="network"
              value={form.network || ""}
              onChange={e => setForm(f => ({ ...f, network: e.target.value }))}
              required
              placeholder="e.g. MTN, AIRTEL, GLO, 9MOBILE"
            />
          </div>
          <div>
            <Label htmlFor="dataBundle">Data Bundle</Label>
            <Input
              id="dataBundle"
              value={form.dataBundle || ""}
              onChange={e => setForm(f => ({ ...f, dataBundle: e.target.value }))}
              required
              placeholder="e.g. 1GB, 2GB, 500MB"
            />
          </div>
          <div>
            <Label htmlFor="dataPlan">Plan Code</Label>
            <Input
              id="dataPlan"
              value={form.dataPlan || ""}
              onChange={e => setForm(f => ({ ...f, dataPlan: e.target.value }))}
              required
              placeholder="e.g. MTN_1GB_DAILY"
            />
          </div>
          <div>
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              value={form.duration || ""}
              onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
              required
              placeholder="e.g. 1 Day, 7 Days, 30 Days"
            />
          </div>
          <div>
            <Label htmlFor="type">Type</Label>
            <Input
              id="type"
              value={form.type || ""}
              onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
              required
              placeholder="e.g. Daily, Weekly, Monthly"
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Input
              id="status"
              value={form.status || ""}
              onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              required
              placeholder="Active"
            />
          </div>
          <div>
            <Label htmlFor="price">Your Price (₦)</Label>
            <Input
              id="price"
              type="number"
              value={form.price || 0}
              onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
              required
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <Label htmlFor="apiPrice">API Price (₦)</Label>
            <Input
              id="apiPrice"
              type="number"
              value={form.apiPrice || 0}
              onChange={e => setForm(f => ({ ...f, apiPrice: Number(e.target.value) }))}
              required
              min="0"
              step="0.01"
            />
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm p-2 bg-red-50 border border-red-200 rounded">
            {error}
          </div>
        )}

        <div className="flex gap-2">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? "Adding..." : "Add Data Plan"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/data-plans")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
