
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { Database } from "@/lib/database";

export async function GET(request: NextRequest) {
    const session = await getSession();
    const user = session?.user as any;
    if (!session || !user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await Database.findUserByEmail(user.email);
    if (!dbUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
        linkedAccounts: dbUser.linkedAccounts || []
    });
}

export async function POST(request: NextRequest) {
    const session = await getSession();
    const user = session?.user as any;
    if (!session || !user?.email || !user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { bank, bankCode, accountNumber, accountName } = body;

        if (!bank || !accountNumber || !accountName) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Check if account already exists
        const dbUser = await Database.findUserById(user.id);
        const existing = dbUser?.linkedAccounts?.find((a: any) => a.accountNumber === accountNumber && a.bank === bank);
        if (existing) {
            return NextResponse.json({ error: "Account already linked" }, { status: 409 });
        }

        const isFirstAccount = !dbUser?.linkedAccounts || dbUser.linkedAccounts.length === 0;

        const newAccount = await Database.addLinkedAccount(user.id, {
            bank,
            bankCode, // Added bankCode
            accountNumber,
            accountName,
            isPrimary: isFirstAccount
        });

        return NextResponse.json({ success: true, account: newAccount });
    } catch (error: any) {
        console.error("Error adding linked account:", error);
        return NextResponse.json({
            error: error.message || "Internal server error",
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    const session = await getSession();
    const user = session?.user as any;
    if (!session || !user?.email || !user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: "Missing account ID" }, { status: 400 });
    }

    try {
        await Database.removeLinkedAccount(user.id, id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error removing linked account:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    const session = await getSession();
    const user = session?.user as any;
    if (!session || !user?.email || !user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { accountId, action } = body;

        if (action === 'setPrimary' && accountId) {
            await Database.setPrimaryLinkedAccount(user.id, accountId);
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch (error) {
        console.error("Error updating linked account:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
