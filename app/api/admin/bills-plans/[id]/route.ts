import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/database";
import BillsPlan from "@/lib/models/BillsPlan";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await Database.getDb();
    const body = await request.json();
    const { category, provider, planName, planCode, amount, price, apiPrice, isActive } = body;

    const updatedPlan = await BillsPlan.findByIdAndUpdate(
      params.id,
      {
        category,
        provider,
        planName,
        planCode,
        amount,
        price,
        apiPrice,
        isActive,
      },
      { new: true }
    );

    if (!updatedPlan) {
      return NextResponse.json({ error: "Bills plan not found" }, { status: 404 });
    }

    return NextResponse.json(updatedPlan);
  } catch (error) {
    console.error("Error updating bills plan:", error);
    return NextResponse.json({ error: "Failed to update bills plan" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await Database.getDb();
    const deletedPlan = await BillsPlan.findByIdAndDelete(params.id);

    if (!deletedPlan) {
      return NextResponse.json({ error: "Bills plan not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Bills plan deleted successfully" });
  } catch (error) {
    console.error("Error deleting bills plan:", error);
    return NextResponse.json({ error: "Failed to delete bills plan" }, { status: 500 });
  }
}