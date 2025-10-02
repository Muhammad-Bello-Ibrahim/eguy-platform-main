import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { Database } from "@/lib/database";

export async function GET() {
  const session = await getSession();
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Get all referral_bonus transactions for the user
  const transactions = await Database.getUserTransactions(session.user.id);
  const history = transactions
    .filter((tx: any) => tx.type === "referral_bonus" && tx.status === "completed")
    .map((tx: any) => ({
      amount: tx.amount,
      description: tx.description,
      date: tx.createdAt,
      time: new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      referredUserName: tx.metadata?.referredUserName || "Unknown",
      referredUserEmail: tx.metadata?.referredUserEmail || "Unknown",
      level: tx.metadata?.level || 1,
    }));
  return NextResponse.json({ history });
}
