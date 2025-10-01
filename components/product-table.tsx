"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { MoreHorizontal, Edit, Trash2, Package, AlertTriangle, CheckCircle } from "lucide-react"
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

interface ProductTableProps {
  onEditProduct: (product: Product) => void
  onAddStock: (productId: string) => void
}

export function ProductTable({ onEditProduct, onAddStock }: ProductTableProps) {
  const [products] = useState<Product[]>(mockData.products as Product[])
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

  const getStockStatus = (product: Product) => {
    if (product.stock <= product.min_stock) {
      return { status: "low", color: "bg-destructive/10 text-destructive", icon: AlertTriangle }
    }
    if (product.stock >= product.max_stock) {
      return { status: "high", color: "bg-warning/10 text-warning", icon: Package }
    }
    return { status: "normal", color: "bg-success/10 text-success", icon: CheckCircle }
  }

  const getExpiryStatus = (expiryDate: string) => {
    const expiry = new Date(expiryDate)
    const now = new Date()
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntilExpiry <= 30) {
      return { status: "expiring", color: "bg-destructive/10 text-destructive" }
    }
    if (daysUntilExpiry <= 90) {
      return { status: "warning", color: "bg-warning/10 text-warning" }
    }
    return { status: "good", color: "bg-success/10 text-success" }
  }

  const categories = Array.from(new Set(products.map((p) => p.category)))

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 border border-input rounded-md bg-background text-foreground"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Expiry</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
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
                        <div className="font-medium">{product.stock} units</div>
                        <div className="text-xs text-muted-foreground">
                          Min: {product.min_stock} • Max: {product.max_stock}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">${product.price}</div>
                      <div className="text-xs text-muted-foreground">Cost: ${product.cost}</div>
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
                          Rx
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onEditProduct(product)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Product
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onAddStock(product.id)}>
                          <Package className="mr-2 h-4 w-4" />
                          Add Stock
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Product
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Product</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{product.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">No products found matching your criteria.</div>
      )}
    </div>
  )
}
