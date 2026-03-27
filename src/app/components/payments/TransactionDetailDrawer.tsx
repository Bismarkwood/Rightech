import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MoreVertical, CreditCard, Clock, Receipt, UserRound, ArrowRight, Printer, Flag, AlertCircle, Calendar, Hash, UserCircle } from 'lucide-react';
import { Icon } from '@iconify/react';
import { Dialog, DialogContent } from "../ui/dialog";
import { usePayments } from '../../context/PaymentContext';

export function TransactionDetailDrawer() {
  // In a real app we'd get the selected ID from context
  // For demo, we'll just show the UI for "RT-PAY-001" or stay closed
  const [isOpen, setIsOpen] = React.useState(false);
  
  // Expose this globally via a custom hook or dispatch if needed, 
  // but for this phase we simulate opening the first mock entry.
  const { transactions } = usePayments();
  const tx = transactions[0];

  if (!tx) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="absolute right-0 top-0 bottom-0 h-screen w-full sm:max-w-[480px] p-0 rounded-none border-l border-[#ECEDEF] bg-white translate-x-0 outline-none overflow-hidden flex flex-col">
        
        {/* Header Block */}
        <div className="p-8 border-b border-[#ECEDEF] flex items-center justify-between shrink-0 bg-white z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsOpen(false)} className="w-10 h-10 rounded-full border border-[#ECEDEF] flex items-center justify-center text-[#525866] hover:bg-[#F3F4F6] transition-colors">
              <X size={18} />
            </button>
            <div>
              <div className="text-[12px] font-black text-[#8B93A7] uppercase tracking-wider mb-0.5">Transaction ID</div>
              <div className="text-[18px] font-black text-[#111111]">{tx.id}</div>
            </div>
          </div>
          <button className="w-10 h-10 rounded-full border border-[#ECEDEF] flex items-center justify-center text-[#525866] hover:bg-[#F3F4F6]">
            <MoreVertical size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-10">
          
          {/* Main Info Block */}
          <section className="text-center pb-8 border-b border-[#F1F3F5]">
             <div className={`w-16 h-16 rounded-[20px] mx-auto mb-4 flex items-center justify-center ${
               tx.direction === 'in' ? 'bg-[#16A34A] text-white' : 'bg-[#EF4444] text-white'
             }`}>
               {tx.direction === 'in' ? <Receipt size={32} /> : <CreditCard size={32} />}
             </div>
             <div className="text-[14px] font-bold text-[#8B93A7] mb-1">{tx.type}</div>
             <div className="text-[32px] font-black text-[#111111]">GHS {tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
             <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-[#16A34A]/10 text-[#16A34A] rounded-full text-[13px] font-bold">
               <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
               {tx.status}
             </div>
          </section>

          {/* Details Grid */}
          <section>
            <h3 className="text-[12px] font-black text-[#8B93A7] uppercase tracking-widest mb-6 border-b border-[#F1F3F5] pb-2">Technical Details</h3>
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
                <div className="text-[14px] font-bold text-[#111111]">{tx.recordedBy}</div>
              </div>
            </div>
          </section>

          {/* Context Block */}
          <section className="bg-[#FAFBFC] rounded-[24px] p-6 border border-[#ECEDEF]">
             <h3 className="text-[12px] font-black text-[#8B93A7] uppercase tracking-widest mb-5">Linked Objects</h3>
             <div className="space-y-4">
                <button className="w-full flex items-center justify-between p-4 bg-white rounded-[16px] border border-[#ECEDEF] hover:border-[#D40073]/40 group transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[12px] bg-[#D40073]/5 text-[#D40073] flex items-center justify-center font-black">RT</div>
                    <div className="text-left">
                      <div className="text-[13px] font-bold text-[#111111]">Sales Order</div>
                      <div className="text-[12px] font-medium text-[#8B93A7]">{tx.linkedId}</div>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-[#8B93A7] group-hover:translate-x-1 group-hover:text-[#D40073] transition-all" />
                </button>

                <button className="w-full flex items-center justify-between p-4 bg-white rounded-[16px] border border-[#ECEDEF] hover:border-[#111111]/40 group transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[12px] bg-[#F3F4F6] text-[#111111] flex items-center justify-center font-black">{tx.party.charAt(0)}</div>
                    <div className="text-left">
                      <div className="text-[13px] font-bold text-[#111111]">{tx.partyType} Account</div>
                      <div className="text-[12px] font-medium text-[#8B93A7]">{tx.party}</div>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-[#8B93A7] group-hover:translate-x-1 group-hover:text-[#111111] transition-all" />
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
        <div className="p-8 border-t border-[#ECEDEF] bg-white flex gap-3 shrink-0">
          <button className="flex-1 h-12 rounded-[14px] bg-[#111111] text-white text-[14px] font-black flex items-center justify-center gap-2 hover:bg-black transition-colors">
            <Printer size={16} />
            Print Receipt
          </button>
          <button className="w-12 h-12 rounded-[14px] bg-[#F3F4F6] text-[#525866] flex items-center justify-center hover:text-[#EF4444] hover:bg-[#FEF2F2] transition-colors">
            <Flag size={18} />
          </button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
