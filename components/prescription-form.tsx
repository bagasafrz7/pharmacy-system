// presciption-form.tsx
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// Hapus imports Calendar, Popover, CalendarIcon, format, cn
import { FileText, User, Stethoscope, Upload, Minus, Plus } from "lucide-react"
import { mockData } from "@/lib/mock-data"

// Helper function to format Date object to "YYYY-MM-DD" string
const formatDateToInput = (date: Date): string => {
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split('T')[0];
};

interface Member {
  id: string
  name: string
  email: string
  phone: string
  allergies: string[]
  medical_conditions: string[]
}

interface PrescriptionFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (prescriptionData: any) => void
}

const frequencyOptions = [
  { value: "once_daily", label: "Sekali sehari" },
  { value: "twice_daily", label: "Dua kali sehari" },
  { value: "three_times_daily", label: "Tiga kali sehari" },
  { value: "four_times_daily", label: "Empat kali sehari" },
  { value: "as_needed", label: "Sesuai kebutuhan" },
]

// State Awal untuk reset form
const getInitialMedicationState = () => ([
    {
        id: 1,
        name: "",
        dosage: "",
        frequency: "",
        duration: "",
        quantity: "",
        instructions: "",
    },
]);


export function PrescriptionForm({ open, onOpenChange, onSubmit }: PrescriptionFormProps) {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [memberSearch, setMemberSearch] = useState("")
  const [doctorName, setDoctorName] = useState("")
  const [doctorLicense, setDoctorLicense] = useState("")
  const [medications, setMedications] = useState(getInitialMedicationState())
  const [diagnosis, setDiagnosis] = useState("")
  const [prescriptionDate, setPrescriptionDate] = useState<string>(formatDateToInput(new Date()))
  const [validUntil, setValidUntil] = useState<string>("") // Menggunakan string untuk input natif
  const [notes, setNotes] = useState("")
  const [prescriptionImage, setPrescriptionImage] = useState<File | null>(null)

  const members = mockData.members as Member[]

  // Reset Form saat ditutup/dibuka
  useEffect(() => {
    if (!open) {
      setSelectedMember(null)
      setMemberSearch("")
      setDoctorName("")
      setDoctorLicense("")
      setMedications(getInitialMedicationState())
      setDiagnosis("")
      setPrescriptionDate(formatDateToInput(new Date()))
      setValidUntil("")
      setNotes("")
      setPrescriptionImage(null)
    }
  }, [open]);


  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      member.email.toLowerCase().includes(memberSearch.toLowerCase()) ||
      member.phone.includes(memberSearch.toLowerCase()),
  )

  const addMedication = () => {
    setMedications([
      ...medications,
      {
        id: Date.now(),
        name: "",
        dosage: "",
        frequency: "",
        duration: "",
        quantity: "",
        instructions: "",
      },
    ])
  }

  const updateMedication = (id: number, field: string, value: string) => {
    setMedications(medications.map((med) => (med.id === id ? { ...med, [field]: value } : med)))
  }

  const removeMedication = (id: number) => {
    if (medications.length > 1) {
      setMedications(medications.filter((med) => med.id !== id))
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPrescriptionImage(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMember || !doctorName || !doctorLicense) return

    const prescriptionData = {
      id: `RX${Date.now()}`,
      prescription_number: `RX${String(Date.now()).slice(-6)}`,
      member_id: selectedMember.id,
      doctor_name: doctorName,
      doctor_license: doctorLicense,
      medications: medications.filter((med) => med.name.trim() !== ""),
      diagnosis,
      prescription_date: prescriptionDate, // String YYYY-MM-DD
      valid_until: validUntil || null,      // String YYYY-MM-DD atau null
      notes,
      status: "pending_review",
      created_at: new Date().toISOString(),
      prescription_image: prescriptionImage?.name || null,
    }

    onSubmit(prescriptionData)

    // Reset form dipanggil oleh useEffect setelah onSubmit
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} size>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Input Resep Digital
          </DialogTitle>
          <DialogDescription>Masukkan detail resep untuk ditinjau dan disetujui apoteker</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pemilihan Pasien */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4" />
                Informasi Pasien *
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedMember ? (
                <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">{selectedMember.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedMember.email}</p>
                      <p className="text-sm text-muted-foreground">{selectedMember.phone}</p>
                      {selectedMember.allergies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          <span className="text-xs text-muted-foreground">Alergi:</span>
                          {selectedMember.allergies.map((allergy) => (
                            <Badge key={allergy} variant="destructive" className="text-xs">
                              {allergy}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {selectedMember.medical_conditions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          <span className="text-xs text-muted-foreground">Kondisi Medis:</span>
                          {selectedMember.medical_conditions.map((condition) => (
                            <Badge key={condition} variant="secondary" className="text-xs">
                              {condition}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setSelectedMember(null)}>
                      Ganti
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <Input
                    placeholder="Cari pasien berdasarkan nama, email, atau telepon..."
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                  />
                  {memberSearch && (
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {filteredMembers.map((member) => (
                        <div
                          key={member.id}
                          className="p-2 hover:bg-muted rounded cursor-pointer"
                          onClick={() => setSelectedMember(member)}
                        >
                          <p className="font-medium text-sm">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informasi Dokter */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Stethoscope className="h-4 w-4" />
                Dokter Pemberi Resep *
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="doctor_name">Nama Dokter *</Label>
                  <Input
                    id="doctor_name"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    placeholder="Contoh: Dr. Rina Kusuma"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctor_license">Nomor Izin Praktik *</Label>
                  <Input
                    id="doctor_license"
                    value={doctorLicense}
                    onChange={(e) => setDoctorLicense(e.target.value)}
                    placeholder="Contoh: SIP 123456789"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Obat yang Diresepkan */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Obat yang Diresepkan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {medications.map((medication, index) => (
                  <div key={medication.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Obat {index + 1}</h4>
                      {medications.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMedication(medication.id)}
                          className="text-destructive"
                        >
                          <Minus className="h-4 w-4 mr-1" /> Hapus
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Nama Obat *</Label>
                        <Input
                          value={medication.name}
                          onChange={(e) => updateMedication(medication.id, "name", e.target.value)}
                          placeholder="Contoh: Amoxicillin"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Dosis *</Label>
                        <Input
                          value={medication.dosage}
                          onChange={(e) => updateMedication(medication.id, "dosage", e.target.value)}
                          placeholder="Contoh: 500mg"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-2">
                        <Label>Frekuensi *</Label>
                        <Select
                          value={medication.frequency}
                          onValueChange={(value) => updateMedication(medication.id, "frequency", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih frekuensi" />
                          </SelectTrigger>
                          <SelectContent>
                            {frequencyOptions.map(opt => (
                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Durasi</Label>
                        <Input
                          value={medication.duration}
                          onChange={(e) => updateMedication(medication.id, "duration", e.target.value)}
                          placeholder="Contoh: 7 hari"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Kuantitas</Label>
                        <Input
                          value={medication.quantity}
                          onChange={(e) => updateMedication(medication.id, "quantity", e.target.value)}
                          placeholder="Contoh: 30 tablet"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Instruksi Khusus</Label>
                      <Textarea
                        value={medication.instructions}
                        onChange={(e) => updateMedication(medication.id, "instructions", e.target.value)}
                        placeholder="Minum setelah makan, hindari alkohol, dll."
                        rows={2}
                      />
                    </div>
                  </div>
                ))}

                <Button type="button" variant="outline" onClick={addMedication} className="w-full bg-transparent">
                  <Plus className="h-4 w-4 mr-2" /> Tambah Obat Lain
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Informasi Tambahan */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Detail Resep</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Diagnosis</Label>
                  <Input
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="Contoh: Infeksi Bakteri"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tanggal Resep</Label>
                  {/* INPUT TANGGAL NATIF */}
                  <Input
                    type="date"
                    value={prescriptionDate}
                    onChange={(e) => setPrescriptionDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Berlaku Sampai</Label>
                  {/* INPUT TANGGAL NATIF */}
                  <Input
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    min={prescriptionDate} // Berlaku setelah tanggal resep
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Informasi Tambahan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Gambar Resep</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="prescription-upload"
                    />
                    <Label
                      htmlFor="prescription-upload"
                      className="flex items-center gap-2 px-3 py-2 border rounded-md cursor-pointer hover:bg-muted"
                    >
                      <Upload className="h-4 w-4" />
                      Unggah Gambar
                    </Label>
                    {prescriptionImage && (
                      <span className="text-sm text-muted-foreground">{prescriptionImage.name}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Catatan Tambahan</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Catatan atau pertimbangan khusus..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button
              type="submit"
              className=""
              disabled={!selectedMember || !doctorName || !doctorLicense || medications.filter(med => med.name.trim() !== "").length === 0}
            >
              Ajukan untuk Ditinjau
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
