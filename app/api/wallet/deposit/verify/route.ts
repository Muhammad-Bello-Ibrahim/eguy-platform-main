import { type NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/database";

export async function POST(request: NextRequest) {
  try {
    const { reference, userId } = await request.json();
    if (!reference || !userId) {
      return NextResponse.json({ error: "Missing reference or userId" }, { status: 400 });
    }

    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
    if (!PAYSTACK_SECRET_KEY) {
      return NextResponse.json({ error: "Paystack secret key not configured" }, { status: 500 });
    }

    // Verify transaction with Paystack
    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!verifyRes.ok) {
      return NextResponse.json({ error: "Failed to verify transaction with Paystack" }, { status: 500 });
    }

    const verifyData = await verifyRes.json();
    if (!verifyData.status || verifyData.data.status !== "success") {
      return NextResponse.json({ error: "Payment not successful" }, { status: 400 });
    }

    // Check if transaction exists and belongs to user
    const tx = await Database.findTransactionByReference(reference);

    if (!tx) {
      console.log("Deposit verification: Transaction not found");
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    if (tx.userId !== userId) {
      console.log("Deposit verification: Transaction does not belong to user");
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (tx.status === "completed") {
      console.log("Deposit verification: Transaction already completed, skipping credit.");
      // Return the current balance without crediting again
      const user = await Database.findUserById(userId);
      return NextResponse.json({ 
        message: "Already credited",
        amount: tx.amount,
        newBalance: user?.walletBalance 
      });
    }

    // Verify the amount matches
    const expectedAmount = tx.amount;
    const paystackAmount = verifyData.data.amount / 100; // Convert from kobo to naira

    if (Math.abs(expectedAmount - paystackAmount) > 0.01) { // Allow small floating point differences
      console.error(`Amount mismatch: expected ${expectedAmount}, got ${paystackAmount}`);
      return NextResponse.json({ error: "Amount verification failed" }, { status: 400 });
    }

    // Use atomic operation to prevent race conditions
    // First mark transaction as completed, then credit wallet only if status was pending
    const updateResult = await Database.updateTransactionStatusAtomic(reference, "pending", "completed");
    
    if (!updateResult) {
      console.log("Deposit verification: Transaction already processed by another request");
      const user = await Database.findUserById(userId);
      return NextResponse.json({ 
        message: "Already credited",
        amount: expectedAmount,
        newBalance: user?.walletBalance 
      });
    }

    // Credit user's wallet only if transaction status was successfully updated
    await Database.updateUserWallet(userId, expectedAmount);

    // Create success notification
    await Database.createNotification({
      userId,
      type: "transaction",
      title: "Deposit Successful",
      message: `₦${expectedAmount.toLocaleString()} has been added to your wallet`,
      amount: expectedAmount,
      status: "success",
      actionUrl: "/transactions"
    });

    return NextResponse.json({
      message: "Wallet credited successfully",
      amount: expectedAmount,
      newBalance: (await Database.findUserById(userId))?.walletBalance
    });
  } catch (error) {
    console.error("Paystack verify error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
