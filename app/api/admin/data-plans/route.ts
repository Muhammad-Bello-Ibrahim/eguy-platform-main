import { NextRequest, NextResponse } from "next/server";
import DataPlan from "@/lib/models/DataPlan";
import { Database } from "@/lib/database";

export const dynamic = "force-dynamic";

// GET: List all data plans
export async function GET() {
  try {
    await Database.connectMongoose();
    const plans = await DataPlan.find({});
    return NextResponse.json(plans);
  } catch (error) {
    console.error("Error fetching data plans:", error);
    return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 });
  }
}

// POST: Add a new data plan
export async function POST(req: NextRequest) {
  try {
    await Database.connectMongoose();
    const body = await req.json();
    const plan = await DataPlan.create(body);
    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    console.error("Error creating data plan:", error);
    return NextResponse.json({ error: "Failed to create plan" }, { status: 500 });
  }
}

// PUT: Seed database with default data plans
export async function PUT() {
  try {
    await Database.connectMongoose();

    const { dataPlans } = await import("@/lib/seed-data");

    // Clear existing plans
    await DataPlan.deleteMany({});

    // transform apiPrice to number if it matches the string pattern from the user request, 
    // but here we already have it as number in seed-data.ts so we can use it directly.

    // We used the logic: Price = API Price + 5.
    // The seed data already has this logic applied.

    const createdPlans = await DataPlan.insertMany(dataPlans);

    return NextResponse.json({
      message: "Database seeded successfully",
      count: createdPlans.length,
      plans: createdPlans
    });
  } catch (error) {
    console.error("Error seeding data plans:", error);
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
  }
}
