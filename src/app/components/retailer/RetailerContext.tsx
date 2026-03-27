import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MOCK_RETAILER_ORDERS, RetailerOrder, RetailerOrderItem } from '../../data/mockRetailerOrders';

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  price: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  lastUpdated: string;
  image?: string;
  description?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  category: string;
  status: 'Active' | 'Inactive';
  rating: number;
  totalOrders: number;
  outstandingDebt: string;
  address: string;
  logo?: string;
}

const MOCK_SUPPLIERS: Supplier[] = [
  { 
    id: 'SUP-001', 
    name: 'Dangote Cement Ghana', 
    contactPerson: 'Kofi Mensah', 
    phone: '+233 24 123 4567', 
    email: 'kofi.m@dangote.gh', 
    category: 'Cement', 
    status: 'Active', 
    rating: 4.8, 
    totalOrders: 145, 
    outstandingDebt: '12,500 GHS',
    address: 'Tema Industrial Area, Plot 45',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=DC'
  },
  { 
    id: 'SUP-002', 
    name: 'GHL Steel Works', 
    contactPerson: 'Ama Serwaa', 
    phone: '+233 20 987 6543', 
    email: 'serwaa@ghlsteel.com', 
    category: 'Steel', 
    status: 'Active', 
    rating: 4.5, 
    totalOrders: 89, 
    outstandingDebt: '0.00 GHS',
    address: 'Kumasi, Suame Magazine',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=GS'
  },
  { 
    id: 'SUP-003', 
    name: 'Paints & More Ltd', 
    contactPerson: 'David Osei', 
    phone: '+233 55 444 3322', 
    email: 'david@paintsmore.gh', 
    category: 'Paint', 
    status: 'Inactive', 
    rating: 3.9, 
    totalOrders: 42, 
    outstandingDebt: '4,200 GHS',
    address: 'Accra, Spintex Road',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=PM'
  },
];

const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'INV-101', name: 'Portland Cement 50kg', category: 'Cement', stock: 450, minStock: 100, price: '85 GHS', status: 'In Stock', lastUpdated: 'Today', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=100&auto=format&fit=crop' },
  { id: 'INV-102', name: 'Iron Rods 16mm', category: 'Steel', stock: 12, minStock: 50, price: '120 GHS', status: 'Low Stock', lastUpdated: 'Yesterday', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=100&auto=format&fit=crop' },
  { id: 'INV-103', name: 'Roofing Sheets (Aluzinc)', category: 'Roofing', stock: 0, minStock: 20, price: '350 GHS', status: 'Out of Stock', lastUpdated: '2 days ago', image: 'https://images.unsplash.com/photo-1635424710928-0544e8512eca?q=80&w=100&auto=format&fit=crop' },
  { id: 'INV-104', name: 'Emulsion Paint 20L', category: 'Paint', stock: 85, minStock: 30, price: '450 GHS', status: 'In Stock', lastUpdated: 'Today', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=100&auto=format&fit=crop' },
  { id: 'INV-105', name: 'PVC Pipes 4"', category: 'Plumbing', stock: 120, minStock: 40, price: '65 GHS', status: 'In Stock', lastUpdated: '1 week ago', image: 'https://images.unsplash.com/photo-1542013936693-840898492040?q=80&w=100&auto=format&fit=crop' },
];

interface RetailerContextType {
  orders: RetailerOrder[];
  addOrder: (order: RetailerOrder) => void;
  updateOrder: (orderId: string, patch: Partial<RetailerOrder>) => void;
  assignAgent: (orderId: string, agentId: string) => void;
  // Modals
  isNewOrderModalOpen: boolean;
  setNewOrderModalOpen: (open: boolean) => void;
  isAddSupplierModalOpen: boolean;
  setAddSupplierModalOpen: (open: boolean) => void;
  // Inventory
  inventory: InventoryItem[];
  addInventoryItem: (item: InventoryItem) => void;
  updateInventoryItem: (itemId: string, patch: Partial<InventoryItem>) => void;
  deleteInventoryItem: (itemId: string) => void;
  // Suppliers
  suppliers: Supplier[];
  addSupplier: (supplier: Supplier) => void;
  updateSupplier: (supplierId: string, patch: Partial<Supplier>) => void;
  deleteSupplier: (supplierId: string) => void;
}

const RetailerContext = createContext<RetailerContextType | undefined>(undefined);

export function RetailerProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<RetailerOrder[]>(MOCK_RETAILER_ORDERS);
  const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY);

  const addOrder = (order: RetailerOrder) => {
    setOrders(prev => [order, ...prev]);
  };

  const updateOrder = (orderId: string, patch: Partial<RetailerOrder>) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...patch, updatedAt: new Date().toISOString() } : o));
  };

  const assignAgent = (orderId: string, agentId: string) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId 
        ? { ...o, delStatus: 'In Transit', updatedAt: new Date().toISOString() } 
        : o
    ));
  };

  const [isNewOrderModalOpen, setNewOrderModalOpen] = useState(false);
  const [isAddSupplierModalOpen, setAddSupplierModalOpen] = useState(false);

  // Inventory logic
  const addInventoryItem = (item: InventoryItem) => {
    setInventory(prev => [item, ...prev]);
  };

  const updateInventoryItem = (itemId: string, patch: Partial<InventoryItem>) => {
    setInventory(prev => prev.map(item => {
      if (item.id === itemId) {
        const next = { ...item, ...patch, lastUpdated: 'Just now' };
        // Recalc status
        if (next.stock <= 0) next.status = 'Out of Stock';
        else if (next.stock <= next.minStock) next.status = 'Low Stock';
        else next.status = 'In Stock';
        return next;
      }
      return item;
    }));
  };

  const deleteInventoryItem = (itemId: string) => {
    setInventory(prev => prev.filter(item => item.id !== itemId));
  };

  // Supplier logic
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);

  const addSupplier = (supplier: Supplier) => {
    setSuppliers(prev => [supplier, ...prev]);
  };

  const updateSupplier = (supplierId: string, patch: Partial<Supplier>) => {
    setSuppliers(prev => prev.map(s => s.id === supplierId ? { ...s, ...patch } : s));
  };

  const deleteSupplier = (supplierId: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== supplierId));
  };

  return (
    <RetailerContext.Provider value={{ 
      orders, addOrder, updateOrder, assignAgent, 
      isNewOrderModalOpen, setNewOrderModalOpen,
      isAddSupplierModalOpen, setAddSupplierModalOpen,
      inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem,
      suppliers, addSupplier, updateSupplier, deleteSupplier
    }}>
      {children}
    </RetailerContext.Provider>
  );
}

export function useRetailer() {
  const context = useContext(RetailerContext);
  if (context === undefined) {
    throw new Error('useRetailer must be used within a RetailerProvider');
  }
  return context;
}
