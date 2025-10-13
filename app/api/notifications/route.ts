import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { Database } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await Database.findUserByEmail(session.user.email)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") // "all", "unread", "transactions", "security", etc.
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = parseInt(searchParams.get("offset") || "0")

    // TODO: Implement actual notifications database query
    // For now, return mock data based on user transactions and activities
    const mockNotifications = [
      {
        id: "notif_001",
        type: "transaction",
        title: "Deposit Successful",
        message: "₦25,000 has been added to your wallet",
        amount: 25000,
        status: "success",
        read: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        actionUrl: "/transactions"
      },
      {
        id: "notif_002",
        type: "referral",
        title: "Referral Bonus Earned",
        message: "You earned ₦1,000 from John Doe's registration",
        amount: 1000,
        status: "success",
        read: false,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        actionUrl: "/referrals"
      },
      {
        id: "notif_003",
        type: "security",
        title: "New Login Detected",
        message: "We noticed a login from a new device",
        status: "info",
        read: true,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        actionUrl: "/settings"
      },
      {
        id: "notif_004",
        type: "transaction",
        title: "Airtime Purchase",
        message: "₦1,500 airtime purchased for 08012345678",
        amount: 1500,
        status: "success",
        read: true,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        actionUrl: "/transactions"
      }
    ]

    // Filter notifications based on type
    let filteredNotifications = mockNotifications
    if (type && type !== "all") {
      if (type === "unread") {
        filteredNotifications = mockNotifications.filter(n => !n.read)
      } else {
        filteredNotifications = mockNotifications.filter(n => n.type === type)
      }
    }

    // Sort by creation date (newest first) and apply pagination
    filteredNotifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    const paginatedNotifications = filteredNotifications.slice(offset, offset + limit)

    return NextResponse.json({
      notifications: paginatedNotifications,
      total: filteredNotifications.length,
      unread: mockNotifications.filter(n => !n.read).length,
      hasMore: offset + limit < filteredNotifications.length
    })
  } catch (error) {
    console.error("Notifications fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { notificationIds, markAsRead = true } = body

    if (!notificationIds || !Array.isArray(notificationIds)) {
      return NextResponse.json({ error: "Notification IDs required" }, { status: 400 })
    }

    // TODO: Implement actual notification update in database
    // For now, just return success
    return NextResponse.json({
      message: `${notificationIds.length} notifications updated successfully`,
      updatedCount: notificationIds.length
    })
  } catch (error) {
    console.error("Notifications update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const notificationId = searchParams.get("id")

    if (!notificationId) {
      return NextResponse.json({ error: "Notification ID required" }, { status: 400 })
    }

    // TODO: Implement actual notification deletion in database
    return NextResponse.json({
      message: "Notification deleted successfully"
    })
  } catch (error) {
    console.error("Notification deletion error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
