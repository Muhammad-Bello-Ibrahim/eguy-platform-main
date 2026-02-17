import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { Database } from "@/lib/database"
import { handleApiError, AuthenticationError, ValidationError, InsufficientBalanceError, NotFoundError } from "@/lib/errors"

export async function POST(request: NextRequest) {
  let serviceType: string | undefined;
  let provider: string | undefined;
  let amount: number | undefined;
  let recipient: string | undefined;
  try {
    const session = await getSession()
    if (!session) {
      throw new AuthenticationError();
    }

    const { serviceType: serviceTypeValue, provider: providerValue, amount: amountValue, recipient: recipientValue, customerInfo } = await request.json()
    serviceType = serviceTypeValue;
    provider = providerValue;
    amount = amountValue;
    recipient = recipientValue;

    if (!serviceType || !provider || !amount || !recipient) {
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
    return handleApiError(error as Error, {
      route: '/api/payments/bills',
      serviceType,
      provider,
      amount,
    });
  }
}
