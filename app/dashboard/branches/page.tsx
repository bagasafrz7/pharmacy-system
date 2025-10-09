// page.tsx (branch)
"use client"

import { useState } from "react"
import { BranchTable } from "@/components/branch-table" // Asumsi komponen BranchTable ada
import { BranchForm } from "@/components/branch-form" // Asumsi komponen BranchForm ada
import { StockTransferForm } from "@/components/stock-transfer-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Building2, Package, TrendingUp, AlertTriangle, ArrowUpDown, Clock, Plus } from "lucide-react"
import { v4 as uuidv4 } from 'uuid'; 
import { BranchProfile } from "@/components/branch-profile"

// Fungsi Helper untuk format Rupiah
const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Mock data (Nilai disesuaikan ke Rupiah)
const mockBranches = [
  {
    id: "1",
    name: "Cabang Utama - Jakarta",
    code: "JKT",
    address: "Jl. Jend. Sudirman Kav. 1, Jakarta Pusat",
    phone: "+62 21 1234 5678",
    manager: "Dr. Budi",
    status: "active",
    totalProducts: 1250,
    lowStockItems: 15,
    dailySales: 4500000,
    monthlyTarget: 120000000,
    staffCount: 12,
    openingHours: "8:00 AM - 10:00 PM",
  },
  {
    id: "2",
    name: "Cabang Bandung",
    code: "BDG",
    address: "Jl. Asia Afrika No. 10, Bandung",
    phone: "+62 22 2345 6789",
    manager: "Dr. Dian",
    status: "active",
    totalProducts: 980,
    lowStockItems: 8,
    dailySales: 3200000,
    monthlyTarget: 90000000,
    staffCount: 8,
    openingHours: "8:00 AM - 9:00 PM",
  },
  {
    id: "3",
    name: "Cabang Surabaya",
    code: "SBY",
    address: "Jl. Raya Darmo No. 5, Surabaya",
    phone: "+62 31 3456 7890",
    manager: "Dr. Dian",
    status: "active",
    totalProducts: 850,
    lowStockItems: 22,
    dailySales: 2800000,
    monthlyTarget: 80000000,
    staffCount: 6,
    openingHours: "9:00 AM - 9:00 PM",
  },
  {
    id: "4",
    name: "Cabang Bali (Maintenance)",
    code: "BAL",
    address: "Jl. Sunset Road No. 10, Denpasar",
    phone: "+62 361 4567 8901",
    manager: "Dr. Dian",
    status: "maintenance",
    totalProducts: 750,
    lowStockItems: 35,
    dailySales: 1500000,
    monthlyTarget: 70000000,
    staffCount: 5,
    openingHours: "Tutup Sementara",
  },
]

const mockTransfers = [
  {
    id: "1",
    transferId: "TRF001",
    fromBranch: "Cabang Utama - Jakarta",
    toBranch: "Cabang Bandung",
    requestedBy: "Dr. Jose Dela Cruz",
    status: "pending",
    priority: "high",
    totalItems: 150,
    createdAt: new Date("2024-01-20"),
    notes: "Restock mendesak untuk obat musim flu",
  },
  {
    id: "2",
    transferId: "TRF002",
    fromBranch: "Cabang Bandung",
    toBranch: "Cabang Surabaya",
    requestedBy: "Dr. Elena Rodriguez",
    status: "in-transit",
    priority: "normal",
    totalItems: 75,
    createdAt: new Date("2024-01-19"),
    notes: "Transfer stok bulanan rutin",
  },
  {
    id: "3",
    transferId: "TRF003",
    fromBranch: "Cabang Utama - Jakarta",
    toBranch: "Cabang Bali (Maintenance)",
    requestedBy: "Dr. Miguel Torres",
    status: "completed",
    priority: "urgent",
    totalItems: 200,
    createdAt: new Date("2024-01-18"),
    notes: "Stok darurat untuk pembukaan kembali setelah pemeliharaan",
  },
]

export default function BranchesPage() {
  const [branches, setBranches] = useState(mockBranches)
  const [transfers, setTransfers] = useState(mockTransfers)
  const [selectedBranch, setSelectedBranch] = useState<any>(null)
  const [showBranchForm, setShowBranchForm] = useState(false) // Mengganti showAddBranch
  const [showTransferForm, setShowTransferForm] = useState(false)
  const [showBranchDetails, setShowBranchDetails] = useState(false) // Asumsi dialog detail ada
  const { toast } = useToast()

  // --- Logika CRUD Cabang ---
  const handleSaveBranch = (branchData: any) => {
    const isEditing = !!branchData.id;

    if (isEditing) {
      // Logic Edit
      setBranches((prev) =>
        prev.map((b) => (b.id === branchData.id ? { ...b, ...branchData } : b))
      );
      toast({ title: "Cabang Diperbarui", description: `${branchData.name} berhasil diperbarui.` });
    } else {
      // Logic Tambah Baru
      const newBranch = {
        ...branchData,
        id: uuidv4(),
        lowStockItems: 0,
        totalProducts: 0,
        dailySales: 0,
        monthlyTarget: 0,
        staffCount: 0,
      };
      setBranches((prev) => [...prev, newBranch]);
      toast({ title: "Cabang Ditambahkan", description: `${branchData.name} berhasil ditambahkan.` });
    }
    setSelectedBranch(null);
    setShowBranchForm(false);
  };

  const handleEditBranch = (branch: any) => {
    setSelectedBranch(branch);
    setShowBranchForm(true);
  };

  const handleAddBranchClick = () => {
    setSelectedBranch(null); // Pastikan mode tambah
    setShowBranchForm(true);
  };
  // --- Akhir Logika CRUD Cabang ---

  const handleViewBranch = (branch: any) => {
    setSelectedBranch(branch)
    setShowBranchDetails(true)
  }

  const handleCreateTransfer = (transferData: any) => {
    // Cari nama cabang berdasarkan ID yang dikirim dari form
    const fromBranchName = branches.find((b) => b.id === transferData.fromBranch)?.name || transferData.fromBranch;
    const toBranchName = branches.find((b) => b.id === transferData.toBranch)?.name || transferData.toBranch;

    const newTransfer = {
      ...transferData,
      id: uuidv4(),
      fromBranch: fromBranchName,
      toBranch: toBranchName,
      createdAt: new Date(),
      status: "pending", // Status awal saat dibuat
    }
    setTransfers((prev) => [...prev, newTransfer])
    setShowTransferForm(false)
    toast({
      title: "Permintaan Transfer Dibuat",
      description: `Transfer ${transferData.transferId} berhasil dibuat.`,
    })
  }

  // Helper untuk Badge Status Transfer
  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      "in-transit": "default",
      completed: "outline",
      cancelled: "destructive",
    } as const
    
    const label = {
        pending: "Menunggu",
        "in-transit": "Dalam Perjalanan",
        completed: "Selesai",
        cancelled: "Dibatalkan",
    }[status as keyof typeof variants] || status;


    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {label}
      </Badge>
    )
  }

  // Helper untuk Badge Prioritas Transfer
  const getPriorityBadge = (priority: string) => {
    const variants = {
      low: "secondary",
      normal: "outline",
      high: "destructive",
      urgent: "destructive",
    } as const

    const label = {
        low: "Rendah",
        normal: "Normal",
        high: "Tinggi",
        urgent: "Mendesak",
    }[priority as keyof typeof variants] || priority;
    


    return (
      <Badge variant={variants[priority as keyof typeof variants] || "outline"}>
        {label}
      </Badge>
    )
  }

  // Hitung Statistik Ringkasan
  const totalBranches = branches.length
  const activeBranches = branches.filter((b) => b.status === "active").length
  const totalLowStock = branches.reduce((sum, branch) => sum + branch.lowStockItems, 0)
  const pendingTransfers = transfers.filter((t) => t.status === "pending").length

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Manajemen Cabang</h1>
        <p className="text-muted-foreground">Kelola cabang apotek, transfer stok, dan sinkronisasi inventaris real-time</p>
      </div>

      {/* Kartu Ringkasan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Cabang</p>
                <p className="text-2xl font-bold">{totalBranches}</p>
              </div>
              <Building2 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cabang Aktif</p>
                <p className="text-2xl font-bold text-green-600">{activeBranches}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Item Stok Rendah</p>
                <p className="text-2xl font-bold text-red-600">{totalLowStock}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Transfer Menunggu</p>
                <p className="text-2xl font-bold text-orange-600">{pendingTransfers}</p>
              </div>
              <Package className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="branches" className="space-y-6">
        <TabsList>
          <TabsTrigger value="branches">Cabang</TabsTrigger>
          <TabsTrigger value="transfers">Transfer Stok</TabsTrigger>
        </TabsList>

        <TabsContent value="branches">
          <BranchTable
            branches={branches}
            onAdd={handleAddBranchClick}
            onEdit={handleEditBranch}
            onView={handleViewBranch}
          />
        </TabsContent>

        <TabsContent value="transfers">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <ArrowUpDown className="h-5 w-5" />
                  Transfer Stok
                </CardTitle>
                <Button onClick={() => setShowTransferForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Transfer Baru
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transfers.map((transfer) => (
                  <div key={transfer.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{transfer.transferId}</h3>
                        <p className="text-sm text-muted-foreground">
                          {transfer.fromBranch} → {transfer.toBranch}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {getStatusBadge(transfer.status)}
                        {getPriorityBadge(transfer.priority)}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Diminta oleh:</span>
                        <div>{transfer.requestedBy}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total Item:</span>
                        <div>{transfer.totalItems}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Dibuat:</span>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {transfer.createdAt.toLocaleDateString('id-ID')}
                        </div>
                      </div>
                    </div>
                    {transfer.notes && (
                      <div className="mt-3 text-sm">
                        <span className="text-muted-foreground">Catatan:</span>
                        <p className="mt-1">{transfer.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog Formulir Cabang (CRUD) */}
      {/* Asumsi BranchForm adalah komponen yang menangani Tambah/Edit */}
      <Dialog open={showBranchForm} onOpenChange={(open) => {
        setShowBranchForm(open);
        if (!open) setSelectedBranch(null);
      }}>
        <DialogContent className="!max-w-4xl !w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedBranch ? "Ubah Detail Cabang" : "Tambah Cabang Baru"}</DialogTitle>
          </DialogHeader>
          <BranchForm
            branch={selectedBranch} 
            onSubmit={handleSaveBranch} 
            onCancel={() => setShowBranchForm(false)} 
          />
        </DialogContent>
      </Dialog>
      
      {/* Dialog Formulir Transfer Stok */}
      <Dialog open={showTransferForm} onOpenChange={setShowTransferForm}>
        <DialogContent className="!max-w-6xl !w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Buat Transfer Stok</DialogTitle>
          </DialogHeader>
          <StockTransferForm 
            onSubmit={handleCreateTransfer} 
            onCancel={() => setShowTransferForm(false)} 
            branches={branches} // Teruskan data cabang ke form transfer
          />
        </DialogContent>
      </Dialog>
      
      {/* Dialog Detail Cabang (Asumsi) */}
      <Dialog open={showBranchDetails} onOpenChange={setShowBranchDetails}>
        <DialogContent className="!max-w-6xl !w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Profil Cabang</DialogTitle>
          </DialogHeader>
            {selectedBranch && (
              <BranchProfile
                branch={selectedBranch}
                transfers={transfers} // <--- TERUSKAN DATA INI
                onClose={() => setShowBranchDetails(false)}
              />
            )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
