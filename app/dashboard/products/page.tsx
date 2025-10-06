"use client"

import { useState, useMemo } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { ProductTable } from "@/components/product-table"
import { ProductForm } from "@/components/product-form"
import { StockAdjustmentForm } from "@/components/stock-adjustment-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Package, AlertTriangle, TrendingUp } from "lucide-react"
import { mockData } from "@/lib/mock-data"
import { v4 as uuidv4 } from 'uuid'; 

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

const initialProducts: Product[] = (mockData.products as Product[]).map(p => ({ ...p }));

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [showProductForm, setShowProductForm] = useState(false)
  const [showStockForm, setShowStockForm] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [stockAdjustmentProduct, setStockAdjustmentProduct] = useState<{
    id: string
    name: string
    stock: number
  } | null>(null)

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setShowProductForm(true)
  }
  
  const handleAddProductClick = () => {
    setSelectedProduct(null); 
    setShowProductForm(true);
  }

  const handleAddStock = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    if (product) {
      setStockAdjustmentProduct({
        id: product.id,
        name: product.name,
        stock: product.stock,
      })
      setShowStockForm(true)
    }
  }

  const handleSaveProduct = (productData: Partial<Product>) => {
    const isEditing = !!productData.id

    if (isEditing) {
      setProducts((prevProducts) =>
        prevProducts.map((p) => (p.id === productData.id ? ({ ...p, ...productData } as Product) : p))
      )
    } else {
      const newProduct: Product = {
        ...productData,
        id: uuidv4(), 
        created_at: new Date().toISOString(),
      } as Product
      
      setProducts((prevProducts) => [newProduct, ...prevProducts])
    }

    // Reset state untuk mengosongkan form dan menutup dialog
    setSelectedProduct(null)
    setShowProductForm(false)
  }
  
  const handleDeleteProduct = (productId: string) => {
    setProducts((prevProducts) => prevProducts.filter(p => p.id !== productId))
    console.log(`Produk dengan ID ${productId} telah dihapus.`)
  }

  const handleSaveStockAdjustment = (adjustment: { 
    productId: string; 
    adjustmentType: 'in' | 'out'; // Tipe yang sudah disesuaikan
    quantity: number; 
    reason: string 
}) => {
    console.log("Penyesuaian stok:", adjustment);
    
    setProducts((prevProducts) => 
        prevProducts.map(p => {
            if (p.id === adjustment.productId) {
                const newStock = adjustment.adjustmentType === 'in'
                    ? p.stock + adjustment.quantity
                    : p.stock - adjustment.quantity
                
                // Pastikan stok tidak negatif
                return { ...p, stock: newStock > 0 ? newStock : 0 } 
            }
            return p
        })
    );

    setShowStockForm(false);
    setStockAdjustmentProduct(null);
}

  const stats = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    const lowStockProducts = products.filter((p) => p.stock <= p.min_stock).length;
    const expiringProducts = products.filter((p) => {
      const expiry = new Date(p.expiry_date);
      const expiryDateOnly = new Date(expiry.getFullYear(), expiry.getMonth(), expiry.getDate()).getTime();
      const daysUntilExpiry = Math.ceil((expiryDateOnly - today) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
    }).length;
    const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

    return {
      totalProducts: products.length,
      lowStockProducts,
      expiringProducts,
      totalValue,
    };
  }, [products]);

  const { totalProducts, lowStockProducts, expiringProducts, totalValue } = stats;

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Manajemen Produk"
        description="Kelola inventaris farmasi Anda dengan pelacakan stok secara real-time"
      />

      <div className="px-6 space-y-6">
        {/* Kartu Statistik */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Produk</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalProducts}</div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-success" />
                <span className="text-xs text-success">5% dari bulan lalu</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Stok Rendah</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{lowStockProducts}</div>
              <p className="text-xs text-muted-foreground mt-1">Memerlukan perhatian segera</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Akan Kedaluwarsa</CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{expiringProducts}</div>
              <p className="text-xs text-muted-foreground mt-1">Dalam 30 hari</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Nilai Inventaris</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">${totalValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Total nilai stok</p>
            </CardContent>
          </Card>
        </div>

        {/* Notifikasi (Alerts) */}
        {(lowStockProducts > 0 || expiringProducts > 0) && (
          <div className="space-y-3">
            {lowStockProducts > 0 && (
              <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-destructive">Peringatan Stok Rendah</p>
                  <p className="text-xs text-destructive/80">
                    {lowStockProducts} produk hampir habis dan perlu distok ulang
                  </p>
                </div>
                <Badge variant="destructive">{lowStockProducts}</Badge>
              </div>
            )}

            {expiringProducts > 0 && (
              <div className="flex items-center gap-3 p-4 bg-warning/10 border border-warning/20 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-warning">Peringatan Kedaluwarsa</p>
                  <p className="text-xs text-warning/80">{expiringProducts} produk akan kedaluwarsa dalam 30 hari</p>
                </div>
                <Badge variant="secondary" className="bg-warning/20 text-warning">
                  {expiringProducts}
                </Badge>
              </div>
            )}
          </div>
        )}

        {/* Konten Utama */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Inventaris Produk</CardTitle>
                <CardDescription>Kelola produk, level stok, dan harga</CardDescription>
              </div>
              <Button onClick={handleAddProductClick} className="">
                <Plus className="mr-2 h-4 w-4" />
                Tambah Produk
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ProductTable 
              products={products}
              onEditProduct={handleEditProduct} 
              onAddStock={handleAddStock}
              onDeleteProduct={handleDeleteProduct}
            /> 
          </CardContent>
        </Card>
      </div>

      {/* Dialog Formulir Produk */}
      <ProductForm
        product={selectedProduct}
        open={showProductForm}
        onOpenChange={(open) => {
          setShowProductForm(open)
          if (!open) setSelectedProduct(null)
        }}
        onSave={handleSaveProduct}
      />

      {/* Dialog Penyesuaian Stok */}
      {/* StockAdjustmentForm diabaikan dari update ini untuk fokus pada Product logic */}
      <StockAdjustmentForm
        productId={stockAdjustmentProduct?.id || null}
        productName={stockAdjustmentProduct?.name || ""}
        currentStock={stockAdjustmentProduct?.stock || 0}
        open={showStockForm}
        onOpenChange={(open) => {
          setShowStockForm(open)
          if (!open) setStockAdjustmentProduct(null)
        }}
        onSave={handleSaveStockAdjustment}
      />
    </div>
  )
}
