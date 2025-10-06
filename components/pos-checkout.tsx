// pos-checkout.tsx
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
import { Separator } from "@/components/ui/separator"
import { CreditCard, DollarSign, Smartphone, Receipt, Loader2 } from "lucide-react"

// Fungsi Helper untuk format Rupiah
const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  prescription_required: boolean
}

interface Member {
  id: string
  name: string
  email?: string
  phone?: string
}

interface POSCheckoutProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: CartItem[]
  member: Member | null
  onCompleteTransaction: (transactionData: any) => void
}

const paymentMethods = [
  { id: "cash", name: "Tunai", icon: DollarSign },
  { id: "card", name: "Kartu Kredit/Debit", icon: CreditCard },
  { id: "mobile", name: "Pembayaran Seluler", icon: Smartphone },
]

export function POSCheckout({ open, onOpenChange, items, member, onCompleteTransaction }: POSCheckoutProps) {
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [amountReceived, setAmountReceived] = useState("")
  const [notes, setNotes] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const taxRate = 0.11 // PPN 11%
  const tax = subtotal * taxRate
  const total = subtotal + tax

  const amountReceivedNum = Number.parseFloat(amountReceived) || 0
  const change = Math.max(0, amountReceivedNum - total)

  const handleCompleteTransaction = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulasikan pemrosesan pembayaran
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const transactionData = {
      id: `TXN${Date.now()}`,
      transaction_number: `TXN${String(Date.now()).slice(-6)}`,
      member_id: member?.id || null,
      items: items.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
      })),
      subtotal,
      tax,
      total,
      payment_method: paymentMethod,
      amount_received: paymentMethod === "cash" ? amountReceivedNum : total,
      change: paymentMethod === "cash" ? change : 0,
      notes,
      status: "completed",
      created_at: new Date().toISOString(),
      // Ini akan masuk ke list transactions di aplikasi nyata
    }

    onCompleteTransaction(transactionData)
    setIsProcessing(false)
    onOpenChange(false)

    // Reset form
    setPaymentMethod("cash")
    setAmountReceived("")
    setNotes("")
  }

  const canComplete =
    items.length > 0 && (paymentMethod !== "cash" || (amountReceivedNum >= total && amountReceivedNum > 0))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Selesaikan Transaksi
          </DialogTitle>
          <DialogDescription>Tinjau detail pesanan dan proses pembayaran</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCompleteTransaction} className="space-y-6">
          {/* Info Pelanggan */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Informasi Pelanggan</CardTitle>
            </CardHeader>
            <CardContent>
              {member ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{member.name}</p>
                    {member.email && <p className="text-sm text-muted-foreground">{member.email}</p>}
                    {member.phone && <p className="text-sm text-muted-foreground">{member.phone}</p>}
                  </div>
                  <Badge variant={member.id === "guest" ? "secondary" : "default"}>
                    {member.id === "guest" ? "Tamu" : "Anggota"}
                  </Badge>
                </div>
              ) : (
                <p className="text-muted-foreground">Tidak ada pelanggan terpilih</p>
              )}
            </CardContent>
          </Card>

          {/* Ringkasan Pesanan */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Ringkasan Pesanan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.name}</span>
                      {item.prescription_required && (
                        <Badge variant="outline" className="text-xs">
                          Resep
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatRupiah(item.price * item.quantity)}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} × {formatRupiah(item.price)}
                      </p>
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatRupiah(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pajak (11%):</span>
                    <span>{formatRupiah(tax)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>{formatRupiah(total)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metode Pembayaran */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Metode Pembayaran</Label>
            <div className="grid grid-cols-3 gap-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon
                return (
                  <Button
                    key={method.id}
                    type="button"
                    variant={paymentMethod === method.id ? "default" : "outline"}
                    onClick={() => setPaymentMethod(method.id)}
                    className="h-16 flex-col gap-2"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs">{method.name}</span>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Detail Pembayaran Tunai */}
          {paymentMethod === "cash" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount_received">Jumlah Diterima (Rp) *</Label>
                <Input
                  id="amount_received"
                  type="number"
                  step="any"
                  min={total}
                  value={amountReceived}
                  onChange={(e) => setAmountReceived(e.target.value)}
                  placeholder={`Minimum: ${total}`}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Kembalian</Label>
                <div className="h-10 px-3 py-2 border rounded-md bg-muted flex items-center">
                  <span className="font-medium text-lg">{formatRupiah(change)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Catatan */}
          <div className="space-y-2">
            <Label htmlFor="notes">Catatan (Opsional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tambahkan catatan tentang transaksi ini..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
              Batal
            </Button>
            <Button type="submit" className="" disabled={!canComplete || isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                `Selesaikan Transaksi - ${formatRupiah(total)}`
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
