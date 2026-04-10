import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from '@iconify/react';
import { TrackingMap } from '../components/TrackingMap';
import { StatusCard } from '../components/StatusCard';
import { OrderBrief } from '../components/OrderBrief';
import { MOCK_RETAILER_ORDERS, RetailerOrder } from '../../../core/data/mockRetailerOrders';

export default function TrackingPage() {
  const { token } = useParams<{ token: string }>();
  const [order, setOrder] = useState<RetailerOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API fetch for tracking data
    const timer = setTimeout(() => {
      // 1. Check localStorage for newly created orders
      const savedOrdersRaw = localStorage.getItem('righttech_orders');
      const savedOrders = savedOrdersRaw ? JSON.parse(savedOrdersRaw) : [];
      
      const matchInSaved = savedOrders.find((o: any) => o.id === token || o.trackingToken === token);
      
      if (matchInSaved) {
        // Normalize Order to RetailerOrder type for the UI components
        const normalized: RetailerOrder = {
          id: matchInSaved.id,
          customer: matchInSaved.customerName,
          type: matchInSaved.type,
          amount: `GHS ${matchInSaved.totalAmount.toFixed(2)}`,
          payStatus: matchInSaved.paymentStatus,
          paymentMethod: 'Mobile Money', 
          delStatus: matchInSaved.status,
          credStatus: 'N/A',
          date: new Date(matchInSaved.createdAt).toLocaleDateString(),
          deliveryAddress: matchInSaved.deliveryAddress || 'Accra',
          orderNotes: '',
          createdAt: matchInSaved.createdAt,
          updatedAt: matchInSaved.createdAt,
          items: matchInSaved.items.map((i: any) => ({ 
            productId: i.productId,
            name: i.name || 'Product', 
            qty: i.qty, 
            unitPrice: `GHS ${i.unitPrice?.toFixed(2) || '0.00'}`,
            lineTotal: `GHS ${i.total?.toFixed(2) || '0.00'}`,
            image: i.image 
          })),
          trackingToken: matchInSaved.trackingToken,
          riderLocation: matchInSaved.riderLocation || { lat: 5.6037, lng: -0.1870 },
          estimatedArrivalMin: matchInSaved.estimatedArrivalMin || 12,
          agent: { 
            name: 'Kofi Mensah', 
            phone: '0241234567',
            avatar: 'KM',
            vehicle: 'Motorcycle'
          }
        };
        setOrder(normalized);
      } else {
        // 2. Fallback to static mock data
        const matchInMocks = MOCK_RETAILER_ORDERS.find(o => o.id === token || o.trackingToken === token);
        if (matchInMocks) {
          setOrder(matchInMocks);
        } else {
          setError("NOT_FOUND");
        }
      }
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [token]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#F8F9FA] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-[24px] bg-white flex items-center justify-center mb-6">
          <Icon icon="solar:routing-bold-duotone" className="text-[32px] text-[#D40073] animate-pulse" />
        </div>
        <h1 className="text-[20px] font-black text-[#111111] mb-2 tracking-tight">Locating your delivery...</h1>
        <p className="text-[14px] font-medium text-[#8B93A7] max-w-[240px]">Connecting to the logistics server to fetch real-time updates.</p>
      </div>
    );
  }

  if (error || !order) {
    const isExpired = error === "EXPIRED";
    return (
      <div className="fixed inset-0 bg-[#F8F9FA] flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-[24px] bg-white border border-[#ECEDEF] flex items-center justify-center mb-6">
          <Icon icon={isExpired ? "solar:clock-circle-bold-duotone" : "solar:danger-bold-duotone"} className={`text-[32px] ${isExpired ? 'text-[#D97706]' : 'text-[#DC2626]'}`} />
        </div>
        <h1 className="text-[20px] font-black text-[#111111] mb-2 tracking-tight">
          {isExpired ? 'Link Expired' : 'Link Invalid'}
        </h1>
        <p className="text-[14px] font-medium text-[#8B93A7] max-w-[280px]">
          {isExpired 
            ? 'Tracking links are only active for 24 hours after order creation for security reasons.' 
            : 'We couldn\'t find a tracking record for this link. Please check the URL or contact support.'}
        </p>
        <button className="mt-8 h-12 px-6 bg-[#111111] text-white rounded-[16px] font-black text-[14px] hover:scale-105 active:scale-95 transition-all">
          Contact Support
        </button>
      </div>
    );
  }

  // Pre-render expiration check if order found
  const createdAt = order.createdAt ? new Date(order.createdAt).getTime() : 0;
  const now = new Date().getTime();
  const isActuallyExpired = createdAt > 0 && (now - createdAt > 24 * 60 * 60 * 1000);

  if (isActuallyExpired) {
    return (
      <div className="fixed inset-0 bg-[#F8F9FA] flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-[24px] bg-white border border-[#ECEDEF] flex items-center justify-center mb-6">
          <Icon icon="solar:clock-circle-bold-duotone" className="text-[32px] text-[#D97706]" />
        </div>
        <h1 className="text-[20px] font-black text-[#111111] mb-2 tracking-tight">Link Expired</h1>
        <p className="text-[14px] font-medium text-[#8B93A7] max-w-[280px]">Tracking links are only active for 24 hours after order creation for security reasons.</p>
        <button className="mt-8 h-12 px-6 bg-[#111111] text-white rounded-[16px] font-black text-[14px] hover:scale-105 active:scale-95 transition-all">
          Contact Support
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#F8F9FA] flex overflow-hidden">
      {/* Real-time Map Background (takes the remaining space) */}
      <div className="flex-1 relative z-0">
        <TrackingMap order={order} />
        
        {/* Floating Header Overlay (Simplified for side-drawer layout) */}
        <div className="absolute top-6 left-6 z-10 pointer-events-none">
          <div className="bg-white/90 backdrop-blur-md rounded-[20px] px-5 py-3 border border-white/50 flex items-center gap-3 pointer-events-auto">
             <div className="w-10 h-10 rounded-full bg-[#111111] flex items-center justify-center text-white">
                <Icon icon="solar:bag-bold" className="text-[18px]" />
             </div>
             <div>
                <div className="text-[11px] font-black text-[#8B93A7] uppercase tracking-widest leading-none mb-1">Tracking</div>
                <div className="text-[15px] font-black text-[#111111] leading-none">{order.id}</div>
             </div>
          </div>
        </div>
      </div>

      {/* Side Drawer Interaction Layer */}
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        className="w-[85vw] md:w-[400px] bg-white border-l border-[#ECEDEF] z-20 flex flex-col overflow-hidden"
      >
        {/* Rider Info Header */}
        <div className="p-8 border-b border-[#ECEDEF] flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#D40073]/5 border border-[#D40073]/10 flex items-center justify-center text-[#D40073] font-black">
                 {order.agent?.avatar || 'KM'}
              </div>
              <div>
                 <p className="text-[15px] font-black text-[#111111]">{order.agent?.name || 'Kofi Mensah'}</p>
                 <p className="text-[12px] font-medium text-[#8B93A7]">{order.agent?.vehicle || 'Motorcycle'}</p>
              </div>
           </div>
           <button className="w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#111111] hover:bg-[#D40073] hover:text-white transition-colors">
              <Icon icon="solar:share-bold" className="text-[18px]" />
           </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-8 pb-0">
            <StatusCard order={order} />
          </div>
          <OrderBrief order={order} />
        </div>
      </motion.div>

      <style>{`
        .leaflet-container { height: 100% !important; width: 100% !important; z-index: 0 !important; }
        .leaflet-control-zoom { display: none !important; }
        .leaflet-control-attribution { font-size: 8px !important; opacity: 0.3 !important; }
        /* Hide scrollbar for internal containers */
        div::-webkit-scrollbar { width: 0; background: transparent; }
      `}</style>
    </div>
  );
}
