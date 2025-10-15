import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { Database } from "@/lib/database"

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get real users from database
    const dbUsers = await Database.getAllUsers()

    // Transform database users to match frontend expectations
    const users = dbUsers.map((user) => ({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      walletBalance: user.walletBalance || 0,
      status: user.status || "active",
      kycStatus: user.kycStatus || "pending",
      referralCode: user.referralCode,
      totalReferrals: 0, // TODO: Calculate from referrals collection
      totalEarnings: 0, // TODO: Calculate from referral_bonus transactions
      createdAt: user.createdAt.toISOString(),
      lastActive: user.updatedAt.toISOString(),
    }))

    return NextResponse.json({ users, total: users.length })
  } catch (error) {
    console.error("Admin users error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
