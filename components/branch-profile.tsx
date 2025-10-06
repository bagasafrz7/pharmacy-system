// branch-profile.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Building2, MapPin, Phone, User, TrendingUp, AlertTriangle, Package, Edit, Clock, ArrowUpDown } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"

// Fungsi Helper untuk format Rupiah (duplikasi agar komponen independen)
const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Asumsi Struktur Data Cabang dan Transfer (diambil dari page.tsx)
interface Branch {
  id: string
  name: string
  code: string
  address: string
  phone: string
  manager: string
  status: string
  totalProducts: number
  lowStockItems: number
  dailySales: number
  monthlyTarget: number
  staffCount: number
  openingHours: string
}

interface Transfer {
    id: string
    transferId: string
    fromBranch: string
    toBranch: string
    requestedBy: string
    status: string
    priority: string
    totalItems: number
    createdAt: Date
    notes: string
}


interface BranchProfileProps {
  branch: Branch // Detail cabang yang akan ditampilkan
  // Asumsi: Menerima riwayat transfer yang terkait (diambil dari page.tsx)
  transfers: Transfer[] 
  onClose: () => void
}

export function BranchProfile({ branch, transfers, onClose }: BranchProfileProps) {
  
  // Filter transfer yang terkait dengan cabang ini (sebagai sumber atau tujuan)
  const relatedTransfers = transfers.filter(t => t.fromBranch === branch.name || t.toBranch === branch.name);
  
  // Helper untuk Badge Status Cabang
  const getBranchStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      maintenance: "warning",
      temporarily_closed: "destructive",
      inactive: "secondary",
    } as const;
    const label = {
        active: "Aktif",
        maintenance: "Pemeliharaan",
        temporarily_closed: "Tutup Sementara",
        inactive: "Nonaktif",
    }[status as keyof typeof variants] || status;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {label}
      </Badge>
    );
  }
  
  // Helper untuk Badge Prioritas Transfer
  const getTransferPriorityBadge = (priority: string) => {
    const variants = {
      low: "secondary",
      normal: "outline",
      high: "destructive",
      urgent: "destructive",
    } as const
    const label = { low: "Rendah", normal: "Normal", high: "Tinggi", urgent: "Mendesak", }[priority as keyof typeof variants] || priority;
    return (
      <Badge variant={variants[priority as keyof typeof variants] || "outline"}>
        {label}
      </Badge>
    );
  }

  const attainment = (branch.dailySales / (branch.monthlyTarget / 30)) * 100;
  const isTargetAchieved = branch.dailySales >= (branch.monthlyTarget / 30);

  return (
    <div className="space-y-6">
      {/* Header Profil */}
      <div className="flex justify-between items-start print:hidden">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="h-6 w-6"/> {branch.name}
          </h2>
          <p className="text-muted-foreground">Kode Cabang: {branch.code}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </div>
      
      <Separator className="print:hidden"/>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kolom Kiri: Informasi Dasar & Kontak */}
        <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">Informasi Umum</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="font-medium">Status:</span>
                        {getBranchStatusBadge(branch.status)}
                    </div>
                    <Separator/>
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>Manajer: {branch.manager}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Jam Buka: {branch.openingHours}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>Telepon: {branch.phone}</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                        <span className="break-words">{branch.address}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                        <span className="font-medium">Total Staf:</span>
                        <span className="font-semibold">{branch.staffCount} orang</span>
                    </div>
                </CardContent>
            </Card>
        </div>
        
        {/* Kolom Tengah & Kanan: Statistik & Inventaris */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Statistik Keuangan & Performa */}
            <Card>
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4"/> Performa & Target</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold">{formatRupiah(branch.dailySales)}</div>
                        <div className="text-sm text-muted-foreground">Penjualan Harian</div>
                    </div>
                    <div className="text-center">
                        <div className={`text-2xl font-bold ${isTargetAchieved ? 'text-green-600' : 'text-red-600'}`}>
                            {Math.round(attainment)}%
                        </div>
                        <div className="text-sm text-muted-foreground">Pencapaian Target Harian</div>
                    </div>
                    <div className="text-center border-t pt-4 col-span-2">
                        <div className="text-lg font-bold">{formatRupiah(branch.monthlyTarget)}</div>
                        <div className="text-sm text-muted-foreground">Target Bulanan</div>
                    </div>
                </CardContent>
            </Card>
            
            {/* Inventaris & Stok */}
            <Card>
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><Package className="h-4 w-4"/> Inventaris</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex justify-between">
                        <span>Total Produk Tercatat:</span>
                        <span className="font-semibold">{branch.totalProducts}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Item Stok Rendah:</span>
                        <span className="font-semibold text-red-600 flex items-center gap-1">
                            <AlertTriangle className="h-4 w-4"/>
                            {branch.lowStockItems}
                        </span>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
      
      {/* Riwayat Transfer (Tampilan Terkait) */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><ArrowUpDown className="h-4 w-4"/> Riwayat Transfer Terkait ({relatedTransfers.length})</CardTitle></CardHeader>
        <CardContent className="space-y-4">
            {relatedTransfers.length > 0 ? (
                relatedTransfers.slice(0, 5).map((transfer) => (
                    <div key={transfer.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start text-sm">
                            <div className="font-semibold">{transfer.transferId}</div>
                            <div className="flex gap-2">
                                {getTransferPriorityBadge(transfer.priority)}
                                <Badge variant="outline">{transfer.status}</Badge>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Dari: {transfer.fromBranch} &rarr; Ke: {transfer.toBranch}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {transfer.totalItems} item | Dibuat: {format(transfer.createdAt, 'dd MMM yy', { locale: id })}
                        </p>
                    </div>
                ))
            ) : (
                <div className="text-center py-4 text-muted-foreground text-sm">
                    Tidak ada riwayat transfer terbaru yang tercatat.
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  )
}
