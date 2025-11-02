import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { Database } from "@/lib/database"
import bcrypt from "bcryptjs"

export async function GET(
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

    // Get user details
    const user = await Database.findUserById(userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get user transactions
    const transactions = await Database.getUserTransactions(userId)

    // Get user referrals
    const referrals = await Database.getUserReferrals(userId)

    // Transform referrals to include user details
    const transformedReferrals = await Promise.all(
      referrals.map(async (referral) => {
        const referredUser = await Database.findUserById(referral.referredId)
        return {
          id: referral.id,
          referredUserName: referredUser?.fullName || "Unknown",
          referredUserEmail: referredUser?.email || "Unknown",
          status: referral.status,
          bonusAmount: referral.bonusAmount,
          level: referral.level,
          createdAt: referral.createdAt.toISOString(),
        }
      })
    )

    // Calculate user statistics
    const userStats = {
      totalReferrals: referrals.length,
      totalEarnings: referrals.reduce((sum, ref) => sum + (ref.bonusAmount || 0), 0),
      referralLevel: Math.floor(referrals.length / 5) + 1, // Simple level calculation
      elevateXLevel: Math.floor(referrals.length / 10) + 1, // Simple ElevateX level calculation
      totalDeposits: transactions
        .filter(t => t.type === "deposit" && t.status === "completed")
        .reduce((sum, t) => sum + (t.amount || 0), 0),
      totalWithdrawals: transactions
        .filter(t => t.type === "withdrawal" && t.status === "completed")
        .reduce((sum, t) => sum + (t.amount || 0), 0),
      utilityPurchases: transactions
        .filter(t => t.type === "payment" && t.status === "completed")
        .length,
    }

    return NextResponse.json({
      user: {
        ...user,
        totalReferrals: userStats.totalReferrals,
        totalEarnings: userStats.totalEarnings,
        referralLevel: userStats.referralLevel,
        elevateXLevel: userStats.elevateXLevel,
        totalDeposits: userStats.totalDeposits,
        totalWithdrawals: userStats.totalWithdrawals,
        utilityPurchases: userStats.utilityPurchases,
      },
      transactions: transactions.map(t => ({
        id: t.id,
        type: t.type,
        amount: t.amount,
        status: t.status,
        description: t.description,
        createdAt: t.createdAt.toISOString(),
      })),
      referrals: transformedReferrals,
    })
  } catch (error) {
    console.error("Admin user details error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
