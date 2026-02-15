import { Suspense } from "react";
import BuyAirtimePage from "@/components/services/BuyAirtimePage";

export default function AirtimePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BuyAirtimePage />
        </Suspense>
    );
}
