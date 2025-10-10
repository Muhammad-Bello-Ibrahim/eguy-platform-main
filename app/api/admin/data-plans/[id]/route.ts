import { NextRequest, NextResponse } from "next/server";
import DataPlan from "@/lib/models/DataPlan";
import { Database } from "@/lib/database";
export const dynamic = "force-dynamic";
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await Database.getDb();
  const body = await req.json();
  const plan = await DataPlan.findByIdAndUpdate(params.id, body, { new: true });
  return NextResponse.json(plan);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await Database.getDb();
  await DataPlan.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
