"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, X } from "lucide-react"
import { format } from "date-fns"

interface Member {
  id?: string
  membershipId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: Date | undefined
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
  member?: Member
  onSubmit: (member: Member) => void
  onCancel: () => void
}

export function MemberForm({ member, onSubmit, onCancel }: MemberFormProps) {
  const [formData, setFormData] = useState<Member>({
    membershipId: member?.membershipId || `MEM${Date.now()}`,
    firstName: member?.firstName || "",
    lastName: member?.lastName || "",
    email: member?.email || "",
    phone: member?.phone || "",
    dateOfBirth: member?.dateOfBirth,
    gender: member?.gender || "",
    address: member?.address || "",
    emergencyContact: member?.emergencyContact || "",
    emergencyPhone: member?.emergencyPhone || "",
    membershipType: member?.membershipType || "regular",
    allergies: member?.allergies || [],
    medicalConditions: member?.medicalConditions || [],
    notes: member?.notes || "",
    status: member?.status || "active",
  })

  const [newAllergy, setNewAllergy] = useState("")
  const [newCondition, setNewCondition] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="membershipId">Membership ID</Label>
              <Input
                id="membershipId"
                value={formData.membershipId}
                onChange={(e) => setFormData((prev) => ({ ...prev, membershipId: e.target.value }))}
                required
                disabled={!!member}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date of Birth</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dateOfBirth ? format(formData.dateOfBirth, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.dateOfBirth}
                      onSelect={(date) => setFormData((prev) => ({ ...prev, dateOfBirth: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact & Membership */}
        <Card>
          <CardHeader>
            <CardTitle>Emergency Contact & Membership</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
              <Input
                id="emergencyContact"
                value={formData.emergencyContact}
                onChange={(e) => setFormData((prev) => ({ ...prev, emergencyContact: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
              <Input
                id="emergencyPhone"
                value={formData.emergencyPhone}
                onChange={(e) => setFormData((prev) => ({ ...prev, emergencyPhone: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="membershipType">Membership Type</Label>
              <Select
                value={formData.membershipType}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, membershipType: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                rows={4}
                placeholder="Additional notes about the member..."
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Medical Information */}
      <Card>
        <CardHeader>
          <CardTitle>Medical Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Allergies</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                placeholder="Add allergy..."
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAllergy())}
              />
              <Button type="button" onClick={addAllergy} size="sm">
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
            <Label>Medical Conditions</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                placeholder="Add medical condition..."
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCondition())}
              />
              <Button type="button" onClick={addCondition} size="sm">
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
          Cancel
        </Button>
        <Button type="submit">{member ? "Update Member" : "Add Member"}</Button>
      </div>
    </form>
  )
}
