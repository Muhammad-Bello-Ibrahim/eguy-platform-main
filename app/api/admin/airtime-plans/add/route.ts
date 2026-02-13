import { NextRequest, NextResponse } from "next/server";
import {} from "@/lib/models/AirtimePlan";
import { Database } from "@/libAirtimePlan/database";

export const dynamic = "force-dynamic";

// POST: Add a new airtime plan
export async function POST(req: NextRequest) {
  try {
    const { Database } = await import("@/lib/database");
    await Database.getDb();
    const body = await req.json();
    const plan = await AirtimePlan.create(body);
    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    console.error("Error creating airtime plan:", error);
    return NextResponse.json({ error: "Failed to create plan" }, { status: 500 });
  }
}
