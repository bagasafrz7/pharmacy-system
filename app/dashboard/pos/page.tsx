// page.tsx (pos)
"use client"

import { useState, useCallback } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { POSProductSearch } from "@/components/pos-product-search"
import { POSCart } from "@/components/pos-cart"
import { POSMemberLookup } from "@/components/pos-member-lookup"
import { POSCheckout } from "@/components/pos-checkout"
import { ReceiptPrintDialog } from "@/components/receipt-print-dialog" // <--- KOMPONEN CETAK STRUK BARU
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { ShoppingCart, User, Receipt, CheckCircle } from "lucide-react"

// Fungsi Helper untuk format Rupiah
const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

interface Product {
  id: string
  name: string
  generic_name: string
  brand: string
  category: string
  price: number
  stock: number
  min_stock: number
  prescription_required: boolean
  status: "active" | "inactive"
}

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  stock: number
  prescription_required: boolean
}

interface Member {
  id: string
  name: string
  email: string
  phone: string
  date_of_birth: string
  address: string
  insurance_number: string
  allergies: string[]
  medical_conditions: string[]
  status: "active" | "inactive"
}

interface TransactionData {
  transaction_number: string;
  member_id: string | null;
  total: number;
  subtotal: number;
  tax: number;
  amount_received: number;
  change: number;
  payment_method: string;
  items: any[]; 
  created_at: string;
}


export default function POSPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [showCheckout, setShowCheckout] = useState(false)
  const [printedReceipt, setPrintedReceipt] = useState<TransactionData | null>(null); // <--- STATE BARU UNTUK STRUK

  const handleAddToCart = useCallback((product: Product, quantity: number) => {
    const existingItem = cartItems.find((item) => item.id === product.id)

    if (existingItem) {
      const newQuantity = Math.min(existingItem.quantity + quantity, product.stock)
      setCartItems((items) => items.map((item) => (item.id === product.id ? { ...item, quantity: newQuantity } : item)))
      toast.success(`Jumlah ${product.name} diperbarui menjadi ${newQuantity}`)
    } else {
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: Math.min(quantity, product.stock),
        stock: product.stock,
        prescription_required: product.prescription_required,
      }
      setCartItems((items) => [...items, newItem])
      toast.success(`${product.name} ditambahkan ke keranjang`)
    }
  }, [cartItems])

  const handleUpdateQuantity = useCallback((id: string, quantity: number) => {
    setCartItems((items) => items.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }, [])

  const handleRemoveItem = useCallback((id: string) => {
    const item = cartItems.find((item) => item.id === id)
    setCartItems((items) => items.filter((item) => item.id !== id))
    if (item) {
      toast.success(`${item.name} dihapus dari keranjang`)
    }
  }, [cartItems])

  const handleClearCart = useCallback(() => {
    setCartItems([])
    toast.success("Keranjang dikosongkan")
  }, [])


  const handleCompleteTransaction = (transactionData: TransactionData) => {
    console.log("Transaksi Selesai. Data Transaksi:", transactionData)

    // 1. Simpan data transaksi untuk ditampilkan di struk
    setPrintedReceipt(transactionData); // <--- Memicu dialog cetak

    // 2. Kosongkan keranjang dan reset pelanggan
    setCartItems([])
    setSelectedMember(null)
    
    // 3. Tampilkan notifikasi
    toast.success(
      <div className="flex items-center gap-2">
        <CheckCircle className="h-4 w-4 text-success" />
        <div>
          <p className="font-medium">Transaksi Selesai!</p>
          <p className="text-xs">Nomor Transaksi: {transactionData.transaction_number}</p>
        </div>
      </div>,
    )
  }


  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalValue = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Kasir (Point of Sale)"
        description="Memproses transaksi penjualan dan mengelola inventaris secara real-time"
      />

      <div className="px-6">
        {/* Statistik Cepat */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Item Keranjang</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalItems}</div>
              <p className="text-xs text-muted-foreground">Produk dalam keranjang</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Nilai Keranjang</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{formatRupiah(totalValue)}</div>
              <p className="text-xs text-muted-foreground">Sebelum pajak</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pelanggan</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-foreground">
                {selectedMember ? selectedMember.name : "Tanpa Pelanggan"}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={selectedMember ? "default" : "secondary"}>
                  {selectedMember?.id === "guest" ? "Tamu" : selectedMember ? "Anggota" : "Belum Dipilih"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Antarmuka POS Utama */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Kolom Kiri - Pencarian Produk & Pencarian Anggota */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pencarian Produk */}
            <Card>
              <CardHeader>
                <CardTitle>Pencarian Produk</CardTitle>
              </CardHeader>
              <CardContent>
                <POSProductSearch onAddToCart={handleAddToCart} />
              </CardContent>
            </Card>

            {/* Pencarian Anggota */}
            <POSMemberLookup selectedMember={selectedMember} onSelectMember={setSelectedMember} />
          </div>

          {/* Kolom Kanan - Keranjang */}
          <div className="lg:col-span-1">
            <POSCart
              items={cartItems}
              // Gunakan useCallback untuk memastikan props stabil
              onUpdateQuantity={handleUpdateQuantity} 
              onRemoveItem={handleRemoveItem}
              onClearCart={handleClearCart}
              onCheckout={() => setShowCheckout(true)}
            />
          </div>
        </div>
      </div>

      {/* Checkout Dialog */}
      <POSCheckout
        open={showCheckout}
        onOpenChange={setShowCheckout}
        items={cartItems}
        member={selectedMember}
        onCompleteTransaction={handleCompleteTransaction}
      />

      {/* DIALOG CETAK STRUK */}
      <ReceiptPrintDialog
        transactionData={printedReceipt}
        onClose={() => setPrintedReceipt(null)} // Menutup dialog cetak
      />
    </div>
  )
}