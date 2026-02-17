import { NextRequest, NextResponse } from 'next/server';
import { Database, type DatabaseUser } from '@/lib/database';
import { encrypt } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const { credentialId, email } = await request.json();

        if (!credentialId || !email) {
            return NextResponse.json(
                { error: 'Missing credential ID or email' },
                { status: 400 }
            );
        }

        // Find user by credential ID
        const user = await Database.findUserByCredentialId(credentialId) as DatabaseUser | null;

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid biometric credential' },
                { status: 401 }
            );
        }

        // Verify the email matches (additional security check)
        if (user.email !== email) {
            return NextResponse.json(
                { error: 'Email mismatch' },
                { status: 401 }
            );
        }

        // Check if biometric is enabled
        if (!user.biometricEnabled) {
            return NextResponse.json(
                { error: 'Biometric authentication is disabled for this account' },
                { status: 403 }
            );
        }

        // Create session token
        const token = await encrypt({ userId: user.id });

        const response = NextResponse.json({
            success: true,
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
            },
        });

        // Set session cookie
        response.cookies.set('session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 24 hours
        });

        return response;
    } catch (error: any) {
        console.error('Error authenticating with biometric:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to authenticate' },
            { status: 500 }
        );
    }
}
