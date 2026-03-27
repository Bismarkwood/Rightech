// ─── Product Types ────────────────────────────────────────────────
export type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';
export type ProductUnit = 'Unit' | 'Kg' | 'Bag' | 'Roll' | 'Box' | 'Sqm' | 'Litre' | 'Sheet' | 'Pair';

export interface ProductVariant {
  id: string;
  name: string;    // e.g. "16mm", "20L", "White"
  sku: string;
  price: number;
  stock: number;
}

export interface StockMovement {
  id: string;
  date: string;
  delta: number;
  type: 'Inbound' | 'Outbound' | 'Adjustment' | 'Reservation' | 'Commitment';
  reason: string;
  referenceId?: string; // e.g. Consignment ID, Order ID
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  category: string;
  subcategory?: string;
  description: string;
  image?: string;
  price: number;          // base retail price
  dealerPrice?: number;   // wholesale price for dealers
  costPrice: number;      // purchase cost for COGS
  unit: ProductUnit;
  stock: number;
  reservedStock: number;  // stock committed to pending/credit orders
  lowStockThreshold: number;
  status: StockStatus;
  isArchived: boolean;
  storefrontName?: string;
  storefrontDescription?: string;
  variants?: ProductVariant[];
  stockMovements: StockMovement[];
  supplier?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  consignmentId?: string; // Link to Consignment Manager
  supplierId?: string;    // Link to Supplier Manager
}

export interface Category {
  id: string;
  name: string;
  icon: string;           // iconify icon
  productCount?: number;
}

// ─── Categories ───────────────────────────────────────────────────
export const MOCK_CATEGORIES: Category[] = [
  { id: 'CAT-01', name: 'Building Materials', icon: 'solar:buildings-2-bold-duotone' },
  { id: 'CAT-02', name: 'Metals & Steel', icon: 'solar:layers-bold-duotone' },
  { id: 'CAT-03', name: 'Plumbing', icon: 'solar:waterdrops-bold-duotone' },
  { id: 'CAT-04', name: 'Finishing', icon: 'solar:paint-roller-bold-duotone' },
  { id: 'CAT-05', name: 'Roofing', icon: 'solar:home-bold-duotone' },
  { id: 'CAT-06', name: 'Electrical', icon: 'solar:electricity-bold-duotone' },
  { id: 'CAT-07', name: 'Timber & Wood', icon: 'solar:tree-bold-duotone' },
  { id: 'CAT-08', name: 'Tools & Equipment', icon: 'solar:settings-bold-duotone' },
];

// ─── Products ─────────────────────────────────────────────────────
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'PRD-001',
    name: 'Dangote Cement (50kg)',
    sku: 'CEM-50-D',
    category: 'Building Materials',
    description: 'High-quality Portland cement suitable for all construction projects, from housing to large-scale infrastructure.',
    price: 85,
    dealerPrice: 75,
    costPrice: 65,
    unit: 'Bag',
    stock: 450,
    reservedStock: 25,
    lowStockThreshold: 50,
    status: 'In Stock',
    isArchived: false,
    stockMovements: [
      { id: 'MOV-001', date: '2026-03-20', delta: 500, type: 'Inbound', reason: 'Initial Stocking' },
      { id: 'MOV-002', date: '2026-03-21', delta: -50, type: 'Outbound', reason: 'Retail Sale #4920' },
    ],
    supplier: 'Dangote Industries',
    tags: ['cement', 'construction', 'fast-moving'],
    createdAt: '2026-01-15',
    updatedAt: '2026-03-20',
    consignmentId: 'SCON-001',
    supplierId: 'SUP-001'
  },
  {
    id: 'PRD-002',
    name: 'Iron Rods (16mm)',
    sku: 'IR-16-T',
    barcode: '400123456789',
    category: 'Metals & Steel',
    description: 'High-tensile strength reinforcement bars for concrete structures.',
    price: 120,
    dealerPrice: 105,
    costPrice: 90,
    unit: 'Unit',
    stock: 120,
    reservedStock: 0,
    lowStockThreshold: 20,
    status: 'In Stock',
    isArchived: false,
    stockMovements: [],
    supplier: 'Ghana Steel Works',
    tags: ['rods', 'reinforcement', 'concrete'],
    createdAt: '2026-01-20',
    updatedAt: '2026-03-18',
    consignmentId: 'SCON-002',
    supplierId: 'SUP-002'
  },
  {
    id: 'PRD-003',
    name: 'PVC Pipe (3 inch)',
    sku: 'PVC-3-P',
    category: 'Plumbing',
    description: 'Durable PVC piping for residential and commercial drainage systems.',
    price: 45,
    dealerPrice: 38,
    costPrice: 30,
    unit: 'Unit',
    stock: 15,
    reservedStock: 10,
    lowStockThreshold: 20,
    status: 'Low Stock',
    isArchived: false,
    stockMovements: [],
    supplier: 'AquaPlumb Ltd',
    tags: ['pipes', 'drainage'],
    createdAt: '2026-02-01',
    updatedAt: '2026-03-22',
  },
  {
    id: 'PRD-004',
    name: 'White Emulsion Paint (20L)',
    sku: 'PNT-W-20',
    category: 'Finishing',
    description: 'Premium weather-resistant exterior emulsion paint.',
    price: 250,
    dealerPrice: 220,
    costPrice: 180,
    unit: 'Litre',
    stock: 0,
    reservedStock: 0,
    lowStockThreshold: 10,
    status: 'Out of Stock',
    isArchived: false,
    stockMovements: [],
    supplier: 'Crown Paints Ghana',
    tags: ['paint', 'finishing', 'exterior'],
    createdAt: '2026-02-10',
    updatedAt: '2026-03-25',
  },
  {
    id: 'PRD-005',
    name: 'Aluzinc Roofing Sheets',
    sku: 'RF-AL-Z',
    category: 'Roofing',
    description: 'Corrosion-resistant Aluzinc roofing sheets for long-lasting protection.',
    price: 850,
    dealerPrice: 780,
    costPrice: 620,
    unit: 'Sheet',
    stock: 300,
    reservedStock: 0,
    lowStockThreshold: 30,
    status: 'In Stock',
    isArchived: false,
    stockMovements: [],
    supplier: 'Roofco Ghana',
    tags: ['roofing', 'aluzinc', 'sheets'],
    createdAt: '2026-01-08',
    updatedAt: '2026-03-10',
  },
  {
    id: 'PRD-006',
    name: 'Porcelain Floor Tiles (60x60)',
    sku: 'TL-FL-60',
    category: 'Finishing',
    description: 'Elegant porcelain floor tiles with a polished finish.',
    price: 120,
    dealerPrice: 100,
    costPrice: 85,
    unit: 'Sqm',
    stock: 85,
    reservedStock: 15,
    lowStockThreshold: 15,
    status: 'In Stock',
    isArchived: false,
    stockMovements: [],
    supplier: 'Ceramica West Africa',
    tags: ['tiles', 'floor', 'porcelain'],
    createdAt: '2026-01-25',
    updatedAt: '2026-03-15',
  },
  {
    id: 'PRD-007',
    name: 'Electrical Cable (2.5mm)',
    sku: 'EL-CB-25',
    category: 'Electrical',
    description: 'Single-core copper cable for domestic wiring.',
    price: 450,
    dealerPrice: 400,
    costPrice: 320,
    unit: 'Roll',
    stock: 200,
    reservedStock: 0,
    lowStockThreshold: 25,
    status: 'In Stock',
    isArchived: false,
    stockMovements: [],
    supplier: 'MetroElec Supplies',
    tags: ['cable', 'electrical', 'wiring'],
    createdAt: '2026-02-05',
    updatedAt: '2026-03-12',
  },
  {
    id: 'PRD-008',
    name: 'Stainless Steel Kitchen Sink (Double)',
    sku: 'SK-KT-DB',
    category: 'Plumbing',
    description: 'Stainless steel double-bowl kitchen sink with drainer.',
    price: 1200,
    dealerPrice: 1100,
    costPrice: 900,
    unit: 'Unit',
    stock: 8,
    reservedStock: 0,
    lowStockThreshold: 5,
    status: 'Low Stock',
    isArchived: false,
    stockMovements: [],
    supplier: 'AquaPlumb Ltd',
    tags: ['sink', 'kitchen', 'stainless'],
    createdAt: '2026-02-18',
    updatedAt: '2026-03-21',
  },
];
