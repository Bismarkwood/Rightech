export type DealerStatus = 'Active' | 'Warning' | 'Inactive';

export interface Dealer {
  id: string;
  name: string;
  region: string;
  ordersCount: number;
  creditScore: number;
  outstanding: number;
  status: DealerStatus;
  lastOrder: string;
  creditLimit: number;
  registrationId: string;
  phone: string;
  email: string;
}

export const MOCK_DEALERS: Dealer[] = [
  { 
    id: 'DLR-101', name: 'Metro Electronics', region: 'Accra Central', ordersCount: 156, creditScore: 850, 
    outstanding: 12400, status: 'Active', lastOrder: '2 hours ago', creditLimit: 50000,
    registrationId: 'GHA-7892-001', phone: '+233 24 123 4567', email: 'purchasing@metro-gh.com'
  },
  { 
    id: 'DLR-102', name: 'Westside Tech', region: 'Kumasi', ordersCount: 84, creditScore: 720, 
    outstanding: 4500, status: 'Active', lastOrder: 'Yesterday', creditLimit: 20000,
    registrationId: 'GHA-2342-101', phone: '+233 20 987 6543', email: 'sales@westsidetech.gh'
  },
  { 
    id: 'DLR-103', name: 'Elite Gadgets Hub', region: 'Tema Port', ordersCount: 230, creditScore: 910, 
    outstanding: 0, status: 'Active', lastOrder: 'Today, 09:15 AM', creditLimit: 100000,
    registrationId: 'GHA-9991-001', phone: '+233 27 111 2222', email: 'orders@elitegadgets.com'
  },
  { 
    id: 'DLR-104', name: 'Rapid Mobile Solutions', region: 'Takoradi', ordersCount: 42, creditScore: 540, 
    outstanding: 18200, status: 'Warning', lastOrder: '3 days ago', creditLimit: 15000,
    registrationId: 'GHA-3331-501', phone: '+233 55 444 5555', email: 'admin@rapidmobile.com.gh'
  },
  { 
    id: 'DLR-105', name: 'Northern Appliances', region: 'Tamale', ordersCount: 12, creditScore: 610, 
    outstanding: 1200, status: 'Inactive', lastOrder: '2 weeks ago', creditLimit: 5000,
    registrationId: 'GHA-1110-002', phone: '+233 24 777 8888', email: 'info@northernapp.gh'
  },
  { 
    id: 'DLR-106', name: 'City Center Hub', region: 'Accra Central', ordersCount: 315, creditScore: 890, 
    outstanding: 5600, status: 'Active', lastOrder: 'Today, 11:30 AM', creditLimit: 80000,
    registrationId: 'GHA-4444-001', phone: '+233 26 999 0000', email: 'procurement@citycenter.com'
  }
];

export const MOCK_DEALER_ORDERS = [
  { id: 'ORD-9912', date: 'Oct 24, 2026', items: 45, total: 12500, status: 'Delivered', payment: 'Paid' },
  { id: 'ORD-9908', date: 'Oct 18, 2026', items: 12, total: 3400, status: 'Delivered', payment: 'Credit' },
  { id: 'ORD-9884', date: 'Oct 02, 2026', items: 120, total: 28000, status: 'Delivered', payment: 'Paid' },
  { id: 'ORD-9850', date: 'Sep 15, 2026', items: 8, total: 1800, status: 'Delivered', payment: 'Paid' },
];

export const MOCK_DEALER_PAYMENTS = [
  { id: 'PAY-4011', date: 'Oct 26, 2026', amount: 3400, method: 'Mobile Money', status: 'Completed', ref: 'ORD-9908' },
  { id: 'PAY-3992', date: 'Oct 24, 2026', amount: 12500, method: 'Bank Transfer', status: 'Completed', ref: 'ORD-9912' },
  { id: 'PAY-3810', date: 'Oct 05, 2026', amount: 28000, method: 'Bank Transfer', status: 'Completed', ref: 'ORD-9884' },
];

export const MOCK_DEALER_CONSIGNMENTS = [
  { id: 'CON-9021', product: 'Samsung Galaxy A54', supplied: 50, sold: 42, date: 'Sep 01, 2026', value: 126000 },
  { id: 'CON-8944', product: 'LG 55" UHD TV', supplied: 20, sold: 18, date: 'Aug 15, 2026', value: 180000 },
  { id: 'CON-8812', product: 'JBL Flip 6', supplied: 100, sold: 35, date: 'Oct 10, 2026', value: 45000 },
];
