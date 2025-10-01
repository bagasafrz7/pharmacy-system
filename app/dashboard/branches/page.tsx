"use client"

import { useState } from "react"
import { BranchTable } from "@/components/branch-table"
import { StockTransferForm } from "@/components/stock-transfer-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Building2, Package, TrendingUp, AlertTriangle, ArrowUpDown, Clock } from "lucide-react"

// Mock data
const mockBranches = [
  {
    id: "1",
    name: "Main Branch - Makati",
    code: "MKT",
    address: "123 Ayala Avenue, Makati City, Metro Manila",
    phone: "+63 2 8123 4567",
    manager: "Dr. Maria Santos",
    status: "active",
    totalProducts: 1250,
    lowStockItems: 15,
    dailySales: 45000,
    monthlyTarget: 1200000,
    staffCount: 12,
    openingHours: "8:00 AM - 10:00 PM",
  },
  {
    id: "2",
    name: "Quezon City Branch",
    code: "QC",
    address: "456 Commonwealth Avenue, Quezon City, Metro Manila",
    phone: "+63 2 8234 5678",
    manager: "Dr. Jose Dela Cruz",
    status: "active",
    totalProducts: 980,
    lowStockItems: 8,
    dailySales: 32000,
    monthlyTarget: 900000,
    staffCount: 8,
    openingHours: "8:00 AM - 9:00 PM",
  },
  {
    id: "3",
    name: "Pasig Branch",
    code: "PSG",
    address: "789 Ortigas Avenue, Pasig City, Metro Manila",
    phone: "+63 2 8345 6789",
    manager: "Dr. Elena Rodriguez",
    status: "active",
    totalProducts: 850,
    lowStockItems: 22,
    dailySales: 28000,
    monthlyTarget: 800000,
    staffCount: 6,
    openingHours: "9:00 AM - 9:00 PM",
  },
  {
    id: "4",
    name: "Taguig Branch",
    code: "TGG",
    address: "321 BGC Central, Taguig City, Metro Manila",
    phone: "+63 2 8456 7890",
    manager: "Dr. Miguel Torres",
    status: "maintenance",
    totalProducts: 750,
    lowStockItems: 35,
    dailySales: 15000,
    monthlyTarget: 700000,
    staffCount: 5,
    openingHours: "Temporarily Closed",
  },
]

const mockTransfers = [
  {
    id: "1",
    transferId: "TRF001",
    fromBranch: "Main Branch - Makati",
    toBranch: "Quezon City Branch",
    requestedBy: "Dr. Jose Dela Cruz",
    status: "pending",
    priority: "high",
    totalItems: 150,
    createdAt: new Date("2024-01-20"),
    notes: "Urgent restocking needed for flu season medications",
  },
  {
    id: "2",
    transferId: "TRF002",
    fromBranch: "Quezon City Branch",
    toBranch: "Pasig Branch",
    requestedBy: "Dr. Elena Rodriguez",
    status: "in-transit",
    priority: "normal",
    totalItems: 75,
    createdAt: new Date("2024-01-19"),
    notes: "Regular monthly stock transfer",
  },
  {
    id: "3",
    transferId: "TRF003",
    fromBranch: "Main Branch - Makati",
    toBranch: "Taguig Branch",
    requestedBy: "Dr. Miguel Torres",
    status: "completed",
    priority: "urgent",
    totalItems: 200,
    createdAt: new Date("2024-01-18"),
    notes: "Emergency stock for reopening after maintenance",
  },
]

export default function BranchesPage() {
  const [branches, setBranches] = useState(mockBranches)
  const [transfers, setTransfers] = useState(mockTransfers)
  const [selectedBranch, setSelectedBranch] = useState<any>(null)
  const [showAddBranch, setShowAddBranch] = useState(false)
  const [showTransferForm, setShowTransferForm] = useState(false)
  const [showBranchDetails, setShowBranchDetails] = useState(false)
  const { toast } = useToast()

  const handleAddBranch = () => {
    setShowAddBranch(true)
  }

  const handleEditBranch = (branch: any) => {
    setSelectedBranch(branch)
    setShowAddBranch(true)
  }

  const handleViewBranch = (branch: any) => {
    setSelectedBranch(branch)
    setShowBranchDetails(true)
  }

  const handleCreateTransfer = (transferData: any) => {
    const newTransfer = {
      ...transferData,
      id: Date.now().toString(),
      fromBranch: branches.find((b) => b.id === transferData.fromBranch)?.name || "",
      toBranch: branches.find((b) => b.id === transferData.toBranch)?.name || "",
    }
    setTransfers((prev) => [...prev, newTransfer])
    setShowTransferForm(false)
    toast({
      title: "Transfer Request Created",
      description: `Transfer ${transferData.transferId} has been created successfully.`,
    })
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      "in-transit": "default",
      completed: "outline",
      cancelled: "destructive",
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const variants = {
      low: "secondary",
      normal: "outline",
      high: "destructive",
      urgent: "destructive",
    } as const

    return (
      <Badge variant={variants[priority as keyof typeof variants] || "outline"}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    )
  }

  // Calculate summary statistics
  const totalBranches = branches.length
  const activeBranches = branches.filter((b) => b.status === "active").length
  const totalLowStock = branches.reduce((sum, branch) => sum + branch.lowStockItems, 0)
  const pendingTransfers = transfers.filter((t) => t.status === "pending").length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Branch Management</h1>
        <p className="text-muted-foreground">Manage pharmacy branches, stock transfers, and real-time inventory sync</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Branches</p>
                <p className="text-2xl font-bold">{totalBranches}</p>
              </div>
              <Building2 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Branches</p>
                <p className="text-2xl font-bold text-green-600">{activeBranches}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Low Stock Items</p>
                <p className="text-2xl font-bold text-red-600">{totalLowStock}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Transfers</p>
                <p className="text-2xl font-bold text-orange-600">{pendingTransfers}</p>
              </div>
              <Package className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="branches" className="space-y-6">
        <TabsList>
          <TabsTrigger value="branches">Branches</TabsTrigger>
          <TabsTrigger value="transfers">Stock Transfers</TabsTrigger>
        </TabsList>

        <TabsContent value="branches">
          <BranchTable
            branches={branches}
            onAdd={handleAddBranch}
            onEdit={handleEditBranch}
            onView={handleViewBranch}
          />
        </TabsContent>

        <TabsContent value="transfers">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <ArrowUpDown className="h-5 w-5" />
                  Stock Transfers
                </CardTitle>
                <Button onClick={() => setShowTransferForm(true)}>
                  <Package className="h-4 w-4 mr-2" />
                  New Transfer
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transfers.map((transfer) => (
                  <div key={transfer.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{transfer.transferId}</h3>
                        <p className="text-sm text-muted-foreground">
                          {transfer.fromBranch} → {transfer.toBranch}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {getStatusBadge(transfer.status)}
                        {getPriorityBadge(transfer.priority)}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Requested by:</span>
                        <div>{transfer.requestedBy}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total Items:</span>
                        <div>{transfer.totalItems}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Created:</span>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {transfer.createdAt.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    {transfer.notes && (
                      <div className="mt-3 text-sm">
                        <span className="text-muted-foreground">Notes:</span>
                        <p className="mt-1">{transfer.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Stock Transfer Form Dialog */}
      <Dialog open={showTransferForm} onOpenChange={setShowTransferForm}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Stock Transfer</DialogTitle>
          </DialogHeader>
          <StockTransferForm onSubmit={handleCreateTransfer} onCancel={() => setShowTransferForm(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
