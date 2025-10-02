import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { Database } from "@/lib/database";

export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { bank, accountNumber, accountName } = body;
  if (!bank || !accountNumber || !accountName) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const updated = await Database.updateUserPayoutAccount(session.user.email, { bank, accountNumber, accountName });
  if (!updated) {
    return NextResponse.json({ error: "Failed to update payout account" }, { status: 500 });
  }
  return NextResponse.json({ user: updated });
}
