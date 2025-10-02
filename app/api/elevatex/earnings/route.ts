import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { Database } from "@/lib/database";

export async function GET() {
  const session = await getSession();
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await Database.findUserByEmail(session.user.email);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  // Sum referral_bonus transactions for all levels
  const transactions = await Database.getUserTransactions(user.id);
  const earnings = transactions
    .filter((tx: any) => tx.type === "referral_bonus" && tx.status === "completed")
    .reduce((sum: number, tx: any) => sum + (tx.amount || 0), 0);
  return NextResponse.json({ earnings });
}
