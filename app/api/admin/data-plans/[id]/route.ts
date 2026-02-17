import { NextRequest, NextResponse } from "next/server";
import DataPlan from "@/lib/models/DataPlan";
import { Database } from "@/lib/database";
import { handleApiError, NotFoundError, DatabaseError } from "@/lib/errors";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await Database.connectMongoose();
    const body = await req.json();
    const plan = await DataPlan.findByIdAndUpdate(params.id, body, { new: true });

    if (!plan) {
      throw new NotFoundError("Data plan");
    }

    return NextResponse.json(plan);
  } catch (error) {
    return handleApiError(error as Error, {
      route: '/api/admin/data-plans/[id]',
      planId: params?.id,
    });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await Database.connectMongoose();
    const plan = await DataPlan.findByIdAndDelete(params.id);

    if (!plan) {
      throw new NotFoundError("Data plan");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error as Error, {
      route: '/api/admin/data-plans/[id]',
      planId: params?.id,
    });
  }
}
