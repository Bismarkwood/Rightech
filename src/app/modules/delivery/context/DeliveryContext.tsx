import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface DeliveryAgent {
  id: string;
  name: string;
  status: 'Available' | 'On Delivery' | 'Offline';
  currentOrderId?: string;
  rating: number;
}

interface DeliveryContextType {
  agents: DeliveryAgent[];
  updateAgentStatus: (id: string, status: DeliveryAgent['status'], orderId?: string) => void;
  getAvailableAgents: () => DeliveryAgent[];
}

const DeliveryContext = createContext<DeliveryContextType | undefined>(undefined);

export const MOCK_AGENTS: DeliveryAgent[] = [
  { id: 'AGT-001', name: 'Yaw Boateng', status: 'Available', rating: 4.8 },
  { id: 'AGT-002', name: 'Kofi Mensah', status: 'On Delivery', currentOrderId: 'ORD-1234', rating: 4.5 },
  { id: 'AGT-003', name: 'Akua Addo', status: 'Available', rating: 4.9 },
];

export function DeliveryProvider({ children }: { children: ReactNode }) {
  const [agents, setAgents] = useState<DeliveryAgent[]>(MOCK_AGENTS);

  const updateAgentStatus = (id: string, status: DeliveryAgent['status'], orderId?: string) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, status, currentOrderId: orderId } : a));
  };

  const getAvailableAgents = () => agents.filter(a => a.status === 'Available');

  return (
    <DeliveryContext.Provider value={{
      agents,
      updateAgentStatus,
      getAvailableAgents
    }}>
      {children}
    </DeliveryContext.Provider>
  );
}

export function useDelivery() {
  const context = useContext(DeliveryContext);
  if (context === undefined) {
    throw new Error('useDelivery must be used within a DeliveryProvider');
  }
  return context;
}
