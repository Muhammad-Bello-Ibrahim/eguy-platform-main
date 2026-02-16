
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { Database } from "@/lib/database";

const defaultPreferences = {
    push: { network: true, earnings: true, security: true, marketing: false },
    email: { network: false, earnings: true, security: true, marketing: false },
    sms: { network: false, earnings: true, security: true, marketing: false }
};

export async function GET(request: NextRequest) {
    const session = await getSession();
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await Database.findUserByEmail(session.user.email);
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
        notificationPreferences: user.notificationPreferences || defaultPreferences
    });
}

export async function PUT(request: NextRequest) {
    const session = await getSession();
    if (!session || !session.user?.email || !session.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { preferences } = body;

        if (!preferences || typeof preferences !== 'object') {
            return NextResponse.json({ error: "Invalid preferences" }, { status: 400 });
        }

        await Database.updateUserNotificationPreferences(session.user.id, preferences);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating notification preferences:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
