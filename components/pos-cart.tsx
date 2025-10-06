// pos-cart.tsx
"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react"

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
  stock: number
  prescription_required: boolean
}

interface POSCartProps {
  items: CartItem[]
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
  onClearCart: () => void
  onCheckout: () => void
}

export function POSCart({ items, onUpdateQuantity, onRemoveItem, onClearCart, onCheckout }: POSCartProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const taxRate = 0.11 // Asumsi PPN 11% (Indonesia)
  const tax = subtotal * taxRate
  const total = subtotal + tax

  const hasItems = items.length > 0
  const hasPrescriptionItems = items.some((item) => item.prescription_required)

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Keranjang ({items.length} item)
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        {/* Item Keranjang */}
        <div className="flex-1 space-y-3 mb-4 max-h-96 overflow-y-auto">
          {items.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Keranjang kosong</p>
              <p className="text-sm">Cari dan tambahkan produk untuk memulai</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    {item.prescription_required && (
                      <Badge variant="outline" className="text-xs">
                        Resep
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{formatRupiah(item.price)} per unit</p>
                </div>

                {/* Kontrol Kuantitas */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    className="h-8 w-8 p-0"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    max={item.stock}
                    value={item.quantity}
                    onChange={(e) => {
                      const qty = Math.min(Math.max(1, Number.parseInt(e.target.value) || 1), item.stock)
                      onUpdateQuantity(item.id, qty)
                    }}
                    className="w-16 h-8 text-center"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdateQuantity(item.id, Math.min(item.stock, item.quantity + 1))}
                    disabled={item.quantity >= item.stock}
                    className="h-8 w-8 p-0"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                {/* Total & Hapus */}
                <div className="text-right">
                  <p className="font-medium text-sm">{formatRupiah(item.price * item.quantity)}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveItem(item.id)}
                    className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Ringkasan Keranjang */}
        {hasItems && (
          <>
            <Separator className="my-4" />
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Pajak (11% PPN):</span>
                <span>{formatRupiah(tax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>{formatRupiah(total)}</span>
              </div>
            </div>

            {/* Peringatan Resep */}
            {hasPrescriptionItems && (
              <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                <p className="text-sm text-warning font-medium">⚠️ Diperlukan Resep</p>
                <p className="text-xs text-warning/80">Beberapa item memerlukan verifikasi resep yang valid</p>
              </div>
            )}

            {/* Tombol Aksi */}
            <div className="mt-4 space-y-2">
              <Button onClick={onCheckout} className="w-full h-12 text-lg font-medium">
                Lanjut ke Pembayaran
              </Button>
              <Button variant="outline" onClick={onClearCart} className="w-full bg-transparent">
                Kosongkan Keranjang
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
