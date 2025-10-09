// page.tsx (transaction)
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog" // Import Dialog components
import { Separator } from "@/components/ui/separator"
import { Search, Filter, Download, Eye, Receipt, TrendingUp, DollarSign, Package, CalendarIcon, ShoppingCart } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"

// Fungsi Helper untuk format Rupiah
const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Fungsi Helper untuk format Date ke string YYYY-MM-DD
const formatDateToString = (date?: Date): string => {
    if (!date || isNaN(date.getTime())) return "";
    return format(date, 'yyyy-MM-dd');
};

// --- Mock Data ---
const mockTransactions = [
  {
    id: "TXN001",
    date: new Date("2024-10-08T14:30:00"), // Diperbarui ke tanggal sekitar saat ini
    customerId: "MEM001",
    customerName: "Bagas", // Diperbarui
    items: [
      { name: "Paracetamol 500mg", quantity: 2, price: 15000 },
      { name: "Vitamin C 500mg", quantity: 1, price: 120000 },
    ],
    subtotal: 150000,
    tax: 18000, 
    discount: 15000,
    total: 153000,
    paymentMethod: "tunai",
    status: "completed",
    cashier: "Staf Apotek",
    branch: "Cabang Utama - Jakarta",
    prescriptionRequired: false,
    notes: "Pelanggan meminta kantong plastik kecil."
  },
  {
    id: "TXN002",
    date: new Date("2024-10-09T15:45:00"), // Diperbarui ke tanggal sekitar saat ini
    customerId: "MEM002",
    customerName: "Saviola", // Diperbarui
    items: [
      { name: "Amoxicillin 250mg", quantity: 1, price: 85000 },
      { name: "Obat Batuk Syrup", quantity: 1, price: 65000 },
    ],
    subtotal: 150000,
    tax: 18000,
    discount: 0.0,
    total: 168000,
    paymentMethod: "kartu",
    status: "completed",
    cashier: "Staf Apotek",
    branch: "Cabang Utama - Jakarta",
    prescriptionRequired: true,
    notes: "Resep diverifikasi oleh Apoteker B."
  },
  {
    id: "TXN005",
    date: new Date("2024-10-09T09:30:00"), // Diperbarui ke tanggal sekitar saat ini
    customerId: "MEM004",
    customerName: "Kaka Adit", // Diperbarui
    items: [
      { name: "Multivitamin", quantity: 1, price: 280000 },
      { name: "Protein Powder", quantity: 1, price: 850000 },
    ],
    subtotal: 1130000,
    tax: 135600,
    discount: 113000,
    total: 1152600,
    paymentMethod: "tunai",
    status: "refunded",
    cashier: "Staf Apotek",
    branch: "Cabang Jakarta Pusat",
    prescriptionRequired: false,
    notes: "Pengembalian dana penuh karena produk tidak sesuai."
  },
];
// --- Akhir Mock Data ---

// --- Helper untuk Badge dan Label ---

const getStatusBadge = (status: string) => {
    const variants = { completed: "default", pending: "secondary", refunded: "destructive", cancelled: "outline", } as const;
    const label = { completed: "Selesai", pending: "Menunggu", refunded: "Dikembalikan", cancelled: "Dibatalkan", }[status as keyof typeof variants] || status;
    return (
        <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
            {label}
        </Badge>
    );
}

const getPaymentBadge = (method: string) => {
    const variants = { tunai: "outline", kartu: "secondary", digital: "default", } as const;
    const label = { tunai: "Tunai", kartu: "Kartu", digital: "Digital", }[method as keyof typeof variants] || method;
    return (
        <Badge variant={variants[method as keyof typeof variants] || "outline"}>
            {label}
        </Badge>
    );
}

// --- Komponen Modal Detail Transaksi ---

interface TransactionDetailModalProps {
    transaction: typeof mockTransactions[0] | null;
    onClose: () => void;
}

function TransactionDetailModal({ transaction, onClose }: TransactionDetailModalProps) {
    if (!transaction) return null;

    const transactionTime = format(transaction.date, "dd MMMM yyyy HH:mm", { locale: id });

     const handlePrint = () => {
        // Memicu pencetakan bawaan browser
        window.print();
    };

    return (
        <Dialog open={!!transaction} onOpenChange={onClose}>
            <DialogContent className="!max-w-2xl !w-full">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Receipt className="h-5 w-5" />
                        Detail Transaksi #{transaction.id}
                    </DialogTitle>
                    <DialogDescription>
                        Informasi lengkap mengenai transaksi yang diselesaikan pada {transactionTime}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 text-sm">
                    {/* Kolom Kiri: Ringkasan Transaksi */}
                    <div className="space-y-4">
                        <Card className="bg-muted/30">
                            <CardHeader className="p-3 pb-0">
                                <CardTitle className="text-base">Ringkasan</CardTitle>
                            </CardHeader>
                            <CardContent className="p-3 space-y-1">
                                <div className="flex justify-between"><span>Pelanggan:</span><span className="font-medium">{transaction.customerName}</span></div>
                                <div className="flex justify-between"><span>Status:</span>{getStatusBadge(transaction.status)}</div>
                                <div className="flex justify-between"><span>Pembayaran:</span>{getPaymentBadge(transaction.paymentMethod)}</div>
                                <div className="flex justify-between"><span>Kasir:</span><span>{transaction.cashier}</span></div>
                                <div className="flex justify-between"><span>Cabang:</span><span>{transaction.branch}</span></div>
                                {transaction.prescriptionRequired && <Badge variant="destructive" className="mt-2 w-full justify-center"><FileText className="h-3 w-3 mr-1"/> Resep Diperlukan</Badge>}
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader className="p-3 pb-0">
                                <CardTitle className="text-base">Catatan & Keterangan</CardTitle>
                            </CardHeader>
                            <CardContent className="p-3 text-muted-foreground">
                                <p>{transaction.notes || 'Tidak ada catatan tambahan.'}</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Kolom Kanan: Detail Keuangan & Item */}
                    <div className="space-y-4">
                        <Card>
                            <CardHeader className="p-3 pb-0"><CardTitle className="text-base">Detail Item</CardTitle></CardHeader>
                            <CardContent className="p-3 space-y-2 max-h-48 overflow-y-auto">
                                {transaction.items.map((item, index) => (
                                    <div key={index} className="flex justify-between border-b pb-1">
                                        <span className="flex-1">{item.name} <span className="text-muted-foreground">({item.quantity}x)</span></span>
                                        <span className="font-medium">{formatRupiah(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </CardContent>
                            <Separator />
                            <CardContent className="p-3 pt-0 space-y-1">
                                <div className="flex justify-between pt-1"><span>Subtotal:</span><span>{formatRupiah(transaction.subtotal)}</span></div>
                                <div className="flex justify-between"><span>Diskon:</span><span className="text-green-600">-{formatRupiah(transaction.discount)}</span></div>
                                <div className="flex justify-between"><span>Pajak:</span><span>{formatRupiah(transaction.tax)}</span></div>
                                <Separator className="my-1"/>
                                <div className="flex justify-between text-lg font-bold"><span>TOTAL AKHIR:</span><span>{formatRupiah(transaction.total)}</span></div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <DialogFooter className="print:hidden">
                    <Button onClick={onClose} variant="outline" className="print:hidden">Tutup</Button>
                    <Button onClick={handlePrint} className="print:hidden">Cetak Ulang Struk</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// --- Komponen Utama ---

export default function TransactionsPage() {
  const [transactions] = useState(mockTransactions)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [branchFilter, setBranchFilter] = useState("all")
  
  const [dateFromString, setDateFromString] = useState<string>("")
  const [dateToString, setDateToString] = useState<string>("")
  
  const [selectedTransaction, setSelectedTransaction] = useState<typeof mockTransactions[0] | null>(null) // State untuk Modal Detail

  const dateFrom = dateFromString ? new Date(dateFromString) : undefined;
  const dateTo = dateToString ? new Date(dateToString) : undefined;

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.cashier.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter
    const matchesPayment = paymentFilter === "all" || transaction.paymentMethod === paymentFilter
    const matchesBranch = branchFilter === "all" || transaction.branch === branchFilter

    const dateTransaction = new Date(transaction.date.getFullYear(), transaction.date.getMonth(), transaction.date.getDate()).getTime();
    
    const matchesDateRange = 
      (!dateFrom || dateTransaction >= new Date(dateFrom.getFullYear(), dateFrom.getMonth(), dateFrom.getDate()).getTime()) && 
      (!dateTo || dateTransaction <= new Date(dateTo.getFullYear(), dateTo.getMonth(), dateTo.getDate()).getTime())

    return matchesSearch && matchesStatus && matchesPayment && matchesBranch && matchesDateRange
  })

  // Hitung Statistik Ringkasan
  const totalTransactions = filteredTransactions.length
  const completedTransactions = filteredTransactions.filter((t) => t.status === "completed").length
  const totalRevenue = filteredTransactions.filter((t) => t.status === "completed").reduce((sum, t) => sum + t.total, 0)
  const averageTransaction = completedTransactions > 0 ? totalRevenue / completedTransactions : 0

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Manajemen Transaksi</h1>
        <p className="text-muted-foreground">Lihat dan kelola semua catatan penjualan dan transaksi apotek</p>
      </div>

      {/* Kartu Ringkasan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Transaksi</p>
                <p className="text-2xl font-bold">{totalTransactions}</p>
              </div>
              <Receipt className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Pendapatan</p>
                <p className="text-2xl font-bold">{formatRupiah(totalRevenue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rata-rata Transaksi</p>
                <p className="text-2xl font-bold">{formatRupiah(averageTransaction)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Transaksi Selesai</p>
                <p className="text-2xl font-bold text-green-600">{completedTransactions}</p>
              </div>
              <Package className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter & Pencarian
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            
            {/* Kolom 1: Search */}
            <div className="relative w-full lg:w-1/4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Cari transaksi (ID, Pelanggan, Kasir)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Kolom 2: Status, Pembayaran, Cabang (Rapi dalam satu baris) */}
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-3/4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="completed">Selesai</SelectItem>
                    <SelectItem value="pending">Menunggu</SelectItem>
                    <SelectItem value="refunded">Dikembalikan</SelectItem>
                    <SelectItem value="cancelled">Dibatalkan</SelectItem>
                </SelectContent>
                </Select>

                <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="w-full sm:w-[160px]">
                    <SelectValue placeholder="Metode Pembayaran" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Semua Metode</SelectItem>
                    <SelectItem value="tunai">Tunai</SelectItem>
                    <SelectItem value="kartu">Kartu</SelectItem>
                    <SelectItem value="digital">Digital</SelectItem>
                </SelectContent>
                </Select>

                <Select value={branchFilter} onValueChange={setBranchFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Cabang" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Semua Cabang</SelectItem>
                    <SelectItem value="Cabang Utama - Jakarta">Cabang Utama - Jakarta</SelectItem>
                    <SelectItem value="Cabang Jakarta Pusat">Cabang Jakarta Pusat</SelectItem>
                    <SelectItem value="Cabang Bandung">Cabang Bandung</SelectItem>
                    <SelectItem value="Cabang Surabaya">Cabang Surabaya</SelectItem>
                </SelectContent>
                </Select>
            </div>
          </div>

          {/* Filter Tanggal dan Export */}
          <div className="flex gap-4">
            {/* Input Tanggal Dari (Native Date Picker) */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Dari Tanggal</label>
              <Input
                type="date"
                value={dateFromString}
                onChange={(e) => setDateFromString(e.target.value)}
                className="w-44"
              />
            </div>

            {/* Input Tanggal Sampai (Native Date Picker) */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Sampai Tanggal</label>
              <Input
                type="date"
                value={dateToString}
                onChange={(e) => setDateToString(e.target.value)}
                className="w-44"
              />
            </div>

            {/* Tombol Export Excel */}
            <div className="flex items-end">
              <Button variant="outline" onClick={() => alert("Simulasi Export Excel dimulai...")}>
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabel Transaksi */}
      <Card>
        <CardHeader>
          <CardTitle>Catatan Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Transaksi</TableHead>
                  <TableHead>Tanggal & Waktu</TableHead>
                  <TableHead>Pelanggan</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Pembayaran</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Kasir</TableHead>
                  <TableHead>Cabang</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.id}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{format(transaction.date, "dd MMM yyyy", { locale: id })}</div>
                        <div className="text-muted-foreground">{format(transaction.date, "HH:mm")}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{transaction.customerName}</div>
                        <div className="text-sm text-muted-foreground">{transaction.customerId}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{transaction.items.length} item</div>
                        {transaction.prescriptionRequired && (
                          <Badge variant="outline" className="text-xs">
                            Resep
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{formatRupiah(transaction.total)}</div>
                      {transaction.discount > 0 && (
                        <div className="text-xs text-green-600">Diskon: {formatRupiah(transaction.discount)}</div>
                      )}
                    </TableCell>
                    <TableCell>{getPaymentBadge(transaction.paymentMethod)}</TableCell>
                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                    <TableCell className="text-sm">{transaction.cashier}</TableCell>
                    <TableCell className="text-sm">{transaction.branch}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="icon" onClick={() => setSelectedTransaction(transaction)} title="Lihat Detail">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">Tidak ada transaksi yang cocok dengan kriteria Anda.</div>
          )}
        </CardContent>
      </Card>

      {/* MODAL DETAIL */}
      <TransactionDetailModal 
        transaction={selectedTransaction} 
        onClose={() => setSelectedTransaction(null)} 
      />
    </div>
  )
}
