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

    // Get all transactions for the user
    const allTransactions = await Database.getUserTransactions(userId);

    // Filter ElevateX-related transactions:
    // 1. ElevateX activation transaction
    // 2. Referral bonuses received
    const elevatexTransactions = allTransactions.filter(tx => 
      (tx.type === "payment" && tx.description?.includes("ElevateX")) ||
      (tx.type === "referral_bonus")
    );

    // Sort by date (newest first)
    const sortedTransactions = elevatexTransactions.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ 
      transactions: sortedTransactions,
      count: sortedTransactions.length
    });
  } catch (error) {
    console.error("ElevateX transactions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
