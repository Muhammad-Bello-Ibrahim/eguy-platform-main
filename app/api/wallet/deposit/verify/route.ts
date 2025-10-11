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
      return NextResponse.json({ message: "Already credited" });
    }

    // Verify the amount matches
    const expectedAmount = tx.amount;
    const paystackAmount = verifyData.data.amount / 100; // Convert from kobo to naira

    if (Math.abs(expectedAmount - paystackAmount) > 0.01) { // Allow small floating point differences
      console.error(`Amount mismatch: expected ${expectedAmount}, got ${paystackAmount}`);
      return NextResponse.json({ error: "Amount verification failed" }, { status: 400 });
    }
    // Show wallet balance before deposit
    const userBefore = await Database.findUserById(userId);
    console.log("Wallet balance before deposit:", userBefore?.walletBalance);

    // Update transaction record to completed
    await Database.updateTransactionStatus(reference, "completed");

    // Credit user's wallet with the expected amount
    await Database.updateUserWallet(userId, expectedAmount);

    // Show wallet balance after deposit
    const userAfter = await Database.findUserById(userId);
    console.log("Wallet balance after deposit:", userAfter?.walletBalance);
    return NextResponse.json({ message: "Wallet credited successfully" });
  } catch (error) {
    console.error("Paystack verify error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
