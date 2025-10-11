"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Minus,
  Users,
  CreditCard,
  Smartphone,
  Zap,
  GraduationCap,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Receipt,
  Calendar
} from "lucide-react"

interface Transaction {
  id: string
  type: "deposit" | "withdrawal" | "transfer" | "payment" | "referral_bonus" | "airtime" | "data" | "electricity" | "cable"
  amount: number
  description: string
  status: "pending" | "completed" | "failed" | "cancelled"
  reference?: string
  createdAt: string
  category?: string
  recipient?: string
  provider?: string
}

interface TransactionHistoryProps {
  refreshKey?: number;
}

export function TransactionHistory({ refreshKey }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedTransaction, setExpandedTransaction] = useState<string | null>(null)

  useEffect(() => {
    fetchTransactions()
  }, [refreshKey])

  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/wallet/transactions")
      if (response.ok) {
        const data = await response.json()
        setTransactions(data.transactions || [])
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getTransactionIcon = (type: string) => {
    const iconClass = "h-5 w-5"
    switch (type) {
      case "deposit":
        return <div className={`p-2 bg-green-100 rounded-full`}><Plus className={`${iconClass} text-green-600`} /></div>
      case "withdrawal":
        return <div className={`p-2 bg-red-100 rounded-full`}><Minus className={`${iconClass} text-red-600`} /></div>
      case "transfer":
        return <div className={`p-2 bg-blue-100 rounded-full`}><ArrowUpRight className={`${iconClass} text-blue-600`} /></div>
      case "payment":
        return <div className={`p-2 bg-orange-100 rounded-full`}><CreditCard className={`${iconClass} text-orange-600`} /></div>
      case "referral_bonus":
        return <div className={`p-2 bg-purple-100 rounded-full`}><Users className={`${iconClass} text-purple-600`} /></div>
      case "airtime":
        return <div className={`p-2 bg-cyan-100 rounded-full`}><Smartphone className={`${iconClass} text-cyan-600`} /></div>
      case "data":
        return <div className={`p-2 bg-indigo-100 rounded-full`}><Smartphone className={`${iconClass} text-indigo-600`} /></div>
      case "electricity":
        return <div className={`p-2 bg-yellow-100 rounded-full`}><Zap className={`${iconClass} text-yellow-600`} /></div>
      case "cable":
        return <div className={`p-2 bg-pink-100 rounded-full`}><GraduationCap className={`${iconClass} text-pink-600`} /></div>
      default:
        return <div className={`p-2 bg-gray-100 rounded-full`}><ArrowDownLeft className={`${iconClass} text-gray-600`} /></div>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-100">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300 hover:bg-red-100">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        )
      case "cancelled":
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-100">
            <AlertCircle className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-NG", {
        hour: "2-digit",
        minute: "2-digit",
      })
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString("en-NG", {
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    } else {
      return date.toLocaleDateString("en-NG", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    }
  }

  const filteredTransactions = useMemo(() => {
    let filtered = transactions

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filtered.slice(0, 10) // Limit to 10 transactions
  }, [transactions, searchTerm])

  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Receipt className="w-5 h-5" />
              Transaction History
            </CardTitle>
            <div className="flex gap-2">
              {["all", "income", "expense", "pending"].map((filterType) => (
                <div key={filterType} className="w-16 h-8 bg-slate-200 rounded-full animate-pulse" />
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 animate-pulse">
                <div className="w-12 h-12 bg-slate-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
                <div className="h-4 bg-slate-200 rounded w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Transaction History
          </h2>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1" onClick={() => window.location.href = '/transactions'}>
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <svg className="h-16 w-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-500 mb-2">
              {searchTerm ? "No transactions match your search" : "No transactions yet"}
            </p>
            <p className="text-sm text-gray-400">
              {searchTerm
                ? "Try adjusting your search criteria"
                : "Your transaction history will appear here"
              }
            </p>
          </div>
        ) : (
          filteredTransactions.slice(0, 5).map((transaction, index) => (
            <div
              key={transaction.id}
              className={`group bg-gray-50 hover:bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-all duration-200 cursor-pointer ${
                index === 4 ? 'mb-8' : ''
              }`}
              onClick={() => setExpandedTransaction(
                expandedTransaction === transaction.id ? null : transaction.id
              )}
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {getTransactionIcon(transaction.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">{transaction.description}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDate(transaction.createdAt)}
                        </span>
                        {transaction.category && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {transaction.category}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(transaction.status)}
                      <div className="text-right">
                        <p
                          className={`font-semibold text-lg ${
                            transaction.type === "deposit" || transaction.type === "referral_bonus"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.type === "deposit" || transaction.type === "referral_bonus" ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        {expandedTransaction === transaction.id ? (
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedTransaction === transaction.id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 mb-1">Transaction Type</p>
                      <p className="font-medium text-gray-900 capitalize">{transaction.type.replace("_", " ")}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Status</p>
                      <div className="flex items-center gap-1">
                        {getStatusBadge(transaction.status)}
                      </div>
                    </div>
                    {transaction.reference && (
                      <div>
                        <p className="text-gray-500 mb-1">Reference</p>
                        <p className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
                          {transaction.reference}
                        </p>
                      </div>
                    )}
                    {transaction.provider && (
                      <div>
                        <p className="text-gray-500 mb-1">Provider</p>
                        <p className="font-medium text-gray-900">{transaction.provider}</p>
                      </div>
                    )}
                    {transaction.recipient && (
                      <div className="sm:col-span-2">
                        <p className="text-gray-500 mb-1">Recipient</p>
                        <p className="font-medium text-gray-900">{transaction.recipient}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
