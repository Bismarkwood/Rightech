import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dialog, DialogContent } from '../../../core/components/ui/dialog';
import { SharingHub } from './SharingHub';
import { X, Share2 } from 'lucide-react';
import { Icon } from '@iconify/react';

interface SharingModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any | null;
}

export function SharingModal({ isOpen, onClose, order }: SharingModalProps) {
  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent 
        className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-[100] w-[540px] bg-white rounded-[40px] border border-[#ECEDEF] shadow-[0_40px_100px_rgba(0,0,0,0.15)] overflow-hidden p-0 outline-none"
      >
        <div className="relative p-10 flex flex-col items-center">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-10 w-full relative">
            <div className="w-16 h-16 rounded-[24px] bg-[#D40073]/5 flex items-center justify-center text-[#D40073] border border-[#D40073]/10 mb-6 shadow-sm">
              <Share2 size={32} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-[24px] font-black text-[#111111] leading-none tracking-tight mb-2">Share Tracking</h2>
              <div className="flex items-center justify-center gap-2">
                <span className="text-[13px] font-black text-[#8B93A7] uppercase tracking-widest">Live Logistics</span>
                <div className="w-1.5 h-1.5 rounded-full bg-[#ECEDEF]" />
                <span className="text-[13px] font-black text-[#D40073] uppercase tracking-widest">Ready to Send</span>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="w-full">
            <SharingHub order={order} />
          </div>

          <div className="mt-8 py-4 px-8 bg-[#F8F9FA] rounded-full flex items-center gap-3">
            <Icon icon="solar:info-circle-bold-duotone" className="text-[#D40073] text-[20px]" />
            <p className="text-[12px] text-[#8B93A7] font-black uppercase tracking-widest">
              Link active for 24h • No account required
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
