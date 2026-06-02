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

    const updatedData = Array.isArray(data) ? data.map((netObj: any) => {
      const updatedBundle = Array.isArray(netObj.BUNDLE) ? netObj.BUNDLE.map((plan: any) => {
        let rawPrice = "0";
        if (plan.price) {
          const priceObj = Array.isArray(plan.price) ? plan.price[0] : plan.price;
          if (typeof priceObj === 'object' && priceObj !== null) {
            rawPrice = priceObj.api_user || priceObj.free_user || priceObj.basic_user || Object.values(priceObj)[0] || "0";
          } else {
            rawPrice = String(plan.price);
          }
        }
        const apiPrice = parseFloat(rawPrice) || 0;
        const userPrice = apiPrice + 5;
        return {
          ...plan,
          price: userPrice.toString()
        };
      }) : [];
      return {
        ...netObj,
        BUNDLE: updatedBundle
      };
    }) : data;

    return NextResponse.json(updatedData);
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch bundles" }, { status: 500 });
  }
}
