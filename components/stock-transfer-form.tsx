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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Minus, Search, Package, ArrowRight } from "lucide-react"

interface Product {
  id: string
  name: string
  sku: string
  currentStock: number
  unit: string
}

interface TransferItem {
  productId: string
  productName: string
  sku: string
  quantity: number
  unit: string
  availableStock: number
}

interface StockTransferFormProps {
  onSubmit: (transfer: any) => void
  onCancel: () => void
}

export function StockTransferForm({ onSubmit, onCancel }: StockTransferFormProps) {
  const [formData, setFormData] = useState({
    transferId: `TRF${Date.now()}`,
    fromBranch: "",
    toBranch: "",
    requestedBy: "",
    notes: "",
    priority: "normal",
  })

  const [transferItems, setTransferItems] = useState<TransferItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)

  // Mock products data
  const mockProducts: Product[] = [
    { id: "1", name: "Paracetamol 500mg", sku: "MED001", currentStock: 150, unit: "tablets" },
    { id: "2", name: "Amoxicillin 250mg", sku: "MED002", currentStock: 80, unit: "capsules" },
    { id: "3", name: "Ibuprofen 400mg", sku: "MED003", currentStock: 120, unit: "tablets" },
    { id: "4", name: "Cetirizine 10mg", sku: "MED004", currentStock: 200, unit: "tablets" },
    { id: "5", name: "Omeprazole 20mg", sku: "MED005", currentStock: 90, unit: "capsules" },
  ]

  const branches = [
    { id: "1", name: "Main Branch - Makati", code: "MKT" },
    { id: "2", name: "Quezon City Branch", code: "QC" },
    { id: "3", name: "Pasig Branch", code: "PSG" },
    { id: "4", name: "Taguig Branch", code: "TGG" },
  ]

  const filteredProducts = mockProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const addTransferItem = () => {
    if (selectedProduct && quantity > 0) {
      const existingItem = transferItems.find((item) => item.productId === selectedProduct.id)

      if (existingItem) {
        setTransferItems((prev) =>
          prev.map((item) =>
            item.productId === selectedProduct.id ? { ...item, quantity: item.quantity + quantity } : item,
          ),
        )
      } else {
        const newItem: TransferItem = {
          productId: selectedProduct.id,
          productName: selectedProduct.name,
          sku: selectedProduct.sku,
          quantity,
          unit: selectedProduct.unit,
          availableStock: selectedProduct.currentStock,
        }
        setTransferItems((prev) => [...prev, newItem])
      }

      setSelectedProduct(null)
      setQuantity(1)
      setSearchTerm("")
    }
  }

  const removeTransferItem = (productId: string) => {
    setTransferItems((prev) => prev.filter((item) => item.productId !== productId))
  }

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      setTransferItems((prev) =>
        prev.map((item) => (item.productId === productId ? { ...item, quantity: newQuantity } : item)),
      )
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (transferItems.length === 0) return

    const transferData = {
      ...formData,
      items: transferItems,
      totalItems: transferItems.reduce((sum, item) => sum + item.quantity, 0),
      status: "pending",
      createdAt: new Date(),
    }

    onSubmit(transferData)
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Transfer Details */}
      <Card>
        <CardHeader>
          <CardTitle>Transfer Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="transferId">Transfer ID</Label>
              <Input
                id="transferId"
                value={formData.transferId}
                onChange={(e) => setFormData((prev) => ({ ...prev, transferId: e.target.value }))}
                required
                disabled
              />
            </div>
            <div>
              <Label htmlFor="requestedBy">Requested By</Label>
              <Input
                id="requestedBy"
                value={formData.requestedBy}
                onChange={(e) => setFormData((prev) => ({ ...prev, requestedBy: e.target.value }))}
                required
                placeholder="Enter your name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="fromBranch">From Branch</Label>
              <Select
                value={formData.fromBranch}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, fromBranch: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select source branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-center">
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
            </div>

            <div>
              <Label htmlFor="toBranch">To Branch</Label>
              <Select
                value={formData.toBranch}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, toBranch: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select destination branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches
                    .filter((branch) => branch.id !== formData.fromBranch)
                    .map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, priority: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">{getPriorityBadge(formData.priority)}</div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              rows={3}
              placeholder="Additional notes for this transfer..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Add Products */}
      <Card>
        <CardHeader>
          <CardTitle>Add Products to Transfer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label>Search Products</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by name or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-32">
              <Label>Quantity</Label>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
              />
            </div>
            <div className="flex items-end">
              <Button type="button" onClick={addTransferItem} disabled={!selectedProduct}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>

          {searchTerm && (
            <div className="border rounded-lg max-h-48 overflow-y-auto">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={`p-3 cursor-pointer hover:bg-muted ${
                    selectedProduct?.id === product.id ? "bg-muted" : ""
                  }`}
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground">SKU: {product.sku}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">Stock: {product.currentStock}</div>
                      <div className="text-xs text-muted-foreground">{product.unit}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transfer Items */}
      {transferItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Transfer Items ({transferItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Available Stock</TableHead>
                    <TableHead>Transfer Quantity</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transferItems.map((item) => (
                    <TableRow key={item.productId}>
                      <TableCell className="font-medium">{item.productName}</TableCell>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell>
                        <Badge variant={item.availableStock < item.quantity ? "destructive" : "secondary"}>
                          {item.availableStock}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-12 text-center">{item.quantity}</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            disabled={item.quantity >= item.availableStock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeTransferItem(item.productId)}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={transferItems.length === 0 || !formData.fromBranch || !formData.toBranch}>
          Create Transfer Request
        </Button>
      </div>
    </form>
  )
}
