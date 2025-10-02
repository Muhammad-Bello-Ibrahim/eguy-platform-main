"use client"
import React, { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export function ChangePasswordForm() {
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Something went wrong")
      setSuccess("Password changed successfully.")
      setOldPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-8 p-6 rounded-xl border border-green-100 bg-white">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-2 w-full">
          <Label htmlFor="oldPassword" className="text-sm font-semibold text-green-700 mb-1">Current Password</Label>
          <Input
            id="oldPassword"
            name="oldPassword"
            type="password"
            required
            value={oldPassword}
            onChange={e => setOldPassword(e.target.value)}
            placeholder="Enter current password"
            className="w-full rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-base font-semibold text-green-700 focus:outline-none"
          />
        </div>
        <div className="space-y-2 w-full">
          <Label htmlFor="newPassword" className="text-sm font-semibold text-green-700 mb-1">New Password</Label>
          <Input
            id="newPassword"
            name="newPassword"
            type="password"
            required
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className="w-full rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-base font-semibold text-green-700 focus:outline-none"
          />
        </div>
        <div className="space-y-2 w-full">
          <Label htmlFor="confirmPassword" className="text-sm font-semibold text-green-700 mb-1">Confirm New Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="w-full rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-base font-semibold text-green-700 focus:outline-none"
          />
        </div>
        <Button type="submit" className="w-full py-3 rounded-xl bg-green-600 text-white font-bold text-base transition-all duration-200 active:scale-95" disabled={isLoading}>
          {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Changing...</> : "Change Password"}
        </Button>
      </form>
    </Card>
  )
}
