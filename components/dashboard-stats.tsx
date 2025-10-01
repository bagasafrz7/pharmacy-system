"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Package, Users, Receipt, AlertTriangle } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface StatCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: "increase" | "decrease"
  }
  icon: React.ComponentType<{ className?: string }>
  description?: string
}

function StatCard({ title, value, change, icon: Icon, description }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {change && (
          <div className="flex items-center gap-1 mt-1">
            {change.type === "increase" ? (
              <TrendingUp className="h-3 w-3 text-success" />
            ) : (
              <TrendingDown className="h-3 w-3 text-destructive" />
            )}
            <span className={`text-xs ${change.type === "increase" ? "text-success" : "text-destructive"}`}>
              {change.value}% from last month
            </span>
          </div>
        )}
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  )
}

export function DashboardStats() {
  const { user } = useAuth()

  // Mock data - in real app, this would come from API
  const stats = [
    {
      title: "Total Products",
      value: "1,247",
      change: { value: 12, type: "increase" as const },
      icon: Package,
      description: "Active inventory items",
    },
    {
      title: "Today's Sales",
      value: "$2,847",
      change: { value: 8, type: "increase" as const },
      icon: Receipt,
      description: "Revenue from transactions",
    },
    {
      title: "Active Members",
      value: "892",
      change: { value: 3, type: "increase" as const },
      icon: Users,
      description: "Registered patients",
    },
    {
      title: "Low Stock Items",
      value: "23",
      change: { value: 15, type: "decrease" as const },
      icon: AlertTriangle,
      description: "Items below minimum stock",
    },
  ]

  // Filter stats based on user role
  const filteredStats = stats.filter((stat) => {
    if (user?.role === "staff") {
      // Staff can see sales and members, but not detailed inventory
      return ["Today's Sales", "Active Members"].includes(stat.title)
    }
    return true
  })

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {filteredStats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  )
}
