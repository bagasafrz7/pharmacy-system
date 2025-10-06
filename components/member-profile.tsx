// member-profile.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { User, Phone, Mail, MapPin, Calendar, Heart, AlertTriangle, ShoppingCart, Clock, Edit } from "lucide-react"
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

interface Member {
  id: string
  membershipId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: Date
  gender: string
  address: string
  emergencyContact: string
  emergencyPhone: string
  membershipType: string
  status: string
  joinDate: Date
  totalPurchases: number
  lastVisit: Date
  allergies: string[]
  medicalConditions: string[]
  notes: string
  purchaseHistory: Array<{
    id: string
    date: Date
    total: number
    items: number
  }>
}

interface MemberProfileProps {
  member: Member
  onEdit: () => void
  onClose: () => void
}

export function MemberProfile({ member, onEdit, onClose }: MemberProfileProps) {
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
        {label === 'Senior' ? 'Lansia' : label === 'Student' ? 'Pelajar' : label}
      </Badge>
    )
  }

  const age = new Date().getFullYear() - member.dateOfBirth.getFullYear();

  return (
    <div className="space-y-6">
      {/* Header Profil */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">
            {member.firstName} {member.lastName}
          </h2>
          <p className="text-muted-foreground">ID Anggota: {member.membershipId}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Ubah
          </Button>
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informasi Pribadi */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informasi Pribadi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{member.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{member.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {format(member.dateOfBirth, "dd MMMM yyyy", { locale: id })} ({age} tahun)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{member.gender.charAt(0).toUpperCase() + member.gender.slice(1)}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                <span>{member.address}</span>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Kontak Darurat</h4>
                <div className="space-y-1 text-sm">
                  <div>{member.emergencyContact}</div>
                  <div className="text-muted-foreground">{member.emergencyPhone}</div>
                </div>
              </div>

              {member.notes && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Catatan</h4>
                    <p className="text-sm text-muted-foreground">{member.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Informasi Medis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Informasi Medis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  Alergi
                </h4>
                <div className="flex flex-wrap gap-2">
                  {member.allergies.length > 0 ? (
                    member.allergies.map((allergy, index) => (
                      <Badge key={index} variant="destructive">
                        {allergy}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">Tidak ada alergi yang diketahui</span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Kondisi Medis</h4>
                <div className="flex flex-wrap gap-2">
                  {member.medicalConditions.length > 0 ? (
                    member.medicalConditions.map((condition, index) => (
                      <Badge key={index} variant="secondary">
                        {condition}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">Tidak ada kondisi medis tercatat</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Riwayat Pembelian */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Riwayat Pembelian Terbaru
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {member.purchaseHistory.slice(0, 5).map((purchase) => (
                  <div key={purchase.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{formatRupiah(purchase.total)}</div>
                      <div className="text-sm text-muted-foreground">
                        {purchase.items} item • {format(purchase.date, "dd MMM yyyy", { locale: id })}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Lihat Detail
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ringkasan Keanggotaan */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan Keanggotaan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Status</span>
                {getStatusBadge(member.status)}
              </div>
              <div className="flex justify-between items-center">
                <span>Tipe</span>
                {getMembershipBadge(member.membershipType)}
              </div>
              <div className="flex justify-between items-center">
                <span>Anggota Sejak</span>
                <span className="text-sm">{format(member.joinDate, "MMM yyyy", { locale: id })}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Kunjungan Terakhir</span>
                <span className="text-sm flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {format(member.lastVisit, "dd MMM yyyy", { locale: id })}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistik Pembelian</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{formatRupiah(member.totalPurchases)}</div>
                <div className="text-sm text-muted-foreground">Total Pembelian</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{member.purchaseHistory.length}</div>
                <div className="text-sm text-muted-foreground">Total Transaksi</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {formatRupiah(Math.round(member.totalPurchases / member.purchaseHistory.length))}
                </div>
                <div className="text-sm text-muted-foreground">Rata-rata Pembelian</div>
              </div>
            </CardContent>
          </Card>

          {member.membershipType === "premium" && (
            <Card>
              <CardHeader>
                <CardTitle>Keuntungan Premium</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Diskon 10% untuk semua pembelian</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Pemrosesan resep prioritas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Pengiriman ke rumah gratis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Diskon konsultasi kesehatan</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
