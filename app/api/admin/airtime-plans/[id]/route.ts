// app/api/admin/airtime-plans/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/database";
import { ObjectId } from "mongodb";
import { handleApiError, NotFoundError, ValidationError } from "@/lib/errors";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await Database.getDb();
    const data = await req.json();
    const now = new Date();

    await db.collection("airtime_plans").updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { ...data, updatedAt: now } }
    );

    const updated = await db.collection("airtime_plans").findOne({ _id: new ObjectId(params.id) });
    if (!updated) {
      throw new NotFoundError("Airtime plan");
    }
    return NextResponse.json(updated);
  } catch (error) {
    return handleApiError(error as Error, {
      route: '/api/admin/airtime-plans/[id]',
      planId: params?.id,
    });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await Database.getDb();
    const result = await db.collection("airtime_plans").deleteOne({ _id: new ObjectId(params.id) });

    if (result.deletedCount === 0) {
      throw new NotFoundError("Airtime plan");
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error as Error, {
      route: '/api/admin/airtime-plans/[id]',
      planId: params?.id,
    });
  }
}
