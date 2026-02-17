import { NextRequest, NextResponse } from "next/server";
import { handleApiError, ExternalAPIError } from "@/lib/errors";

export const dynamic = "force-dynamic";

interface SubAndGainPlan {
  id: string; // The Plan ID (dataPlan)
  network: string; // e.g. "MTN"
  plan_type: string; // e.g. "SME"
  amount: string; // The data volume e.g. "1GB"
  price: string; // API Price
  validity: string; // e.g. "30 Days"
}

// GET: Fetch plans directly from SubAndGain and apply profit
export async function GET() {
  try {
    const res = await fetch("https://subandgain.com/api/databundles.php", {
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    if (!res.ok) {
      throw new Error("Failed to fetch from SubAndGain");
    }

    const data = await res.json();
    const plans: any[] = [];

    // The API returns an object where keys are likely network names or network_PLAN
    // Example keys: MTN_PLAN, GLO_PLAN, etc. or just MTN, GLO?
    // Based on common knowledge of this API (and similar VTU APIs), it's usually:
    // { "MTN_PLAN": [...], "GLO_PLAN": [...], ... }

    Object.keys(data).forEach(key => {
      const networkName = key.replace("_PLAN", "").replace("_", ""); // Extract network name

      if (Array.isArray(data[key])) {
        data[key].forEach((item: any) => {
          const apiPrice = parseFloat(item.price);
          const userPrice = apiPrice + 5; // Add N5 profit

          // Map to our frontend structure
          plans.push({
            _id: `sag_${item.id}`, // Unique ID
            network: networkName.toUpperCase(),
            dataBundle: item.plan || item.amount || item.name, // The volume e.g. 1GB
            dataPlan: item.id, // The ID to send to API
            type: item.type || "SME", // e.g. SME, GIfting
            price: userPrice,
            apiPrice: apiPrice,
            duration: item.validity || item.duration || "30 Days",
            status: "Active"
          });
        });
      }
    });

    return NextResponse.json(plans);
  } catch (error) {
    return handleApiError(error as Error, {
      route: '/api/admin/data-plans',
      service: 'SubAndGain',
    });
  }
}

// Existing POST and PUT methods can remain or be modified if needed, but GET is the critical one for the user
export async function POST(req: NextRequest) {
  return NextResponse.json({ error: "Method not allowed in dynamic mode" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed in dynamic mode" }, { status: 405 });
}
