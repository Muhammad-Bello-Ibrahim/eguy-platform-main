import { NextRequest, NextResponse } from "next/server";
import DataPlan from "@/lib/models/DataPlan";
import { Database } from "@/lib/database";
import { handleApiError, ValidationError, DatabaseError } from "@/lib/errors";

export const dynamic = "force-dynamic";

// POST: Add a new data plan
export async function POST(req: NextRequest) {
  try {
    const { Database } = await import("@/lib/database");
    await Database.getDb();
    const body = await req.json();
    const plan = await DataPlan.create(body);
    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    return handleApiError(error as Error, {
      route: '/api/admin/data-plans/add',
    });
  }
}
