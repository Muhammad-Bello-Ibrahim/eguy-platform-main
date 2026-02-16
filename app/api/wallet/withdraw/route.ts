import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { Database } from "@/lib/database"
import { handleApiError, AuthenticationError, NotFoundError, ValidationError, InsufficientBalanceError } from "@/lib/errors";

export async function POST(request: NextRequest) {
  let session; // Declare session outside try block
  let amount; // Declare amount outside try block
  try {
    session = await getSession();
    if (!session) {
      throw new AuthenticationError();
    }
    ({ amount } = await request.json());
    if (!amount || amount <= 0) {
      throw new ValidationError("Invalid withdrawal amount");
    }
    // Find user
    const user = await Database.findUserByEmail(session.user.email);
    if (!user) {
      throw new NotFoundError("User");
    }
    if (!user.payoutAccount) {
      return NextResponse.json({ error: "No payout account found. Please add one in your profile." }, { status: 400 });
    }
    if (user.walletBalance < amount) {
      throw new InsufficientBalanceError(amount, user.walletBalance);
    }
    // Paystack transfer automation
    const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
    if (!PAYSTACK_SECRET) {
      return NextResponse.json({ error: "Paystack secret key not configured" }, { status: 500 });
    }
    // Step 1: Create transfer recipient if not already created
    let recipientCode = user.payoutAccount.recipientCode;
    if (!recipientCode) {
      const recipientRes = await fetch("https://api.paystack.co/transferrecipient", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${PAYSTACK_SECRET}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type: "nuban",
          name: user.payoutAccount.accountName,
          account_number: user.payoutAccount.accountNumber,
          bank_code: user.payoutAccount.bank,
          currency: "NGN"
        })
      });
      const recipientData = await recipientRes.json();
      if (!recipientData.status) {
        console.error("Paystack recipient error:", recipientData);
        return NextResponse.json({ error: recipientData.message || "Failed to create transfer recipient" }, { status: 500 });
      }
      recipientCode = recipientData.data.recipient_code;
      // Save recipientCode to user profile
      await Database.updateUserByEmail(session.user.email, {
        payoutAccount: { ...user.payoutAccount, recipientCode }
      });
    }
    // Step 2: Initiate transfer
    const transferRes = await fetch("https://api.paystack.co/transfer", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PAYSTACK_SECRET}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        source: "balance",
        amount: Math.round(amount * 100), // Paystack expects kobo
        recipient: recipientCode,
        reason: `Withdrawal from eGuy wallet`
      })
    });
    const transferData = await transferRes.json();
    if (!transferData.status) {
      console.error("Paystack transfer error:", transferData);
      return NextResponse.json({ error: transferData.message || "Failed to initiate transfer" }, { status: 500 });
    }
    // Deduct from wallet
    const newBalance = user.walletBalance - amount;
    await Database.updateUserByEmail(session.user.email, { walletBalance: newBalance });
    // Create transaction
    await Database.createTransaction({
      userId: user.id,
      type: "withdrawal",
      amount,
      description: `Withdrawal to ${user.payoutAccount.bank} ${user.payoutAccount.accountNumber}`,
      status: "pending",
      metadata: { payoutAccount: user.payoutAccount, paystackTransfer: transferData.data },
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);
    return NextResponse.json({ success: true, transfer: transferData.data });
  } catch (error) {
    return handleApiError(error as Error, {
      route: '/api/wallet/withdraw',
      userId: session?.user?.id,
      amount,
    });
  }
}
