"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2 } from "lucide-react";

// Frontend interfaces for display (without mongoose Document methods)
interface DisplayDataPlan {
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

interface DisplayAirtimePlan {
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

export function PlansManagement({ searchTerm }: { searchTerm: string }) {
  const [dataPlans, setDataPlans] = useState<DisplayDataPlan[]>([]);
  const [airtimePlans, setAirtimePlans] = useState<DisplayAirtimePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [planType, setPlanType] = useState<"data" | "airtime">("data");

  // Form states
  const [form, setForm] = useState({
    network: "",
    dataBundle: "",
    dataPlan: "",
    duration: "",
    type: "",
    status: "Active",
    price: 0,
    apiPrice: 0,
    amount: 0,
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  async function fetchPlans() {
    setLoading(true);
    try {
      // Fetch data plans
      const dataRes = await fetch("/api/admin/data-plans");
      let dataPlansData = await dataRes.json() as DisplayDataPlan[];
      if (!dataPlansData || dataPlansData.length === 0) {
        dataPlansData = [
          { _id: "mock1", network: "MTN", dataBundle: "1GB", dataPlan: "1", duration: "30 Days", type: "SME", status: "Active", price: 700, apiPrice: 650 },
          { _id: "mock2", network: "AIRTEL", dataBundle: "2GB", dataPlan: "20", duration: "30 Days", type: "GIFTING", status: "Active", price: 1400, apiPrice: 1300 },
        ];
      }
      setDataPlans(dataPlansData);

      // Fetch airtime plans
      const airtimeRes = await fetch("/api/admin/airtime-plans");
      let airtimePlansData = await airtimeRes.json() as DisplayAirtimePlan[];
      if (!airtimePlansData || airtimePlansData.length === 0) {
        airtimePlansData = [
          { _id: "mock1", network: "MTN", amount: 100, price: 105, apiPrice: 100 },
          { _id: "mock2", network: "AIRTEL", amount: 200, price: 210, apiPrice: 200 },
        ];
      }
      setAirtimePlans(airtimePlansData);
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const endpoint = planType === "data" ? "/api/admin/data-plans" : "/api/admin/airtime-plans";
      const method = editingPlan ? "PUT" : "POST";
      const url = editingPlan ? `${endpoint}/${editingPlan._id}` : endpoint;

      // Prepare the form data based on plan type
      const submitData = { ...form };

      // For airtime plans, remove data-specific fields
      if (planType === "airtime") {
        delete (submitData as any).dataBundle;
        delete (submitData as any).dataPlan;
        delete (submitData as any).duration;
        delete (submitData as any).type;
      }

      console.log("Submitting form data:", submitData);

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (res.ok) {
        setAddModalOpen(false);
        setEditingPlan(null);
        resetForm();
        fetchPlans();
      } else {
        let errorMessage = "Unknown error occurred";

        try {
          const errorData = await res.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (jsonError) {
          // If response is not JSON, use status text
          errorMessage = res.statusText || `HTTP ${res.status}`;
        }

        console.error("Error saving plan:", errorMessage);
        alert(`Error saving plan: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error saving plan:", error);
      alert(`Error saving plan: ${error instanceof Error ? error.message : 'Network error'}`);
    }
  }

  function handleEdit(plan: any, type: "data" | "airtime") {
    setPlanType(type);
    setEditingPlan(plan);
    setForm(plan);
    setAddModalOpen(true);
  }

  async function handleDelete(id: string, type: "data" | "airtime") {
    try {
      const endpoint = type === "data" ? "/api/admin/data-plans" : "/api/admin/airtime-plans";
      const res = await fetch(`${endpoint}/${id}`, { method: "DELETE" });

      if (res.ok) {
        fetchPlans();
      } else {
        let errorMessage = "Unknown error occurred";

        try {
          const errorData = await res.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (jsonError) {
          // If response is not JSON, use status text
          errorMessage = res.statusText || `HTTP ${res.status}`;
        }

        console.error("Error deleting plan:", errorMessage);
        alert(`Error deleting plan: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error deleting plan:", error);
      alert(`Error deleting plan: ${error instanceof Error ? error.message : 'Network error'}`);
    }
  }

  function resetForm() {
    setForm({
      network: "",
      dataBundle: "",
      dataPlan: "",
      duration: "",
      type: "",
      status: "Active",
      price: 0,
      apiPrice: 0,
      amount: 0,
    });
  }

  const filteredDataPlans = Array.isArray(dataPlans) ? dataPlans.filter((plan: DisplayDataPlan) =>
    (plan.network?.toLowerCase() || '').includes((searchTerm || '').toLowerCase()) ||
    (plan.dataBundle?.toLowerCase() || '').includes((searchTerm || '').toLowerCase()) ||
    (plan.dataPlan?.toLowerCase() || '').includes((searchTerm || '').toLowerCase()) ||
    (plan.duration?.toLowerCase() || '').includes((searchTerm || '').toLowerCase()) ||
    (plan.type?.toLowerCase() || '').includes((searchTerm || '').toLowerCase()) ||
    (plan.status?.toLowerCase() || '').includes((searchTerm || '').toLowerCase()) ||
    plan.price.toString().includes(searchTerm || '') ||
    plan.apiPrice.toString().includes(searchTerm || '')
  ) : [];

  const filteredAirtimePlans = Array.isArray(airtimePlans) ? airtimePlans.filter((plan: DisplayAirtimePlan) =>
    (plan.network?.toLowerCase() || '').includes((searchTerm || '').toLowerCase()) ||
    plan.amount.toString().includes(searchTerm || '') ||
    plan.price.toString().includes(searchTerm || '') ||
    plan.apiPrice.toString().includes(searchTerm || '')
  ) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Plans Management</h2>
          <p className="text-slate-600">Manage data and airtime plans across all networks</p>
        </div>

        <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingPlan(null); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingPlan ? "Edit Plan" : "Add New Plan"}</DialogTitle>
              <DialogDescription>
                {editingPlan ? "Update the plan details" : "Create a new data or airtime plan"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Tabs value={planType} onValueChange={(value) => setPlanType(value as "data" | "airtime")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="data">Data Plan</TabsTrigger>
                  <TabsTrigger value="airtime">Airtime Plan</TabsTrigger>
                </TabsList>

                <TabsContent value="data" className="space-y-4">
                  <div>
                    <Label htmlFor="network">Network</Label>
                    <Input
                      id="network"
                      value={form.network}
                      onChange={(e) => setForm(f => ({ ...f, network: e.target.value }))}
                      placeholder="e.g. MTN, AIRTEL, GLO, 9MOBILE"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="dataBundle">Data Bundle</Label>
                    <Input
                      id="dataBundle"
                      value={form.dataBundle}
                      onChange={(e) => setForm(f => ({ ...f, dataBundle: e.target.value }))}
                      placeholder="e.g. 1GB, 2GB, 500MB"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="dataPlan">Plan Code</Label>
                    <Input
                      id="dataPlan"
                      value={form.dataPlan}
                      onChange={(e) => setForm(f => ({ ...f, dataPlan: e.target.value }))}
                      placeholder="e.g. MTN_1GB_DAILY"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      value={form.duration}
                      onChange={(e) => setForm(f => ({ ...f, duration: e.target.value }))}
                      placeholder="e.g. 1 Day, 7 Days, 30 Days"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Input
                      id="type"
                      value={form.type}
                      onChange={(e) => setForm(f => ({ ...f, type: e.target.value }))}
                      placeholder="e.g. Daily, Weekly, Monthly"
                      required
                    />
                  </div>
                </TabsContent>

                <TabsContent value="airtime" className="space-y-4">
                  <div>
                    <Label htmlFor="network">Network</Label>
                    <Select value={form.network} onValueChange={(v) => setForm(f => ({ ...f, network: v }))}>
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
                      value={form.amount}
                      onChange={(e) => setForm(f => ({ ...f, amount: Number(e.target.value) }))}
                      placeholder="e.g. 100, 200, 500"
                      required
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div>
                <Label htmlFor="price">Your Price (₦)</Label>
                <Input
                  id="price"
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm(f => ({ ...f, price: Number(e.target.value) }))}
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
                  value={form.apiPrice}
                  onChange={(e) => setForm(f => ({ ...f, apiPrice: Number(e.target.value) }))}
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingPlan ? "Update Plan" : "Add Plan"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setAddModalOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="data" className="space-y-6">
        <TabsList>
          <TabsTrigger value="data">Data Plans</TabsTrigger>
          <TabsTrigger value="airtime">Airtime Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="data">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex space-x-4">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-32" />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-slate-900">Data Plans ({filteredDataPlans.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Network</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Bundle</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Plan Code</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Duration</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Your Price</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">API Price</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredDataPlans.map((plan) => (
                      <tr key={plan._id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm text-slate-900">{plan.network}</td>
                        <td className="px-4 py-3 text-sm text-slate-900">{plan.dataBundle}</td>
                        <td className="px-4 py-3 text-sm text-slate-900">{plan.dataPlan}</td>
                        <td className="px-4 py-3 text-sm text-slate-900">{plan.duration}</td>
                        <td className="px-4 py-3 text-sm text-slate-900">{plan.type}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            plan.status === 'Active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {plan.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-900">₦{plan.price}</td>
                        <td className="px-4 py-3 text-sm text-slate-900">₦{plan.apiPrice}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(plan, "data")}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(plan._id!, "data")}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="airtime">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex space-x-4">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-32" />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-slate-900">Airtime Plans ({filteredAirtimePlans.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Network</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Amount</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Your Price</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">API Price</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredAirtimePlans.map((plan) => (
                      <tr key={plan._id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm text-slate-900">{plan.network}</td>
                        <td className="px-4 py-3 text-sm text-slate-900">₦{plan.amount}</td>
                        <td className="px-4 py-3 text-sm text-slate-900">₦{plan.price}</td>
                        <td className="px-4 py-3 text-sm text-slate-900">₦{plan.apiPrice}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(plan, "airtime")}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(plan._id!, "airtime")}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
