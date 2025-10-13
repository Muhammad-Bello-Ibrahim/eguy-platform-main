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

    // Check if plans already exist
    const existingPlans = await DataPlan.countDocuments();
    if (existingPlans > 0) {
      return NextResponse.json({ message: "Plans already exist", count: existingPlans });
    }

    // Realistic SubAndGain data plans for Nigerian networks
    const defaultPlans = [
      // MTN Daily Plans
      { network: 'MTN', dataBundle: '50MB', dataPlan: 'MTN_50MB_DAILY', duration: '1 Day', type: 'Daily', status: 'Active', price: 50, apiPrice: 45 },
      { network: 'MTN', dataBundle: '100MB', dataPlan: 'MTN_100MB_DAILY', duration: '1 Day', type: 'Daily', status: 'Active', price: 100, apiPrice: 90 },
      { network: 'MTN', dataBundle: '200MB', dataPlan: 'MTN_200MB_DAILY', duration: '1 Day', type: 'Daily', status: 'Active', price: 150, apiPrice: 135 },
      { network: 'MTN', dataBundle: '350MB', dataPlan: 'MTN_350MB_DAILY', duration: '1 Day', type: 'Daily', status: 'Active', price: 200, apiPrice: 180 },

      // MTN Weekly Plans
      { network: 'MTN', dataBundle: '500MB', dataPlan: 'MTN_500MB_WEEKLY', duration: '7 Days', type: 'Weekly', status: 'Active', price: 300, apiPrice: 270 },
      { network: 'MTN', dataBundle: '1GB', dataPlan: 'MTN_1GB_WEEKLY', duration: '7 Days', type: 'Weekly', status: 'Active', price: 500, apiPrice: 450 },
      { network: 'MTN', dataBundle: '2GB', dataPlan: 'MTN_2GB_WEEKLY', duration: '7 Days', type: 'Weekly', status: 'Active', price: 800, apiPrice: 720 },
      { network: 'MTN', dataBundle: '3GB', dataPlan: 'MTN_3GB_WEEKLY', duration: '7 Days', type: 'Weekly', status: 'Active', price: 1200, apiPrice: 1080 },

      // MTN Monthly Plans
      { network: 'MTN', dataBundle: '5GB', dataPlan: 'MTN_5GB_MONTHLY', duration: '30 Days', type: 'Monthly', status: 'Active', price: 1500, apiPrice: 1350 },
      { network: 'MTN', dataBundle: '10GB', dataPlan: 'MTN_10GB_MONTHLY', duration: '30 Days', type: 'Monthly', status: 'Active', price: 2500, apiPrice: 2250 },
      { network: 'MTN', dataBundle: '15GB', dataPlan: 'MTN_15GB_MONTHLY', duration: '30 Days', type: 'Monthly', status: 'Active', price: 3500, apiPrice: 3150 },
      { network: 'MTN', dataBundle: '25GB', dataPlan: 'MTN_25GB_MONTHLY', duration: '30 Days', type: 'Monthly', status: 'Active', price: 5000, apiPrice: 4500 },

      // Airtel Daily Plans
      { network: 'AIRTEL', dataBundle: '50MB', dataPlan: 'AIRTEL_50MB_DAILY', duration: '1 Day', type: 'Daily', status: 'Active', price: 50, apiPrice: 45 },
      { network: 'AIRTEL', dataBundle: '100MB', dataPlan: 'AIRTEL_100MB_DAILY', duration: '1 Day', type: 'Daily', status: 'Active', price: 100, apiPrice: 90 },
      { network: 'AIRTEL', dataBundle: '200MB', dataPlan: 'AIRTEL_200MB_DAILY', duration: '1 Day', type: 'Daily', status: 'Active', price: 150, apiPrice: 135 },

      // Airtel Weekly Plans
      { network: 'AIRTEL', dataBundle: '500MB', dataPlan: 'AIRTEL_500MB_WEEKLY', duration: '7 Days', type: 'Weekly', status: 'Active', price: 300, apiPrice: 270 },
      { network: 'AIRTEL', dataBundle: '1GB', dataPlan: 'AIRTEL_1GB_WEEKLY', duration: '7 Days', type: 'Weekly', status: 'Active', price: 500, apiPrice: 450 },
      { network: 'AIRTEL', dataBundle: '2GB', dataPlan: 'AIRTEL_2GB_WEEKLY', duration: '7 Days', type: 'Weekly', status: 'Active', price: 800, apiPrice: 720 },

      // Airtel Monthly Plans
      { network: 'AIRTEL', dataBundle: '5GB', dataPlan: 'AIRTEL_5GB_MONTHLY', duration: '30 Days', type: 'Monthly', status: 'Active', price: 1500, apiPrice: 1350 },
      { network: 'AIRTEL', dataBundle: '10GB', dataPlan: 'AIRTEL_10GB_MONTHLY', duration: '30 Days', type: 'Monthly', status: 'Active', price: 2500, apiPrice: 2250 },
      { network: 'AIRTEL', dataBundle: '15GB', dataPlan: 'AIRTEL_15GB_MONTHLY', duration: '30 Days', type: 'Monthly', status: 'Active', price: 3500, apiPrice: 3150 },

      // GLO Daily Plans
      { network: 'GLO', dataBundle: '50MB', dataPlan: 'GLO_50MB_DAILY', duration: '1 Day', type: 'Daily', status: 'Active', price: 50, apiPrice: 45 },
      { network: 'GLO', dataBundle: '100MB', dataPlan: 'GLO_100MB_DAILY', duration: '1 Day', type: 'Daily', status: 'Active', price: 100, apiPrice: 90 },
      { network: 'GLO', dataBundle: '200MB', dataPlan: 'GLO_200MB_DAILY', duration: '1 Day', type: 'Daily', status: 'Active', price: 150, apiPrice: 135 },

      // GLO Weekly Plans
      { network: 'GLO', dataBundle: '500MB', dataPlan: 'GLO_500MB_WEEKLY', duration: '7 Days', type: 'Weekly', status: 'Active', price: 300, apiPrice: 270 },
      { network: 'GLO', dataBundle: '1GB', dataPlan: 'GLO_1GB_WEEKLY', duration: '7 Days', type: 'Weekly', status: 'Active', price: 500, apiPrice: 450 },

      // GLO Monthly Plans
      { network: 'GLO', dataBundle: '5GB', dataPlan: 'GLO_5GB_MONTHLY', duration: '30 Days', type: 'Monthly', status: 'Active', price: 1500, apiPrice: 1350 },
      { network: 'GLO', dataBundle: '10GB', dataPlan: 'GLO_10GB_MONTHLY', duration: '30 Days', type: 'Monthly', status: 'Active', price: 2500, apiPrice: 2250 },

      // 9MOBILE Daily Plans
      { network: '9MOBILE', dataBundle: '50MB', dataPlan: '9MOBILE_50MB_DAILY', duration: '1 Day', type: 'Daily', status: 'Active', price: 50, apiPrice: 45 },
      { network: '9MOBILE', dataBundle: '100MB', dataPlan: '9MOBILE_100MB_DAILY', duration: '1 Day', type: 'Daily', status: 'Active', price: 100, apiPrice: 90 },

      // 9MOBILE Weekly Plans
      { network: '9MOBILE', dataBundle: '500MB', dataPlan: '9MOBILE_500MB_WEEKLY', duration: '7 Days', type: 'Weekly', status: 'Active', price: 300, apiPrice: 270 },
      { network: '9MOBILE', dataBundle: '1GB', dataPlan: '9MOBILE_1GB_WEEKLY', duration: '7 Days', type: 'Weekly', status: 'Active', price: 500, apiPrice: 450 },

      // 9MOBILE Monthly Plans
      { network: '9MOBILE', dataBundle: '5GB', dataPlan: '9MOBILE_5GB_MONTHLY', duration: '30 Days', type: 'Monthly', status: 'Active', price: 1500, apiPrice: 1350 },
      { network: '9MOBILE', dataBundle: '10GB', dataPlan: '9MOBILE_10GB_MONTHLY', duration: '30 Days', type: 'Monthly', status: 'Active', price: 2500, apiPrice: 2250 },
    ];

    const createdPlans = await DataPlan.insertMany(defaultPlans);
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
