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

    // Get real notifications from database
    const notifications = await Database.getUserNotifications(user.id, {
      type: type || "all",
      limit,
      offset,
    })

    // Get unread count
    const unreadCount = await Database.getUnreadNotificationCount(user.id)

    return NextResponse.json({
      notifications,
      total: notifications.length,
      unread: unreadCount,
      hasMore: notifications.length === limit
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

    const user = await Database.findUserByEmail(session.user.email)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Mark notifications as read in database
    await Database.markNotificationsAsRead(user.id, notificationIds)

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

    const user = await Database.findUserByEmail(session.user.email)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Delete notification from database
    await Database.deleteNotification(user.id, notificationId)

    return NextResponse.json({
      message: "Notification deleted successfully"
    })
  } catch (error) {
    console.error("Notification deletion error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
