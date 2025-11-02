// app/api/admin/airtime-plans/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/database";
import { AirtimePlan } from "@/lib/models/airtimePlan";

export async function GET() {
  const db = await Database.getDb();
  const plans = await db.collection("airtime_plans").find().toArray();
  return NextResponse.json(plans);
}

export async function POST(req: NextRequest) {
  const db = await Database.getDb();
  const data: AirtimePlan = await req.json();
  const now = new Date();

  const result = await db.collection("airtime_plans").insertOne({
    ...data,
    createdAt: now,
    updatedAt: now,
  });

  const plan = await db.collection("airtime_plans").findOne({ _id: result.insertedId });
  return NextResponse.json(plan, { status: 201 });
}
