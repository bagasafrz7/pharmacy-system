"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Building2,
  Receipt,
  FileText,
  History,
  UserPlus,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Pill,
  Stethoscope,
  ClipboardList,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { hasPermission, getRoleDisplayName } from "@/lib/auth"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  requiredRole?: "super_admin" | "pharmacist" | "staff"
  badge?: string
}

const navigationItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/dashboard/products",
    icon: Package,
  },
  {
    title: "POS",
    href: "/dashboard/pos",
    icon: ShoppingCart,
  },
  {
    title: "Pre-Orders",
    href: "/dashboard/pre-orders",
    icon: ClipboardList,
  },
  {
    title: "Digital Prescription",
    href: "/dashboard/prescriptions",
    icon: Stethoscope,
    requiredRole: "pharmacist",
  },
  {
    title: "Members",
    href: "/dashboard/members",
    icon: Users,
  },
  {
    title: "Transactions",
    href: "/dashboard/transactions",
    icon: Receipt,
  },
  {
    title: "Transaction History",
    href: "/dashboard/history",
    icon: History,
  },
  {
    title: "Branches",
    href: "/dashboard/branches",
    icon: Building2,
    requiredRole: "super_admin",
  },
  {
    title: "Reports",
    href: "/dashboard/reports",
    icon: FileText,
    requiredRole: "pharmacist",
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    requiredRole: "super_admin",
  },
]

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  if (!user) return null

  const filteredNavItems = navigationItems.filter((item) => {
    if (!item.requiredRole) return true
    return hasPermission(user.role, item.requiredRole)
  })

  const handleSignOut = async () => {
    await signOut()
    window.location.href = "/login"
  }

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-card border-r border-border transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg ">
              <Pill className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-foreground">PharmaCare</h1>
              <p className="text-xs text-muted-foreground">Information System</p>
            </div>
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)} className="h-8 w-8 p-0">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-10",
                  collapsed && "justify-center px-2",
                  isActive && "bg-primary/10 text-primary hover:bg-primary/15",
                )}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {!collapsed && <span className="text-sm">{item.title}</span>}
                {!collapsed && item.badge && (
                  <span className="ml-auto bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="p-2 border-t border-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn("w-full justify-start gap-3 h-12", collapsed && "justify-center px-2")}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{getRoleDisplayName(user.role)}</p>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile">
                <UserPlus className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
