"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MoreHorizontal, UserCheck, UserX, Eye, Edit, CheckCircle, XCircle, User, Filter, Download, RefreshCw, EyeOff, Eye as EyeIcon, History, Users, DollarSign, TrendingUp, Star, Shield, Key, UserCog, Ban, AlertTriangle, ChevronDown, Calendar, Wallet, Phone, Mail, ArrowUpRight } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"

interface User {
  id: string
  fullName: string
  email: string
  phone: string
  walletBalance: number
  status: "active" | "suspended" | "inactive"
  kycStatus: "pending" | "verified" | "rejected"
  referralCode: string
  totalReferrals: number
  totalEarnings: number
  createdAt: string
  lastActive: string
  referralLevel?: number
  elevateXLevel?: number
  totalDeposits?: number
  totalWithdrawals?: number
  utilityPurchases?: number
}

interface Transaction {
  id: string
  type: string
  amount: number
  status: string
  description: string
  createdAt: string
}

interface Referral {
  id: string
  referredUserName: string
  referredUserEmail: string
  status: string
  bonusAmount: number
  level: number
  createdAt: string
}

export function UsersManagement({ searchTerm }: { searchTerm?: string }) {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [userTransactions, setUserTransactions] = useState<Transaction[]>([])
  const [userReferrals, setUserReferrals] = useState<Referral[]>([])

  // Dialog states
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isKycDialogOpen, setIsKycDialogOpen] = useState(false)
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false)
  const [isPasswordResetDialogOpen, setIsPasswordResetDialogOpen] = useState(false)
  const [isImpersonateDialogOpen, setIsImpersonateDialogOpen] = useState(false)
  const [isReferrerDialogOpen, setIsReferrerDialogOpen] = useState(false)

  // Selection states
  const [selectedKycStatus, setSelectedKycStatus] = useState<string>("")
  const [newReferrerCode, setNewReferrerCode] = useState("")
  const [suspendReason, setSuspendReason] = useState("")

  // Filters
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterKyc, setFilterKyc] = useState<string>("all")
  const [localSearchTerm, setLocalSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "user"
  })

  // Prevent hydration mismatch by only checking session after client-side mount
  React.useEffect(() => {
    setIsClient(true)
  }, [])

  // Get user from sessionStorage (or context/provider in production)
  const user = typeof window !== "undefined" ? JSON.parse(window.sessionStorage.getItem("user") || "null") : null;

  useEffect(() => {
    if (isClient) {
      fetchUsers()
    }
  }, [isClient])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users")
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      } else {
        console.error("Failed to fetch users:", response.statusText)
        setUsers([])
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
      setUsers([])
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUserDetails = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/details`)
      if (response.ok) {
        const data = await response.json()
        setUserTransactions(data.transactions || [])
        setUserReferrals(data.referrals || [])
      }
    } catch (error) {
      console.error("Failed to fetch user details:", error)
    }
  }

  // Action handlers
  const handleViewProfile = (user: User) => {
    setSelectedUser(user)
    fetchUserDetails(user.id)
    setIsViewDialogOpen(true)
    setActiveTab("overview")
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setFormData({
      fullName: user.fullName || "",
      email: user.email || "",
      phone: user.phone || "",
      role: "user" // Default, as it might not be in the user object yet or we might want to edit it
    })
    setIsEditDialogOpen(true)
  }

  const handleVerifyKyc = (user: User) => {
    setSelectedUser(user)
    setSelectedKycStatus(user.kycStatus)
    setIsKycDialogOpen(true)
  }

  const handleSuspendUser = (user: User) => {
    setSelectedUser(user)
    setSuspendReason("")
    setIsSuspendDialogOpen(true)
  }

  const handleResetPassword = (user: User) => {
    setSelectedUser(user)
    setIsPasswordResetDialogOpen(true)
  }

  const handleImpersonateUser = (user: User) => {
    setSelectedUser(user)
    setIsImpersonateDialogOpen(true)
  }

  const handleChangeReferrer = (user: User) => {
    setSelectedUser(user)
    setNewReferrerCode("")
    setIsReferrerDialogOpen(true)
  }

  // Action handlers
  const performAction = async (actionType: string) => {
    if (!selectedUser) return

    setIsLoading(true)
    try {
      let updates: any = {}
      let successMessage = ""

      if (actionType === 'Update User') {
        const fullNameInput = document.querySelector('input[name="fullName"]') as HTMLInputElement
        // We need to capture the form state better, but for now let's assume we can get it or we update the state
        // Since the previous implementation didn't fully wire up the form state to performAction, 
        // let's look at how we can get the data.
        // Actually, let's update the Edit Dialog to use state properly first.
        return // handled in improved dialog
      }

      if (actionType === 'Update KYC') {
        updates = { kycStatus: selectedKycStatus }
        successMessage = "KYC status updated successfully"
      } else if (actionType === 'Suspend') {
        updates = { status: "suspended" } // In a real app we might want to store the reason too
        successMessage = "User suspended successfully"
      } else if (actionType === 'Change Referrer') {
        if (!newReferrerCode) {
          toast({ title: "Error", description: "Please enter a referrer code", variant: "destructive" })
          setIsLoading(false)
          return
        }
        // distinct field 'referredBy' using the code
        updates = { referredBy: newReferrerCode }
        successMessage = "Referrer updated successfully"
      }

      if (Object.keys(updates).length > 0) {
        const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        })

        if (!response.ok) {
          throw new Error('Failed to update user')
        }

        const data = await response.json()

        toast({
          title: "Success",
          description: successMessage,
          variant: "default",
        })

        // Refresh list
        fetchUsers()
      }
    } catch (error) {
      console.error("Action failed:", error)
      toast({
        title: "Error",
        description: "Failed to perform action",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      // Close dialogs
      setIsEditDialogOpen(false)
      setIsKycDialogOpen(false)
      setIsSuspendDialogOpen(false)
      setIsPasswordResetDialogOpen(false)
      setIsReferrerDialogOpen(false)
      setIsImpersonateDialogOpen(false)
    }
  }

  // Separate handler for Edit User to manage form state
  const saveUserUpdates = async (updates: any) => {
    if (!selectedUser) return
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update user')
      }

      toast({
        title: "Success",
        description: "User details updated successfully",
      })
      fetchUsers()
      setIsEditDialogOpen(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Enhanced filtering
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.fullName || "").toLowerCase().includes((localSearchTerm || searchTerm || "").toLowerCase()) ||
      (user.email || "").toLowerCase().includes((localSearchTerm || searchTerm || "").toLowerCase()) ||
      (user.phone || "").includes(localSearchTerm || searchTerm || "") ||
      (user.referralCode || "").toLowerCase().includes((localSearchTerm || searchTerm || "").toLowerCase())

    const matchesStatus = filterStatus === "all" || user.status === filterStatus
    const matchesKyc = filterKyc === "all" || user.kycStatus === filterKyc

    return matchesSearch && matchesStatus && matchesKyc
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-100 border-0">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        )
      case "suspended":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100 border-0">
            <XCircle className="w-3 h-3 mr-1" />
            Suspended
          </Badge>
        )
      case "inactive":
        return <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-100 border-0">Inactive</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getKycBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0">
            <Shield className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-0">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive" className="bg-red-50 text-red-600 hover:bg-red-50 border-red-100">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getInitials = (name: string) => {
    return (name || "User")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Users</h1>
            <p className="text-slate-500">Manage your user base</p>
          </div>
        </div>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 animate-pulse">
                  <div className="w-10 h-10 bg-slate-100 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-100 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isClient) {
    return null;
  }

  if (!user || user.role !== "admin") {
    return <div className="p-4 text-red-600 bg-red-50 rounded-lg border border-red-100">Access denied: Admins only.</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-500 text-sm">View, edit, and manage all platform users.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="bg-white border-slate-200 text-slate-700">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="ghost" size="icon" onClick={fetchUsers} className="text-slate-500 hover:text-blue-600">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Modern Filter Toolbar */}
      <Card className="border-0 shadow-sm bg-white overflow-visible">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
                className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all"
              />
            </div>

            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[140px] bg-slate-50 border-slate-200">
                  <div className="flex items-center gap-2">
                    <Filter className="w-3.5 h-3.5 text-slate-500" />
                    <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterKyc} onValueChange={setFilterKyc}>
                <SelectTrigger className="w-[140px] bg-slate-50 border-slate-200">
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-slate-500" />
                    <SelectValue placeholder="KYC" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All KYC</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md shadow-slate-200/50">
        <CardHeader className="px-6 py-4 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-slate-800">All Users</CardTitle>
            <CardDescription>Total {filteredUsers.length} users found</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative">
            {/* Desktop / Tablet Table */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="border-b border-slate-100 hover:bg-transparent">
                    <TableHead className="font-semibold text-slate-600 pl-6">User Details</TableHead>
                    <TableHead className="font-semibold text-slate-600">Contact</TableHead>
                    <TableHead className="font-semibold text-slate-600">Balance</TableHead>
                    <TableHead className="font-semibold text-slate-600">Status</TableHead>
                    <TableHead className="font-semibold text-slate-600">KYC</TableHead>
                    <TableHead className="font-semibold text-slate-600">Performance</TableHead>
                    <TableHead className="font-semibold text-slate-600">Joined</TableHead>
                    <TableHead className="text-right pr-6 align-middle font-semibold text-slate-600">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-64 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center">
                          <div className="p-4 bg-slate-50 rounded-full mb-3">
                            <Users className="h-8 w-8 text-slate-300" />
                          </div>
                          <p>No users found matching your filters.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers.map((user) => (
                    <TableRow key={user.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-9 w-9 border border-slate-100 shadow-sm">
                            <AvatarFallback className="bg-blue-50 text-blue-600 font-medium text-xs">{getInitials(user.fullName)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-slate-900">{user.fullName}</div>
                            <div className="text-xs text-slate-500 font-mono bg-slate-100 px-1.5 py-0.5 rounded-sm inline-block mt-0.5">{user.referralCode}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <div className="text-sm text-slate-700">{user.email}</div>
                          <div className="text-xs text-muted-foreground">{user.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-slate-900">{formatCurrency(user.walletBalance)}</div>
                      </TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>{getKycBadge(user.kycStatus)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="text-xs font-medium text-slate-700">{user.totalReferrals} Refs</div>
                          <div className="text-xs text-green-600 font-medium">+ {formatCurrency(user.totalEarnings)}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-slate-600">{formatDate(user.createdAt)}</div>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 group-hover:text-blue-600 transition-colors">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleViewProfile(user)}>
                              <Eye className="h-4 w-4 mr-2 text-slate-500" /> View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditUser(user)}>
                              <Edit className="h-4 w-4 mr-2 text-slate-500" /> Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleVerifyKyc(user)}>
                              <Shield className="h-4 w-4 mr-2 text-blue-500" /> Verify KYC
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleChangeReferrer(user)}>
                              <UserCog className="h-4 w-4 mr-2 text-slate-500" /> Change Referrer
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleImpersonateUser(user)}>
                              <Key className="h-4 w-4 mr-2 text-amber-500" /> Impersonate
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSuspendUser(user)} className="text-red-600 focus:text-red-600">
                              <Ban className="h-4 w-4 mr-2" /> Suspend Account
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile: stacked cards */}
            <div className="block md:hidden bg-slate-50/50 p-4 space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10 border border-slate-100">
                        <AvatarFallback className="bg-blue-50 text-blue-600">{getInitials(user.fullName)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-bold text-slate-900">{user.fullName}</div>
                        <div className="text-xs text-slate-500">{user.email}</div>
                      </div>
                    </div>
                    {getStatusBadge(user.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-50 mb-4">
                    <div>
                      <span className="text-xs text-slate-400 block mb-1">Wallet Balance</span>
                      <span className="text-sm font-semibold text-slate-900">{formatCurrency(user.walletBalance)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block mb-1">Referrals</span>
                      <div className="flex items-center justify-end gap-1">
                        <Users className="h-3 w-3 text-slate-400" />
                        <span className="text-sm font-medium text-slate-700">{user.totalReferrals}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Joined {formatDate(user.createdAt)}</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 text-slate-500">
                          Actions <ChevronDown className="ml-1 h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewProfile(user)}>View Profile</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditUser(user)}>Edit Details</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSuspendUser(user)} className="text-red-600">Suspend</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced View Profile Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] p-0 gap-0 overflow-hidden flex flex-col">
          <div className="p-6 pb-2 border-b border-slate-100 bg-slate-50/50">
            <DialogHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
                  <AvatarFallback className="text-xl bg-blue-100 text-blue-600">
                    {selectedUser && getInitials(selectedUser.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle className="text-2xl font-bold text-slate-900">{selectedUser?.fullName}</DialogTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-slate-500 text-sm">{selectedUser?.email}</span>
                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                    <span className="text-xs font-mono bg-slate-200 px-1.5 rounded">{selectedUser?.referralCode}</span>
                  </div>
                </div>
                <div className="ml-auto flex gap-2">
                  {selectedUser && getStatusBadge(selectedUser.status)}
                  {selectedUser && getKycBadge(selectedUser.kycStatus)}
                </div>
              </div>
            </DialogHeader>
          </div>

          <div className="flex-1 overflow-y-auto">
            {selectedUser && (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="px-6 pt-4 border-b border-slate-100 sticky top-0 bg-white z-10">
                  <TabsList className="grid w-full grid-cols-4 bg-slate-100/50 p-1">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="transactions">Transactions</TabsTrigger>
                    <TabsTrigger value="referrals">Referrals</TabsTrigger>
                    <TabsTrigger value="system">System</TabsTrigger>
                  </TabsList>
                </div>

                <div className="p-6">
                  <TabsContent value="overview" className="space-y-6 mt-0">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Card className="bg-green-50/50 border-green-100 shadow-sm">
                        <CardContent className="p-4">
                          <div className="text-xs font-medium text-green-600 mb-1 flex items-center gap-1">
                            <Wallet className="w-3 h-3" /> Wallet Balance
                          </div>
                          <div className="text-xl font-bold text-slate-800">{formatCurrency(selectedUser.walletBalance)}</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-blue-50/50 border-blue-100 shadow-sm">
                        <CardContent className="p-4">
                          <div className="text-xs font-medium text-blue-600 mb-1 flex items-center gap-1">
                            <Users className="w-3 h-3" /> Total Referrals
                          </div>
                          <div className="text-xl font-bold text-slate-800">{selectedUser.totalReferrals}</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-amber-50/50 border-amber-100 shadow-sm">
                        <CardContent className="p-4">
                          <div className="text-xs font-medium text-amber-600 mb-1 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> Total Earnings
                          </div>
                          <div className="text-xl font-bold text-slate-800">{formatCurrency(selectedUser.totalEarnings)}</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-slate-50/50 border-slate-100 shadow-sm">
                        <CardContent className="p-4">
                          <div className="text-xs font-medium text-slate-600 mb-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> Joined
                          </div>
                          <div className="text-base font-bold text-slate-800">{formatDate(selectedUser.createdAt)}</div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Personal Details</CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        <div className="flex flex-col gap-1 pb-3 border-b border-slate-50">
                          <span className="text-xs text-slate-400">Full Name</span>
                          <span className="text-sm font-medium">{selectedUser.fullName}</span>
                        </div>
                        <div className="flex flex-col gap-1 pb-3 border-b border-slate-50">
                          <span className="text-xs text-slate-400">Email Address</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{selectedUser.email}</span>
                            {selectedUser.status === 'active' ? <CheckCircle className="w-3 h-3 text-green-500" /> : <AlertTriangle className="w-3 h-3 text-amber-500" />}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 pb-3 border-b border-slate-50">
                          <span className="text-xs text-slate-400">Phone Number</span>
                          <span className="text-sm font-medium">{selectedUser.phone}</span>
                        </div>
                        <div className="flex flex-col gap-1 pb-3 border-b border-slate-50">
                          <span className="text-xs text-slate-400">Last Active</span>
                          <span className="text-sm font-medium">{selectedUser.lastActive ? new Date(selectedUser.lastActive).toLocaleString() : 'Never'}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="transactions" className="mt-0">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader className="bg-slate-50">
                          <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {userTransactions.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No recent transactions</TableCell>
                            </TableRow>
                          ) : (
                            userTransactions.map(tx => (
                              <TableRow key={tx.id}>
                                <TableCell className="capitalize">{tx.type}</TableCell>
                                <TableCell className={tx.type === 'deposit' ? 'text-green-600' : 'text-slate-900'}>
                                  {tx.type === 'deposit' ? '+' : '-'}{formatCurrency(tx.amount)}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className={
                                    tx.status === 'success' ? 'border-green-200 text-green-700 bg-green-50' :
                                      tx.status === 'failed' ? 'border-red-200 text-red-700 bg-red-50' :
                                        'border-amber-200 text-amber-700 bg-amber-50'
                                  }>
                                    {tx.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-xs text-slate-500">{new Date(tx.createdAt).toLocaleDateString()}</TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            )}
          </div>
          <DialogFooter className="p-4 border-t border-slate-100 bg-slate-50 flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            <Button onClick={() => {
              handleEditUser(selectedUser!);
              setIsViewDialogOpen(false);
            }}>Edit User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Other Dialogs */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information.</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => saveUserUpdates(formData)} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isKycDialogOpen} onOpenChange={setIsKycDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify KYC</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedKycStatus} onValueChange={setSelectedKycStatus}>
              <SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsKycDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => performAction('Update KYC')}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isSuspendDialogOpen} onOpenChange={setIsSuspendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspend User</DialogTitle>
            <DialogDescription>Are you sure you want to suspend this user? They will not be able to log in.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label>Reason for suspension</Label>
            <Textarea
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              placeholder="Violation of terms..."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSuspendDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => performAction('Suspend')}>Suspend User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isReferrerDialogOpen} onOpenChange={setIsReferrerDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Referrer</DialogTitle>
            <DialogDescription>Enter the new referrer code for this user.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label>New Referrer Code</Label>
            <Input
              value={newReferrerCode}
              onChange={(e) => setNewReferrerCode(e.target.value)}
              placeholder="REF12345"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReferrerDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => performAction('Change Referrer')} disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Referrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
