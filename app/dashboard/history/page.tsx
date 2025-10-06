// page.tsx (history)
"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// Hapus import: Calendar, Popover, PopoverContent, PopoverTrigger, CalendarIcon
import { Search, Filter, Download, History, TrendingUp, Users, Package, DollarSign } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale" // Import locale Indonesia
import { Label } from "@/components/ui/label"

// Fungsi Helper untuk format Rupiah
const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Fungsi Helper untuk format Date ke string YYYY-MM-DD
const formatDateToInput = (date?: Date): string => {
    if (!date || isNaN(date.getTime())) return "";
    return format(date, 'yyyy-MM-dd');
};

// Mock historical data (Nilai disesuaikan ke Rupiah)
const mockSalesHistory = [
  { date: "2024-01-20", sales: 4500000, transactions: 28, customers: 25 },
  { date: "2024-01-19", sales: 3800000, transactions: 22, customers: 20 },
  { date: "2024-01-18", sales: 5200000, transactions: 35, customers: 32 },
  { date: "2024-01-17", sales: 4100000, transactions: 26, customers: 24 },
  { date: "2024-01-16", sales: 4700000, transactions: 30, customers: 28 },
]

const mockProductHistory = [
  { product: "Paracetamol 500mg", sold: 150, revenue: 225000, trend: "up" },
  { product: "Amoxicillin 250mg", sold: 85, revenue: 722500, trend: "up" },
  { product: "Vitamin C 500mg", sold: 120, revenue: 1440000, trend: "down" },
  { product: "Ibuprofen 400mg", sold: 95, revenue: 475000, trend: "up" },
  { product: "Masker Wajah (Box)", sold: 200, revenue: 900000, trend: "stable" },
]

const mockCustomerHistory = [
  { customer: "Maria Santos", visits: 12, totalSpent: 2500000, lastVisit: "2024-01-20", membershipType: "premium" },
  { customer: "Jose Dela Cruz", visits: 8, totalSpent: 1850000, lastVisit: "2024-01-18", membershipType: "regular" },
  { customer: "Elena Rodriguez", visits: 15, totalSpent: 4200000, lastVisit: "2024-01-19", membershipType: "senior" },
  { customer: "Miguel Torres", visits: 6, totalSpent: 850000, lastVisit: "2024-01-17", membershipType: "student" },
]

export default function HistoryPage() {
  // Menggunakan string untuk input tanggal natif
  const [dateFromString, setDateFromString] = useState<string>("")
  const [dateToString, setDateToString] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")

  // Konversi state string kembali ke Date object untuk filtering (walaupun filtering tidak diimplementasikan)
  const dateFrom = useMemo(() => dateFromString ? new Date(dateFromString) : undefined, [dateFromString]);
  const dateTo = useMemo(() => dateToString ? new Date(dateToString) : undefined, [dateToString]);


  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        // Rotasi 180 derajat untuk menunjukkan tren turun
        return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" /> 
      default:
        // Div abu-abu kecil untuk tren stabil
        return <div className="h-4 w-4 bg-gray-400 rounded-full flex items-center justify-center text-[8px] text-white font-bold">~</div> 
    }
  }

  const getMembershipBadge = (type: string) => {
    const variants = {
      regular: "outline",
      premium: "default",
      senior: "secondary",
      student: "outline",
    } as const
    
    const label = {
        regular: "Regular",
        premium: "Premium",
        senior: "Lansia",
        student: "Pelajar",
    }[type as keyof typeof variants] || type;

    return (
      <Badge variant={variants[type as keyof typeof variants] || "outline"}>
        {label}
      </Badge>
    )
  }
  
  const handleExport = () => {
       const from = dateFrom ? format(dateFrom, 'dd MMM yyyy') : 'Awal';
       const to = dateTo ? format(dateTo, 'dd MMM yyyy') : 'Akhir';
       alert(`Simulasi Export data dari ${from} sampai ${to}.`);
  }


  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Riwayat Transaksi & Analitik</h1>
        <p className="text-muted-foreground">
          Data historis komprehensif dan analitik untuk operasional apotek Anda
        </p>
      </div>

      {/* Filter Rentang Tanggal & Pencarian yang Dirapihkan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Rentang Tanggal & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Kontainer Utama Filter: Menggunakan grid untuk tata letak yang responsif */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 items-end">
            
            {/* 1. Input Pencarian */}
            <div className="relative lg:col-span-2">
              <Label htmlFor="search-history">Cari dalam Riwayat</Label>
              <Search className="absolute left-3 top-[34px] transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="search-history"
                placeholder="Produk, pelanggan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 mt-1"
              />
            </div>

            {/* 2. Tanggal Dari (Native Date Picker) */}
            <div>
              <Label htmlFor="date-from">Dari Tanggal</Label>
              <Input
                id="date-from"
                type="date"
                value={dateFromString}
                onChange={(e) => setDateFromString(e.target.value)}
                className="mt-1"
              />
            </div>

            {/* 3. Tanggal Sampai (Native Date Picker) */}
            <div>
              <Label htmlFor="date-to">Sampai Tanggal</Label>
              <Input
                id="date-to"
                type="date"
                value={dateToString}
                onChange={(e) => setDateToString(e.target.value)}
                className="mt-1"
              />
            </div>

            {/* 4. Tombol Export */}
            <div className="pt-2">
              <Button variant="outline" onClick={handleExport} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Tabs defaultValue="sales" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sales">Riwayat Penjualan</TabsTrigger>
          <TabsTrigger value="products">Performa Produk</TabsTrigger>
          <TabsTrigger value="customers">Analitik Pelanggan</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Performa Penjualan Harian
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSalesHistory.map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-center min-w-[60px]">
                        <div className="font-semibold">{format(new Date(day.date), "MMM", { locale: id })}</div>
                        <div className="text-2xl font-bold">{format(new Date(day.date), "dd")}</div>
                        <div className="text-sm text-muted-foreground">{format(new Date(day.date), "yyyy")}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{formatRupiah(day.sales)}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{day.transactions} transaksi</span>
                          <span>{day.customers} pelanggan</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Rata-rata per transaksi</div>
                      <div className="font-semibold">{formatRupiah(Math.round(day.sales / day.transactions))}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Produk Berkinerja Terbaik
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockProductHistory.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-center min-w-[40px]">
                        <div className="text-2xl font-bold text-primary">#{index + 1}</div>
                      </div>
                      <div>
                        <div className="font-semibold">{product.product}</div>
                        <div className="text-sm text-muted-foreground">{product.sold} unit terjual</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-semibold">{formatRupiah(product.revenue)}</div>
                        <div className="text-sm text-muted-foreground">Pendapatan</div>
                      </div>
                      {getTrendIcon(product.trend)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Analitik Pelanggan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCustomerHistory.map((customer, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="font-semibold text-primary">
                          {customer.customer
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold">{customer.customer}</div>
                        <div className="flex items-center gap-2">
                          {getMembershipBadge(customer.membershipType)}
                          <span className="text-sm text-muted-foreground">{customer.visits} kunjungan</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatRupiah(customer.totalSpent)}</div>
                      <div className="text-sm text-muted-foreground">
                        Kunjungan terakhir: {format(new Date(customer.lastVisit), "dd MMM", { locale: id })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
