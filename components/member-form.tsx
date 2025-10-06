// member-form.tsx
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog" // Import Dialog components
// Hapus import: Calendar, Popover, PopoverContent, PopoverTrigger, CalendarIcon, format
import { Plus, X } from "lucide-react"

// --- Helper Functions ---
// Fungsi Helper untuk mengkonversi Date ke string YYYY-MM-DD
const formatDateToString = (date?: Date): string => {
    if (!date || isNaN(date.getTime())) return "";
    return date.toISOString().split('T')[0];
};

// Fungsi Helper untuk mengkonversi string YYYY-MM-DD ke Date object
const parseStringToDate = (dateString: string): Date | undefined => {
    if (!dateString) return undefined;
    // Menggunakan offset 0 untuk mencegah masalah zona waktu
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
};
// -----------------------

interface Member {
  id?: string
  membershipId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  // Mengubah DateOfBirth menjadi string untuk input natif di state form
  dateOfBirth: string | undefined 
  gender: string
  address: string
  emergencyContact: string
  emergencyPhone: string
  membershipType: string
  allergies: string[]
  medicalConditions: string[]
  notes: string
  status: string
}

interface MemberFormProps {
  member?: any // Menggunakan 'any' sementara karena DOB di mock adalah Date
  isEdit: boolean 
  onSubmit: (member: any) => void // Menggunakan 'any' karena DOB dikirim sebagai Date object
  onCancel: () => void
}

const getInitialFormData = (member?: any): Member => {
    // Konversi Date object dari mock/prop menjadi string YYYY-MM-DD
    const dobString = formatDateToString(member?.dateOfBirth);

    return {
        membershipId: member?.membershipId || `MEM${String(Date.now()).slice(-4)}`,
        firstName: member?.firstName || "",
        lastName: member?.lastName || "",
        email: member?.email || "",
        phone: member?.phone || "",
        dateOfBirth: dobString || undefined, // Simpan sebagai string
        gender: member?.gender || "",
        address: member?.address || "",
        emergencyContact: member?.emergencyContact || "",
        emergencyPhone: member?.emergencyPhone || "",
        membershipType: member?.membershipType || "regular",
        allergies: member?.allergies || [],
        medicalConditions: member?.medicalConditions || [],
        notes: member?.notes || "",
        status: member?.status || "active",
    }
};


export function MemberForm({ member, isEdit, onSubmit, onCancel }: MemberFormProps) {
  const [formData, setFormData] = useState<Member>(getInitialFormData(member))
  const [newAllergy, setNewAllergy] = useState("")
  const [newCondition, setNewCondition] = useState("")

  useEffect(() => {
    if (member) {
      setFormData(getInitialFormData(member));
    } else if (!isEdit) {
      setFormData(getInitialFormData());
    }
  }, [member, isEdit]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Konversi dateOfBirth (string) kembali menjadi Date object untuk onSubmit
    const memberDataToSend = {
        ...formData,
        dateOfBirth: parseStringToDate(formData.dateOfBirth || ''),
        id: member?.id, // Sertakan ID hanya jika dalam mode edit
    };

    onSubmit(memberDataToSend);
  }

  const handleInputChange = (field: keyof Member, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addAllergy = () => {
    if (newAllergy.trim()) {
      setFormData((prev) => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()],
      }))
      setNewAllergy("")
    }
  }

  const removeAllergy = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index),
    }))
  }

  const addCondition = () => {
    if (newCondition.trim()) {
      setFormData((prev) => ({
        ...prev,
        medicalConditions: [...prev.medicalConditions, newCondition.trim()],
      }))
      setNewCondition("")
    }
  }

  const removeCondition = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      medicalConditions: prev.medicalConditions.filter((_, i) => i !== index),
    }))
  }

  return (
    <DialogContent className="!max-w-4xl !w-full max-h-[90vh] overflow-y-auto"> {/* UKURAN DIALOG DIPERBESAR */}
      <DialogHeader>
        <DialogTitle>{member ? "Ubah Anggota" : "Tambah Anggota Baru"}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informasi Dasar */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Dasar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="membershipId">ID Keanggotaan</Label>
                <Input
                  id="membershipId"
                  value={formData.membershipId}
                  onChange={(e) => handleInputChange("membershipId", e.target.value)}
                  required
                  disabled={isEdit} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Nama Depan *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Nama Belakang *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Telepon *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tanggal Lahir</Label>
                  {/* PERUBAHAN: INPUT TANGGAL NATIF */}
                  <Input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="gender">Jenis Kelamin</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => handleInputChange("gender", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis kelamin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Laki-laki</SelectItem>
                      <SelectItem value="female">Perempuan</SelectItem>
                      <SelectItem value="other">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="address">Alamat</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  rows={3}
                  placeholder="Alamat lengkap..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Kontak Darurat & Keanggotaan */}
          <Card>
            <CardHeader>
              <CardTitle>Kontak Darurat & Keanggotaan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="emergencyContact">Nama Kontak Darurat</Label>
                <Input
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                  placeholder="Nama kontak darurat"
                />
              </div>

              <div>
                <Label htmlFor="emergencyPhone">Telepon Kontak Darurat</Label>
                <Input
                  id="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                  placeholder="Nomor telepon"
                />
              </div>

              <div>
                <Label htmlFor="membershipType">Tipe Keanggotaan</Label>
                <Select
                  value={formData.membershipType}
                  onValueChange={(value) => handleInputChange("membershipType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tipe keanggotaan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="senior">Lansia</SelectItem>
                    <SelectItem value="student">Pelajar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="inactive">Nonaktif</SelectItem>
                    <SelectItem value="suspended">Ditangguhkan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes">Catatan</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  rows={4}
                  placeholder="Catatan tambahan tentang anggota..."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Informasi Medis */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Medis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Alergi</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  placeholder="Tambahkan alergi..."
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAllergy())}
                />
                <Button type="button" onClick={addAllergy} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.allergies.map((allergy, index) => (
                  <Badge key={index} variant="destructive" className="flex items-center gap-1">
                    {allergy}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeAllergy(index)} />
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label>Kondisi Medis</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  placeholder="Tambahkan kondisi medis..."
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCondition())}
                />
                <Button type="button" onClick={addCondition} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.medicalConditions.map((condition, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {condition}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeCondition(index)} />
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Batal
          </Button>
          <Button type="submit">{member ? "Perbarui Anggota" : "Tambah Anggota"}</Button>
        </div>
      </form>
    </DialogContent>
  )
}
