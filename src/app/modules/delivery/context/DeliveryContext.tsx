import React, { createContext, useContext, useState, ReactNode } from 'react';
import { apiClient } from '../../../core/api/client';

export interface DeliveryAgent {
  id: string;
  name: string;
  phone: string;
  vehicleType: 'bike' | 'van' | 'truck';
  licensePlate: string;
  status: 'Available' | 'On Delivery' | 'Offline';
  currentOrderId?: string;
  rating: number;
  deliveries: number;
  location: { lat: number; lng: number };
}

export interface Delivery {
  id: string;
  orderId: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
  customer: string;
  phone: string;
  pickup: string;
  dropoff: string;
  distance: string;
  time: string;
  priority: 'High' | 'Normal';
  progress: number; // -1: pending, 0: pickup, 1: transit, 2: delivered
  agentId?: string;
  isConsignment: boolean;
}

interface DeliveryContextType {
  agents: DeliveryAgent[];
  deliveries: Delivery[];
  updateAgentStatus: (id: string, status: DeliveryAgent['status'], orderId?: string) => void;
  getAvailableAgents: () => DeliveryAgent[];
  createDelivery: (orderData: any) => void;
  updateDeliveryProgress: (deliveryId: string) => void;
  assignAgentToDelivery: (deliveryId: string, agentId: string) => void;
  addAgent: (agent: Omit<DeliveryAgent, 'id' | 'rating'>) => void;
  deleteAgent: (id: string) => void;
  updateAgent: (agent: DeliveryAgent) => void;
}

const DeliveryContext = createContext<DeliveryContextType | undefined>(undefined);

export const MOCK_AGENTS: DeliveryAgent[] = [
  { id: 'AGT-001', name: 'Yaw Boateng', phone: '+233 24 111 2222', vehicleType: 'van', licensePlate: 'GW-4910-22', status: 'Available', rating: 4.8, deliveries: 1240, location: { lat: 5.6037, lng: -0.1870 } },
  { id: 'AGT-002', name: 'Kofi Mensah', phone: '+233 55 444 3333', vehicleType: 'bike', licensePlate: 'M-GR-201-23', status: 'On Delivery', currentOrderId: 'ORD-1234', rating: 4.5, deliveries: 856, location: { lat: 5.6241, lng: -0.1735 } },
  { id: 'AGT-003', name: 'Akua Addo', phone: '+233 20 987 6543', vehicleType: 'truck', licensePlate: 'GT-8812-19', status: 'Available', rating: 4.9, deliveries: 412, location: { lat: 5.5862, lng: -0.2104 } },
];

export function DeliveryProvider({ children }: { children: ReactNode }) {
  const [agents, setAgents] = useState<DeliveryAgent[]>(MOCK_AGENTS);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);

  const updateAgentStatus = (id: string, status: DeliveryAgent['status'], orderId?: string) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, status, currentOrderId: orderId } : a));
  };

  const createDelivery = (orderData: any) => {
    const newDelivery: Delivery = {
      id: `DL-${orderData.id.split('-')[1]}`,
      orderId: orderData.id,
      status: 'pending',
      customer: orderData.customerName,
      phone: 'N/A', // Would come from customer record
      pickup: 'Main Warehouse',
      dropoff: 'Customer Location',
      distance: 'Pending...',
      time: 'Just now',
      priority: 'Normal',
      progress: -1,
      isConsignment: false
    };
    setDeliveries(prev => [newDelivery, ...prev]);
  };

  const updateDeliveryProgress = async (deliveryId: string) => {
    // 1. Optimistic Update (Instant UI feedback)
    const previousDeliveries = [...deliveries];
    setDeliveries(prev => prev.map(d => {
      if (d.id === deliveryId) {
        if (d.progress === -1) return { ...d, status: 'active', progress: 0 };
        if (d.progress === 0) return { ...d, progress: 1 };
        if (d.progress === 1) return { ...d, status: 'completed', progress: 2, time: 'Just now' };
      }
      return d;
    }));

    try {
      // 2. Audited Backend Call
      await apiClient.mutate('PUT', `/deliveries/${deliveryId}/progress`, {}, 'Delivery');
    } catch (error) {
      // 3. Rollback on Failure
      console.error('Failed to update delivery progress:', error);
      setDeliveries(previousDeliveries);
    }
  };

  const assignAgentToDelivery = async (deliveryId: string, agentId: string) => {
    // 1. Optimistic Update
    const previousDeliveries = [...deliveries];
    const previousAgents = [...agents];

    setDeliveries(prev => prev.map(d => d.id === deliveryId ? { ...d, agentId, status: 'active', progress: 0 } : d));
    setAgents(prev => prev.map(a => a.id === agentId ? { ...a, status: 'On Delivery', currentOrderId: deliveryId } : a));

    try {
      // 2. Audited Backend Call
      await apiClient.mutate('POST', `/deliveries/${deliveryId}/assign`, { agentId }, 'Delivery');
    } catch (error) {
      // 3. Rollback
      console.error('Failed to assign agent:', error);
      setDeliveries(previousDeliveries);
      setAgents(previousAgents);
    }
  };

  const addAgent = (agentData: Omit<DeliveryAgent, 'id' | 'rating'>) => {
    const newAgent: DeliveryAgent = {
      ...agentData,
      id: `AGT-${Math.floor(1000 + Math.random() * 9000)}`,
      rating: 5.0,
      status: 'Available'
    };
    setAgents(prev => [...prev, newAgent]);
  };

  const deleteAgent = (id: string) => {
    setAgents(prev => prev.filter(a => a.id !== id));
  };

  const updateAgent = (updatedAgent: DeliveryAgent) => {
    setAgents(prev => prev.map(a => a.id === updatedAgent.id ? updatedAgent : a));
  };

  const getAvailableAgents = () => agents.filter(a => a.status === 'Available');

  return (
    <DeliveryContext.Provider value={{
      agents,
      deliveries,
      updateAgentStatus,
      getAvailableAgents,
      createDelivery,
      updateDeliveryProgress,
      assignAgentToDelivery,
      addAgent,
      deleteAgent,
      updateAgent
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
