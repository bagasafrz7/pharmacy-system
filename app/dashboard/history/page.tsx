"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, Filter, Download, CalendarIcon, History, TrendingUp, Users, Package, DollarSign } from "lucide-react"
import { format } from "date-fns"

// Mock historical data
const mockSalesHistory = [
  { date: "2024-01-20", sales: 45000, transactions: 28, customers: 25 },
  { date: "2024-01-19", sales: 38000, transactions: 22, customers: 20 },
  { date: "2024-01-18", sales: 52000, transactions: 35, customers: 32 },
  { date: "2024-01-17", sales: 41000, transactions: 26, customers: 24 },
  { date: "2024-01-16", sales: 47000, transactions: 30, customers: 28 },
]

const mockProductHistory = [
  { product: "Paracetamol 500mg", sold: 150, revenue: 2250, trend: "up" },
  { product: "Amoxicillin 250mg", sold: 85, revenue: 7225, trend: "up" },
  { product: "Vitamin C 500mg", sold: 120, revenue: 14400, trend: "down" },
  { product: "Ibuprofen 400mg", sold: 95, revenue: 4750, trend: "up" },
  { product: "Face Mask (Box)", sold: 200, revenue: 9000, trend: "stable" },
]

const mockCustomerHistory = [
  { customer: "Maria Santos", visits: 12, totalSpent: 25000, lastVisit: "2024-01-20", membershipType: "premium" },
  { customer: "Jose Dela Cruz", visits: 8, totalSpent: 18500, lastVisit: "2024-01-18", membershipType: "regular" },
  { customer: "Elena Rodriguez", visits: 15, totalSpent: 42000, lastVisit: "2024-01-19", membershipType: "senior" },
  { customer: "Miguel Torres", visits: 6, totalSpent: 8500, lastVisit: "2024-01-17", membershipType: "student" },
]

export default function HistoryPage() {
  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()
  const [searchTerm, setSearchTerm] = useState("")

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full" />
    }
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
      <div>
        <h1 className="text-3xl font-bold">Transaction History</h1>
        <p className="text-muted-foreground">
          Comprehensive historical data and analytics for your pharmacy operations
        </p>
      </div>

      {/* Date Range Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Date Range & Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search history..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "PPP") : "From date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "PPP") : "To date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="sales" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sales">Sales History</TabsTrigger>
          <TabsTrigger value="products">Product Performance</TabsTrigger>
          <TabsTrigger value="customers">Customer Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Daily Sales Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSalesHistory.map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="font-semibold">{format(new Date(day.date), "MMM")}</div>
                        <div className="text-2xl font-bold">{format(new Date(day.date), "dd")}</div>
                        <div className="text-sm text-muted-foreground">{format(new Date(day.date), "yyyy")}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-semibold">₱{day.sales.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{day.transactions} transactions</span>
                          <span>{day.customers} customers</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Avg per transaction</div>
                      <div className="font-semibold">₱{Math.round(day.sales / day.transactions).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Top Performing Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockProductHistory.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-center min-w-[40px]">
                        <div className="text-2xl font-bold text-primary">#{index + 1}</div>
                      </div>
                      <div>
                        <div className="font-semibold">{product.product}</div>
                        <div className="text-sm text-muted-foreground">{product.sold} units sold</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-semibold">₱{product.revenue.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Revenue</div>
                      </div>
                      {getTrendIcon(product.trend)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Customer Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCustomerHistory.map((customer, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="font-semibold text-primary">
                          {customer.customer
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold">{customer.customer}</div>
                        <div className="flex items-center gap-2">
                          {getMembershipBadge(customer.membershipType)}
                          <span className="text-sm text-muted-foreground">{customer.visits} visits</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">₱{customer.totalSpent.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">
                        Last visit: {format(new Date(customer.lastVisit), "MMM dd")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
