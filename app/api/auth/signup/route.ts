import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"
import { hashPassword, createSession, generateReferralCode } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, phone, password, transactionPin, referralCode, dob, address } = await request.json()

    // Validate input
    if (!fullName || !email || !phone || !password || !transactionPin) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUserByEmail = await Database.findUserByEmail(email)
    if (existingUserByEmail) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    const existingUserByPhone = await Database.findUserByPhone(phone)
    if (existingUserByPhone) {
      return NextResponse.json({ error: "User with this phone number already exists" }, { status: 400 })
    }

    // Hash password
    const passwordHash = await hashPassword(password)
    // Hash PIN (reusing password hashing for secure PIN storage)
    const pinHash = await hashPassword(transactionPin)

    // Find referrer if referral code provided
    let referredBy: string | undefined
    if (referralCode) {
      const referrer = await Database.findUserByReferralCode(referralCode);
      if (referrer) {
        referredBy = referrer.id;
      }
    }

    // Create user
    const user = await Database.createUser({
      fullName,
      email,
      phone,
      passwordHash,
      transactionPin: pinHash,
      dob,
      address,
      walletBalance: 0,
      referralCode: "", // Referral code generated upon ElevateX activation
      referredBy,
      kycStatus: "pending",
      status: "active",
      role: "user", // default role
    })

    // Referral relationship is created when the user activates ElevateX via /api/elevatex/activate

    // Send verification email
    const crypto = await import("crypto")
    const token = crypto.randomBytes(32).toString("hex")
    const expires = new Date(Date.now() + 1000 * 60 * 60) // 1 hour
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
      message: "User created successfully. Please check your email to verify your account.",
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
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
