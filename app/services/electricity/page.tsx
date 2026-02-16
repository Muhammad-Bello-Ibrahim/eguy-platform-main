import { Suspense } from 'react';
import ElectricityBillPage from '@/components/services/ElectricityBillPage';

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ElectricityBillPage />
        </Suspense>
    );
}
