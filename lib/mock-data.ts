export const mockData = {
  // Data Pengguna (Users)
  users: [
    {
      id: "1",
      email: "admin@pharmacy.com",
      password: "admin123",
      name: "Dr. Sarah Johnson",
      role: "super_admin", // Peran super_admin
      branch_id: "1",
      avatar: "/placeholder.svg?height=40&width=40",
      created_at: "2024-01-01T00:00:00Z",
      status: "active",
    },
    {
      id: "2",
      email: "pharmacist@pharmacy.com",
      password: "pharma123",
      name: "Dr. Michael Chen",
      role: "pharmacist", // Peran apoteker
      branch_id: "1",
      avatar: "/placeholder.svg?height=40&width=40",
      created_at: "2024-01-01T00:00:00Z",
      status: "active",
    },
    {
      id: "3",
      email: "staff@pharmacy.com",
      password: "staff123",
      name: "Emma Rodriguez",
      role: "staff", // Peran staf
      branch_id: "1",
      avatar: "/placeholder.svg?height=40&width=40",
      created_at: "2024-01-01T00:00:00Z",
      status: "active",
    },
  ],

  // Data Cabang (Branches)
  branches: [
    {
      id: "1",
      name: "Main Branch",
      address: "123 Healthcare Ave, Medical District",
      phone: "+1 (555) 123-4567",
      manager_id: "1",
      status: "active",
      created_at: "2024-01-01T00:00:00Z",
    },
    {
      id: "2",
      name: "Downtown Branch",
      address: "456 City Center Blvd, Downtown",
      phone: "+1 (555) 987-6543",
      manager_id: "2",
      status: "active",
      created_at: "2024-01-01T00:00:00Z",
    },
  ],

  // Data Produk (Products)
  products: [
    {
      id: "1",
      name: "Paracetamol 500mg",
      generic_name: "Acetaminophen",
      brand: "Tylenol",
      category: "Pereda Nyeri", // Pain Relief
      price: 15000,
      cost: 9500,
      stock: 150,
      min_stock: 20,
      max_stock: 500,
      expiry_date: "2025-12-31",
      batch_number: "PAR001",
      supplier: "PharmaCorp",
      prescription_required: false,
      status: "active",
      created_at: "2024-01-01T00:00:00Z",
    },
    {
      id: "2",
      name: "Amoxicillin 250mg",
      generic_name: "Amoxicillin",
      brand: "Amoxil",
      category: "Antibiotik", // Antibiotics
      price: 35000,
      cost: 24000,
      stock: 75,
      mIN_stock: 15,
      max_stock: 200,
      expiry_date: "2025-08-15",
      batch_number: "AMX002",
      supplier: "MediSupply",
      prescription_required: true,
      status: "active",
      created_at: "2024-01-01T00:00:00Z",
    },
    {
      id: "3",
      name: "Vitamin D3 1000IU",
      generic_name: "Cholecalciferol",
      brand: "VitaHealth",
      category: "Vitamin", // Vitamins
      price: 28000,
      cost: 18000,
      stock: 200,
      min_stock: 30,
      max_stock: 300,
      expiry_date: "2026-03-20",
      batch_number: "VIT003",
      supplier: "HealthPlus",
      prescription_required: false,
      status: "active",
      created_at: "2024-01-01T00:00:00Z",
    },
    {
      id: "4",
      name: "Ibuprofen 400mg",
      generic_name: "Ibuprofen",
      brand: "Advil",
      category: "Pereda Nyeri", // Pain Relief
      price: 18000,
      cost: 12500,
      stock: 120,
      min_stock: 25,
      max_stock: 400,
      expiry_date: "2025-10-15",
      batch_number: "IBU004",
      supplier: "PharmaCorp",
      prescription_required: false,
      status: "active",
      created_at: "2024-01-01T00:00:00Z",
    },
    {
      id: "5",
      name: "Lisinopril 10mg",
      generic_name: "Lisinopril",
      brand: "Prinivil",
      category: "Kardiovaskular", // Cardiovascular
      price: 55000,
      cost: 38000,
      stock: 8, // Tetap rendah
      min_stock: 15,
      max_stock: 150,
      expiry_date: "2025-06-30", // Tanggal kedaluwarsa mendekati
      batch_number: "LIS005",
      supplier: "MediSupply",
      prescription_required: true,
      status: "active",
      created_at: "2024-01-01T00:00:00Z",
    },
  ],

  // Data Anggota/Pelanggan (Members)
  members: [
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+1 (555) 111-2222",
      date_of_birth: "1985-06-15",
      address: "789 Residential St, Suburb",
      insurance_number: "INS123456789",
      allergies: ["Penicillin", "Sulfa"],
      medical_conditions: ["Hypertension", "Diabetes Type 2"],
      emergency_contact: {
        name: "Jane Smith",
        phone: "+1 (555) 111-3333",
        relationship: "Spouse",
      },
      status: "active",
      created_at: "2024-01-01T00:00:00Z",
    },
    {
      id: "2",
      name: "Maria Garcia",
      email: "maria.garcia@email.com",
      phone: "+1 (555) 222-3333",
      date_of_birth: "1992-03-22",
      address: "456 Oak Avenue, Downtown",
      insurance_number: "INS987654321",
      allergies: ["Latex"],
      medical_conditions: ["Asthma"],
      emergency_contact: {
        name: "Carlos Garcia",
        phone: "+1 (555) 222-4444",
        relationship: "Husband",
      },
      status: "active",
      created_at: "2024-01-01T00:00:00Z",
    },
  ],

  // Data Transaksi (Transactions)
  transactions: [
    {
      id: "1",
      transaction_number: "TXN001",
      member_id: "1",
      staff_id: "3",
      branch_id: "1",
      items: [
        {
          product_id: "1",
          quantity: 2,
          price: 12.99,
          total: 25.98,
        },
      ],
      subtotal: 25.98,
      tax: 2.08,
      discount: 0,
      total: 28.06,
      payment_method: "cash",
      status: "completed",
      created_at: "2024-01-15T10:30:00Z",
    },
  ],

  // Data Pra-Pesan (Pre-Orders)
  pre_orders: [
    {
      id: "1",
      order_number: "PO001",
      member_id: "1",
      branch_id: "1",
      items: [
        {
          product_id: "2",
          quantity: 1,
          price: 25.5,
        },
      ],
      total: 25.5,
      status: "pending",
      pickup_date: "2024-02-01",
      notes: "Patient needs consultation",
      created_at: "2024-01-20T14:15:00Z",
    },
  ],
}

export default mockData
