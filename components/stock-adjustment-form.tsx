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
    type: "add" | "remove"
    quantity: number
    reason: string
    notes?: string
  }) => void
}

const adjustmentReasons = {
  add: ["New Stock Received", "Stock Return", "Inventory Correction", "Transfer In", "Other"],
  remove: ["Expired Product", "Damaged Product", "Stock Transfer", "Inventory Correction", "Theft/Loss", "Other"],
}

export function StockAdjustmentForm({
  productId,
  productName,
  currentStock,
  open,
  onOpenChange,
  onSave,
}: StockAdjustmentFormProps) {
  const [adjustmentType, setAdjustmentType] = useState<"add" | "remove">("add")
  const [quantity, setQuantity] = useState(0)
  const [reason, setReason] = useState("")
  const [notes, setNotes] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!productId || quantity <= 0) return

    onSave({
      productId,
      type: adjustmentType,
      quantity,
      reason,
      notes,
    })

    // Reset form
    setQuantity(0)
    setReason("")
    setNotes("")
    onOpenChange(false)
  }

  const newStock = adjustmentType === "add" ? currentStock + quantity : Math.max(0, currentStock - quantity)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Stock Adjustment
          </DialogTitle>
          <DialogDescription>
            Adjust stock levels for <strong>{productName}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Stock Display */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Current Stock:</span>
              <span className="font-medium">{currentStock} units</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-muted-foreground">New Stock:</span>
              <span className="font-medium text-primary">{newStock} units</span>
            </div>
          </div>

          {/* Adjustment Type */}
          <div className="space-y-2">
            <Label>Adjustment Type</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={adjustmentType === "add" ? "default" : "outline"}
                onClick={() => setAdjustmentType("add")}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Stock
              </Button>
              <Button
                type="button"
                variant={adjustmentType === "remove" ? "default" : "outline"}
                onClick={() => setAdjustmentType("remove")}
                className="flex items-center gap-2"
              >
                <Minus className="h-4 w-4" />
                Remove Stock
              </Button>
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity *</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 0)}
              placeholder="Enter quantity"
              required
            />
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason *</Label>
            <Select value={reason} onValueChange={setReason} required>
              <SelectTrigger>
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                {adjustmentReasons[adjustmentType].map((reasonOption) => (
                  <SelectItem key={reasonOption} value={reasonOption}>
                    {reasonOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes about this adjustment..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              className={adjustmentType === "add" ? "" : "bg-destructive hover:bg-destructive/90"}
              disabled={!productId || quantity <= 0 || !reason}
            >
              {adjustmentType === "add" ? "Add Stock" : "Remove Stock"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
