import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from '@iconify/react';
import { X, CheckCircle2, AlertCircle, Ban, Mail, Phone, ChevronLeft, ChevronRight, ShieldCheck, Star } from 'lucide-react';
import { useSuppliers, Supplier, VettingStatus } from '../context/SupplierContext';

interface SupplierVettingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SupplierVettingModal({ isOpen, onClose }: SupplierVettingModalProps) {
  const { suppliers, updateSupplierStatus } = useSuppliers();
  
  // Filter for suppliers that actually need vetting (Pending or recently changed)
  // For this UI, we'll just show all but prioritize Pending
  const vettingList = useMemo(() => {
    return [...suppliers].sort((a, b) => {
      if (a.status === 'Pending' && b.status !== 'Pending') return -1;
      if (a.status !== 'Pending' && b.status === 'Pending') return 1;
      return 0;
    });
  }, [suppliers]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const selectedSupplier = vettingList[currentIndex];

  const handleAction = (status: VettingStatus) => {
    if (selectedSupplier) {
      updateSupplierStatus(selectedSupplier.id, status);
      // Automatically move to next if pending
      if (currentIndex < vettingList.length - 1) {
        // Optional: stay on same if user wants to see result, but Hub suggests "processing"
        // Let's stay for feedback but provide a "Next" hint
      }
    }
  };

  const nextSupplier = () => {
    setCurrentIndex((prev) => (prev + 1) % vettingList.length);
  };

  const prevSupplier = () => {
    setCurrentIndex((prev) => (prev - 1 + vettingList.length) % vettingList.length);
  };

  const getStatusConfig = (status: VettingStatus) => {
    switch (status) {
      case 'Verified': return { color: 'text-[#16A34A]', bg: 'bg-[#16A34A]/10', icon: 'solar:verified-check-bold' };
      case 'Pending': return { color: 'text-[#D97706]', bg: 'bg-[#D97706]/10', icon: 'solar:clock-circle-bold' };
      case 'Rejected': return { color: 'text-[#DC2626]', bg: 'bg-[#DC2626]/10', icon: 'solar:bill-cross-bold' };
      case 'Blacklisted': return { color: 'text-white', bg: 'bg-[#111111]', icon: 'solar:shield-warning-bold' };
      default: return { color: 'text-[#525866]', bg: 'bg-[#F3F4F6]', icon: 'solar:question-square-bold' };
    }
  };

  const config = selectedSupplier ? getStatusConfig(selectedSupplier.status) : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-['Manrope']">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="relative w-full max-w-[540px] bg-[#F7F7F8] rounded-[32px] overflow-hidden flex flex-col border border-[#ECEDEF]"
          >
            {/* Elegant Header with Selector */}
            <div className="px-6 pt-6 pb-4 bg-white border-b border-[#ECEDEF] shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-[12px] bg-[#111111] text-white flex items-center justify-center">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h2 className="text-[17px] font-bold text-[#111111] tracking-tight">Vetting Hub</h2>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8B93A7]">Risk Assessment</p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="w-9 h-9 rounded-full hover:bg-[#F3F4F6] flex items-center justify-center text-[#8B93A7] transition-all active:scale-90"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Supplier Navigator */}
              <div className="flex items-center justify-between bg-[#F7F7F8] rounded-[16px] p-1.5 border border-[#ECEDEF]">
                 <button 
                    onClick={prevSupplier}
                    className="w-9 h-9 rounded-[10px] bg-white border border-[#ECEDEF] flex items-center justify-center text-[#111111] hover:bg-[#F3F4F6] transition-all disabled:opacity-30"
                    disabled={vettingList.length <= 1}
                 >
                    <ChevronLeft size={16} />
                 </button>
                 
                 <div className="flex-1 px-3 text-center">
                    <p className="text-[13px] font-bold text-[#111111] truncate leading-tight">
                        {selectedSupplier?.name || "No Suppliers Found"}
                    </p>
                    <p className="text-[9px] font-semibold text-[#8B93A7] uppercase tracking-widest mt-0.5">
                        {currentIndex + 1} of {vettingList.length} Partners
                    </p>
                 </div>

                 <button 
                    onClick={nextSupplier}
                    className="w-9 h-9 rounded-[10px] bg-white border border-[#ECEDEF] flex items-center justify-center text-[#111111] hover:bg-[#F3F4F6] transition-all disabled:opacity-30"
                    disabled={vettingList.length <= 1}
                 >
                    <ChevronRight size={16} />
                 </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 no-scrollbar">
              {selectedSupplier ? (
                <motion.div
                  key={selectedSupplier.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-5"
                >
                  {/* Status & ID Badge */}
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-[#8B93A7] uppercase tracking-widest bg-white px-2.5 py-1 rounded-[6px] border border-[#ECEDEF]">
                            ID: {selectedSupplier.id}
                        </span>
                     </div>
                     <div className={`flex items-center gap-2 px-2.5 py-1 rounded-[8px] font-bold text-[10px] uppercase tracking-wider ${config?.bg} ${config?.color} border border-current/10`}>
                        <Icon icon={config?.icon || ""} className="text-[12px]" />
                        {selectedSupplier.status}
                     </div>
                  </div>

                  {/* Profile Section */}
                  <div className="bg-white rounded-[24px] p-5 border border-[#ECEDEF]">
                    <div className="flex items-center gap-4 mb-5">
                        <div className="w-12 h-12 rounded-[16px] bg-[#111111] text-white flex items-center justify-center text-[20px] font-bold">
                            {selectedSupplier.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="text-[18px] font-bold text-[#111111] tracking-tight leading-tight">{selectedSupplier.name}</h3>
                            <p className="text-[12px] font-semibold text-[#8B93A7] mt-0.5 uppercase tracking-wider">{selectedSupplier.category}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-0.5">
                            <p className="text-[9px] font-bold text-[#8B93A7] uppercase tracking-widest">Email</p>
                            <div className="flex items-center gap-2 text-[#111111]">
                                <Mail size={11} className="text-[#8B93A7]" />
                                <span className="text-[12px] font-semibold truncate">{selectedSupplier.email}</span>
                            </div>
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-[9px] font-bold text-[#8B93A7] uppercase tracking-widest">Phone</p>
                            <div className="flex items-center gap-2 text-[#111111]">
                                <Phone size={11} className="text-[#8B93A7]" />
                                <span className="text-[12px] font-semibold">{selectedSupplier.phone}</span>
                            </div>
                        </div>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#FBFBFC] p-4 rounded-[20px] border border-[#ECEDEF] flex flex-col items-center text-center">
                        <div className="w-7 h-7 rounded-full bg-[#ECFDF5] text-[#10B981] flex items-center justify-center mb-1.5 border border-[#10B981]/10">
                             <Icon icon="solar:box-minimalistic-bold" className="text-[15px]" />
                        </div>
                        <p className="text-[18px] font-bold text-[#111111]">{selectedSupplier.totalConsignments}</p>
                        <p className="text-[9px] font-bold text-[#8B93A7] uppercase tracking-widest mt-0.5">Shipments</p>
                    </div>
                    <div className="bg-[#FBFBFC] p-4 rounded-[20px] border border-[#ECEDEF] flex flex-col items-center text-center">
                        <div className="w-7 h-7 rounded-full bg-[#F5F3FF] text-[#8B5CF6] flex items-center justify-center mb-1.5 border border-[#8B5CF6]/10">
                             <Star size={14} fill="currentColor" />
                        </div>
                        <p className="text-[18px] font-bold text-[#111111]">{selectedSupplier.rating.toFixed(1)}</p>
                        <p className="text-[9px] font-bold text-[#8B93A7] uppercase tracking-widest mt-0.5">Trust Score</p>
                    </div>
                  </div>

                  {/* Final Actions */}
                  <div className="pt-2 space-y-3">
                    <button 
                         onClick={() => handleAction('Verified')}
                         className="w-full h-14 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-[18px] flex items-center justify-center gap-3 transition-all active:scale-[0.98] group"
                    >
                        <CheckCircle2 size={20} className="group-hover:scale-110 transition-transform" />
                        <span className="text-[14px] font-bold uppercase tracking-widest">Verify Partner</span>
                    </button>

                    <div className="grid grid-cols-2 gap-3">
                        <button 
                            onClick={() => handleAction('Rejected')}
                            className="h-12 bg-white border border-[#ECEDEF] hover:bg-[#FFFBEB] hover:border-[#FCD34D] text-[#D97706] rounded-[16px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] group font-bold text-[11px] uppercase tracking-widest"
                        >
                            <AlertCircle size={16} className="group-hover:rotate-12 transition-transform" />
                            Reject
                        </button>
                        <button 
                            onClick={() => handleAction('Blacklisted')}
                            className="h-12 bg-[#111111] hover:bg-black text-white rounded-[16px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] group font-bold text-[11px] uppercase tracking-widest"
                        >
                            <Ban size={16} className="group-hover:scale-110 transition-transform" />
                            Blacklist
                        </button>
                    </div>

                    <button 
                        onClick={() => handleAction('Pending')}
                        className="w-full py-2 text-[10px] font-bold text-[#8B93A7] uppercase tracking-[0.2em] hover:text-[#111111] transition-colors"
                    >
                        Reset Status to Pending
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="h-[250px] flex flex-col items-center justify-center text-center space-y-3">
                     <div className="w-14 h-14 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#8B93A7] border border-[#ECEDEF]">
                        <Icon icon="solar:users-group-two-rounded-linear" className="text-[28px]" />
                     </div>
                     <div>
                        <p className="text-[15px] font-bold text-[#111111]">Queue Empty</p>
                        <p className="text-[12px] font-semibold text-[#8B93A7]">All active partners have been vetted.</p>
                     </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
