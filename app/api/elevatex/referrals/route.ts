export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { Database } from "@/lib/database";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Get direct and indirect referrals for the user
    const directReferrals = await Database.getUserReferrals(session.user.id) || [];
    // For multi-level, recursively fetch referrals for each referred user
    async function getReferralTree(userId: string, level: number = 1): Promise<any[]> {
      const referrals = await Database.getUserReferrals(userId) || [];
      const tree = [];
      for (const ref of referrals) {
        const children = level < 5 ? await getReferralTree(ref.referredId, level + 1) : [];
        tree.push({ ...ref, children });
      }
      return tree;
    }
    const referralTree = await getReferralTree(session.user.id) || [];
    return NextResponse.json({ directReferrals, referralTree });
  } catch (error) {
    return NextResponse.json({ directReferrals: [], referralTree: [], error: error?.message || "Unknown error" }, { status: 200 });
  }
}
