import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useProducts } from './ProductContext';
import { usePayments } from './PaymentContext';
import { useNotifications } from './NotificationContext';

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Dispached' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  qty: number;
  unitPrice: number;
  total: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerId: string;
  type: 'Retail' | 'Dealer';
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  paymentStatus: 'Pending' | 'Paid' | 'Credit';
  deliveryMethod: 'Dispatch' | 'Pickup';
  deliveryAgentId?: string;
  createdAt: string;
}

interface OrderManagementContextType {
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'status' | 'createdAt'>) => string;
  confirmOrder: (orderId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  assignDeliveryAgent: (orderId: string, agentId: string) => void;
}

const OrderManagementContext = createContext<OrderManagementContextType | undefined>(undefined);

export function OrderManagementProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const { reserveStock, commitStock, releaseStock } = useProducts();
  const { addTransaction } = usePayments();
  const { notify } = useNotifications();

  const createOrder = (orderData: Omit<Order, 'id' | 'status' | 'createdAt'>) => {
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      ...orderData,
      id: orderId,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    // 1. Reserve stock immediately
    orderData.items.forEach(item => {
      reserveStock(item.productId, item.qty, `Reservation for order ${orderId}`, orderId);
    });

    setOrders(prev => [newOrder, ...prev]);
    notify('Order Created', `Order ${orderId} has been successfully created.`, 'Success');
    return orderId;
  };

  const confirmOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    // 2. Commit stock (move from reserved to confirmed/gone)
    order.items.forEach(item => {
      commitStock(item.productId, item.qty, `Order ${orderId} confirmed`, orderId);
    });

    // 3. Register payment transaction
    addTransaction({
      id: `TXN-${Date.now()}`,
      type: 'Order Payment',
      direction: order.paymentStatus === 'Credit' ? 'credit' : 'in',
      party: order.customerName,
      partyId: order.customerId,
      partyType: order.type === 'Retail' ? 'Retailer' : 'Dealer',
      amount: order.totalAmount,
      method: order.paymentStatus === 'Credit' ? 'Store Credit' : 'Cash',
      status: 'Confirmed',
      recordedBy: 'System',
      timestamp: new Date().toISOString(),
      linkedId: orderId,
    });

    updateOrderStatus(orderId, 'Confirmed');
    notify('Order Confirmed', `Order ${orderId} is now confirmed and ready for fulfillment.`, 'Success');
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    
    if (status === 'Cancelled') {
      const order = orders.find(o => o.id === orderId);
      order?.items.forEach(item => {
        releaseStock(item.productId, item.qty, `Order ${orderId} cancelled`, orderId);
      });
      notify('Order Cancelled', `Order ${orderId} has been cancelled and stock released.`, 'Warning');
    }
  };

  const assignDeliveryAgent = (orderId: string, agentId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, deliveryAgentId: agentId, status: 'Processing' } : o));
    notify('Agent Assigned', `Delivery agent assigned to order ${orderId}.`, 'Info');
  };

  return (
    <OrderManagementContext.Provider value={{
      orders,
      createOrder,
      confirmOrder,
      updateOrderStatus,
      assignDeliveryAgent
    }}>
      {children}
    </OrderManagementContext.Provider>
  );
}

export function useOrderManagement() {
  const context = useContext(OrderManagementContext);
  if (context === undefined) {
    throw new Error('useOrderManagement must be used within an OrderManagementProvider');
  }
  return context;
}
