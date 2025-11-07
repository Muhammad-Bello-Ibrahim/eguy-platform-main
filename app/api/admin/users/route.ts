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
    const users = await Promise.all(
      dbUsers.map(async (user: any) => {
        // Get user's referrals and calculate stats
        const referrals = await Database.getUserReferrals(user.id)
        const transactions = await Database.getUserTransactions(user.id)

        // Calculate user statistics
        const totalReferrals = referrals.length
        const totalEarnings = referrals.reduce((sum, ref) => sum + (ref.bonusAmount || 0), 0)
        const referralLevel = Math.floor(totalReferrals / 5) + 1 // Simple level calculation
        const elevateXLevel = Math.floor(totalReferrals / 10) + 1 // Simple ElevateX level calculation

        const totalDeposits = transactions
          .filter(t => t.type === "deposit" && t.status === "completed")
          .reduce((sum, t) => sum + (t.amount || 0), 0)

        const totalWithdrawals = transactions
          .filter(t => t.type === "withdrawal" && t.status === "completed")
          .reduce((sum, t) => sum + (t.amount || 0), 0)

        const utilityPurchases = transactions
          .filter(t => t.type === "payment" && t.status === "completed")
          .length

        return {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          walletBalance: user.walletBalance || 0,
          status: user.status || "active",
          kycStatus: user.kycStatus || "pending",
          referralCode: user.referralCode,
          totalReferrals,
          totalEarnings,
          referralLevel,
          elevateXLevel,
          totalDeposits,
          totalWithdrawals,
          utilityPurchases,
          createdAt: user.createdAt.toISOString(),
          lastActive: user.updatedAt.toISOString(),
        }
      })
    )

    return NextResponse.json({ users, total: users.length })
  } catch (error) {
    console.error("Admin users error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
