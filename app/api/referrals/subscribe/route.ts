import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { Database } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fixed activation fee
    const ACTIVATION_FEE = 1000;
    const packName = "ElevateX Activation";

    // Check user wallet balance
    const user = await Database.findUserById(session.user.id)
    if (!user || user.walletBalance < ACTIVATION_FEE) {
      return NextResponse.json({ error: "Insufficient wallet balance" }, { status: 400 })
    }

    // Deduct from wallet
    await Database.updateUserWallet(session.user.id, -ACTIVATION_FEE)

    // Create transaction record
    const reference = `ACT_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
    await Database.createTransaction({
      userId: session.user.id,
      type: "payment",
      amount: ACTIVATION_FEE,
      description: `ElevateX Activation`,
      status: "completed",
      reference,
      metadata: { type: 'activation' },
    })

    // Update user subscription status
    await Database.updateUserById(session.user.id, {
      elevatexActivated: true,
      monthActivated: new Date().getMonth() + 1 // Track activation month for renewals
    });

    return NextResponse.json({
      message: "Activation successful",
      reference,
    })
  } catch (error) {
    console.error("Activation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
