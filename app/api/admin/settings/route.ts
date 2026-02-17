import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"

export const dynamic = "force-dynamic"
export const revalidate = 0
// export const runtime = "nodejs"

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // TODO: Implement actual database queries for settings
    const settingsData = {
      platform: {
        name: "eGuy",
        description: "Modern fintech platform for Nigerians",
        version: "1.0.0",
        environment: "production",
        maintenanceMode: false
      },
      fees: {
        withdrawalFee: 50,
        minimumWithdrawal: 1000,
        maximumWithdrawal: 1000000,
        referralBonusLevel1: 1000,
        referralBonusLevel2: 500,
        referralBonusLevel3: 250,
        referralBonusLevel4: 125,
        referralBonusLevel5: 75
      },
      limits: {
        dailyTransactionLimit: 1000000,
        monthlyTransactionLimit: 5000000,
        maxAirtimePurchase: 10000,
        maxDataPurchase: 50000,
        maxBillPayment: 100000
      },
      notifications: {
        emailNotifications: true,
        smsNotifications: true,
        pushNotifications: true,
        maintenanceAlerts: true,
        securityAlerts: true
      },
      security: {
        requireKycForWithdrawal: true,
        maxLoginAttempts: 5,
        sessionTimeout: 24,
        passwordExpiry: 90,
        twoFactorRequired: false
      },
      integrations: {
        paymentProviders: ["Paystack", "Flutterwave"],
        smsProvider: "Termii",
        emailProvider: "SendGrid",
        analyticsProvider: "Google Analytics"
      }
    }

    return NextResponse.json(settingsData)
  } catch (error) {
    console.error("Admin settings error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    // TODO: Implement actual settings update logic

    return NextResponse.json({
      message: "Settings updated successfully",
      settings: body
    })
  } catch (error) {
    console.error("Admin settings update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
