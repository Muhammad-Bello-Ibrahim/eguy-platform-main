import { SigninForm } from "@/components/auth/signin-form"
import Link from "next/link"

export default function SigninPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
      <div className="w-full max-w-sm mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-green-700">Sign In</h1>
        </div>
        <SigninForm />
        <div className="mt-6 text-center">
          <Link href="/signup" className="text-green-700 hover:underline font-medium text-sm">
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}