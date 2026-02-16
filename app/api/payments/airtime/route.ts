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

    const { network, phone, amount } = await request.json()

    if (!network || !phone || !amount) {
      throw new ValidationError("All fields are required");
    }

    if (amount < 50) {
      throw new ValidationError("Minimum airtime purchase is ₦50");
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

    // Integrate with SubAndGain API for airtime purchase (GET request)
    const networkUC = network.toUpperCase();
    const url = `https://subandgain.com/api/airtime.php?username=${username}&apiKey=${apiKey}&network=${networkUC}&phoneNumber=${phone}&amount=${amount}`;

    // Secure logging - mask API key
    const maskedUrl = url.replace(apiKey, "HIDDEN_KEY");
    console.log("SubAndGain Airtime API URL:", maskedUrl);

    // Timeout configuration
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout

    let subaRes;
    try {
      // Force IPv4 if IPv6 is causing issues
      subaRes = await fetch(url, {
        signal: controller.signal,
        // @ts-ignore - native fetch doesn't support 'dispatcher' directly but Next.js/undici might.
        // If this fails, we might need to import { Agent, fetch } from 'undici'
      });

    } catch (error: any) {
      console.error("Fetch error details:", error);
      if (error.name === 'AbortError' || error.cause?.code === 'UND_ERR_CONNECT_TIMEOUT') {
        return NextResponse.json({ error: "Payment service timeout (25s limit). Please check your internet connection or try again later." }, { status: 504 });
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
      console.error("SubAndGain API Response (Airtime - Raw):", text);
      return NextResponse.json({ error: "Invalid response from payment provider", raw: text }, { status: 502 });
    }

    console.log("SubAndGain API Response (Airtime):", subaData);
    if (!subaRes.ok || subaData.error) {
      // Check for specific error messages from provider
      const errorMessage = subaData.description || subaData.error || "Airtime purchase failed";
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
    // Deduct from wallet
    await Database.updateUserWallet((session.user as any).id, -amount);
    // Record transaction
    await Database.createTransaction({
      userId: (session.user as any).id,
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
    return handleApiError(error as Error, {
      route: '/api/payments/airtime',
      network,
      phone,
      amount,
    });
  }
}
