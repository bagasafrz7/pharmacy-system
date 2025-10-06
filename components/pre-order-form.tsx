// pre-order-form.tsx
"use client"

import type React from "react"

import { useState, useEffect } from "react" // Tambah useEffect
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
// Hapus import: Calendar, Popover, PopoverContent, PopoverTrigger, CalendarIcon, format, cn
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Minus, Search, User, Stethoscope } from "lucide-react"
import { mockData } from "@/lib/mock-data"

// Fungsi Helper untuk format Rupiah
const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Fungsi Helper untuk format tanggal ke string YYYY-MM-DD
const formatDateToInput = (date: Date): string => {
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split('T')[0];
};

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
  // Mengubah pickupDate menjadi string YYYY-MM-DD untuk input natif
  const [pickupDate, setPickupDate] = useState<string>(formatDateToInput(new Date())) 
  const [notes, setNotes] = useState("")
  const [priority, setPriority] = useState("normal")

  const products = mockData.products as Product[]
  const members = mockData.members as Member[]

  // Sinkronisasi/Reset State saat dialog dibuka/ditutup
  useEffect(() => {
    if (!open) {
      setSelectedMember(null)
      setMemberSearch("")
      setProductSearch("")
      setOrderItems([])
      setPickupDate(formatDateToInput(new Date()))
      setNotes("")
      setPriority("normal")
    }
  }, [open]);

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
    const product = products.find(p => p.id === productId);
    const maxStock = product?.stock || 9999;
    
    setOrderItems((items) =>
      items.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.max(1, Math.min(quantity, maxStock)) }
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
      pickup_date: pickupDate, // Sudah dalam format string YYYY-MM-DD
      priority,
      notes,
      status: "pending",
      created_at: new Date().toISOString(),
    }

    onSubmit(orderData)
    // onOpenChange(false) dipanggil oleh useEffect setelah onSubmit berhasil.
  }

  const total = orderItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const hasPrescriptionItems = orderItems.some((item) => item.product.prescription_required)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Buat Pre-Order
          </DialogTitle>
          <DialogDescription>
            Buat pre-order untuk resep obat dan produk farmasi lainnya
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pemilihan Anggota */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4" />
                Pilih Pasien
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
                    Ganti
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari pasien berdasarkan nama, email, atau telepon..."
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

          {/* Pemilihan Produk */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Tambah Produk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari produk untuk ditambahkan ke pre-order..."
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
                                Resep
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {product.generic_name} • {formatRupiah(product.price)}
                          </p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Item Pesanan */}
                {orderItems.length > 0 && (
                  <div className="space-y-3 pt-4 border-t">
                    <h4 className="font-medium">Item Pesanan</h4>
                    {orderItems.map((item) => (
                      <div key={item.product.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">{item.product.name}</p>
                            {item.product.prescription_required && (
                              <Badge variant="outline" className="text-xs">
                                Resep
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{formatRupiah(item.product.price)} per unit</p>
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
                          <p className="font-medium text-sm">{formatRupiah(item.product.price * item.quantity)}</p>
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
                      <span className="font-bold text-lg">{formatRupiah(total)}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Detail Pesanan */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tanggal Pengambilan *</Label>
              {/* PERUBAHAN KRUSIAL: Menggunakan input type="date" natif */}
              <Input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                min={formatDateToInput(new Date())} // Set tanggal minimum hari ini
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Prioritas</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="urgent">Mendesak</SelectItem>
                  <SelectItem value="emergency">Darurat</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Catatan</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Instruksi khusus, detail resep, atau catatan lainnya..."
              rows={3}
            />
          </div>

          {hasPrescriptionItems && (
            <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <p className="text-sm font-medium text-warning">⚠️ Item Resep Termasuk</p>
              <p className="text-xs text-warning/80">
                Pesanan ini mengandung obat resep yang memerlukan verifikasi apoteker sebelum pemenuhan.
              </p>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button
              type="submit"
              className=""
              disabled={!selectedMember || orderItems.length === 0 || !pickupDate}
            >
              Buat Pre-Order
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
