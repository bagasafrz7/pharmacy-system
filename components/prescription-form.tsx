"use client"

import type React from "react"

import { useState } from "react"
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
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, FileText, User, Stethoscope, Upload } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { mockData } from "@/lib/mock-data"

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

export function PrescriptionForm({ open, onOpenChange, onSubmit }: PrescriptionFormProps) {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [memberSearch, setMemberSearch] = useState("")
  const [doctorName, setDoctorName] = useState("")
  const [doctorLicense, setDoctorLicense] = useState("")
  const [medications, setMedications] = useState([
    {
      id: 1,
      name: "",
      dosage: "",
      frequency: "",
      duration: "",
      quantity: "",
      instructions: "",
    },
  ])
  const [diagnosis, setDiagnosis] = useState("")
  const [prescriptionDate, setPrescriptionDate] = useState<Date>(new Date())
  const [validUntil, setValidUntil] = useState<Date>()
  const [notes, setNotes] = useState("")
  const [prescriptionImage, setPrescriptionImage] = useState<File | null>(null)

  const members = mockData.members as Member[]

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
      prescription_date: format(prescriptionDate, "yyyy-MM-dd"),
      valid_until: validUntil ? format(validUntil, "yyyy-MM-dd") : null,
      notes,
      status: "pending_review",
      created_at: new Date().toISOString(),
      prescription_image: prescriptionImage?.name || null,
    }

    onSubmit(prescriptionData)

    // Reset form
    setSelectedMember(null)
    setMemberSearch("")
    setDoctorName("")
    setDoctorLicense("")
    setMedications([
      {
        id: 1,
        name: "",
        dosage: "",
        frequency: "",
        duration: "",
        quantity: "",
        instructions: "",
      },
    ])
    setDiagnosis("")
    setPrescriptionDate(new Date())
    setValidUntil(undefined)
    setNotes("")
    setPrescriptionImage(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Digital Prescription Entry
          </DialogTitle>
          <DialogDescription>Enter prescription details for pharmacist review and approval</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4" />
                Patient Information
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
                          <span className="text-xs text-muted-foreground">Allergies:</span>
                          {selectedMember.allergies.map((allergy) => (
                            <Badge key={allergy} variant="destructive" className="text-xs">
                              {allergy}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {selectedMember.medical_conditions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          <span className="text-xs text-muted-foreground">Conditions:</span>
                          {selectedMember.medical_conditions.map((condition) => (
                            <Badge key={condition} variant="secondary" className="text-xs">
                              {condition}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setSelectedMember(null)}>
                      Change
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <Input
                    placeholder="Search patients by name, email, or phone..."
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

          {/* Doctor Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Stethoscope className="h-4 w-4" />
                Prescribing Doctor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="doctor_name">Doctor Name *</Label>
                  <Input
                    id="doctor_name"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    placeholder="Dr. John Smith"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctor_license">Medical License Number *</Label>
                  <Input
                    id="doctor_license"
                    value={doctorLicense}
                    onChange={(e) => setDoctorLicense(e.target.value)}
                    placeholder="MD123456789"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medications */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Prescribed Medications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {medications.map((medication, index) => (
                  <div key={medication.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Medication {index + 1}</h4>
                      {medications.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMedication(medication.id)}
                          className="text-destructive"
                        >
                          Remove
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Medication Name *</Label>
                        <Input
                          value={medication.name}
                          onChange={(e) => updateMedication(medication.id, "name", e.target.value)}
                          placeholder="e.g., Amoxicillin"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Dosage *</Label>
                        <Input
                          value={medication.dosage}
                          onChange={(e) => updateMedication(medication.id, "dosage", e.target.value)}
                          placeholder="e.g., 500mg"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-2">
                        <Label>Frequency *</Label>
                        <Select
                          value={medication.frequency}
                          onValueChange={(value) => updateMedication(medication.id, "frequency", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="once_daily">Once daily</SelectItem>
                            <SelectItem value="twice_daily">Twice daily</SelectItem>
                            <SelectItem value="three_times_daily">Three times daily</SelectItem>
                            <SelectItem value="four_times_daily">Four times daily</SelectItem>
                            <SelectItem value="as_needed">As needed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Duration</Label>
                        <Input
                          value={medication.duration}
                          onChange={(e) => updateMedication(medication.id, "duration", e.target.value)}
                          placeholder="e.g., 7 days"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Quantity</Label>
                        <Input
                          value={medication.quantity}
                          onChange={(e) => updateMedication(medication.id, "quantity", e.target.value)}
                          placeholder="e.g., 30 tablets"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Special Instructions</Label>
                      <Textarea
                        value={medication.instructions}
                        onChange={(e) => updateMedication(medication.id, "instructions", e.target.value)}
                        placeholder="Take with food, avoid alcohol, etc."
                        rows={2}
                      />
                    </div>
                  </div>
                ))}

                <Button type="button" variant="outline" onClick={addMedication} className="w-full bg-transparent">
                  Add Another Medication
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Prescription Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Diagnosis</Label>
                  <Input
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="e.g., Bacterial infection"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Prescription Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(prescriptionDate, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={prescriptionDate}
                        onSelect={(date) => date && setPrescriptionDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Valid Until</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !validUntil && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {validUntil ? format(validUntil, "PPP") : "Select expiry date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={validUntil}
                        onSelect={setValidUntil}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Prescription Image</Label>
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
                      Upload Image
                    </Label>
                    {prescriptionImage && (
                      <span className="text-sm text-muted-foreground">{prescriptionImage.name}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Additional Notes</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any additional notes or special considerations..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              className=""
              disabled={!selectedMember || !doctorName || !doctorLicense}
            >
              Submit for Review
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
