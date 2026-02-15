import { Suspense } from "react";
import RegisterStep1Page from "@/components/auth/RegisterStep1Page";

export default function Register() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RegisterStep1Page />
        </Suspense>
    );
}
