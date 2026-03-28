import React, { createContext, useContext, useState, ReactNode } from 'react';
import { apiClient } from '../../../core/api/client';
import { useProducts } from '../../products/context/ProductContext';
import { usePayments } from '../../payments/context/PaymentContext';
import { useNotifications } from '../../../core/context/NotificationContext';
import { useDelivery } from '../../delivery/context/DeliveryContext';
import { GhanaAddress } from '../../../core/types/address';
import { MOCK_RETAILER_ORDERS } from '../../../core/data/mockRetailerOrders';
import { MOCK_DEALER_ORDERS } from '../../../core/data/mockDealerData';

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
  createOrder: (orderData: Omit<Order, 'id' | 'status' | 'createdAt'> & { id?: string }) => string;
  confirmOrder: (orderId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  assignDeliveryAgent: (orderId: string, agentId: string) => void;
}

const OrderManagementContext = createContext<OrderManagementContextType | undefined>(undefined);

export function OrderManagementProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('righttech_orders');
    if (saved) return JSON.parse(saved);

    // Initial Seeding from Mocks if localStorage is empty
    const transformedRetail: Order[] = MOCK_RETAILER_ORDERS.map(ro => ({
      id: ro.id,
      customerName: ro.customer,
      customerId: 'C-000', // Mock fallback
      type: 'Retail',
      status: (ro.delStatus === 'In Transit' ? 'Dispached' : ro.delStatus === 'Delivered' ? 'Delivered' : 'Pending') as OrderStatus,
      items: ro.items?.map(i => ({
        productId: i.productId,
        name: i.name,
        qty: i.qty,
        unitPrice: parseFloat(i.unitPrice.replace(/[^0-9.]/g, '')),
        total: parseFloat(i.lineTotal.replace(/[^0-9.]/g, ''))
      })) || [],
      totalAmount: parseFloat(ro.amount.replace(/[^0-9.]/g, '')),
      paymentStatus: ro.payStatus === 'Paid' ? 'Paid' : ro.payStatus === 'Credit' ? 'Credit' : 'Pending',
      deliveryMethod: ro.delStatus === 'collection' ? 'Pickup' : 'Dispatch',
      deliveryAddress: ro.deliveryAddress,
      trackingToken: ro.trackingToken,
      riderLocation: ro.riderLocation,
      estimatedArrivalMin: ro.estimatedArrivalMin,
      createdAt: ro.createdAt
    }));

    const transformedDealer: Order[] = MOCK_DEALER_ORDERS.map(do_ => ({
      id: do_.id,
      customerName: 'Dealer Customer', // Mock fallback
      customerId: 'D-000',
      type: 'Dealer',
      status: (do_.status === 'Delivered' ? 'Delivered' : 'Pending') as OrderStatus,
      items: do_.lines.map(l => ({
        productId: `PRD-${Math.random()}`,
        name: l.name,
        qty: l.qty,
        unitPrice: l.price,
        total: l.qty * l.price
      })),
      totalAmount: do_.total,
      paymentStatus: do_.payment === 'Paid' ? 'Paid' : 'Credit',
      deliveryMethod: do_.fulfillment === 'In-Store Pickup' ? 'Pickup' : 'Dispatch',
      createdAt: new Date().toISOString()
    }));

    return [...transformedRetail, ...transformedDealer];
  });
  const { reserveStock, commitStock, releaseStock } = useProducts();
  const { addTransaction } = usePayments();
  const { notify } = useNotifications();
  const { createDelivery } = useDelivery();

  // Persist to localStorage whenever orders change
  React.useEffect(() => {
    localStorage.setItem('righttech_orders', JSON.stringify(orders));
  }, [orders]);

  const createOrder = (orderData: Omit<Order, 'id' | 'status' | 'createdAt'> & { id?: string }) => {
    const orderId = orderData.id || `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
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
    setOrders(currentOrders => {
      const order = currentOrders.find(o => o.id === orderId);
      if (!order) return currentOrders;

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

      // Show notification
      notify('Order Confirmed', `Order ${orderId} is now confirmed and ready for fulfillment.`, 'Success');

      // --- AUTOMATION: Create Delivery Record on Confirmation ---
      if (order.deliveryMethod === 'Dispatch') {
        createDelivery(order);
      }

      return currentOrders.map(o => o.id === orderId ? { ...o, status: 'Confirmed' } : o);
    });
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
