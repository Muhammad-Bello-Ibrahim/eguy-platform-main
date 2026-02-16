import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { Database } from "@/lib/database";
import { handleApiError, AuthenticationError, NotFoundError, DatabaseError } from "@/lib/errors";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.user?.email) {
      throw new AuthenticationError();
    }
    const body = await request.json();
    const { fullName, phone, avatar, payoutAccount, bio, twitter, linkedin } = body;

    const user = await Database.findUserByEmail(session.user.email);
    if (!user) {
      throw new NotFoundError("User");
    }

    const updated = await Database.updateUserByEmail(session.user.email, {
      fullName,
      phone,
      avatar,
      payoutAccount,
      bio,
      twitter,
      linkedin
    });

    if (!updated) {
      throw new DatabaseError("updateUser");
    }
    return NextResponse.json({ user: updated });
  } catch (error) {
    return handleApiError(error as Error, {
      route: '/api/user',
      method: 'PUT',
    });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const userSession = session?.user as any;
    if (!session || !userSession?.email) {
      throw new AuthenticationError();
    }
    const user = await Database.findUserByEmail(userSession.email);
    if (!user) {
      throw new NotFoundError("User");
    }
    return NextResponse.json({ user });
  } catch (error) {
    return handleApiError(error as Error, {
      route: '/api/user',
      method: 'GET',
    });
  }
}
