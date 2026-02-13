import { Suspense } from "react";
import VerifyPromptClient from "./VerifyPromptClient";

export default function VerifyPromptPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyPromptClient />
    </Suspense>
  );
}
