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
        <div className="relative p-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-[20px] bg-[#D40073]/5 flex items-center justify-center text-[#D40073] border border-[#D40073]/10">
                <Share2 size={28} strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-[22px] font-black text-[#111111] leading-none tracking-tight mb-2">Share Tracking</h2>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-[#8B93A7]">Simulation Platform</span>
                  <div className="w-1 h-1 rounded-full bg-[#ECEDEF]" />
                  <span className="text-[13px] font-bold text-[#D40073]">Ready to Send</span>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center text-[#8B93A7] hover:bg-[#F3F4F6] hover:text-[#111111] transition-all"
            >
              <X size={22} strokeWidth={2.5} />
            </button>
          </div>

          {/* Body */}
          <SharingHub order={order} />

          <p className="text-[12px] text-center text-[#8B93A7] font-semibold px-6 mt-10 leading-relaxed">
            Recipients can view the live delivery progress on any device without an account.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
