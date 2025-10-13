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
    const transactionId = searchParams.get("transactionId")

    if (!transactionId) {
      return NextResponse.json({ error: "Transaction ID required" }, { status: 400 })
    }

    const user = await Database.findUserByEmail(session.user.email)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // TODO: Implement actual transaction lookup in database
    // For now, return mock receipt data
    const mockReceipt = {
      id: transactionId,
      type: "airtime_purchase",
      amount: 1500,
      fee: 0,
      total: 1500,
      description: "MTN Airtime Top-up - 08012345678",
      status: "completed",
      reference: "AIR20240115001",
      createdAt: new Date(),
      user: {
        name: user.fullName,
        email: user.email,
        phone: user.phone
      },
      service: {
        provider: "MTN",
        type: "Airtime",
        recipient: "08012345678",
        amount: 1500
      },
      payment: {
        method: "Wallet",
        from: "Wallet Balance"
      }
    }

    return NextResponse.json({ receipt: mockReceipt })
  } catch (error) {
    console.error("Receipt fetch error:", error)
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
    const { transactionId, format = "pdf" } = body

    if (!transactionId) {
      return NextResponse.json({ error: "Transaction ID required" }, { status: 400 })
    }

    // TODO: Implement actual receipt generation (PDF, email sending, etc.)
    // For now, return success message
    return NextResponse.json({
      message: "Receipt generated successfully",
      receiptId: `RCP_${Date.now()}`,
      downloadUrl: `/api/receipt/download?transactionId=${transactionId}&format=${format}`
    })
  } catch (error) {
    console.error("Receipt generation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
