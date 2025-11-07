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
    const { referrerCode } = await request.json()

    if (!referrerCode || referrerCode.trim().length === 0) {
      return NextResponse.json({ error: "Referrer code is required" }, { status: 400 })
    }

    // Find the new referrer by code
    const newReferrer = await Database.findUserByReferralCode(referrerCode.trim().toUpperCase())
    if (!newReferrer) {
      return NextResponse.json({ error: "Referrer not found" }, { status: 404 })
    }

    // Update the user's referrer
    const updatedUser = await Database.updateUserById(userId, { referredBy: newReferrer.id })

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Log the referrer change action
    console.log(`Admin ${session.user.email} changed referrer for user ${userId} to ${newReferrer.id}`)

    return NextResponse.json({
      message: "Referrer updated successfully",
      newReferrer: {
        id: newReferrer.id,
        fullName: newReferrer.fullName,
        referralCode: newReferrer.referralCode,
      }
    })
  } catch (error) {
    console.error("Admin referrer change error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
