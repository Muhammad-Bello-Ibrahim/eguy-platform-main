import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { Database } from "@/lib/database"
import { handleApiError, AuthenticationError, InsufficientBalanceError, NotFoundError } from "@/lib/errors"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      throw new AuthenticationError();
    }

    // Fixed activation fee
    const ACTIVATION_FEE = 1000;
    const packName = "ElevateX Activation";

    // Check user wallet balance
    const user = await Database.findUserById(session.user.id)
    if (!user) {
      throw new NotFoundError("User");
    }
    if (user.walletBalance < ACTIVATION_FEE) {
      throw new InsufficientBalanceError(ACTIVATION_FEE, user.walletBalance);
    }

    // Deduct from wallet
    await Database.updateUserWallet(session.user.id, -ACTIVATION_FEE)

    // Create transaction record
    const reference = `ACT_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
    await Database.createTransaction({
      userId: session.user.id,
      type: "payment",
      amount: ACTIVATION_FEE,
      description: `ElevateX Activation`,
      status: "completed",
      reference,
      metadata: { type: 'activation' },
    })

    // Update user subscription status
    await Database.updateUserById(session.user.id, {
      elevatexActivated: true,
      monthActivated: new Date().getMonth() + 1 // Track activation month for renewals
    });

    return NextResponse.json({
      message: "Activation successful",
      reference,
    })
  } catch (error) {
    return handleApiError(error as Error, {
      route: '/api/referrals/subscribe',
      userId: (await getSession())?.user?.id,
    });
  }
}
