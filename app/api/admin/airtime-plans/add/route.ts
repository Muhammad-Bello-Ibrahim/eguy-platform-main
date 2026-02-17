import { NextRequest, NextResponse } from "next/server";
import { AirtimePlan } from "@/lib/models/AirtimePlan";
import { Database } from "@/lib/database";
import { handleApiError, ValidationError, DatabaseError } from "@/lib/errors";

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
    return handleApiError(error as Error, {
      route: '/api/admin/airtime-plans/add',
    });
  }
}
