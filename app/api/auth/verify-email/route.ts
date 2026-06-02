import { NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    console.log("POST /api/auth/verify-email called");
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 400 })
    }

    // Get verification token
    const tokenDoc = await Database.getVerificationToken(token)

    if (!tokenDoc) {
      // Token not found — check if perhaps the user is already verified
      // (token was already used and deleted)
      console.log("Token not found — may already be verified");
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
    }

    // Fetch user first
    const existingUser = await Database.findUserById(tokenDoc.userId) as any
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // If user is already verified, just return gracefully
    if (existingUser.kycStatus === "verified") {
      // Clean up old token
      await Database.deleteVerificationToken(token).catch(() => {})

      // Refresh session with correct verified state
      const { createSession } = await import("@/lib/auth")
      await createSession({
        id: existingUser.id,
        fullName: existingUser.fullName,
        email: existingUser.email,
        phone: existingUser.phone,
        walletBalance: existingUser.walletBalance,
        referralCode: existingUser.referralCode,
        referredBy: existingUser.referredBy,
        kycStatus: existingUser.kycStatus,
        status: existingUser.status,
        role: existingUser.role,
      })

      return NextResponse.json({ alreadyVerified: true, message: "Email already verified" })
    }

    // Check if token has expired
    if (tokenDoc.expiresAt < new Date()) {
      console.log("Token expired");
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
    }

    // Mark user as verified
    console.log("Updating user", tokenDoc.userId, "with verified status");
    const updatedUser = await Database.updateUserById(tokenDoc.userId, {
      kycStatus: "verified"
    }) as any;

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Delete used token
    await Database.deleteVerificationToken(token)
    console.log("Token deleted — user verified");

    // Refresh session cookie with new verified kycStatus
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
