"use client";

import { usePathname } from "next/navigation";
import { BottomNav } from "./BottomNav";

export default function BottomNavWrapper() {
    const pathname = usePathname();

    // Define paths where BottomNav should be visible
    // Includes /dashboard, /profile, /elevatex, /wallet (if it exists or just for safety)
    const showBottomNav =
        pathname.startsWith('/dashboard') ||
        pathname.startsWith('/profile') ||
        pathname.startsWith('/elevatex') ||
        pathname.startsWith('/notifications') ||
        pathname.startsWith('/wallet') ||
        pathname.startsWith('/settings');

    // Hide on auth pages or specific sub-pages if needed, but the current requirement says "through out the dashboard pages"
    // We can refine this list if needed. Assuming these are the main protected areas.

    if (!showBottomNav) return null;

    return <BottomNav />;
}
