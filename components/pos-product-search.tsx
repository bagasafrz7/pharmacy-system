"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Plus, AlertTriangle, CheckCircle } from "lucide-react"
import { mockData } from "@/lib/mock-data"

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

interface POSProductSearchProps {
  onAddToCart: (product: Product, quantity: number) => void
}

export function POSProductSearch({ onAddToCart }: POSProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const products = mockData.products as Product[]

  useEffect(() => {
    if (searchTerm.length < 2) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    const timer = setTimeout(() => {
      const filtered = products
        .filter((product) => {
          const searchLower = searchTerm.toLowerCase()
          return (
            product.status === "active" &&
            (product.name.toLowerCase().includes(searchLower) ||
              product.generic_name.toLowerCase().includes(searchLower) ||
              product.brand.toLowerCase().includes(searchLower))
          )
        })
        .slice(0, 10) // Limit results

      setSearchResults(filtered)
      setIsSearching(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm, products])

  const getStockStatus = (product: Product) => {
    if (product.stock === 0) {
      return { status: "out", color: "bg-destructive/10 text-destructive", icon: AlertTriangle }
    }
    if (product.stock <= product.min_stock) {
      return { status: "low", color: "bg-warning/10 text-warning", icon: AlertTriangle }
    }
    return { status: "available", color: "bg-success/10 text-success", icon: CheckCircle }
  }

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products by name, generic name, or brand..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-12 text-lg"
        />
      </div>

      {/* Search Results */}
      {searchTerm.length >= 2 && (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="text-center py-4 text-muted-foreground">Searching...</div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">No products found</div>
          ) : (
            searchResults.map((product) => {
              const stockStatus = getStockStatus(product)
              const StockIcon = stockStatus.icon

              return (
                <Card key={product.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-foreground">{product.name}</h3>
                          {product.prescription_required && (
                            <Badge variant="outline" className="text-xs">
                              Rx
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {product.generic_name} • {product.brand}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-lg font-bold text-primary">${product.price}</span>
                          <div className="flex items-center gap-1">
                            <StockIcon className="h-4 w-4" />
                            <span className="text-sm">{product.stock} units</span>
                          </div>
                          <Badge className={stockStatus.color}>{stockStatus.status}</Badge>
                        </div>
                      </div>
                      <Button
                        onClick={() => onAddToCart(product, 1)}
                        disabled={product.stock === 0}
                        className=""
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
