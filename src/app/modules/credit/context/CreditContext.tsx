import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CreditAccount, CreditTransaction, MOCK_CREDIT_ACCOUNTS, MOCK_CREDIT_TRANSACTIONS, ScoringWeights, CreditBand } from '../../../core/data/creditData';

interface CreditContextType {
  accounts: CreditAccount[];
  transactions: CreditTransaction[];
  weights: ScoringWeights;
  updateWeights: (newWeights: ScoringWeights) => void;
  recordRepayment: (accountId: string, amount: number, method: string) => void;
  adjustLimit: (accountId: string, newLimit: number, reason: string) => void;
  toggleSuspension: (accountId: string) => void;
  getAccountByDealerId: (dealerId: string) => CreditAccount | undefined;
  recordCreditOrder: (dealerId: string, orderId: string, amount: number) => void;
}

const CreditContext = createContext<CreditContextType | undefined>(undefined);

export function CreditProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<CreditAccount[]>(MOCK_CREDIT_ACCOUNTS);
  const [transactions, setTransactions] = useState<CreditTransaction[]>(MOCK_CREDIT_TRANSACTIONS);
  const [weights, setWeights] = useState<ScoringWeights>({
    onTimeRepayments: 40,
    repaymentFrequency: 25,
    utilization: 20,
    accountAge: 10,
    overdueIncidents: 5
  });

  const updateWeights = (newWeights: ScoringWeights) => setWeights(newWeights);

  const calculateBand = (score: number): CreditBand => {
    if (score < 40) return 'Poor';
    if (score < 60) return 'Fair';
    if (score < 80) return 'Good';
    return 'Excellent';
  };

  const recordRepayment = (accountId: string, amount: number, method: string) => {
    setAccounts(prev => prev.map(acc => {
      if (acc.id === accountId) {
        const newUsed = Math.max(0, acc.usedAmount - amount);
        // Simulate score increase on repayment
        const newScore = Math.min(100, acc.score + 2);
        return { 
          ...acc, 
          usedAmount: newUsed, 
          score: newScore, 
          band: calculateBand(newScore),
          lastRecalculated: new Date().toISOString()
        };
      }
      return acc;
    }));

    const account = accounts.find(a => a.id === accountId);
    if (account) {
      const newTx: CreditTransaction = {
        id: `TX-${Math.floor(Math.random() * 10000)}`,
        dealerId: account.dealerId,
        type: 'Repayment',
        amount: amount,
        date: new Date().toISOString().split('T')[0],
        referenceId: `REP-${Math.floor(Math.random() * 1000)}`,
        method,
        balanceAfter: account.usedAmount - amount
      };
      setTransactions(prev => [newTx, ...prev]);
    }
  };

  const adjustLimit = (accountId: string, newLimit: number, reason: string) => {
    setAccounts(prev => prev.map(acc => 
      acc.id === accountId ? { ...acc, creditLimit: newLimit } : acc
    ));
    console.log(`Limit adjusted for ${accountId} to ${newLimit}. Reason: ${reason}`);
  };

  const toggleSuspension = (accountId: string) => {
    setAccounts(prev => prev.map(acc => 
      acc.id === accountId ? { ...acc, isSuspended: !acc.isSuspended } : acc
    ));
  };

  const recordCreditOrder = (dealerId: string, orderId: string, amount: number) => {
    setAccounts(prev => prev.map(acc => {
      if (acc.dealerId === dealerId) {
        return { 
          ...acc, 
          usedAmount: acc.usedAmount + amount,
          lastRecalculated: new Date().toISOString()
        };
      }
      return acc;
    }));

    const newTx: CreditTransaction = {
      id: `TX-${Math.floor(Math.random() * 10000)}`,
      dealerId,
      type: 'Purchase',
      amount: amount,
      date: new Date().toISOString().split('T')[0],
      referenceId: orderId,
      method: 'Credit',
      balanceAfter: (accounts.find(a => a.dealerId === dealerId)?.usedAmount || 0) + amount
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const getAccountByDealerId = (dealerId: string) => accounts.find(a => a.dealerId === dealerId);

  return (
    <CreditContext.Provider value={{
      accounts,
      transactions,
      weights,
      updateWeights,
      recordRepayment,
      adjustLimit,
      toggleSuspension,
      getAccountByDealerId,
      recordCreditOrder
    }}>
      {children}
    </CreditContext.Provider>
  );
}

export function useCredit() {
  const context = useContext(CreditContext);
  if (context === undefined) {
    throw new Error('useCredit must be used within a CreditProvider');
  }
  return context;
}
