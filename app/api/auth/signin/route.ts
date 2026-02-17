import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"
import { verifyPassword, createSession } from "@/lib/auth"
import { handleApiError, AuthenticationError, NotFoundError, AuthorizationError } from "@/lib/errors"

export async function POST(request: NextRequest) {
  let emailOrPhone: string | undefined;
  try {
    const { emailOrPhone: emailOrPhoneValue, password } = await request.json()
    emailOrPhone = emailOrPhoneValue;

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
      throw new NotFoundError("User");
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.passwordHash)
    if (!isValidPassword) {
      throw new AuthenticationError("Invalid credentials");
    }

    // Check if user is active
    if (user.status !== "active") {
      throw new AuthorizationError("Account is suspended or inactive");
    }

    // Fetch latest user data from DB before creating session
    const latestUser = await Database.findUserById(user.id);
    if (!latestUser) {
      throw new NotFoundError("User");
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
    return handleApiError(error as Error, {
      route: '/api/auth/signin',
      emailOrPhone,
    });
  }
}
