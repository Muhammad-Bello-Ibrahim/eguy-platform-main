import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { Database } from "@/lib/database"
import { handleApiError, AuthenticationError, ValidationError, InsufficientBalanceError, NotFoundError } from "@/lib/errors"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { service, bills_code, regNumber, amount } = await request.json()

    if (!service || !bills_code || !regNumber || !amount) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Check user wallet balance
    const user = await Database.findUserById(session.user.id)
    if (!user || user.walletBalance < amount) {
      return NextResponse.json({ error: "Insufficient wallet balance" }, { status: 400 })
    }

    // Check SubAndGain API credentials
    const username = process.env.SUBANDGAIN_USER_NAME;
    const apiKey = process.env.SUBANDGAIN_API_KEY;

    if (!username || !apiKey) {
      console.error("SubAndGain credentials not configured");
      return NextResponse.json({ error: "Payment service not configured" }, { status: 500 });
    }

    // Integrate with SubAndGain API for education payment (GET request)
    const url = `https://subandgain.com/api/education.php?username=${username}&apiKey=${apiKey}&service=${service}&bills_code=${bills_code}&regNumber=${regNumber}&amount=${amount}`;
    console.log("SubAndGain Education API URL:", url); // Debug log
    const subaRes = await fetch(url);
    let subaData;
    try {
      subaData = await subaRes.json();
    } catch (e) {
      const text = await subaRes.text();
      console.error("SubAndGain API Response (Education):", text); // Debug log
      return NextResponse.json({ error: "Invalid response from SubAndGain", raw: text }, { status: 400 });
    }
    console.log("SubAndGain API Response (Education):", subaData); // Debug log
    if (!subaRes.ok || subaData.error) {
      return NextResponse.json({ error: subaData.description || "Education payment failed" }, { status: 400 });
    }
    // Deduct from wallet
    await Database.updateUserWallet(session.user.id, -amount);
    // Record transaction
    await Database.createTransaction({
      userId: session.user.id,
      type: "payment",
      amount: amount,
      description: `${service} education payment for reg ${regNumber}`,
      status: subaData.status || "pending",
      reference: subaData.trans_id || null,
      metadata: { service, bills_code, regNumber, subaRes: subaData },
    });
    return NextResponse.json({
      message: "Education payment successful",
      reference: subaData.trans_id,
      amount,
      service,
      bills_code,
      regNumber,
      subaData,
    });
  } catch (error) {
    console.error("Education payment error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

