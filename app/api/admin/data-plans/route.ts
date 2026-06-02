import { NextRequest, NextResponse } from "next/server";

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

    if (Array.isArray(data)) {
      // Array format: [ { NETWORK: "MTN", BUNDLE: [...] }, ... ]
      data.forEach((netObj: any) => {
        const networkName = String(netObj.NETWORK || "").toUpperCase();
        if (Array.isArray(netObj.BUNDLE)) {
          netObj.BUNDLE.forEach((item: any) => {
            let rawPrice = "0";
            if (item.price) {
              const priceObj = Array.isArray(item.price) ? item.price[0] : item.price;
              if (typeof priceObj === 'object' && priceObj !== null) {
                rawPrice = priceObj.api_user || priceObj.free_user || priceObj.basic_user || Object.values(priceObj)[0] || "0";
              } else {
                rawPrice = String(priceObj);
              }
            }
            const apiPrice = parseFloat(rawPrice) || 0;
            const userPrice = apiPrice + 5; // Add N5 profit

            plans.push({
              _id: `sag_${item.dataPlan || item.id}`,
              network: networkName,
              dataBundle: item.dataBundle || item.plan || item.amount || "Unknown",
              dataPlan: item.dataPlan || item.id,
              type: item.type || "SME",
              price: userPrice,
              apiPrice: apiPrice,
              duration: item.duration || item.validity || "30 Days",
              status: item.status || "Active"
            });
          });
        }
      });
    } else if (data && typeof data === 'object') {
      // Object format: { MTN_PLAN: [...], GLO_PLAN: [...] }
      Object.keys(data).forEach(key => {
        const networkName = key.replace("_PLAN", "").replace("_", "").toUpperCase();
        if (Array.isArray(data[key])) {
          data[key].forEach((item: any) => {
            let rawPrice = "0";
            if (item.price) {
              const priceObj = Array.isArray(item.price) ? item.price[0] : item.price;
              if (typeof priceObj === 'object' && priceObj !== null) {
                rawPrice = priceObj.api_user || priceObj.free_user || priceObj.basic_user || Object.values(priceObj)[0] || "0";
              } else {
                rawPrice = String(item.price);
              }
            } else {
              rawPrice = String(item.price || "0");
            }
            const apiPrice = parseFloat(rawPrice) || 0;
            const userPrice = apiPrice + 5; // Add N5 profit

            plans.push({
              _id: `sag_${item.id || item.dataPlan}`,
              network: networkName,
              dataBundle: item.plan || item.amount || item.name || item.dataBundle || "Unknown",
              dataPlan: item.id || item.dataPlan,
              type: item.type || item.plan_type || "SME",
              price: userPrice,
              apiPrice: apiPrice,
              duration: item.validity || item.duration || "30 Days",
              status: item.status || "Active"
            });
          });
        }
      });
    }

    return NextResponse.json(plans);
  } catch (error) {
    console.error("Error fetching data plans:", error);
    return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 });
  }
}

// Existing POST and PUT methods can remain or be modified if needed, but GET is the critical one for the user
export async function POST(req: NextRequest) {
  return NextResponse.json({ error: "Method not allowed in dynamic mode" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed in dynamic mode" }, { status: 405 });
}
