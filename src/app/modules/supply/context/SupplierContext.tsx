import React, { createContext, useContext, useState, ReactNode } from 'react';

export type VettingStatus = 'Pending' | 'Verified' | 'Rejected' | 'Blacklisted';

export interface Supplier {
  id: string;
  name: string;
  category: string;
  contactPerson: string;
  email: string;
  phone: string;
  status: VettingStatus;
  rating: number;
  totalConsignments: number;
}

interface SupplierContextType {
  suppliers: Supplier[];
  addSupplier: (supplier: Omit<Supplier, 'id' | 'totalConsignments' | 'rating'>) => void;
  updateSupplierStatus: (id: string, status: VettingStatus) => void;
  getSupplier: (id: string) => Supplier | undefined;
  isAddSupplierModalOpen: boolean;
  setAddSupplierModalOpen: (open: boolean) => void;
}

const SupplierContext = createContext<SupplierContextType | undefined>(undefined);

export const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: 'SUP-001',
    name: 'TechFlow Global',
    category: 'Electronics',
    contactPerson: 'Sarah Chen',
    email: 'sarah@techflow.com',
    phone: '+233 24 555 0101',
    status: 'Verified',
    rating: 4.8,
    totalConsignments: 12
  },
  {
    id: 'SUP-002',
    name: 'BuildRight Materials',
    category: 'Hardware',
    contactPerson: 'John Mensah',
    email: 'john@buildright.com',
    phone: '+233 50 123 4567',
    status: 'Verified',
    rating: 4.5,
    totalConsignments: 8
  },
  {
    id: 'SUP-003',
    name: 'SwiftLogistics Ltd',
    category: 'Logistics',
    contactPerson: 'Ama Serwaa',
    email: 'ama@swiftlog.com',
    phone: '+233 20 987 6543',
    status: 'Pending',
    rating: 0,
    totalConsignments: 0
  }
];

export function SupplierProvider({ children }: { children: ReactNode }) {
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [isAddSupplierModalOpen, setAddSupplierModalOpen] = useState(false);

  const addSupplier = (supplierData: Omit<Supplier, 'id' | 'totalConsignments' | 'rating'>) => {
    const newSupplier: Supplier = {
      ...supplierData,
      id: `SUP-${Math.floor(1000 + Math.random() * 9000)}`,
      totalConsignments: 0,
      rating: 0
    };
    setSuppliers(prev => [newSupplier, ...prev]);
  };

  const updateSupplierStatus = (id: string, status: VettingStatus) => {
    setSuppliers(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const getSupplier = (id: string) => suppliers.find(s => s.id === id);

  return (
    <SupplierContext.Provider value={{
      suppliers,
      addSupplier,
      updateSupplierStatus,
      getSupplier,
      isAddSupplierModalOpen,
      setAddSupplierModalOpen
    }}>
      {children}
    </SupplierContext.Provider>
  );
}

export function useSuppliers() {
  const context = useContext(SupplierContext);
  if (context === undefined) {
    throw new Error('useSuppliers must be used within a SupplierProvider');
  }
  return context;
}
