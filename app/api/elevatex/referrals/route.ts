export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { Database } from "@/lib/database";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !(session.user as any)?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Get direct and indirect referrals for the user
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (session.user as any).id;
    const directReferrals = await Database.getUserReferrals(userId) || [];
    // For multi-level, recursively fetch referrals for each referred user
    async function getReferralTree(userId: string, level: number = 1): Promise<any[]> {
      const referrals = await Database.getUserReferrals(userId) || [];
      const tree = [];
      for (const ref of referrals) {
        const referredUser = await Database.findUserById(ref.referredId);
        const user = referredUser ? {
          fullName: referredUser.fullName,
          email: referredUser.email, // Optional: mask this?
          // avatar: referredUser.avatar // if available
        } : { fullName: "Unknown User" };

        const children = level < 5 ? await getReferralTree(ref.referredId, level + 1) : [];
        tree.push({ ...ref, user, children });
      }
      return tree;
    }
    const referralTree = await getReferralTree(userId) || [];
    return NextResponse.json({ directReferrals, referralTree });
  } catch (error) {
    return NextResponse.json({ directReferrals: [], referralTree: [], error: (error as any)?.message || "Unknown error" }, { status: 200 });
  }
}
