// page.tsx (prescriptions)
"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { PrescriptionForm } from "@/components/prescription-form"
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
import { Plus, MoreHorizontal, Eye, CheckCircle, XCircle, Clock, Search, FileText, Stethoscope } from "lucide-react"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale" // Import locale Indonesia
import { useAuth } from "@/hooks/use-auth"

interface Prescription {
  id: string
  prescription_number: string
  member_id: string
  member_name?: string
  doctor_name: string
  doctor_license: string
  medications: Array<{
    name: string
    dosage: string
    frequency: string
    duration: string
    quantity: string
    instructions: string
  }>
  diagnosis?: string
  prescription_date: string
  valid_until?: string
  status: "pending_review" | "approved" | "rejected" | "dispensed"
  notes?: string
  created_at: string
  reviewed_by?: string
  reviewed_at?: string
}

export default function PrescriptionsPage() {
  const { user } = useAuth()
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const handleCreatePrescription = (prescriptionData: any) => {
    const newPrescription: Prescription = {
      ...prescriptionData,
      member_name: "John Smith", // Dalam aplikasi nyata, akan mencari dari member_id
      id: `RX${Date.now()}`,
    }
    setPrescriptions([newPrescription, ...prescriptions])
    toast.success(`Resep ${prescriptionData.prescription_number} berhasil diajukan untuk ditinjau!`)
    setShowPrescriptionForm(false)
  }

  const handleStatusChange = (prescriptionId: string, newStatus: Prescription["status"]) => {
    setPrescriptions(
      prescriptions.map((prescription) =>
        prescription.id === prescriptionId
          ? {
              ...prescription,
              status: newStatus,
              // Mencatat siapa dan kapan resep ditinjau
              reviewed_by: user?.name || "Sistem", 
              reviewed_at: new Date().toISOString(),
            }
          : prescription,
      ),
    )
    
    const statusLabel = getStatusLabel(newStatus);
    toast.success(`Status resep diperbarui menjadi ${statusLabel}`)
  }
  
  const getStatusLabel = (status: Prescription["status"]) => {
    switch (status) {
      case "pending_review": return "Menunggu Tinjauan";
      case "approved": return "Disetujui";
      case "rejected": return "Ditolak";
      case "dispensed": return "Disediakan";
      default: return status.replace("_", " ");
    }
  }

  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const matchesSearch =
      prescription.prescription_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.member_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.doctor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.medications.some((med) => med.name.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || prescription.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: Prescription["status"]) => {
    switch (status) {
      case "pending_review":
        return "bg-warning/10 text-warning"
      case "approved":
        return "bg-success/10 text-success"
      case "rejected":
        return "bg-destructive/10 text-destructive"
      case "dispensed":
        return "bg-primary/10 text-primary"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusIcon = (status: Prescription["status"]) => {
    switch (status) {
      case "pending_review":
        return Clock
      case "approved":
        return CheckCircle
      case "rejected":
        return XCircle
      case "dispensed":
        return Stethoscope // Menggunakan Stethoscope untuk yang sudah disiapkan
      default:
        return Clock
    }
  }

  // Hitung Statistik
  const totalPrescriptions = prescriptions.length
  const pendingReview = prescriptions.filter((p) => p.status === "pending_review").length
  const approved = prescriptions.filter((p) => p.status === "approved").length
  const dispensed = prescriptions.filter((p) => p.status === "dispensed").length

  // Periksa izin pengguna untuk meninjau
  const canReviewPrescriptions = user?.role === "pharmacist" || user?.role === "super_admin"

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Resep Digital"
        description="Kelola resep digital dan peninjauan oleh apoteker"
      />

      <div className="px-6 space-y-6">
        {/* Kartu Statistik */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Resep</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalPrescriptions}</div>
              <p className="text-xs text-muted-foreground">Semua resep tercatat</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Menunggu Tinjauan</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{pendingReview}</div>
              <p className="text-xs text-muted-foreground">Menunggu tinjauan apoteker</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Disetujui</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{approved}</div>
              <p className="text-xs text-muted-foreground">Siap untuk disiapkan/disediakan</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Disediakan</CardTitle>
              <Stethoscope className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{dispensed}</div>
              <p className="text-xs text-muted-foreground">Resep yang sudah selesai</p>
            </CardContent>
          </Card>
        </div>

        {/* Konten Utama */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Manajemen Resep</CardTitle>
                <CardDescription>Tinjau dan kelola resep digital</CardDescription>
              </div>
              <Button onClick={() => setShowPrescriptionForm(true)} className="">
                <Plus className="mr-2 h-4 w-4" />
                Resep Baru
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filter */}
            <div className="flex gap-4 items-center mb-6">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari resep..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="pending_review">Menunggu Tinjauan</SelectItem>
                  <SelectItem value="approved">Disetujui</SelectItem>
                  <SelectItem value="rejected">Ditolak</SelectItem>
                  <SelectItem value="dispensed">Disediakan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tabel Resep */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resep #</TableHead>
                    <TableHead>Pasien</TableHead>
                    <TableHead>Dokter</TableHead>
                    <TableHead>Obat</TableHead>
                    <TableHead>Tgl. Resep</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Dibuat</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPrescriptions.map((prescription) => {
                    const StatusIcon = getStatusIcon(prescription.status)

                    return (
                      <TableRow key={prescription.id}>
                        <TableCell>
                          <div className="font-medium">{prescription.prescription_number}</div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{prescription.member_name}</p>
                            {prescription.diagnosis && (
                              <p className="text-xs text-muted-foreground">Dx: {prescription.diagnosis}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{prescription.doctor_name}</p>
                            <p className="text-xs text-muted-foreground">Lisensi: {prescription.doctor_license}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{prescription.medications.length} jenis obat</p>
                            <p className="text-xs text-muted-foreground">
                              {prescription.medications
                                .slice(0, 2)
                                .map((med) => med.name)
                                .join(", ")}
                              {prescription.medications.length > 2 && "..."}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {new Date(prescription.prescription_date).toLocaleDateString('id-ID')}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <StatusIcon className="h-4 w-4" />
                            <Badge className={getStatusColor(prescription.status)}>
                              {getStatusLabel(prescription.status)}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(prescription.created_at), { addSuffix: true, locale: id })}
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
                              {canReviewPrescriptions && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleStatusChange(prescription.id, "approved")}>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Setujui
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusChange(prescription.id, "rejected")}>
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Tolak
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusChange(prescription.id, "dispensed")}>
                                    <Stethoscope className="mr-2 h-4 w-4" />
                                    Tandai Disediakan
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {filteredPrescriptions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Tidak ada resep yang ditemukan sesuai kriteria Anda.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog Formulir Resep */}
      <PrescriptionForm
        open={showPrescriptionForm}
        onOpenChange={setShowPrescriptionForm}
        onSubmit={handleCreatePrescription}
      />
    </div>
  )
}
