import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { Database } from "@/lib/database"

export async function PUT(
  request: NextRequest,
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

    const { status, reason } = await request.json()
    const userId = params.id

    if (!status || !["active", "suspended", "inactive"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    // Update user status in database
    const updatedUser = await Database.updateUserById(userId, {
      status: status as "active" | "suspended" | "inactive"
    })

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "User status updated successfully",
      user: updatedUser
    })
  } catch (error) {
    console.error("Error updating user status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
