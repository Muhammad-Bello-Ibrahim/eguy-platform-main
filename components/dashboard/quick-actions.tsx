"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Smartphone, Zap, GraduationCap, Users, CreditCard, Wifi } from "lucide-react"
import Link from "next/link"

interface QuickActionsProps {
  onAirtimeClick: () => void
  onDataClick: () => void
  onBillsClick: () => void
}

export function QuickActions({ onAirtimeClick, onDataClick, onBillsClick }: QuickActionsProps) {
  const actions = [
    {
      title: "Buy Airtime",
      description: "Top up your phone",
      icon: Smartphone,
      onClick: onAirtimeClick,
      color: "text-blue-600",
    },
    {
      title: "Data Bundle",
      description: "Internet packages",
      icon: Wifi,
      onClick: onDataClick,
      color: "text-purple-600",
    },
    {
      title: "Pay Bills",
      description: "Electricity, Water, TV",
      icon: Zap,
      onClick: onBillsClick,
      color: "text-orange-600",
    },
    {
      title: "Education",
      description: "WAEC, JAMB, NECO",
      icon: GraduationCap,
      onClick: () => onBillsClick(),
      color: "text-green-600",
    },
    {
      title: "More Services",
      description: "View all options",
      icon: CreditCard,
      onClick: () => {},
      color: "text-gray-600",
    },
  ]

  return (
    <Card className="bg-white/60 backdrop-blur-lg shadow-xl border border-white/30 rounded-2xl p-4">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-primary">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {actions.map((action, index) => {
            const ButtonComponent = (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-5 flex flex-col items-center gap-2 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl shadow-md hover:scale-105 transition-transform"
                onClick={action.onClick}
                aria-label={action.title}
              >
                <action.icon className={`h-7 w-7 ${action.color} drop-shadow`} />
                <div className="text-center">
                  <div className="font-semibold text-base text-primary mb-1">{action.title}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
              </Button>
            )

            return ButtonComponent
          })}
        </div>
      </CardContent>
    </Card>
  )
}
