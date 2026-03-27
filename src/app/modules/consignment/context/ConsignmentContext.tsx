import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MOCK_SUPPLIER_CONSIGNMENTS, MOCK_DEALER_CONSIGNMENTS, ConsignmentItem } from '../../../core/data/consignmentData';

interface ConsignmentContextType {
  inboundConsignments: ConsignmentItem[];
  outboundConsignments: any[];
  isNewConsignmentModalOpen: boolean;
  setNewConsignmentModalOpen: (open: boolean) => void;
  addInboundConsignment: (item: ConsignmentItem) => void;
  addOutboundConsignment: (item: ConsignmentItem) => void;
  deleteConsignment: (id: string) => void;
}

const ConsignmentContext = createContext<ConsignmentContextType | undefined>(undefined);

export function ConsignmentProvider({ children }: { children: ReactNode }) {
  const [inboundConsignments, setInboundConsignments] = useState<ConsignmentItem[]>(MOCK_SUPPLIER_CONSIGNMENTS);
  const [outboundConsignments, setOutboundConsignments] = useState<ConsignmentItem[]>(MOCK_DEALER_CONSIGNMENTS);
  const [isNewConsignmentModalOpen, setNewConsignmentModalOpen] = useState(false);

  const addInboundConsignment = (item: ConsignmentItem) => {
    setInboundConsignments(prev => [item, ...prev]);
  };

  const addOutboundConsignment = (item: ConsignmentItem) => {
    setOutboundConsignments(prev => [item, ...prev]);
  };

  const deleteConsignment = (id: string) => {
    setInboundConsignments(prev => prev.filter(c => c.id !== id));
    setOutboundConsignments(prev => prev.filter(c => c.id !== id));
  };

  return (
    <ConsignmentContext.Provider value={{
      inboundConsignments,
      outboundConsignments,
      isNewConsignmentModalOpen,
      setNewConsignmentModalOpen,
      addInboundConsignment,
      addOutboundConsignment,
      deleteConsignment
    }}>
      {children}
    </ConsignmentContext.Provider>
  );
}

export function useConsignment() {
  const context = useContext(ConsignmentContext);
  if (context === undefined) {
    throw new Error('useConsignment must be used within a ConsignmentProvider');
  }
  return context;
}
