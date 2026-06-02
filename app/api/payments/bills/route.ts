import { type NextRequest, NextResponse } from "next/server"
import { getSession, verifyTransactionPin } from "@/lib/auth"
import { Database } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { serviceType, provider, amount, recipient, customerInfo, pin, transactionPin } = await request.json()

    // Verify transaction PIN
    const pinVerification = await verifyTransactionPin((session.user as any).id, pin || transactionPin)
    if (!pinVerification.isValid) {
      return NextResponse.json({ error: pinVerification.error }, { status: 400 })
    }

    if (!serviceType || !provider || !amount || !recipient) {
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

    // Integrate with SubAndGain API for bill payment (GET request, Cable TV example)
    const serviceUC = provider.toUpperCase();
    const url = `https://subandgain.com/api/bills.php?username=${username}&apiKey=${apiKey}&service=${serviceUC}&bills_code=${serviceType}&smartNumber=${recipient}`;
    console.log("SubAndGain Bills API URL:", url); // Debug log
    const subaRes = await fetch(url);
    let subaData;
    try {
      subaData = await subaRes.json();
    } catch (e) {
      const text = await subaRes.text();
      console.error("SubAndGain API Response (Bills):", text); // Debug log
      return NextResponse.json({ error: "Invalid response from SubAndGain", raw: text }, { status: 400 });
    }
    console.log("SubAndGain API Response (Bills):", subaData); // Debug log
    if (!subaRes.ok || subaData.error) {
      return NextResponse.json({ error: subaData.description || "Bill payment failed" }, { status: 400 });
    }
    // Deduct from wallet
    await Database.updateUserWallet(session.user.id, -amount);
    // Record transaction
    await Database.createTransaction({
      userId: session.user.id,
      type: "payment",
      amount: amount,
      description: `${provider} ${serviceType} payment`,
      status: subaData.status || "pending",
      reference: subaData.trans_id || null,
      metadata: { serviceType, provider, recipient, customerInfo, subaRes: subaData },
    });
    return NextResponse.json({
      message: "Bill payment successful",
      reference: subaData.trans_id,
      amount,
      serviceType,
      provider,
      recipient,
      subaData,
    });
  } catch (error) {
    console.error("Bill payment error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
