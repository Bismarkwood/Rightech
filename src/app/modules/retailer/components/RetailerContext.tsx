import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useProducts } from '../../products/context/ProductContext';
import { Product } from '../../../core/data/productData';
import { MOCK_RETAILER_ORDERS, RetailerOrder } from '../../../core/data/mockRetailerOrders';

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
  addInventoryItem: (item: Partial<Product>) => void;
  updateInventoryItem: (itemId: string, patch: Partial<Product>) => void;
  deleteInventoryItem: (itemId: string) => void;
  // Suppliers
  suppliers: Supplier[];
  addSupplier: (supplier: Supplier) => void;
  updateSupplier: (supplierId: string, patch: Partial<Supplier>) => void;
  deleteSupplier: (supplierId: string) => void;
}

const RetailerContext = createContext<RetailerContextType | undefined>(undefined);

export function RetailerProvider({ children }: { children: ReactNode }) {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [orders, setOrders] = useState<RetailerOrder[]>(MOCK_RETAILER_ORDERS);

  // Map global products to local InventoryItem format for UI compatibility
  const inventory: InventoryItem[] = products
    .filter(p => !p.isArchived)
    .map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      stock: p.stock,
      minStock: p.lowStockThreshold,
      price: `${p.price.toLocaleString()} GHS`,
      status: p.status as 'In Stock' | 'Low Stock' | 'Out of Stock',
      lastUpdated: p.updatedAt,
      image: p.image,
      description: p.description,
    }));

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

  // Inventory logic using global ProductContext
  const addInventoryItem = (product: Partial<Product>) => {
    addProduct(product as any);
  };

  const updateInventoryItem = (itemId: string, patch: Partial<Product>) => {
    updateProduct(itemId, patch);
  };

  const deleteInventoryItem = (itemId: string) => {
    deleteProduct(itemId);
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
