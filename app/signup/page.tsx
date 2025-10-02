"use client"
import { SignupForm } from "@/components/auth/signup-form"
import Link from "next/link"

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
      <div className="w-full max-w-sm mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-green-700">Create Account</h1>
        </div>
        <SignupForm />
        <div className="mt-6 text-center">
          <Link href="/signin" className="text-green-700 hover:underline font-medium text-sm">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}