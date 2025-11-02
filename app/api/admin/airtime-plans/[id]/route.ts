// app/api/admin/airtime-plans/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/database";
import { ObjectId } from "mongodb";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const db = await Database.getDb();
  const data = await req.json();
  const now = new Date();

  await db.collection("airtime_plans").updateOne(
    { _id: new ObjectId(params.id) },
    { $set: { ...data, updatedAt: now } }
  );

  const updated = await db.collection("airtime_plans").findOne({ _id: new ObjectId(params.id) });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const db = await Database.getDb();
  await db.collection("airtime_plans").deleteOne({ _id: new ObjectId(params.id) });
  return NextResponse.json({ success: true });
}
