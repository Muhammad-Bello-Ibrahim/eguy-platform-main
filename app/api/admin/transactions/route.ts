import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Mock transaction data
    const transactions = [
      {
        id: "TXN001",
        userId: "1",
        userName: "John Doe",
        type: "deposit",
        amount: 5000,
        description: "Wallet deposit via payment gateway",
        status: "completed",
        reference: "DEP_1234567890",
        createdAt: "2024-01-20T10:30:00Z",
        metadata: { gateway: "flutterwave" },
      },
      {
        id: "TXN002",
        userId: "2",
        userName: "Jane Smith",
        type: "payment",
        amount: 1000,
        description: "MTN airtime for 08087654321",
        status: "completed",
        reference: "AIR_0987654321",
        createdAt: "2024-01-20T09:15:00Z",
        metadata: { network: "mtn", phone: "08087654321" },
      },
      {
        id: "TXN003",
        userId: "3",
        userName: "Mike Johnson",
        type: "withdrawal",
        amount: 3000,
        description: "Wallet withdrawal request",
        status: "pending",
        reference: "WTH_1122334455",
        createdAt: "2024-01-19T14:22:00Z",
        metadata: { bankAccount: "****1234" },
      },
    ]

    return NextResponse.json({ transactions, total: transactions.length })
  } catch (error) {
    console.error("Admin transactions error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
