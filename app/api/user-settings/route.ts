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

    // TODO: Implement actual user preferences lookup in database
    const settings = {
      profile: {
        displayName: user.fullName,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar || null,
        bio: user.bio || "",
        location: user.location || "",
        dateOfBirth: user.dateOfBirth || null
      },
      notifications: {
        emailNotifications: user.emailNotifications !== false,
        smsNotifications: user.smsNotifications !== false,
        pushNotifications: user.pushNotifications !== false,
        transactionAlerts: user.transactionAlerts !== false,
        securityAlerts: user.securityAlerts !== false,
        marketingEmails: user.marketingEmails === true
      },
      privacy: {
        profileVisibility: user.profileVisibility || "private",
        showOnlineStatus: user.showOnlineStatus !== false,
        allowReferrals: user.allowReferrals !== false,
        dataSharing: user.dataSharing === true
      },
      security: {
        twoFactorEnabled: user.twoFactorEnabled || false,
        sessionTimeout: user.sessionTimeout || 24,
        loginAlerts: user.loginAlerts !== false
      },
      preferences: {
        currency: user.currency || "NGN",
        language: user.language || "en",
        timezone: user.timezone || "Africa/Lagos",
        theme: user.theme || "light"
      }
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error("Settings fetch error:", error)
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
    const { category, settings } = body

    if (!category || !settings) {
      return NextResponse.json({ error: "Category and settings required" }, { status: 400 })
    }

    const user = await Database.findUserByEmail(session.user.email)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Update user settings based on category
    let updateData: any = {}
    switch (category) {
      case "profile":
        updateData = {
          fullName: settings.displayName,
          phone: settings.phone,
          avatar: settings.avatar,
          bio: settings.bio,
          location: settings.location,
          dateOfBirth: settings.dateOfBirth
        }
        break
      case "notifications":
        updateData = {
          emailNotifications: settings.emailNotifications,
          smsNotifications: settings.smsNotifications,
          pushNotifications: settings.pushNotifications,
          transactionAlerts: settings.transactionAlerts,
          securityAlerts: settings.securityAlerts,
          marketingEmails: settings.marketingEmails
        }
        break
      case "privacy":
        updateData = {
          profileVisibility: settings.profileVisibility,
          showOnlineStatus: settings.showOnlineStatus,
          allowReferrals: settings.allowReferrals,
          dataSharing: settings.dataSharing
        }
        break
      case "security":
        updateData = {
          twoFactorEnabled: settings.twoFactorEnabled,
          sessionTimeout: settings.sessionTimeout,
          loginAlerts: settings.loginAlerts
        }
        break
      case "preferences":
        updateData = {
          currency: settings.currency,
          language: settings.language,
          timezone: settings.timezone,
          theme: settings.theme
        }
        break
      default:
        return NextResponse.json({ error: "Invalid category" }, { status: 400 })
    }

    const updated = await Database.updateUserByEmail(session.user.email, updateData)

    if (!updated) {
      return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
    }

    return NextResponse.json({
      message: "Settings updated successfully",
      settings: { category, ...settings }
    })
  } catch (error) {
    console.error("Settings update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
