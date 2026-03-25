export type RetailerOrderItem = {
  name: string;
  qty: number;
  unitPrice: string;
  lineTotal: string;
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
  deliveryAddress: string;
  orderNotes: string;
  createdAt: string;
  updatedAt: string;
  items?: RetailerOrderItem[];
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
    deliveryAddress: 'Spintex Road, Accra — Near Flower Pot Interchange',
    orderNotes: 'Customer requested early delivery before 2pm.',
    createdAt: '2026-03-25T10:30:00Z',
    updatedAt: '2026-03-25T10:35:00Z',
    items: [
      { name: 'Portland Cement 50kg', qty: 10, unitPrice: '85 GHS', lineTotal: '850 GHS' },
      { name: 'Emulsion Paint 20L', qty: 2, unitPrice: '450 GHS', lineTotal: '900 GHS' },
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
    deliveryAddress: 'Tema Industrial Area, Warehouse 12',
    orderNotes: 'Call site manager on arrival. Gate access required.',
    createdAt: '2026-03-25T09:15:00Z',
    updatedAt: '2026-03-25T11:05:00Z',
    items: [
      { name: 'Iron Rods 16mm', qty: 25, unitPrice: '120 GHS', lineTotal: '3,000 GHS' },
      { name: 'Roofing Sheets (Aluzinc)', qty: 20, unitPrice: '350 GHS', lineTotal: '7,000 GHS' },
      { name: 'PVC Pipes 4"', qty: 10, unitPrice: '65 GHS', lineTotal: '650 GHS' },
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
    deliveryAddress: 'Madina, Accra — Zongo Junction',
    orderNotes: 'Customer will confirm payment on pickup.',
    createdAt: '2026-03-24T16:40:00Z',
    updatedAt: '2026-03-24T17:10:00Z',
    items: [{ name: 'Emulsion Paint 20L', qty: 1, unitPrice: '450 GHS', lineTotal: '450 GHS' }],
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
      { name: 'Portland Cement 50kg', qty: 30, unitPrice: '85 GHS', lineTotal: '2,550 GHS' },
      { name: 'Iron Rods 16mm', qty: 25, unitPrice: '120 GHS', lineTotal: '3,000 GHS' },
      { name: 'Emulsion Paint 20L', qty: 5, unitPrice: '450 GHS', lineTotal: '2,250 GHS' },
    ],
  },
];

