import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { Database } from "@/lib/database"
import { handleApiError, AuthenticationError } from "@/lib/errors"

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      throw new AuthenticationError();
    }

    const transactions = await Database.getUserTransactions(session.user.id)

    return NextResponse.json({
      transactions: transactions.map((t) => ({
        id: t.id,
        type: t.type,
        amount: t.amount,
        description: t.description,
        status: t.status,
        reference: t.reference,
        createdAt: t.createdAt,
      })),
    })
  } catch (error) {
    return handleApiError(error as Error, {
      route: '/api/wallet/transactions',
      userId: (await getSession())?.user?.id,
    });
  }
}
