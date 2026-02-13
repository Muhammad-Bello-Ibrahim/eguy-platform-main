export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { Database } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user's transactions
    const transactions = await Database.getUserTransactions(userId);

    // Calculate analytics from actual transactions
    const completedTransactions = transactions.filter(t => t.status === "completed");
    
    const totalSpent = completedTransactions
      .filter(t => t.type === "payment" || t.type === "withdrawal")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalReceived = completedTransactions
      .filter(t => t.type === "deposit" || t.type === "referral_bonus")
      .reduce((sum, t) => sum + t.amount, 0);

    const transactionsCount = completedTransactions.length;
    const avgTransaction = transactionsCount > 0 ? totalSpent / transactionsCount : 0;

    // Calculate goal progress based on monthly deposits
    const monthlyGoal = 100000;
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyDeposits = completedTransactions
      .filter(t => {
        const txDate = new Date(t.createdAt);
        return t.type === "deposit" && 
               txDate.getMonth() === currentMonth && 
               txDate.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const goalProgress = Math.min((monthlyDeposits / monthlyGoal) * 100, 100);

    const analytics = {
      totalSpent: Math.round(totalSpent),
      totalReceived: Math.round(totalReceived),
      monthlyGoal,
      goalProgress: Math.round(goalProgress),
      transactionsCount,
      avgTransaction: Math.round(avgTransaction)
    };

    return NextResponse.json({ analytics });
  } catch (error) {
    console.error("Dashboard analytics error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
