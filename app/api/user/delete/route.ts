import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { Database } from "@/lib/database";

export async function DELETE() {
    try {
        const session = await getSession();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!session || !(session.user as any)?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userId = (session.user as any).id;

        // Perform deletion
        const success = await Database.deleteUser(userId);

        if (success) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
        }

    } catch (error) {
        console.error("Delete user error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
