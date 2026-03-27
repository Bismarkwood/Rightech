export interface Transaction {
  id: string;
  type: 'Order Payment' | 'Consignment Payment' | 'Supplier Payout' | 'Credit Repayment' | 'Credit Extension' | 'Refund' | 'Partial Payment';
  direction: 'in' | 'out' | 'credit';
  party: string;
  partyId: string;
  partyType: 'Dealer' | 'Retailer' | 'Supplier';
  amount: number;
  method: 'Cash' | 'MTN Mobile Money' | 'Telecel Cash' | 'AirtelTigo Money' | 'Bank Transfer' | 'Store Credit';
  status: 'Confirmed' | 'Pending' | 'Failed' | 'Outstanding';
  recordedBy: string;
  timestamp: string;
  reference?: string;
  linkedId?: string; // Order ID or Consignment ID
  notes?: string;
}

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'RT-PAY-001',
    type: 'Order Payment',
    direction: 'in',
    party: 'Kwame Dealers Ltd',
    partyId: 'D-001',
    partyType: 'Dealer',
    amount: 1200.00,
    method: 'MTN Mobile Money',
    status: 'Confirmed',
    recordedBy: 'Kwame Asante',
    timestamp: '2026-03-27T10:42:00Z',
    reference: 'MOM-884321',
    linkedId: 'RT-2847',
    notes: 'Full payment for electrical fittings'
  },
  {
    id: 'RT-PAY-002',
    type: 'Order Payment',
    direction: 'in',
    party: 'RetailShop Tema',
    partyId: 'R-002',
    partyType: 'Retailer',
    amount: 340.00,
    method: 'Cash',
    status: 'Confirmed',
    recordedBy: 'Kwame Asante',
    timestamp: '2026-03-27T09:18:00Z',
    reference: 'CSH-1029',
    linkedId: 'RT-2848'
  },
  {
    id: 'RT-PAY-003',
    type: 'Supplier Payout',
    direction: 'out',
    party: 'ShenzhenTech Co.',
    partyId: 'SUP-99',
    partyType: 'Supplier',
    amount: 8500.00,
    method: 'Bank Transfer',
    status: 'Pending',
    recordedBy: 'Admin',
    timestamp: '2026-03-26T15:00:00Z',
    reference: 'BT-9928',
    linkedId: 'C-0041',
    notes: '2nd installment for electronics consignment'
  },
  {
    id: 'RT-PAY-004',
    type: 'Credit Extension',
    direction: 'credit',
    party: 'Ama Wholesale',
    partyId: 'D-002',
    partyType: 'Dealer',
    amount: 2000.00,
    method: 'Store Credit',
    status: 'Outstanding',
    recordedBy: 'System',
    timestamp: '2026-03-26T10:30:00Z',
    linkedId: 'RT-2845'
  },
  {
    id: 'RT-PAY-005',
    type: 'Consignment Payment',
    direction: 'in',
    party: 'Global Logistics',
    partyId: 'SUP-102',
    partyType: 'Supplier',
    amount: 4500.00,
    method: 'Bank Transfer',
    status: 'Confirmed',
    recordedBy: 'Kwame Asante',
    timestamp: '2026-03-25T14:20:00Z',
    reference: 'BT-1023',
    linkedId: 'C-0039'
  }
];

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'cash' | 'momo' | 'credit';
  status: 'Active' | 'Inactive';
  merchantCode?: string;
  icon?: string;
}

export const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'm1', name: 'Cash', type: 'cash', status: 'Active' },
  { id: 'm2', name: 'MTN Mobile Money', type: 'momo', status: 'Active', merchantCode: '123456' },
  { id: 'm3', name: 'Telecel Cash', type: 'momo', status: 'Inactive' },
  { id: 'm4', name: 'AirtelTigo Money', type: 'momo', status: 'Inactive' },
  { id: 'm5', name: 'Store Credit', type: 'credit', status: 'Active' }
];
