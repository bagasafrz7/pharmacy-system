"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { POSProductSearch } from "@/components/pos-product-search"
import { POSCart } from "@/components/pos-cart"
import { POSMemberLookup } from "@/components/pos-member-lookup"
import { POSCheckout } from "@/components/pos-checkout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { ShoppingCart, User, Receipt, CheckCircle } from "lucide-react"

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

export default function POSPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [showCheckout, setShowCheckout] = useState(false)

  const handleAddToCart = (product: Product, quantity: number) => {
    const existingItem = cartItems.find((item) => item.id === product.id)

    if (existingItem) {
      const newQuantity = Math.min(existingItem.quantity + quantity, product.stock)
      setCartItems((items) => items.map((item) => (item.id === product.id ? { ...item, quantity: newQuantity } : item)))
      toast.success(`Updated ${product.name} quantity to ${newQuantity}`)
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
      toast.success(`Added ${product.name} to cart`)
    }
  }

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems((items) => items.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const handleRemoveItem = (id: string) => {
    const item = cartItems.find((item) => item.id === id)
    setCartItems((items) => items.filter((item) => item.id !== id))
    if (item) {
      toast.success(`Removed ${item.name} from cart`)
    }
  }

  const handleClearCart = () => {
    setCartItems([])
    toast.success("Cart cleared")
  }

  const handleCompleteTransaction = (transactionData: any) => {
    console.log("Transaction completed:", transactionData)

    // In real app, this would:
    // 1. Update stock levels in real-time
    // 2. Save transaction to database
    // 3. Generate receipt
    // 4. Update member purchase history

    // Simulate stock updates
    cartItems.forEach((item) => {
      console.log(`Reducing stock for ${item.name} by ${item.quantity}`)
    })

    // Clear cart and reset
    setCartItems([])
    setSelectedMember(null)

    toast.success(
      <div className="flex items-center gap-2">
        <CheckCircle className="h-4 w-4 text-success" />
        <div>
          <p className="font-medium">Transaction Completed!</p>
          <p className="text-xs">Receipt: {transactionData.transaction_number}</p>
        </div>
      </div>,
    )
  }

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalValue = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Point of Sale"
        description="Process sales transactions and manage inventory in real-time"
      />

      <div className="px-6">
        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Cart Items</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalItems}</div>
              <p className="text-xs text-muted-foreground">Products in cart</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Cart Value</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">${totalValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Before tax</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Customer</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-foreground">
                {selectedMember ? selectedMember.name : "No customer"}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={selectedMember ? "default" : "secondary"}>
                  {selectedMember?.id === "guest" ? "Guest" : selectedMember ? "Member" : "None"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main POS Interface */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Product Search & Member Lookup */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Search */}
            <Card>
              <CardHeader>
                <CardTitle>Product Search</CardTitle>
              </CardHeader>
              <CardContent>
                <POSProductSearch onAddToCart={handleAddToCart} />
              </CardContent>
            </Card>

            {/* Member Lookup */}
            <POSMemberLookup selectedMember={selectedMember} onSelectMember={setSelectedMember} />
          </div>

          {/* Right Column - Cart */}
          <div className="lg:col-span-1">
            <POSCart
              items={cartItems}
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
    </div>
  )
}
