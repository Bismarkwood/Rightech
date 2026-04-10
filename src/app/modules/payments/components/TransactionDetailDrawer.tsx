import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MoreVertical, CreditCard, Clock, Receipt, UserRound, ArrowRight, Printer, Flag, AlertCircle, Calendar, Hash, UserCircle } from 'lucide-react';
import { Icon } from '@iconify/react';
import { Dialog, DialogContent } from '../../../core/components/ui/dialog';
import { usePayments } from '../context/PaymentContext';

export function TransactionDetailDrawer() {
  const { transactions, selectedTransactionId, setSelectedTransactionId } = usePayments();
  const tx = transactions.find(t => t.id === selectedTransactionId);
  const isOpen = !!selectedTransactionId;
  const setIsOpen = (open: boolean) => {
    if (!open) setSelectedTransactionId(null);
  };

  if (!tx) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] sm:max-w-[540px] max-h-[90vh] p-0 rounded-[32px] border border-[#ECEDEF] dark:border-white/10 bg-white dark:bg-[#151B2B] shadow-2xl outline-none overflow-hidden flex flex-col z-50">
        
        {/* Header Block */}
        <div className="p-6 border-b border-[#ECEDEF] dark:border-white/5 flex items-center justify-between shrink-0 bg-white dark:bg-[#151B2B] z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsOpen(false)} className="w-10 h-10 rounded-full border border-[#ECEDEF] dark:border-white/10 flex items-center justify-center text-[#525866] dark:text-[#8B93A7] hover:bg-[#F3F4F6] dark:hover:bg-white/5 transition-colors">
              <Icon icon="solar:close-circle-linear" className="text-[20px]" />
            </button>
            <div>
              <div className="text-[11px] font-black text-[#8B93A7] uppercase tracking-widest mb-0.5">Transaction Ledger</div>
              <div className="text-[18px] font-black text-[#111111] dark:text-white uppercase tracking-tight italic">{tx.id}</div>
            </div>
          </div>
          <button className="w-10 h-10 rounded-full border border-[#ECEDEF] dark:border-white/10 flex items-center justify-center text-[#525866] dark:text-[#8B93A7] hover:bg-[#F3F4F6] dark:hover:bg-white/5">
            <Icon icon="solar:menu-dots-bold" className="text-[18px]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-10 bg-white dark:bg-[#151B2B]">
          
          {/* Main Info Block */}
          <section className="text-center pb-8 border-b border-[#ECEDEF] dark:border-white/5">
             <div className={`w-16 h-16 rounded-[20px] mx-auto mb-4 flex items-center justify-center ${
               tx.direction === 'in' ? 'bg-[#16A34A] text-white' : 'bg-[#EF4444] text-white'
             }`}>
               {tx.direction === 'in' ? <Receipt size={32} /> : <CreditCard size={32} />}
             </div>
              <div className="text-[11px] font-black text-[#8B93A7] uppercase tracking-widest mb-1 italic opacity-80">{tx.type}</div>
              <div className="text-[36px] font-black text-[#111111] dark:text-white tracking-tighter italic">GHS {tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
              <div className={`mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-[6px] text-[11px] font-black uppercase tracking-wider border shadow-sm ${
                tx.status === 'Completed' ? 'bg-[#ECFDF5] dark:bg-[#064E3B]/30 text-[#16A34A] border-[#16A34A]/10' : 'bg-[#FFFBEB] dark:bg-[#78350F]/30 text-[#D97706] border-[#D97706]/10'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${tx.status === 'Completed' ? 'bg-[#16A34A]' : 'bg-[#D97706]'}`} />
                {tx.status}
              </div>
           </section>

          {/* Details Grid */}
          <section>
            <h3 className="text-[12px] font-black text-[#8B93A7] uppercase tracking-widest mb-6 border-b border-[#ECEDEF] dark:border-white/5 pb-2">Technical Summary</h3>
            <div className="grid grid-cols-2 gap-y-8">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-black text-[#8B93A7] uppercase tracking-wider mb-1">
                  <Clock size={12} /> Date & Time
                </div>
                <div className="text-[14px] font-bold text-[#111111]">
                  {new Date(tx.timestamp).toLocaleDateString()} · {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-[11px] font-black text-[#8B93A7] uppercase tracking-wider mb-1">
                  <CreditCard size={12} /> Method
                </div>
                <div className="text-[14px] font-bold text-[#111111]">{tx.method}</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-[11px] font-black text-[#8B93A7] uppercase tracking-wider mb-1">
                  <Hash size={12} /> Reference
                </div>
                <div className="text-[14px] font-bold text-[#111111]">{tx.reference || 'None'}</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-[11px] font-black text-[#8B93A7] uppercase tracking-wider mb-1">
                  <UserCircle size={12} /> Recorded By
                </div>
                <div className="text-[14px] font-black text-[#111111] dark:text-white uppercase tracking-tight">{tx.recordedBy}</div>
              </div>
            </div>
          </section>

          {/* Context Block */}
          <section className="bg-[#FBFBFC] dark:bg-white/5 rounded-[24px] p-6 border border-[#ECEDEF] dark:border-white/10">
             <h3 className="text-[11px] font-black text-[#8B93A7] uppercase tracking-widest mb-5">Enterprise Traceability</h3>
             <div className="space-y-4">
                <button className="w-full flex items-center justify-between p-4 bg-white dark:bg-[#151B2B] rounded-[16px] border border-[#ECEDEF] dark:border-white/10 hover:border-[#D40073] group transition-all shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[12px] bg-[#D40073]/10 text-[#D40073] flex items-center justify-center font-black">RT</div>
                    <div className="text-left">
                      <div className="text-[11px] font-black text-[#8B93A7] uppercase tracking-widest mb-0.5">Sales Order</div>
                      <div className="text-[14px] font-black text-[#111111] dark:text-white uppercase tracking-tight group-hover:text-[#D40073] transition-colors">{tx.linkedId}</div>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-[#8B93A7] group-hover:translate-x-1 group-hover:text-[#D40073] transition-all" />
                </button>

                <button className="w-full flex items-center justify-between p-4 bg-white dark:bg-[#151B2B] rounded-[16px] border border-[#ECEDEF] dark:border-white/10 hover:border-[#111111] dark:hover:border-white transition-all group shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[12px] bg-[#F3F4F6] dark:bg-white/5 text-[#111111] dark:text-white flex items-center justify-center font-black">{tx.party.charAt(0)}</div>
                    <div className="text-left">
                      <div className="text-[11px] font-black text-[#8B93A7] uppercase tracking-widest mb-0.5">{tx.partyType} Account</div>
                      <div className="text-[14px] font-black text-[#111111] dark:text-white uppercase tracking-tight transition-colors">{tx.party}</div>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-[#8B93A7] group-hover:translate-x-1 group-hover:text-[#111111] dark:group-hover:text-white transition-all" />
                </button>
             </div>
          </section>

          {/* Notes Block */}
          {tx.notes && (
            <section>
              <h3 className="text-[12px] font-black text-[#8B93A7] uppercase tracking-widest mb-3">Auditor Notes</h3>
              <div className="p-4 bg-[#FFFBEB] border border-[#FEF3C7] rounded-[16px] text-[13px] font-medium text-[#92400E]">
                {tx.notes}
              </div>
            </section>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-[#ECEDEF] dark:border-white/5 bg-white dark:bg-[#151B2B] flex gap-3 shrink-0">
          <button className="flex-1 h-12 rounded-[16px] bg-[#111111] dark:bg-[#D40073] text-white text-[14px] font-black flex items-center justify-center gap-2 hover:bg-black dark:hover:bg-[#D40073]/90 transition-all active:scale-95 shadow-lg shadow-black/10">
            <Icon icon="solar:printer-bold" className="text-[20px]" />
            PRINT RECEIPT
          </button>
          <button className="w-12 h-12 rounded-[16px] bg-[#F3F4F6] dark:bg-white/5 text-[#525866] dark:text-[#8B93A7] flex items-center justify-center hover:text-[#EF4444] hover:bg-[#FEF2F2] dark:hover:bg-[#EF4444]/10 transition-colors border border-transparent hover:border-[#EF4444]/20">
            <Icon icon="solar:flag-bold" className="text-[20px]" />
          </button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
