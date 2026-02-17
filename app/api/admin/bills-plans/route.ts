import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/database";
import BillsPlan from "@/lib/models/BillsPlan";
import { handleApiError, ValidationError, DatabaseError } from "@/lib/errors";

export async function GET() {
  try {
    await Database.getDb();
    const plans = await BillsPlan.find({ isActive: true }).sort({ createdAt: -1 });
    return NextResponse.json(plans);
  } catch (error) {
    return handleApiError(error as Error, {
      route: '/api/admin/bills-plans',
    });
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
    return handleApiError(error as Error, {
      route: '/api/admin/bills-plans',
      method: 'POST',
    });
  }
}