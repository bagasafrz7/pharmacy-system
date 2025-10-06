"use client"

import { Bell, Search, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface DashboardHeaderProps {
  title: string
  description?: string
}

export function DashboardHeader({ title, description }: DashboardHeaderProps) {
  return (
    <header className="flex items-center justify-between p-6 bg-background border-b border-border">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {description && <p className="text-muted-foreground mt-1">{description}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Pencarian */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cari produk, anggota..." className="pl-10 w-64" /> {/* Search products, members... */}
        </div>

        {/* Notifikasi */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-destructive">3</Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifikasi</DropdownMenuLabel> {/* Notifications */}
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <div className="space-y-1">
                <p className="text-sm font-medium">Peringatan Stok Rendah</p> {/* Low Stock Alert */}
                <p className="text-xs text-muted-foreground">Amoxicillin 250mg hampir habis (tersisa 15 unit)</p> {/* Amoxicillin 250mg is running low (15 units remaining) */}
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="space-y-1">
                <p className="text-sm font-medium">Pra-pesanan Baru</p> {/* New Pre-order */}
                <p className="text-xs text-muted-foreground">
                  John Smith membuat pra-pesanan untuk obat resep
                </p> {/* John Smith placed a pre-order for prescription medication */}
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="space-y-1">
                <p className="text-sm font-medium">Peringatan Kedaluwarsa</p> {/* Expiry Warning */}
                <p className="text-xs text-muted-foreground">5 produk akan kedaluwarsa dalam 30 hari</p> {/* 5 products will expire within 30 days */}
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Menu Seluler */}
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
