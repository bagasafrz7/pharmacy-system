// page.tsx (pre-order)
"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { PreOrderForm } from "@/components/pre-order-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, MoreHorizontal, Eye, CheckCircle, XCircle, Clock, Search, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import { mockData } from "@/lib/mock-data"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale" // Import locale Indonesia

// Fungsi Helper untuk format Rupiah
const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

interface PreOrder {
  id: string
  order_number: string
  member_id: string
  member_name?: string
  items: Array<{
    product_id: string
    product_name: string
    quantity: number
    price: number
    prescription_required: boolean
  }>
  total: number
  pickup_date: string
  priority: "normal" | "urgent" | "emergency"
  status: "pending" | "ready" | "completed" | "cancelled"
  notes?: string
  created_at: string
}

export default function PreOrdersPage() {
  const [preOrders, setPreOrders] = useState<PreOrder[]>([
    ...mockData.pre_orders.map((order: any) => ({
      ...order,
      member_name: mockData.members.find((m: any) => m.id === order.member_id)?.name || "Tidak Dikenal",
      priority: order.priority || "normal",
    })),
  ])
  const [showPreOrderForm, setShowPreOrderForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  const handleCreatePreOrder = (orderData: any) => {
    const newOrder: PreOrder = {
      ...orderData,
      member_name: mockData.members.find((m: any) => m.id === orderData.member_id)?.name || "Tidak Dikenal",
    }
    setPreOrders([newOrder, ...preOrders])
    setShowPreOrderForm(false)
    toast.success(`Pre-order ${orderData.order_number} berhasil dibuat!`)
  }

  const handleStatusChange = (orderId: string, newStatus: PreOrder["status"]) => {
    setPreOrders(preOrders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
    
    let statusText = '';
    switch(newStatus) {
        case 'ready': statusText = 'Siap Diambil'; break;
        case 'completed': statusText = 'Selesai'; break;
        case 'cancelled': statusText = 'Dibatalkan'; break;
        default: statusText = newStatus;
    }
    toast.success(`Status pesanan diperbarui menjadi ${statusText}`)
  }

  const filteredOrders = preOrders.filter((order) => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.member_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) => item.product_name.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesPriority = priorityFilter === "all" || order.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusColor = (status: PreOrder["status"]) => {
    switch (status) {
      case "pending":
        return "bg-warning/10 text-warning"
      case "ready":
        return "bg-success/10 text-success"
      case "completed":
        return "bg-primary/10 text-primary"
      case "cancelled":
        return "bg-destructive/10 text-destructive"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusLabel = (status: PreOrder["status"]) => {
      switch (status) {
        case "pending": return "Menunggu";
        case "ready": return "Siap";
        case "completed": return "Selesai";
        case "cancelled": return "Batal";
        default: return status;
      }
  }

  const getPriorityColor = (priority: PreOrder["priority"]) => {
    switch (priority) {
      case "urgent":
        return "bg-warning/10 text-warning"
      case "emergency":
        return "bg-destructive/10 text-destructive"
      default:
        return "bg-muted text-muted-foreground"
    }
  }
  
  const getPriorityLabel = (priority: PreOrder["priority"]) => {
      switch (priority) {
        case "normal": return "Normal";
        case "urgent": return "Mendesak";
        case "emergency": return "Darurat";
        default: return priority;
      }
  }

  const getStatusIcon = (status: PreOrder["status"]) => {
    switch (status) {
      case "pending":
        return Clock
      case "ready":
        return CheckCircle
      case "completed":
        return CheckCircle
      case "cancelled":
        return XCircle
      default:
        return Clock
    }
  }

  // Calculate stats
  const totalOrders = preOrders.length
  const pendingOrders = preOrders.filter((o) => o.status === "pending").length
  const readyOrders = preOrders.filter((o) => o.status === "ready").length
  const urgentOrders = preOrders.filter((o) => o.priority === "urgent" || o.priority === "emergency").length

  return (
    <div className="space-y-6">
      <DashboardHeader title="Manajemen Pre-Order" description="Kelola pre-order resep dan permintaan obat lainnya" />

      <div className="px-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Pesanan</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalOrders}</div>
              <p className="text-xs text-muted-foreground">Semua pre-order</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Menunggu</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{pendingOrders}</div>
              <p className="text-xs text-muted-foreground">Menunggu diproses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Siap Diambil</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{readyOrders}</div>
              <p className="text-xs text-muted-foreground">Siap untuk diambil</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Darurat</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{urgentOrders}</div>
              <p className="text-xs text-muted-foreground">Pesanan prioritas tinggi</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Daftar Pre-Order</CardTitle>
                <CardDescription>Lacak dan kelola pre-order resep</CardDescription>
              </div>
              <Button onClick={() => setShowPreOrderForm(true)} className="">
                <Plus className="mr-2 h-4 w-4" />
                Pre-Order Baru
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex gap-4 items-center mb-6">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari pesanan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="pending">Menunggu</SelectItem>
                  <SelectItem value="ready">Siap</SelectItem>
                  <SelectItem value="completed">Selesai</SelectItem>
                  <SelectItem value="cancelled">Batal</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Prioritas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Prioritas</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="urgent">Mendesak</SelectItem>
                  <SelectItem value="emergency">Darurat</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Orders Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No. Pesanan</TableHead>
                    <TableHead>Pasien</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Tgl. Ambil</TableHead>
                    <TableHead>Prioritas</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Dibuat</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => {
                    const StatusIcon = getStatusIcon(order.status)
                    const hasPrescriptionItems = order.items.some((item) => item.prescription_required)

                    return (
                      <TableRow key={order.id}>
                        <TableCell>
                          <div className="font-medium">{order.order_number}</div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.member_name}</p>
                            {hasPrescriptionItems && (
                              <Badge variant="outline" className="text-xs mt-1">
                                Resep Diperlukan
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.items.length} item</p>
                            <p className="text-xs text-muted-foreground">
                              {order.items
                                .slice(0, 2)
                                .map((item) => item.product_name)
                                .join(", ")}
                              {order.items.length > 2 && "..."}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{formatRupiah(order.total)}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{new Date(order.pickup_date).toLocaleDateString('id-ID')}</span>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(order.priority)}>{getPriorityLabel(order.priority)}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <StatusIcon className="h-4 w-4" />
                            <Badge className={getStatusColor(order.status)}>{getStatusLabel(order.status)}</Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(order.created_at), { addSuffix: true, locale: id })}
                          </span>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Tindakan</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                Lihat Detail
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleStatusChange(order.id, "ready")}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Tandai Siap
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(order.id, "completed")}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Tandai Selesai
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(order.id, "cancelled")}>
                                <XCircle className="mr-2 h-4 w-4" />
                                Batalkan Pesanan
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {filteredOrders.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">Tidak ada pre-order yang cocok dengan kriteria Anda.</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pre-Order Form Dialog */}
      <PreOrderForm open={showPreOrderForm} onOpenChange={setShowPreOrderForm} onSubmit={handleCreatePreOrder} />
    </div>
  )
}
