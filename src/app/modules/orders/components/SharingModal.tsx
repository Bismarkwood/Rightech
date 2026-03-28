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
        className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-[100] w-[460px] bg-white rounded-[32px] border border-[#ECEDEF] shadow-[0_32px_80px_rgba(0,0,0,0.15)] overflow-hidden p-0 pointer-events-auto outline-none"
      >
        <div className="relative p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-[18px] bg-[#D40073]/5 flex items-center justify-center text-[#D40073]">
                <Share2 size={24} />
              </div>
              <div>
                <h2 className="text-[20px] font-black text-[#111111] leading-none tracking-tight mb-1.5">Share Tracking Link</h2>
                <p className="text-[13px] font-medium text-[#8B93A7]">Order {order.id} · Simulation Active</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center text-[#8B93A7] hover:bg-[#F3F4F6] transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="bg-[#FAFBFC] rounded-[24px] border border-[#ECEDEF] p-1 mb-2">
            <SharingHub order={order} />
          </div>

          <p className="text-[12px] text-center text-[#8B93A7] font-medium px-4 mt-6">
            Recipients can view the live delivery progress on any mobile or desktop browser without logging in.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
