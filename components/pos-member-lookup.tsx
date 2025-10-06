// pos-member-lookup.tsx
"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, User, Phone, Mail, UserPlus } from "lucide-react"
import { mockData } from "@/lib/mock-data"

interface Member {
  id: string
  name: string
  email: string
  phone: string
  date_of_birth: string
  address: string
  insurance_number: string
  allergies: string[]
  medical_conditions: string[]
  status: "active" | "inactive"
}

interface POSMemberLookupProps {
  selectedMember: Member | null
  onSelectMember: (member: Member | null) => void
}

export function POSMemberLookup({ selectedMember, onSelectMember }: POSMemberLookupProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<Member[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const members = mockData.members as Member[]

  const handleSearch = () => {
    if (searchTerm.length < 2) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    setTimeout(() => {
      const filtered = members.filter((member) => {
        const searchLower = searchTerm.toLowerCase()
        return (
          member.name.toLowerCase().includes(searchLower) ||
          member.email.toLowerCase().includes(searchLower) ||
          member.phone.includes(searchTerm)
        )
      })
      setSearchResults(filtered)
      setIsSearching(false)
    }, 300)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Cari Anggota
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Tampilan Anggota Terpilih */}
        {selectedMember ? (
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h3 className="font-medium text-foreground">{selectedMember.name}</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    {selectedMember.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3" />
                    {selectedMember.phone}
                  </div>
                </div>
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
              </div>
              <Button variant="outline" size="sm" onClick={() => onSelectMember(null)}>
                Ganti
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Input Pencarian */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari berdasarkan nama, email, atau telepon..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch} disabled={searchTerm.length < 2}>
                Cari
              </Button>
            </div>

            {/* Hasil Pencarian */}
            {isSearching ? (
              <div className="text-center py-4 text-muted-foreground">Mencari...</div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {searchResults.map((member) => (
                  <div
                    key={member.id}
                    className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => onSelectMember(member)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-sm">{member.name}</h4>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                        <p className="text-xs text-muted-foreground">{member.phone}</p>
                      </div>
                      <Badge variant={member.status === "active" ? "default" : "secondary"}>
                        {member.status === "active" ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchTerm.length >= 2 ? (
              <div className="text-center py-4 text-muted-foreground">
                <p>Anggota tidak ditemukan</p>
                <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Tambah Anggota Baru
                </Button>
              </div>
            ) : null}

            {/* Opsi Checkout Tamu */}
            <div className="pt-4 border-t">
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => onSelectMember({ id: "guest", name: "Pelanggan Tamu" } as Member)}
              >
                Lanjut sebagai Tamu
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
