import { Suspense } from 'react';
import PaymentConfirmationPage from "@/components/payment/PaymentConfirmationPage";

export default function PaymentConfirmation() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <PaymentConfirmationPage />
        </Suspense>
    );
}
