export const dynamic = "force-dynamic";
export const revalidate = 0;
import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { Database } from "@/lib/database"
import {
  profileSettingsSchema,
  notificationSettingsSchema,
  privacySettingsSchema,
  securitySettingsSchema,
  preferencesSettingsSchema
} from "@/lib/validation"

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
      case "profile": {
        const val = profileSettingsSchema.safeParse(settings)
        if (!val.success) {
          return NextResponse.json({ error: val.error.errors[0]?.message || "Invalid profile data" }, { status: 400 })
        }
        updateData = {
          fullName: val.data.displayName,
          phone: val.data.phone,
          avatar: val.data.avatar,
          bio: val.data.bio,
          location: val.data.location,
          dateOfBirth: val.data.dateOfBirth
        }
        break
      }
      case "notifications": {
        const val = notificationSettingsSchema.safeParse(settings)
        if (!val.success) {
          return NextResponse.json({ error: "Invalid notification configuration" }, { status: 400 })
        }
        updateData = {
          emailNotifications: val.data.emailNotifications,
          smsNotifications: val.data.smsNotifications,
          pushNotifications: val.data.pushNotifications,
          transactionAlerts: val.data.transactionAlerts,
          securityAlerts: val.data.securityAlerts,
          marketingEmails: val.data.marketingEmails
        }
        break
      }
      case "privacy": {
        const val = privacySettingsSchema.safeParse(settings)
        if (!val.success) {
          return NextResponse.json({ error: "Invalid privacy settings" }, { status: 400 })
        }
        updateData = {
          profileVisibility: val.data.profileVisibility,
          showOnlineStatus: val.data.showOnlineStatus,
          allowReferrals: val.data.allowReferrals,
          dataSharing: val.data.dataSharing
        }
        break
      }
      case "security": {
        const val = securitySettingsSchema.safeParse(settings)
        if (!val.success) {
          return NextResponse.json({ error: "Invalid security configuration" }, { status: 400 })
        }
        updateData = {
          twoFactorEnabled: val.data.twoFactorEnabled,
          sessionTimeout: val.data.sessionTimeout,
          loginAlerts: val.data.loginAlerts
        }
        break
      }
      case "preferences": {
        const val = preferencesSettingsSchema.safeParse(settings)
        if (!val.success) {
          return NextResponse.json({ error: "Invalid preferences data" }, { status: 400 })
        }
        updateData = {
          currency: val.data.currency,
          language: val.data.language,
          timezone: val.data.timezone,
          theme: val.data.theme
        }
        break
      }
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
