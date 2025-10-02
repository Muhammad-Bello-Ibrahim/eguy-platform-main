import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Mock admin stats - in production, these would come from actual database queries
    const stats = {
      users: {
        total: 1247,
        active: 1089,
        suspended: 23,
        newThisMonth: 156,
        growth: 12.5,
      },
      financial: {
        totalDeposits: 2450000,
        totalWithdrawals: 1890000,
        pendingWithdrawals: 125000,
        netRevenue: 560000,
        monthlyRevenue: 89000,
        revenueGrowth: 8.3,
      },
      referrals: {
        totalReferrals: 3456,
        activeReferrals: 2890,
        totalBonusPaid: 890000,
        averageTreeSize: 2.8,
        topReferrer: "John Doe",
        referralGrowth: 15.2,
      },
      transactions: {
        totalTransactions: 8934,
        successfulTransactions: 8756,
        failedTransactions: 178,
        successRate: 98.0,
        averageTransactionValue: 2750,
      },
      services: {
        airtimeTransactions: 3456,
        dataTransactions: 2890,
        billPayments: 1234,
        subscriptions: 567,
        mostPopularService: "Airtime",
      },
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Admin stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
