import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from '@iconify/react';
import { Supplier } from '../context/SupplierContext';
import { useConsignment } from '../../consignment/context/ConsignmentContext';
import { ConsignmentItem } from '../../../core/data/consignmentData';
import { ConsignmentDetailsModal } from '../../consignment/components/ConsignmentDetailsModal';

interface SupplierConsignmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: Supplier | null;
}

export function SupplierConsignmentsModal({ isOpen, onClose, supplier }: SupplierConsignmentsModalProps) {
  const { inboundConsignments } = useConsignment();
  const [selectedConsignment, setSelectedConsignment] = useState<ConsignmentItem | null>(null);

  if (!supplier) return null;

  const supplierConsignments = inboundConsignments.filter(c => c.partnerId === supplier.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Shelf': return 'bg-[#16A34A] text-white';
      case 'Settled': return 'bg-[#2563EB] text-white';
      case 'Returned': return 'bg-[#DC2626] text-white';
      case 'In Transit': return 'bg-[#EA580C] text-white';
      default: return 'bg-[#525866] text-white';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            className="relative w-full max-w-[1000px] bg-white rounded-[32px] overflow-hidden flex flex-col max-h-[85vh] shadow-none border border-[#ECEDEF] font-['Manrope']"
          >
            {/* Header */}
            <div className="px-10 py-8 border-b border-[#ECEDEF] flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-[18px] bg-[#D40073] text-white flex items-center justify-center">
                  <Icon icon="solar:archive-bold" className="text-[32px]" />
                </div>
                <div>
                  <h2 className="text-[24px] font-black text-[#111111] tracking-tight">Consignment Archive</h2>
                  <p className="text-[14px] font-black uppercase tracking-widest text-[#8B93A7]">{supplier.name} • {supplierConsignments.length} Records</p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="w-12 h-12 rounded-full hover:bg-[#111111] hover:text-white flex items-center justify-center text-[#525866] border border-[#ECEDEF] transition-all active:scale-95"
              >
                <Icon icon="solar:close-square-bold" className="text-[26px]" />
              </button>
            </div>

            {/* Content - Table View */}
            <div className="flex-1 overflow-auto bg-[#FBFBFC]">
              <table className="w-full text-left border-separate border-spacing-0">
                <thead>
                  <tr className="sticky top-0 bg-[#F9FAFB] border-b border-[#ECEDEF] z-10">
                    <th className="py-5 px-10 text-[11px] font-black text-[#8B93A7] uppercase tracking-widest">Movement ID</th>
                    <th className="py-5 px-10 text-[11px] font-black text-[#8B93A7] uppercase tracking-widest">Description</th>
                    <th className="py-5 px-10 text-[11px] font-black text-[#8B93A7] uppercase tracking-widest">Date</th>
                    <th className="py-5 px-10 text-[11px] font-black text-[#8B93A7] uppercase tracking-widest">Status</th>
                    <th className="py-5 px-10 text-[11px] font-black text-[#8B93A7] uppercase tracking-widest text-right">Value</th>
                    <th className="py-5 px-10 text-[11px] font-black text-[#8B93A7] uppercase tracking-widest text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECEDEF]">
                  {supplierConsignments.map((c) => (
                    <tr key={c.id} className="hover:bg-white transition-colors group">
                      <td className="py-6 px-10">
                        <span className="text-[13px] font-black text-[#D40073]">{c.id}</span>
                      </td>
                      <td className="py-6 px-10">
                        <p className="text-[14px] font-black text-[#111111]">{c.name}</p>
                        <p className="text-[11px] font-black text-[#8B93A7] uppercase tracking-wider mt-1">{c.items.length} Products</p>
                      </td>
                      <td className="py-6 px-10">
                        <span className="text-[13px] font-black text-[#111111]">{c.date}</span>
                      </td>
                      <td className="py-6 px-10">
                        <span className={`px-2 py-1 rounded-[6px] text-[10px] font-black uppercase tracking-widest ${getStatusColor(c.status)}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-6 px-10 text-right">
                        <span className="text-[15px] font-black text-[#111111]">GHS {c.totalValue.toLocaleString()}</span>
                      </td>
                      <td className="py-6 px-10 text-center">
                        <button 
                          onClick={() => setSelectedConsignment(c)}
                          className="h-10 px-4 bg-[#111111] text-white text-[11px] font-black uppercase tracking-widest rounded-[10px] hover:bg-[#D40073] transition-all active:scale-95"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="px-10 py-8 border-t border-[#ECEDEF] bg-white flex items-center justify-between shrink-0">
               <div>
                  <p className="text-[11px] font-black text-[#8B93A7] uppercase tracking-widest mb-1">Total Account Value</p>
                  <p className="text-[22px] font-black text-[#111111]">GHS {supplierConsignments.reduce((acc, curr) => acc + curr.totalValue, 0).toLocaleString()}</p>
               </div>
               <button 
                 onClick={onClose}
                 className="h-12 px-10 bg-[#111111] text-white text-[13px] font-black uppercase tracking-widest rounded-[14px] hover:bg-[#333333] transition-all"
               >
                 Close Archive
               </button>
            </div>
          </motion.div>

          <ConsignmentDetailsModal 
            consignment={selectedConsignment}
            onClose={() => setSelectedConsignment(null)}
          />
        </div>
      )}
    </AnimatePresence>
  );
}
