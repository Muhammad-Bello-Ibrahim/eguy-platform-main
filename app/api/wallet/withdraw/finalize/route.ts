import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { Database } from "@/lib/database";

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const currentUser = session.user as any;

        const { otp, transferCode } = await request.json();
        console.log("Finalizing Transfer:", { transferCode, otpLength: otp?.length });

        if (!otp || !transferCode) {
            return NextResponse.json({ error: "OTP and Transfer Code required" }, { status: 400 });
        }

        const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
        if (!PAYSTACK_SECRET) {
            return NextResponse.json({ error: "Configuration error" }, { status: 500 });
        }

        // Finalize Transfer
        const res = await fetch("https://api.paystack.co/transfer/finalize_transfer", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${PAYSTACK_SECRET}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                transfer_code: transferCode,
                otp: otp
            })
        });

        const data = await res.json();
        console.log("Paystack Finalize Response:", data);

        if (!data.status) {
            // Failed
            const user = await Database.findUserById(currentUser.id);
            if (user) {
                const txs = await Database.getUserTransactions(user.id);
                const tx = txs.find((t: any) => t.metadata?.paystackTransfer?.transfer_code === transferCode);

                if (tx && tx.status === 'pending') {
                    // Refund
                    const refundAmount = tx.amount;
                    console.log(`Refunding user ${user.id} amount ${refundAmount}`);
                    const currentBalance = (user as any).walletBalance || 0;
                    await Database.updateUserById(user.id, { walletBalance: currentBalance + refundAmount });

                    // Update transaction status
                    // We need to update specific transaction. Database.updateTransactionStatusAtomic uses reference.
                    // The transaction creation didn't set `reference` field explicitly to paystack reference? 
                    // It used `reference` (optional in schema).
                    // Check createTransaction in database.ts: it saves `...data`.

                    // We should have saved reference!
                    // But we saved metadata.

                    // Implementation Note: We need a way to update this specific transaction.
                    // Using `updateTransactionStatusAtomic` searches by `reference` OR `metadata.reference`.
                    // Paystack transfer has a reference.

                    if (tx.metadata?.paystackTransfer?.reference) {
                        await Database.updateTransactionStatusAtomic(
                            tx.metadata.paystackTransfer.reference,
                            "pending",
                            "failed"
                        );
                    }
                }
            }

            return NextResponse.json({ error: data.message || "OTP Validation Failed" }, { status: 400 });
        }

        // Success
        console.log("Paystack verification successful, updating transaction...");
        const user = await Database.findUserById(currentUser.id);
        if (user) {
            const txs = await Database.getUserTransactions(user.id);
            const tx = txs.find((t: any) => t.metadata?.paystackTransfer?.transfer_code === transferCode);
            console.log("Found transaction:", tx ? tx.id : "Not found", "Status:", tx?.status);

            if (tx && tx.status === 'pending') {
                const ref = tx.metadata?.paystackTransfer?.reference;
                console.log("Updating transaction with reference:", ref);

                if (ref) {
                    const updateResult = await Database.updateTransactionStatusAtomic(
                        ref,
                        "pending",
                        "success"
                    );
                    console.log("Update result:", updateResult);
                }
            }
        }

        return NextResponse.json({ success: true, message: "Transfer verified successfully" });
    } catch (error: any) {
        console.error("Finalize error:", error);
        return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
    }
}
