import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { Database } from "@/lib/database"

function generateReferralCode(userId: string) {
  return "EX" + userId.slice(-6) + Math.floor(Math.random() * 1000)
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session || !session.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const user = await Database.findUserByEmail(session.user.email)
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })
  if (user.walletBalance < 1000) return NextResponse.json({ error: "Insufficient wallet balance" }, { status: 400 })
  if (user.elevatexActivated) return NextResponse.json({ error: "Already activated" }, { status: 400 })

  // Generate referral code
  const referralCode = user.referralCode || generateReferralCode(user.id)

  // Determine placement
  let matrixParentId: string | undefined
  if (user.referredBy) {
    const referrer = await Database.findUserById(user.referredBy)
    if (referrer?.directReferralsCount! < 5 && !referrer.level5EarningsCompleted) {
      matrixParentId = referrer.id
    } else {
      const eligible = await Database.findEligibleMatrixParent()
      matrixParentId = eligible?.id
    }
  } else {
    const eligible = await Database.findEligibleMatrixParent()
    matrixParentId = eligible?.id
  }

  // Deduct activation fee and activate ElevateX
  await Database.updateUserById(user.id, {
    walletBalance: user.walletBalance - 1000,
    elevatexActivated: true,
    referralCode,
    matrixParentId,
    autoPlacedAt: new Date(),
  })

  // Record transaction
  await Database.createTransaction({
    userId: user.id,
    type: "payment",
    amount: 1000,
    description: "ElevateX activation",
    status: "completed",
  })

  // Update parent's direct count
  if (matrixParentId) await Database.incrementDirectCount(matrixParentId)

  // Multi-level bonuses and referral records
  let currentUser = user
  const bonusLevels = [200, 150, 100, 50, 50]

  for (let level = 1; level <= 5; level++) {
    const parentId = currentUser.matrixParentId
    if (!parentId) break

    const parent = await Database.findUserById(parentId)
    if (!parent || parent.level5EarningsCompleted) break

    const bonus = bonusLevels[level - 1]
    await Database.updateUserWallet(parent.id, bonus)
    
    // Create referral record for tracking multi-level referrals
    await Database.createReferral({
      referrerId: parent.id,
      referredId: user.id,
      level: level,
      bonusAmount: bonus,
      status: "active"
    })
    
    await Database.createTransaction({
      userId: parent.id,
      type: "referral_bonus",
      amount: bonus,
      description: `${user.fullName} Activated ElevateX - Level ${level}`,
      status: "completed",
      metadata: { referredUserId: user.id, level },
    })

    currentUser = parent
  }

  return NextResponse.json({ success: true, referralCode })
}
