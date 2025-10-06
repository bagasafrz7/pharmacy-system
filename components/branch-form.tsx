// branch-form.tsx
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2 } from "lucide-react"

// Fungsi Helper untuk format Rupiah (digunakan untuk menampilkan target)
const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Mock Data untuk Manajer dan Status
const mockManagers = [
    { id: "M1", name: "Dr. Maria Santos" },
    { id: "M2", name: "Dr. Jose Dela Cruz" },
    { id: "M3", name: "Dr. Elena Rodriguez" },
];

const mockStatuses = [
    { value: "active", label: "Aktif" },
    { value: "maintenance", label: "Pemeliharaan" },
    { value: "temporarily_closed", label: "Tutup Sementara" },
    { value: "inactive", label: "Nonaktif" },
];

interface Branch {
  id?: string // Opsional karena tidak ada saat menambah baru
  name: string
  code: string
  address: string
  phone: string
  manager: string
  status: string
  monthlyTarget: number
  staffCount: number
  openingHours: string
  // Detail lainnya akan diisi di page.tsx saat disimpan
}

interface BranchFormProps {
  branch?: Branch
  onSubmit: (branchData: Branch & { id?: string }) => void
  onCancel: () => void
}

const getInitialFormData = (branch?: Branch) => ({
    id: branch?.id || undefined,
    name: branch?.name || "",
    code: branch?.code || "",
    address: branch?.address || "",
    phone: branch?.phone || "",
    manager: branch?.manager || "",
    status: branch?.status || "active",
    // Menggunakan string untuk input numerik
    monthlyTarget: branch?.monthlyTarget || 0,
    staffCount: branch?.staffCount || 0,
    openingHours: branch?.openingHours || "9:00 AM - 9:00 PM",
});


export function BranchForm({ branch, onSubmit, onCancel }: BranchFormProps) {
  // Menggunakan state lokal untuk mengelola input form
  const [formData, setFormData] = useState<Branch>(getInitialFormData(branch) as Branch);

  // Sinkronisasi form saat branch prop berubah (saat mode edit dibuka)
  useEffect(() => {
    setFormData(getInitialFormData(branch) as Branch);
  }, [branch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const branchDataToSend = {
        ...formData,
        // Konversi nilai numerik (yang mungkin berupa string dari input) kembali ke number
        monthlyTarget: Number(formData.monthlyTarget),
        staffCount: Number(formData.staffCount),
    };

    onSubmit(branchDataToSend);
    // Reset form dilakukan di parent component (page.tsx) melalui onOpenChange
  };
  
  const handleInputChange = (field: keyof Branch, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isEditing = !!branch;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Informasi Utama Cabang */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Building2 className="h-4 w-4"/>
                Detail Utama
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nama Cabang *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Contoh: Cabang Utama - Jakarta"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="code">Kode Cabang *</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => handleInputChange("code", e.target.value)}
                      placeholder="Contoh: JKT"
                      required
                    />
                </div>
                <div>
                    <Label htmlFor="phone">Telepon *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="Contoh: +62 21 1234 5678"
                      required
                    />
                </div>
            </div>

            <div>
              <Label htmlFor="address">Alamat *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                rows={3}
                placeholder="Alamat lengkap cabang..."
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Operasional & Target */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Operasional & Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="manager">Manajer Cabang *</Label>
              <Select
                value={formData.manager}
                onValueChange={(value) => handleInputChange("manager", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih manajer" />
                </SelectTrigger>
                <SelectContent>
                  {mockManagers.map((m) => (
                    <SelectItem key={m.id} value={m.name}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="staffCount">Jumlah Staf</Label>
                    <Input
                      id="staffCount"
                      type="number"
                      value={formData.staffCount}
                      onChange={(e) => handleInputChange("staffCount", e.target.value)}
                      min="0"
                      placeholder="Contoh: 10"
                    />
                </div>
                <div>
                    <Label htmlFor="status">Status Cabang *</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleInputChange("status", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockStatuses.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                </div>
            </div>

            <div>
              <Label htmlFor="openingHours">Jam Operasional</Label>
              <Input
                id="openingHours"
                value={formData.openingHours}
                onChange={(e) => handleInputChange("openingHours", e.target.value)}
                placeholder="Contoh: 8:00 AM - 10:00 PM"
              />
            </div>

            <div>
              <Label htmlFor="monthlyTarget">Target Penjualan Bulanan (Rp) *</Label>
              <Input
                id="monthlyTarget"
                type="number"
                step="10000"
                value={formData.monthlyTarget}
                onChange={(e) => handleInputChange("monthlyTarget", e.target.value)}
                placeholder="Contoh: 100000000"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Target Saat Ini: {formatRupiah(Number(formData.monthlyTarget))}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit">
          {isEditing ? "Perbarui Cabang" : "Tambah Cabang"}
        </Button>
      </div>
    </form>
  )
}
