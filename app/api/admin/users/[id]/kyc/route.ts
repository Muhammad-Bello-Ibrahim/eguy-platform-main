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

    const { kycStatus } = await request.json()
    const userId = params.id

    if (!kycStatus || !["pending", "verified", "rejected"].includes(kycStatus)) {
      return NextResponse.json({ error: "Invalid KYC status" }, { status: 400 })
    }

    // Update KYC status in database
    const updatedUser = await Database.updateUserById(userId, {
      kycStatus: kycStatus as "pending" | "verified" | "rejected"
    })

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "KYC status updated successfully",
      user: updatedUser
    })
  } catch (error) {
    console.error("Error updating KYC status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
