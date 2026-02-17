import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/database";
import BillsPlan from "@/lib/models/BillsPlan";
import { handleApiError, NotFoundError, ValidationError } from "@/lib/errors";

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
      throw new NotFoundError("Bills plan");
    }

    return NextResponse.json(updatedPlan);
  } catch (error) {
    return handleApiError(error as Error, {
      route: '/api/admin/bills-plans/[id]',
      planId: params?.id,
    });
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
      throw new NotFoundError("Bills plan");
    }

    return NextResponse.json({ message: "Bills plan deleted successfully" });
  } catch (error) {
    return handleApiError(error as Error, {
      route: '/api/admin/bills-plans/[id]',
      planId: params?.id,
    });
  }
}