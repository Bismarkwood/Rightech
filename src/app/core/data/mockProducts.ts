export interface Product {
  id: string;
  name: string;
  sku: string;
  stock: number;
  price: string;
  category: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  description?: string;
  image?: string;
}

export const MOCK_PRODUCTS: Product[] = [
  { 
    id: 'PRD-01', 
    name: 'Dangote Cement (50kg)', 
    sku: 'CEM-50-D', 
    stock: 450, 
    price: '85 GHS', 
    category: 'Building Materials', 
    status: 'In Stock',
    description: 'High-quality Portland cement suitable for all construction projects, from housing to large-scale infrastructure.'
  },
  { 
    id: 'PRD-02', 
    name: 'Iron Rods (16mm)', 
    sku: 'IR-16-T', 
    stock: 120, 
    price: '120 GHS', 
    category: 'Metals', 





    
    status: 'In Stock',
    description: 'High-tensile strength reinforcement bars for concrete structures.'
  },
  { 
    id: 'PRD-03', 
    name: 'PVC Pipe (3 inch)', 
    sku: 'PVC-3-P', 
    stock: 15, 
    price: '45 GHS', 
    category: 'Plumbing', 
    status: 'Low Stock',
    description: 'Durable PVC piping for residential and commercial drainage systems.'
  },
  { 
    id: 'PRD-04', 
    name: 'White Paint (20L)', 
    sku: 'PNT-W-20', 
    stock: 0, 
    price: '250 GHS', 
    category: 'Finishing', 
    status: 'Out of Stock',
    description: 'Premium weather-resistant exterior emulsion paint.'
  },
  { 
    id: 'PRD-05', 
    name: 'Roofing Sheets (Aluzinc)', 
    sku: 'RF-AL-Z', 
    stock: 300, 
    price: '850 GHS', 
    category: 'Roofing', 
    status: 'In Stock',
    description: 'Corrosion-resistant Aluzinc roofing sheets for long-lasting protection.'
  },
  { 
    id: 'PRD-06', 
    name: 'Floor Tiles (60x60)', 
    sku: 'TL-FL-60', 
    stock: 85, 
    price: '120 GHS/sqm', 
    category: 'Finishing', 
    status: 'In Stock',
    description: 'Elegant porcelain floor tiles with a polished finish.'
  },
  { 
    id: 'PRD-07', 
    name: 'Electrical Cable (2.5mm)', 
    sku: 'EL-CB-25', 
    stock: 200, 
    price: '450 GHS / roll', 
    category: 'Electrical', 
    status: 'In Stock',
    description: 'Single-core copper cable for domestic wiring.'
  },
  { 
    id: 'PRD-08', 
    name: 'Kitchen Sink (Double)', 
    sku: 'SK-KT-DB', 
    stock: 8, 
    price: '1,200 GHS', 
    category: 'Plumbing', 
    status: 'Low Stock',
    description: 'Stainless steel double-bowl kitchen sink.'
  }
];

export const CATEGORIES = [
  'All Categories',
  'Building Materials',
  'Metals',
  'Plumbing',
  'Finishing',
  'Roofing',
  'Electrical'
];
