"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { PreOrderForm } from "@/components/pre-order-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, MoreHorizontal, Eye, CheckCircle, XCircle, Clock, Search } from "lucide-react"
import { toast } from "sonner"
import { mockData } from "@/lib/mock-data"
import { formatDistanceToNow } from "date-fns"

interface PreOrder {
  id: string
  order_number: string
  member_id: string
  member_name?: string
  items: Array<{
    product_id: string
    product_name: string
    quantity: number
    price: number
    prescription_required: boolean
  }>
  total: number
  pickup_date: string
  priority: "normal" | "urgent" | "emergency"
  status: "pending" | "ready" | "completed" | "cancelled"
  notes?: string
  created_at: string
}

export default function PreOrdersPage() {
  const [preOrders, setPreOrders] = useState<PreOrder[]>([
    ...mockData.pre_orders.map((order: any) => ({
      ...order,
      member_name: mockData.members.find((m: any) => m.id === order.member_id)?.name || "Unknown",
      priority: "normal",
    })),
  ])
  const [showPreOrderForm, setShowPreOrderForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  const handleCreatePreOrder = (orderData: any) => {
    const newOrder: PreOrder = {
      ...orderData,
      member_name: mockData.members.find((m: any) => m.id === orderData.member_id)?.name || "Unknown",
    }
    setPreOrders([newOrder, ...preOrders])
    toast.success(`Pre-order ${orderData.order_number} created successfully!`)
  }

  const handleStatusChange = (orderId: string, newStatus: PreOrder["status"]) => {
    setPreOrders(preOrders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
    toast.success(`Order status updated to ${newStatus}`)
  }

  const filteredOrders = preOrders.filter((order) => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.member_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) => item.product_name.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesPriority = priorityFilter === "all" || order.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusColor = (status: PreOrder["status"]) => {
    switch (status) {
      case "pending":
        return "bg-warning/10 text-warning"
      case "ready":
        return "bg-success/10 text-success"
      case "completed":
        return "bg-primary/10 text-primary"
      case "cancelled":
        return "bg-destructive/10 text-destructive"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getPriorityColor = (priority: PreOrder["priority"]) => {
    switch (priority) {
      case "urgent":
        return "bg-warning/10 text-warning"
      case "emergency":
        return "bg-destructive/10 text-destructive"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusIcon = (status: PreOrder["status"]) => {
    switch (status) {
      case "pending":
        return Clock
      case "ready":
        return CheckCircle
      case "completed":
        return CheckCircle
      case "cancelled":
        return XCircle
      default:
        return Clock
    }
  }

  // Calculate stats
  const totalOrders = preOrders.length
  const pendingOrders = preOrders.filter((o) => o.status === "pending").length
  const readyOrders = preOrders.filter((o) => o.status === "ready").length
  const urgentOrders = preOrders.filter((o) => o.priority === "urgent" || o.priority === "emergency").length

  return (
    <div className="space-y-6">
      <DashboardHeader title="Pre-Orders" description="Manage prescription pre-orders and medication requests" />

      <div className="px-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalOrders}</div>
              <p className="text-xs text-muted-foreground">All pre-orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{pendingOrders}</div>
              <p className="text-xs text-muted-foreground">Awaiting processing</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Ready</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{readyOrders}</div>
              <p className="text-xs text-muted-foreground">Ready for pickup</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Urgent</CardTitle>
              <XCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{urgentOrders}</div>
              <p className="text-xs text-muted-foreground">High priority orders</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Pre-Order Management</CardTitle>
                <CardDescription>Track and manage prescription pre-orders</CardDescription>
              </div>
              <Button onClick={() => setShowPreOrderForm(true)} className="">
                <Plus className="mr-2 h-4 w-4" />
                New Pre-Order
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex gap-4 items-center mb-6">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Orders Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Pickup Date</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => {
                    const StatusIcon = getStatusIcon(order.status)
                    const hasPrescriptionItems = order.items.some((item) => item.prescription_required)

                    return (
                      <TableRow key={order.id}>
                        <TableCell>
                          <div className="font-medium">{order.order_number}</div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.member_name}</p>
                            {hasPrescriptionItems && (
                              <Badge variant="outline" className="text-xs mt-1">
                                Rx Required
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.items.length} items</p>
                            <p className="text-xs text-muted-foreground">
                              {order.items
                                .slice(0, 2)
                                .map((item) => item.product_name)
                                .join(", ")}
                              {order.items.length > 2 && "..."}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">${order.total.toFixed(2)}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{new Date(order.pickup_date).toLocaleDateString()}</span>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(order.priority)}>{order.priority}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <StatusIcon className="h-4 w-4" />
                            <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                          </span>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleStatusChange(order.id, "ready")}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Mark Ready
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(order.id, "completed")}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Mark Completed
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(order.id, "cancelled")}>
                                <XCircle className="mr-2 h-4 w-4" />
                                Cancel Order
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {filteredOrders.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">No pre-orders found matching your criteria.</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pre-Order Form Dialog */}
      <PreOrderForm open={showPreOrderForm} onOpenChange={setShowPreOrderForm} onSubmit={handleCreatePreOrder} />
    </div>
  )
}
