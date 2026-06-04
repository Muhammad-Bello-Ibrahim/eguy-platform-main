import { type NextRequest, NextResponse } from "next/server";
import { verifyTransactionPin } from "@/lib/server-auth"
import { getSession } from "@/lib/auth";
import { Database } from "@/lib/database";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { amount, pin, transactionPin } = await request.json();

    // Verify transaction PIN
    const pinVerification = await verifyTransactionPin((session.user as any).id, pin || transactionPin)
    if (!pinVerification.isValid) {
      return NextResponse.json({ error: pinVerification.error }, { status: 400 })
    }
    if (!amount || amount < 100) {
      return NextResponse.json({ error: "Minimum withdrawal amount is ₦100" }, { status: 400 });
    }
    // Find user
    const user = await Database.findUserByEmail((session.user as any).email);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const payoutAccount = (user as any).linkedAccounts?.find((a: any) => a.isPrimary) || (user as any).linkedAccounts?.[0] || (user as any).payoutAccount;
    if (!payoutAccount) {
      return NextResponse.json({ error: "No payout account found. Please link one in your profile." }, { status: 400 });
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
    let recipientCode = payoutAccount.recipientCode;
    if (!recipientCode) {
      const recipientRes = await fetch("https://api.paystack.co/transferrecipient", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${PAYSTACK_SECRET}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type: "nuban",
          name: payoutAccount.accountName,
          account_number: payoutAccount.accountNumber,
          bank_code: payoutAccount.bankCode || payoutAccount.bank, // Prefer bankCode
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
      if (user.linkedAccounts && user.linkedAccounts.length > 0) {
        const updatedAccounts = user.linkedAccounts.map((acc: any) => {
          if (acc.id === payoutAccount.id) {
            return { ...acc, recipientCode };
          }
          return acc;
        });
        await Database.updateUserById(user.id, {
          linkedAccounts: updatedAccounts
        });
      } else {
        await Database.updateUserById(user.id, {
          payoutAccount: { ...payoutAccount, recipientCode }
        });
      }
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
      description: `Withdrawal to ${payoutAccount.bankCode || payoutAccount.bank} ${payoutAccount.accountNumber}`,
      status: "pending", // Always pending initially
      reference: paystackReference, // Store Paystack reference at root level
      metadata: { payoutAccount, paystackTransfer: transferData.data },
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
