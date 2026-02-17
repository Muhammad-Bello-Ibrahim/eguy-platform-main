// app/api/admin/airtime-plans/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/database";
import { AirtimePlan } from "@/lib/models/AirtimePlan";

export async function GET() {
  const db = await Database.getDb();
  const plans = await db.collection("airtime_plans").find().toArray();
  return NextResponse.json(plans);
}

export async function POST(req: NextRequest) {
  const db = await Database.getDb();
  const data: AirtimePlan = await req.json();
  const now = new Date();

  const result = await db.collection("airtime_plans").insertOne({
    ...data,
    createdAt: now,
    updatedAt: now,
  });

  const plan = await db.collection("airtime_plans").findOne({ _id: result.insertedId });
  return NextResponse.json(plan, { status: 201 });
}

export async function PUT() {
  try {
    const db = await Database.getDb();

    // Clear existing plans
    await db.collection("airtime_plans").deleteMany({});

    const { airtimeDenominations, airtimeDiscounts } = await import("@/lib/seed-data");
    const networks = Object.keys(airtimeDiscounts);
    const now = new Date();

    const plans = [];

    for (const network of networks) {
      const discount = airtimeDiscounts[network as keyof typeof airtimeDiscounts];

      for (const amount of airtimeDenominations) {
        // apiPrice (Cost) = amount - (amount * discount)
        const apiPrice = amount - (amount * discount);

        // price (Selling) = amount (Face value)
        const price = amount;

        plans.push({
          network,
          amount,
          price,
          apiPrice,
          createdAt: now,
          updatedAt: now,
        });
      }
    }

    if (plans.length > 0) {
      await db.collection("airtime_plans").insertMany(plans);
    }

    const createdPlans = await db.collection("airtime_plans").find().toArray();

    return NextResponse.json({
      message: "Airtime plans seeded successfully",
      count: plans.length,
      plans: createdPlans
    });
  } catch (error) {
    console.error("Error seeding airtime plans:", error);
    return NextResponse.json({ error: "Failed to seed airtime plans" }, { status: 500 });
  }
}
