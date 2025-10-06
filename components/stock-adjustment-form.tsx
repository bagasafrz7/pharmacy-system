// stock-adjustment-form.tsx
"use client"

import type React from "react"

import { useState, useEffect } from "react" // Tambah useEffect untuk reset
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Minus, Package } from "lucide-react"

interface StockAdjustmentFormProps {
  productId: string | null
  productName: string
  currentStock: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (adjustment: {
    productId: string
    adjustmentType: "in" | "out" // Ubah 'type' menjadi 'adjustmentType' dan valuenya menjadi 'in'/'out' agar konsisten dengan logika sebelumnya
    quantity: number
    reason: string
    notes?: string
  }) => void
}

const adjustmentReasons = {
  in: [
    "Penerimaan Stok Baru", 
    "Pengembalian Stok", 
    "Koreksi Inventaris", 
    "Transfer Masuk", 
    "Lainnya"
  ],
  out: [
    "Produk Kedaluwarsa", 
    "Produk Rusak", 
    "Transfer Stok Keluar", 
    "Koreksi Inventaris", 
    "Pencurian/Kehilangan", 
    "Lainnya"
  ],
}

export function StockAdjustmentForm({
  productId,
  productName,
  currentStock,
  open,
  onOpenChange,
  onSave,
}: StockAdjustmentFormProps) {
  // Ubah 'add'/'remove' menjadi 'in'/'out' agar lebih sesuai dengan konteks inventaris
  const [adjustmentType, setAdjustmentType] = useState<"in" | "out">("in") 
  const [quantity, setQuantity] = useState(0)
  const [reason, setReason] = useState("")
  const [notes, setNotes] = useState("")

  // PENTING: Reset state lokal saat dialog dibuka/ditutup (setelah operasi)
  useEffect(() => {
    if (open) {
        setAdjustmentType("in");
        setQuantity(0);
        setReason("");
        setNotes("");
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!productId || quantity <= 0 || !reason) return // Tambahkan validasi reason

    onSave({
      productId,
      adjustmentType, // Menggunakan adjustmentType ('in'/'out')
      quantity,
      reason,
      notes,
    })

    // onOpenChange(false) dipanggil setelah onSave di ProductsPage
  }

  // Hitung perkiraan stok baru
  const newStock = adjustmentType === "in" ? currentStock + quantity : Math.max(0, currentStock - quantity)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Penyesuaian Stok
          </DialogTitle>
          <DialogDescription>
            Sesuaikan level stok untuk <strong>{productName}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tampilan Stok Saat Ini */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Stok Saat Ini:</span>
              <span className="font-medium">{currentStock} unit</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-muted-foreground">Stok Baru:</span>
              <span className="font-medium text-primary">{newStock} unit</span>
            </div>
          </div>

          {/* Jenis Penyesuaian */}
          <div className="space-y-2">
            <Label>Jenis Penyesuaian</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={adjustmentType === "in" ? "default" : "outline"}
                onClick={() => setAdjustmentType("in")}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Tambah Stok
              </Button>
              <Button
                type="button"
                variant={adjustmentType === "out" ? "default" : "outline"}
                onClick={() => setAdjustmentType("out")}
                className="flex items-center gap-2"
              >
                <Minus className="h-4 w-4" />
                Kurangi Stok
              </Button>
            </div>
          </div>

          {/* Kuantitas */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Kuantitas *</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 0)}
              placeholder="Masukkan kuantitas"
              required
            />
          </div>

          {/* Alasan */}
          <div className="space-y-2">
            <Label htmlFor="reason">Alasan *</Label>
            <Select value={reason} onValueChange={setReason} required>
              <SelectTrigger>
                <SelectValue placeholder="Pilih alasan" />
              </SelectTrigger>
              <SelectContent>
                {/* Opsi alasan bergantung pada jenis penyesuaian */}
                {adjustmentReasons[adjustmentType].map((reasonOption) => (
                  <SelectItem key={reasonOption} value={reasonOption}>
                    {reasonOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Catatan */}
          <div className="space-y-2">
            <Label htmlFor="notes">Catatan (Opsional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Catatan tambahan tentang penyesuaian ini..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button
              type="submit"
              // Warna tombol disesuaikan: Hijau untuk tambah, Merah untuk kurangi
              className={adjustmentType === "in" ? "" : "bg-destructive hover:bg-destructive/90"}
              disabled={!productId || quantity <= 0 || !reason}
            >
              {adjustmentType === "in" ? "Tambah Stok" : "Kurangi Stok"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}