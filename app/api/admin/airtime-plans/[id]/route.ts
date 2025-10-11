import { NextRequest, NextResponse } from "next/server";
import AirtimePlan from "@/lib/models/AirtimePlan";
import { Database } from "@/lib/database";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await Database.getDb();
  const body = await req.json();
  const plan = await AirtimePlan.findByIdAndUpdate(params.id, body, { new: true });
  return NextResponse.json(plan);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await Database.getDb();
  await AirtimePlan.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
