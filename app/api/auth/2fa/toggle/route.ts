import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/database';
import { getSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const session = await getSession(request);
        if (!session?.userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { enabled } = await request.json();

        if (typeof enabled !== 'boolean') {
            return NextResponse.json(
                { error: 'Invalid enabled value' },
                { status: 400 }
            );
        }

        await Database.toggleTwoFactor(session.userId as string, enabled);

        return NextResponse.json({
            success: true,
            twoFactorEnabled: enabled,
        });
    } catch (error: any) {
        console.error('Error toggling two-factor auth:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to toggle two-factor authentication' },
            { status: 500 }
        );
    }
}
