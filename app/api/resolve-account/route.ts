import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
  if (!PAYSTACK_SECRET_KEY) {
    return NextResponse.json({ error: "Paystack secret key not set" }, { status: 500 });
  }
  const { account_number, bank_code } = await request.json();
  if (!account_number || !bank_code) {
    return NextResponse.json({ error: "Missing account number or bank code" }, { status: 400 });
  }
  const res = await fetch(`https://api.paystack.co/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`, {
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      Accept: "application/json"
    }
  });
  const data = await res.json();
  if (!data.status) {
    return NextResponse.json({ error: data.message || "Failed to resolve account" }, { status: 400 });
  }
  return NextResponse.json({ account_name: data.data.account_name });
}
