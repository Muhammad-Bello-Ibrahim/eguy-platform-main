import { NextRequest, NextResponse } from "next/server";
import AirtimePlan from "@/lib/models/AirtimePlan";
import { Database } from "@/lib/database";

// GET: List all airtime plans
export async function GET() {
  await Database.getDb();
  const plans = await AirtimePlan.find({});
  return NextResponse.json(plans);
}

// POST: Add a new airtime plan
export async function POST(req: NextRequest) {
  await Database.getDb();
  const body = await req.json();
  const plan = await AirtimePlan.create(body);
  return NextResponse.json(plan, { status: 201 });
}
