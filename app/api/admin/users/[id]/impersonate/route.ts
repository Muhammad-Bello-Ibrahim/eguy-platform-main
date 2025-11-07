import { NextResponse } from "next/server"
import { getSession, createSession } from "@/lib/auth"
import { Database } from "@/lib/database"

export async function POST(
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

    // Get the user to impersonate
    const userToImpersonate = await Database.findUserById(userId)
    if (!userToImpersonate) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Create a session for the impersonated user
    await createSession({
      id: userToImpersonate.id,
      fullName: userToImpersonate.fullName,
      email: userToImpersonate.email,
      phone: userToImpersonate.phone,
      walletBalance: userToImpersonate.walletBalance,
      referralCode: userToImpersonate.referralCode,
      referredBy: userToImpersonate.referredBy,
      kycStatus: userToImpersonate.kycStatus,
      status: userToImpersonate.status,
      role: userToImpersonate.role,
    })

    // Log the impersonation action
    console.log(`Admin ${session.user.email} impersonated user ${userId} (${userToImpersonate.email})`)

    return NextResponse.json({
      message: "Impersonation successful",
      impersonatedUser: {
        id: userToImpersonate.id,
        fullName: userToImpersonate.fullName,
        email: userToImpersonate.email,
      }
    })
  } catch (error) {
    console.error("Admin impersonation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
