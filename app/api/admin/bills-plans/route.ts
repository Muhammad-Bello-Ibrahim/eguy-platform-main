import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/database";
import BillsPlan from "@/lib/models/BillsPlan";

export async function GET() {
  try {
    await Database.getDb();
    const plans = await BillsPlan.find({ isActive: true }).sort({ createdAt: -1 });
    return NextResponse.json(plans);
  } catch (error) {
    console.error("Error fetching bills plans:", error);
    return NextResponse.json({ error: "Failed to fetch bills plans" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await Database.getDb();
    const body = await request.json();
    const { category, provider, planName, planCode, amount, price, apiPrice } = body;

    if (!category || !provider || !planName || !planCode || !amount || !price || !apiPrice) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const plan = new BillsPlan({
      category,
      provider,
      planName,
      planCode,
      amount,
      price,
      apiPrice,
    });

    await plan.save();
    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    console.error("Error creating bills plan:", error);
    return NextResponse.json({ error: "Failed to create bills plan" }, { status: 500 });
  }
}