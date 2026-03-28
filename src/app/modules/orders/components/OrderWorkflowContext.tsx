import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, ChevronRight } from 'lucide-react';
import { CreateOrderModal } from './CreateOrderModal';
import { OrderDetailModal } from './OrderDetailModal';
import { SharingModal } from './SharingModal';
import { useOrderManagement } from '../context/OrderManagementContext';

interface OrderWorkflowContextType {
  openCreateOrder: (prefilledCustomerId?: string) => void;
  openOrderDetail: (orderData: any) => void;
  openSharingModal: (order: any) => void;
  showToast: (orderData: any) => void;
}

const OrderWorkflowContext = createContext<OrderWorkflowContextType | undefined>(undefined);

export function OrderWorkflowProvider({ children }: { children: ReactNode }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [prefilledCustomerId, setPrefilledCustomerId] = useState<string | undefined>();
  const { createOrder } = useOrderManagement();
  
  const [detailOrderData, setDetailOrderData] = useState<any>(null);
  const [toastOrderData, setToastOrderData] = useState<any>(null);
  const [sharingOrder, setSharingOrder] = useState<any>(null);

  const openCreateOrder = (customerId?: string) => {
    setPrefilledCustomerId(customerId);
    setIsCreateOpen(true);
  };

  const openOrderDetail = (orderData: any) => {
    setDetailOrderData(orderData);
  };

  const openSharingModal = (order: any) => {
    setSharingOrder(order);
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
      id: orderData.id,
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
    <OrderWorkflowContext.Provider value={{ openCreateOrder, openOrderDetail, openSharingModal, showToast }}>
      {children}

      {/* Global Modals & Drawers */}
      <CreateOrderModal 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        prefilledCustomerId={prefilledCustomerId}
        onOrderSuccess={handleOrderSuccess}
      />
      
      <OrderDetailModal 
        isOpen={!!detailOrderData} 
        onClose={() => setDetailOrderData(null)} 
        order={detailOrderData} 
      />

      <SharingModal 
        isOpen={!!sharingOrder}
        onClose={() => setSharingOrder(null)}
        order={sharingOrder}
      />

      {/* Global Toast */}
      <AnimatePresence>
        {toastOrderData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] w-[400px] bg-white rounded-[24px] border border-[#ECEDEF] shadow-[0_32px_80px_rgba(0,0,0,0.15)] overflow-hidden p-6 flex flex-col items-center text-center pointer-events-auto"
          >
            <div className="w-16 h-16 rounded-full bg-[#16A34A] text-white flex items-center justify-center mb-4 shadow-xl shadow-[#16A34A]/20">
              <Check size={32} className="stroke-[3]" />
            </div>
            
            <div className="text-[20px] font-black text-[#111111] mb-2">
              Order {toastOrderData.id} Created!
            </div>
            
            <div className="text-[14px] font-medium text-[#525866] mb-8 max-w-[280px]">
              {toastOrderData.rider?.name || 'Self Collection'} assigned · GHS {toastOrderData.total?.toFixed(2)}
            </div>

            <div className="flex flex-col w-full gap-2">
              <button 
                onClick={() => {
                  openOrderDetail(toastOrderData);
                  setToastOrderData(null);
                }}
                className="w-full h-12 bg-[#D40073] text-white rounded-[14px] font-black text-[14px] flex items-center justify-center gap-2 hover:bg-[#B80063] transition-all active:scale-[0.98]"
              >
                View Tracking & Details
              </button>
              <button 
                onClick={() => setToastOrderData(null)}
                className="w-full h-12 bg-[#F9FAFB] text-[#8B93A7] rounded-[14px] font-black text-[14px] hover:bg-[#F1F3F5] transition-all"
              >
                Dismiss
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
