import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { Database } from "@/lib/database"
import { handleApiError, AuthenticationError, NotFoundError } from "@/lib/errors"

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      throw new AuthenticationError();
    }

    const user = await Database.findUserById(session.user.id)
    if (!user) {
      throw new NotFoundError("User");
    }

    return NextResponse.json({
      balance: user.walletBalance,
      currency: "NGN",
    })
  } catch (error) {
    return handleApiError(error as Error, {
      route: '/api/wallet/balance',
      userId: (await getSession())?.user?.id,
    });
  }
}
