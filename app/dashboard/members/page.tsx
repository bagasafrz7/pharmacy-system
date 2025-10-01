"use client"

import { useState } from "react"
import { MemberTable } from "@/components/member-table"
import { MemberForm } from "@/components/member-form"
import { MemberProfile } from "@/components/member-profile"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

// Mock data - in real app, this would come from API/database
const mockMembers = [
  {
    id: "1",
    membershipId: "MEM001",
    firstName: "Maria",
    lastName: "Santos",
    email: "maria.santos@email.com",
    phone: "+63 917 123 4567",
    dateOfBirth: new Date("1985-03-15"),
    gender: "female",
    address: "123 Rizal Street, Makati City, Metro Manila",
    emergencyContact: "Juan Santos",
    emergencyPhone: "+63 917 765 4321",
    membershipType: "premium",
    status: "active",
    joinDate: new Date("2023-01-15"),
    totalPurchases: 25000,
    lastVisit: new Date("2024-01-20"),
    allergies: ["Penicillin", "Shellfish"],
    medicalConditions: ["Hypertension", "Diabetes Type 2"],
    notes: "Regular customer, prefers generic medications when available.",
    purchaseHistory: [
      { id: "1", date: new Date("2024-01-20"), total: 1500, items: 3 },
      { id: "2", date: new Date("2024-01-15"), total: 2200, items: 5 },
      { id: "3", date: new Date("2024-01-10"), total: 800, items: 2 },
      { id: "4", date: new Date("2024-01-05"), total: 3200, items: 7 },
      { id: "5", date: new Date("2023-12-28"), total: 1200, items: 4 },
    ],
  },
  {
    id: "2",
    membershipId: "MEM002",
    firstName: "Jose",
    lastName: "Dela Cruz",
    email: "jose.delacruz@email.com",
    phone: "+63 918 234 5678",
    dateOfBirth: new Date("1978-07-22"),
    gender: "male",
    address: "456 Bonifacio Avenue, Quezon City, Metro Manila",
    emergencyContact: "Ana Dela Cruz",
    emergencyPhone: "+63 918 876 5432",
    membershipType: "regular",
    status: "active",
    joinDate: new Date("2023-03-10"),
    totalPurchases: 18500,
    lastVisit: new Date("2024-01-18"),
    allergies: [],
    medicalConditions: ["Asthma"],
    notes: "Prefers morning appointments for consultations.",
    purchaseHistory: [
      { id: "6", date: new Date("2024-01-18"), total: 950, items: 2 },
      { id: "7", date: new Date("2024-01-12"), total: 1800, items: 4 },
      { id: "8", date: new Date("2024-01-08"), total: 650, items: 1 },
    ],
  },
  {
    id: "3",
    membershipId: "MEM003",
    firstName: "Elena",
    lastName: "Rodriguez",
    email: "elena.rodriguez@email.com",
    phone: "+63 919 345 6789",
    dateOfBirth: new Date("1965-11-08"),
    gender: "female",
    address: "789 Mabini Street, Pasig City, Metro Manila",
    emergencyContact: "Carlos Rodriguez",
    emergencyPhone: "+63 919 987 6543",
    membershipType: "senior",
    status: "active",
    joinDate: new Date("2022-08-20"),
    totalPurchases: 42000,
    lastVisit: new Date("2024-01-19"),
    allergies: ["Aspirin"],
    medicalConditions: ["Arthritis", "High Cholesterol"],
    notes: "Senior citizen discount applied. Requires assistance with medication management.",
    purchaseHistory: [
      { id: "9", date: new Date("2024-01-19"), total: 2100, items: 6 },
      { id: "10", date: new Date("2024-01-14"), total: 1750, items: 5 },
      { id: "11", date: new Date("2024-01-09"), total: 2800, items: 8 },
    ],
  },
  {
    id: "4",
    membershipId: "MEM004",
    firstName: "Miguel",
    lastName: "Torres",
    email: "miguel.torres@email.com",
    phone: "+63 920 456 7890",
    dateOfBirth: new Date("1999-04-12"),
    gender: "male",
    address: "321 Luna Street, Taguig City, Metro Manila",
    emergencyContact: "Rosa Torres",
    emergencyPhone: "+63 920 098 7654",
    membershipType: "student",
    status: "active",
    joinDate: new Date("2023-09-05"),
    totalPurchases: 8500,
    lastVisit: new Date("2024-01-17"),
    allergies: ["Latex"],
    medicalConditions: [],
    notes: "Student discount applied. Usually purchases vitamins and supplements.",
    purchaseHistory: [
      { id: "12", date: new Date("2024-01-17"), total: 450, items: 2 },
      { id: "13", date: new Date("2024-01-11"), total: 780, items: 3 },
      { id: "14", date: new Date("2024-01-06"), total: 320, items: 1 },
    ],
  },
  {
    id: "5",
    membershipId: "MEM005",
    firstName: "Carmen",
    lastName: "Villanueva",
    email: "carmen.villanueva@email.com",
    phone: "+63 921 567 8901",
    dateOfBirth: new Date("1990-09-30"),
    gender: "female",
    address: "654 Aguinaldo Highway, Cavite City, Cavite",
    emergencyContact: "Pedro Villanueva",
    emergencyPhone: "+63 921 109 8765",
    membershipType: "regular",
    status: "inactive",
    joinDate: new Date("2023-05-18"),
    totalPurchases: 12000,
    lastVisit: new Date("2023-12-15"),
    allergies: ["Sulfa drugs"],
    medicalConditions: ["Migraine"],
    notes: "Moved to another city. Account inactive since December 2023.",
    purchaseHistory: [
      { id: "15", date: new Date("2023-12-15"), total: 1200, items: 3 },
      { id: "16", date: new Date("2023-12-08"), total: 850, items: 2 },
      { id: "17", date: new Date("2023-11-28"), total: 1500, items: 4 },
    ],
  },
]

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
      id: Date.now().toString(),
      joinDate: new Date(),
      totalPurchases: 0,
      lastVisit: new Date(),
      purchaseHistory: [],
    }
    setMembers((prev) => [...prev, newMember])
    setShowAddForm(false)
    toast({
      title: "Member Added",
      description: `${memberData.firstName} ${memberData.lastName} has been added successfully.`,
    })
  }

  const handleEditMember = (memberData: any) => {
    setMembers((prev) => prev.map((member) => (member.id === editingMember.id ? { ...member, ...memberData } : member)))
    setEditingMember(null)
    toast({
      title: "Member Updated",
      description: `${memberData.firstName} ${memberData.lastName} has been updated successfully.`,
    })
  }

  const handleViewMember = (member: any) => {
    setSelectedMember(member)
    setShowProfile(true)
  }

  const handleEditClick = (member: any) => {
    setEditingMember(member)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Members Management</h1>
        <p className="text-muted-foreground">Manage patient information, medical history, and membership details</p>
      </div>

      <MemberTable
        members={members}
        onAdd={() => setShowAddForm(true)}
        onEdit={handleEditClick}
        onView={handleViewMember}
      />

      {/* Add Member Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Member</DialogTitle>
          </DialogHeader>
          <MemberForm onSubmit={handleAddMember} onCancel={() => setShowAddForm(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Member Dialog */}
      <Dialog open={!!editingMember} onOpenChange={() => setEditingMember(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
          </DialogHeader>
          {editingMember && (
            <MemberForm member={editingMember} onSubmit={handleEditMember} onCancel={() => setEditingMember(null)} />
          )}
        </DialogContent>
      </Dialog>

      {/* Member Profile Dialog */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Member Profile</DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <MemberProfile
              member={selectedMember}
              onEdit={() => {
                setShowProfile(false)
                setEditingMember(selectedMember)
              }}
              onClose={() => setShowProfile(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
