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
import { Search, MoreHorizontal, UserCheck, UserX, Eye, Edit, CheckCircle, XCircle } from "lucide-react"

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
}

export function UsersManagement({ searchTerm }: { searchTerm?: string }) {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isKycDialogOpen, setIsKycDialogOpen] = useState(false)
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false)
  const [selectedKycStatus, setSelectedKycStatus] = useState<string>("")
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)

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

  // Action handlers
  const handleViewProfile = (user: User) => {
    setSelectedUser(user)
    setIsViewDialogOpen(true)
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

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes((searchTerm || "").toLowerCase()) ||
      user.email.toLowerCase().includes((searchTerm || "").toLowerCase()) ||
      user.phone.includes(searchTerm || ""),
  )

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
            Active
          </Badge>
        )
      case "suspended":
        return <Badge variant="destructive">Suspended</Badge>
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
            Verified
          </Badge>
        )
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
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
            <CardTitle>All Users</CardTitle>
            <CardDescription>View and manage all registered users</CardDescription>
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
          <CardTitle>All Users</CardTitle>
          <CardDescription>View and manage all registered users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm || ""}
                readOnly
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="bg-transparent">
              Export CSV
            </Button>
          </div>

          <div className="rounded-md border overflow-hidden">
            <div className="max-h-[600px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Wallet Balance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>KYC</TableHead>
                    <TableHead>Referrals</TableHead>
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
                            <div className="absolute right-0 top-8 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
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

      {/* View Profile Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
            <DialogDescription>
              Detailed information about {selectedUser?.fullName}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg">
                    {getInitials(selectedUser.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedUser.fullName}</h3>
                  <p className="text-muted-foreground">{selectedUser.email}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    {getStatusBadge(selectedUser.status)}
                    {getKycBadge(selectedUser.kycStatus)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Phone Number</Label>
                  <p className="text-sm">{selectedUser.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Referral Code</Label>
                  <p className="text-sm font-mono">{selectedUser.referralCode}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Wallet Balance</Label>
                  <p className="text-sm font-semibold text-green-600">
                    {formatCurrency(selectedUser.walletBalance)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Total Referrals</Label>
                  <p className="text-sm">{selectedUser.totalReferrals}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Total Earnings</Label>
                  <p className="text-sm font-semibold text-blue-600">
                    {formatCurrency(selectedUser.totalEarnings)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Member Since</Label>
                  <p className="text-sm">{formatDate(selectedUser.createdAt)}</p>
                </div>
              </div>
            </div>
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
                <Button>Save Changes</Button>
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
    </div>
  )
}
