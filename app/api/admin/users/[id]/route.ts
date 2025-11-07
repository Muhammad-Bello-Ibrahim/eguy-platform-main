import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { Database } from "@/lib/database"

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
    const updates = await request.json()

    // Validate required fields
    if (updates.fullName && (!updates.fullName.trim() || updates.fullName.length < 2)) {
      return NextResponse.json({ error: "Full name must be at least 2 characters" }, { status: 400 })
    }

    if (updates.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    if (updates.phone && (!updates.phone.trim() || updates.phone.length < 10)) {
      return NextResponse.json({ error: "Phone number must be at least 10 digits" }, { status: 400 })
    }

    // Update user in database
    const updatedUser = await Database.updateUserById(userId, updates)

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Log the update action
    console.log(`Admin ${session.user.email} updated user ${userId}`)

    return NextResponse.json({
      message: "User updated successfully",
      user: {
        id: updatedUser.id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phone: updatedUser.phone,
      }
    })
  } catch (error) {
    console.error("Admin user update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
