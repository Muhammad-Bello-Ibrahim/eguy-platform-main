export const dynamic = "force-dynamic";
export const revalidate = 0;
export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { fullName, phone, avatar, payoutAccount } = body;

  const user = await Database.findUserByEmail(session.user.email);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const updated = await Database.updateUserByEmail(session.user.email, {
    fullName,
    phone,
    avatar,
    payoutAccount,
  });

  if (!updated) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
  return NextResponse.json({ user: updated });
}
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { Database } from "@/lib/database";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await Database.findUserByEmail(session.user.email);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return NextResponse.json({ user });
}
