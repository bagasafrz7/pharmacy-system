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
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Plus, Minus, Search, User, Stethoscope } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { mockData } from "@/lib/mock-data"

interface Product {
  id: string
  name: string
  generic_name: string
  brand: string
  price: number
  stock: number
  prescription_required: boolean
}

interface Member {
  id: string
  name: string
  email: string
  phone: string
}

interface PreOrderItem {
  product: Product
  quantity: number
}

interface PreOrderFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (orderData: any) => void
}

export function PreOrderForm({ open, onOpenChange, onSubmit }: PreOrderFormProps) {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [memberSearch, setMemberSearch] = useState("")
  const [productSearch, setProductSearch] = useState("")
  const [orderItems, setOrderItems] = useState<PreOrderItem[]>([])
  const [pickupDate, setPickupDate] = useState<Date>()
  const [notes, setNotes] = useState("")
  const [priority, setPriority] = useState("normal")

  const products = mockData.products as Product[]
  const members = mockData.members as Member[]

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      member.email.toLowerCase().includes(memberSearch.toLowerCase()) ||
      member.phone.includes(memberSearch),
  )

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      product.generic_name.toLowerCase().includes(productSearch.toLowerCase()) ||
      product.brand.toLowerCase().includes(productSearch.toLowerCase()),
  )

  const addProductToOrder = (product: Product) => {
    const existingItem = orderItems.find((item) => item.product.id === product.id)
    if (existingItem) {
      setOrderItems((items) =>
        items.map((item) =>
          item.product.id === product.id ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) } : item,
        ),
      )
    } else {
      setOrderItems((items) => [...items, { product, quantity: 1 }])
    }
    setProductSearch("")
  }

  const updateQuantity = (productId: string, quantity: number) => {
    setOrderItems((items) =>
      items.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.max(1, Math.min(quantity, item.product.stock)) }
          : item,
      ),
    )
  }

  const removeItem = (productId: string) => {
    setOrderItems((items) => items.filter((item) => item.product.id !== productId))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMember || orderItems.length === 0 || !pickupDate) return

    const orderData = {
      id: `PO${Date.now()}`,
      order_number: `PO${String(Date.now()).slice(-6)}`,
      member_id: selectedMember.id,
      items: orderItems.map((item) => ({
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        prescription_required: item.product.prescription_required,
      })),
      total: orderItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
      pickup_date: format(pickupDate, "yyyy-MM-dd"),
      priority,
      notes,
      status: "pending",
      created_at: new Date().toISOString(),
    }

    onSubmit(orderData)

    // Reset form
    setSelectedMember(null)
    setMemberSearch("")
    setProductSearch("")
    setOrderItems([])
    setPickupDate(undefined)
    setNotes("")
    setPriority("normal")
    onOpenChange(false)
  }

  const total = orderItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const hasPrescriptionItems = orderItems.some((item) => item.product.prescription_required)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Create Pre-Order
          </DialogTitle>
          <DialogDescription>
            Create a pre-order for prescription medications and other pharmacy products
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Member Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4" />
                Select Patient
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedMember ? (
                <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <div>
                    <p className="font-medium">{selectedMember.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedMember.email}</p>
                    <p className="text-sm text-muted-foreground">{selectedMember.phone}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setSelectedMember(null)}>
                    Change
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search patients by name, email, or phone..."
                      value={memberSearch}
                      onChange={(e) => setMemberSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
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

          {/* Product Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Add Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products to add to pre-order..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {productSearch && (
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {filteredProducts.slice(0, 5).map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                        onClick={() => addProductToOrder(product)}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">{product.name}</p>
                            {product.prescription_required && (
                              <Badge variant="outline" className="text-xs">
                                Rx
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {product.generic_name} • ${product.price}
                          </p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Order Items */}
                {orderItems.length > 0 && (
                  <div className="space-y-3 pt-4 border-t">
                    <h4 className="font-medium">Order Items</h4>
                    {orderItems.map((item) => (
                      <div key={item.product.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">{item.product.name}</p>
                            {item.product.prescription_required && (
                              <Badge variant="outline" className="text-xs">
                                Rx
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">${item.product.price} each</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <p className="font-medium text-sm">${(item.product.price * item.quantity).toFixed(2)}</p>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.product.id)}
                            className="h-6 w-6 p-0 text-destructive"
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                    ))}

                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="font-medium">Total:</span>
                      <span className="font-bold text-lg">${total.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Pickup Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !pickupDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {pickupDate ? format(pickupDate, "PPP") : "Select pickup date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={pickupDate}
                    onSelect={setPickupDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Special instructions, prescription details, or other notes..."
              rows={3}
            />
          </div>

          {hasPrescriptionItems && (
            <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <p className="text-sm font-medium text-warning">⚠️ Prescription Items Included</p>
              <p className="text-xs text-warning/80">
                This order contains prescription medications that will require pharmacist verification before
                fulfillment.
              </p>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              className=""
              disabled={!selectedMember || orderItems.length === 0 || !pickupDate}
            >
              Create Pre-Order
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
