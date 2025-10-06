// product-table.tsx
"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
// Hapus imports DropdownMenu, DropdownMenuItem, dll.
import { Edit, Trash2, Package, AlertTriangle, CheckCircle } from "lucide-react"
// Hapus import mockData

interface Product {
  id: string
  name: string
  generic_name: string
  brand: string
  category: string
  price: number
  cost: number
  stock: number
  min_stock: number
  max_stock: number
  expiry_date: string
  batch_number: string
  supplier: string
  prescription_required: boolean
  status: "active" | "inactive"
  created_at: string
}

interface ProductTableProps {
  products: Product[] // Menerima data produk dari props
  onEditProduct: (product: Product) => void
  onAddStock: (productId: string) => void
  onDeleteProduct: (productId: string) => void
}

const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0, // Opsional: menghilangkan ,00
  }).format(amount);
};

export function ProductTable({ products, onEditProduct, onAddStock, onDeleteProduct }: ProductTableProps) { 
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.generic_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  // Terjemahkan status stok
  const getStockStatus = (product: Product) => {
    if (product.stock <= product.min_stock) {
      return { status: "rendah", color: "bg-destructive/10 text-destructive", icon: AlertTriangle }
    }
    if (product.stock >= product.max_stock) {
      return { status: "tinggi", color: "bg-warning/10 text-warning", icon: Package }
    }
    return { status: "normal", color: "bg-success/10 text-success", icon: CheckCircle }
  }

  // Terjemahkan status kedaluwarsa
  const getExpiryStatus = (expiryDate: string) => {
    const expiry = new Date(expiryDate)
    const now = new Date()
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntilExpiry <= 30) {
      return { status: "segera kedaluwarsa", color: "bg-destructive/10 text-destructive" }
    }
    if (daysUntilExpiry <= 90) {
      return { status: "peringatan", color: "bg-warning/10 text-warning" }
    }
    return { status: "baik", color: "bg-success/10 text-success" }
  }

  const categories = Array.from(new Set(products.map((p) => p.category)))

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Cari produk..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 border border-input rounded-md bg-background text-foreground"
        >
          <option value="all">Semua Kategori</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Tabel */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produk</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Stok</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>Kedaluwarsa</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[150px] text-center">Aksi</TableHead> {/* Lebar disesuaikan */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product)
              const expiryStatus = getExpiryStatus(product.expiry_date)
              const StockIcon = stockStatus.icon

              return (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-foreground">{product.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {product.generic_name} • {product.brand}
                      </div>
                      <div className="text-xs text-muted-foreground">Batch: {product.batch_number}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{product.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <StockIcon className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{product.stock} unit</div>
                        <div className="text-xs text-muted-foreground">
                          Min: {product.min_stock} • Maks: {product.max_stock}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{formatRupiah(product.price)}</div>
                      <div className="text-xs text-muted-foreground">Biaya: {formatRupiah(product.cost)}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={expiryStatus.color}>{new Date(product.expiry_date).toLocaleDateString()}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge className={stockStatus.color}>{stockStatus.status}</Badge>
                      {product.prescription_required && (
                        <Badge variant="outline" className="text-xs">
                          Resep
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  {/* BARIS AKSI BARU */}
                  <TableCell className="w-[150px]">
                    <div className="flex items-center space-x-1 justify-center">
                      
                      {/* 1. Edit Button */}
                      <Button variant="ghost" size="icon" onClick={() => onEditProduct(product)} title="Ubah Produk">
                        <Edit className="h-4 w-4" />
                      </Button>

                      {/* 2. Add Stock Button */}
                      <Button variant="ghost" size="icon" onClick={() => onAddStock(product.id)} title="Tambah Stok">
                        <Package className="h-4 w-4" />
                      </Button>

                      {/* 3. Delete Button (wrapped in AlertDialog) */}
                      <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" title="Hapus Produk">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Hapus Produk</AlertDialogTitle>
                              <AlertDialogDescription>
                                Anda yakin ingin menghapus **"{product.name}"**? Tindakan ini tidak dapat dibatalkan.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => onDeleteProduct(product.id)}
                                className="bg-destructive text-white hover:bg-destructive/90"
                              >
                                Hapus
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">Tidak ada produk yang ditemukan sesuai kriteria Anda.</div>
      )}
    </div>
  )
}