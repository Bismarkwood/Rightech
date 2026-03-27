import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Transaction, MOCK_TRANSACTIONS, PaymentMethod, MOCK_PAYMENT_METHODS } from '../../../core/data/mockPayments';
import { useCredit } from '../../credit/context/CreditContext';

interface PaymentContextType {
  transactions: Transaction[];
  paymentMethods: PaymentMethod[];
  addTransaction: (tx: Transaction) => void;
  updateTransaction: (id: string, patch: Partial<Transaction>) => void;
  togglePaymentMethod: (id: string) => void;
  updatePaymentMethod: (id: string, patch: Partial<PaymentMethod>) => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(MOCK_PAYMENT_METHODS);
  const { recordCreditOrder } = useCredit();

  const addTransaction = (tx: Transaction) => {
    setTransactions(prev => [tx, ...prev]);
    
    // Connector logic: If it is a credit purchase, record it in the credit tracker
    if (tx.method === 'Store Credit' && tx.type === 'Order Payment' && tx.linkedId) {
      recordCreditOrder(tx.partyId, tx.linkedId, tx.amount);
    }
  };

  const updateTransaction = (id: string, patch: Partial<Transaction>) => {
    setTransactions(prev => prev.map(tx => tx.id === id ? { ...tx, ...patch } : tx));
  };

  const togglePaymentMethod = (id: string) => {
    setPaymentMethods(prev => prev.map(m => m.id === id ? { ...m, status: m.status === 'Active' ? 'Inactive' : 'Active' } : m));
  };

  const updatePaymentMethod = (id: string, patch: Partial<PaymentMethod>) => {
    setPaymentMethods(prev => prev.map(m => m.id === id ? { ...m, ...patch } : m));
  };

  return (
    <PaymentContext.Provider value={{ 
      transactions, 
      paymentMethods, 
      addTransaction, 
      updateTransaction, 
      togglePaymentMethod, 
      updatePaymentMethod 
    }}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayments() {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayments must be used within a PaymentProvider');
  }
  return context;
}
