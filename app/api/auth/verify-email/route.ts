import { NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  const { token } = await request.json()
  if (!token) {
    return NextResponse.json({ error: "Token required" }, { status: 400 })
  }
  const db = await Database.getDb()
  const tokenDoc = await db.collection("verification_tokens").findOne({ token, used: false })
  if (!tokenDoc || tokenDoc.expires < Date.now()) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
  }
  // Update user status
  await db.collection("users").updateOne(
    { _id: new ObjectId(tokenDoc.userId) },
    { $set: { kycStatus: "verified" } }
  )
  // Mark token as used
  await db.collection("verification_tokens").updateOne(
    { token },
    { $set: { used: true } }
  )
  // Fetch latest user data
  const user = await db.collection("users").findOne({ _id: new ObjectId(tokenDoc.userId) })
  // Refresh session with updated user data
  if (user) {
    const { createSession } = await import("@/lib/auth")
    await createSession({
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      walletBalance: user.walletBalance,
      referralCode: user.referralCode,
      referredBy: user.referredBy,
      kycStatus: user.kycStatus,
      status: user.status,
    })
  }
  return NextResponse.json({ message: "Email verified successfully" })
}
