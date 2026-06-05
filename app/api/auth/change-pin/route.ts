import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { Database } from "@/lib/database";
import { verifyTransactionPin, hashPassword } from "@/lib/server-auth";
import { withRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  return withRateLimit(request, { action: "auth:change-pin", maxHits: 5, windowMs: 15 * 60 * 1000 }, async () => {
    try {
      const session = await getSession();
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const { newPin } = await request.json();

      if (!newPin || newPin.length !== 4) {
        return NextResponse.json({ error: "New PIN must be exactly 4 digits" }, { status: 400 });
      }

      const user = await Database.findUserById((session.user as any).id);
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const hashedNewPin = await hashPassword(newPin);
      await Database.updateUserById(user.id, { transactionPin: hashedNewPin });

      return NextResponse.json({ message: "Transaction PIN updated successfully" });
    } catch (error: any) {
      console.error("Change PIN error:", error);
      return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
  });
}
