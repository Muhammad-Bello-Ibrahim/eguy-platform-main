import { NextRequest, NextResponse } from "next/server";
import AirtimePlan from "@/lib/models/AirtimePlan";
import { Database } from "@/lib/database";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await Database.connectMongoose();
    const body = await req.json();
    const plan = await AirtimePlan.findByIdAndUpdate(params.id, body, { new: true });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    return NextResponse.json(plan);
  } catch (error) {
    console.error("Error updating airtime plan:", error);
    return NextResponse.json({ error: "Failed to update plan" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await Database.connectMongoose();
    const plan = await AirtimePlan.findByIdAndDelete(params.id);

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting airtime plan:", error);
    return NextResponse.json({ error: "Failed to delete plan" }, { status: 500 });
  }
}
