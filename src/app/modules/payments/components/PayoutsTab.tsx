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
      <div className="w-full lg:w-[320px] bg-white rounded-[24px] border border-[#ECEDEF] p-4 shrink-0 flex flex-col">
        <div className="flex items-center justify-between mb-4 px-4 pt-2">
          <h3 className="text-[14px] font-black text-[#111111] uppercase tracking-wider">Suppliers</h3>
          <button className="text-[12px] font-bold text-[#D40073]">Add New</button>
        </div>
        <div className="space-y-1">
          {suppliers.map(s => (
            <button
              key={s}
              onClick={() => setSelectedSupplier(s)}
              className={`w-full px-4 py-3 rounded-[12px] text-left text-[14px] font-bold transition-all ${
                selectedSupplier === s ? 'bg-[#D40073] text-white shadow-none' : 'text-[#525866] hover:bg-[#F3F4F6] hover:text-[#111111]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="mt-auto p-4 bg-[#F3F4F6] rounded-[16px] text-center">
          <p className="text-[12px] text-[#8B93A7] mb-2 font-medium">Record a new payment to a supplier</p>
          <button 
            onClick={() => setIsRecordModalOpen(true)}
            className="w-full py-2 bg-white border border-[#E4E7EC] rounded-[10px] text-[13px] font-black text-[#111111] flex items-center justify-center gap-2 hover:bg-[#D40073] hover:text-white hover:border-transparent transition-all"
          >
            <Plus size={16} />
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
      <div className="flex-1 bg-white rounded-[24px] border border-[#ECEDEF] overflow-hidden flex flex-col">
        <div className="px-8 py-6 border-b border-[#F1F3F5] flex items-center justify-between">
          <div>
            <h2 className="text-[20px] font-black text-[#111111] tracking-tight">{selectedSupplier}</h2>
            <p className="text-[13px] font-medium text-[#8B93A7]">Payout history and settlement timeline</p>
          </div>
          <div className="flex items-center gap-2">
             <div className="px-3 py-1 bg-[#16A34A]/10 text-[#16A34A] rounded-full text-[12px] font-bold">Excellent Credit</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
          {supplierPayouts.length > 0 ? (
            <div className="space-y-10 relative">
               {/* Timeline Line */}
              <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-[#ECEDEF] via-[#ECEDEF] to-transparent" />
              
              {supplierPayouts.map((payout, idx) => (
                <div key={payout.id} className="relative pl-12">
                   {/* Timeline Dot */}
                  <div className={`absolute left-0 top-1.5 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center ${
                    payout.status === 'Confirmed' ? 'bg-[#16A34A] text-white' : 'bg-[#D97706] text-white'
                  }`}>
                    {payout.status === 'Confirmed' ? <Check size={14} strokeWidth={4} /> : <Clock size={14} strokeWidth={4} />}
                  </div>

                  <div className="bg-[#FAFBFC] border border-[#ECEDEF] rounded-[20px] p-6 hover:border-[#D40073]/40 transition-all group">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="text-[13px] font-bold text-[#8B93A7] uppercase tracking-wider mb-1">Consignment settlement</div>
                        <div className="text-[16px] font-black text-[#111111] flex items-center gap-2">
                          Ref: {payout.reference}
                          <ExternalLink size={14} className="text-[#8B93A7] opacity-0 group-hover:opacity-100 cursor-pointer transition-all" />
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[20px] font-black text-[#111111]">GHS {payout.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                        <div className="text-[12px] font-bold text-[#8B93A7] mt-1 uppercase">{payout.method}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 pt-4 border-t border-[#ECEDEF]">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-[#8B93A7] uppercase tracking-wider">Date</span>
                        <span className="text-[13px] font-bold text-[#111111]">{new Date(payout.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-[#8B93A7] uppercase tracking-wider">Linked</span>
                        <span className="text-[13px] font-bold text-[#D40073]">{payout.linkedId}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-[#8B93A7] uppercase tracking-wider">Status</span>
                        <span className={`text-[13px] font-bold ${payout.status === 'Confirmed' ? 'text-[#16A34A]' : 'text-[#D97706]'}`}>{payout.status}</span>
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

        <div className="bg-[#FAFBFC] px-8 py-5 border-t border-[#F1F3F5] flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div>
              <span className="text-[12px] font-black text-[#8B93A7] uppercase tracking-wider">Total Paid</span>
              <div className="text-[16px] font-black text-[#111111]">GHS 16,000.00</div>
            </div>
            <div>
              <span className="text-[12px] font-black text-[#8B93A7] uppercase tracking-wider">Outstanding</span>
              <div className="text-[16px] font-black text-[#EF4444]">GHS 8,000.00</div>
            </div>
          </div>
          <button className="px-6 h-11 bg-[#111111] text-white text-[14px] font-black rounded-[12px] hover:bg-black transition-colors">
            Export Statement
          </button>
        </div>
      </div>

    </div>
  );
}
