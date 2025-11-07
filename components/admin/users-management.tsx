"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MoreHorizontal, UserCheck, UserX, Eye, Edit, CheckCircle, XCircle, User, Filter, Download, RefreshCw, EyeOff, Eye as EyeIcon, History, Users, DollarSign, TrendingUp, Star, Shield, Key, UserCog, Ban, AlertTriangle } from "lucide-react"

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
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isKycDialogOpen, setIsKycDialogOpen] = useState(false)
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false)
  const [isPasswordResetDialogOpen, setIsPasswordResetDialogOpen] = useState(false)
  const [isImpersonateDialogOpen, setIsImpersonateDialogOpen] = useState(false)
  const [isReferrerDialogOpen, setIsReferrerDialogOpen] = useState(false)
  const [selectedKycStatus, setSelectedKycStatus] = useState<string>("")
  const [newReferrerCode, setNewReferrerCode] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterKyc, setFilterKyc] = useState<string>("all")
  const [localSearchTerm, setLocalSearchTerm] = useState("")
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  // Prevent hydration mismatch by only checking session after client-side mount
  React.useEffect(() => {
    setIsClient(true)
  }, [])

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownOpen && !(event.target as Element).closest('.dropdown-container')) {
        setDropdownOpen(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownOpen])

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
    setIsEditDialogOpen(true)
  }

  const handleVerifyKyc = (user: User) => {
    setSelectedUser(user)
    setSelectedKycStatus(user.kycStatus)
    setIsKycDialogOpen(true)
  }

  const handleSuspendUser = (user: User) => {
    setSelectedUser(user)
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
    setIsReferrerDialogOpen(true)
  }

  const handleUpdateUserStatus = async (userId: string, status: string, reason?: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, reason }),
      })

      if (response.ok) {
        // Refresh users list
        await fetchUsers()
        setIsSuspendDialogOpen(false)
      } else {
        console.error("Failed to update user status")
      }
    } catch (error) {
      console.error("Error updating user status:", error)
    }
  }

  const handleUpdateKycStatus = async (userId: string, kycStatus: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/kyc`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ kycStatus }),
      })

      if (response.ok) {
        // Refresh users list
        await fetchUsers()
        setIsKycDialogOpen(false)
      } else {
        console.error("Failed to update KYC status")
      }
    } catch (error) {
      console.error("Error updating KYC status:", error)
    }
  }

  const handleResetPasswordConfirm = async (userId: string, newPassword: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/reset-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword }),
      })

      if (response.ok) {
        setIsPasswordResetDialogOpen(false)
        alert("Password reset successfully")
      } else {
        console.error("Failed to reset password")
        alert("Failed to reset password")
      }
    } catch (error) {
      console.error("Error resetting password:", error)
      alert("Error resetting password")
    }
  }

  const handleImpersonateConfirm = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/impersonate`, {
        method: 'POST',
      })

      if (response.ok) {
        const data = await response.json()
        // Store impersonation session
        localStorage.setItem('impersonating', JSON.stringify({
          userId,
          originalUser: user,
          impersonatedAt: new Date().toISOString()
        }))
        window.location.href = '/dashboard'
      } else {
        console.error("Failed to impersonate user")
        alert("Failed to impersonate user")
      }
    } catch (error) {
      console.error("Error impersonating user:", error)
      alert("Error impersonating user")
    }
  }

  const handleEditUserConfirm = async (userId: string, updates: { fullName?: string; email?: string; phone?: string }) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        // Refresh users list
        await fetchUsers()
        setIsEditDialogOpen(false)
        alert("User updated successfully")
      } else {
        console.error("Failed to update user")
        alert("Failed to update user")
      }
    } catch (error) {
      console.error("Error updating user:", error)
      alert("Error updating user")
    }
  }

  // Enhanced filtering
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes((localSearchTerm || searchTerm || "").toLowerCase()) ||
      user.email.toLowerCase().includes((localSearchTerm || searchTerm || "").toLowerCase()) ||
      user.phone.includes(localSearchTerm || searchTerm || "") ||
      user.referralCode.toLowerCase().includes((localSearchTerm || searchTerm || "").toLowerCase())

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
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        )
      case "suspended":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Suspended
          </Badge>
        )
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getKycBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            <Shield className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Users Management</h1>
            <p className="text-muted-foreground">Manage user accounts, KYC status, and permissions</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 animate-pulse">
                  <div className="w-10 h-10 bg-muted rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
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
    return (
      <Card>
        <CardHeader>
          <CardTitle>Users Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 animate-pulse">
                <div className="w-10 h-10 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!user || user.role !== "admin") {
    return <div className="p-4 text-red-600">Access denied: Admins only.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users Management</h1>
          <p className="text-muted-foreground">Manage user accounts, KYC status, and permissions</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={fetchUsers}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search users by name, email, phone, or referral code..."
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterKyc} onValueChange={setFilterKyc}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Filter by KYC" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All KYC</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            All Users ({filteredUsers.length})
          </CardTitle>
          <CardDescription>View and manage all registered users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <div className="max-h-[600px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Wallet</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>KYC</TableHead>
                    <TableHead>Referrals</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="w-[50px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.fullName}</div>
                            <div className="text-sm text-muted-foreground">{user.referralCode}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">{user.email}</div>
                          <div className="text-sm text-muted-foreground">{user.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{formatCurrency(user.walletBalance)}</div>
                      </TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>{getKycBadge(user.kycStatus)}</TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm font-medium">{user.totalReferrals} referrals</div>
                          <div className="text-sm text-muted-foreground">{formatCurrency(user.totalEarnings)}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>L{user.referralLevel || 1}</div>
                          {user.elevateXLevel && <div className="text-muted-foreground">EX{user.elevateXLevel}</div>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{formatDate(user.createdAt)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              setDropdownOpen(dropdownOpen === user.id ? null : user.id)
                            }}
                            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                            aria-label={`Actions for ${user.fullName}`}
                          >
                            <MoreHorizontal className="h-4 w-4 text-gray-600" />
                          </button>

                          {dropdownOpen === user.id && (
                            <div className="absolute right-0 top-8 mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                              <div className="py-1">
                                <button
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    handleViewProfile(user)
                                    setDropdownOpen(null)
                                  }}
                                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Profile
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    handleEditUser(user)
                                    setDropdownOpen(null)
                                  }}
                                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit User
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    handleVerifyKyc(user)
                                    setDropdownOpen(null)
                                  }}
                                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <UserCheck className="h-4 w-4 mr-2" />
                                  Verify KYC
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    handleSuspendUser(user)
                                    setDropdownOpen(null)
                                  }}
                                  className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                                >
                                  <UserX className="h-4 w-4 mr-2" />
                                  Suspend User
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    handleResetPassword(user)
                                    setDropdownOpen(null)
                                  }}
                                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <Key className="h-4 w-4 mr-2" />
                                  Reset Password
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    handleChangeReferrer(user)
                                    setDropdownOpen(null)
                                  }}
                                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <UserCog className="h-4 w-4 mr-2" />
                                  Change Referrer
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    handleImpersonateUser(user)
                                    setDropdownOpen(null)
                                  }}
                                  className="flex items-center w-full px-3 py-2 text-sm text-blue-600 hover:bg-gray-100"
                                >
                                  <User className="h-4 w-4 mr-2" />
                                  Impersonate User
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No users found matching your search criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced View Profile Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
            <DialogDescription>
              Comprehensive view of {selectedUser?.fullName}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="referrals">Referrals</TabsTrigger>
                <TabsTrigger value="utilities">Utilities</TabsTrigger>
                <TabsTrigger value="elevatex">ElevateX</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="text-xl">
                      {getInitials(selectedUser.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold">{selectedUser.fullName}</h3>
                    <p className="text-muted-foreground">{selectedUser.email}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      {getStatusBadge(selectedUser.status)}
                      {getKycBadge(selectedUser.kycStatus)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">Wallet Balance</div>
                    <div className="text-lg font-semibold text-green-600">{formatCurrency(selectedUser.walletBalance)}</div>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">Total Referrals</div>
                    <div className="text-lg font-semibold">{selectedUser.totalReferrals}</div>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">Referral Level</div>
                    <div className="text-lg font-semibold">L{selectedUser.referralLevel || 1}</div>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">Member Since</div>
                    <div className="text-lg font-semibold">{formatDate(selectedUser.createdAt)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Contact Information</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Phone:</strong> {selectedUser.phone}</div>
                      <div><strong>Email:</strong> {selectedUser.email}</div>
                      <div><strong>Referral Code:</strong> <code>{selectedUser.referralCode}</code></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Financial Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Total Earnings:</strong> {formatCurrency(selectedUser.totalEarnings)}</div>
                      <div><strong>Total Deposits:</strong> {formatCurrency(selectedUser.totalDeposits || 0)}</div>
                      <div><strong>Total Withdrawals:</strong> {formatCurrency(selectedUser.totalWithdrawals || 0)}</div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="transactions">
                <div className="space-y-4">
                  <h4 className="font-semibold">Transaction History</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {userTransactions.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">No transactions found</p>
                    ) : (
                      userTransactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                          <div>
                            <div className="font-medium">{transaction.description}</div>
                            <div className="text-sm text-muted-foreground">{formatDate(transaction.createdAt)}</div>
                          </div>
                          <div className="text-right">
                            <div className={`font-medium ${transaction.type === 'deposit' ? 'text-green-600' : transaction.type === 'withdrawal' ? 'text-red-600' : 'text-blue-600'}`}>
                              {transaction.type === 'deposit' ? '+' : transaction.type === 'withdrawal' ? '-' : ''}
                              {formatCurrency(transaction.amount)}
                            </div>
                            <div className={`text-sm ${transaction.status === 'completed' ? 'text-green-600' : transaction.status === 'pending' ? 'text-yellow-600' : 'text-red-600'}`}>
                              {transaction.status}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="referrals">
                <div className="space-y-4">
                  <h4 className="font-semibold">Referral Tree</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {userReferrals.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">No referrals found</p>
                    ) : (
                      userReferrals.map((referral) => (
                        <div key={referral.id} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                          <div>
                            <div className="font-medium">{referral.referredUserName}</div>
                            <div className="text-sm text-muted-foreground">{referral.referredUserEmail}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm">
                              <Badge variant={referral.status === 'active' ? 'default' : 'secondary'}>
                                Level {referral.level}
                              </Badge>
                            </div>
                            <div className="text-sm text-green-600">
                              +{formatCurrency(referral.bonusAmount)}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="utilities">
                <div className="space-y-4">
                  <h4 className="font-semibold">Utility Purchases</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-muted/50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">{selectedUser.utilityPurchases || 0}</div>
                      <div className="text-sm text-muted-foreground">Total Purchases</div>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">{formatCurrency((selectedUser.utilityPurchases || 0) * 1000)}</div>
                      <div className="text-sm text-muted-foreground">Total Spent</div>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-600">{selectedUser.utilityPurchases ? 'Active' : 'Inactive'}</div>
                      <div className="text-sm text-muted-foreground">Status</div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="elevatex">
                <div className="space-y-4">
                  <h4 className="font-semibold">ElevateX Progress</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Current Level</span>
                          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500">
                            EX{selectedUser.elevateXLevel || 1}
                          </Badge>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full w-3/4"></div>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">75% to next level</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Referrals Made</span>
                        <span className="font-medium">{selectedUser.totalReferrals}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Network Size</span>
                        <span className="font-medium">{selectedUser.totalReferrals * 3}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Bonus Earned</span>
                        <span className="font-medium text-green-600">{formatCurrency(selectedUser.totalEarnings)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information for {selectedUser?.fullName}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  defaultValue={selectedUser.fullName}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  defaultValue={selectedUser.email}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  defaultValue={selectedUser.phone}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    const fullName = (document.getElementById('fullName') as HTMLInputElement)?.value || ''
                    const email = (document.getElementById('email') as HTMLInputElement)?.value || ''
                    const phone = (document.getElementById('phone') as HTMLInputElement)?.value || ''

                    if (fullName && email && phone) {
                      handleEditUserConfirm(selectedUser.id, { fullName, email, phone })
                    }
                  }}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* KYC Verification Dialog */}
      <Dialog open={isKycDialogOpen} onOpenChange={setIsKycDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>KYC Verification</DialogTitle>
            <DialogDescription>
              Update KYC status for {selectedUser?.fullName}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="kycStatus">KYC Status</Label>
                <Select value={selectedKycStatus} onValueChange={setSelectedKycStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select KYC status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsKycDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    handleUpdateKycStatus(selectedUser.id, selectedKycStatus)
                  }}
                >
                  Update Status
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Suspend User Dialog */}
      <Dialog open={isSuspendDialogOpen} onOpenChange={setIsSuspendDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Suspend User</DialogTitle>
            <DialogDescription>
              Are you sure you want to suspend {selectedUser?.fullName}?
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reason">Reason (Optional)</Label>
                <Textarea
                  id="reason"
                  placeholder="Enter reason for suspension"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsSuspendDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    const reason = (document.getElementById('reason') as HTMLTextAreaElement)?.value || ''
                    handleUpdateUserStatus(selectedUser.id, 'suspended', reason)
                  }}
                >
                  Suspend User
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Password Reset Dialog */}
      <Dialog open={isPasswordResetDialogOpen} onOpenChange={setIsPasswordResetDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Reset password for {selectedUser?.fullName}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsPasswordResetDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    const newPassword = (document.getElementById('newPassword') as HTMLInputElement)?.value || ''
                    if (newPassword) {
                      handleResetPasswordConfirm(selectedUser.id, newPassword)
                    }
                  }}
                >
                  Reset Password
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Impersonate User Dialog */}
      <Dialog open={isImpersonateDialogOpen} onOpenChange={setIsImpersonateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Impersonate User</DialogTitle>
            <DialogDescription>
              You are about to log in as {selectedUser?.fullName}. This action will be logged for security purposes.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium">Security Notice</p>
                    <p>Impersonation sessions are logged and monitored. Use this feature responsibly for support purposes only.</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsImpersonateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    handleImpersonateConfirm(selectedUser.id)
                  }}
                >
                  Continue Impersonation
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Change Referrer Dialog */}
      <Dialog open={isReferrerDialogOpen} onOpenChange={setIsReferrerDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Change Referrer</DialogTitle>
            <DialogDescription>
              Update referrer for {selectedUser?.fullName}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="referrerCode">New Referrer Code</Label>
                <Input
                  id="referrerCode"
                  value={newReferrerCode}
                  onChange={(e) => setNewReferrerCode(e.target.value)}
                  placeholder="Enter new referrer code"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsReferrerDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (newReferrerCode.trim()) {
                      handleChangeReferrerConfirm(selectedUser.id, newReferrerCode.trim())
                    }
                  }}
                >
                  Update Referrer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
