import { NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"
import { handleApiError, ValidationError, NotFoundError } from "@/lib/errors"

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      throw new ValidationError("Token required");
    }

    const tokenDoc = await Database.getVerificationToken(token)

    if (!tokenDoc) {
      throw new ValidationError("Invalid or expired token");
    }

    if (tokenDoc.expires < new Date()) {
      throw new ValidationError("Invalid or expired token");
    }

    const updatedUser = await Database.updateUserById(tokenDoc.userId, {
      kycStatus: "verified"
    })

    if (!updatedUser) {
      throw new NotFoundError("User");
    }

    // Mark token as used
    await Database.markTokenAsUsed(token)

    // Refresh session with updated user data
    const { createSession } = await import("@/lib/auth")
    await createSession({
      id: updatedUser.id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      phone: updatedUser.phone,
      walletBalance: updatedUser.walletBalance,
      referralCode: updatedUser.referralCode,
      referredBy: updatedUser.referredBy,
      kycStatus: updatedUser.kycStatus,
      status: updatedUser.status,
      role: updatedUser.role,
    })

    return NextResponse.json({ message: "Email verified successfully" })
  } catch (error) {
    return handleApiError(error as Error, {
      route: '/api/auth/verify-email',
    });
  }
}
