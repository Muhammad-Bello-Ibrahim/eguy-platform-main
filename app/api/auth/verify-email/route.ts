import { NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 400 })
    }

    // Get verification token
    const tokenDoc = await Database.getVerificationToken(token)

    if (!tokenDoc) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
    }

    // Check if token has expired
    if (tokenDoc.expiresAt < new Date()) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
    }

    // Update user KYC status to verified
    const updatedUser = await Database.updateUserById(tokenDoc.userId, {
      kycStatus: "verified"
    }) as any;

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Mark token as used (delete it)
    await Database.deleteVerificationToken(token)

    // Refresh session with updated user data
    const { createSession } = await import("@/lib/auth")
    await createSession({
      id: updatedUser.id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      phone: updatedUser.phone,
      walletBalance: updatedUser.walletBalance,
      referralCode: updatedUser.referralCode,
      referredBy: updatedUser.referredBy,
      kycStatus: updatedUser.kycStatus,
      status: updatedUser.status,
      role: updatedUser.role,
    })

    return NextResponse.json({ message: "Email verified successfully" })
  } catch (error) {
    console.error("Email verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
