import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { disco, meterNumber, meterType } = await request.json();

        if (!disco || !meterNumber || !meterType) {
            return NextResponse.json({ error: "Disco, Meter Number, and Meter Type are required" }, { status: 400 });
        }

        const username = process.env.SUBANDGAIN_USER_NAME;
        const apiKey = process.env.SUBANDGAIN_API_KEY;

        if (!username || !apiKey) {
            console.error("SubAndGain credentials not configured");
            return NextResponse.json({ error: "Service configuration error" }, { status: 500 });
        }

        const url = `https://subandgain.com/api/verify_electricity.php?username=${username}&apiKey=${apiKey}&service=${disco}&meterNumber=${meterNumber}&meterType=${meterType}`;

        const res = await fetch(url);
        const data = await res.json();

        if (data.error) {
            return NextResponse.json({ error: data.description || "Validation failed" }, { status: 400 });
        }

        // Success response: {"status":"success","customerName":"...","accessToken":"..."}
        return NextResponse.json(data);

    } catch (error) {
        console.error("Electricity validation error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
