import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { Database } from "@/lib/database"

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      console.log("No session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const referrals = await Database.getUserReferrals(session.user.id);
    console.log("Fetched referrals:", referrals);

    const stats = {
      totalReferrals: referrals.length,
      activeReferrals: referrals.filter((r) => r.status === "active").length,
      totalEarnings: referrals.reduce((sum, r) => sum + (r.bonusAmount || 0), 0),
      referralsByLevel: {
        level1: referrals.filter((r) => r.level === 1).length,
        level2: referrals.filter((r) => r.level === 2).length,
        level3: referrals.filter((r) => r.level === 3).length,
        level4: referrals.filter((r) => r.level === 4).length,
        level5: referrals.filter((r) => r.level === 5).length,
      },
    };
    console.log("Referral stats computed:", stats);
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Referral stats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
