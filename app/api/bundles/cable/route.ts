import { NextResponse } from "next/server";

export async function GET() {
    try {
        const res = await fetch("https://subandgain.com/api/cablebundles.php");
        const data = await res.json();
        return NextResponse.json(data);
    } catch (e) {
        return NextResponse.json({ error: "Failed to fetch bundles" }, { status: 500 });
    }
}
