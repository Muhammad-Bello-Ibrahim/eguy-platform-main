import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { Database } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { packId } = await request.json()

    if (!packId) {
      return NextResponse.json({ error: "Pack ID is required" }, { status: 400 })
    }

    // Get pack details (in production, this would come from database)
    const packs = {
      "basic-pack": { name: "Basic Pack", price: 1000, benefits: { max_referrals: 5, level_1_bonus: 200 } },
    }

    const selectedPack = packs[packId as keyof typeof packs]
    if (!selectedPack) {
      return NextResponse.json({ error: "Invalid pack selected" }, { status: 400 })
    }

    // Check user wallet balance
    const user = await Database.findUserById(session.user.id)
    if (!user || user.walletBalance < selectedPack.price) {
      return NextResponse.json({ error: "Insufficient wallet balance" }, { status: 400 })
    }

    // Deduct from wallet
    await Database.updateUserWallet(session.user.id, -selectedPack.price)

    // Create transaction record
    const reference = `SUB_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
    await Database.createTransaction({
      userId: session.user.id,
      type: "payment",
      amount: selectedPack.price,
      description: `ElevateX ${selectedPack.name} subscription`,
      status: "completed",
      reference,
      metadata: { packId, packName: selectedPack.name },
    })

    // In production, create user subscription record
    // await Database.createUserSubscription(...)

    return NextResponse.json({
      message: "Subscription successful",
      pack: selectedPack,
      reference,
    })
  } catch (error) {
    console.error("Subscription error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
