import { NextRequest, NextResponse } from "next/server"
import { getSession, verifyPassword, hashPassword } from "@/lib/auth"
import { Database } from "@/lib/database"

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { oldPassword, newPassword } = await request.json()
  if (!oldPassword || !newPassword) {
    return NextResponse.json({ error: "Both old and new password required" }, { status: 400 })
  }
  const db = await Database.getDb()
  const user = await db.collection("users").findOne({ _id: session.user.id })
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }
  const valid = await verifyPassword(oldPassword, user.passwordHash)
  if (!valid) {
    return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
  }
  const passwordHash = await hashPassword(newPassword)
  await db.collection("users").updateOne(
    { _id: session.user.id },
    { $set: { passwordHash } }
  )
  return NextResponse.json({ message: "Password changed successfully" })
}
