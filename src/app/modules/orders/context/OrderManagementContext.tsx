import React, { createContext, useContext, useState, ReactNode } from 'react';
import { apiClient } from '../../../core/api/client';
import { useProducts } from '../../products/context/ProductContext';
import { usePayments } from '../../payments/context/PaymentContext';
import { useNotifications } from '../../../core/context/NotificationContext';
import { useDelivery } from '../../delivery/context/DeliveryContext';
import { GhanaAddress } from '../../../core/types/address';

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
  deliveryMethod: 'Dispatch' | 'Pickup' | string;
  deliveryAgentId?: string;
  deliveryAddress?: GhanaAddress | string | null;
  trackingToken?: string;
  riderLocation?: { lat: number; lng: number };
  estimatedArrivalMin?: number;
  createdAt: string;
};

interface OrderManagementContextType {
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'status' | 'createdAt'>) => string;
  confirmOrder: (orderId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  assignDeliveryAgent: (orderId: string, agentId: string) => void;
}

const OrderManagementContext = createContext<OrderManagementContextType | undefined>(undefined);

export function OrderManagementProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('righttech_orders');
    return saved ? JSON.parse(saved) : [];
  });
  const { reserveStock, commitStock, releaseStock } = useProducts();
  const { addTransaction } = usePayments();
  const { notify } = useNotifications();
  const { createDelivery } = useDelivery();

  // Persist to localStorage whenever orders change
  React.useEffect(() => {
    localStorage.setItem('righttech_orders', JSON.stringify(orders));
  }, [orders]);

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

    // --- AUTOMATION: Instant Confirm for Mobile Money / Paid upfront ---
    if (orderData.paymentStatus === 'Paid') {
      setTimeout(() => confirmOrder(orderId), 500); // Small delay for UX/stability
    }

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
    
    // --- AUTOMATION: Create Delivery Record on Confirmation ---
    if (order.deliveryMethod === 'Dispatch') {
      createDelivery(order);
    }

    notify('Order Confirmed', `Order ${orderId} is now confirmed and ready for fulfillment.`, 'Success');
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    // 1. Optimistic Update
    const previousOrders = [...orders];
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));

    try {
      // 2. Audited Backend Call
      await apiClient.mutate('PUT', `/orders/${orderId}/status`, { status }, 'Orders');

      if (status === 'Cancelled') {
        const order = orders.find(o => o.id === orderId);
        order?.items.forEach(item => {
          releaseStock(item.productId, item.qty, `Order ${orderId} cancelled`, orderId);
        });
        notify('Order Cancelled', `Order ${orderId} has been cancelled and stock released.`, 'Warning');
      }
    } catch (error) {
      // 3. Rollback
      console.error('Failed to update order status:', error);
      setOrders(previousOrders);
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
