import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { Database } from "@/lib/database";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { amount } = await request.json();
    if (!amount || amount < 100) {
      return NextResponse.json({ error: "Minimum withdrawal amount is ₦100" }, { status: 400 });
    }
    // Find user
    const user = await Database.findUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (!user.payoutAccount) {
      return NextResponse.json({ error: "No payout account found. Please add one in your profile." }, { status: 400 });
    }
    if (user.walletBalance < amount) {
      return NextResponse.json({ error: "Insufficient wallet balance" }, { status: 400 });
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
          bank_code: user.payoutAccount.bankCode || user.payoutAccount.bank, // Prefer bankCode
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
      await Database.updateUserById(user.id, {
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
    await Database.updateUserById(user.id, { walletBalance: newBalance });
    // Create transaction
    const paystackReference = transferData.data.reference;
    await Database.createTransaction({
      userId: user.id,
      type: "withdrawal",
      amount,
      description: `Withdrawal to ${user.payoutAccount.bankCode} ${user.payoutAccount.accountNumber}`,
      status: "pending", // Always pending initially
      reference: paystackReference, // Store Paystack reference at root level
      metadata: { payoutAccount: user.payoutAccount, paystackTransfer: transferData.data },
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    // Check if OTP is required
    if (transferData.data.status === 'otp') {
      return NextResponse.json({
        success: true,
        requiresOtp: true,
        transferCode: transferData.data.transfer_code,
        message: transferData.message
      });
    }

    return NextResponse.json({ success: true, transfer: transferData.data });
  } catch (error: any) {
    console.error("Withdrawal error:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}
