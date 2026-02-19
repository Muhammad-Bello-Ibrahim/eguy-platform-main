import { NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    console.log("POST /api/auth/verify-email called");
    const { token } = await request.json()
    console.log("Token received:", token ? "yes" : "no");

    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 400 })
    }

    // Get verification token
    const tokenDoc = await Database.getVerificationToken(token)
    console.log("Token lookup result:", tokenDoc ? "found" : "not found");

    if (!tokenDoc) {
      console.log("Token not found in database");
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
    }

    // Check if token has expired
    if (tokenDoc.expiresAt < new Date()) {
      console.log("Token expired");
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
    }

    // Update user KYC status to verified
    console.log("Updating user", tokenDoc.userId, "with verified status");
    const updatedUser = await Database.updateUserById(tokenDoc.userId, {
      kycStatus: "verified"
    }) as any;

    if (!updatedUser) {
      console.log("User not found after update attempt");
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Mark token as used (delete it)
    await Database.deleteVerificationToken(token)
    console.log("Token deleted and session created");

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

    console.log("Email verification completed successfully");
    return NextResponse.json({ message: "Email verified successfully" })
  } catch (error) {
    console.error("Email verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
