import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { Database } from "@/lib/database"
import bcrypt from "bcryptjs"

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const userId = params.id
    const { newPassword } = await request.json()

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // Update user password in database
    const updatedUser = await Database.updateUserById(userId, { passwordHash: hashedPassword })

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Log the password reset action
    console.log(`Admin ${session.user.email} reset password for user ${userId}`)

    return NextResponse.json({ message: "Password reset successfully" })
  } catch (error) {
    console.error("Admin password reset error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
