"use client"
import React, { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export function VerifyEmailPrompt() {
  const params = useSearchParams()
  const router = useRouter()
  const token = params.get("token") || ""
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle")
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!token) return
    setStatus("loading")
    fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setStatus("error")
          setMessage(data.error)
        } else {
          setStatus("success")
          setMessage("Your email is verified! Please log in to continue.")
        }
      })
      .catch(() => {
        setStatus("error")
        setMessage("Something went wrong.")
      })
  }, [token])

  return (
    <Card className="w-full max-w-md mx-auto mt-16 p-6 rounded-xl border border-green-100 bg-white text-center">
      {status === "loading" && (
        <Alert>
          <AlertDescription><Loader2 className="mr-2 h-4 w-4 animate-spin inline" /> Verifying...</AlertDescription>
        </Alert>
      )}
      {status === "success" && (
        <>
          <Alert>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
          <Button className="w-full mt-4" type="button" onClick={() => router.push("/signin")}>Login</Button>
        </>
      )}
      {status === "error" && (
        <Alert variant="destructive">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      {status === "idle" && (
        <Alert>
          <AlertDescription>Click the verification link in your email to verify your account.</AlertDescription>
        </Alert>
      )}
    </Card>
  )
}
