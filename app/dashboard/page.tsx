"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentActivity } from "@/components/recent-activity"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { getRoleDisplayName } from "@/lib/auth"

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="space-y-6">
      <DashboardHeader
        title={`Welcome back, ${user.name.split(" ")[0]}!`}
        description={`${getRoleDisplayName(user.role)} Dashboard - Manage your pharmacy operations efficiently`}
      />

      <div className="px-6 space-y-6">
        {/* Stats Overview */}
        <DashboardStats />

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Frequently used features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-2">
                <button className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors text-left">
                  <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center">🛒</div>
                  <div>
                    <p className="text-sm font-medium">New Sale</p>
                    <p className="text-xs text-muted-foreground">Process transaction</p>
                  </div>
                </button>

                <button className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors text-left">
                  <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center">👥</div>
                  <div>
                    <p className="text-sm font-medium">Add Member</p>
                    <p className="text-xs text-muted-foreground">Register new patient</p>
                  </div>
                </button>

                <button className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors text-left">
                  <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center">📦</div>
                  <div>
                    <p className="text-sm font-medium">Check Stock</p>
                    <p className="text-xs text-muted-foreground">View inventory levels</p>
                  </div>
                </button>

                {user.role !== "staff" && (
                  <button className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors text-left">
                    <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center">📊</div>
                    <div>
                      <p className="text-sm font-medium">View Reports</p>
                      <p className="text-xs text-muted-foreground">Sales & inventory reports</p>
                    </div>
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Current system health and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Database Connection</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success"></div>
                    <span className="text-sm text-success">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Stock Sync</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success"></div>
                    <span className="text-sm text-success">Real-time</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last Backup</span>
                  <span className="text-sm text-muted-foreground">2 hours ago</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Today's Summary</CardTitle>
              <CardDescription>Key metrics for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Transactions</span>
                  <span className="text-sm font-medium">47</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Revenue</span>
                  <span className="text-sm font-medium text-success">$2,847.50</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">New Members</span>
                  <span className="text-sm font-medium">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Prescriptions</span>
                  <span className="text-sm font-medium">12</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
