"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
// Import locale Indonesia untuk format waktu
import { id } from "date-fns/locale"

interface Activity {
  id: string
  type: "sale" | "pre_order" | "prescription" | "stock_update"
  title: string
  description: string
  user: {
    name: string
    avatar?: string
  }
  timestamp: Date
  amount?: number
  status?: "completed" | "pending" | "cancelled"
}

// Fungsi pembantu untuk menerjemahkan tipe aktivitas
function translateActivityTitle(type: Activity["type"]) {
  switch (type) {
    case "sale":
      return "Transaksi Penjualan"
    case "pre_order":
      return "Pra-pesanan Dibuat"
    case "prescription":
      return "Resep Digital"
    case "stock_update":
      return "Stok Diperbarui"
    default:
      return "Aktivitas"
  }
}

// Fungsi pembantu untuk menerjemahkan status
function translateStatus(status: Activity["status"]) {
  switch (status) {
    case "completed":
      return "Selesai"
    case "pending":
      return "Tertunda"
    case "cancelled":
      return "Dibatalkan"
    default:
      return "Tidak Diketahui"
  }
}

const mockActivities: Activity[] = [
  {
    id: "1",
    type: "sale",
    title: translateActivityTitle("sale"),
    description: "Paracetamol 500mg x2, Vitamin D3 x1",
    user: { name: "Emma Rodriguez" },
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    amount: 45.98,
    status: "completed",
  },
  {
    id: "2",
    type: "pre_order",
    title: translateActivityTitle("pre_order"),
    description: "Amoxicillin 250mg - Resep diperlukan", // Terjemahkan deskripsi
    user: { name: "John Smith" },
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    status: "pending",
  },
  {
    id: "3",
    type: "prescription",
    title: translateActivityTitle("prescription"),
    description: "Resep ditinjau dan disetujui untuk pasien", // Terjemahkan deskripsi
    user: { name: "Dr. Michael Chen" },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    status: "completed",
  },
  {
    id: "4",
    type: "stock_update",
    title: translateActivityTitle("stock_update"),
    description: "Menerima kiriman baru - 50 item ditambahkan", // Terjemahkan deskripsi
    user: { name: "Dr. Sarah Johnson" },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    status: "completed",
  },
]

function getActivityIcon(type: Activity["type"]) {
  switch (type) {
    case "sale":
      return "💰"
    case "pre_order":
      return "📋"
    case "prescription":
      return "🩺"
    case "stock_update":
      return "📦"
    default:
      return "📄"
  }
}

function getStatusColor(status: Activity["status"]) {
  switch (status) {
    case "completed":
      return "bg-success/10 text-success"
    case "pending":
      return "bg-warning/10 text-warning"
    case "cancelled":
      return "bg-destructive/10 text-destructive"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Aktivitas Terbaru</CardTitle> {/* Recent Activity */}
        <CardDescription>Transaksi dan pembaruan sistem terkini</CardDescription> {/* Latest transactions and system updates */}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockActivities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">{activity.title}</p>
                  {activity.status && (
                    <Badge variant="secondary" className={getStatusColor(activity.status)}>
                      {/* Terjemahkan status */}
                      {translateStatus(activity.status)}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{activity.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-4 w-4">
                      <AvatarImage src={activity.user.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">
                        {activity.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">{activity.user.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {activity.amount && <span className="text-xs font-medium text-success">${activity.amount}</span>}
                    <span className="text-xs text-muted-foreground">
                      {/* Format jarak waktu dengan locale Indonesia */}
                      {formatDistanceToNow(activity.timestamp, { addSuffix: true, locale: id })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
