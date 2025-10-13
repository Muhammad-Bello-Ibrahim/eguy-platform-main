import { NextRequest, NextResponse } from "next/server";
import AirtimePlan from "@/lib/models/AirtimePlan";
import { Database } from "@/lib/database";

export const dynamic = "force-dynamic";

// GET: List all airtime plans
export async function GET() {
  try {
    await Database.connectMongoose();
    const plans = await AirtimePlan.find({});
    return NextResponse.json(plans);
  } catch (error) {
    console.error("Error fetching airtime plans:", error);
    return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 });
  }
}

// POST: Add a new airtime plan
export async function POST(req: NextRequest) {
  try {
    await Database.connectMongoose();
    const body = await req.json();
    const plan = await AirtimePlan.create(body);
    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    console.error("Error creating airtime plan:", error);
    return NextResponse.json({ error: "Failed to create plan" }, { status: 500 });
  }
}

// PUT: Seed database with default airtime plans
export async function PUT() {
  try {
    await Database.connectMongoose();

    // Check if plans already exist
    const existingPlans = await AirtimePlan.countDocuments();
    if (existingPlans > 0) {
      return NextResponse.json({ message: "Plans already exist", count: existingPlans });
    }

    // Realistic SubAndGain airtime plans for Nigerian networks
    const defaultPlans = [
      // MTN Plans
      { network: 'MTN', amount: 50, price: 48, apiPrice: 45 },
      { network: 'MTN', amount: 100, price: 95, apiPrice: 90 },
      { network: 'MTN', amount: 200, price: 190, apiPrice: 180 },
      { network: 'MTN', amount: 500, price: 475, apiPrice: 450 },
      { network: 'MTN', amount: 1000, price: 950, apiPrice: 900 },
      { network: 'MTN', amount: 2000, price: 1900, apiPrice: 1800 },
      { network: 'MTN', amount: 5000, price: 4750, apiPrice: 4500 },

      // Airtel Plans
      { network: 'AIRTEL', amount: 50, price: 48, apiPrice: 45 },
      { network: 'AIRTEL', amount: 100, price: 95, apiPrice: 90 },
      { network: 'AIRTEL', amount: 200, price: 190, apiPrice: 180 },
      { network: 'AIRTEL', amount: 500, price: 475, apiPrice: 450 },
      { network: 'AIRTEL', amount: 1000, price: 950, apiPrice: 900 },
      { network: 'AIRTEL', amount: 2000, price: 1900, apiPrice: 1800 },
      { network: 'AIRTEL', amount: 5000, price: 4750, apiPrice: 4500 },

      // GLO Plans
      { network: 'GLO', amount: 50, price: 48, apiPrice: 45 },
      { network: 'GLO', amount: 100, price: 95, apiPrice: 90 },
      { network: 'GLO', amount: 200, price: 190, apiPrice: 180 },
      { network: 'GLO', amount: 500, price: 475, apiPrice: 450 },
      { network: 'GLO', amount: 1000, price: 950, apiPrice: 900 },
      { network: 'GLO', amount: 2000, price: 1900, apiPrice: 1800 },
      { network: 'GLO', amount: 5000, price: 4750, apiPrice: 4500 },

      // 9MOBILE Plans
      { network: '9MOBILE', amount: 50, price: 48, apiPrice: 45 },
      { network: '9MOBILE', amount: 100, price: 95, apiPrice: 90 },
      { network: '9MOBILE', amount: 200, price: 190, apiPrice: 180 },
      { network: '9MOBILE', amount: 500, price: 475, apiPrice: 450 },
      { network: '9MOBILE', amount: 1000, price: 950, apiPrice: 900 },
      { network: '9MOBILE', amount: 2000, price: 1900, apiPrice: 1800 },
      { network: '9MOBILE', amount: 5000, price: 4750, apiPrice: 4500 },
    ];

    const createdPlans = await AirtimePlan.insertMany(defaultPlans);
    return NextResponse.json({
      message: "Database seeded successfully",
      count: createdPlans.length,
      plans: createdPlans
    });
  } catch (error) {
    console.error("Error seeding airtime plans:", error);
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
  }
}
