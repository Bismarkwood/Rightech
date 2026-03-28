import { GhanaAddress } from '../types/address';

export type RetailerOrderItem = {
  productId: string;
  name: string;
  qty: number;
  unitPrice: string;
  lineTotal: string;
  image?: string;
};

export type RetailerOrder = {
  id: string;
  customer: string;
  type: string;
  amount: string;
  payStatus: string;
  paymentMethod: string;
  delStatus: string;
  credStatus: string;
  date: string;
  deliveryAddress: GhanaAddress | string;
  orderNotes: string;
  createdAt: string;
  updatedAt: string;
  items?: RetailerOrderItem[];
  agent?: {
    name: string;
    phone: string;
    avatar: string;
    vehicle: string;
  };
  trackingToken?: string;
  riderLocation?: { lat: number; lng: number };
  estimatedArrivalMin?: number;
};

export const MOCK_RETAILER_ORDERS: RetailerOrder[] = [
  {
    id: 'ORD-8991',
    customer: 'K.A Enterprise',
    type: 'Retail',
    amount: '1,750 GHS',
    payStatus: 'Paid',
    paymentMethod: 'Cash',
    delStatus: 'Pending',
    credStatus: 'N/A',
    date: 'Today, 10:30 AM',
    trackingToken: 'RT-8991-X82J',
    riderLocation: { lat: 5.6037, lng: -0.1870 },
    estimatedArrivalMin: 12,
    deliveryAddress: {
      region: 'Greater Accra',
      city: 'Accra',
      area: 'Spintex Road',
      landmark: 'Near Flower Pot Interchange',
      instructions: 'Deliver before 2pm',
      contactPhone: '+233 24 123 4567'
    },
    orderNotes: 'Customer requested early delivery before 2pm.',
    createdAt: '2026-03-25T10:30:00Z',
    updatedAt: '2026-03-25T10:35:00Z',
    items: [
      { productId: 'PRD-001', name: 'Portland Cement 50kg', qty: 10, unitPrice: '85 GHS', lineTotal: '850 GHS', image: 'https://images.unsplash.com/photo-1518709367011-8278783e7869?auto=format&fit=crop&q=80&w=200' },
      { productId: 'PRD-004', name: 'Emulsion Paint 20L', qty: 2, unitPrice: '450 GHS', lineTotal: '900 GHS', image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&q=80&w=200' },
    ],
  },
  {
    id: 'ORD-8990',
    customer: 'Westgate Builders',
    type: 'Wholesale',
    amount: '10,650 GHS',
    payStatus: 'Credit',
    paymentMethod: 'Invoice / Credit',
    delStatus: 'In Transit',
    credStatus: 'Active',
    date: 'Today, 09:15 AM',
    trackingToken: 'RT-8990-M10Q',
    riderLocation: { lat: 5.6145, lng: -0.1567 },
    estimatedArrivalMin: 8,
    deliveryAddress: {
      region: 'Greater Accra',
      city: 'Tema',
      area: 'Tema Industrial Area',
      landmark: 'Warehouse 12',
      instructions: 'Call site manager on arrival',
      contactPhone: '+233 20 987 6543'
    },
    orderNotes: 'Call site manager on arrival. Gate access required.',
    createdAt: '2026-03-25T09:15:00Z',
    updatedAt: '2026-03-25T11:05:00Z',
    items: [
      { productId: 'PRD-002', name: 'Iron Rods 16mm', qty: 25, unitPrice: '120 GHS', lineTotal: '3,000 GHS', image: 'https://images.unsplash.com/photo-1621905252507-b35242f8969d?auto=format&fit=crop&q=80&w=200' },
      { productId: 'PRD-005', name: 'Roofing Sheets (Aluzinc)', qty: 20, unitPrice: '350 GHS', lineTotal: '7,000 GHS', image: 'https://images.unsplash.com/photo-1635424710928-0544e8512eea?auto=format&fit=crop&q=80&w=200' },
      { productId: 'PRD-003', name: 'PVC Pipes 4"', qty: 10, unitPrice: '65 GHS', lineTotal: '650 GHS', image: 'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&q=80&w=200' },
    ],
  },
  {
    id: 'ORD-8989',
    customer: 'John Mensah',
    type: 'Retail',
    amount: '450 GHS',
    payStatus: 'Pending',
    paymentMethod: 'Mobile Money',
    delStatus: 'Ready',
    credStatus: 'N/A',
    date: 'Yesterday',
    deliveryAddress: {
      region: 'Greater Accra',
      city: 'Accra',
      area: 'Madina',
      landmark: 'Zongo Junction',
      contactPhone: '+233 55 111 2222'
    },
    orderNotes: 'Customer will confirm payment on pickup.',
    createdAt: '2026-03-24T16:40:00Z',
    updatedAt: '2026-03-24T17:10:00Z',
    items: [{ productId: 'PRD-004', name: 'Emulsion Paint 20L', qty: 1, unitPrice: '450 GHS', lineTotal: '450 GHS', image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&q=80&w=200' }],
  },
  {
    id: 'ORD-8988',
    customer: 'Accra Mall Co.',
    type: 'Retail',
    amount: '7,800 GHS',
    payStatus: 'Paid',
    paymentMethod: 'Bank Transfer',
    delStatus: 'Delivered',
    credStatus: 'Settled',
    date: 'Yesterday',
    deliveryAddress: 'Accra Mall, Loading Bay',
    orderNotes: 'Delivered and signed by procurement.',
    createdAt: '2026-03-24T10:05:00Z',
    updatedAt: '2026-03-24T13:55:00Z',
    items: [
      { productId: 'PRD-001', name: 'Portland Cement 50kg', qty: 30, unitPrice: '85 GHS', lineTotal: '2,550 GHS', image: 'https://images.unsplash.com/photo-1518709367011-8278783e7869?auto=format&fit=crop&q=80&w=200' },
      { productId: 'PRD-002', name: 'Iron Rods 16mm', qty: 25, unitPrice: '120 GHS', lineTotal: '3,000 GHS', image: 'https://images.unsplash.com/photo-1621905252507-b35242f8969d?auto=format&fit=crop&q=80&w=200' },
      { productId: 'PRD-004', name: 'Emulsion Paint 20L', qty: 5, unitPrice: '450 GHS', lineTotal: '2,250 GHS', image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&q=80&w=200' },
    ],
  },
  {
    id: 'ORD-8987',
    customer: 'Kingsway Const.',
    type: 'Wholesale',
    amount: '12,400 GHS',
    payStatus: 'Paid',
    paymentMethod: 'Bank Transfer',
    delStatus: 'Ready',
    credStatus: 'N/A',
    date: 'Yesterday',
    deliveryAddress: 'Tema Community 1, Site B',
    orderNotes: 'Urgent delivery for foundation work.',
    createdAt: '2026-03-24T08:30:00Z',
    updatedAt: '2026-03-24T09:00:00Z',
    items: [{ productId: 'PRD-001', name: 'Portland Cement 50kg', qty: 145, unitPrice: '85 GHS', lineTotal: '12,400 GHS', image: 'https://images.unsplash.com/photo-1518709367011-8278783e7869?auto=format&fit=crop&q=80&w=200' }],
  },
  {
    id: 'ORD-8986',
    customer: 'City Dev Hub',
    type: 'Retail',
    amount: '4,500 GHS',
    payStatus: 'Paid',
    paymentMethod: 'Mobile Money',
    delStatus: 'Ready',
    credStatus: 'N/A',
    date: '2 days ago',
    deliveryAddress: 'Dansoman, Control Market',
    orderNotes: 'Customer will be available after 10 AM.',
    createdAt: '2026-03-23T14:20:00Z',
    updatedAt: '2026-03-23T15:00:00Z',
    items: [{ productId: 'PRD-004', name: 'Emulsion Paint 20L', qty: 10, unitPrice: '450 GHS', lineTotal: '4,500 GHS', image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&q=80&w=200' }],
  },
  {
    id: 'ORD-8985',
    customer: 'Lakeside Hardware',
    type: 'Retail',
    amount: '2,300 GHS',
    payStatus: 'Paid',
    paymentMethod: 'Cash',
    delStatus: 'Delivered',
    credStatus: 'Settled',
    date: '3 days ago',
    deliveryAddress: 'Lakeside Estate, Community 8',
    orderNotes: 'Drop off at gatehouse.',
    createdAt: '2026-03-22T09:15:00Z',
    updatedAt: '2026-03-22T11:45:00Z',
    items: [{ productId: 'PRD-001', name: 'Portland Cement 50kg', qty: 27, unitPrice: '85 GHS', lineTotal: '2,300 GHS' }],
  },
  {
    id: 'ORD-8984',
    customer: 'Modern Living GH',
    type: 'Retail',
    amount: '950 GHS',
    payStatus: 'Paid',
    paymentMethod: 'Mobile Money',
    delStatus: 'Ready',
    credStatus: 'N/A',
    date: '3 days ago',
    deliveryAddress: 'East Legon, Jungle Road',
    orderNotes: 'Fragile items, handle with care.',
    createdAt: '2026-03-22T14:30:00Z',
    updatedAt: '2026-03-22T15:00:00Z',
    items: [{ productId: 'PRD-003', name: 'PVC Pipes 4"', qty: 14, unitPrice: '65 GHS', lineTotal: '910 GHS' }],
  },
  {
    id: 'ORD-8983',
    customer: 'Osei & Sons Const.',
    type: 'Wholesale',
    amount: '15,000 GHS',
    payStatus: 'Credit',
    paymentMethod: 'Bank Transfer',
    delStatus: 'In Transit',
    credStatus: 'Active',
    date: '4 days ago',
    trackingToken: 'RT-8983-Z01P',
    riderLocation: { lat: 5.6231, lng: -0.1732 },
    estimatedArrivalMin: 15,
    deliveryAddress: 'Lapaz, Nii Boi Town',
    orderNotes: 'Standard site delivery.',
    createdAt: '2026-03-21T11:00:00Z',
    updatedAt: '2026-03-21T11:30:00Z',
    items: [{ productId: 'PRD-002', name: 'Iron Rods 16mm', qty: 125, unitPrice: '120 GHS', lineTotal: '15,000 GHS' }],
  },
  {
    id: 'ORD-8982',
    customer: 'Green Valley Estates',
    type: 'Retail',
    amount: '3,800 GHS',
    payStatus: 'Paid',
    paymentMethod: 'Cash',
    delStatus: 'Ready',
    credStatus: 'N/A',
    date: '4 days ago',
    deliveryAddress: 'Aburi, Near Botanical Gardens',
    orderNotes: 'Deliver to site office.',
    createdAt: '2026-03-21T15:45:00Z',
    updatedAt: '2026-03-21T16:00:00Z',
    items: [{ productId: 'PRD-004', name: 'Emulsion Paint 20L', qty: 8, unitPrice: '450 GHS', lineTotal: '3,600 GHS' }],
  },
  {
    id: 'ORD-8981',
    customer: 'Samuel Darko',
    type: 'Retail',
    amount: '1,200 GHS',
    payStatus: 'Paid',
    paymentMethod: 'Mobile Money',
    delStatus: 'Pending',
    credStatus: 'N/A',
    date: 'Today, 08:00 AM',
    deliveryAddress: 'Adenta, Frafraha',
    orderNotes: 'Call before delivery.',
    createdAt: '2026-03-28T08:00:00Z',
    updatedAt: '2026-03-28T08:05:00Z',
    items: [{ productId: 'PRD-001', name: 'Portland Cement 50kg', qty: 14, unitPrice: '85 GHS', lineTotal: '1,190 GHS' }],
  },
  {
    id: 'ORD-8980',
    customer: 'Builders Hub Kumasi',
    type: 'Wholesale',
    amount: '22,400 GHS',
    payStatus: 'Paid',
    paymentMethod: 'Bank Transfer',
    delStatus: 'Cancelled',
    credStatus: 'N/A',
    date: 'Yesterday',
    deliveryAddress: 'Kumasi, Adum',
    orderNotes: 'Order cancelled by customer due to delay.',
    createdAt: '2026-03-27T10:00:00Z',
    updatedAt: '2026-03-27T14:00:00Z',
    items: [{ productId: 'PRD-002', name: 'Iron Rods 16mm', qty: 180, unitPrice: '120 GHS', lineTotal: '21,600 GHS' }],
  },
  {
    id: 'ORD-8979',
    customer: 'Quick Build GH',
    type: 'Retail',
    amount: '4,250 GHS',
    payStatus: 'Paid',
    paymentMethod: 'Cash',
    delStatus: 'Ready',
    credStatus: 'N/A',
    date: 'Today, 09:30 AM',
    deliveryAddress: 'Teshie, Nungua Estate',
    orderNotes: 'Urgent foundation items.',
    createdAt: '2026-03-28T09:30:00Z',
    updatedAt: '2026-03-28T09:45:00Z',
    items: [{ productId: 'PRD-004', name: 'Emulsion Paint 20L', qty: 9, unitPrice: '450 GHS', lineTotal: '4,050 GHS' }],
  },
  {
    id: 'ORD-8978',
    customer: 'Regimanuel Gray',
    type: 'Wholesale',
    amount: '45,000 GHS',
    payStatus: 'Credit',
    paymentMethod: 'Invoice',
    delStatus: 'Pending',
    credStatus: 'Active',
    date: 'Today, 11:15 AM',
    deliveryAddress: 'Sakumono, Community 18',
    orderNotes: 'Bulk cement for project site.',
    createdAt: '2026-03-28T11:15:00Z',
    updatedAt: '2026-03-28T11:30:00Z',
    items: [{ productId: 'PRD-001', name: 'Portland Cement 50kg', qty: 500, unitPrice: '85 GHS', lineTotal: '42,500 GHS' }],
  },
  {
    id: 'ORD-8977',
    customer: 'Grace Ofori',
    type: 'Retail',
    amount: '650 GHS',
    payStatus: 'Paid',
    paymentMethod: 'Mobile Money',
    delStatus: 'Delivered',
    credStatus: 'Settled',
    date: 'Yesterday',
    deliveryAddress: 'Achimota, Mile 7',
    orderNotes: 'Home improvement items.',
    createdAt: '2026-03-27T16:20:00Z',
    updatedAt: '2026-03-27T18:00:00Z',
    items: [{ productId: 'PRD-003', name: 'PVC Pipes 4"', qty: 10, unitPrice: '65 GHS', lineTotal: '650 GHS' }],
  },
];
