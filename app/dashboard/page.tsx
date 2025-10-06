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
        // Terjemahkan Judul dan Deskripsi
        title={`Selamat datang kembali, ${user.name.split(" ")[0]}!`} // Welcome back...
        description={`Dasbor ${getRoleDisplayName(user.role)} - Kelola operasi farmasi Anda secara efisien`} // ...Dashboard - Manage your pharmacy operations efficiently
      />

      <div className="px-6 space-y-6">
        {/* Ringkasan Statistik */}
        <DashboardStats />

        {/* Grid Konten Utama */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Aktivitas Terbaru */}
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>

          {/* Tindakan Cepat */}
          <Card>
            <CardHeader>
              <CardTitle>Tindakan Cepat</CardTitle> {/* Quick Actions */}
              <CardDescription>Fitur yang sering digunakan</CardDescription> {/* Frequently used features */}
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-2">
                <button className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors text-left">
                  <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center">🛒</div>
                  <div>
                    <p className="text-sm font-medium">Penjualan Baru</p> {/* New Sale */}
                    <p className="text-xs text-muted-foreground">Proses transaksi</p> {/* Process transaction */}
                  </div>
                </button>

                <button className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors text-left">
                  <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center">👥</div>
                  <div>
                    <p className="text-sm font-medium">Tambah Anggota</p> {/* Add Member */}
                    <p className="text-xs text-muted-foreground">Daftarkan pasien baru</p> {/* Register new patient */}
                  </div>
                </button>

                <button className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors text-left">
                  <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center">📦</div>
                  <div>
                    <p className="text-sm font-medium">Cek Stok</p> {/* Check Stock */}
                    <p className="text-xs text-muted-foreground">Lihat level inventaris</p> {/* View inventory levels */}
                  </div>
                </button>

                {user.role !== "staff" && (
                  <button className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors text-left">
                    <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center">📊</div>
                    <div>
                      <p className="text-sm font-medium">Lihat Laporan</p> {/* View Reports */}
                      <p className="text-xs text-muted-foreground">Laporan penjualan & inventaris</p> {/* Sales & inventory reports */}
                    </div>
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Sistem */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Status Sistem</CardTitle> {/* System Status */}
              <CardDescription>Kesehatan sistem dan peringatan saat ini</CardDescription> {/* Current system health and alerts */}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Koneksi Database</span> {/* Database Connection */}
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success"></div>
                    <span className="text-sm text-success">Online</span> {/* Online */}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Sinkronisasi Stok</span> {/* Stock Sync */}
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success"></div>
                    <span className="text-sm text-success">Real-time</span> {/* Real-time */}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Pencadangan Terakhir</span> {/* Last Backup */}
                  <span className="text-sm text-muted-foreground">2 jam yang lalu</span> {/* 2 hours ago */}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ringkasan Hari Ini</CardTitle> {/* Today's Summary */}
              <CardDescription>Metrik utama untuk hari ini</CardDescription> {/* Key metrics for today */}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Transaksi</span> {/* Transactions */}
                  <span className="text-sm font-medium">47</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Pendapatan</span> {/* Revenue */}
                  <span className="text-sm font-medium text-success">$2,847.50</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Anggota Baru</span> {/* New Members */}
                  <span className="text-sm font-medium">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Resep</span> {/* Prescriptions */}
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
