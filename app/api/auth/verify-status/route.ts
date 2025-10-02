import { NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"

export async function POST(request: NextRequest) {
  const { email } = await request.json()
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 })
  }
  const user = await Database.findUserByEmail(email)
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }
  // Check verification status
  return NextResponse.json({ verified: user.kycStatus === "verified" })
}
