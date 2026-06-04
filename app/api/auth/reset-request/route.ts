import { NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"
import { sendResetEmail } from "@/lib/email"
import crypto from "crypto"
import { withRateLimit } from "@/lib/rate-limit"

export async function POST(request: NextRequest) {
  return withRateLimit(request, { action: "auth:reset", maxHits: 5, windowMs: 15 * 60 * 1000 }, async () => {
  const { email } = await request.json()
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 })
  }
  const user = await Database.findUserByEmail(email)
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }
  // Generate token
  const token = crypto.randomBytes(32).toString("hex")
  const expires = Date.now() + 1000 * 60 * 30 // 30 min
  await Database.savePasswordResetToken(user.id, token, expires)
  await sendResetEmail(email, token)
  return NextResponse.json({ message: "Reset link sent" })
  });
}
