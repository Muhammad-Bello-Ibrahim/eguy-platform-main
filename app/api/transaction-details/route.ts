import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { Database } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const transactionId = searchParams.get("id")

    if (!transactionId) {
      return NextResponse.json({ error: "Transaction ID required" }, { status: 400 })
    }

    const user = await Database.findUserByEmail(session.user.email)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // TODO: Implement actual transaction lookup in database
    // For now, return detailed mock transaction data
    const mockTransaction = {
      id: transactionId,
      type: "airtime_purchase",
      status: "completed",
      amount: 1500,
      fee: 0,
      total: 1500,
      description: "MTN Airtime Top-up - 08012345678",
      reference: "AIR20240115001",
      externalReference: "MTN_20240115001",
      createdAt: new Date(),
      completedAt: new Date(),
      user: {
        id: user.id,
        name: user.fullName,
        email: user.email,
        phone: user.phone
      },
      service: {
        provider: "MTN Nigeria",
        type: "Airtime",
        category: "Telecommunications",
        recipient: "08012345678",
        recipientName: "Self",
        amount: 1500,
        previousBalance: 25000,
        newBalance: 23500
      },
      payment: {
        method: "Wallet",
        walletBalance: 23500,
        transactionFee: 0
      },
      metadata: {
        network: "MTN",
        plan: "Standard",
        validity: "30 days",
        bundleSize: "₦1,500"
      },
      timeline: [
        {
          status: "initiated",
          timestamp: new Date(),
          description: "Transaction initiated"
        },
        {
          status: "processing",
          timestamp: new Date(Date.now() + 1 * 60 * 1000),
          description: "Payment processed from wallet"
        },
        {
          status: "completed",
          timestamp: new Date(Date.now() + 2 * 60 * 1000),
          description: "Airtime delivered successfully"
        }
      ],
      receipt: {
        downloadUrl: `/api/receipt/download?transactionId=${transactionId}`,
        emailSent: false,
        canResend: true
      }
    }

    return NextResponse.json({ transaction: mockTransaction })
  } catch (error) {
    console.error("Transaction details fetch error:", error)
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
    const { transactionId, action } = body

    if (!transactionId || !action) {
      return NextResponse.json({ error: "Transaction ID and action required" }, { status: 400 })
    }

    const user = await Database.findUserByEmail(session.user.email)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Handle different actions
    switch (action) {
      case "resend_receipt":
        // TODO: Implement receipt resending
        return NextResponse.json({
          message: "Receipt sent to your email",
          email: user.email
        })

      case "dispute":
        // TODO: Implement transaction dispute
        return NextResponse.json({
          message: "Dispute raised successfully",
          disputeId: `DIS_${Date.now()}`,
          status: "pending"
        })

      case "download_receipt":
        return NextResponse.json({
          downloadUrl: `/api/receipt/download?transactionId=${transactionId}&format=pdf`,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Transaction action error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
