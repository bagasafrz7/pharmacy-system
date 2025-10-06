"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, Filter, Download, Eye, CalendarIcon, Receipt, TrendingUp, DollarSign, Package } from "lucide-react"
import { format } from "date-fns"

// Mock transaction data
const mockTransactions = [
  {
    id: "TXN001",
    date: new Date("2024-01-20T14:30:00"),
    customerId: "MEM001",
    customerName: "Maria Santos",
    items: [
      { name: "Paracetamol 500mg", quantity: 2, price: 15.0 },
      { name: "Vitamin C 500mg", quantity: 1, price: 120.0 },
    ],
    subtotal: 150.0,
    tax: 18.0,
    discount: 15.0,
    total: 153.0,
    paymentMethod: "cash",
    status: "completed",
    cashier: "Staff User",
    branch: "Main Branch - Makati",
    prescriptionRequired: false,
  },
  {
    id: "TXN002",
    date: new Date("2024-01-20T15:45:00"),
    customerId: "MEM002",
    customerName: "Jose Dela Cruz",
    items: [
      { name: "Amoxicillin 250mg", quantity: 1, price: 85.0 },
      { name: "Cough Syrup", quantity: 1, price: 65.0 },
    ],
    subtotal: 150.0,
    tax: 18.0,
    discount: 0.0,
    total: 168.0,
    paymentMethod: "card",
    status: "completed",
    cashier: "Staff User",
    branch: "Main Branch - Makati",
    prescriptionRequired: true,
  },
  {
    id: "TXN003",
    date: new Date("2024-01-20T16:20:00"),
    customerId: "GUEST",
    customerName: "Walk-in Customer",
    items: [
      { name: "Face Mask (Box)", quantity: 2, price: 45.0 },
      { name: "Hand Sanitizer", quantity: 1, price: 35.0 },
    ],
    subtotal: 125.0,
    tax: 15.0,
    discount: 0.0,
    total: 140.0,
    paymentMethod: "cash",
    status: "completed",
    cashier: "Staff User",
    branch: "Main Branch - Makati",
    prescriptionRequired: false,
  },
  {
    id: "TXN004",
    date: new Date("2024-01-19T11:15:00"),
    customerId: "MEM003",
    customerName: "Elena Rodriguez",
    items: [
      { name: "Blood Pressure Monitor", quantity: 1, price: 1200.0 },
      { name: "Diabetes Test Strips", quantity: 2, price: 450.0 },
    ],
    subtotal: 2100.0,
    tax: 252.0,
    discount: 210.0,
    total: 2142.0,
    paymentMethod: "card",
    status: "completed",
    cashier: "Pharmacist User",
    branch: "Quezon City Branch",
    prescriptionRequired: false,
  },
  {
    id: "TXN005",
    date: new Date("2024-01-19T09:30:00"),
    customerId: "MEM004",
    customerName: "Miguel Torres",
    items: [
      { name: "Multivitamins", quantity: 1, price: 280.0 },
      { name: "Protein Powder", quantity: 1, price: 850.0 },
    ],
    subtotal: 1130.0,
    tax: 135.6,
    discount: 113.0,
    total: 1152.6,
    paymentMethod: "cash",
    status: "refunded",
    cashier: "Staff User",
    branch: "Main Branch - Makati",
    prescriptionRequired: false,
  },
]

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState(mockTransactions)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [branchFilter, setBranchFilter] = useState("all")
  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.cashier.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter
    const matchesPayment = paymentFilter === "all" || transaction.paymentMethod === paymentFilter
    const matchesBranch = branchFilter === "all" || transaction.branch === branchFilter

    const matchesDateRange = (!dateFrom || transaction.date >= dateFrom) && (!dateTo || transaction.date <= dateTo)

    return matchesSearch && matchesStatus && matchesPayment && matchesBranch && matchesDateRange
  })

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "default",
      pending: "secondary",
      refunded: "destructive",
      cancelled: "outline",
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getPaymentBadge = (method: string) => {
    const variants = {
      cash: "outline",
      card: "secondary",
      digital: "default",
    } as const

    return (
      <Badge variant={variants[method as keyof typeof variants] || "outline"}>
        {method.charAt(0).toUpperCase() + method.slice(1)}
      </Badge>
    )
  }

  // Calculate summary statistics
  const totalTransactions = filteredTransactions.length
  const totalRevenue = filteredTransactions.filter((t) => t.status === "completed").reduce((sum, t) => sum + t.total, 0)
  const averageTransaction = totalRevenue / filteredTransactions.filter((t) => t.status === "completed").length || 0
  const completedTransactions = filteredTransactions.filter((t) => t.status === "completed").length

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Transaction Management</h1>
        <p className="text-muted-foreground">View and manage all pharmacy transactions and sales records</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
                <p className="text-2xl font-bold">{totalTransactions}</p>
              </div>
              <Receipt className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">₱{totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Transaction</p>
                <p className="text-2xl font-bold">₱{averageTransaction.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">{completedTransactions}</p>
              </div>
              <Package className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="digital">Digital</SelectItem>
              </SelectContent>
            </Select>

            <Select value={branchFilter} onValueChange={setBranchFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                <SelectItem value="Main Branch - Makati">Main Branch - Makati</SelectItem>
                <SelectItem value="Quezon City Branch">Quezon City Branch</SelectItem>
                <SelectItem value="Pasig Branch">Pasig Branch</SelectItem>
                <SelectItem value="Taguig Branch">Taguig Branch</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4">
            <div>
              <label className="text-sm font-medium">Date From</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="text-sm font-medium">Date To</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-end">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Cashier</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.id}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{format(transaction.date, "MMM dd, yyyy")}</div>
                        <div className="text-muted-foreground">{format(transaction.date, "HH:mm")}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{transaction.customerName}</div>
                        <div className="text-sm text-muted-foreground">{transaction.customerId}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{transaction.items.length} items</div>
                        {transaction.prescriptionRequired && (
                          <Badge variant="outline" className="text-xs">
                            Rx Required
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">₱{transaction.total.toLocaleString()}</div>
                      {transaction.discount > 0 && (
                        <div className="text-xs text-green-600">-₱{transaction.discount.toLocaleString()}</div>
                      )}
                    </TableCell>
                    <TableCell>{getPaymentBadge(transaction.paymentMethod)}</TableCell>
                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                    <TableCell className="text-sm">{transaction.cashier}</TableCell>
                    <TableCell className="text-sm">{transaction.branch}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => setSelectedTransaction(transaction)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No transactions found matching your criteria.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
