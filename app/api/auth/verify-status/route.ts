import { NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"
import { createSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }
    const user = await Database.findUserByEmail(email)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const verified = user.kycStatus === "verified"

    // If verified, refresh the session cookie so middleware sees latest kycStatus
    if (verified) {
      await createSession({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        walletBalance: user.walletBalance,
        referralCode: user.referralCode,
        referredBy: user.referredBy,
        kycStatus: user.kycStatus,
        status: user.status,
        role: user.role,
      })
    }

    return NextResponse.json({
      verified,
      userId: user.id,
    })
  } catch (error) {
    console.error("verify-status error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
