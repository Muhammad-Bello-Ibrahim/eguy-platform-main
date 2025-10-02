import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { reference, userId } = await request.json()
    if (!reference || !userId) {
      return NextResponse.json({ error: "Missing reference or userId" }, { status: 400 })
    }

    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY
    if (!PAYSTACK_SECRET_KEY) {
      return NextResponse.json({ error: "Paystack secret key not configured" }, { status: 500 })
    }

    // Verify transaction with Paystack
    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    })
    const verifyData = await verifyRes.json()
    if (!verifyData.status || verifyData.data.status !== "success") {
      return NextResponse.json({ error: "Payment not successful" }, { status: 400 })
    }

    // Update transaction record to completed
    await Database.updateTransactionStatus(reference, "completed")
    // Credit user's wallet
    await Database.updateUserWallet(userId, verifyData.data.amount / 100)

    return NextResponse.json({ message: "Wallet credited successfully" })
  } catch (error) {
    console.error("Paystack verify error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
