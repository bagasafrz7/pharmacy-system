"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { User, Phone, Mail, MapPin, Calendar, Heart, AlertTriangle, ShoppingCart, Clock, Edit } from "lucide-react"
import { format } from "date-fns"

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

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
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

    return (
      <Badge variant={variants[type as keyof typeof variants] || "outline"}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">
            {member.firstName} {member.lastName}
          </h2>
          <p className="text-muted-foreground">Member ID: {member.membershipId}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
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
                    {format(member.dateOfBirth, "MMMM dd, yyyy")} (
                    {new Date().getFullYear() - member.dateOfBirth.getFullYear()} years old)
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
                <h4 className="font-medium mb-2">Emergency Contact</h4>
                <div className="space-y-1 text-sm">
                  <div>{member.emergencyContact}</div>
                  <div className="text-muted-foreground">{member.emergencyPhone}</div>
                </div>
              </div>

              {member.notes && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Notes</h4>
                    <p className="text-sm text-muted-foreground">{member.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Medical Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Medical Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  Allergies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {member.allergies.length > 0 ? (
                    member.allergies.map((allergy, index) => (
                      <Badge key={index} variant="destructive">
                        {allergy}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No known allergies</span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Medical Conditions</h4>
                <div className="flex flex-wrap gap-2">
                  {member.medicalConditions.length > 0 ? (
                    member.medicalConditions.map((condition, index) => (
                      <Badge key={index} variant="secondary">
                        {condition}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No medical conditions recorded</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Purchase History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Recent Purchase History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {member.purchaseHistory.slice(0, 5).map((purchase) => (
                  <div key={purchase.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">₱{purchase.total.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">
                        {purchase.items} items • {format(purchase.date, "MMM dd, yyyy")}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Membership Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Membership Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Status</span>
                {getStatusBadge(member.status)}
              </div>
              <div className="flex justify-between items-center">
                <span>Type</span>
                {getMembershipBadge(member.membershipType)}
              </div>
              <div className="flex justify-between items-center">
                <span>Member Since</span>
                <span className="text-sm">{format(member.joinDate, "MMM yyyy")}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Last Visit</span>
                <span className="text-sm flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {format(member.lastVisit, "MMM dd, yyyy")}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Purchase Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">₱{member.totalPurchases.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Purchases</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{member.purchaseHistory.length}</div>
                <div className="text-sm text-muted-foreground">Total Transactions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  ₱{Math.round(member.totalPurchases / member.purchaseHistory.length).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Average Purchase</div>
              </div>
            </CardContent>
          </Card>

          {member.membershipType === "premium" && (
            <Card>
              <CardHeader>
                <CardTitle>Premium Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>10% discount on all purchases</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Priority prescription processing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Free home delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Health consultation discounts</span>
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
