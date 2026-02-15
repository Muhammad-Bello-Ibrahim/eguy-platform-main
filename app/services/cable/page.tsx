import { Suspense } from "react";
import CableSubscriptionPage from "@/components/services/CableSubscriptionPage";

export default function CablePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CableSubscriptionPage />
        </Suspense>
    );
}
