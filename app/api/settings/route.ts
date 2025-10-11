import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { Database } from "@/lib/database";

// GET - Get user settings/preferences
export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await Database.findUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // For now, use localStorage-based settings until database schema is updated
    const settings = {
      darkMode: false, // Default value
      notifications: true, // Default value
      biometric: false, // Default value
      language: "en", // Default value
      currency: "NGN", // Default value
    };

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Settings fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT - Update user settings/preferences
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { darkMode, notifications, biometric, language, currency } = body;

    // For now, just return success without saving to database
    // TODO: Update database schema to include these fields
    const settings = {
      darkMode: darkMode ?? false,
      notifications: notifications ?? true,
      biometric: biometric ?? false,
      language: language ?? "en",
      currency: currency ?? "NGN",
    };

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
