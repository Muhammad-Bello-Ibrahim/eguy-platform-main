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

    const { provider, meterNumber, amount, customerInfo } = await request.json()

    if (!provider || !meterNumber || !amount) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (amount < 100) {
      return NextResponse.json({ error: "Minimum water bill payment is ₦100" }, { status: 400 })
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

    // Integrate with SubAndGain API for water payment (GET request)
    const url = `https://subandgain.com/api/water.php?username=${username}&apiKey=${apiKey}&provider=${provider}&meterNumber=${meterNumber}&amount=${amount}`;
    console.log("SubAndGain Water API URL:", url); // Debug log
    const subaRes = await fetch(url);
    let subaData;
    try {
      subaData = await subaRes.json();
    } catch (e) {
      const text = await subaRes.text();
      console.error("SubAndGain API Response (Water):", text); // Debug log
      return NextResponse.json({ error: "Invalid response from SubAndGain", raw: text }, { status: 400 });
    }
    console.log("SubAndGain API Response (Water):", subaData); // Debug log
    if (!subaRes.ok || subaData.error) {
      return NextResponse.json({ error: subaData.description || "Water payment failed" }, { status: 400 });
    }

    // Deduct from wallet
    await Database.updateUserWallet(session.user.id, -amount);

    // Record transaction
    await Database.createTransaction({
      userId: session.user.id,
      type: "payment",
      amount: amount,
      description: `${provider} water bill payment for meter ${meterNumber}`,
      status: subaData.status || "pending",
      reference: subaData.trans_id || null,
      metadata: { provider, meterNumber, customerInfo, service: "water", subaRes: subaData },
    });

    return NextResponse.json({
      message: "Water bill payment successful",
      reference: subaData.trans_id,
      amount,
      provider,
      meterNumber,
      subaData,
    });
  } catch (error) {
    console.error("Water payment error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
