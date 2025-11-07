import { NextRequest, NextResponse } from "next/server";
import DataPlan from "@/lib/models/DataPlan";
import { Database } from "@/lib/database";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await Database.connectMongoose();
    const body = await req.json();
    const plan = await DataPlan.findByIdAndUpdate(params.id, body, { new: true });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    return NextResponse.json(plan);
  } catch (error) {
    console.error("Error updating data plan:", error);
    return NextResponse.json({ error: "Failed to update plan" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await Database.connectMongoose();
    const plan = await DataPlan.findByIdAndDelete(params.id);

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting data plan:", error);
    return NextResponse.json({ error: "Failed to delete plan" }, { status: 500 });
  }
}
