import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { Database, Transaction } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const reference = searchParams.get("reference")
    const limit = parseInt(searchParams.get("limit") || "10")
    const offset = parseInt(searchParams.get("offset") || "0")

    if (reference) {
      // Get specific transaction status
      const transaction = await Database.findTransactionByReference(reference)
      if (!transaction) {
        return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
      }

      // Check if this is the user's transaction
      if (transaction.userId !== session.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      // For real-time status checking, you might want to integrate with payment provider APIs
      // For now, return the stored status
      const statusInfo = {
        reference: transaction.reference,
        status: transaction.status,
        amount: transaction.amount,
        description: transaction.description,
        createdAt: transaction.createdAt,
        completedAt: transaction.updatedAt,
        // Add real-time status checking logic here if needed
        providerStatus: transaction.metadata?.subaRes?.status || transaction.status,
        canRefund: transaction.status === "completed" && transaction.type === "payment",
        canDispute: transaction.status === "failed" || transaction.status === "cancelled"
      }

      return NextResponse.json({ transaction: statusInfo })
    } else {
      // Get recent payment transactions with status
      const transactions = await Database.getUserTransactions(session.user.id)
      const paymentTransactions = transactions.filter((t: Transaction) => t.type === "payment")

      const transactionsWithStatus = paymentTransactions.map((transaction: Transaction) => ({
        id: transaction.id,
        reference: transaction.reference,
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description,
        status: transaction.status,
        createdAt: transaction.createdAt,
        completedAt: transaction.updatedAt,
        providerStatus: transaction.metadata?.subaRes?.status || transaction.status,
        canRefund: transaction.status === "completed" && transaction.type === "payment",
        canDispute: transaction.status === "failed" || transaction.status === "cancelled"
      }))

      return NextResponse.json({
        transactions: transactionsWithStatus,
        total: transactionsWithStatus.length,
        hasMore: transactionsWithStatus.length === limit
      })
    }
  } catch (error) {
    console.error("Payment status check error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { reference, action } = body

    if (!reference || !action) {
      return NextResponse.json({ error: "Reference and action required" }, { status: 400 })
    }

    const transaction = await Database.findTransactionByReference(reference)
    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    // Check if this is the user's transaction
    if (transaction.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    switch (action) {
      case "refresh_status":
        // TODO: Implement real-time status check with payment provider
        // For now, return current status
        return NextResponse.json({
          message: "Status refreshed",
          status: transaction.status,
          lastChecked: new Date()
        })

      case "dispute":
        // TODO: Implement dispute creation
        return NextResponse.json({
          message: "Dispute raised successfully",
          disputeId: `DIS_${Date.now()}`,
          status: "pending_review"
        })

      case "refund_request":
        if (transaction.status !== "completed") {
          return NextResponse.json({ error: "Only completed transactions can be refunded" }, { status: 400 })
        }
        // TODO: Implement refund request
        return NextResponse.json({
          message: "Refund request submitted",
          refundId: `REF_${Date.now()}`,
          status: "pending"
        })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Payment action error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
