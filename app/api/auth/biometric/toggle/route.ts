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

        await Database.toggleBiometric(session.userId as string, enabled);

        return NextResponse.json({
            success: true,
            biometricEnabled: enabled,
        });
    } catch (error: any) {
        console.error('Error toggling biometric:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to toggle biometric' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await getSession(request);
        if (!session?.userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const user = await Database.findUserById(session.userId as string);
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            biometricEnabled: user.biometricEnabled || false,
            credentialCount: user.biometricCredentials?.length || 0,
        });
    } catch (error: any) {
        console.error('Error getting biometric status:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to get biometric status' },
            { status: 500 }
        );
    }
}
