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
      member_name: "John Smith", // In real app, would lookup from member_id
    }
    setPrescriptions([newPrescription, ...prescriptions])
    toast.success(`Prescription ${prescriptionData.prescription_number} submitted for review!`)
  }

  const handleStatusChange = (prescriptionId: string, newStatus: Prescription["status"]) => {
    setPrescriptions(
      prescriptions.map((prescription) =>
        prescription.id === prescriptionId
          ? {
              ...prescription,
              status: newStatus,
              reviewed_by: user?.name,
              reviewed_at: new Date().toISOString(),
            }
          : prescription,
      ),
    )
    toast.success(`Prescription status updated to ${newStatus}`)
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
        return CheckCircle
      default:
        return Clock
    }
  }

  // Calculate stats
  const totalPrescriptions = prescriptions.length
  const pendingReview = prescriptions.filter((p) => p.status === "pending_review").length
  const approved = prescriptions.filter((p) => p.status === "approved").length
  const dispensed = prescriptions.filter((p) => p.status === "dispensed").length

  // Check if user has pharmacist permissions
  const canReviewPrescriptions = user?.role === "pharmacist" || user?.role === "super_admin"

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Digital Prescriptions"
        description="Manage digital prescriptions and pharmacist reviews"
      />

      <div className="px-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Prescriptions</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalPrescriptions}</div>
              <p className="text-xs text-muted-foreground">All prescriptions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{pendingReview}</div>
              <p className="text-xs text-muted-foreground">Awaiting pharmacist review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{approved}</div>
              <p className="text-xs text-muted-foreground">Ready for dispensing</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Dispensed</CardTitle>
              <Stethoscope className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{dispensed}</div>
              <p className="text-xs text-muted-foreground">Completed prescriptions</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Prescription Management</CardTitle>
                <CardDescription>Review and manage digital prescriptions</CardDescription>
              </div>
              <Button onClick={() => setShowPrescriptionForm(true)} className="">
                <Plus className="mr-2 h-4 w-4" />
                New Prescription
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex gap-4 items-center mb-6">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search prescriptions..."
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
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending_review">Pending Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="dispensed">Dispensed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Prescriptions Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Prescription #</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Medications</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
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
                              <p className="text-xs text-muted-foreground">{prescription.diagnosis}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{prescription.doctor_name}</p>
                            <p className="text-xs text-muted-foreground">License: {prescription.doctor_license}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{prescription.medications.length} medications</p>
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
                            {new Date(prescription.prescription_date).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <StatusIcon className="h-4 w-4" />
                            <Badge className={getStatusColor(prescription.status)}>
                              {prescription.status.replace("_", " ")}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(prescription.created_at), { addSuffix: true })}
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
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              {canReviewPrescriptions && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleStatusChange(prescription.id, "approved")}>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusChange(prescription.id, "rejected")}>
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Reject
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusChange(prescription.id, "dispensed")}>
                                    <Stethoscope className="mr-2 h-4 w-4" />
                                    Mark Dispensed
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
                No prescriptions found matching your criteria.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Prescription Form Dialog */}
      <PrescriptionForm
        open={showPrescriptionForm}
        onOpenChange={setShowPrescriptionForm}
        onSubmit={handleCreatePrescription}
      />
    </div>
  )
}
