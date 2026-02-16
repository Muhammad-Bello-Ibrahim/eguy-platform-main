
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { Database } from "@/lib/database";
import { handleApiError, AuthenticationError, NotFoundError, ValidationError } from "@/lib/errors";

const defaultPreferences = {
    push: { network: true, earnings: true, security: true, marketing: false },
    email: { network: false, earnings: true, security: true, marketing: false },
    sms: { network: false, earnings: true, security: true, marketing: false }
};

export async function GET(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session || !session.user?.email) {
            throw new AuthenticationError();
        }

        const user = await Database.findUserByEmail(session.user.email);
        if (!user) {
            throw new NotFoundError("User");
        }

        return NextResponse.json({
            notificationPreferences: user.notificationPreferences || defaultPreferences
        });
    } catch (error) {
        return handleApiError(error as Error, {
            route: '/api/user/notifications',
            method: 'GET',
        });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session || !session.user?.email || !session.user.id) {
            throw new AuthenticationError();
        }

        const body = await request.json();
        const { preferences } = body;

        if (!preferences || typeof preferences !== 'object') {
            throw new ValidationError("Invalid preferences format");
        }

        await Database.updateUserNotificationPreferences(session.user.id, preferences);

        return NextResponse.json({ success: true });
    } catch (error) {
        return handleApiError(error as Error, {
            route: '/api/user/notifications',
            method: 'PUT',
        });
    }
}
