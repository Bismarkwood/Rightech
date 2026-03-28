import React from 'react';
import { motion } from 'motion/react';
import { X, MapPin, Receipt, CreditCard, Clock, Truck, UserRound, MoreVertical } from 'lucide-react';
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
        className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-[100] w-[640px] max-h-[92vh] bg-white rounded-[40px] border-[1.5px] border-[#ECEDEF] overflow-hidden p-0 outline-none flex flex-col transition-all duration-300 shadow-none"
      >
        {/* Header Strip - Premium Flat */}
        <div className="bg-[#F8F9FA] px-10 py-8 border-b border-[#ECEDEF] flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h2 className="text-[28px] font-black text-[#111111] leading-none tracking-tight">{order.id || 'ORD-4642'}</h2>
              <span className="px-3 py-1.5 rounded-[10px] text-[10px] font-black tracking-[0.2em] uppercase bg-[#D40073]/5 text-[#D40073] border border-[#D40073]/10">
                Processing
              </span>
            </div>
            <div className="text-[14px] font-black text-[#8B93A7] uppercase tracking-widest flex items-center gap-2">
              <Clock size={16} strokeWidth={2.5} /> Created Today, 10:24 AM
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                onClose();
                openCreateOrder(order.customerId);
              }}
              className="h-12 px-6 rounded-full bg-[#111111] text-white text-[13px] font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95"
            >
              + New Order
            </button>
            <button onClick={onClose} className="w-12 h-12 rounded-full border-[1.5px] border-[#ECEDEF] flex items-center justify-center text-[#111111] hover:bg-[#FEF2F2] hover:text-[#EF4444] transition-colors active:scale-95">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-12 space-y-10 custom-scrollbar bg-white">
          
          {/* Section 1: Customer Info (Centered Flat Card) */}
          <div className="flex flex-col items-center text-center">
             <div className="w-24 h-24 rounded-[32px] bg-[#F8F9FA] border-[1.5px] border-[#ECEDEF] flex items-center justify-center text-[#111111] font-black text-[32px] mb-6">
                {order.customer?.name?.charAt(0) || 'K'}
             </div>
             <div className="space-y-1">
                <h3 className="text-[24px] font-black text-[#111111] tracking-tight">{order.customer?.name || 'Kwame Dealers Ltd'}</h3>
                <div className="flex items-center justify-center gap-3">
                   <span className="text-[14px] font-black text-[#8B93A7] uppercase tracking-widest">Business Account</span>
                   <div className="w-1.5 h-1.5 rounded-full bg-[#ECEDEF]" />
                   <span className="text-[14px] font-black text-[#D40073] uppercase tracking-widest">{order.type || 'Retail'}</span>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-6 border-t border-[#F8F9FA]">
             {/* Logistics Block */}
             <div className="space-y-6">
                <div className="flex items-center gap-2">
                   <div className="w-10 h-10 rounded-[14px] bg-[#F8F9FA] border border-[#ECEDEF] flex items-center justify-center">
                      <Truck size={18} className="text-[#D40073]" strokeWidth={2.5} />
                   </div>
                   <h4 className="text-[12px] font-black text-[#8B93A7] uppercase tracking-[0.2em]">Logistics</h4>
                </div>
                
                <div className="space-y-5 pl-1.5">
                   <div>
                      <p className="text-[11px] font-black text-[#8B93A7] uppercase tracking-widest mb-1.5">Method</p>
                      <p className="text-[16px] font-black text-[#111111]">Dispatch</p>
                   </div>
                   <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#16A34A]/5 border border-[#16A34A]/10 w-fit">
                      <div className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
                      <span className="text-[12px] font-black text-[#16A34A] uppercase tracking-wider">In Transit</span>
                   </div>
                   <p className="text-[13px] font-black text-[#0284C7] uppercase tracking-widest">ETA: 12-15 Mins</p>
                </div>
             </div>

             {/* Sharing Details Summary */}
             <div className="space-y-6">
                <div className="flex items-center gap-2">
                   <div className="w-10 h-10 rounded-[14px] bg-[#F8F9FA] border border-[#ECEDEF] flex items-center justify-center">
                      <Icon icon="solar:routing-2-bold-duotone" className="text-[#D40073] text-[20px]" />
                   </div>
                   <h4 className="text-[12px] font-black text-[#8B93A7] uppercase tracking-[0.2em]">Tracking Secured</h4>
                </div>
                <div className="space-y-5 pl-1.5">
                   <div>
                      <p className="text-[11px] font-black text-[#8B93A7] uppercase tracking-widest mb-1.5">Token ID</p>
                      <p className="text-[16px] font-black text-[#111111]">TRK-888HFC</p>
                   </div>
                   <div>
                      <p className="text-[11px] font-black text-[#8B93A7] uppercase tracking-widest mb-1.5">Destination</p>
                      <p className="text-[14px] font-bold text-[#525866] truncate">Kwame Dealers Ltd</p>
                   </div>
                </div>
             </div>
          </div>

          {/* Sharing Hub (The Boarding Pass center piece) - Pure Flat */}
          <div className="bg-white rounded-[40px] border-[1.5px] border-[#ECEDEF] overflow-hidden">
             <SharingHub order={order} />
          </div>

          {/* Order Manifest (Table Style) */}
          <div className="bg-white rounded-[32px] border-[1.5px] border-[#ECEDEF] overflow-hidden">
            <div className="p-8 border-b border-[#F8F9FA] flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <Receipt size={20} className="text-[#D40073]" strokeWidth={2.5} />
                 <h3 className="text-[13px] font-black text-[#111111] uppercase tracking-[0.1em]">Order Manifest</h3>
              </div>
              <span className="text-[13px] font-black text-[#8B93A7] uppercase tracking-widest">1 Product</span>
            </div>
            
            <div className="divide-y divide-[#F8F9FA]">
              {(order.items || [{ name: 'Dangote Cement (50kg)', qty: 1, unitPrice: '85', lineTotal: '85' }]).map((item: any, idx: number) => (
                <div key={idx} className="px-8 py-6 flex items-center gap-6 hover:bg-[#F8F9FA] transition-colors">
                  <div className="w-14 h-14 rounded-[18px] bg-[#F8F9FA] border border-[#ECEDEF] shrink-0 flex items-center justify-center">
                    <Icon icon="solar:box-minimalistic-bold" className="text-[#8B93A7] text-[24px]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[16px] font-black text-[#111111] truncate">{item.name}</div>
                    <div className="text-[14px] font-black text-[#8B93A7] uppercase tracking-widest">Qty: {item.qty} | {item.unitPrice}</div>
                  </div>
                  <div className="text-[18px] font-black text-[#111111] shrink-0">
                    {item.lineTotal} GHS
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#111111] px-10 py-8 flex items-center justify-between text-white">
              <div>
                <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] block mb-2">Total Amount</span>
                <span className="text-[28px] font-black leading-none">{order.amount || '85 GHS'}</span>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] block mb-2">Payment Status</span>
                <span className="px-4 py-1.5 rounded-full bg-[#16A34A] text-white text-[12px] font-black uppercase tracking-widest">Paid</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-4 py-6">
             <Icon icon="logos:rightech-icon" className="w-auto h-6 opacity-30" />
             <p className="text-[12px] text-[#8B93A7] font-black uppercase tracking-[0.3em]">
                Logistics & Deployment • Rightech Core v2.4
             </p>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
