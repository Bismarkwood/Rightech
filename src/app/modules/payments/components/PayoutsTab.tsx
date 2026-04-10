import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from '@iconify/react';
import { usePayments } from '../context/PaymentContext';
import { Plus, Check, Clock, ExternalLink } from 'lucide-react';
import { RecordPayoutModal } from './RecordPayoutModal';

export function PayoutsTab() {
  const { transactions } = usePayments();
  const [selectedSupplier, setSelectedSupplier] = useState('ShenzhenTech Co.');
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  const suppliers = ['ShenzhenTech Co.', 'Dangote Cement Ghana', 'GHL Steel Works'];
  
  const supplierPayouts = transactions.filter(tx => 
    tx.party === selectedSupplier && tx.type === 'Supplier Payout'
  ).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="h-full flex flex-col lg:flex-row gap-8">
      
      {/* Sidebar: Supplier List */}
      <div className="w-full lg:w-[320px] bg-white dark:bg-[#151B2B] rounded-[22px] border border-[#ECEDEF] dark:border-white/10 p-4 shrink-0 flex flex-col shadow-sm">
        <div className="flex items-center justify-between mb-4 px-4 pt-2">
          <h3 className="text-[11px] font-black text-[#8B93A7] uppercase tracking-widest">Global Suppliers</h3>
          <button className="text-[11px] font-black text-[#D40073] uppercase tracking-widest hover:underline">Add New</button>
        </div>
        <div className="space-y-1">
          {suppliers.map(s => (
            <button
              key={s}
              onClick={() => setSelectedSupplier(s)}
              className={`w-full px-4 py-3 rounded-[12px] text-left text-[13px] font-black uppercase tracking-tight transition-all ${
                selectedSupplier === s ? 'bg-[#D40073] text-white shadow-lg shadow-[#D40073]/20' : 'text-[#8B93A7] dark:text-white/40 hover:bg-[#F3F4F6] dark:hover:bg-white/5 hover:text-[#111111] dark:hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="mt-auto p-4 bg-[#F9FAFB] dark:bg-white/5 rounded-[16px]">
          <p className="text-[10px] font-black text-[#8B93A7] uppercase tracking-widest mb-3 italic opacity-80">Operational Controls</p>
          <button 
            onClick={() => setIsRecordModalOpen(true)}
            className="w-full py-2.5 bg-[#111111] dark:bg-[#D40073] text-white border border-transparent rounded-[12px] text-[13px] font-black flex items-center justify-center gap-2 hover:bg-black dark:hover:bg-[#D40073]/90 transition-all shadow-sm uppercase tracking-widest"
          >
            <Icon icon="solar:card-2-bold" className="text-[18px]" />
            Record Payout
          </button>
        </div>
      </div>

      <RecordPayoutModal 
        isOpen={isRecordModalOpen} 
        onClose={() => setIsRecordModalOpen(false)} 
        defaultSupplier={selectedSupplier}
      />

      {/* Main Content: Timeline */}
      <div className="flex-1 bg-white dark:bg-[#151B2B] rounded-[22px] border border-[#ECEDEF] dark:border-white/10 overflow-hidden flex flex-col shadow-sm">
        <div className="px-8 py-6 border-b border-[#ECEDEF] dark:border-white/5 flex items-center justify-between bg-[#F9FAFB] dark:bg-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-black/5 dark:from-white/5 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-[22px] font-black text-[#111111] dark:text-white tracking-tight uppercase group-hover:text-[#D40073] transition-colors">{selectedSupplier}</h2>
            <p className="text-[11px] font-black text-[#8B93A7] uppercase tracking-widest mt-0.5">Financial Disbursement Ledger</p>
          </div>
          <div className="flex items-center gap-2 relative z-10">
             <div className="px-2.5 py-1 bg-[#ECFDF5] dark:bg-[#064E3B]/30 text-[#16A34A] rounded-[6px] text-[11px] font-black border border-[#16A34A]/20 shadow-sm uppercase tracking-wider">EXCELLENT CREDIT</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
          {supplierPayouts.length > 0 ? (
            <div className="space-y-10 relative">
               {/* Timeline Line */}
              <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-[#ECEDEF] dark:from-white/10 via-[#ECEDEF] dark:via-white/10 to-transparent" />
              
              {supplierPayouts.map((payout, idx) => (
                <div key={payout.id} className="relative pl-12">
                   {/* Timeline Dot */}
                  <div className={`absolute left-0 top-1.5 w-8 h-8 rounded-full border-4 border-white dark:border-[#151B2B] flex items-center justify-center z-10 shadow-sm transition-transform group-hover:scale-110 ${
                    payout.status === 'Confirmed' ? 'bg-[#16A34A] text-white' : 'bg-[#D97706] text-white'
                  }`}>
                    <Icon icon={payout.status === 'Confirmed' ? 'solar:check-circle-bold' : 'solar:clock-circle-bold'} className="text-[14px]" />
                  </div>

                  <div className="bg-[#F9FAFB] dark:bg-white/5 border border-[#ECEDEF] dark:border-white/10 rounded-[22px] p-6 hover:border-[#D40073]/40 transition-all group shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="text-[10px] font-black text-[#8B93A7] uppercase tracking-widest mb-1.5 italic opacity-80">Consignment Settlement</div>
                        <div className="text-[16px] font-black text-[#111111] dark:text-white flex items-center gap-2 uppercase tracking-tight">
                          Ref: {payout.reference}
                          <Icon icon="solar:link-bold-duotone" className="text-[#D40073] text-[14px] opacity-0 group-hover:opacity-100 cursor-pointer transition-all" />
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[20px] font-black text-[#111111] dark:text-white italic tracking-tighter">GHS {payout.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                        <div className="text-[10px] font-black text-[#D40073] mt-1.5 uppercase tracking-widest bg-[#D40073]/10 px-2 py-0.5 rounded-[4px] border border-[#D40073]/10 inline-block">{payout.method}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 pt-4 border-t border-[#ECEDEF] dark:border-white/5">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-[#8B93A7] uppercase tracking-widest mb-1">Audit Date</span>
                        <span className="text-[13px] font-black text-[#111111] dark:text-white uppercase tracking-tight italic">{new Date(payout.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-[#8B93A7] uppercase tracking-widest mb-1">Entity Trace</span>
                        <span className="text-[13px] font-black text-[#D40073] uppercase tracking-tight italic opacity-90">{payout.linkedId}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-[#8B93A7] uppercase tracking-widest mb-1">Verification</span>
                        <span className={`text-[13px] font-black uppercase tracking-tight italic ${payout.status === 'Confirmed' ? 'text-[#16A34A]' : 'text-[#D97706]'}`}>{payout.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-[#8B93A7]">
              <Icon icon="solar:history-linear" className="text-[48px] mb-4 opacity-50" />
              <p className="text-[15px] font-medium">No payout history found for this supplier.</p>
            </div>
          )}
        </div>

        <div className="bg-[#F9FAFB] dark:bg-white/5 px-8 py-5 border-t border-[#ECEDEF] dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-12 relative z-10">
            <div>
              <span className="text-[10px] font-black text-[#8B93A7] uppercase tracking-widest">Aggregate Payouts</span>
              <div className="text-[18px] font-black text-[#111111] dark:text-white italic tracking-tighter">GHS 16,000.00</div>
            </div>
            <div>
              <span className="text-[10px] font-black text-[#8B93A7] uppercase tracking-widest">Residual Debt</span>
              <div className="text-[18px] font-black text-[#EF4444] italic tracking-tighter">GHS 8,000.00</div>
            </div>
          </div>
          <button className="px-6 h-11 bg-[#111111] dark:bg-white text-white dark:text-[#111111] text-[13px] font-black rounded-[12px] hover:bg-black dark:hover:bg-white/90 transition-all shadow-lg shadow-black/10 uppercase tracking-widest relative z-10 active:scale-95">
             <Icon icon="solar:download-square-bold" className="text-[18px] inline-block mr-2" />
             Export Statement
          </button>
        </div>
      </div>

    </div>
  );
}
