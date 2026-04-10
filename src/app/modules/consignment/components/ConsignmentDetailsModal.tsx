import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from '@iconify/react';
import { ConsignmentItem } from '../../../core/data/consignmentData';

interface ConsignmentDetailsModalProps {
  consignment: ConsignmentItem | null;
  onClose: () => void;
  onDelete?: (id: string) => void;
}

export function ConsignmentDetailsModal({ consignment, onClose, onDelete }: ConsignmentDetailsModalProps) {
  if (!consignment) return null;

  return (
    <AnimatePresence>
      {consignment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-[700px] bg-white rounded-[32px] overflow-hidden flex flex-col max-h-[90vh] border border-white/20 shadow-2xl font-['Manrope']"
          >
            {/* Header */}
            <div className="px-10 py-8 border-b border-[#ECEDEF] flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-[18px] flex items-center justify-center ${
                  consignment.type === 'Inbound' ? 'bg-[#2563EB] text-white' : 'bg-[#EA580C] text-white'
                }`}>
                  <Icon icon={consignment.type === 'Inbound' ? 'solar:import-bold' : 'solar:export-bold'} className="text-[28px]" />
                </div>
                <div>
                  <h2 className="text-[22px] font-black text-[#111111] tracking-tight">{consignment.name}</h2>
                  <p className="text-[13px] text-[#8B93A7] font-bold uppercase tracking-wider">{consignment.id} • {consignment.date}</p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="w-11 h-11 rounded-full hover:bg-[#F3F4F6] flex items-center justify-center text-[#525866] border border-[#ECEDEF] transition-all active:scale-95"
              >
                <Icon icon="solar:close-square-bold" className="text-[22px]" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
              {/* Stats Overview */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-[24px] bg-[#F9FAFB] border border-[#ECEDEF]">
                  <p className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider mb-2">Partner Details</p>
                  <p className="text-[15px] font-black text-[#111111]">{consignment.partnerName}</p>
                  <p className="text-[13px] font-medium text-[#525866] mt-0.5">{consignment.type === 'Inbound' ? 'Supply Partner' : 'Official Dealer'}</p>
                </div>
                <div className="p-5 rounded-[24px] bg-[#F9FAFB] border border-[#ECEDEF]">
                  <p className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider mb-2">Consignment Status</p>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest ${
                      consignment.status === 'Settled' ? 'bg-[#16A34A] text-white' : 
                      consignment.status === 'In Transit' ? 'bg-[#2563EB] text-white' : 'bg-[#EA580C] text-white'
                    }`}>
                      {consignment.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Inventory List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[16px] font-black text-[#111111] flex items-center gap-2">
                    <Icon icon="solar:box-bold" className="text-[#D40073]" />
                    Inventory List
                  </h3>
                  <span className="text-[12px] font-bold text-[#8B93A7] uppercase">{consignment.items.length} Products</span>
                </div>
                <div className="space-y-3">
                  {consignment.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-white border border-[#ECEDEF] rounded-[20px] group transition-colors hover:border-[#111111]/10">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[12px] bg-[#F3F4F6] overflow-hidden">
                          {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <div>
                          <p className="text-[14px] font-bold text-[#111111]">{item.productName}</p>
                          <p className="text-[11px] font-medium text-[#8B93A7] uppercase tracking-wider">{item.sku} • {item.suppliedQty} units</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[15px] font-black text-[#111111]">GHS {item.unitPrice.toLocaleString()}</p>
                        <p className="text-[11px] font-black text-[#16A34A] uppercase tracking-widest leading-none mt-1">{item.soldQty} SOLD</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {consignment.location && (
                <div className="p-6 rounded-[24px] bg-[#F9FAFB] border border-[#ECEDEF] space-y-2">
                  <p className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider">Destination / Pickup Point</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#D40073] flex items-center justify-center text-white">
                      <Icon icon="solar:map-point-bold" className="text-[16px]" />
                    </div>
                    <p className="text-[14px] font-black text-[#111111]">{consignment.location}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-10 py-8 border-t border-[#ECEDEF] bg-[#F9FAFB] flex items-center justify-between shrink-0">
              <div>
                <p className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider mb-1">Total Valuation</p>
                <p className="text-[26px] font-black text-[#111111] tracking-tight leading-none">GHS {consignment.totalValue.toLocaleString()}</p>
              </div>
              <div className="flex gap-3">
                {onDelete && (
                  <button 
                    onClick={() => onDelete(consignment.id)}
                    className="h-12 px-6 rounded-[16px] bg-[#FEE2E2] text-[#DC2626] font-black text-[13px] uppercase tracking-wider hover:bg-[#FCA5A5] hover:text-white transition-all flex items-center gap-2 active:scale-95"
                  >
                    <Icon icon="solar:trash-bin-trash-bold" />
                    Discard
                  </button>
                )}
                <button 
                  className="h-12 px-8 rounded-[16px] bg-[#111111] text-white font-black text-[13px] uppercase tracking-wider hover:bg-[#333333] transition-all active:scale-95 shadow-lg shadow-black/10"
                >
                  <Icon icon="solar:file-download-bold" className="mr-2" />
                  Export PDF
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
