import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"
import { createSession } from "@/lib/auth"
import { verifyPassword } from "@/lib/server-auth"
import { withRateLimit } from "@/lib/rate-limit"

export async function POST(request: NextRequest) {
  return withRateLimit(request, { action: "auth:signin", maxHits: 5, windowMs: 15 * 60 * 1000 }, async () => {
  try {
    const { emailOrPhone, password } = await request.json()

    // Validate input
    if (!emailOrPhone || !password) {
      return NextResponse.json({ error: "Email/phone and password are required" }, { status: 400 })
    }

    // Find user by email or phone
    let user = await Database.findUserByEmail(emailOrPhone)
    if (!user) {
      user = await Database.findUserByPhone(emailOrPhone)
    }

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.passwordHash)
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Check if user is active
    if (user.status !== "active") {
      return NextResponse.json({ error: "Account is suspended or inactive" }, { status: 403 })
    }

    // Fetch latest user data from DB before creating session
    const latestUser = await Database.findUserById(user.id);
    if (!latestUser) {
      return NextResponse.json({ error: "User not found after login" }, { status: 404 });
    }
    await createSession({
      id: latestUser.id,
      fullName: latestUser.fullName,
      email: latestUser.email,
      phone: latestUser.phone,
      walletBalance: latestUser.walletBalance,
      referralCode: latestUser.referralCode,
      referredBy: latestUser.referredBy,
      kycStatus: latestUser.kycStatus,
      status: latestUser.status,
      role: latestUser.role,
    });

    return NextResponse.json({
      message: "Signed in successfully",
      user: {
        id: latestUser.id,
        fullName: latestUser.fullName,
        email: latestUser.email,
        phone: latestUser.phone,
        walletBalance: latestUser.walletBalance,
        referralCode: latestUser.referralCode,
        role: latestUser.role,
      },
    });
  } catch (error) {
    console.error("Signin error:", error);
    // Log the actual error for debugging
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
  });
}

