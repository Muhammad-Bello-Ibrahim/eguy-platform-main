"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AirtimePlan {
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

export default function AddAirtimePlanPage() {
  const router = useRouter();
  const [form, setForm] = useState<Partial<AirtimePlan>>({
    network: "",
    amount: 0,
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
      const res = await fetch("/api/admin/airtime-plans/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push("/admin/airtime-plans");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create airtime plan");
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
          onClick={() => router.push("/admin/airtime-plans")}
          className="flex items-center gap-2"
        >
          ← Back to Airtime Plans
        </Button>
        <h1 className="text-2xl font-bold">Add New Airtime Plan</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="network">Network</Label>
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
            <Label htmlFor="amount">Amount (₦)</Label>
            <Input
              id="amount"
              type="number"
              value={form.amount || 0}
              onChange={e => setForm(f => ({ ...f, amount: Number(e.target.value) }))}
              required
              min="0"
              step="0.01"
              placeholder="e.g. 100, 200, 500"
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
              placeholder="e.g. 105, 210, 525"
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
              placeholder="e.g. 100, 200, 500"
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
            {loading ? "Adding..." : "Add Airtime Plan"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/airtime-plans")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
