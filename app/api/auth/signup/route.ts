import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"
import { hashPassword, createSession } from "@/lib/auth"
import { handleApiError, ValidationError } from "@/lib/errors"

export async function POST(request: NextRequest) {
  let email: string | undefined;

  try {
    const {
      fullName,
      email: emailValue,
      phone,
      password,
      transactionPin,
      referralCode,
      dob,
      address
    } = await request.json()

    email = emailValue

    if (!fullName || !email || !phone || !password || !transactionPin) {
      throw new ValidationError("All fields are required")
    }

    // Check duplicates
    if (await Database.findUserByEmail(email)) {
      throw new ValidationError("User with this email already exists")
    }

    if (await Database.findUserByPhone(phone)) {
      throw new ValidationError("User with this phone number already exists")
    }

    // Hash credentials
    const passwordHash = await hashPassword(password)
    const pinHash = await hashPassword(transactionPin)

    // Validate referral code (do NOT create tree yet)
    let referredBy: string | undefined

    if (referralCode) {
      const referrer = await Database.findUserByReferralCode(referralCode)
      if (!referrer) {
        throw new ValidationError("Invalid referral code")
      }
      referredBy = referrer.id
    }

    // Create user (NO referral tree created here)
    const user = await Database.createUser({
      fullName,
      email,
      phone,
      passwordHash,
      transactionPin: pinHash,
      dob,
      address,
      walletBalance: 0,
      referralCode: "", // generated only on activation
      referredBy,
      elevatexActivated: false,
      kycStatus: "pending",
      status: "active",
      role: "user"
    })

    // Email verification
    const crypto = await import("crypto")
    const token = crypto.randomBytes(32).toString("hex")
    const expires = Date.now() + 1000 * 60 * 60
    await Database.saveVerificationToken(user.id, token, expires)

    const { sendVerificationEmail } = await import("@/lib/email")
    await sendVerificationEmail(user.email, token)

    // Create session
    await createSession({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      walletBalance: user.walletBalance,
      referralCode: user.referralCode,
      referredBy: user.referredBy,
      kycStatus: user.kycStatus,
      status: user.status,
      role: user.role,
    })

    return NextResponse.json({
      message: "User created successfully. Please verify your email.",
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        walletBalance: user.walletBalance,
        referralCode: user.referralCode,
      },
    })

  } catch (error) {
    return handleApiError(error as Error, {
      route: "/api/auth/signup",
      email,
    })
  }
}
