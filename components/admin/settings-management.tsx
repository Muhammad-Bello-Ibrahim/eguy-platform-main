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
            <Card key={i} className="border border-slate-200 dark:border-slate-800/30 bg-white dark:bg-card-dark shadow-sm dark:shadow-none">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4" />
                  <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
                  <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-full" />
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
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
            <p className="text-slate-500 dark:text-slate-400">Loading configuration...</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="border border-slate-200 dark:border-slate-800/30 bg-white dark:bg-card-dark shadow-sm dark:shadow-none">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4" />
                  <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
                  <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-full" />
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-10 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md py-2 border-b border-transparent dark:border-slate-800/30 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">System Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Configure platform parameters and preferences.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchSettings} className="bg-white dark:bg-card-dark border-slate-200 dark:border-slate-800/50 text-slate-600 dark:text-slate-300 hover:text-primary">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={saveSettings} disabled={isSaving} className="bg-primary hover:bg-primary/90 text-background-dark shadow-md shadow-primary/20 border-none font-medium">
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
        <TabsList className="bg-white dark:bg-neutral-dark/30 p-1 mb-6 rounded-lg w-full sm:w-auto border border-slate-200 dark:border-slate-800/50 grid grid-cols-3 sm:flex sm:flex-wrap h-auto">
          <TabsTrigger value="general" className="rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary dark:text-slate-400">General</TabsTrigger>
          <TabsTrigger value="fees" className="rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary dark:text-slate-400">Fees & Limits</TabsTrigger>
          <TabsTrigger value="security" className="rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary dark:text-slate-400">Security</TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary dark:text-slate-400">Notifications</TabsTrigger>
          <TabsTrigger value="integrations" className="rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary dark:text-slate-400">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-0">
          <Card className="border border-slate-200 dark:border-slate-800/30 bg-white dark:bg-card-dark shadow-sm dark:shadow-none">
            <CardHeader className="border-b border-slate-50 dark:border-slate-800/50 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg text-slate-800 dark:text-white">
                <Globe className="h-5 w-5 text-primary" />
                Platform Configuration
              </CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400">Basic system information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="platformName" className="text-slate-700 dark:text-slate-300">Platform Name</Label>
                  <Input
                    id="platformName"
                    value={data.platform.name}
                    onChange={(e) => setData(prev => prev ? { ...prev, platform: { ...prev.platform, name: e.target.value } } : prev)}
                    className="bg-slate-50 dark:bg-neutral-dark/50 border-slate-200 dark:border-slate-800/50 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="platformDescription" className="text-slate-700 dark:text-slate-300">Description</Label>
                  <Input
                    id="platformDescription"
                    value={data.platform.description}
                    onChange={(e) => setData(prev => prev ? { ...prev, platform: { ...prev.platform, description: e.target.value } } : prev)}
                    className="bg-slate-50 dark:bg-neutral-dark/50 border-slate-200 dark:border-slate-800/50 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="environment" className="text-slate-700 dark:text-slate-300">Environment</Label>
                  <Select
                    value={data.platform.environment}
                    onValueChange={(value) => setData(prev => prev ? { ...prev, platform: { ...prev.platform, environment: value } } : prev)}
                  >
                    <SelectTrigger className="bg-slate-50 dark:bg-neutral-dark/50 border-slate-200 dark:border-slate-800/50 text-slate-900 dark:text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-card-dark border-slate-200 dark:border-slate-800/50">
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="staging">Staging</SelectItem>
                      <SelectItem value="production">Production</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-neutral-dark/30 rounded-lg border border-slate-100 dark:border-slate-800/50">
                  <div>
                    <Label htmlFor="maintenanceMode" className="text-base text-slate-700 dark:text-slate-300">Maintenance Mode</Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Disable user access temporarily</p>
                  </div>
                  <Switch
                    id="maintenanceMode"
                    checked={data.platform.maintenanceMode}
                    onCheckedChange={(checked) => setData(prev => prev ? { ...prev, platform: { ...prev.platform, maintenanceMode: checked } } : prev)}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              </div>

              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 text-primary text-sm">
                <div className="font-semibold mb-1">Current Version</div>
                <div>v{data.platform.version}</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fees" className="mt-0 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border border-slate-200 dark:border-slate-800/30 bg-white dark:bg-card-dark shadow-sm dark:shadow-none">
              <CardHeader className="border-b border-slate-50 dark:border-slate-800/50 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg text-slate-800 dark:text-white">
                  <DollarSign className="h-5 w-5 text-emerald-450" />
                  Fee Configuration
                </CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400">Transaction fees and charges</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="withdrawalFee" className="text-slate-700 dark:text-slate-300">Withdrawal Fee (₦)</Label>
                    <Input
                      id="withdrawalFee"
                      type="number"
                      value={data.fees.withdrawalFee}
                      onChange={(e) => setData(prev => prev ? { ...prev, fees: { ...prev.fees, withdrawalFee: Number(e.target.value) } } : prev)}
                      className="bg-slate-50 dark:bg-neutral-dark/50 border-slate-200 dark:border-slate-800/50 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minimumWithdrawal" className="text-slate-700 dark:text-slate-300">Min Withdrawal (₦)</Label>
                    <Input
                      id="minimumWithdrawal"
                      type="number"
                      value={data.fees.minimumWithdrawal}
                      onChange={(e) => setData(prev => prev ? { ...prev, fees: { ...prev.fees, minimumWithdrawal: Number(e.target.value) } } : prev)}
                      className="bg-slate-50 dark:bg-neutral-dark/50 border-slate-200 dark:border-slate-800/50 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/50">
                  <Label className="mb-4 block text-base font-semibold text-slate-700 dark:text-slate-300">Referral Bonuses (₦)</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="referralBonus1" className="text-xs text-slate-500 dark:text-slate-400">Level 1</Label>
                      <Input
                        id="referralBonus1"
                        type="number"
                        value={data.fees.referralBonusLevel1}
                        onChange={(e) => setData(prev => prev ? { ...prev, fees: { ...prev.fees, referralBonusLevel1: Number(e.target.value) } } : prev)}
                        className="bg-slate-50 dark:bg-neutral-dark/50 border-slate-200 dark:border-slate-800/50 text-slate-900 dark:text-white h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="referralBonus2" className="text-xs text-slate-500 dark:text-slate-400">Level 2</Label>
                      <Input
                        id="referralBonus2"
                        type="number"
                        value={data.fees.referralBonusLevel2}
                        onChange={(e) => setData(prev => prev ? { ...prev, fees: { ...prev.fees, referralBonusLevel2: Number(e.target.value) } } : prev)}
                        className="bg-slate-50 dark:bg-neutral-dark/50 border-slate-200 dark:border-slate-800/50 text-slate-900 dark:text-white h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="referralBonus3" className="text-xs text-slate-500 dark:text-slate-400">Level 3</Label>
                      <Input
                        id="referralBonus3"
                        type="number"
                        value={data.fees.referralBonusLevel3}
                        onChange={(e) => setData(prev => prev ? { ...prev, fees: { ...prev.fees, referralBonusLevel3: Number(e.target.value) } } : prev)}
                        className="bg-slate-50 dark:bg-neutral-dark/50 border-slate-200 dark:border-slate-800/50 text-slate-900 dark:text-white h-8 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800/30 bg-white dark:bg-card-dark shadow-sm dark:shadow-none">
              <CardHeader className="border-b border-slate-50 dark:border-slate-800/50 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg text-slate-800 dark:text-white">
                  <Activity className="h-5 w-5 text-amber-500" />
                  Transaction Limits
                </CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400">Maximum allowable amounts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="dailyLimit" className="text-slate-700 dark:text-slate-300">Daily Transaction Limit (₦)</Label>
                  <Input
                    id="dailyLimit"
                    type="number"
                    value={data.limits.dailyTransactionLimit}
                    onChange={(e) => setData(prev => prev ? { ...prev, limits: { ...prev.limits, dailyTransactionLimit: Number(e.target.value) } } : prev)}
                    className="bg-slate-50 dark:bg-neutral-dark/50 border-slate-200 dark:border-slate-800/50 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyLimit" className="text-slate-700 dark:text-slate-300">Monthly Transaction Limit (₦)</Label>
                  <Input
                    id="monthlyLimit"
                    type="number"
                    value={data.limits.monthlyTransactionLimit}
                    onChange={(e) => setData(prev => prev ? { ...prev, limits: { ...prev.limits, monthlyTransactionLimit: Number(e.target.value) } } : prev)}
                    className="bg-slate-50 dark:bg-neutral-dark/50 border-slate-200 dark:border-slate-800/50 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxAirtime" className="text-slate-700 dark:text-slate-300">Max Airtime (₦)</Label>
                    <Input
                      id="maxAirtime"
                      type="number"
                      value={data.limits.maxAirtimePurchase}
                      onChange={(e) => setData(prev => prev ? { ...prev, limits: { ...prev.limits, maxAirtimePurchase: Number(e.target.value) } } : prev)}
                      className="bg-slate-50 dark:bg-neutral-dark/50 border-slate-200 dark:border-slate-800/50 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxData" className="text-slate-700 dark:text-slate-300">Max Data (₦)</Label>
                    <Input
                      id="maxData"
                      type="number"
                      value={data.limits.maxDataPurchase}
                      onChange={(e) => setData(prev => prev ? { ...prev, limits: { ...prev.limits, maxDataPurchase: Number(e.target.value) } } : prev)}
                      className="bg-slate-50 dark:bg-neutral-dark/50 border-slate-200 dark:border-slate-800/50 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="mt-0">
          <Card className="border border-slate-200 dark:border-slate-800/30 bg-white dark:bg-card-dark shadow-sm dark:shadow-none">
            <CardHeader className="border-b border-slate-50 dark:border-slate-800/50 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg text-slate-800 dark:text-white">
                <Shield className="h-5 w-5 text-purple-500" />
                Security Settings
              </CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400">Access control and verification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-neutral-dark/30 rounded-lg border border-slate-100 dark:border-slate-800/50">
                <div className="space-y-0.5">
                  <Label htmlFor="requireKyc" className="text-base text-slate-700 dark:text-slate-300">Require KYC for Withdrawals</Label>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Users must complete identity verification</p>
                </div>
                <Switch
                  id="requireKyc"
                  checked={data.security.requireKycForWithdrawal}
                  onCheckedChange={(checked) => setData(prev => prev ? { ...prev, security: { ...prev.security, requireKycForWithdrawal: checked } } : prev)}
                  className="data-[state=checked]:bg-primary"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-neutral-dark/30 rounded-lg border border-slate-100 dark:border-slate-800/50">
                <div className="space-y-0.5">
                  <Label htmlFor="2fa" className="text-base text-slate-700 dark:text-slate-300">Two-Factor Authentication</Label>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Enforce 2FA for all admin accounts</p>
                </div>
                <Switch
                  id="2fa"
                  checked={data.security.twoFactorRequired}
                  onCheckedChange={(checked) => setData(prev => prev ? { ...prev, security: { ...prev.security, twoFactorRequired: checked } } : prev)}
                  className="data-[state=checked]:bg-primary"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts" className="text-slate-700 dark:text-slate-300">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={data.security.maxLoginAttempts}
                    onChange={(e) => setData(prev => prev ? { ...prev, security: { ...prev.security, maxLoginAttempts: Number(e.target.value) } } : prev)}
                    className="bg-slate-50 dark:bg-neutral-dark/50 border-slate-200 dark:border-slate-800/50 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout" className="text-slate-700 dark:text-slate-300">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={data.security.sessionTimeout}
                    onChange={(e) => setData(prev => prev ? { ...prev, security: { ...prev.security, sessionTimeout: Number(e.target.value) } } : prev)}
                    className="bg-slate-50 dark:bg-neutral-dark/50 border-slate-200 dark:border-slate-800/50 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-0">
          <Card className="border border-slate-200 dark:border-slate-800/30 bg-white dark:bg-card-dark shadow-sm dark:shadow-none">
            <CardHeader className="border-b border-slate-50 dark:border-slate-800/50 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg text-slate-800 dark:text-white">
                <Bell className="h-5 w-5 text-primary" />
                Notification Preferences
              </CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400">Manage automated alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-neutral-dark/30 rounded-lg transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full text-primary border border-primary/20"><Mail className="w-4 h-4" /></div>
                  <div>
                    <Label htmlFor="emailNotifications" className="text-base cursor-pointer text-slate-700 dark:text-slate-300">Email Notifications</Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">System updates and reports via email</p>
                  </div>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={data.notifications.emailNotifications}
                  onCheckedChange={(checked) => setData(prev => prev ? { ...prev, notifications: { ...prev.notifications, emailNotifications: checked } } : prev)}
                  className="data-[state=checked]:bg-primary"
                />
              </div>

              <div className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-neutral-dark/30 rounded-lg transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-500/10 p-2 rounded-full text-emerald-450 border border-emerald-500/20"><Settings className="w-4 h-4" /></div>
                  <div>
                    <Label htmlFor="smsNotifications" className="text-base cursor-pointer text-slate-700 dark:text-slate-300">SMS Notifications</Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Critical transactional alerts via SMS</p>
                  </div>
                </div>
                <Switch
                  id="smsNotifications"
                  checked={data.notifications.smsNotifications}
                  onCheckedChange={(checked) => setData(prev => prev ? { ...prev, notifications: { ...prev.notifications, smsNotifications: checked } } : prev)}
                  className="data-[state=checked]:bg-primary"
                />
              </div>

              <div className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-neutral-dark/30 rounded-lg transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="bg-red-500/10 p-2 rounded-full text-red-400 border border-red-500/20"><Lock className="w-4 h-4" /></div>
                  <div>
                    <Label htmlFor="securityAlerts" className="text-base cursor-pointer text-slate-700 dark:text-slate-300">Security Alerts</Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Login notifications and suspicious activity</p>
                  </div>
                </div>
                <Switch
                  id="securityAlerts"
                  checked={data.notifications.securityAlerts}
                  onCheckedChange={(checked) => setData(prev => prev ? { ...prev, notifications: { ...prev.notifications, securityAlerts: checked } } : prev)}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="mt-0">
          <Card className="border border-slate-200 dark:border-slate-800/30 bg-white dark:bg-card-dark shadow-sm dark:shadow-none">
            <CardHeader className="border-b border-slate-50 dark:border-slate-800/50 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg text-slate-800 dark:text-white">
                <Database className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                Third-Party Integrations
              </CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400">Connect external services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label htmlFor="paymentProviders" className="text-slate-700 dark:text-slate-300">Payment Gateways</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {data.integrations.paymentProviders.map(p => (
                    <Badge key={p} variant="secondary" className="px-3 py-1 bg-primary/10 text-primary border border-primary/20">{p}</Badge>
                  ))}
                </div>
                <Input
                  id="paymentProviders"
                  value={data.integrations.paymentProviders.join(", ")}
                  onChange={(e) => setData(prev => prev ? { ...prev, integrations: { ...prev.integrations, paymentProviders: e.target.value.split(", ") } } : prev)}
                  placeholder="e.g. Paystack, Flutterwave"
                  className="bg-slate-50 dark:bg-neutral-dark/50 border-slate-200 dark:border-slate-800/50 text-slate-900 dark:text-white"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">Comma separated list of enabled providers</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="smsProvider" className="text-slate-700 dark:text-slate-300">SMS Provider</Label>
                  <Select
                    value={data.integrations.smsProvider}
                    onValueChange={(value) => setData(prev => prev ? { ...prev, integrations: { ...prev.integrations, smsProvider: value } } : prev)}
                  >
                    <SelectTrigger className="bg-slate-50 dark:bg-neutral-dark/50 border-slate-200 dark:border-slate-800/50 text-slate-900 dark:text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-card-dark border-slate-200 dark:border-slate-800/50">
                      <SelectItem value="Termii">Termii</SelectItem>
                      <SelectItem value="Twilio">Twilio</SelectItem>
                      <SelectItem value="BulkSMS">BulkSMS</SelectItem>
                      <SelectItem value="Infobip">Infobip</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailProvider" className="text-slate-700 dark:text-slate-300">Email Provider</Label>
                  <Select
                    value={data.integrations.emailProvider}
                    onValueChange={(value) => setData(prev => prev ? { ...prev, integrations: { ...prev.integrations, emailProvider: value } } : prev)}
                  >
                    <SelectTrigger className="bg-slate-50 dark:bg-neutral-dark/50 border-slate-200 dark:border-slate-800/50 text-slate-900 dark:text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-card-dark border-slate-200 dark:border-slate-800/50">
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
