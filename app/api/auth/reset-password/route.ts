import { NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"
import { hashPassword } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  const { token, password } = await request.json()
  if (!token || !password) {
    return NextResponse.json({ error: "Token and new password required" }, { status: 400 })
  }
  // Find token
  // Find token
  const tokenDoc = await Database.getPasswordResetToken(token)
  if (!tokenDoc || new Date(tokenDoc.expires).getTime() < Date.now()) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
  }
  // Update password
  const passwordHash = await hashPassword(password)
  const db = await Database.getDb()
  await db.collection("users").updateOne(
    { _id: new ObjectId(tokenDoc.userId) },
    { $set: { passwordHash } }
  )
  // Mark token as used
  await Database.markPasswordResetTokenAsUsed(token)
  return NextResponse.json({ message: "Password reset successful" })
}
