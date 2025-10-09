// page.tsx (member)
"use client"

import { useState } from "react"
import { MemberTable } from "@/components/member-table"
import { MemberForm } from "@/components/member-form"
import { MemberProfile } from "@/components/member-profile"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { v4 as uuidv4 } from 'uuid'; 

// Mock data - dalam aplikasi nyata, ini akan berasal dari API/database
const mockMembers = [
  {
    id: "1",
    membershipId: "MEM001",
    firstName: "Bagas",
    lastName: "Afrizal", // Nama keluarga sederhana
    email: "bagas@email.com",
    phone: "+62 812 3456 7890",
    dateOfBirth: new Date("1995-09-10"),
    gender: "male",
    address: "Jl. Merdeka No. 45, Jakarta Pusat",
    emergencyContact: "Rina Satria",
    emergencyPhone: "+62 812 0987 6543",
    membershipType: "premium",
    status: "active",
    joinDate: new Date("2023-01-15"),
    totalPurchases: 2500000, // Rupiah
    lastVisit: new Date("2024-09-20"),
    allergies: ["Paracetamol", "Udang"],
    medicalConditions: ["Hipertensi", "Diabetes Tipe 2"],
    notes: "Pelanggan reguler, lebih suka obat generik bila tersedia.",
    purchaseHistory: [
      { id: "1", date: new Date("2024-09-20"), total: 150000, items: 3 },
      { id: "2", date: new Date("2024-09-15"), total: 220000, items: 5 },
      { id: "3", date: new Date("2024-09-10"), total: 80000, items: 2 },
      { id: "4", date: new Date("2024-09-05"), total: 320000, items: 7 },
      { id: "5", date: new Date("2023-12-28"), total: 120000, items: 4 },
    ],
  },
  {
    id: "2",
    membershipId: "MEM002",
    firstName: "Saviola",
    lastName: "Saviola",
    email: "saviola@email.com",
    phone: "+62 856 7890 1234",
    dateOfBirth: new Date("2000-03-22"),
    gender: "female",
    address: "Komplek Hijau Blok C-12, Bandung",
    emergencyContact: "Budi Santoso",
    emergencyPhone: "+62 856 4321 0987",
    membershipType: "regular",
    status: "active",
    joinDate: new Date("2023-03-10"),
    totalPurchases: 1850000, // Rupiah
    lastVisit: new Date("2024-09-18"),
    allergies: [],
    medicalConditions: ["Asma"],
    notes: "Lebih suka janji temu pagi untuk konsultasi.",
    purchaseHistory: [
      { id: "6", date: new Date("2024-09-18"), total: 95000, items: 2 },
      { id: "7", date: new Date("2024-09-12"), total: 180000, items: 4 },
      { id: "8", date: new Date("2024-09-08"), total: 65000, items: 1 },
    ],
  },
  {
    id: "3",
    membershipId: "MEM003",
    firstName: "Adit",
    lastName: "Adit",
    email: "adit@email.com",
    phone: "+62 878 1234 5678",
    dateOfBirth: new Date("1988-11-28"),
    gender: "male",
    address: "Perumahan Indah Kav. B8, Surabaya",
    emergencyContact: "Siti Rahayu",
    emergencyPhone: "+62 878 8765 4321",
    membershipType: "senior",
    status: "active",
    joinDate: new Date("2022-08-20"),
    totalPurchases: 4200000, // Rupiah
    lastVisit: new Date("2024-09-19"),
    allergies: ["Aspirin"],
    medicalConditions: ["Artritis", "Kolesterol Tinggi"],
    notes: "Diskon lansia diterapkan. Membutuhkan bantuan manajemen obat.",
    purchaseHistory: [
      { id: "9", date: new Date("2024-09-19"), total: 210000, items: 6 },
      { id: "10", date: new Date("2024-09-14"), total: 175000, items: 5 },
      { id: "11", date: new Date("2024-09-09"), total: 280000, items: 8 },
    ],
  },
  {
    id: "5",
    membershipId: "MEM005",
    firstName: "Kaka", // Dipertahankan sebagai nama depan
    lastName: "Adit", // Nama keluarga sederhana
    email: "kakaadit@email.com",
    phone: "+62 811 0001 0002",
    dateOfBirth: new Date("2005-05-01"),
    gender: "male",
    address: "Apartemen Senayan Tower 3, Jakarta Selatan",
    emergencyContact: "Dewi Wijaya",
    emergencyPhone: "+62 811 2000 3000",
    membershipType: "regular",
    status: "inactive",
    joinDate: new Date("2023-05-18"),
    totalPurchases: 1200000, // Rupiah
    lastVisit: new Date("2023-12-15"),
    allergies: ["Obat Sulfa"],
    medicalConditions: ["Migrain"],
    notes: "Pindah ke kota lain. Akun tidak aktif sejak Desember 2023.",
    purchaseHistory: [
      { id: "15", date: new Date("2023-12-15"), total: 120000, items: 3 },
      { id: "16", date: new Date("2023-12-08"), total: 85000, items: 2 },
      { id: "17", date: new Date("2023-11-28"), total: 150000, items: 4 },
    ],
  },
  {
    id: "6", // ID diubah karena id 4 dan 5 sudah ada
    membershipId: "MEM006",
    firstName: "Ariel",
    lastName: "Ariel",
    email: "ariel@email.com",
    phone: "+62 813 5555 6666",
    dateOfBirth: new Date("1975-01-08"),
    gender: "male",
    address: "Jalan Kenanga No. 7, Yogyakarta",
    emergencyContact: "Lia Setiawan",
    emergencyPhone: "+62 813 7777 8888",
    membershipType: "premium",
    status: "active",
    joinDate: new Date("2024-04-10"),
    totalPurchases: 3100000, // Rupiah
    lastVisit: new Date("2024-09-01"),
    allergies: ["Aspirin"],
    medicalConditions: ["Hipertensi"],
    notes: "Pelanggan baru, memerlukan obat rutin bulanan.",
    purchaseHistory: [
      { id: "18", date: new Date("2024-09-01"), total: 1500000, items: 5 },
      { id: "19", date: new Date("2024-08-01"), total: 1600000, items: 6 },
    ],
  },
] as any

export default function MembersPage() {
  const [members, setMembers] = useState(mockMembers)
  const [selectedMember, setSelectedMember] = useState<any>(null)
  const [editingMember, setEditingMember] = useState<any>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const { toast } = useToast()

  const handleAddMember = (memberData: any) => {
    const newMember = {
      ...memberData,
      id: uuidv4(), // Gunakan uuid untuk ID unik
      membershipId: `MEM${String(Date.now()).slice(-4)}`, // ID Keanggotaan sederhana
      joinDate: new Date(),
      totalPurchases: 0,
      lastVisit: new Date(),
      purchaseHistory: [],
    }
    setMembers((prev: any) => [...prev, newMember])
    setShowAddForm(false)
    toast({
      title: "Anggota Ditambahkan",
      description: `${memberData.firstName} ${memberData.lastName} berhasil ditambahkan.`,
    })
  }

  const handleEditMember = (memberData: any) => {
    setMembers((prev: any) =>
      prev.map((member: any) => (member.id === editingMember.id ? { ...member, ...memberData } : member)),
    )
    setEditingMember(null)
    toast({
      title: "Anggota Diperbarui",
      description: `${memberData.firstName} ${memberData.lastName} berhasil diperbarui.`,
    })
  }

  const handleViewMember = (member: any) => {
    setSelectedMember(member)
    setShowProfile(true)
  }

  const handleEditClick = (member: any) => {
    setEditingMember(member)
  }

  // Fungsi untuk menutup dialog profil dan menyiapkan mode edit
  const handleProfileEdit = () => {
    if (selectedMember) {
        setEditingMember(selectedMember);
        setShowProfile(false);
        setSelectedMember(null);
    }
  };

  return (
    <div className="space-y-6 px-6">
      {/* Header Halaman */}
      <div className="pt-6">
        <h1 className="text-3xl font-bold">Manajemen Anggota</h1>
        <p className="text-muted-foreground">Kelola informasi pasien, riwayat medis, dan detail keanggotaan</p>
      </div>

      <MemberTable
        members={members}
        onAdd={() => setShowAddForm(true)}
        onEdit={handleEditClick}
        onView={handleViewMember}
      />

      {/* Dialog Tambah Anggota */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Anggota Baru</DialogTitle>
          </DialogHeader>
          <MemberForm isEdit={false} onSubmit={handleAddMember} onCancel={() => setShowAddForm(false)} />
        </DialogContent>
      </Dialog>

      {/* Dialog Edit Anggota */}
      <Dialog open={!!editingMember} onOpenChange={() => setEditingMember(null)}>
        <DialogContent className="!max-w-4xl !w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ubah Anggota</DialogTitle>
          </DialogHeader>
          {editingMember && (
            <MemberForm isEdit={true} member={editingMember} onSubmit={handleEditMember} onCancel={() => setEditingMember(null)} />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog Profil Anggota */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="!max-w-4xl !w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Profil Anggota</DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <MemberProfile
              member={selectedMember}
              onEdit={handleProfileEdit}
              onClose={() => setShowProfile(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
