import { type NextRequest, NextResponse } from "next/server"
import { getSession, hashPassword } from "@/lib/auth"
import { Database } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { pin, confirmPin } = await request.json()

    if (!pin || !confirmPin) {
      return NextResponse.json({ error: "Both PIN and confirm PIN are required" }, { status: 400 })
    }

    if (pin !== confirmPin) {
      return NextResponse.json({ error: "PINs do not match" }, { status: 400 })
    }

    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      return NextResponse.json({ error: "PIN must be a 4-digit number" }, { status: 400 })
    }

    const pinHash = await hashPassword(pin)
    const userId = (session.user as any).id

    await Database.updateUserById(userId, { transactionPin: pinHash })

    return NextResponse.json({ success: true, message: "Transaction PIN updated successfully" })
  } catch (error: any) {
    console.error("Change PIN error:", error)
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 })
  }
}
