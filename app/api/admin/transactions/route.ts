export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse, NextRequest } from "next/server"
import { getSession } from "@/lib/auth"
import { Database, Transaction } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get query parameters for filtering and pagination
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") // "all", "pending", "completed", "failed", "cancelled"
    const type = searchParams.get("type") // "all", "deposit", "withdrawal", "payment", "transfer", "referral_bonus"
    const userId = searchParams.get("userId") // Filter by specific user
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = parseInt(searchParams.get("offset") || "0")
    const search = searchParams.get("search") // Search term

    // Get all transactions with filtering and pagination
    const allTransactions = await Database.getAllTransactions()

    // Filter transactions based on query parameters
    let filteredTransactions: Transaction[] = allTransactions

    if (status && status !== "all") {
      filteredTransactions = filteredTransactions.filter((t: Transaction) => t.status === status)
    }

    if (type && type !== "all") {
      filteredTransactions = filteredTransactions.filter((t: Transaction) => t.type === type)
    }

    if (userId) {
      filteredTransactions = filteredTransactions.filter((t: Transaction) => t.userId === userId)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredTransactions = filteredTransactions.filter((t: Transaction) =>
        t.description.toLowerCase().includes(searchLower) ||
        (t.reference && t.reference.toLowerCase().includes(searchLower))
      )
    }

    // Sort by creation date (newest first) and apply pagination
    filteredTransactions.sort((a: Transaction, b: Transaction) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    const paginatedTransactions = filteredTransactions.slice(offset, offset + limit)

    // Get user details for each transaction
    const transactionsWithUsers = await Promise.all(
      paginatedTransactions.map(async (transaction: Transaction) => {
        try {
          const user = await Database.findUserById(transaction.userId)
          return {
            id: transaction.id,
            userId: transaction.userId,
            userName: user ? user.fullName : "Unknown User",
            userEmail: user ? user.email : "",
            type: transaction.type,
            amount: transaction.amount,
            description: transaction.description,
            status: transaction.status,
            reference: transaction.reference,
            createdAt: transaction.createdAt,
            metadata: transaction.metadata,
          }
        } catch (error) {
          console.error(`Error fetching user for transaction ${transaction.id}:`, error)
          return {
            id: transaction.id,
            userId: transaction.userId,
            userName: "Unknown User",
            userEmail: "",
            type: transaction.type,
            amount: transaction.amount,
            description: transaction.description,
            status: transaction.status,
            reference: transaction.reference,
            createdAt: transaction.createdAt,
            metadata: transaction.metadata,
          }
        }
      })
    )

    return NextResponse.json({
      transactions: transactionsWithUsers,
      total: filteredTransactions.length,
      hasMore: offset + limit < filteredTransactions.length,
      filters: {
        status: status || "all",
        type: type || "all",
        userId: userId || null,
        search: search || null,
      }
    })
  } catch (error) {
    console.error("Admin transactions error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { transactionId, action, reason } = body

    if (!transactionId || !action) {
      return NextResponse.json({ error: "Transaction ID and action required" }, { status: 400 })
    }

    const transaction = await Database.findTransactionByReference(transactionId) ||
      await Database.getAllTransactions().then(txs => txs.find(tx => tx.id === transactionId))

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    switch (action) {
      case "approve":
        if (transaction.status !== "pending") {
          return NextResponse.json({ error: "Only pending transactions can be approved" }, { status: 400 })
        }

        // Update wallet balance based on transaction type
        if (transaction.type === "deposit") {
          // For deposits, add money to user's wallet
          await Database.updateUserWallet(transaction.userId, transaction.amount)
        } else if (transaction.type === "withdrawal") {
          // For withdrawals, subtract money from user's wallet
          await Database.updateUserWallet(transaction.userId, -transaction.amount)
        }
        // Note: referral_bonus transactions don't affect wallet balance as they're already processed

        await Database.updateTransactionStatus(transaction.reference || transactionId, "completed")
        return NextResponse.json({
          message: "Transaction approved successfully",
          transaction: { ...transaction, status: "completed" }
        })

      case "reject":
        if (transaction.status !== "pending") {
          return NextResponse.json({ error: "Only pending transactions can be rejected" }, { status: 400 })
        }
        await Database.updateTransactionStatus(transaction.reference || transactionId, "failed")
        return NextResponse.json({
          message: "Transaction rejected successfully",
          transaction: { ...transaction, status: "failed" }
        })

      case "cancel":
        if (transaction.status !== "pending") {
          return NextResponse.json({ error: "Only pending transactions can be cancelled" }, { status: 400 })
        }
        await Database.updateTransactionStatus(transaction.reference || transactionId, "cancelled")
        return NextResponse.json({
          message: "Transaction cancelled successfully",
          transaction: { ...transaction, status: "cancelled" }
        })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Transaction action error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
