import { GhanaAddress } from '../types/address';

export interface Carrier {
  id: string;
  name: string;
  type: 'Sea' | 'Air' | 'Road' | 'Rail';
  contact: string;
  trackingUrlTemplate: string; // e.g., "https://cosco.com/track/{tracking_number}"
  shipmentsCount: number;
}

export interface Shipment {
  id: string;
  supplierName: string;
  consignmentId: string;
  itemCount: number;
  cartonCount: number;
  departureDate: string;
  eta: string;
  status: 'Dispatched' | 'In Transit' | 'Customs' | 'Arrived' | 'Received';
  freightMethod: 'Sea' | 'Air' | 'Road' | 'Rail';
  carrierId: string;
  trackingNumber: string;
  originPort: string;
  destinationAddress: GhanaAddress | string;
  incoterm: string;
  customsRef?: string;
  arrivalDate?: string;
  conditionNotes?: string;
  discrepancies?: {
    itemId: string;
    expected: number;
    received: number;
    action: string;
  }[];
  timeline: {
    stage: string;
    date?: string;
    description: string;
    completed: boolean;
  }[];
}

export const MOCK_CARRIERS: Carrier[] = [
  {
    id: 'car-001',
    name: 'COSCO Shipping',
    type: 'Sea',
    contact: 'agent@cosco.com',
    trackingUrlTemplate: 'https://cosco.com/track/{tracking_number}',
    shipmentsCount: 12
  },
  {
    id: 'car-002',
    name: 'DHL Global Forwarding',
    type: 'Air',
    contact: 'ops@dhl.com',
    trackingUrlTemplate: 'https://www.dhl.com/en/express/tracking.html?AWB={tracking_number}',
    shipmentsCount: 8
  },
  {
    id: 'car-003',
    name: 'Maersk Line',
    type: 'Sea',
    contact: 'booking@maersk.com',
    trackingUrlTemplate: 'https://www.maersk.com/tracking/{tracking_number}',
    shipmentsCount: 5
  }
];

export const MOCK_SHIPMENTS: Shipment[] = [
  {
    id: 'SHI-0047',
    supplierName: 'ShenzhenTech Co.',
    consignmentId: 'C-0041',
    itemCount: 850,
    cartonCount: 48,
    departureDate: '2026-01-12',
    eta: '2026-03-28',
    status: 'In Transit',
    freightMethod: 'Sea',
    carrierId: 'car-001',
    trackingNumber: 'COS6682910',
    originPort: 'Shenzhen, China',
    destinationAddress: {
      region: 'Greater Accra',
      city: 'Accra',
      area: 'Accra Central',
      landmark: 'Main Distribution Hub, North Industrial Area',
      instructions: 'Deliver to Warehouse Gate 4',
      contactPhone: '+233 24 000 1111'
    },
    incoterm: 'FOB',
    timeline: [
      { stage: 'Order placed', date: '2026-01-12', description: 'ShenzhenTech Co. confirmed', completed: true },
      { stage: 'Goods dispatched', date: '2026-01-18', description: 'Departed Shenzhen port', completed: true },
      { stage: 'In transit', date: '2026-01-20', description: 'Vessel: COSCO Fortune', completed: true },
      { stage: 'Customs clearance', description: 'Expected 24 Mar', completed: false },
      { stage: 'Arrived at warehouse', description: 'ETA 28 Mar', completed: false }
    ]
  },
  {
    id: 'SHI-0048',
    supplierName: 'Dangote Cement Ghana',
    consignmentId: 'C-0042',
    itemCount: 2000,
    cartonCount: 100,
    departureDate: '2026-03-20',
    eta: '2026-03-22',
    status: 'Arrived',
    freightMethod: 'Road',
    carrierId: 'car-001', // Local fleet
    trackingNumber: 'DG-99281',
    originPort: 'Tema, Ghana',
    destinationAddress: {
      region: 'Ashanti',
      city: 'Kumasi',
      area: 'Kaase',
      landmark: 'Kumasi Distribution Hub, near the old bridge',
      instructions: 'Wait for security clearance at the gate',
      contactPhone: '+233 20 555 6666'
    },
    incoterm: 'DDP',
    timeline: [
      { stage: 'Order placed', date: '2026-03-20', description: 'Order confirmed', completed: true },
      { stage: 'Goods dispatched', date: '2026-03-20', description: 'Departed Tema factory', completed: true },
      { stage: 'In transit', date: '2026-03-21', description: 'Convoy #4', completed: true },
      { stage: 'Arrived at warehouse', date: '2026-03-22', description: 'Ready for offloading', completed: true }
    ]
  }
];
