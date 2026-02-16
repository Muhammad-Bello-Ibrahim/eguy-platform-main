
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { Database } from "@/lib/database";
import { handleApiError, AuthenticationError, NotFoundError, ValidationError } from "@/lib/errors";

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
            payoutSchedule: user.payoutSchedule || {
                frequency: 'weekly',
                minPayout: 1500,
                preferredDay: 'F'
            }
        });
    } catch (error) {
        return handleApiError(error as Error, {
            route: '/api/user/payouts',
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
        const { frequency, minPayout, preferredDay } = body;

        // Validate
        if (!['daily', 'weekly', 'monthly'].includes(frequency)) {
            throw new ValidationError("Invalid frequency");
        }

        if (typeof minPayout !== 'number' || minPayout < 100) {
            throw new ValidationError("Invalid minimum payout");
        }

        await Database.updateUserPayoutSchedule(session.user.id, {
            frequency,
            minPayout,
            preferredDay
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return handleApiError(error as Error, {
            route: '/api/user/payouts',
            method: 'PUT',
        });
    }
}
