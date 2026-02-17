import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { Database } from "@/lib/database"
import { handleApiError, AuthenticationError, AuthorizationError, ValidationError, NotFoundError } from "@/lib/errors"

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    if (!session) {
      throw new AuthenticationError();
    }
    const user = (session as any).user;
    if (user.role !== "admin") {
      throw new AuthorizationError();
    }

    const userId = params.id
    const updates = await request.json()

    // Validate required fields
    if (updates.fullName && (!updates.fullName.trim() || updates.fullName.length < 2)) {
      return NextResponse.json({ error: "Full name must be at least 2 characters" }, { status: 400 })
    }

    if (updates.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    if (updates.phone && (!updates.phone.trim() || updates.phone.length < 10)) {
      return NextResponse.json({ error: "Phone number must be at least 10 digits" }, { status: 400 })
    }

    // Allow updating administrative fields
    const allowedUpdates: any = {}
    if (updates.fullName) allowedUpdates.fullName = updates.fullName
    if (updates.email) allowedUpdates.email = updates.email
    if (updates.phone) allowedUpdates.phone = updates.phone
    if (updates.status) allowedUpdates.status = updates.status
    if (updates.kycStatus) allowedUpdates.kycStatus = updates.kycStatus
    if (updates.referredBy) allowedUpdates.referredBy = updates.referredBy
    if (updates.role) allowedUpdates.role = updates.role // Careful with this one

    if (Object.keys(allowedUpdates).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
    }

    // Update user in database
    const updatedUser = await Database.updateUserById(userId, allowedUpdates)

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Log the update action
    console.log(`Admin ${user.email} updated user ${userId}:`, Object.keys(allowedUpdates))

    return NextResponse.json({
      message: "User updated successfully",
      user: {
        id: updatedUser.id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        status: updatedUser.status,
        kycStatus: updatedUser.kycStatus,
        referredBy: updatedUser.referredBy
      }
    })
  } catch (error) {
    return handleApiError(error as Error, {
      route: '/api/admin/users/[id]',
      userId: params?.id,
    });
  }
}
