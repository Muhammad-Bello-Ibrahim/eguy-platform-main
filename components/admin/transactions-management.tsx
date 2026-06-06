"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Download, ArrowUpRight, ArrowDownLeft, Plus, Minus, Users, CreditCard, Eye, MoreVertical, RefreshCw, AlertCircle, Filter, FileText, CheckCircle2, XCircle, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

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
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm || "")
  const { toast } = useToast()

  // Prevent hydration mismatch by only checking session after client-side mount
  React.useEffect(() => {
    setIsClient(true)
  }, [])

  // Get user from sessionStorage (or context/provider in production)
  const user = typeof window !== "undefined" ? JSON.parse(window.sessionStorage.getItem("user") || "null") : null;

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

  useEffect(() => {
    if (isClient) {
      fetchTransactions()
    }
  }, [isClient])

  if (!isClient) return null;

  if (!user || user.role !== "admin") {
    return <div className="p-4 text-red-650 dark:text-red-400 bg-red-50 dark:bg-red-500/10 rounded-lg border border-red-100 dark:border-red-500/20">Access denied: Admins only.</div>;
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
        return <ArrowDownLeft className="h-4 w-4 text-emerald-400" />
      case "withdrawal":
        return <ArrowUpRight className="h-4 w-4 text-red-400" />
      case "transfer":
        return <RefreshCw className="h-4 w-4 text-primary" />
      case "payment":
        return <CreditCard className="h-4 w-4 text-purple-400" />
      case "referral_bonus":
        return <Users className="h-4 w-4 text-amber-400" />
      default:
        return <FileText className="h-4 w-4 text-slate-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="text-emerald-400 bg-emerald-500/10 border-emerald-500/20 flex items-center gap-1 font-semibold">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="text-amber-400 bg-amber-500/10 border-amber-500/20 flex items-center gap-1 font-semibold">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="text-red-400 bg-red-500/10 border-red-500/20 flex items-center gap-1 font-semibold">
            <AlertCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="text-slate-400 bg-slate-500/10 border-slate-500/20 flex items-center gap-1 font-semibold">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline" className="text-slate-450 bg-slate-500/10 border-slate-500/20 font-semibold">{status}</Badge>
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
    const label = typeLabels[type as keyof typeof typeLabels] || type

    let className = "text-slate-400 bg-slate-500/10 border-slate-500/20 font-semibold"
    if (type === 'deposit') className = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 font-semibold"
    if (type === 'withdrawal') className = "text-red-400 bg-red-500/10 border-red-500/20 font-semibold"
    if (type === 'referral_bonus') className = "text-amber-400 bg-amber-500/10 border-amber-500/20 font-semibold"

    return <Badge variant="outline" className={className}>{label}</Badge>
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Transactions</h1>
            <p className="text-slate-500 dark:text-slate-400">Monitor platform activity</p>
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Transactions</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Monitor and manage all financial transactions.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="border border-slate-200 dark:border-slate-800/50 bg-white dark:bg-card-dark hover:bg-slate-50 dark:hover:bg-neutral-dark text-slate-800 dark:text-slate-200 rounded-xl">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="ghost" size="icon" onClick={fetchTransactions} className="text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary hover:bg-slate-100 dark:hover:bg-white/5">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Modern Filter Toolbar */}
      <Card className="border border-slate-200 dark:border-slate-800/30 bg-white dark:bg-card-dark shadow-sm dark:shadow-none overflow-visible">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 h-4 w-4" />
              <Input
                placeholder="Search by ref, user, description..."
                value={searchTerm || ""}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-50 dark:bg-background-dark border-slate-200 dark:border-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:border-primary transition-all text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] bg-slate-50 dark:bg-background-dark border-slate-200 dark:border-slate-800/50 text-slate-800 dark:text-slate-200">
                  <div className="flex items-center gap-2">
                    <Filter className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800/50">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px] bg-slate-50 dark:bg-background-dark border-slate-200 dark:border-slate-800/50 text-slate-800 dark:text-slate-200">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    <SelectValue placeholder="Type" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800/50">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="deposit">Deposit</SelectItem>
                  <SelectItem value="withdrawal">Withdrawal</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
                  <SelectItem value="referral_bonus">Referral Bonus</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions Bar */}
      {selectedTransactions.size > 0 && (
        <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20 animate-in fade-in slide-in-from-top-2">
          <span className="text-sm font-medium text-primary flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {selectedTransactions.size} transaction{selectedTransactions.size !== 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction("approve")}
              disabled={isActionLoading}
              className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-450 border border-emerald-500/30 shadow-sm hover:text-emerald-300 rounded-xl font-bold transition-all duration-200"
            >
              {isActionLoading ? <RefreshCw className="h-3.5 w-3.5 animate-spin mr-2" /> : <CheckCircle2 className="h-3.5 w-3.5 mr-2" />}
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction("reject")}
              disabled={isActionLoading}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 shadow-sm hover:text-red-350 rounded-xl font-bold transition-all duration-200"
            >
              {isActionLoading ? <RefreshCw className="h-3.5 w-3.5 animate-spin mr-2" /> : <XCircle className="h-3.5 w-3.5 mr-2" />}
              Reject
            </Button>
          </div>
        </div>
      )}

      <Card className="border border-slate-200 dark:border-slate-800/30 bg-white dark:bg-card-dark shadow-sm dark:shadow-none">
        <CardHeader className="px-6 py-4 border-b border-slate-200 dark:border-slate-800/50 bg-slate-50/20 dark:bg-neutral-dark/10">
          <CardTitle className="text-base font-bold text-slate-900 dark:text-white">Transaction History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative">
            {/* Desktop / Tablet Table */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50 dark:bg-neutral-dark/30 border-b border-slate-200 dark:border-slate-800/50">
                  <TableRow className="border-b border-slate-200 dark:border-slate-800/50 hover:bg-transparent">
                    <TableHead className="w-12 pl-6">
                      <Checkbox
                        checked={selectedTransactions.size === filteredTransactions.length && filteredTransactions.length > 0}
                        onCheckedChange={selectAllTransactions}
                        className="border-slate-300 dark:border-slate-700 data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-background-dark"
                      />
                    </TableHead>
                    <TableHead className="font-semibold text-slate-600 dark:text-slate-300">Transaction</TableHead>
                    <TableHead className="font-semibold text-slate-600 dark:text-slate-300">User</TableHead>
                    <TableHead className="font-semibold text-slate-600 dark:text-slate-300">Type</TableHead>
                    <TableHead className="font-semibold text-slate-600 dark:text-slate-300">Amount</TableHead>
                    <TableHead className="font-semibold text-slate-600 dark:text-slate-300">Status</TableHead>
                    <TableHead className="font-semibold text-slate-600 dark:text-slate-300">Date</TableHead>
                    <TableHead className="text-right pr-6 align-middle font-semibold text-slate-600 dark:text-slate-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-64 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center">
                          <div className="p-4 bg-slate-50 dark:bg-neutral-dark/40 rounded-full mb-3">
                            <FileText className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                          </div>
                          <p className="text-slate-550 dark:text-slate-450">No transactions found matching your filters.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id} className="border-b border-slate-200 dark:border-slate-800/30 hover:bg-slate-50 dark:hover:bg-neutral-dark/40 transition-colors group text-slate-700 dark:text-slate-300">
                      <TableCell className="pl-6">
                        <Checkbox
                          checked={selectedTransactions.has(transaction.id)}
                          onCheckedChange={() => toggleTransactionSelection(transaction.id)}
                          className="border-slate-300 dark:border-slate-700 data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-background-dark"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-800/50">
                            {getTransactionIcon(transaction.type)}
                          </div>
                          <div className="max-w-[180px]">
                            <div className="font-medium text-slate-900 dark:text-white truncate" title={transaction.description}>{transaction.description}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-450 font-mono">{transaction.reference}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[150px]">
                          <div className="font-medium text-slate-900 dark:text-white truncate">{transaction.userName || "Unknown"}</div>
                          {transaction.userEmail && (
                            <div className="text-xs text-slate-500 dark:text-slate-450 truncate">{transaction.userEmail}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getTypeBadge(transaction.type)}</TableCell>
                      <TableCell>
                        <div
                          className={`font-semibold ${transaction.type === "deposit" || transaction.type === "referral_bonus"
                            ? "text-emerald-450"
                            : "text-slate-905 dark:text-white"
                            }`}
                        >
                          {transaction.type === "deposit" || transaction.type === "referral_bonus" ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                      <TableCell>
                        <div className="text-sm text-slate-600 dark:text-slate-400">{formatDate(transaction.createdAt)}</div>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 group-hover:text-primary transition-colors hover:bg-slate-100 dark:hover:bg-white/5">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800/50 shadow-2xl">
                            <DropdownMenuLabel className="text-slate-900 dark:text-white font-bold">Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator className="border-slate-100 dark:border-slate-800/50" />
                            <DropdownMenuItem onClick={() => handleViewDetails(transaction)} className="hover:bg-slate-100 dark:hover:bg-white/5">
                              <Eye className="h-4 w-4 mr-2 text-slate-500" /> View Details
                            </DropdownMenuItem>
                            {transaction.status === 'pending' && (
                              <>
                                <DropdownMenuSeparator className="border-slate-100 dark:border-slate-800/50" />
                                <DropdownMenuItem onClick={() => handleTransactionAction(transaction.id, 'approve')} className="text-emerald-450 hover:bg-emerald-500/10 focus:text-green-600">
                                  <CheckCircle2 className="h-4 w-4 mr-2" /> Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleTransactionAction(transaction.id, 'reject')} className="text-red-400 hover:bg-red-500/10 focus:text-red-650">
                                  <XCircle className="h-4 w-4 mr-2" /> Reject
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile: stacked cards */}
            <div className="block md:hidden bg-slate-50/50 dark:bg-neutral-dark/10 p-4 space-y-4">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800/30 rounded-xl p-4 shadow-sm dark:shadow-none relative overflow-hidden">
                  {/* Status Stripe */}
                  <div className={`absolute top-0 left-0 w-1 h-full ${transaction.status === 'completed' ? 'bg-emerald-500' :
                    transaction.status === 'pending' ? 'bg-amber-500' :
                      transaction.status === 'failed' ? 'bg-red-500' : 'bg-slate-350'
                    }`} />

                  <div className="flex items-start justify-between mb-3 pl-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-slate-50 dark:bg-neutral-dark/40 rounded-full flex items-center justify-center border border-slate-100 dark:border-slate-800/50">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{transaction.description}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-450 font-mono">{transaction.reference}</div>
                      </div>
                    </div>
                    <div className={`font-bold ${transaction.type === 'deposit' || transaction.type === 'referral_bonus' ? 'text-emerald-450' : 'text-slate-900 dark:text-white'
                      }`}>
                      {transaction.type === 'deposit' || transaction.type === 'referral_bonus' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-200 dark:border-slate-800/30 mb-3 pl-3">
                    <div>
                      <span className="text-xs text-slate-400 dark:text-slate-500 block mb-1">User</span>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">U</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate max-w-[100px]">{transaction.userName}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 dark:text-slate-500 block mb-1">Status</span>
                      <div className="flex justify-end">{getStatusBadge(transaction.status)}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pl-3">
                    <span className="text-xs text-slate-400 dark:text-slate-500">{formatDate(transaction.createdAt)}</span>
                    <Button variant="ghost" size="sm" className="h-8 text-slate-500 dark:text-slate-400 hover:text-primary" onClick={() => handleViewDetails(transaction)}>
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-xl bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800/50 shadow-2xl">
          <DialogHeader className="pb-4 border-b border-slate-200 dark:border-slate-800/50">
            <DialogTitle className="flex items-center gap-3 text-xl text-slate-900 dark:text-white">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-800/50">
                {selectedTransaction && getTransactionIcon(selectedTransaction.type)}
              </div>
              <div>
                <div>Transaction Details</div>
                <div className="text-sm font-normal text-slate-500 dark:text-slate-400 mt-1 font-mono">#{selectedTransaction?.id}</div>
              </div>
            </DialogTitle>
          </DialogHeader>

          {selectedTransaction && (
            <div className="py-4 text-slate-900 dark:text-slate-100">
              <div className="flex flex-col items-center justify-center py-6 bg-slate-50/50 dark:bg-neutral-dark/30 rounded-lg border border-slate-200 dark:border-slate-800/50 mb-6">
                <span className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Amount</span>
                <div className={`text-3xl font-bold ${selectedTransaction.type === 'deposit' || selectedTransaction.type === 'referral_bonus' ? 'text-emerald-450' : 'text-slate-900 dark:text-white'
                  }`}>
                  {formatCurrency(selectedTransaction.amount)}
                </div>
                <div className="mt-2">{getStatusBadge(selectedTransaction.status)}</div>
              </div>

              <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                <div>
                  <label className="text-xs text-slate-400 dark:text-slate-500 uppercase font-semibold">Type</label>
                  <div className="mt-1 font-medium text-slate-700 dark:text-slate-300 capitalize">{selectedTransaction.type.replace('_', ' ')}</div>
                </div>
                <div>
                  <label className="text-xs text-slate-400 dark:text-slate-500 uppercase font-semibold">Date & Time</label>
                  <div className="mt-1 font-medium text-slate-700 dark:text-slate-300">{formatDate(selectedTransaction.createdAt)}</div>
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-slate-400 dark:text-slate-500 uppercase font-semibold">User</label>
                  <div className="mt-1 flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">U</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{selectedTransaction.userName}</span>
                    <span className="text-slate-400 dark:text-slate-500">•</span>
                    <span className="text-slate-500 dark:text-slate-400">{selectedTransaction.userEmail}</span>
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-slate-400 dark:text-slate-500 uppercase font-semibold">Description</label>
                  <div className="mt-1 p-3 bg-slate-55 dark:bg-background-dark rounded border border-slate-200 dark:border-slate-800/50 text-slate-600 dark:text-slate-300">
                    {selectedTransaction.description}
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-slate-400 dark:text-slate-500 uppercase font-semibold">Reference</label>
                  <div className="mt-1 font-mono text-slate-600 dark:text-slate-400 select-all">{selectedTransaction.reference}</div>
                </div>
              </div>

              {selectedTransaction.status === "pending" && (
                <div className="flex gap-3 mt-8 pt-4 border-t border-slate-200 dark:border-slate-800/50">
                  <Button
                    onClick={() => {
                      handleTransactionAction(selectedTransaction.id, "approve")
                      setIsDetailsModalOpen(false)
                    }}
                    disabled={isActionLoading}
                    className="flex-1 bg-primary hover:bg-primary/90 text-background-dark font-extrabold shadow-lg shadow-primary/20 transition-all duration-200 active:scale-95 rounded-xl"
                  >
                    {isActionLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleTransactionAction(selectedTransaction.id, "reject")
                      setIsDetailsModalOpen(false)
                    }}
                    disabled={isActionLoading}
                    className="flex-1 border border-slate-200 dark:border-slate-800/50 bg-white dark:bg-card-dark hover:bg-slate-50 dark:hover:bg-neutral-dark text-slate-800 dark:text-slate-200 rounded-xl"
                  >
                    {isActionLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
                    Reject
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
