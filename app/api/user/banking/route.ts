import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { Database } from "@/lib/database";

export async function GET() {
    try {
        const session = await getSession();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!session || !(session.user as any)?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const user = await Database.findUserById((session.user as any).id);
        return NextResponse.json({ linkedAccounts: user?.linkedAccounts || [] });

    } catch (error) {
        console.error("Get linked accounts error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!session || !(session.user as any)?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { bank, accountNumber, accountName } = body;

        if (!bank || !accountNumber || !accountName) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Check if user already has accounts to determine if this one should be primary
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userId = (session.user as any).id;
        const user = await Database.findUserById(userId);
        const isFirstAccount = !user?.linkedAccounts || user.linkedAccounts.length === 0;

        const newAccount = await Database.addLinkedAccount(userId, {
            bank,
            accountNumber,
            accountName,
            isPrimary: isFirstAccount || body.isPrimary,
            type: body.type || "checking"
        });

        return NextResponse.json({ success: true, account: newAccount });

    } catch (error: any) {
        console.error("Add linked account error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await getSession();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!session || !(session.user as any)?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { accountId, action } = body;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userId = (session.user as any).id;

        if (action === 'setPrimary') {
            await Database.setPrimaryLinkedAccount(userId, accountId);
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });

    } catch (error) {
        console.error("Update linked account error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = await getSession();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!session || !(session.user as any)?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const accountId = searchParams.get('id');

        if (!accountId) {
            return NextResponse.json({ error: "Missing account ID" }, { status: 400 });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userId = (session.user as any).id;
        await Database.removeLinkedAccount(userId, accountId);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Delete linked account error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
