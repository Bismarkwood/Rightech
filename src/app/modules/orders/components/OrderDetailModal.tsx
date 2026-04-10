import React from 'react';
import { motion } from 'motion/react';
import { X, Clock } from 'lucide-react';
import { Icon } from '@iconify/react';
import { Dialog, DialogContent } from '../../../core/components/ui/dialog';
import { SharingHub } from './SharingHub';

export interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any | null;
}

export function OrderDetailModal({ isOpen, onClose, order }: OrderDetailModalProps) {
  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent 
        className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-[100] w-[480px] bg-white rounded-[32px] border-[1.5px] border-[#ECEDEF] overflow-hidden p-0 outline-none flex flex-col"
      >
        {/* Header - Minimalist Ticket ID */}
        <div className="bg-[#F8F9FA] px-7 py-4 border-b border-[#ECEDEF] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-[16px] bg-white border border-[#ECEDEF] flex items-center justify-center text-[#D40073]">
               <Icon icon="solar:ticket-bold-duotone" className="text-[22px]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-[16px] font-black text-[#111111] leading-none tracking-tight">{order.id}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[8.5px] font-black tracking-[0.2em] uppercase bg-[#16A34A] text-white">
                  Active
                </span>
              </div>
              <p className="text-[10px] font-bold text-[#8B93A7] uppercase tracking-widest mt-1">Today, 10:24 AM</p>
            </div>
          </div>
          
          <button onClick={onClose} className="w-10 h-10 rounded-full border-[1.5px] border-[#ECEDEF] flex items-center justify-center text-[#111111] hover:bg-[#FEF2F2] hover:text-[#EF4444] transition-all active:scale-95 group">
            <X size={22} className="group-hover:rotate-90 transition-transform" />
          </button>
        </div>

        {/* Ticket Body - Cohesive Vertical Flow */}
        <div className="p-7 space-y-7 bg-white">
          
          {/* 1. Customer Context */}
          <div className="flex items-center gap-5 p-6 bg-[#F8F9FA] rounded-[32px] border border-[#ECEDEF]">
             <div className="w-14 h-14 rounded-[20px] bg-white border border-[#ECEDEF] flex items-center justify-center text-[#111111] font-black text-[22px]">
                {order.customer?.name?.charAt(0) || 'K'}
             </div>
             <div>
                <h3 className="text-[16px] font-black text-[#111111] tracking-tight">{order.customer?.name || order.customer}</h3>
                <p className="text-[9px] font-bold text-[#8B93A7] uppercase tracking-[0.1em]">Verified Business Account</p>
             </div>
          </div>

          {/* 2. The Boarding Pass (Tracking & Sharing) - Centerpiece */}
          <div className="rounded-[40px] bg-[#F1F3F5] border border-[#ECEDEF] overflow-hidden">
             <SharingHub order={order} />
          </div>

          {/* 3. Settlement Summary (The Stub) */}
          <div className="p-8 border-[1.5px] border-[#ECEDEF] border-dashed rounded-[36px] bg-white">
             <div className="flex items-center gap-3 mb-6">
                <Icon icon="solar:banknote-bold-duotone" className="text-[#D40073] text-[18px]" />
                <h4 className="text-[10px] font-black text-[#8B93A7] uppercase tracking-[0.3em]">Settlement Stub</h4>
             </div>
             <div className="flex justify-between items-end">
                <div className="space-y-4">
                   <div>
                      <p className="text-[9px] font-black text-[#8B93A7] uppercase tracking-widest mb-1">State</p>
                      <span className="text-[12px] font-black text-[#EF4444] uppercase tracking-widest">Unpaid</span>
                   </div>
                   <div>
                      <p className="text-[9px] font-black text-[#8B93A7] uppercase tracking-widest mb-1">Method</p>
                      <p className="text-[14px] font-bold text-[#111111]">Cash on Delivery</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-[#8B93A7] uppercase tracking-widest mb-1">Outstanding</p>
                   <p className="text-[24px] font-black text-[#D40073] tracking-tighter leading-none">GHS {Number(order.totalAmount || 850).toLocaleString('.2f')}</p>
                </div>
             </div>
          </div>

          {/* 4. Footer - Refined Branding */}
          <div className="flex items-center justify-center gap-4 pt-4 opacity-40">
             <p className="text-[9px] font-black text-[#8B93A7] uppercase tracking-[0.4em]">Rightech Core v2.4 Platform Eng.</p>
             <Icon icon="logos:rightech-icon" className="w-auto h-4" />
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
