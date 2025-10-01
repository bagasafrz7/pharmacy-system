"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { ProductTable } from "@/components/product-table"
import { ProductForm } from "@/components/product-form"
import { StockAdjustmentForm } from "@/components/stock-adjustment-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Package, AlertTriangle, TrendingUp } from "lucide-react"
import { mockData } from "@/lib/mock-data"

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

export default function ProductsPage() {
  const [products] = useState<Product[]>(mockData.products as Product[])
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
    console.log("Saving product:", productData)
    // In real app, this would make an API call
    setShowProductForm(false)
    setSelectedProduct(null)
  }

  const handleSaveStockAdjustment = (adjustment: any) => {
    console.log("Stock adjustment:", adjustment)
    // In real app, this would make an API call to update stock
    setShowStockForm(false)
    setStockAdjustmentProduct(null)
  }

  // Calculate stats
  const totalProducts = products.length
  const lowStockProducts = products.filter((p) => p.stock <= p.min_stock).length
  const expiringProducts = products.filter((p) => {
    const expiry = new Date(p.expiry_date)
    const now = new Date()
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 30
  }).length
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0)

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Product Management"
        description="Manage your pharmacy inventory with real-time stock tracking"
      />

      <div className="px-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalProducts}</div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-success" />
                <span className="text-xs text-success">5% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock Items</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{lowStockProducts}</div>
              <p className="text-xs text-muted-foreground mt-1">Require immediate attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Expiring Soon</CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{expiringProducts}</div>
              <p className="text-xs text-muted-foreground mt-1">Within 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Inventory Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">${totalValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Total stock value</p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {(lowStockProducts > 0 || expiringProducts > 0) && (
          <div className="space-y-3">
            {lowStockProducts > 0 && (
              <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-destructive">Low Stock Alert</p>
                  <p className="text-xs text-destructive/80">
                    {lowStockProducts} products are running low and need restocking
                  </p>
                </div>
                <Badge variant="destructive">{lowStockProducts}</Badge>
              </div>
            )}

            {expiringProducts > 0 && (
              <div className="flex items-center gap-3 p-4 bg-warning/10 border border-warning/20 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-warning">Expiry Warning</p>
                  <p className="text-xs text-warning/80">{expiringProducts} products will expire within 30 days</p>
                </div>
                <Badge variant="secondary" className="bg-warning/20 text-warning">
                  {expiringProducts}
                </Badge>
              </div>
            )}
          </div>
        )}

        {/* Main Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Product Inventory</CardTitle>
                <CardDescription>Manage products, stock levels, and pricing</CardDescription>
              </div>
              <Button onClick={() => setShowProductForm(true)} className="">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ProductTable onEditProduct={handleEditProduct} onAddStock={handleAddStock} />
          </CardContent>
        </Card>
      </div>

      {/* Product Form Dialog */}
      <ProductForm
        product={selectedProduct}
        open={showProductForm}
        onOpenChange={(open) => {
          setShowProductForm(open)
          if (!open) setSelectedProduct(null)
        }}
        onSave={handleSaveProduct}
      />

      {/* Stock Adjustment Dialog */}
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
