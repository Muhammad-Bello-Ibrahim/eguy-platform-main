export const dynamic = "force-dynamic";
export const revalidate = 0;

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

    // TODO: Implement actual database queries for subscriptions data
    const subscriptionsData = {
      totalSubscriptions: 1247,
      activeSubscriptions: 1089,
      expiredSubscriptions: 158,
      subscriptionGrowth: 12.5,
      revenue: {
        monthly: 45000,
        yearly: 540000,
        growth: 18.3
      },
      tiers: {
        basic: {
          count: 567,
          price: 1000,
          features: ["Basic Support", "5 Transactions/Day"]
        },
        premium: {
          count: 423,
          price: 2500,
          features: ["Priority Support", "Unlimited Transactions", "Advanced Analytics"]
        },
        enterprise: {
          count: 99,
          price: 5000,
          features: ["Dedicated Support", "Custom Integrations", "White-label Solution"]
        }
      },
      recentSubscriptions: [
        {
          id: "SUB001",
          userName: "Alice Johnson",
          userEmail: "alice@example.com",
          tier: "premium",
          amount: 2500,
          status: "active",
          startDate: "2024-01-15T00:00:00Z",
          endDate: "2024-02-15T00:00:00Z"
        },
        {
          id: "SUB002",
          userName: "Bob Smith",
          userEmail: "bob@example.com",
          tier: "basic",
          amount: 1000,
          status: "active",
          startDate: "2024-01-14T00:00:00Z",
          endDate: "2024-02-14T00:00:00Z"
        }
      ],
      monthlyTrends: [
        { month: "Jan", subscriptions: 145, revenue: 320000 },
        { month: "Feb", subscriptions: 167, revenue: 380000 },
        { month: "Mar", subscriptions: 189, revenue: 420000 },
        { month: "Apr", subscriptions: 156, revenue: 360000 },
        { month: "May", subscriptions: 203, revenue: 480000 }
      ]
    }

    return NextResponse.json(subscriptionsData)
  } catch (error) {
    console.error("Admin subscriptions error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
