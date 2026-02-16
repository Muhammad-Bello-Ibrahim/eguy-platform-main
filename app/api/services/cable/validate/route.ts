import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { provider, smartcardNumber } = await request.json();

        if (!provider || !smartcardNumber) {
            return NextResponse.json({ error: "Provider and Smartcard Number are required" }, { status: 400 });
        }

        const username = process.env.SUBANDGAIN_USER_NAME;
        const apiKey = process.env.SUBANDGAIN_API_KEY;

        if (!username || !apiKey) {
            console.error("SubAndGain credentials not configured");
            return NextResponse.json({ error: "Service configuration error" }, { status: 500 });
        }

        const serviceUC = provider.toUpperCase();
        const url = `https://subandgain.com/api/verify_bills.php?username=${username}&apiKey=${apiKey}&service=${serviceUC}&smartNumber=${smartcardNumber}`;

        const res = await fetch(url);
        const data = await res.json();

        if (data.error) {
            return NextResponse.json({ error: data.description || "Validation failed" }, { status: 400 });
        }

        // Success response: {"status":"success","customerName":"...","smartNumber":"..."}
        return NextResponse.json(data);

    } catch (error) {
        console.error("Cable validation error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
