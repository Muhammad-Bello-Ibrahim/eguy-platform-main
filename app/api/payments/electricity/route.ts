import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { Database } from "@/lib/database"
import { handleApiError, AuthenticationError, ValidationError, InsufficientBalanceError, NotFoundError } from "@/lib/errors"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      throw new AuthenticationError();
    }

    const { disco, meterType, meterNumber, amount } = await request.json()

    if (!disco || !meterType || !meterNumber || !amount) {
      throw new ValidationError("All fields are required");
    }

    const user = await Database.findUserById(session.user.id)
    if (!user) {
      throw new NotFoundError("User");
    }
    if (user.walletBalance < amount) {
      throw new InsufficientBalanceError(amount, user.walletBalance);
    }

    // Check SubAndGain API credentials
    const username = process.env.SUBANDGAIN_USER_NAME;
    const apiKey = process.env.SUBANDGAIN_API_KEY;

    if (!username || !apiKey) {
      console.error("SubAndGain credentials not configured");
      return NextResponse.json({ error: "Payment service not configured" }, { status: 500 });
    }

    // Integrate with SubAndGain API for electricity payment (GET request)
    const url = `https://subandgain.com/api/electricity.php?username=${username}&apiKey=${apiKey}&disco=${disco}&meterType=${meterType}&meterNumber=${meterNumber}&amount=${amount}`;
    console.log("SubAndGain Electricity API URL:", url); // Debug log
    const subaRes = await fetch(url);
    let subaData;
    try {
      subaData = await subaRes.json();
    } catch (e) {
      const text = await subaRes.text();
      console.error("SubAndGain API Response (Electricity):", text); // Debug log
      return NextResponse.json({ error: "Invalid response from SubAndGain", raw: text }, { status: 400 });
    }
    console.log("SubAndGain API Response (Electricity):", subaData); // Debug log
    if (!subaRes.ok || subaData.error) {
      return NextResponse.json({ error: subaData.description || "Electricity payment failed" }, { status: 400 });
    }
    // Deduct from wallet
    await Database.updateUserWallet(session.user.id, -amount);
    // Record transaction
    await Database.createTransaction({
      userId: session.user.id,
      type: "payment",
      amount: amount,
      description: `${disco} electricity payment for meter ${meterNumber}`,
      status: subaData.status || "pending",
      reference: subaData.trans_id || null,
      metadata: { disco, meterType, meterNumber, subaRes: subaData },
    });
    return NextResponse.json({
      message: "Electricity payment successful",
      reference: subaData.trans_id,
      amount,
      disco,
      meterType,
      meterNumber,
      subaData,
    });
  } catch (error) {
    console.error("Electricity payment error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

