import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { Database } from "@/lib/database"

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const referrals = await Database.getUserReferrals(session.user.id)

    // Build referral tree structure
    const tree = {
      user: {
        id: session.user.id,
        name: session.user.fullName,
        referralCode: session.user.referralCode,
      },
      levels: {
        level1: referrals
          .filter((r) => r.level === 1)
          .map((r) => ({
            id: r.referredId,
            bonusAmount: r.bonusAmount,
            status: r.status,
            createdAt: r.createdAt,
          })),
        level2: referrals
          .filter((r) => r.level === 2)
          .map((r) => ({
            id: r.referredId,
            bonusAmount: r.bonusAmount,
            status: r.status,
            createdAt: r.createdAt,
          })),
        level3: referrals
          .filter((r) => r.level === 3)
          .map((r) => ({
            id: r.referredId,
            bonusAmount: r.bonusAmount,
            status: r.status,
            createdAt: r.createdAt,
          })),
        level4: referrals
          .filter((r) => r.level === 4)
          .map((r) => ({
            id: r.referredId,
            bonusAmount: r.bonusAmount,
            status: r.status,
            createdAt: r.createdAt,
          })),
        level5: referrals
          .filter((r) => r.level === 5)
          .map((r) => ({
            id: r.referredId,
            bonusAmount: r.bonusAmount,
            status: r.status,
            createdAt: r.createdAt,
          })),
      },
      summary: {
        totalReferrals: referrals.length,
        totalEarnings: referrals.reduce((sum, r) => sum + r.bonusAmount, 0),
        activeReferrals: referrals.filter((r) => r.status === "active").length,
      },
    }

    return NextResponse.json(tree)
  } catch (error) {
    console.error("Referral tree error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
