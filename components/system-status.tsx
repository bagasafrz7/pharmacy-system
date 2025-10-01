"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, XCircle, Clock } from "lucide-react"

interface SystemStatusProps {
  className?: string
}

export function SystemStatus({ className }: SystemStatusProps) {
  const systemChecks = [
    { name: "Database Connection", status: "healthy", message: "All connections active" },
    { name: "Inventory Sync", status: "healthy", message: "Real-time updates working" },
    { name: "Payment Gateway", status: "healthy", message: "All payment methods available" },
    { name: "Backup System", status: "warning", message: "Last backup: 2 hours ago" },
    { name: "Stock Alerts", status: "healthy", message: "15 low stock items detected" },
    { name: "User Sessions", status: "healthy", message: "12 active users" },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      healthy: "default",
      warning: "secondary",
      error: "destructive",
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || "outline"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>System Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {systemChecks.map((check, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(check.status)}
                <div>
                  <div className="font-medium">{check.name}</div>
                  <div className="text-sm text-muted-foreground">{check.message}</div>
                </div>
              </div>
              {getStatusBadge(check.status)}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
