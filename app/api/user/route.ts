import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { Database } from "@/lib/database";
import { profileUpdateSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  
  const validation = profileUpdateSchema.safeParse(body);
  if (!validation.success) {
    const errorMsg = validation.error.errors[0]?.message || "Invalid input data";
    return NextResponse.json({ error: errorMsg }, { status: 400 });
  }

  const { fullName, phone, avatar, payoutAccount, bio, twitter, linkedin, location } = validation.data;

  const user = await Database.findUserByEmail(session.user.email);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const updated = await Database.updateUserByEmail(session.user.email, {
    fullName,
    phone,
    avatar,
    payoutAccount,
    bio,
    twitter,
    linkedin,
    location
  });

  if (!updated) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
  return NextResponse.json({ user: updated });
}

export async function GET(request: NextRequest) {
  const session = await getSession();
  const userSession = session?.user as any;
  if (!session || !userSession?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await Database.findUserByEmail(userSession.email);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return NextResponse.json({ user });
}
