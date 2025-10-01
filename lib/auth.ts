import { mockData } from "./mock-data"

export type UserRole = "super_admin" | "pharmacist" | "staff"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  branch_id: string
  avatar: string
  status: "active" | "inactive"
  created_at: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

// Mock authentication functions
export async function signIn(email: string, password: string): Promise<User | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const user = mockData.users.find((u) => u.email === email && u.password === password)
  if (user) {
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword as User
  }
  return null
}

export async function signOut(): Promise<void> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
}

export function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy = {
    super_admin: 3,
    pharmacist: 2,
    staff: 1,
  }

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

export function getRoleDisplayName(role: UserRole): string {
  switch (role) {
    case "super_admin":
      return "Super Admin"
    case "pharmacist":
      return "Pharmacist"
    case "staff":
      return "Staff (Sales)"
    default:
      return "Unknown"
  }
}
