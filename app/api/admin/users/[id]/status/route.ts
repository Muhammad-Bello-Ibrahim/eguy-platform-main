import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { Database } from "@/lib/database"
import { handleApiError, AuthenticationError, AuthorizationError, ValidationError, NotFoundError } from "@/lib/errors"

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    if (!session) {
      throw new AuthenticationError();
    }
    if (session.user.role !== "admin") {
      throw new AuthorizationError();
    }

    const { status, reason } = await request.json()
    const userId = params.id

    if (!status || !["active", "suspended", "inactive"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    // Update user status in database
    const updatedUser = await Database.updateUserById(userId, {
      status: status as "active" | "suspended" | "inactive"
    })

    if (!updatedUser) {
      throw new NotFoundError("User");
    }

    return NextResponse.json({
      message: "User status updated successfully",
      user: updatedUser
    })
  } catch (error) {
    return handleApiError(error as Error, {
      route: '/api/admin/users/[id]/status',
      userId: params?.id,
    });
  }
}
