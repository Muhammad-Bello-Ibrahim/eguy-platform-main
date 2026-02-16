
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { Database } from "@/lib/database";

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
        payoutSchedule: user.payoutSchedule || {
            frequency: 'weekly',
            minPayout: 1500,
            preferredDay: 'F'
        }
    });
}

export async function PUT(request: NextRequest) {
    const session = await getSession();
    if (!session || !session.user?.email || !session.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { frequency, minPayout, preferredDay } = body;

        // Validate
        if (!['daily', 'weekly', 'monthly'].includes(frequency)) {
            return NextResponse.json({ error: "Invalid frequency" }, { status: 400 });
        }

        if (typeof minPayout !== 'number' || minPayout < 100) {
            return NextResponse.json({ error: "Invalid minimum payout" }, { status: 400 });
        }

        await Database.updateUserPayoutSchedule(session.user.id, {
            frequency,
            minPayout,
            preferredDay
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating payout schedule:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
