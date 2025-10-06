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
  // Terjemahan internal StatCard
  const changeText = change?.type === "increase" ? "peningkatan" : "penurunan";

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
              {change.value}% dari bulan lalu {/* ... from last month */}
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

  // Data mock - dalam aplikasi nyata, ini akan datang dari API
  // Terjemahkan semua label yang terlihat pengguna
  const stats = [
    {
      title: "Total Produk", // Total Products
      value: "1,247",
      change: { value: 12, type: "increase" as const },
      icon: Package,
      description: "Item inventaris aktif", // Active inventory items
    },
    {
      title: "Penjualan Hari Ini", // Today's Sales
      value: "$2,847",
      change: { value: 8, type: "increase" as const },
      icon: Receipt,
      description: "Pendapatan dari transaksi", // Revenue from transactions
    },
    {
      title: "Anggota Aktif", // Active Members
      value: "892",
      change: { value: 3, type: "increase" as const },
      icon: Users,
      description: "Pasien terdaftar", // Registered patients
    },
    {
      title: "Stok Barang Rendah", // Low Stock Items
      value: "23",
      change: { value: 15, type: "decrease" as const },
      icon: AlertTriangle,
      description: "Item di bawah stok minimum", // Items below minimum stock
    },
  ]

  // Filter statistik berdasarkan peran pengguna
  const filteredStats = stats.filter((stat) => {
    if (user?.role === "staff") {
      // Staf dapat melihat penjualan dan anggota, tetapi tidak inventaris terperinci
      return ["Penjualan Hari Ini", "Anggota Aktif"].includes(stat.title)
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
