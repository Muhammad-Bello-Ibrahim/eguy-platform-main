import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { Database } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { network, phone, plan, amount } = await request.json()

    if (!network || !phone || !plan || !amount) {
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

    // Integrate with SubAndGain API for data purchase (GET request)
    const networkUC = network.toUpperCase();
    const url = `https://subandgain.com/api/data.php?username=${username}&apiKey=${apiKey}&network=${networkUC}&dataPlan=${plan}&phoneNumber=${phone}`;
    console.log("SubAndGain Data API URL:", url); // Debug log
    const subaRes = await fetch(url);
    let subaData;
    try {
      subaData = await subaRes.json();
    } catch (e) {
      const text = await subaRes.text();
      console.error("SubAndGain API Response (Data):", text); // Debug log
      return NextResponse.json({ error: "Invalid response from SubAndGain", raw: text }, { status: 400 });
    }
    console.log("SubAndGain API Response (Data):", subaData); // Debug log
    if (!subaRes.ok || subaData.error) {
      return NextResponse.json({ error: subaData.description || "Data purchase failed" }, { status: 400 });
    }
    // Deduct from wallet
    await Database.updateUserWallet(session.user.id, -amount);
    // Record transaction
    await Database.createTransaction({
      userId: session.user.id,
      type: "payment",
      amount: amount,
      description: `${network} data bundle for ${phone}`,
      status: subaData.status || "pending",
      reference: subaData.trans_id || null,
      metadata: { network, phone, plan, service: "data", subaRes: subaData },
    });
    return NextResponse.json({
      message: "Data purchase successful",
      reference: subaData.trans_id,
      amount,
      network,
      phone,
      plan,
      subaData,
    });
  } catch (error) {
    console.error("Data purchase error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
