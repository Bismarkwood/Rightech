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

const generateMockTransactions = (count: number): Transaction[] => {
  const types: Transaction['type'][] = ['Order Payment', 'Consignment Payment', 'Supplier Payout', 'Credit Repayment', 'Credit Extension'];
  const methods: Transaction['method'][] = ['Cash', 'MTN Mobile Money', 'Telecel Cash', 'Bank Transfer', 'Store Credit'];
  const parties = ['Kwame Dealers Ltd', 'RetailShop Tema', 'ShenzhenTech Co.', 'Ama Wholesale', 'Global Logistics', 'Accra Supplies', 'Kumasi Hub'];
  const statuses: Transaction['status'][] = ['Confirmed', 'Pending', 'Outstanding'];

  const txs: Transaction[] = [];
  for (let i = 1; i <= count; i++) {
    const type = types[i % types.length];
    const direction = type.includes('Payout') ? 'out' : (type.includes('Extension') ? 'credit' : 'in');
    
    txs.push({
      id: `RT-PAY-${i.toString().padStart(4, '0')}`,
      type,
      direction,
      party: parties[i % parties.length],
      partyId: `P-${100 + (i % 50)}`,
      partyType: direction === 'out' ? 'Supplier' : (i % 3 === 0 ? 'Dealer' : 'Retailer'),
      amount: Math.floor(Math.random() * 10000) + 100,
      method: methods[i % methods.length],
      status: statuses[i % statuses.length],
      recordedBy: 'System Auditor',
      timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      reference: `${methods[i % methods.length].substring(0, 3).toUpperCase()}-${10000 + i}`,
      linkedId: i % 2 === 0 ? `ORD-${2000 + i}` : undefined,
      notes: i % 10 === 0 ? 'Verified and reconciled by automated audit trail.' : undefined
    });
  }
  return txs;
};

export const MOCK_TRANSACTIONS = generateMockTransactions(2000);

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
