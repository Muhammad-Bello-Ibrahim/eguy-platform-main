import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { Database } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { network, phone, amount } = await request.json()

    if (!network || !phone || !amount) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (amount < 50) {
      return NextResponse.json({ error: "Minimum airtime purchase is ₦50" }, { status: 400 })
    }

    // Check user wallet balance
    const user = await Database.findUserById(session.user.id)
    if (!user || user.walletBalance < amount) {
      return NextResponse.json({ error: "Insufficient wallet balance" }, { status: 400 })
    }

    // Integrate with SubAndGain API for airtime purchase (GET request)
    const username = process.env.username;
    const apiKey = process.env.SUBANDGAIN_API_KEY;
    const networkUC = network.toUpperCase();
    const url = `https://subandgain.com/api/airtime.php?username=${username}&apiKey=${apiKey}&network=${networkUC}&phoneNumber=${phone}&amount=${amount}`;
    const subaRes = await fetch(url);
    let subaData;
    try {
      subaData = await subaRes.json();
    } catch (e) {
      const text = await subaRes.text();
      return NextResponse.json({ error: "Invalid response from SubAndGain", raw: text }, { status: 400 });
    }
    if (!subaRes.ok || subaData.error) {
      return NextResponse.json({ error: subaData.description || "Airtime purchase failed" }, { status: 400 });
    }
    // Deduct from wallet
    await Database.updateUserWallet(session.user.id, -amount);
    // Record transaction
    await Database.createTransaction({
      userId: session.user.id,
      type: "payment",
      amount: amount,
      description: `${network} airtime for ${phone}`,
      status: subaData.status || "pending",
      reference: subaData.trans_id || null,
      metadata: { network, phone, service: "airtime", subaRes: subaData },
    });
    return NextResponse.json({
      message: "Airtime purchase successful",
      reference: subaData.trans_id,
      amount,
      network,
      phone,
      subaData,
    });
  } catch (error) {
    console.error("Airtime purchase error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
