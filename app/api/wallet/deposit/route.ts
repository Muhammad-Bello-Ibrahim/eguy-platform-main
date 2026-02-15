import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { Database } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = session.user as any;

    const { amount } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    // Integrate with Paystack
    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY
    if (!PAYSTACK_SECRET_KEY) {
      return NextResponse.json({ error: "Paystack secret key not configured" }, { status: 500 })
    }

    const reference = `DEP_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
    const email = user.email

    // Build callback URL dynamically based on the request origin
    // This allows it to work on localhost, network IPs, and production automatically
    const baseUrl = request.nextUrl.origin;
    const callbackUrl = `${baseUrl}/dashboard`

    // Initialize Paystack transaction
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: Number(amount) * 100, // Paystack expects amount in kobo
        reference,
        callback_url: callbackUrl
      }),
    })

    const paystackData = await response.json()
    if (!paystackData.status) {
      return NextResponse.json({ error: paystackData.message || "Paystack initialization failed" }, { status: 500 })
    }

    // Optionally, create a pending transaction record here
    await Database.createTransaction({
      userId: user.id,
      type: "deposit",
      amount: Number(amount),
      description: `Deposit`,
      status: "pending",
      reference,
    })

    return NextResponse.json({
      authorization_url: paystackData.data.authorization_url,
      reference,
      amount: Number(amount),
    })
  } catch (error) {
    console.error("Deposit error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
