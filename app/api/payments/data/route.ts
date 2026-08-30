import { type NextRequest, NextResponse } from "next/server"
import { verifyTransactionPin } from "@/lib/server-auth"
import { getSession } from "@/lib/auth"
import { Database } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { network, phone, plan, amount, pin, transactionPin } = await request.json()

    // Verify transaction PIN
    const pinVerification = await verifyTransactionPin((session.user as any).id, pin || transactionPin)
    if (!pinVerification.isValid) {
      return NextResponse.json({ error: pinVerification.error }, { status: 400 })
    }

    if (!network || !phone || !plan || !amount) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Check user wallet balance
    const user = await Database.findUserById((session.user as any).id)
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

    // Secure logging - mask API key
    const maskedUrl = url.replace(apiKey, "HIDDEN_KEY");
    console.log("SubAndGain Data API URL:", maskedUrl);

    // Timeout configuration
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout

    let subaRes;
    try {
      subaRes = await fetch(url, { signal: controller.signal });
    } catch (error: any) {
      console.error("Fetch error:", error);
      if (error.name === 'AbortError' || error.cause?.code === 'UND_ERR_CONNECT_TIMEOUT') {
        return NextResponse.json({ error: "Payment service timeout. Please try again." }, { status: 504 });
      }
      return NextResponse.json({ error: "Payment service connection failed" }, { status: 502 });
    } finally {
      clearTimeout(timeoutId);
    }

    let subaData;
    try {
      subaData = await subaRes.json();
    } catch (e) {
      const text = await subaRes.text();
      console.error("SubAndGain API Response (Data - Raw):", text);
      return NextResponse.json({ error: "Invalid response from payment provider", raw: text }, { status: 502 });
    }

    console.log("SubAndGain API Response (Data):", subaData);
    if (!subaRes.ok || subaData.error) {
      const errorMessage = subaData.description || subaData.error || "Data purchase failed";
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
    // Deduct from wallet. Note: this happens after the data bundle was
    // already delivered by SubAndGain, so a failed deduction here (very
    // rare — only if balance changed between the check above and now)
    // can't be undone by rejecting the request; we log it clearly so it
    // surfaces in reconciliation instead of silently under-charging the user.
    const debit = await Database.updateUserWallet((session.user as any).id, -amount);
    if (!debit.success) {
      console.error("Data purchase delivered but wallet debit failed (insufficient balance at debit time):", { userId: (session.user as any).id, amount });
    }
    // Record transaction
    await Database.createTransaction({
      userId: (session.user as any).id,
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
