import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { Database } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await Database.findUserByEmail(session.user.email)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "month" // "week", "month", "year"

    // TODO: Implement actual analytics calculation from database
    const mockAnalytics = {
      overview: {
        currentBalance: user.walletBalance || 25000,
        monthlySpending: 45000,
        monthlyIncome: 15000,
        savingsRate: 25,
        financialHealth: "good"
      },
      spending: {
        totalSpent: 45000,
        averageDaily: 1500,
        topCategories: [
          { category: "Airtime", amount: 15000, percentage: 33.3, color: "#3B82F6" },
          { category: "Data", amount: 12000, percentage: 26.7, color: "#8B5CF6" },
          { category: "Electricity", amount: 10000, percentage: 22.2, color: "#F59E0B" },
          { category: "Cable TV", amount: 8000, percentage: 17.8, color: "#10B981" }
        ],
        trends: [
          { date: "2024-01-01", amount: 1200 },
          { date: "2024-01-02", amount: 800 },
          { date: "2024-01-03", amount: 1500 },
          { date: "2024-01-04", amount: 2000 },
          { date: "2024-01-05", amount: 1100 }
        ]
      },
      income: {
        totalEarned: 15000,
        referralEarnings: 8500,
        cashback: 2000,
        other: 4500,
        sources: [
          { source: "Referrals", amount: 8500, percentage: 56.7 },
          { source: "Cashback", amount: 2000, percentage: 13.3 },
          { source: "Other", amount: 4500, percentage: 30.0 }
        ]
      },
      goals: {
        monthlyTarget: 100000,
        currentProgress: 60000,
        percentage: 60,
        remaining: 40000,
        daysLeft: 15,
        dailyTarget: 2667
      },
      insights: [
        {
          type: "achievement",
          title: "Spending Goal Met",
          description: "You've stayed under your ₦50,000 monthly budget",
          icon: "🎯"
        },
        {
          type: "tip",
          title: "Referral Opportunity",
          description: "Refer 2 more friends to unlock Level 3 bonuses",
          icon: "💡"
        },
        {
          type: "warning",
          title: "Low Balance",
          description: "Your wallet balance is below ₦10,000",
          icon: "⚠️"
        }
      ],
      achievements: [
        { id: "first_deposit", title: "First Deposit", description: "Made your first wallet deposit", unlocked: true, unlockedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        { id: "referral_master", title: "Referral Master", description: "Referred 5+ friends", unlocked: true, unlockedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) },
        { id: "saver", title: "Smart Saver", description: "Maintained positive balance for 30 days", unlocked: false, progress: 25 },
        { id: "power_user", title: "Power User", description: "Completed 50+ transactions", unlocked: false, progress: 32 }
      ]
    }

    return NextResponse.json({ analytics: mockAnalytics })
  } catch (error) {
    console.error("Dashboard analytics fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { goal, target } = body

    if (!goal || !target) {
      return NextResponse.json({ error: "Goal and target required" }, { status: 400 })
    }

    const user = await Database.findUserByEmail(session.user.email)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // TODO: Implement goal setting in database
    return NextResponse.json({
      message: "Goal set successfully",
      goal: {
        id: `GOAL_${Date.now()}`,
        name: goal,
        target,
        current: 0,
        createdAt: new Date()
      }
    })
  } catch (error) {
    console.error("Goal setting error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
