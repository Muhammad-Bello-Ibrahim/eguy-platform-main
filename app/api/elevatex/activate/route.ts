import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { Database } from "@/lib/database"
import {
  handleApiError,
  AuthenticationError,
  NotFoundError,
  InsufficientBalanceError,
  ValidationError
} from "@/lib/errors"

function generateReferralCode(userId: string) {
  return "EX" + userId.slice(-6) + Math.floor(Math.random() * 1000)
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session?.user?.email) {
      throw new AuthenticationError()
    }

    const user = await Database.findUserByEmail(session.user.email)
    if (!user) throw new NotFoundError("User")

    if (user.walletBalance < 1000) {
      throw new InsufficientBalanceError(1000, user.walletBalance)
    }

    if (user.elevatexActivated) {
      throw new ValidationError("ElevateX already activated")
    }

    const referralCode = user.referralCode || generateReferralCode(user.id)

    // Activate user
    await Database.updateUserById(user.id, {
      walletBalance: user.walletBalance - 1000,
      elevatexActivated: true,
      referralCode
    })

    await Database.createTransaction({
      userId: user.id,
      type: "payment",
      amount: 1000,
      description: "ElevateX activation",
      status: "completed",
      metadata: { elevatexActivated: true }
    })

    // Create referral record ONLY now
    if (user.referredBy) {
      const existing = await Database.getReferral(user.referredBy, user.id)

      if (!existing) {
        await Database.createReferral({
          referrerId: user.referredBy,
          referredId: user.id,
          level: 1,
          bonusAmount: 200,
          status: "active"
        })
      }
    }

    // Multi-level bonus (only active members earn)
    let currentUser = user
    const bonuses = [200, 150, 100, 50, 50]

    for (let level = 1; level <= 5; level++) {
      if (!currentUser.referredBy) break

      const referrer = await Database.findUserById(currentUser.referredBy)
      if (!referrer || !referrer.elevatexActivated) break

      const bonus = bonuses[level - 1]

      await Database.updateUserWallet(referrer.id, bonus)

      await Database.createTransaction({
        userId: referrer.id,
        type: "referral_bonus",
        amount: bonus,
        description: `${user.fullName} activated ElevateX - Level ${level}`,
        status: "completed",
        metadata: {
          referredUserId: user.id,
          level
        }
      })

      currentUser = referrer
    }

    return NextResponse.json({ success: true, referralCode })

  } catch (error) {
    return handleApiError(error as Error, {
      route: "/api/elevatex/activate"
    })
  }
}
