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
            // Failed - refund the user
            console.log("Paystack finalize failed, processing refund...");
            const paystackReference = data.data?.reference;
            const user = await Database.findUserById(currentUser.id);
            
            if (user && paystackReference) {
                // Find the transaction by reference
                const tx = await Database.findTransactionByReference(paystackReference);
                
                if (tx && tx.status === 'pending') {
                    // Refund wallet
                    const refundAmount = tx.amount;
                    console.log(`Refunding user ${user.id} amount ${refundAmount}`);
                    await Database.updateUserWallet(user.id, refundAmount);
                    
                    // Update transaction status to failed
                    await Database.updateTransactionStatusAtomic(
                        paystackReference,
                        "pending",
                        "failed"
                    );
                }
            }

            return NextResponse.json({ error: data.message || "OTP Validation Failed" }, { status: 400 });
        }

        // Success
        console.log("Paystack verification successful, updating transaction...");
        const paystackReference = data.data.reference;
        
        if (paystackReference) {
            const updateResult = await Database.updateTransactionStatusAtomic(
                paystackReference,
                "pending",
                "success"
            );
            console.log("Transaction status update result:", { reference: paystackReference, success: updateResult });
        }

        return NextResponse.json({ success: true, message: "Transfer verified successfully" });
    } catch (error: any) {
        console.error("Finalize error:", error);
        return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
    }
}
