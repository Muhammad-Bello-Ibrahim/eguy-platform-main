import { NextResponse } from "next/server"
import { Database } from "@/lib/database"
import AirtimePlan from "@/lib/models/AirtimePlan"

export async function PUT(request, { params }) {
  try {
    // ✅ Ensure database connects only at runtime
    await Database.getDb()

    const body = await request.json()
    const plan = await AirtimePlan.findByIdAndUpdate(params.id, body, { new: true })

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 })
    }

    return NextResponse.json(plan)
  } catch (error) {
    console.error("PUT airtime plan error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    await Database.getDb()
    const result = await AirtimePlan.findByIdAndDelete(params.id)

    if (!result) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE airtime plan error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
