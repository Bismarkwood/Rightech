import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dialog, DialogContent } from '../../../core/components/ui/dialog';
import { SharingHub } from './SharingHub';
import { X, Share2 } from 'lucide-react';

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
        className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-[100] w-[480px] bg-white rounded-[32px] border border-[#ECEDEF] shadow-[0_32px_80px_rgba(0,0,0,0.22)] overflow-hidden p-0 outline-none"
      >
        <div className="relative p-10 flex flex-col items-center">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8 w-full">
            <div className="w-14 h-14 rounded-[20px] bg-[#D40073]/5 flex items-center justify-center text-[#D40073] border border-[#D40073]/10 mb-5">
              <Share2 size={28} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-[20px] font-black text-[#111111] leading-none tracking-tight mb-2">Share Tracking</h2>
              <div className="flex items-center justify-center gap-2">
                <span className="text-[12px] font-bold text-[#8B93A7]">Live Logistics</span>
                <div className="w-1 h-1 rounded-full bg-[#ECEDEF]" />
                <span className="text-[12px] font-bold text-[#D40073]">Ready to Send</span>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="w-full">
            <SharingHub order={order} />
          </div>

          <p className="text-[12px] text-center text-[#8B93A7] font-semibold px-6 mt-10 leading-relaxed">
            Recipients can view the live delivery progress on any device without an account.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
