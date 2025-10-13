"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Download, ArrowUpRight, ArrowDownLeft, Plus, Minus, Users, CreditCard, Eye, MoreVertical, RefreshCw, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Transaction {
  id: string
  userId: string
  userName: string
  userEmail?: string
  type: "deposit" | "withdrawal" | "transfer" | "payment" | "referral_bonus"
  amount: number
  description: string
  status: "pending" | "completed" | "failed" | "cancelled"
  reference: string
  createdAt: string
  metadata?: any
}

export function TransactionsManagement({ searchTerm: initialSearchTerm }: { searchTerm?: string }) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(new Set())
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm || "")
  const { toast } = useToast()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdownId && !(event.target as Element).closest('.relative')) {
        setOpenDropdownId(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openDropdownId])

  // Prevent hydration mismatch by only checking session after client-side mount
  React.useEffect(() => {
    setIsClient(true)
  }, [])

  // Get user from sessionStorage (or context/provider in production)
  const user = typeof window !== "undefined" ? JSON.parse(window.sessionStorage.getItem("user") || "null") : null;

  useEffect(() => {
    if (isClient) {
      fetchTransactions()
    }
  }, [isClient])

  if (!isClient) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transactions Management</CardTitle>
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

  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/admin/transactions")
      if (response.ok) {
        const data = await response.json()
        setTransactions(data.transactions || [])
      } else {
        console.error("Failed to fetch transactions:", response.statusText)
        setTransactions([])
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error)
      setTransactions([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleTransactionAction = async (transactionId: string, action: string) => {
    setIsActionLoading(true)
    try {
      const response = await fetch("/api/admin/transactions", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transactionId,
          action,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Action failed")
      }

      toast({
        title: "Action Successful",
        description: data.message,
      })

      // Update the transaction in the list
      setTransactions(prev =>
        prev.map(t =>
          t.id === transactionId
            ? { ...t, status: data.transaction.status }
            : t
        )
      )

      // Clear selection
      setSelectedTransactions(new Set())
    } catch (error) {
      toast({
        title: "Action Failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setIsDetailsModalOpen(true)
  }

  const handleBulkAction = async (action: string) => {
    if (selectedTransactions.size === 0) {
      toast({
        title: "No Selection",
        description: "Please select transactions to perform bulk actions",
        variant: "destructive",
      })
      return
    }

    setIsActionLoading(true)
    try {
      const promises = Array.from(selectedTransactions).map(transactionId =>
        fetch("/api/admin/transactions", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transactionId,
            action,
          }),
        })
      )

      const results = await Promise.allSettled(promises)
      const successful = results.filter(r => r.status === "fulfilled").length

      toast({
        title: "Bulk Action Completed",
        description: `${successful} of ${selectedTransactions.size} transactions updated successfully`,
      })

      // Refresh transactions
      fetchTransactions()
      setSelectedTransactions(new Set())
    } catch (error) {
      toast({
        title: "Bulk Action Failed",
        description: "Something went wrong with the bulk action",
        variant: "destructive",
      })
    } finally {
      setIsActionLoading(false)
    }
  }

  const toggleTransactionSelection = (transactionId: string) => {
    const newSelection = new Set(selectedTransactions)
    if (newSelection.has(transactionId)) {
      newSelection.delete(transactionId)
    } else {
      newSelection.add(transactionId)
    }
    setSelectedTransactions(newSelection)
  }

  const selectAllTransactions = () => {
    if (selectedTransactions.size === filteredTransactions.length) {
      setSelectedTransactions(new Set())
    } else {
      setSelectedTransactions(new Set(filteredTransactions.map(t => t.id)))
    }
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      (transaction.userName || "").toLowerCase().includes((searchTerm || "").toLowerCase()) ||
      (transaction.userEmail || "").toLowerCase().includes((searchTerm || "").toLowerCase()) ||
      (transaction.reference || "").toLowerCase().includes((searchTerm || "").toLowerCase()) ||
      (transaction.description || "").toLowerCase().includes((searchTerm || "").toLowerCase())

    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter
    const matchesType = typeFilter === "all" || transaction.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
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
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <Plus className="h-4 w-4 text-green-600" />
      case "withdrawal":
        return <Minus className="h-4 w-4 text-red-600" />
      case "transfer":
        return <ArrowUpRight className="h-4 w-4 text-blue-600" />
      case "payment":
        return <CreditCard className="h-4 w-4 text-orange-600" />
      case "referral_bonus":
        return <Users className="h-4 w-4 text-purple-600" />
      default:
        return <ArrowDownLeft className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Completed
          </Badge>
        )
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      case "cancelled":
        return <Badge variant="outline">Cancelled</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    const typeLabels = {
      deposit: "Deposit",
      withdrawal: "Withdrawal",
      transfer: "Transfer",
      payment: "Payment",
      referral_bonus: "Referral Bonus",
    }

    return <Badge variant="outline">{typeLabels[type as keyof typeof typeLabels] || type}</Badge>
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transactions Management</CardTitle>
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Transactions Management</h1>
          <p className="text-muted-foreground">Monitor and manage all platform transactions</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>View and manage all financial transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm || ""}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="deposit">Deposit</SelectItem>
                <SelectItem value="withdrawal">Withdrawal</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
                <SelectItem value="payment">Payment</SelectItem>
                <SelectItem value="referral_bonus">Referral Bonus</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          {selectedTransactions.size > 0 && (
            <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <span className="text-sm font-medium text-blue-900">
                {selectedTransactions.size} transaction{selectedTransactions.size !== 1 ? 's' : ''} selected
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction("approve")}
                disabled={isActionLoading}
                className="text-green-700 border-green-300 hover:bg-green-50"
              >
                {isActionLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                Approve Selected
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction("reject")}
                disabled={isActionLoading}
                className="text-red-700 border-red-300 hover:bg-red-50"
              >
                {isActionLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                Reject Selected
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction("cancel")}
                disabled={isActionLoading}
                className="text-orange-700 border-orange-300 hover:bg-orange-50"
              >
                {isActionLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                Cancel Selected
              </Button>
            </div>
          )}

          <div className="rounded-md border overflow-hidden">
            <div className="relative overflow-auto max-h-[600px]">
              <Table className="min-w-full">
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedTransactions.size === filteredTransactions.length && filteredTransactions.length > 0}
                        onCheckedChange={selectAllTransactions}
                      />
                    </TableHead>
                    <TableHead>Transaction</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-20">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id} className="relative">
                      <TableCell>
                        <Checkbox
                          checked={selectedTransactions.has(transaction.id)}
                          onCheckedChange={() => toggleTransactionSelection(transaction.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                            {getTransactionIcon(transaction.type)}
                          </div>
                          <div>
                            <div className="font-medium text-sm">{transaction.description}</div>
                            <div className="text-xs text-muted-foreground">ID: {transaction.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{transaction.userName || "Unknown User"}</div>
                          {transaction.userEmail && (
                            <div className="text-xs text-muted-foreground">{transaction.userEmail}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getTypeBadge(transaction.type)}</TableCell>
                      <TableCell>
                        <div
                          className={`font-medium ${
                            transaction.type === "deposit" || transaction.type === "referral_bonus"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.type === "deposit" || transaction.type === "referral_bonus" ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                      <TableCell>
                        <div className="font-mono text-xs">{transaction.reference || "No reference"}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{formatDate(transaction.createdAt)}</div>
                      </TableCell>
                      <TableCell className="relative">
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-muted"
                            onClick={(e) => {
                              e.stopPropagation()
                              // Toggle custom dropdown for this row
                              setOpenDropdownId(openDropdownId === transaction.id ? null : transaction.id)
                            }}
                          >
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>

                          {/* Custom dropdown menu */}
                          {openDropdownId === transaction.id && (
                            <div className="absolute right-0 top-8 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-[9999]">
                              <div className="py-1">
                                <button
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleViewDetails(transaction)
                                    setOpenDropdownId(null)
                                  }}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </button>
                                {transaction.status === "pending" && (
                                  <>
                                    <button
                                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center disabled:opacity-50"
                                      disabled={isActionLoading}
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleTransactionAction(transaction.id, "approve")
                                        setOpenDropdownId(null)
                                      }}
                                    >
                                      <Plus className="h-4 w-4 mr-2" />
                                      Approve
                                    </button>
                                    <button
                                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center disabled:opacity-50"
                                      disabled={isActionLoading}
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleTransactionAction(transaction.id, "reject")
                                        setOpenDropdownId(null)
                                      }}
                                    >
                                      <Minus className="h-4 w-4 mr-2" />
                                      Reject
                                    </button>
                                    <button
                                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center disabled:opacity-50"
                                      disabled={isActionLoading}
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleTransactionAction(transaction.id, "cancel")
                                        setOpenDropdownId(null)
                                      }}
                                    >
                                      <AlertCircle className="h-4 w-4 mr-2" />
                                      Cancel
                                    </button>
                                  </>
                                )}
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
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No transactions found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                {selectedTransaction && getTransactionIcon(selectedTransaction.type)}
              </div>
              Transaction Details
            </DialogTitle>
            <DialogDescription>
              Complete information about this transaction
            </DialogDescription>
          </DialogHeader>

          {selectedTransaction && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Transaction ID</label>
                  <p className="font-mono text-sm">{selectedTransaction.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Reference</label>
                  <p className="font-mono text-sm">{selectedTransaction.reference}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Type</label>
                  <div className="mt-1">{getTypeBadge(selectedTransaction.type)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedTransaction.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Amount</label>
                  <p className={`font-semibold ${
                    selectedTransaction.type === "deposit" || selectedTransaction.type === "referral_bonus"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}>
                    {selectedTransaction.type === "deposit" || selectedTransaction.type === "referral_bonus" ? "+" : "-"}
                    {formatCurrency(selectedTransaction.amount)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date</label>
                  <p className="text-sm">{formatDate(selectedTransaction.createdAt)}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="mt-1">{selectedTransaction.description}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">User Information</label>
                <div className="mt-2 p-3 bg-muted rounded-lg">
                  <p className="font-medium">{selectedTransaction.userName || "Unknown User"}</p>
                  {selectedTransaction.userEmail && (
                    <p className="text-sm text-muted-foreground">{selectedTransaction.userEmail}</p>
                  )}
                  <p className="text-xs text-muted-foreground">User ID: {selectedTransaction.userId}</p>
                </div>
              </div>

              {selectedTransaction.metadata && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Additional Information</label>
                  <pre className="mt-2 p-3 bg-muted rounded-lg text-xs overflow-x-auto">
                    {JSON.stringify(selectedTransaction.metadata, null, 2)}
                  </pre>
                </div>
              )}

              {selectedTransaction.status === "pending" && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={() => {
                      handleTransactionAction(selectedTransaction.id, "approve")
                      setIsDetailsModalOpen(false)
                    }}
                    disabled={isActionLoading}
                    className="flex-1"
                  >
                    {isActionLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                    Approve Transaction
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleTransactionAction(selectedTransaction.id, "reject")
                      setIsDetailsModalOpen(false)
                    }}
                    disabled={isActionLoading}
                    className="flex-1"
                  >
                    {isActionLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Minus className="h-4 w-4 mr-2" />}
                    Reject Transaction
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
