// member-table.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Edit, Eye, UserPlus, Filter } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale" // Import locale Indonesia

// Fungsi Helper untuk format Rupiah
const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

interface Member {
  id: string
  membershipId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: Date
  membershipType: string
  status: string
  joinDate: Date
  totalPurchases: number
  lastVisit: Date
}

interface MemberTableProps {
  members: Member[]
  onEdit: (member: Member) => void
  onView: (member: Member) => void
  onAdd: () => void
}

export function MemberTable({ members, onEdit, onView, onAdd }: MemberTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [membershipFilter, setMembershipFilter] = useState("all")

  const filteredMembers = members.filter((member) => {
    const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
    const searchLower = searchTerm.toLowerCase();

    const matchesSearch =
      fullName.includes(searchLower) ||
      member.membershipId.toLowerCase().includes(searchLower) ||
      member.email.toLowerCase().includes(searchLower) ||
      member.phone.includes(searchTerm)

    const matchesStatus = statusFilter === "all" || member.status === statusFilter
    const matchesMembership = membershipFilter === "all" || member.membershipType === membershipFilter

    return matchesSearch && matchesStatus && matchesMembership
  })

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      inactive: "secondary",
      suspended: "destructive",
    } as const

    const label = status === "active" ? "Aktif" : status === "inactive" ? "Nonaktif" : "Ditangguhkan";

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {label}
      </Badge>
    )
  }

  const getMembershipBadge = (type: string) => {
    const variants = {
      regular: "outline",
      premium: "default",
      senior: "secondary",
      student: "outline",
    } as const
    
    const label = type.charAt(0).toUpperCase() + type.slice(1);

    return (
      <Badge variant={variants[type as keyof typeof variants] || "outline"}>
        {label}
      </Badge>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Daftar Anggota</CardTitle>
          <Button onClick={onAdd}>
            <UserPlus className="h-4 w-4 mr-2" />
            Tambah Anggota
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Cari anggota..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter berdasarkan status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="active">Aktif</SelectItem>
              <SelectItem value="inactive">Nonaktif</SelectItem>
              <SelectItem value="suspended">Ditangguhkan</SelectItem>
            </SelectContent>
          </Select>
          <Select value={membershipFilter} onValueChange={setMembershipFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter berdasarkan tipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tipe</SelectItem>
              <SelectItem value="regular">Regular</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="senior">Lansia</SelectItem>
              <SelectItem value="student">Pelajar</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabel Anggota */}
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Anggota</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Kontak</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tgl Gabung</TableHead>
                <TableHead>Total Beli</TableHead>
                <TableHead>Kunjungan Akhir</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.membershipId}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {member.firstName} {member.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Usia: {new Date().getFullYear() - member.dateOfBirth.getFullYear()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{member.email}</div>
                      <div className="text-muted-foreground">{member.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getMembershipBadge(member.membershipType)}</TableCell>
                  <TableCell>{getStatusBadge(member.status)}</TableCell>
                  <TableCell>{format(member.joinDate, "dd MMM yyyy", { locale: id })}</TableCell>
                  <TableCell>
                    <div className="font-medium">{formatRupiah(member.totalPurchases)}</div>
                  </TableCell>
                  <TableCell>{format(member.lastVisit, "dd MMM yyyy", { locale: id })}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => onView(member)} title="Lihat Profil">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => onEdit(member)} title="Ubah Data">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">Tidak ada anggota yang cocok dengan kriteria Anda.</div>
        )}
      </CardContent>
    </Card>
  )
}
