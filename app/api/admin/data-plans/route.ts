import { NextRequest, NextResponse } from "next/server";
import DataPlan from "@/lib/models/DataPlan";
import { Database } from "@/lib/database";

export const dynamic = "force-dynamic";
// GET: List all data plans
export async function GET() {
  await Database.getDb();
  const plans = await DataPlan.find({});
  return NextResponse.json(plans);
}

// POST: Add a new data plan
export async function POST(req: NextRequest) {
  await Database.getDb();
  const body = await req.json();
  const plan = await DataPlan.create(body);
  return NextResponse.json(plan, { status: 201 });
}
