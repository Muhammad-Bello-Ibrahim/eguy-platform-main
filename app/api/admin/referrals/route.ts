export const dynamic = "force-dynamic"; // ensure no static optimization
export const revalidate = 0; // no ISR caching
// (optional) export const runtime = "nodejs"; // if you need Node APIs

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

    const referralsData = {
      totalReferrals: 3456,
      activeReferrals: 2890,
      totalBonusPaid: 890000,
      averageTreeSize: 2.8,
      topReferrer: "John Doe",
      referralGrowth: 15.2,
      levels: {
        level1: { count: 1247, bonus: 1000 },
        level2: { count: 892, bonus: 500 },
        level3: { count: 567, bonus: 250 },
        level4: { count: 234, bonus: 125 },
        level5: { count: 89, bonus: 75 }
      },
      recentReferrals: [
        {
          id: "REF001",
          referrerName: "Alice Johnson",
          referrerEmail: "alice@example.com",
          referredUser: "Bob Smith",
          referredEmail: "bob@example.com",
          level: 1,
          bonusAmount: 1000,
          status: "active",
          createdAt: "2024-01-15T10:30:00Z"
        },
        {
          id: "REF002",
          referrerName: "Charlie Brown",
          referrerEmail: "charlie@example.com",
          referredUser: "Diana Prince",
          referredEmail: "diana@example.com",
          level: 2,
          bonusAmount: 500,
          status: "active",
          createdAt: "2024-01-14T14:20:00Z"
        }
      ],
      monthlyTrends: [
        { month: "Jan", referrals: 234, bonuses: 45000 },
        { month: "Feb", referrals: 289, bonuses: 52000 },
        { month: "Mar", referrals: 345, bonuses: 67000 },
        { month: "Apr", referrals: 298, bonuses: 58000 },
        { month: "May", referrals: 367, bonuses: 72000 }
      ]
    }

    return NextResponse.json(referralsData)
  } catch (error) {
    console.error("Admin referrals error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
