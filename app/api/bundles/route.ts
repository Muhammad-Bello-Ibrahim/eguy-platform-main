import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://subandgain.com/api/databundles.php");
    const data = await res.json();

    // Add N5 profit to each plan
    // Structure Assumption:
    // {
    //   "MTN_PLAN": [...],
    //   "GLO_PLAN": [...],
    //   ...
    // }
    // Or
    // {
    //   "MTN": { "ALL": [...] }
    // }

    // Based on standard subandgain response, let's log and see or try to handle standard keys
    // Typically it's like:
    // {
    //  "MTN_PLAN": [{"id":..., "price": "250", ...}, ...],
    //  "GLO_PLAN": ...
    // }

    const updatedData: any = {};

    Object.keys(data).forEach(key => {
      if (Array.isArray(data[key])) {
        updatedData[key] = data[key].map((plan: any) => ({
          ...plan,
          price: (parseFloat(plan.price) + 5).toString()
        }));
      } else {
        updatedData[key] = data[key];
      }
    });

    return NextResponse.json(updatedData);
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch bundles" }, { status: 500 });
  }
}
