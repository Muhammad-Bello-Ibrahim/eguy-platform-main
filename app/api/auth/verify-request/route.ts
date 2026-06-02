import { NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"

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

    // If already verified, return alreadyVerified flag instead of sending email
    if (user.kycStatus === "verified") {
      return NextResponse.json({ alreadyVerified: true, message: "Email already verified" })
    }

    // Generate token
    const crypto = (await import("crypto")).default
    const token = crypto.randomBytes(32).toString("hex")
    const expires = Date.now() + 1000 * 60 * 60 // 1 hour
    await Database.saveVerificationToken(user.id, token, expires)

    const { sendVerificationEmail } = await import("@/lib/email")
    await sendVerificationEmail(email, token)

    return NextResponse.json({ message: "Verification link sent" })
  } catch (error) {
    console.error("verify-request error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
