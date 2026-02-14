"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { ReactNode } from "react";

export function AuthProvider({ children }: { children: ReactNode }) {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    // We must provide a clientId even if it's missing to prevent the
    // "Google OAuth components must be used within GoogleOAuthProvider" error
    // during build or when environment variables are missing.
    // This allows the app to load, even if the actual sign-in will fail.
    const effectiveClientId = clientId || "missing-client-id";

    if (!clientId) {
        console.warn("Google Client ID is missing. Google Sign-In will not work.");
    }

    return (
        <GoogleOAuthProvider clientId={effectiveClientId}>
            {children}
        </GoogleOAuthProvider>
    );
}
