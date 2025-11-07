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
  const [fetching, setFetching] = useState(true);

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

  async function handleDelete(id: string) {
    await fetch(`/api/admin/airtime-plans/${id}`, { method: "DELETE" });
    fetchPlans();
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Manage Airtime Plans</h1>
        <Button onClick={() => window.location.href = "/admin/airtime-plans/add"}>
          Add New Plan
        </Button>
      </div>
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
                  <Button size="sm" variant="outline" className="mr-2" onClick={() => window.location.href = "/admin?tab=plans"}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(plan._id!)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
