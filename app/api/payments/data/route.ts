import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { Database } from "@/lib/database"
import { handleApiError, AuthenticationError, ValidationError, InsufficientBalanceError, NotFoundError } from "@/lib/errors"

export async function POST(request: NextRequest) {
  let network: string | undefined;
  let phone: string | undefined;
  let plan: string | undefined;
  let amount: number | undefined;
  try {
    const session = await getSession()
    if (!session) {
      throw new AuthenticationError();
    }

    const { network: networkValue, phone: phoneValue, plan: planValue, amount: amountValue } = await request.json()
    network = networkValue;
    phone = phoneValue;
    plan = planValue;
    amount = amountValue;

    if (!network || !phone || !plan || !amount) {
      throw new ValidationError("All fields are required");
    }

    const user = await Database.findUserById((session.user as any).id)
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
    // Deduct from wallet
    await Database.updateUserWallet((session.user as any).id, -amount);
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
    return handleApiError(error as Error, {
      route: '/api/payments/data',
      network,
      phone,
      plan,
      amount,
    });
  }
}
