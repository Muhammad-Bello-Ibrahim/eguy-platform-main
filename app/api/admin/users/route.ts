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

    // Mock user data - in production, this would come from database
    const users = [
      {
        id: "1",
        fullName: "John Doe",
        email: "john@example.com",
        phone: "08012345678",
        walletBalance: 15000,
        status: "active",
        kycStatus: "verified",
        referralCode: "JD123",
        totalReferrals: 12,
        totalEarnings: 24000,
        createdAt: "2024-01-15T10:30:00Z",
        lastActive: "2024-01-20T14:22:00Z",
      },
      {
        id: "2",
        fullName: "Jane Smith",
        email: "jane@example.com",
        phone: "08087654321",
        walletBalance: 8500,
        status: "active",
        kycStatus: "pending",
        referralCode: "JS456",
        totalReferrals: 8,
        totalEarnings: 16000,
        createdAt: "2024-01-10T09:15:00Z",
        lastActive: "2024-01-19T16:45:00Z",
      },
      {
        id: "3",
        fullName: "Mike Johnson",
        email: "mike@example.com",
        phone: "08098765432",
        walletBalance: 2300,
        status: "suspended",
        kycStatus: "rejected",
        referralCode: "MJ789",
        totalReferrals: 3,
        totalEarnings: 6000,
        createdAt: "2024-01-08T11:20:00Z",
        lastActive: "2024-01-18T12:30:00Z",
      },
    ]

    return NextResponse.json({ users, total: users.length })
  } catch (error) {
    console.error("Admin users error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
