export type ConsignmentStatus = 'On Shelf' | 'Settled' | 'Returned' | 'In Transit';

export interface ConsignmentProduct {
  id: string;
  productId: string; // Link to Product Catalogue
  productName: string;
  sku: string;
  suppliedQty: number;
  soldQty: number;
  returnedQty: number;
  unitPrice: number;
  image?: string;
}

export interface ConsignmentItem {
  id: string;
  name: string;
  partnerId: string;
  partnerName: string;
  date: string;
  status: ConsignmentStatus;
  type: 'Inbound' | 'Outbound';
  location?: string;
  agentId?: string;
  items: ConsignmentProduct[];
  totalValue: number;
}

export const MOCK_SUPPLIER_CONSIGNMENTS: ConsignmentItem[] = [
  {
    id: 'SCON-001',
    name: 'Q1 Cement Batch',
    partnerId: 'SUP-001',
    partnerName: 'Dangote Cement Ghana',
    date: '2026-03-20',
    status: 'On Shelf',
    type: 'Inbound',
    items: [
      {
        id: 'P-1',
        productId: 'PRD-001',
        productName: 'Portland Cement 50kg',
        sku: 'CEM-001',
        suppliedQty: 500,
        soldQty: 120,
        returnedQty: 0,
        unitPrice: 85,
        image: 'https://images.unsplash.com/photo-1590633464195-23c34893708f?w=100&h=100&fit=crop'
      }
    ],
    totalValue: 42500
  },
  {
    id: 'SCON-002',
    name: 'Iron Rods Supply',
    partnerId: 'SUP-002',
    partnerName: 'GHL Steel Works',
    date: '2026-03-15',
    status: 'On Shelf',
    type: 'Inbound',
    items: [
      {
        id: 'P-2',
        productId: 'PRD-002',
        productName: 'Iron Rods 16mm',
        sku: 'STL-016',
        suppliedQty: 100,
        soldQty: 45,
        returnedQty: 5,
        unitPrice: 120,
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=100&h=100&fit=crop'
      }
    ],
    totalValue: 12000
  }
];

export const MOCK_DEALER_CONSIGNMENTS: ConsignmentItem[] = [
  {
    id: 'DCON-001',
    name: 'Electronics Dispatch',
    partnerId: 'DLR-101',
    partnerName: 'Metro Electronics',
    date: '2026-03-22',
    status: 'On Shelf',
    type: 'Outbound',
    items: [
      {
        id: 'P-3',
        productId: 'PRD-006',
        productName: 'Porcelain Floor Tiles (60x60)',
        sku: 'SAM-A54',
        suppliedQty: 50,
        soldQty: 12,
        returnedQty: 0,
        unitPrice: 2500,
        image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100&h=100&fit=crop'
      }
    ],
    totalValue: 125000
  }
];
