// stock-transfer-form.tsx
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
import { Plus, Minus, Search, Package, ArrowRight, X } from "lucide-react"

interface Product {
  id: string
  name: string
  sku: string
  currentStock: number
  unit: string
}

interface Branch {
    id: string;
    name: string;
    code: string;
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
  branches: Branch[] // Menerima data cabang
  onSubmit: (transfer: any) => void
  onCancel: () => void
}

// Mock products data (asumsi stok ini adalah stok di Cabang Sumber)
const mockProducts: Product[] = [
    { id: "1", name: "Paracetamol 500mg", sku: "MED001", currentStock: 150, unit: "tablet" },
    { id: "2", name: "Amoxicillin 250mg", sku: "MED002", currentStock: 80, unit: "kapsul" },
    { id: "3", name: "Ibuprofen 400mg", sku: "MED003", currentStock: 120, unit: "tablet" },
    { id: "4", name: "Cetirizine 10mg", sku: "MED004", currentStock: 200, unit: "tablet" },
    { id: "5", name: "Omeprazole 20mg", sku: "MED005", currentStock: 90, unit: "kapsul" },
]


export function StockTransferForm({ branches, onSubmit, onCancel }: StockTransferFormProps) {
  const [formData, setFormData] = useState({
    transferId: `TRF${String(Date.now()).slice(-6)}`,
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

  const filteredProducts = mockProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const addTransferItem = () => {
    // Validasi dasar
    if (
        !selectedProduct || 
        quantity <= 0 || 
        quantity > selectedProduct.currentStock ||
        transferItems.some(item => item.productId === selectedProduct.id && item.quantity + quantity > item.availableStock)
    ) return;

    const existingItem = transferItems.find((item) => item.productId === selectedProduct.id)

    if (existingItem) {
        // Jika item sudah ada, tambahkan kuantitas
        setTransferItems((prev) =>
            prev.map((item) =>
                item.productId === selectedProduct.id 
                ? { ...item, quantity: Math.min(item.availableStock, item.quantity + quantity) } 
                : item,
            ),
        )
    } else {
        // Item baru
        const newItem: TransferItem = {
            productId: selectedProduct.id,
            productName: selectedProduct.name,
            sku: selectedProduct.sku,
            quantity: Math.min(quantity, selectedProduct.currentStock), // Batasi kuantitas
            unit: selectedProduct.unit,
            availableStock: selectedProduct.currentStock,
        }
        setTransferItems((prev) => [...prev, newItem])
    }

    setSelectedProduct(null)
    setQuantity(1)
    setSearchTerm("")
  }

  const removeTransferItem = (productId: string) => {
    setTransferItems((prev) => prev.filter((item) => item.productId !== productId))
  }

  const updateQuantity = (productId: string, newQuantity: number) => {
    const itemToUpdate = transferItems.find(item => item.productId === productId);
    if (!itemToUpdate) return;
    
    // Batasi kuantitas antara 1 dan stok yang tersedia
    const safeQuantity = Math.min(Math.max(1, newQuantity), itemToUpdate.availableStock);
    
    if (safeQuantity > 0) {
      setTransferItems((prev) =>
        prev.map((item) => (item.productId === productId ? { ...item, quantity: safeQuantity } : item)),
      )
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (transferItems.length === 0 || !formData.fromBranch || !formData.toBranch) return

    const transferData = {
      ...formData,
      items: transferItems,
      totalItems: transferItems.reduce((sum, item) => sum + item.quantity, 0),
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
    
    const label = {
        low: "Rendah",
        normal: "Normal",
        high: "Tinggi",
        urgent: "Mendesak",
    }[priority as keyof typeof variants] || priority;


    return (
      <Badge variant={variants[priority as keyof typeof variants] || "outline"}>
        {label}
      </Badge>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Detail Transfer */}
      <Card>
        <CardHeader>
          <CardTitle>Detail Transfer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="transferId">ID Transfer</Label>
              <Input
                id="transferId"
                value={formData.transferId}
                required
                disabled
              />
            </div>
            <div>
              <Label htmlFor="requestedBy">Diminta Oleh</Label>
              <Input
                id="requestedBy"
                value={formData.requestedBy}
                onChange={(e) => setFormData((prev) => ({ ...prev, requestedBy: e.target.value }))}
                required
                placeholder="Masukkan nama Anda"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div>
              <Label htmlFor="fromBranch">Dari Cabang *</Label>
              <Select
                value={formData.fromBranch}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, fromBranch: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih cabang sumber" />
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

            <div className="flex items-center justify-center pt-6 md:pt-0">
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
            </div>

            <div>
              <Label htmlFor="toBranch">Ke Cabang *</Label>
              <Select
                value={formData.toBranch}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, toBranch: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih cabang tujuan" />
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
              <Label htmlFor="priority">Prioritas</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, priority: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Rendah</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">Tinggi</SelectItem>
                  <SelectItem value="urgent">Mendesak</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">{getPriorityBadge(formData.priority)}</div>
          </div>

          <div>
            <Label htmlFor="notes">Catatan</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              rows={3}
              placeholder="Catatan tambahan untuk transfer ini..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Tambah Produk */}
      <Card>
        <CardHeader>
          <CardTitle>Tambah Produk ke Transfer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label>Cari Produk</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Cari berdasarkan nama atau SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-32">
              <Label>Kuantitas</Label>
              <Input
                type="number"
                min="1"
                max={selectedProduct?.currentStock}
                value={quantity}
                onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
              />
            </div>
            <div className="flex items-end">
              <Button type="button" onClick={addTransferItem} disabled={!selectedProduct || quantity > (selectedProduct?.currentStock || 0)}>
                <Plus className="h-4 w-4 mr-2" />
                Tambah
              </Button>
            </div>
          </div>

          {searchTerm && (
            <div className="border rounded-lg max-h-48 overflow-y-auto">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={`p-3 cursor-pointer hover:bg-muted ${
                    selectedProduct?.id === product.id ? "bg-muted/70" : ""
                  }`}
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground">SKU: {product.sku}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">Stok: {product.currentStock}</div>
                      <div className="text-xs text-muted-foreground">{product.unit}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Item Transfer */}
      {transferItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Item Transfer ({transferItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produk</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Stok Tersedia</TableHead>
                    <TableHead>Kuantitas Transfer</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Aksi</TableHead>
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
                          size="icon"
                          onClick={() => removeTransferItem(item.productId)}
                          title="Hapus Item"
                        >
                          <X className="h-4 w-4" />
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
          Batal
        </Button>
        <Button 
            type="submit" 
            disabled={transferItems.length === 0 || !formData.fromBranch || !formData.toBranch || formData.fromBranch === formData.toBranch}
        >
          Buat Permintaan Transfer
        </Button>
      </div>
    </form>
  )
}
