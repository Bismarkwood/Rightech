import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from '@iconify/react';
import { X, Search, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useCredit } from '../context/CreditContext';

interface CreditExtensionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreditExtensionModal({ isOpen, onClose }: CreditExtensionModalProps) {
  const { accounts } = useCredit();
  const [search, setSearch] = useState('');
  const [selectedDealer, setSelectedDealer] = useState<any | null>(null);
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');

  const filteredDealers = accounts.filter(acc => 
    acc.dealerName.toLowerCase().includes(search.toLowerCase()) || 
    acc.dealerId.toLowerCase().includes(search.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-[560px] bg-white rounded-[32px] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="p-8 border-b border-[#ECEDEF] flex items-center justify-between">
            <div>
              <h2 className="text-[22px] font-black text-[#111111]">Extend Credit Limit</h2>
              <p className="text-[14px] font-medium text-[#8B93A7] mt-1">Review scoring and extend dealer buying power.</p>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-[#F3F4F6] flex items-center justify-center transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 no-scrollbar space-y-8">
            {/* Dealer Selection */}
            {!selectedDealer ? (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B93A7]" size={20} />
                  <input 
                    type="text" 
                    placeholder="Search dealer by name or ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 bg-[#F3F4F6] border-none rounded-[18px] text-[15px] font-bold focus:ring-2 focus:ring-[#D40073]/20 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  {filteredDealers.map(acc => (
                    <button 
                      key={acc.id}
                      onClick={() => setSelectedDealer(acc)}
                      className="w-full p-4 bg-white border border-[#ECEDEF] rounded-[20px] hover:border-[#D40073] hover:bg-[#D40073]/5 transition-all text-left flex items-center justify-between group"
                    >
                      <div>
                        <div className="text-[15px] font-black text-[#111111]">{acc.dealerName}</div>
                        <div className="text-[12px] font-bold text-[#8B93A7]">Current: GHS {acc.creditLimit.toLocaleString()}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          acc.band === 'Excellent' ? 'bg-[#16A34A]/10 text-[#16A34A]' : 'bg-[#EF4444]/10 text-[#EF4444]'
                        }`}>
                          {acc.band} {acc.score}
                        </span>
                        <Icon icon="solar:alt-arrow-right-linear" className="text-[18px] text-[#8B93A7] group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Selected Dealer Profile */}
                <div className="p-6 bg-[#F9FAFB] rounded-[24px] border border-[#ECEDEF] flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-[14px] bg-[#111111] text-white flex items-center justify-center font-black text-[18px]">
                      {selectedDealer.dealerName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-[16px] font-black text-[#111111]">{selectedDealer.dealerName}</div>
                      <div className="text-[13px] font-medium text-[#525866]">{selectedDealer.dealerId}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedDealer(null)}
                    className="text-[13px] font-black text-[#D40073] hover:underline"
                  >
                    Change Dealer
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[12px] font-black text-[#8B93A7] uppercase tracking-wider ml-1">Current Limit</label>
                    <div className="h-14 px-4 flex items-center bg-[#F3F4F6] rounded-[18px] text-[15px] font-black text-[#8B93A7]">
                      GHS {selectedDealer.creditLimit.toLocaleString()}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[12px] font-black text-[#111111] uppercase tracking-wider ml-1">New Limit Amount</label>
                    <input 
                      type="number" 
                      placeholder="Enter amount..."
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full h-14 px-4 bg-white border border-[#ECEDEF] rounded-[18px] text-[15px] font-black focus:border-[#D40073] focus:ring-4 focus:ring-[#D40073]/5 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[12px] font-black text-[#111111] uppercase tracking-wider ml-1">Extension Reason</label>
                  <textarea 
                    placeholder="Briefly explain why this extension is being granted..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full h-32 p-4 bg-white border border-[#ECEDEF] rounded-[18px] text-[14px] font-medium focus:border-[#D40073] outline-none transition-all resize-none"
                  />
                </div>

                {selectedDealer.score < 60 ? (
                  <div className="p-4 bg-[#EF4444]/5 border border-[#EF4444]/20 rounded-[18px] flex gap-3">
                    <AlertTriangle className="text-[#EF4444] shrink-0" size={18} />
                    <p className="text-[12px] font-medium text-[#EF4444] leading-relaxed">
                      This dealer has a <strong>{selectedDealer.band}</strong> rating. Extending credit to low-scoring dealers increases business risk and may require additional collateral.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-[#16A34A]/5 border border-[#16A34A]/20 rounded-[18px] flex gap-3">
                    <ShieldCheck className="text-[#16A34A] shrink-0" size={18} />
                    <p className="text-[12px] font-medium text-[#16A34A] leading-relaxed">
                      Approved extension for high-trust dealer. This will automatically update their purchasing power across the storefront and POS.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-8 border-t border-[#ECEDEF] bg-[#F9FAFB] flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 h-14 bg-white border border-[#ECEDEF] text-[#111111] rounded-[18px] text-[15px] font-black hover:bg-[#F9FAFB] transition-all"
            >
              Cancel
            </button>
            <button 
              disabled={!selectedDealer || !amount}
              className="flex-1 h-14 bg-[#111111] text-white rounded-[18px] text-[15px] font-black hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xl shadow-black/10"
            >
              Approve Extension
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
