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

        const { credential } = await request.json();

        if (!credential || !credential.id || !credential.publicKey) {
            return NextResponse.json(
                { error: 'Invalid credential data' },
                { status: 400 }
            );
        }

        // Save the biometric credential
        await Database.saveBiometricCredential(session.userId as string, {
            id: credential.id,
            publicKey: credential.publicKey,
            counter: credential.counter || 0,
            createdAt: new Date(credential.createdAt),
            deviceName: credential.deviceName,
        });

        return NextResponse.json({
            success: true,
            message: 'Biometric credential registered successfully',
        });
    } catch (error: any) {
        console.error('Error registering biometric:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to register biometric credential' },
            { status: 500 }
        );
    }
}
