"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Edit, Eye, Building2, MapPin, Phone, Users, Package } from "lucide-react"

interface Branch {
  id: string
  name: string
  code: string
  address: string
  phone: string
  manager: string
  status: string
  totalProducts: number
  lowStockItems: number
  dailySales: number
  monthlyTarget: number
  staffCount: number
  openingHours: string
}

interface BranchTableProps {
  branches: Branch[]
  onEdit: (branch: Branch) => void
  onView: (branch: Branch) => void
  onAdd: () => void
}

export function BranchTable({ branches, onEdit, onView, onAdd }: BranchTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredBranches = branches.filter((branch) => {
    const matchesSearch =
      branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.address.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || branch.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      inactive: "secondary",
      maintenance: "destructive",
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getPerformanceBadge = (current: number, target: number) => {
    const percentage = (current / target) * 100
    if (percentage >= 100) return <Badge variant="default">On Target</Badge>
    if (percentage >= 80) return <Badge variant="secondary">Good</Badge>
    return <Badge variant="destructive">Below Target</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Branch Management
          </CardTitle>
          <Button onClick={onAdd}>
            <Building2 className="h-4 w-4 mr-2" />
            Add Branch
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search branches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Branch Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBranches.map((branch) => (
            <Card key={branch.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{branch.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">Code: {branch.code}</p>
                  </div>
                  {getStatusBadge(branch.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-muted-foreground">{branch.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{branch.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Manager: {branch.manager}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-2 bg-muted rounded-lg">
                    <div className="font-semibold flex items-center justify-center gap-1">
                      <Package className="h-4 w-4" />
                      {branch.totalProducts}
                    </div>
                    <div className="text-muted-foreground">Products</div>
                  </div>
                  <div className="text-center p-2 bg-muted rounded-lg">
                    <div className="font-semibold text-red-600">{branch.lowStockItems}</div>
                    <div className="text-muted-foreground">Low Stock</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Daily Sales</span>
                    <span className="font-semibold">{branch.dailySales.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Performance</span>
                    {getPerformanceBadge(branch.dailySales * 30, branch.monthlyTarget)}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => onView(branch)} className="flex-1">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onEdit(branch)} className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBranches.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">No branches found matching your criteria.</div>
        )}
      </CardContent>
    </Card>
  )
}
