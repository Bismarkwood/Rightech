import React from 'react';
import { motion } from 'motion/react';
import { X, MapPin, Receipt, CreditCard, Clock, Truck, UserRound, Smartphone, Banknote, MoreVertical } from 'lucide-react';
import { Icon } from '@iconify/react';
import { Dialog, DialogContent } from '../../../core/components/ui/dialog';
import { SharingHub } from './SharingHub';
import { useOrderWorkflow } from './OrderWorkflowContext';
import { GhanaAddress } from '../../../core/types/address';

const formatAddress = (address: any): string => {
  if (!address) return 'No address provided';
  if (typeof address === 'string') return address;
  
  const { region, city, area, landmark } = address as GhanaAddress;
  return [landmark, area, city, region].filter(Boolean).join(', ');
};

export interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any | null;
}

export function OrderDetailModal({ isOpen, onClose, order }: OrderDetailModalProps) {
  const { openCreateOrder } = useOrderWorkflow();
  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent 
        className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-[100] w-[640px] max-h-[90vh] bg-[#FAFBFC] rounded-[40px] border border-[#ECEDEF] shadow-[0_40px_100px_rgba(0,0,0,0.15)] overflow-hidden p-0 outline-none flex flex-col"
      >
        {/* Header Strip */}
        <div className="bg-white px-8 py-6 border-b border-[#ECEDEF] flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-[24px] font-black text-[#111111] leading-none tracking-tight">{order.id}</h2>
              <span className="px-3 py-1 rounded-[8px] text-[10px] font-black tracking-[0.15em] uppercase bg-[#E0E7FF] text-[#4F46E5] border border-[#C7D2FE]">
                Processing
              </span>
            </div>
            <div className="text-[14px] font-medium text-[#8B93A7] flex items-center gap-1.5 mt-1">
              <Clock size={14} /> Created {order.date || 'Today, 10:24 AM'}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                onClose();
                openCreateOrder(order.customerId);
              }}
              className="h-10 px-5 rounded-full bg-[#111111] text-white text-[12px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-md active:scale-95"
            >
              + New Order
            </button>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-[#FEF2F2] flex items-center justify-center text-[#EF4444] hover:bg-[#FEE2E2] transition-colors active:scale-95">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
          
          {/* Main Grid: Customer & Logistics */}
          <div className="grid grid-cols-2 gap-6">
            {/* Customer Box */}
            <div className="bg-white rounded-[24px] border border-[#ECEDEF] p-6 shadow-sm">
                <h3 className="text-[11px] font-black text-[#8B93A7] uppercase tracking-[0.2em] flex items-center gap-2 mb-6 border-b border-[#F8F9FA] pb-3">
                  <UserRound size={14} /> Customer
                </h3>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-[#FAFBFC] border border-[#ECEDEF] flex items-center justify-center text-[#111111] font-black text-[20px] mb-4">
                    {order.customer?.name?.charAt(0) || 'C'}
                  </div>
                  <div className="text-[18px] font-black text-[#111111] tracking-tight">{order.customer?.name || order.customer}</div>
                  <div className="text-[13px] font-medium text-[#525866] mt-1">{order.customer?.contact || order.phone || 'No contact'}</div>
                  <span className={`mt-3 px-3 py-1 rounded-full text-[10px] font-black tracking-[0.12em] uppercase ${order.type === 'Wholesale' ? 'bg-[#D40073]/10 text-[#D40073]' : 'bg-[#16A34A]/10 text-[#16A34A]'}`}>
                    {order.type || 'Retail'}
                  </span>
                </div>
            </div>

            {/* Logistics Box */}
            <div className="bg-white rounded-[24px] border border-[#ECEDEF] p-6 shadow-sm">
                <h3 className="text-[11px] font-black text-[#8B93A7] uppercase tracking-[0.2em] flex items-center gap-2 mb-6 border-b border-[#F8F9FA] pb-3">
                  <Truck size={14} /> Logistics
                </h3>
                
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <span className="text-[13px] font-bold text-[#8B93A7]">Method</span>
                      <span className="text-[13px] font-black text-[#111111] uppercase tracking-widest">{order.delStatus === 'Ready' || order.delStatus === 'Pending' ? 'Delivery' : 'Dispatch'}</span>
                   </div>
                   
                   <div className="p-4 bg-[#F8F9FA] rounded-[20px] border border-[#ECEDEF]">
                      <div className="flex items-start gap-3">
                         <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-[#ECEDEF] shrink-0">
                            <MapPin size={14} className="text-[#D40073]" />
                         </div>
                         <div className="text-[13px] font-medium text-[#525866] leading-relaxed">
                            {formatAddress(order.deliveryAddress)}
                         </div>
                      </div>
                   </div>

                   <div className="flex items-center gap-3 p-3 bg-[#E0F2FE] border border-[#BAE6FD] rounded-[16px]">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#0284C7]">
                        <Icon icon="solar:routing-2-bold-duotone" className="text-[18px]" />
                      </div>
                      <div>
                        <div className="text-[13px] font-bold text-[#0369A1]">{order.delStatus || 'In Transit'}</div>
                        <div className="text-[11px] font-medium text-[#0369A1]/70">ETA: 12-15 Mins</div>
                      </div>
                   </div>
                </div>
            </div>
          </div>

          {/* Sharing Hub Card (The Boarding Pass center piece) */}
          <div className="bg-white rounded-[32px] border border-[#ECEDEF] p-2 shadow-lg relative">
             <div className="absolute top-4 left-4 bg-[#111111] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] z-10">
                Tracking Details
             </div>
             <SharingHub order={order} />
          </div>

          {/* Order Items Table Style */}
          <div className="bg-white rounded-[24px] border border-[#ECEDEF] overflow-hidden shadow-sm">
            <div className="p-6 border-b border-[#F8F9FA] flex items-center justify-between">
              <h3 className="text-[11px] font-black text-[#8B93A7] uppercase tracking-[0.2em] flex items-center gap-2">
                <Receipt size={14} /> Order Manifest
              </h3>
              <span className="text-[12px] font-bold text-[#525866] bg-[#F1F3F5] px-3 py-1 rounded-full">{order.items?.length || 0} Products</span>
            </div>
            
            <div className="divide-y divide-[#F8F9FA]">
              {order.items?.map((item: any, idx: number) => (
                <div key={idx} className="px-6 py-4 flex items-center gap-4 hover:bg-[#FAFBFC] transition-colors">
                  <div className="w-12 h-12 rounded-[14px] bg-[#F8F9FA] border border-[#ECEDEF] overflow-hidden shrink-0 flex items-center justify-center">
                    {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : <Icon icon="solar:box-minimalistic-bold" className="text-[#8B93A7] text-[20px]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-black text-[#111111] truncate">{item.name}</div>
                    <div className="text-[12px] font-bold text-[#8B93A7]">Qty: {item.qty} <span className="mx-2 text-[#ECEDEF]">|</span> {item.unitPrice}</div>
                  </div>
                  <div className="text-[15px] font-black text-[#111111] shrink-0 font-mono">
                    {item.lineTotal || (item.qty * (parseFloat(item.unitPrice) || 0) + ' GHS')}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#111111] px-8 py-6 flex items-center justify-between text-white">
              <div>
                <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] block mb-1">Total Amount</span>
                <span className="text-[22px] font-black leading-none">{order.amount}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Status</span>
                <span className="px-3 py-1 rounded-full bg-[#16A34A] text-white text-[11px] font-black uppercase tracking-widest">{order.payStatus || 'Paid'}</span>
              </div>
            </div>
          </div>
          
          <p className="text-[12px] text-center text-[#8B93A7] font-black uppercase tracking-[0.2em] py-4">
             Logistics & Deployment • Rightech Core v2.4
          </p>

        </div>
      </DialogContent>
    </Dialog>
  );
}
