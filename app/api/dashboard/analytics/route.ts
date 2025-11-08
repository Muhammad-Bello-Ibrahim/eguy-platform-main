export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie or authorization header
    const token = request.cookies.get("token")?.value ||
      request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token using jose
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret");
    const { payload } = await jwtVerify(token, secret);

    if (!payload || !payload.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Mock analytics data - in a real app, this would come from database
    const analytics = {
      totalSpent: 71500,
      totalReceived: 125430,
      monthlyGoal: 100000,
      goalProgress: 75,
      transactionsCount: 23,
      avgTransaction: 4250
    };

    return NextResponse.json({ analytics });
  } catch (error) {
    console.error("Dashboard analytics error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
