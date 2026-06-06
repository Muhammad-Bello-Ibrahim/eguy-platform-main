"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search, RefreshCw, Wifi, Smartphone, Layers, Download, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

export function PlansManagement({ searchTerm: initialSearchTerm }: { searchTerm?: string }) {
  const [dataPlans, setDataPlans] = useState<DisplayDataPlan[]>([]);
  const [airtimePlans, setAirtimePlans] = useState<DisplayAirtimePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [planType, setPlanType] = useState<"data" | "airtime">("data");
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm || "");
  const { toast } = useToast();

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
      const dataPlansData = await dataRes.json() as DisplayDataPlan[];

      // if (!dataPlansData || dataPlansData.length === 0) {
      //   // Mock data if API fails or returns empty (for development)
      //   dataPlansData = [...]
      // }
      setDataPlans(dataPlansData || []);

      // Fetch airtime plans
      const airtimeRes = await fetch("/api/admin/airtime-plans");
      const airtimePlansData = await airtimeRes.json() as DisplayAirtimePlan[];

      // if (!airtimePlansData || airtimePlansData.length === 0) {
      //   // Mock data
      //   airtimePlansData = [...]
      // }
      setAirtimePlans(airtimePlansData || []);
    } catch (error) {
      console.error("Error fetching plans:", error);
      toast({
        title: "Error",
        description: "Failed to fetch plans",
        variant: "destructive",
      });
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
        toast({
          title: "Success",
          description: `Plan ${editingPlan ? 'updated' : 'created'} successfully`,
        });
      } else {
        let errorMessage = "Unknown error occurred";
        try {
          const errorData = await res.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (jsonError) {
          errorMessage = res.statusText || `HTTP ${res.status}`;
        }
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Network error',
        variant: "destructive",
      });
    }
  }

  function handleEdit(plan: any, type: "data" | "airtime") {
    setPlanType(type);
    setEditingPlan(plan);
    setForm(plan);
    setAddModalOpen(true);
  }

  async function handleDelete(id: string, type: "data" | "airtime") {
    if (!confirm("Are you sure you want to delete this plan?")) return;

    try {
      const endpoint = type === "data" ? "/api/admin/data-plans" : "/api/admin/airtime-plans";
      const res = await fetch(`${endpoint}/${id}`, { method: "DELETE" });

      if (res.ok) {
        fetchPlans();
        toast({
          title: "Success",
          description: "Plan deleted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete plan",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error during deletion",
        variant: "destructive",
      });
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
    (plan.type?.toLowerCase() || '').includes((searchTerm || '').toLowerCase())
  ) : [];

  const filteredAirtimePlans = Array.isArray(airtimePlans) ? airtimePlans.filter((plan: DisplayAirtimePlan) =>
    (plan.network?.toLowerCase() || '').includes((searchTerm || '').toLowerCase()) ||
    plan.amount.toString().includes(searchTerm || '')
  ) : [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Plans</h1>
            <p className="text-slate-500 dark:text-slate-400">Manage data and airtime plans</p>
          </div>
        </div>
        <Card className="border border-slate-200 dark:border-slate-800/30 bg-white dark:bg-card-dark shadow-sm dark:shadow-none">
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 animate-pulse">
                  <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Plans Management</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Configure and manage data bundles and airtime pricing.</p>
        </div>

        <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingPlan(null); }} className="bg-primary hover:bg-primary/90 text-background-dark font-extrabold shadow-lg shadow-primary/20 transition-all duration-200 active:scale-95 rounded-xl">
              <Plus className="w-4 h-4 mr-2" />
              Add Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800/50 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-slate-900 dark:text-white">{editingPlan ? "Edit Plan" : "Add New Plan"}</DialogTitle>
              <DialogDescription className="text-slate-500 dark:text-slate-400">
                {editingPlan ? "Update the plan details below." : "Create a new data or airtime plan configuration."}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <Tabs value={planType} onValueChange={(value) => setPlanType(value as "data" | "airtime")} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4 bg-slate-100/50 dark:bg-neutral-dark/30 rounded-xl p-1">
                  <TabsTrigger value="data" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border-primary/20 rounded-lg">Data Plan</TabsTrigger>
                  <TabsTrigger value="airtime" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border-primary/20 rounded-lg">Airtime Plan</TabsTrigger>
                </TabsList>

                <TabsContent value="data" className="space-y-4 mt-0">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="network">Network</Label>
                      <Select value={form.network} onValueChange={(v) => setForm(f => ({ ...f, network: v }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {networks.map(n => (
                            <SelectItem key={n.value} value={n.value}>{n.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dataBundle">Data Bundle</Label>
                      <Input
                        id="dataBundle"
                        value={form.dataBundle}
                        onChange={(e) => setForm(f => ({ ...f, dataBundle: e.target.value }))}
                        placeholder="e.g. 1GB"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dataPlan">Plan Code (API)</Label>
                    <Input
                      id="dataPlan"
                      value={form.dataPlan}
                      onChange={(e) => setForm(f => ({ ...f, dataPlan: e.target.value }))}
                      placeholder="e.g. MTN_1GB_DAILY"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration</Label>
                      <Input
                        id="duration"
                        value={form.duration}
                        onChange={(e) => setForm(f => ({ ...f, duration: e.target.value }))}
                        placeholder="e.g. 30 Days"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Plan Type</Label>
                      <Select value={form.type} onValueChange={(v) => setForm(f => ({ ...f, type: v }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SME">SME</SelectItem>
                          <SelectItem value="GIFTING">Gifting</SelectItem>
                          <SelectItem value="CORPORATE">Corporate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="airtime" className="space-y-4 mt-0">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="network">Network</Label>
                      <Select value={form.network} onValueChange={(v) => setForm(f => ({ ...f, network: v }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {networks.map(n => (
                            <SelectItem key={n.value} value={n.value}>{n.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (₦)</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={form.amount}
                        onChange={(e) => setForm(f => ({ ...f, amount: Number(e.target.value) }))}
                        placeholder="e.g. 100"
                        required
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
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
                <div className="space-y-2">
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm(f => ({ ...f, status: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingPlan ? "Save Changes" : "Create Plan"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border border-slate-200 dark:border-slate-800/30 bg-white dark:bg-card-dark shadow-sm dark:shadow-none overflow-visible">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 h-4 w-4" />
              <Input
                placeholder="Search plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-50 dark:bg-background-dark border-slate-200 dark:border-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:border-primary transition-all text-slate-900 dark:text-white"
              />
            </div>
            <Button variant="outline" size="icon" onClick={fetchPlans} className="text-slate-500 dark:text-slate-400 hover:text-primary border-slate-200 dark:border-slate-800/50 bg-white dark:bg-card-dark">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="data" className="w-full">
        <TabsList className="bg-slate-100/50 dark:bg-neutral-dark/30 p-1 mb-6 rounded-xl">
          <TabsTrigger value="data" className="flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border-primary/20 rounded-lg">
            <Wifi className="h-4 w-4" /> Data Plans
          </TabsTrigger>
          <TabsTrigger value="airtime" className="flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border-primary/20 rounded-lg">
            <Smartphone className="h-4 w-4" /> Airtime Plans
          </TabsTrigger>
        </TabsList>

        <TabsContent value="data" className="mt-0">
          <Card className="border border-slate-200 dark:border-slate-800/30 bg-white dark:bg-card-dark shadow-sm dark:shadow-none">
            <CardHeader className="px-6 py-4 border-b border-slate-200 dark:border-slate-800/50 bg-slate-50/20 dark:bg-neutral-dark/10">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white">Data Plans</CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400">Total {filteredDataPlans.length} plans available</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="hidden sm:block overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/50 dark:bg-neutral-dark/30 border-b border-slate-200 dark:border-slate-800/50">
                    <TableRow className="border-b border-slate-200 dark:border-slate-800/50 hover:bg-transparent">
                      <TableHead className="font-semibold text-slate-600 dark:text-slate-300 pl-6">Network</TableHead>
                      <TableHead className="font-semibold text-slate-600 dark:text-slate-300">Bundle</TableHead>
                      <TableHead className="font-semibold text-slate-600 dark:text-slate-300">Type</TableHead>
                      <TableHead className="font-semibold text-slate-600 dark:text-slate-300">Price Info</TableHead>
                      <TableHead className="font-semibold text-slate-600 dark:text-slate-300">Status</TableHead>
                      <TableHead className="text-right pr-6 font-semibold text-slate-600 dark:text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDataPlans.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-48 text-center text-slate-500 dark:text-slate-400">
                          No data plans found.
                        </TableCell>
                      </TableRow>
                    ) : filteredDataPlans.map((plan) => (
                      <TableRow key={plan._id} className="border-b border-slate-200 dark:border-slate-800/30 hover:bg-slate-50 dark:hover:bg-neutral-dark/40 transition-colors text-slate-700 dark:text-slate-300">
                        <TableCell className="pl-6 font-medium">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                              {plan.network[0]}
                            </div>
                            <span className="text-slate-900 dark:text-white">{plan.network}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-slate-900 dark:text-white">{plan.dataBundle}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">{plan.duration}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-normal text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700">{plan.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-0.5">
                            <span className="font-medium text-slate-900 dark:text-white">{formatCurrency(plan.price)}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">API: {formatCurrency(plan.apiPrice)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline"
                            className={plan.status === 'Active' ? 'bg-emerald-500/10 text-emerald-450 border-emerald-500/20 font-semibold' : 'bg-slate-500/10 text-slate-400 border-slate-500/20 font-semibold'}>
                            {plan.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <div className="flex items-center justify-end gap-2">
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-primary transition-colors hover:bg-slate-100 dark:hover:bg-white/5" onClick={() => handleEdit(plan, "data")}>
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10" onClick={() => handleDelete(plan._id!, "data")}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile */}
              <div className="block sm:hidden p-4 space-y-3 bg-slate-50/50 dark:bg-neutral-dark/10">
                {filteredDataPlans.map((plan) => (
                  <div key={plan._id} className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800/30 rounded-xl p-4 shadow-sm dark:shadow-none">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-slate-50 dark:bg-neutral-dark/40 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700">{plan.network}</Badge>
                        <span className="font-bold text-slate-900 dark:text-white">{plan.dataBundle}</span>
                      </div>
                      <Badge variant="outline" className={plan.status === 'Active' ? 'bg-emerald-500/10 text-emerald-450 border-emerald-500/20 font-semibold' : 'bg-slate-500/10 text-slate-400 border-slate-500/20 font-semibold'}>
                        {plan.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-xs text-slate-400 dark:text-slate-500 block">Plan Type</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">{plan.type}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400 dark:text-slate-500 block">Price</span>
                        <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(plan.price)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 border-slate-200 dark:border-slate-800/50 text-slate-700 dark:text-slate-300 bg-transparent hover:bg-slate-50 dark:hover:bg-neutral-dark/40" onClick={() => handleEdit(plan, "data")}>Edit</Button>
                      <Button size="sm" variant="outline" className="flex-1 text-red-600 dark:text-red-450 hover:bg-red-50 dark:hover:bg-red-500/10 border-red-100 dark:border-red-500/20" onClick={() => handleDelete(plan._id!, "data")}>Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="airtime" className="mt-0">
          <Card className="border border-slate-200 dark:border-slate-800/30 bg-white dark:bg-card-dark shadow-sm dark:shadow-none">
            <CardHeader className="px-6 py-4 border-b border-slate-200 dark:border-slate-800/50 bg-slate-50/20 dark:bg-neutral-dark/10">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white">Airtime Plans</CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400">Total {filteredAirtimePlans.length} plans available</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="hidden sm:block overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/50 dark:bg-neutral-dark/30 border-b border-slate-200 dark:border-slate-800/50">
                    <TableRow className="border-b border-slate-200 dark:border-slate-800/50 hover:bg-transparent">
                      <TableHead className="font-semibold text-slate-600 dark:text-slate-300 pl-6">Network</TableHead>
                      <TableHead className="font-semibold text-slate-600 dark:text-slate-300">Amount</TableHead>
                      <TableHead className="font-semibold text-slate-600 dark:text-slate-300">Your Price</TableHead>
                      <TableHead className="font-semibold text-slate-600 dark:text-slate-300">API Price</TableHead>
                      <TableHead className="text-right pr-6 font-semibold text-slate-600 dark:text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAirtimePlans.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-48 text-center text-slate-500 dark:text-slate-400">
                          No airtime plans found.
                        </TableCell>
                      </TableRow>
                    ) : filteredAirtimePlans.map((plan) => (
                      <TableRow key={plan._id} className="border-b border-slate-200 dark:border-slate-800/30 hover:bg-slate-50 dark:hover:bg-neutral-dark/40 transition-colors text-slate-700 dark:text-slate-300">
                        <TableCell className="pl-6 font-medium text-slate-900 dark:text-white">{plan.network}</TableCell>
                        <TableCell>{formatCurrency(plan.amount)}</TableCell>
                        <TableCell className="font-medium text-emerald-600 dark:text-emerald-450">{formatCurrency(plan.price)}</TableCell>
                        <TableCell className="text-slate-500 dark:text-slate-400">{formatCurrency(plan.apiPrice)}</TableCell>
                        <TableCell className="text-right pr-6">
                          <div className="flex items-center justify-end gap-2">
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-primary transition-colors hover:bg-slate-100 dark:hover:bg-white/5" onClick={() => handleEdit(plan, "airtime")}>
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10" onClick={() => handleDelete(plan._id!, "airtime")}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {/* Mobile */}
              <div className="block sm:hidden p-4 space-y-3 bg-slate-50/50 dark:bg-neutral-dark/10">
                {filteredAirtimePlans.map((plan) => (
                  <div key={plan._id} className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800/30 rounded-xl p-4 shadow-sm dark:shadow-none">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-bold text-slate-900 dark:text-white">{plan.network}</div>
                      <div className="font-medium text-slate-700 dark:text-slate-300">{formatCurrency(plan.amount)}</div>
                    </div>
                    <div className="flex justify-between items-center text-sm mb-4 bg-slate-50 dark:bg-background-dark p-2 rounded">
                      <span className="text-slate-500 dark:text-slate-400">Price: <span className="text-slate-900 dark:text-white font-semibold">{formatCurrency(plan.price)}</span></span>
                      <span className="text-slate-500 dark:text-slate-400 text-xs">API: {formatCurrency(plan.apiPrice)}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 border-slate-200 dark:border-slate-800/50 text-slate-700 dark:text-slate-300 bg-transparent hover:bg-slate-50 dark:hover:bg-neutral-dark/40" onClick={() => handleEdit(plan, "airtime")}>Edit</Button>
                      <Button size="sm" variant="outline" className="flex-1 text-red-600 dark:text-red-450 hover:bg-red-50 dark:hover:bg-red-500/10 border-red-100 dark:border-red-500/20" onClick={() => handleDelete(plan._id!, "airtime")}>Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
