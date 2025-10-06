// product-form.tsx
"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
// Hapus import: Calendar, Popover, PopoverContent, PopoverTrigger, CalendarIcon
// Hapus import: format, cn

// PENTING: Gunakan format tanggal standar untuk input type="date"
// Helper function to format Date object to "YYYY-MM-DD" string
const formatDateToInput = (date: Date): string => {
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split('T')[0];
};

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
  expiry_date: string // Akan berupa string YYYY-MM-DD
  batch_number: string
  supplier: string
  prescription_required: boolean
  status: "active" | "inactive"
  created_at: string
}

interface ProductFormProps {
  product?: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (product: Partial<Product>) => void
}

const categories = [
  "Pereda Nyeri", 
  "Antibiotik", 
  "Vitamin", 
  "Kardiovaskular", 
  "Diabetes", 
  "Pernapasan", 
  "Dermatologi", 
  "Gastrointestinal", 
  "Kesehatan Mental", 
  "Lainnya", 
]

const suppliers = ["PharmaCorp", "MediSupply", "HealthPlus", "GlobalMed", "BioPharm", "MedDistributor"]

const getInitialFormData = (product?: Product | null) => ({
    id: product?.id || undefined, 
    name: product?.name || "",
    generic_name: product?.generic_name || "",
    brand: product?.brand || "",
    category: product?.category || "",
    price: product?.price || 0,
    cost: product?.cost || 0,
    stock: product?.stock || 0,
    min_stock: product?.min_stock || 0,
    max_stock: product?.max_stock || 0,
    // PERUBAHAN KRUSIAL: Simpan tanggal sebagai string YYYY-MM-DD
    expiry_date: product?.expiry_date || formatDateToInput(new Date()), 
    batch_number: product?.batch_number || "",
    supplier: product?.supplier || "",
    prescription_required: product?.prescription_required || false,
    status: product?.status || ("active" as const),
});


export function ProductForm({ product, open, onOpenChange, onSave }: ProductFormProps) {
  const [formData, setFormData] = useState(getInitialFormData(product))

  useEffect(() => {
    if (open) {
      // Muat data produk untuk edit, atau nilai kosong untuk tambah
      setFormData(getInitialFormData(product))
    } 
  }, [open, product])
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Simpan formData apa adanya, karena expiry_date sudah berupa string YYYY-MM-DD
    onSave({
      ...formData,
    })
  }

  const handleInputChange = (field: string, value: any) => {
    // Tangani input angka
    if (["price", "cost", "stock", "min_stock", "max_stock"].includes(field)) {
         setFormData((prev) => ({ ...prev, [field]: Number(value) || 0 }))
    } else {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }
  }

  // Helper untuk input angka (diperbaiki agar lebih bersih)
  const handleNumericInput = (field: keyof typeof formData, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = field === 'price' || field === 'cost' 
      ? Number.parseFloat(value) || 0
      : Number.parseInt(value) || 0;
      
    setFormData((prev) => ({ ...prev, [field]: numValue }));
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? "Ubah Produk" : "Tambah Produk Baru"}</DialogTitle>
          <DialogDescription>
            {product
              ? "Perbarui informasi produk dan detail inventaris."
              : "Tambahkan produk baru ke dalam inventaris Anda."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informasi Dasar */}
          {/* ... (Tidak Berubah) ... */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informasi Dasar</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Produk *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Contoh: Paracetamol 500mg"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="generic_name">Nama Generik *</Label>
                <Input
                  id="generic_name"
                  value={formData.generic_name}
                  onChange={(e) => handleInputChange("generic_name", e.target.value)}
                  placeholder="Contoh: Acetaminophen"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Merek</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => handleInputChange("brand", e.target.value)}
                  placeholder="Contoh: Tylenol"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Kategori *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Harga */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Harga</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cost">Harga Pokok (Modal) *</Label>
                <Input
                  id="cost"
                  type="number"
                  step="any" // Ubah ke "any" agar bisa menerima float dengan mudah
                  value={formData.cost}
                  onChange={(e) => handleNumericInput("cost", e)}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Harga Jual *</Label>
                <Input
                  id="price"
                  type="number"
                  step="any" // Ubah ke "any"
                  value={formData.price}
                  onChange={(e) => handleNumericInput("price", e)}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
          </div>

          {/* Inventaris */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Inventaris</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stock">Stok Saat Ini *</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => handleNumericInput("stock", e)}
                  placeholder="0"
                  required
                  disabled={!!product} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="min_stock">Stok Minimum *</Label>
                <Input
                  id="min_stock"
                  type="number"
                  value={formData.min_stock}
                  onChange={(e) => handleNumericInput("min_stock", e)}
                  placeholder="0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_stock">Stok Maksimum *</Label>
                <Input
                  id="max_stock"
                  type="number"
                  value={formData.max_stock}
                  onChange={(e) => handleNumericInput("max_stock", e)}
                  placeholder="0"
                  required
                />
              </div>
            </div>
          </div>

          {/* Detail Tambahan */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Detail Tambahan</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="batch_number">Nomor Batch *</Label>
                <Input
                  id="batch_number"
                  value={formData.batch_number}
                  onChange={(e) => handleInputChange("batch_number", e.target.value)}
                  placeholder="Contoh: PAR001"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplier">Pemasok *</Label>
                <Select value={formData.supplier} onValueChange={(value) => handleInputChange("supplier", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih pemasok" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier} value={supplier}>
                        {supplier}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tanggal Kedaluwarsa *</Label>
                {/* PERUBAHAN KRUSIAL: Menggunakan input type="date" natif */}
                <Input
                  type="date"
                  value={formData.expiry_date}
                  onChange={(e) => handleInputChange("expiry_date", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="inactive">Non-aktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="prescription_required"
                checked={formData.prescription_required}
                onCheckedChange={(checked) => handleInputChange("prescription_required", checked)}
              />
              <Label htmlFor="prescription_required">Memerlukan Resep</Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" className="">
              {product ? "Perbarui Produk" : "Tambah Produk"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
