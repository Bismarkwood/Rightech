import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, ChevronRight } from 'lucide-react';
import { CreateOrderModal } from './CreateOrderModal';
import { OrderDetailDrawer } from './OrderDetailDrawer';
import { useOrderManagement } from '../context/OrderManagementContext';

interface OrderWorkflowContextType {
  openCreateOrder: (prefilledCustomerId?: string) => void;
  openOrderDetail: (orderData: any) => void;
  showToast: (orderData: any) => void;
}

const OrderWorkflowContext = createContext<OrderWorkflowContextType | undefined>(undefined);

export function OrderWorkflowProvider({ children }: { children: ReactNode }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [prefilledCustomerId, setPrefilledCustomerId] = useState<string | undefined>();
  const { createOrder } = useOrderManagement();
  
  const [detailOrderData, setDetailOrderData] = useState<any>(null);
  const [toastOrderData, setToastOrderData] = useState<any>(null);

  const openCreateOrder = (customerId?: string) => {
    setPrefilledCustomerId(customerId);
    setIsCreateOpen(true);
  };

  const openOrderDetail = (orderData: any) => {
    setDetailOrderData(orderData);
  };

  const showToast = (orderData: any) => {
    setToastOrderData(orderData);
    // Auto hide after 5 seconds
    setTimeout(() => {
      setToastOrderData((current: any) => current?.id === orderData.id ? null : current);
    }, 5000);
  };

  const handleOrderSuccess = (orderData: any) => {
    // Map CreateOrderModal data to OrderManagementContext format
    createOrder({
      customerName: orderData.customer?.name || 'Unknown',
      customerId: orderData.customer?.id || 'C-000',
      type: orderData.customer?.type === 'Dealer' ? 'Dealer' : 'Retail',
      items: orderData.items.map((i: any) => ({
        productId: i.id || `P-${Math.random()}`,
        name: i.name,
        qty: i.qty,
        unitPrice: i.unitPrice,
        total: i.qty * i.unitPrice
      })),
      totalAmount: orderData.total,
      paymentStatus: orderData.paymentMethod === 'credit' ? 'Credit' : 'Paid',
      deliveryMethod: orderData.deliveryMethod === 'delivery' ? 'Dispatch' : 'Pickup',
      deliveryAgentId: orderData.rider?.id,
      deliveryAddress: orderData.deliveryAddress,
      trackingToken: orderData.trackingToken,
      riderLocation: orderData.riderLocation,
      estimatedArrivalMin: orderData.estimatedArrivalMin
    });

    setIsCreateOpen(false);
    showToast(orderData);
  };

  return (
    <OrderWorkflowContext.Provider value={{ openCreateOrder, openOrderDetail, showToast }}>
      {children}

      {/* Global Modals & Drawers */}
      <CreateOrderModal 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        prefilledCustomerId={prefilledCustomerId}
        onOrderSuccess={handleOrderSuccess}
      />
      
      <OrderDetailDrawer 
        isOpen={!!detailOrderData} 
        onClose={() => setDetailOrderData(null)} 
        order={detailOrderData} 
      />

      {/* Global Toast */}
      <AnimatePresence>
        {toastOrderData && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-[100] w-[360px] bg-white rounded-[16px] border border-[#ECEDEF] shadow-2xl overflow-hidden p-4 flex gap-4 pointer-events-auto"
          >
            <div className="w-10 h-10 rounded-full bg-[#16A34A] text-white flex items-center justify-center shrink-0 shadow-lg shadow-[#16A34A]/20">
              <Check size={20} className="stroke-[3]" />
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="text-[14px] font-black text-[#111111] mb-1">
                Order {toastOrderData.id} created
              </div>
              <div className="text-[13px] font-medium text-[#525866] mb-3 leading-tight">
                {toastOrderData.rider?.name || 'Self Collection'} assigned · GHS {toastOrderData.total?.toFixed(2)}
              </div>
              <button 
                onClick={() => {
                  openOrderDetail(toastOrderData);
                  setToastOrderData(null); // Optional: close toast early when clicked
                }}
                className="text-[13px] font-bold text-[#D40073] hover:text-[#B80063] flex items-center gap-1 group transition-colors"
              >
                View Order <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </OrderWorkflowContext.Provider>
  );
}

export const useOrderWorkflow = () => {
  const context = useContext(OrderWorkflowContext);
  if (context === undefined) {
    throw new Error('useOrderWorkflow must be used within an OrderWorkflowProvider');
  }
  return context;
};
