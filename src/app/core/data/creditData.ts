export type CreditBand = 'Poor' | 'Fair' | 'Good' | 'Excellent';

export interface CreditTransaction {
  id: string;
  dealerId: string;
  type: 'Extension' | 'Repayment' | 'Purchase';
  amount: number;
  date: string;
  referenceId: string; // Order ID or Payment ID
  method?: string;
  balanceAfter: number;
}

export interface CreditAccount {
  id: string;
  dealerId: string;
  dealerName: string;
  creditLimit: number;
  usedAmount: number;
  score: number;
  band: CreditBand;
  trend: 'up' | 'down' | 'flat';
  lastRecalculated: string;
  nextRepaymentAmount: number;
  nextRepaymentDate: string;
  isSuspended: boolean;
}

export interface ScoringWeights {
  onTimeRepayments: number; // 40%
  repaymentFrequency: number; // 25%
  utilization: number; // 20%
  accountAge: number; // 10%
  overdueIncidents: number; // 5%
}

export const MOCK_CREDIT_ACCOUNTS: CreditAccount[] = [
  {
    id: 'ACC-001',
    dealerId: 'D-001',
    dealerName: 'Kwame Dealers Ltd',
    creditLimit: 10000,
    usedAmount: 6200,
    score: 74,
    band: 'Good',
    trend: 'up',
    lastRecalculated: new Date().toISOString(),
    nextRepaymentAmount: 1200,
    nextRepaymentDate: '2026-03-31',
    isSuspended: false
  },
  {
    id: 'ACC-002',
    dealerId: 'D-002',
    dealerName: 'Ama Wholesale',
    creditLimit: 15000,
    usedAmount: 2000,
    score: 61,
    band: 'Good',
    trend: 'flat',
    lastRecalculated: new Date().toISOString(),
    nextRepaymentAmount: 0,
    nextRepaymentDate: '2026-04-05',
    isSuspended: false
  },
  {
    id: 'ACC-003',
    dealerId: 'D-003',
    dealerName: 'BrightMart Supplies',
    creditLimit: 5000,
    usedAmount: 4200,
    score: 44,
    band: 'Fair',
    trend: 'down',
    lastRecalculated: new Date().toISOString(),
    nextRepaymentAmount: 800,
    nextRepaymentDate: '2026-03-25',
    isSuspended: false
  },
  {
    id: 'ACC-004',
    dealerId: 'D-004',
    dealerName: 'NorthStar Traders',
    creditLimit: 2000,
    usedAmount: 1800,
    score: 31,
    band: 'Poor',
    trend: 'down',
    lastRecalculated: new Date().toISOString(),
    nextRepaymentAmount: 500,
    nextRepaymentDate: '2026-03-20',
    isSuspended: true
  }
];

export const MOCK_CREDIT_TRANSACTIONS: CreditTransaction[] = [
  { id: 'TX-001', dealerId: 'D-001', type: 'Extension', amount: 2000, date: '2026-03-15', referenceId: 'RT-2901', balanceAfter: 6200 },
  { id: 'TX-002', dealerId: 'D-001', type: 'Repayment', amount: 1500, date: '2026-03-10', referenceId: 'PAY-882', method: 'MTN MoMo', balanceAfter: 4200 },
  { id: 'TX-003', dealerId: 'D-001', type: 'Extension', amount: 3000, date: '2026-03-02', referenceId: 'RT-2847', balanceAfter: 5700 }
];
