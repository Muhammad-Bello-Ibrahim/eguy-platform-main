import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { Database } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { disco, meterType, meterNumber, amount } = await request.json()

    if (!disco || !meterType || !meterNumber || !amount) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Check user wallet balance
    const user = await Database.findUserById(session.user.id)
    if (!user || user.walletBalance < amount) {
      return NextResponse.json({ error: "Insufficient wallet balance" }, { status: 400 })
    }

    // Integrate with SubAndGain API for electricity payment (GET request)
    const username = process.env.username;
    const apiKey = process.env.SUBANDGAIN_API_KEY;
    const url = `https://subandgain.com/api/electricity.php?username=${username}&apiKey=${apiKey}&disco=${disco}&meterType=${meterType}&meterNumber=${meterNumber}&amount=${amount}`;
    const subaRes = await fetch(url);
    let subaData;
    try {
      subaData = await subaRes.json();
    } catch (e) {
      const text = await subaRes.text();
      return NextResponse.json({ error: "Invalid response from SubAndGain", raw: text }, { status: 400 });
    }
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

