"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, DollarSign, Shield, Bell, Database, Save, RefreshCw } from "lucide-react"

interface SettingsData {
  platform: {
    name: string
    description: string
    version: string
    environment: string
    maintenanceMode: boolean
  }
  fees: {
    withdrawalFee: number
    minimumWithdrawal: number
    maximumWithdrawal: number
    referralBonusLevel1: number
    referralBonusLevel2: number
    referralBonusLevel3: number
    referralBonusLevel4: number
    referralBonusLevel5: number
  }
  limits: {
    dailyTransactionLimit: number
    monthlyTransactionLimit: number
    maxAirtimePurchase: number
    maxDataPurchase: number
    maxBillPayment: number
  }
  notifications: {
    emailNotifications: boolean
    smsNotifications: boolean
    pushNotifications: boolean
    maintenanceAlerts: boolean
    securityAlerts: boolean
  }
  security: {
    requireKycForWithdrawal: boolean
    maxLoginAttempts: number
    sessionTimeout: number
    passwordExpiry: number
    twoFactorRequired: boolean
  }
  integrations: {
    paymentProviders: string[]
    smsProvider: string
    emailProvider: string
    analyticsProvider: string
  }
}

export function SettingsManagement({ searchTerm }: { searchTerm?: string }) {
  const [data, setData] = useState<SettingsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Prevent hydration mismatch
  React.useEffect(() => {
    setIsClient(true)
  }, [])

  // Get user from sessionStorage
  const user = typeof window !== "undefined" ? JSON.parse(window.sessionStorage.getItem("user") || "null") : null;

  useEffect(() => {
    if (isClient) {
      fetchSettings()
    }
  }, [isClient])

  if (!isClient) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-8 bg-muted rounded w-1/2" />
                  <div className="h-3 bg-muted rounded w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return <div className="p-4 text-red-600">Access denied: Admins only.</div>;
  }

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings")
      if (response.ok) {
        const data = await response.json()
        setData(data)
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveSettings = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        alert("Settings saved successfully!")
      } else {
        alert("Failed to save settings")
      }
    } catch (error) {
      console.error("Failed to save settings:", error)
      alert("Failed to save settings")
    } finally {
      setIsSaving(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount)
  }

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-8 bg-muted rounded w-1/2" />
                  <div className="h-3 bg-muted rounded w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">System Settings</h1>
          <p className="text-slate-600">Configure platform parameters and preferences</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={fetchSettings} className="bg-transparent">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={saveSettings} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Platform Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Platform Configuration</span>
            </CardTitle>
            <CardDescription>Basic platform information and settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="platformName">Platform Name</Label>
              <Input
                id="platformName"
                value={data.platform.name}
                onChange={(e) => setData(prev => prev ? {...prev, platform: {...prev.platform, name: e.target.value}} : prev)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="platformDescription">Description</Label>
              <Input
                id="platformDescription"
                value={data.platform.description}
                onChange={(e) => setData(prev => prev ? {...prev, platform: {...prev.platform, description: e.target.value}} : prev)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="environment">Environment</Label>
              <Select
                value={data.platform.environment}
                onValueChange={(value) => setData(prev => prev ? {...prev, platform: {...prev.platform, environment: value}} : prev)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="staging">Staging</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">Temporarily disable user access</p>
              </div>
              <Switch
                id="maintenanceMode"
                checked={data.platform.maintenanceMode}
                onCheckedChange={(checked) => setData(prev => prev ? {...prev, platform: {...prev.platform, maintenanceMode: checked}} : prev)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Fee Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Fee Configuration</span>
            </CardTitle>
            <CardDescription>Set transaction fees and limits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="withdrawalFee">Withdrawal Fee</Label>
                <Input
                  id="withdrawalFee"
                  type="number"
                  value={data.fees.withdrawalFee}
                  onChange={(e) => setData(prev => prev ? {...prev, fees: {...prev.fees, withdrawalFee: Number(e.target.value)}} : prev)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minimumWithdrawal">Min Withdrawal</Label>
                <Input
                  id="minimumWithdrawal"
                  type="number"
                  value={data.fees.minimumWithdrawal}
                  onChange={(e) => setData(prev => prev ? {...prev, fees: {...prev.fees, minimumWithdrawal: Number(e.target.value)}} : prev)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="referralBonus1">Level 1 Referral Bonus</Label>
              <Input
                id="referralBonus1"
                type="number"
                value={data.fees.referralBonusLevel1}
                onChange={(e) => setData(prev => prev ? {...prev, fees: {...prev.fees, referralBonusLevel1: Number(e.target.value)}} : prev)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="referralBonus2">Level 2 Referral Bonus</Label>
              <Input
                id="referralBonus2"
                type="number"
                value={data.fees.referralBonusLevel2}
                onChange={(e) => setData(prev => prev ? {...prev, fees: {...prev.fees, referralBonusLevel2: Number(e.target.value)}} : prev)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Security Settings</span>
            </CardTitle>
            <CardDescription>Configure security and access controls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="requireKyc">Require KYC for Withdrawals</Label>
                <p className="text-sm text-muted-foreground">Users must verify identity before withdrawing</p>
              </div>
              <Switch
                id="requireKyc"
                checked={data.security.requireKycForWithdrawal}
                onCheckedChange={(checked) => setData(prev => prev ? {...prev, security: {...prev.security, requireKycForWithdrawal: checked}} : prev)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
              <Input
                id="maxLoginAttempts"
                type="number"
                value={data.security.maxLoginAttempts}
                onChange={(e) => setData(prev => prev ? {...prev, security: {...prev.security, maxLoginAttempts: Number(e.target.value)}} : prev)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={data.security.sessionTimeout}
                onChange={(e) => setData(prev => prev ? {...prev, security: {...prev.security, sessionTimeout: Number(e.target.value)}} : prev)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notification Settings</span>
            </CardTitle>
            <CardDescription>Configure system notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailNotifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Send email notifications for important events</p>
              </div>
              <Switch
                id="emailNotifications"
                checked={data.notifications.emailNotifications}
                onCheckedChange={(checked) => setData(prev => prev ? {...prev, notifications: {...prev.notifications, emailNotifications: checked}} : prev)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="smsNotifications">SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">Send SMS notifications for transactions</p>
              </div>
              <Switch
                id="smsNotifications"
                checked={data.notifications.smsNotifications}
                onCheckedChange={(checked) => setData(prev => prev ? {...prev, notifications: {...prev.notifications, smsNotifications: checked}} : prev)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="securityAlerts">Security Alerts</Label>
                <p className="text-sm text-muted-foreground">Alert on security events and login attempts</p>
              </div>
              <Switch
                id="securityAlerts"
                checked={data.notifications.securityAlerts}
                onCheckedChange={(checked) => setData(prev => prev ? {...prev, notifications: {...prev.notifications, securityAlerts: checked}} : prev)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Integration Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Integration Settings</span>
            </CardTitle>
            <CardDescription>Configure third-party service integrations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="paymentProviders">Payment Providers</Label>
              <Input
                id="paymentProviders"
                value={data.integrations.paymentProviders.join(", ")}
                onChange={(e) => setData(prev => prev ? {...prev, integrations: {...prev.integrations, paymentProviders: e.target.value.split(", ")}} : prev)}
                placeholder="Paystack, Flutterwave"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smsProvider">SMS Provider</Label>
              <Select
                value={data.integrations.smsProvider}
                onValueChange={(value) => setData(prev => prev ? {...prev, integrations: {...prev.integrations, smsProvider: value}} : prev)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Termii">Termii</SelectItem>
                  <SelectItem value="Twilio">Twilio</SelectItem>
                  <SelectItem value="BulkSMS">BulkSMS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="emailProvider">Email Provider</Label>
              <Select
                value={data.integrations.emailProvider}
                onValueChange={(value) => setData(prev => prev ? {...prev, integrations: {...prev.integrations, emailProvider: value}} : prev)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SendGrid">SendGrid</SelectItem>
                  <SelectItem value="Mailgun">Mailgun</SelectItem>
                  <SelectItem value="AWS SES">AWS SES</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Transaction Limits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Transaction Limits</span>
            </CardTitle>
            <CardDescription>Set maximum transaction amounts and limits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dailyLimit">Daily Limit</Label>
                <Input
                  id="dailyLimit"
                  type="number"
                  value={data.limits.dailyTransactionLimit}
                  onChange={(e) => setData(prev => prev ? {...prev, limits: {...prev.limits, dailyTransactionLimit: Number(e.target.value)}} : prev)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthlyLimit">Monthly Limit</Label>
                <Input
                  id="monthlyLimit"
                  type="number"
                  value={data.limits.monthlyTransactionLimit}
                  onChange={(e) => setData(prev => prev ? {...prev, limits: {...prev.limits, monthlyTransactionLimit: Number(e.target.value)}} : prev)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxAirtime">Max Airtime Purchase</Label>
              <Input
                id="maxAirtime"
                type="number"
                value={data.limits.maxAirtimePurchase}
                onChange={(e) => setData(prev => prev ? {...prev, limits: {...prev.limits, maxAirtimePurchase: Number(e.target.value)}} : prev)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxData">Max Data Purchase</Label>
              <Input
                id="maxData"
                type="number"
                value={data.limits.maxDataPurchase}
                onChange={(e) => setData(prev => prev ? {...prev, limits: {...prev.limits, maxDataPurchase: Number(e.target.value)}} : prev)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Configuration Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Current Configuration</CardTitle>
          <CardDescription>Summary of current platform settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="font-medium mb-2">Platform Info</h4>
              <p className="text-sm text-muted-foreground">
                {data.platform.name} v{data.platform.version} ({data.platform.environment})
              </p>
              <Badge variant={data.platform.maintenanceMode ? "destructive" : "default"}>
                {data.platform.maintenanceMode ? "Maintenance" : "Live"}
              </Badge>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="font-medium mb-2">Security</h4>
              <p className="text-sm text-muted-foreground">
                KYC Required: {data.security.requireKycForWithdrawal ? "Yes" : "No"}
              </p>
              <p className="text-sm text-muted-foreground">
                Max Login Attempts: {data.security.maxLoginAttempts}
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="font-medium mb-2">Notifications</h4>
              <div className="flex gap-2">
                <Badge variant={data.notifications.emailNotifications ? "default" : "secondary"}>
                  Email
                </Badge>
                <Badge variant={data.notifications.smsNotifications ? "default" : "secondary"}>
                  SMS
                </Badge>
                <Badge variant={data.notifications.securityAlerts ? "default" : "secondary"}>
                  Security
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
