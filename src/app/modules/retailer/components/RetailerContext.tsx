import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useProducts } from '../../products/context/ProductContext';
import { Product } from '../../../core/data/productData';
import { RetailerOrder } from '../../../core/data/mockRetailerOrders';
import { useOrderManagement } from '../../orders/context/OrderManagementContext';

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
  isNewOrderModalOpen: boolean;
  setNewOrderModalOpen: (open: boolean) => void;
  isAddSupplierModalOpen: boolean;
  setAddSupplierModalOpen: (open: boolean) => void;
  inventory: InventoryItem[];
  addInventoryItem: (item: Partial<Product>) => void;
  updateInventoryItem: (itemId: string, patch: Partial<Product>) => void;
  deleteInventoryItem: (itemId: string) => void;
  suppliers: Supplier[];
  addSupplier: (supplier: Supplier) => void;
  updateSupplier: (supplierId: string, patch: Partial<Supplier>) => void;
  deleteSupplier: (supplierId: string) => void;
}

const RetailerContext = createContext<RetailerContextType | undefined>(undefined);

export function RetailerProvider({ children }: { children: ReactNode }) {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { orders: globalOrders, createOrder, updateOrderStatus, assignDeliveryAgent: globalAssign } = useOrderManagement();

  const orders: RetailerOrder[] = globalOrders
    .filter(o => o.type === 'Retail')
    .map(o => ({
      id: o.id,
      customer: o.customerName,
      type: 'Retail',
      amount: `${o.totalAmount.toLocaleString()} GHS`,
      payStatus: o.paymentStatus === 'Credit' ? 'Credit' : 'Paid',
      paymentMethod: o.paymentStatus === 'Credit' ? 'Store Credit' : 'Cash',
      delStatus: o.status as any,
      credStatus: o.paymentStatus === 'Credit' ? 'Active' : 'N/A',
      date: new Date(o.createdAt).toLocaleDateString(),
      deliveryAddress: o.deliveryAddress || '',
      orderNotes: '',
      createdAt: o.createdAt,
      updatedAt: o.createdAt,
      trackingToken: o.trackingToken,
      riderLocation: o.riderLocation,
      estimatedArrivalMin: o.estimatedArrivalMin,
      items: o.items.map(i => ({
        productId: i.productId,
        name: i.name,
        qty: i.qty,
        unitPrice: `${i.unitPrice} GHS`,
        lineTotal: `${i.total} GHS`
      }))
    }));

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
    createOrder({
      id: order.id,
      customerName: order.customer,
      customerId: 'C-000',
      type: 'Retail',
      items: order.items?.map(i => ({
        productId: i.productId,
        name: i.name,
        qty: i.qty,
        unitPrice: parseFloat(i.unitPrice.replace(/[^0-9.]/g, '')),
        total: parseFloat(i.lineTotal.replace(/[^0-9.]/g, ''))
      })) || [],
      totalAmount: parseFloat(order.amount.replace(/[^0-9.]/g, '')),
      paymentStatus: order.payStatus === 'Credit' ? 'Credit' : 'Paid',
      deliveryMethod: 'Dispatch'
    });
  };

  const updateOrder = (orderId: string, patch: Partial<RetailerOrder>) => {
    if (patch.delStatus) {
      updateOrderStatus(orderId, patch.delStatus as any);
    }
  };

  const assignAgent = (orderId: string, agentId: string) => {
    globalAssign(orderId, agentId);
  };

  const [isNewOrderModalOpen, setNewOrderModalOpen] = useState(false);
  const [isAddSupplierModalOpen, setAddSupplierModalOpen] = useState(false);

  const addInventoryItem = (product: Partial<Product>) => addProduct(product as any);
  const updateInventoryItem = (itemId: string, patch: Partial<Product>) => updateProduct(itemId, patch);
  const deleteInventoryItem = (itemId: string) => deleteProduct(itemId);

  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const addSupplier = (supplier: Supplier) => setSuppliers(prev => [supplier, ...prev]);
  const updateSupplier = (supplierId: string, patch: Partial<Supplier>) => setSuppliers(prev => prev.map(s => s.id === supplierId ? { ...s, ...patch } : s));
  const deleteSupplier = (supplierId: string) => setSuppliers(prev => prev.filter(s => s.id !== supplierId));

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
