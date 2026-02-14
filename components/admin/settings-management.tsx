"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Settings, DollarSign, Shield, Bell, Database, Save, RefreshCw, Server, Lock, CreditCard, Activity, Globe, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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
  const { toast } = useToast()

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
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-8 bg-slate-100 rounded w-1/2" />
                  <div className="h-3 bg-slate-100 rounded w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return <div className="p-4 text-red-600 bg-red-50 rounded-lg border border-red-100">Access denied: Admins only.</div>;
  }

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/settings")
      if (response.ok) {
        const data = await response.json()
        setData(data)
      } else {
        // Mock data
        // setData({...})
        console.error("Failed to fetch settings: API returned error")
        toast({
          title: "Error",
          description: "Failed to fetch settings",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error)
      toast({
        title: "Error",
        description: "Failed to fetch settings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const saveSettings = async () => {
    setIsSaving(true)
    try {
      // In a real app, you would send the data to the API
      // const response = await fetch("/api/admin/settings", {
      //   method: "PUT",
      //   body: JSON.stringify(data),
      // })

      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Success",
        description: "Settings saved successfully!",
      })
    } catch (error) {
      console.error("Failed to save settings:", error)
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-slate-500">Loading configuration...</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-8 bg-slate-100 rounded w-1/2" />
                  <div className="h-3 bg-slate-100 rounded w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-10 bg-slate-50/80 backdrop-blur-sm py-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">System Settings</h1>
          <p className="text-slate-500 text-sm">Configure platform parameters and preferences.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchSettings} className="bg-white border-slate-200 text-slate-600 hover:text-blue-600">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={saveSettings} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200">
            {isSaving ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-white p-1 mb-6 rounded-lg w-full sm:w-auto border border-slate-200 grid grid-cols-3 sm:flex sm:flex-wrap h-auto">
          <TabsTrigger value="general" className="rounded-md data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">General</TabsTrigger>
          <TabsTrigger value="fees" className="rounded-md data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Fees & Limits</TabsTrigger>
          <TabsTrigger value="security" className="rounded-md data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Security</TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-md data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Notifications</TabsTrigger>
          <TabsTrigger value="integrations" className="rounded-md data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-0">
          <Card className="border-0 shadow-md shadow-slate-200/50">
            <CardHeader className="border-b border-slate-50 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
                <Globe className="h-5 w-5 text-blue-600" />
                Platform Configuration
              </CardTitle>
              <CardDescription>Basic system information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="platformName">Platform Name</Label>
                  <Input
                    id="platformName"
                    value={data.platform.name}
                    onChange={(e) => setData(prev => prev ? { ...prev, platform: { ...prev.platform, name: e.target.value } } : prev)}
                    className="bg-slate-50 border-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="platformDescription">Description</Label>
                  <Input
                    id="platformDescription"
                    value={data.platform.description}
                    onChange={(e) => setData(prev => prev ? { ...prev, platform: { ...prev.platform, description: e.target.value } } : prev)}
                    className="bg-slate-50 border-slate-200"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="environment">Environment</Label>
                  <Select
                    value={data.platform.environment}
                    onValueChange={(value) => setData(prev => prev ? { ...prev, platform: { ...prev.platform, environment: value } } : prev)}
                  >
                    <SelectTrigger className="bg-slate-50 border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="staging">Staging</SelectItem>
                      <SelectItem value="production">Production</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <div>
                    <Label htmlFor="maintenanceMode" className="text-base">Maintenance Mode</Label>
                    <p className="text-sm text-slate-500">Disable user access temporarily</p>
                  </div>
                  <Switch
                    id="maintenanceMode"
                    checked={data.platform.maintenanceMode}
                    onCheckedChange={(checked) => setData(prev => prev ? { ...prev, platform: { ...prev.platform, maintenanceMode: checked } } : prev)}
                  />
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 text-blue-800 text-sm">
                <div className="font-semibold mb-1">Current Version</div>
                <div>v{data.platform.version}</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fees" className="mt-0 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-md shadow-slate-200/50">
              <CardHeader className="border-b border-slate-50 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Fee Configuration
                </CardTitle>
                <CardDescription>Transaction fees and charges</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="withdrawalFee">Withdrawal Fee (₦)</Label>
                    <Input
                      id="withdrawalFee"
                      type="number"
                      value={data.fees.withdrawalFee}
                      onChange={(e) => setData(prev => prev ? { ...prev, fees: { ...prev.fees, withdrawalFee: Number(e.target.value) } } : prev)}
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minimumWithdrawal">Min Withdrawal (₦)</Label>
                    <Input
                      id="minimumWithdrawal"
                      type="number"
                      value={data.fees.minimumWithdrawal}
                      onChange={(e) => setData(prev => prev ? { ...prev, fees: { ...prev.fees, minimumWithdrawal: Number(e.target.value) } } : prev)}
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Label className="mb-4 block text-base font-semibold text-slate-700">Referral Bonuses (₦)</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="referralBonus1" className="text-xs text-slate-500">Level 1</Label>
                      <Input
                        id="referralBonus1"
                        type="number"
                        value={data.fees.referralBonusLevel1}
                        onChange={(e) => setData(prev => prev ? { ...prev, fees: { ...prev.fees, referralBonusLevel1: Number(e.target.value) } } : prev)}
                        className="bg-slate-50 border-slate-200 h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="referralBonus2" className="text-xs text-slate-500">Level 2</Label>
                      <Input
                        id="referralBonus2"
                        type="number"
                        value={data.fees.referralBonusLevel2}
                        onChange={(e) => setData(prev => prev ? { ...prev, fees: { ...prev.fees, referralBonusLevel2: Number(e.target.value) } } : prev)}
                        className="bg-slate-50 border-slate-200 h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="referralBonus3" className="text-xs text-slate-500">Level 3</Label>
                      <Input
                        id="referralBonus3"
                        type="number"
                        value={data.fees.referralBonusLevel3}
                        onChange={(e) => setData(prev => prev ? { ...prev, fees: { ...prev.fees, referralBonusLevel3: Number(e.target.value) } } : prev)}
                        className="bg-slate-50 border-slate-200 h-8 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md shadow-slate-200/50">
              <CardHeader className="border-b border-slate-50 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
                  <Activity className="h-5 w-5 text-amber-600" />
                  Transaction Limits
                </CardTitle>
                <CardDescription>Maximum allowable amounts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="dailyLimit">Daily Transaction Limit (₦)</Label>
                  <Input
                    id="dailyLimit"
                    type="number"
                    value={data.limits.dailyTransactionLimit}
                    onChange={(e) => setData(prev => prev ? { ...prev, limits: { ...prev.limits, dailyTransactionLimit: Number(e.target.value) } } : prev)}
                    className="bg-slate-50 border-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyLimit">Monthly Transaction Limit (₦)</Label>
                  <Input
                    id="monthlyLimit"
                    type="number"
                    value={data.limits.monthlyTransactionLimit}
                    onChange={(e) => setData(prev => prev ? { ...prev, limits: { ...prev.limits, monthlyTransactionLimit: Number(e.target.value) } } : prev)}
                    className="bg-slate-50 border-slate-200"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxAirtime">Max Airtime (₦)</Label>
                    <Input
                      id="maxAirtime"
                      type="number"
                      value={data.limits.maxAirtimePurchase}
                      onChange={(e) => setData(prev => prev ? { ...prev, limits: { ...prev.limits, maxAirtimePurchase: Number(e.target.value) } } : prev)}
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxData">Max Data (₦)</Label>
                    <Input
                      id="maxData"
                      type="number"
                      value={data.limits.maxDataPurchase}
                      onChange={(e) => setData(prev => prev ? { ...prev, limits: { ...prev.limits, maxDataPurchase: Number(e.target.value) } } : prev)}
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="mt-0">
          <Card className="border-0 shadow-md shadow-slate-200/50">
            <CardHeader className="border-b border-slate-50 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
                <Shield className="h-5 w-5 text-purple-600" />
                Security Settings
              </CardTitle>
              <CardDescription>Access control and verification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div className="space-y-0.5">
                  <Label htmlFor="requireKyc" className="text-base">Require KYC for Withdrawals</Label>
                  <p className="text-sm text-slate-500">Users must complete identity verification</p>
                </div>
                <Switch
                  id="requireKyc"
                  checked={data.security.requireKycForWithdrawal}
                  onCheckedChange={(checked) => setData(prev => prev ? { ...prev, security: { ...prev.security, requireKycForWithdrawal: checked } } : prev)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div className="space-y-0.5">
                  <Label htmlFor="2fa" className="text-base">Two-Factor Authentication</Label>
                  <p className="text-sm text-slate-500">Enforce 2FA for all admin accounts</p>
                </div>
                <Switch
                  id="2fa"
                  checked={data.security.twoFactorRequired}
                  onCheckedChange={(checked) => setData(prev => prev ? { ...prev, security: { ...prev.security, twoFactorRequired: checked } } : prev)}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={data.security.maxLoginAttempts}
                    onChange={(e) => setData(prev => prev ? { ...prev, security: { ...prev.security, maxLoginAttempts: Number(e.target.value) } } : prev)}
                    className="bg-slate-50 border-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={data.security.sessionTimeout}
                    onChange={(e) => setData(prev => prev ? { ...prev, security: { ...prev.security, sessionTimeout: Number(e.target.value) } } : prev)}
                    className="bg-slate-50 border-slate-200"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-0">
          <Card className="border-0 shadow-md shadow-slate-200/50">
            <CardHeader className="border-b border-slate-50 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
                <Bell className="h-5 w-5 text-red-600" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Manage automated alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full text-blue-600"><Mail className="w-4 h-4" /></div>
                  <div>
                    <Label htmlFor="emailNotifications" className="text-base cursor-pointer">Email Notifications</Label>
                    <p className="text-sm text-slate-500">System updates and reports via email</p>
                  </div>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={data.notifications.emailNotifications}
                  onCheckedChange={(checked) => setData(prev => prev ? { ...prev, notifications: { ...prev.notifications, emailNotifications: checked } } : prev)}
                />
              </div>

              <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full text-green-600"><Settings className="w-4 h-4" /></div>
                  <div>
                    <Label htmlFor="smsNotifications" className="text-base cursor-pointer">SMS Notifications</Label>
                    <p className="text-sm text-slate-500">Critical transactional alerts via SMS</p>
                  </div>
                </div>
                <Switch
                  id="smsNotifications"
                  checked={data.notifications.smsNotifications}
                  onCheckedChange={(checked) => setData(prev => prev ? { ...prev, notifications: { ...prev.notifications, smsNotifications: checked } } : prev)}
                />
              </div>

              <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 p-2 rounded-full text-red-600"><Lock className="w-4 h-4" /></div>
                  <div>
                    <Label htmlFor="securityAlerts" className="text-base cursor-pointer">Security Alerts</Label>
                    <p className="text-sm text-slate-500">Login notifications and suspicious activity</p>
                  </div>
                </div>
                <Switch
                  id="securityAlerts"
                  checked={data.notifications.securityAlerts}
                  onCheckedChange={(checked) => setData(prev => prev ? { ...prev, notifications: { ...prev.notifications, securityAlerts: checked } } : prev)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="mt-0">
          <Card className="border-0 shadow-md shadow-slate-200/50">
            <CardHeader className="border-b border-slate-50 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
                <Database className="h-5 w-5 text-slate-600" />
                Third-Party Integrations
              </CardTitle>
              <CardDescription>Connect external services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label htmlFor="paymentProviders">Payment Gateways</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {data.integrations.paymentProviders.map(p => (
                    <Badge key={p} variant="secondary" className="px-3 py-1 bg-blue-50 text-blue-700 border-blue-100">{p}</Badge>
                  ))}
                </div>
                <Input
                  id="paymentProviders"
                  value={data.integrations.paymentProviders.join(", ")}
                  onChange={(e) => setData(prev => prev ? { ...prev, integrations: { ...prev.integrations, paymentProviders: e.target.value.split(", ") } } : prev)}
                  placeholder="e.g. Paystack, Flutterwave"
                  className="bg-slate-50 border-slate-200"
                />
                <p className="text-xs text-slate-500">Comma separated list of enabled providers</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="smsProvider">SMS Provider</Label>
                  <Select
                    value={data.integrations.smsProvider}
                    onValueChange={(value) => setData(prev => prev ? { ...prev, integrations: { ...prev.integrations, smsProvider: value } } : prev)}
                  >
                    <SelectTrigger className="bg-slate-50 border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Termii">Termii</SelectItem>
                      <SelectItem value="Twilio">Twilio</SelectItem>
                      <SelectItem value="BulkSMS">BulkSMS</SelectItem>
                      <SelectItem value="Infobip">Infobip</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailProvider">Email Provider</Label>
                  <Select
                    value={data.integrations.emailProvider}
                    onValueChange={(value) => setData(prev => prev ? { ...prev, integrations: { ...prev.integrations, emailProvider: value } } : prev)}
                  >
                    <SelectTrigger className="bg-slate-50 border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SendGrid">SendGrid</SelectItem>
                      <SelectItem value="Mailgun">Mailgun</SelectItem>
                      <SelectItem value="AWS SES">AWS SES</SelectItem>
                      <SelectItem value="Postmark">Postmark</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
