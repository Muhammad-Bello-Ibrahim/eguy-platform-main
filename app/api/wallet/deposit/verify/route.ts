import { type NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/database";

export async function POST(request: NextRequest) {
  try {
    const { reference, userId } = await request.json();
    console.log("Verify deposit request:", { reference, userId });
    
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
    console.log("Transaction lookup result:", { reference, tx });

    if (!tx) {
      console.log("Deposit verification: Transaction not found for reference:", reference);
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    // Convert userId to string for comparison
    const txUserId = typeof tx.userId === 'object' ? tx.userId.toString() : tx.userId;
    if (txUserId !== userId) {
      console.log("Deposit verification: Transaction does not belong to user", { txUserId, userId });
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (tx.status === "completed") {
      console.log("Deposit verification: Transaction already completed, skipping credit.");
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

    if (Math.abs(expectedAmount - paystackAmount) > 0.01) {
      console.error(`Amount mismatch: expected ${expectedAmount}, got ${paystackAmount}`);
      return NextResponse.json({ error: "Amount verification failed" }, { status: 400 });
    }

    // Use atomic operation to prevent race conditions
    const updateResult = await Database.updateTransactionStatusAtomic(reference, "pending", "completed");
    console.log("UPDATE RESULT:", { reference, updateResult });
    
    if (!updateResult) {
      console.log("Deposit verification: Transaction status update failed - checking if already credited");
      // First, verify the transaction status AGAIN to see current state
      const verifyTxState = await Database.findTransactionByReference(reference);
      console.log("Transaction state after update attempt:", { status: verifyTxState?.status });
      
      const user = await Database.findUserById(userId);
      return NextResponse.json({ 
        message: "Already credited",
        amount: expectedAmount,
        newBalance: user?.walletBalance 
      });
    }

    // Credit user's wallet
    console.log("Crediting wallet for user:", userId, "amount:", expectedAmount);
    const walletUpdateResult = await Database.updateUserWallet(userId, expectedAmount);
    console.log("Wallet update result:", walletUpdateResult);

    // Fetch updated user to confirm balance
    const updatedUser = await Database.findUserById(userId);
    console.log("Updated user balance after credit:", updatedUser?.walletBalance);

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
      newBalance: updatedUser?.walletBalance
    });
  } catch (error) {
    console.error("Paystack verify error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
