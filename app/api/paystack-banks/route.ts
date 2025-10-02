import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
  if (!PAYSTACK_SECRET_KEY) {
    return NextResponse.json({ error: "Paystack secret key not set" }, { status: 500 });
  }
  const res = await fetch("https://api.paystack.co/bank", {
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      Accept: "application/json"
    }
  });
  const data = await res.json();
  if (!data.status) {
    return NextResponse.json({ error: "Failed to fetch banks" }, { status: 500 });
  }
  // Return only banks with NGN currency
  const banks = data.data.filter((b: any) => b.currency === "NGN");
  return NextResponse.json({ banks });
}
