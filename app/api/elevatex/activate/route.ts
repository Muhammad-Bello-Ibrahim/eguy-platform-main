import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { Database } from "@/lib/database";

function generateReferralCode(userId: string) {
  return "EX" + userId.slice(-6) + Math.floor(Math.random() * 1000);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await Database.findUserByEmail(session.user.email);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  if (user.walletBalance < 1000) {
    return NextResponse.json({ error: "Insufficient wallet balance" }, { status: 400 });
  }
  if (user.elevatexActivated) {
    return NextResponse.json({ error: "Already activated" }, { status: 400 });
  }

  // Generate referral code if not exists
  const referralCode = user.referralCode || generateReferralCode(user.id);

  // Deduct ₦1000 and activate Elevatex
  await Database.updateUserById(user.id, {
    walletBalance: user.walletBalance - 1000,
    elevatexActivated: true,
    referralCode: referralCode
  });

  // Record ElevateX activation transaction
  await Database.createTransaction({
    userId: user.id,
    type: "payment",
    amount: 1000,
    description: "ElevateX activation",
    status: "completed",
    metadata: { elevatexActivated: true }
  });

  // Check if referred by someone and create referral record if not exists
  if (user.referredBy) {
    const existingReferral = await Database.getReferral(user.referredBy, user.id);
    if (!existingReferral) {
      await Database.createReferral({
        referrerId: user.referredBy,
        referredId: user.id,
        level: 1,
        bonusAmount: 200,
        status: "active"
      });
    }
  }

  // Multi-level referral bonuses (levels 1-5)
  // Logic: traverse up the tree using referredBy
  let currentUser = user;
  let bonusLevels = [200, 150, 100, 50, 50]; // Corrected bonus amounts for levels 1-5

  for (let level = 1; level <= 5; level++) {
    if (!currentUser.referredBy) break;
    const referrer = await Database.findUserById(currentUser.referredBy);
    if (!referrer) break;

    // OPTIONAL: Check if referrer is also ElevateX activated? 
    // Usually only active members earn bonuses. Assuming all referredBy users are active for now or standard practice.

    const bonus = bonusLevels[level - 1];
    if (bonus > 0) {
      await Database.updateUserWallet(referrer.id, bonus);
      await Database.createTransaction({
        userId: referrer.id,
        type: "referral_bonus",
        amount: bonus,
        description: `${user.fullName} Activated ElevateX\nLevel ${level} Bonus`,
        status: "completed",
        metadata: {
          referredUserId: user.id,
          referredUserName: user.fullName,
          referredUserEmail: user.email,
          level,
        },
      });
    }

    currentUser = referrer;
  }

  return NextResponse.json({ success: true, referralCode });
}
