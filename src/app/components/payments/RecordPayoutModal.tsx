import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, AlertCircle, Calendar, Hash, UserCircle, CreditCard, Landmark, Banknote, Smartphone } from 'lucide-react';
import { Dialog, DialogContent } from "../ui/dialog";
import { usePayments } from '../../context/PaymentContext';
import { Transaction } from '../../data/mockPayments';

interface RecordPayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSupplier?: string;
}

export function RecordPayoutModal({ isOpen, onClose, defaultSupplier }: RecordPayoutModalProps) {
  const { addTransaction } = usePayments();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    supplier: defaultSupplier || '',
    amount: '',
    method: 'Bank Transfer' as Transaction['method'],
    reference: '',
    linkedId: '',
    notes: ''
  });

  const handleSubmit = () => {
    const newTx: Transaction = {
      id: `RT-PAY-${Math.floor(Math.random() * 10000)}`,
      type: 'Supplier Payout',
      direction: 'out',
      party: formData.supplier,
      partyType: 'Supplier',
      amount: parseFloat(formData.amount),
      method: formData.method,
      status: 'Confirmed',
      recordedBy: 'Admin',
      timestamp: new Date().toISOString(),
      reference: formData.reference,
      linkedId: formData.linkedId,
      notes: formData.notes
    };

    addTransaction(newTx);
    setStep(3); // Success step
  };

  const resetAndClose = () => {
    setStep(1);
    setFormData({
      supplier: defaultSupplier || '',
      amount: '',
      method: 'Bank Transfer',
      reference: '',
      linkedId: '',
      notes: ''
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(v) => !v && resetAndClose()}>
      <DialogContent className="max-w-[540px] p-0 bg-white rounded-[32px] border-none shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-[#F1F3F5] flex items-center justify-between">
          <div>
            <h2 className="text-[24px] font-black text-[#111111] tracking-tight">Record Payout</h2>
            <p className="text-[14px] font-medium text-[#8B93A7]">Document a manual settlement to a supplier.</p>
          </div>
          <button onClick={resetAndClose} className="w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#525866] hover:bg-[#ECEDEF] transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div>
                    <label className="text-[12px] font-black text-[#111111] uppercase tracking-widest mb-2 block">Select Supplier</label>
                    <div className="relative">
                      <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B93A7]" size={18} />
                      <input 
                        className="w-full h-14 pl-12 pr-4 bg-[#F9FAFB] border border-[#ECEDEF] rounded-[16px] text-[15px] font-bold outline-none focus:border-[#D40073] transition-all"
                        placeholder="Search for a supplier..."
                        value={formData.supplier}
                        onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[12px] font-black text-[#111111] uppercase tracking-widest mb-2 block">Amount Paid (GHS)</label>
                      <div className="relative">
                        <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B93A7]" size={18} />
                        <input 
                          type="number"
                          className="w-full h-14 pl-12 pr-4 bg-[#F9FAFB] border border-[#ECEDEF] rounded-[16px] text-[15px] font-bold outline-none focus:border-[#D40073] transition-all"
                          placeholder="0.00"
                          value={formData.amount}
                          onChange={(e) => setFormData({...formData, amount: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[12px] font-black text-[#111111] uppercase tracking-widest mb-2 block">Payment Method</label>
                      <div className="relative">
                        <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B93A7]" size={18} />
                        <select 
                          className="w-full h-14 pl-12 pr-4 bg-[#F9FAFB] border border-[#ECEDEF] rounded-[16px] text-[15px] font-bold outline-none appearance-none cursor-pointer focus:border-[#D40073]"
                          value={formData.method}
                          onChange={(e) => setFormData({...formData, method: e.target.value as any})}
                        >
                          <option>Bank Transfer</option>
                          <option>MTN Mobile Money</option>
                          <option>Cash</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  disabled={!formData.supplier || !formData.amount}
                  onClick={() => setStep(2)}
                  className="w-full h-14 bg-[#111111] text-white rounded-[18px] font-black text-[16px] hover:bg-black transition-all disabled:opacity-50"
                >
                  Continue to Details
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div>
                    <label className="text-[12px] font-black text-[#111111] uppercase tracking-widest mb-2 block">Reference Number</label>
                    <div className="relative">
                      <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B93A7]" size={18} />
                      <input 
                        className="w-full h-14 pl-12 pr-4 bg-[#F9FAFB] border border-[#ECEDEF] rounded-[16px] text-[15px] font-bold outline-none focus:border-[#D40073]"
                        placeholder="MOM-28471 / BT-9921..."
                        value={formData.reference}
                        onChange={(e) => setFormData({...formData, reference: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[12px] font-black text-[#111111] uppercase tracking-widest mb-2 block">Linked Consignment (Optional)</label>
                    <div className="relative">
                      <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B93A7]" size={18} />
                      <input 
                        className="w-full h-14 pl-12 pr-4 bg-[#F9FAFB] border border-[#ECEDEF] rounded-[16px] text-[15px] font-bold outline-none focus:border-[#D40073]"
                        placeholder="Ex: C-0041"
                        value={formData.linkedId}
                        onChange={(e) => setFormData({...formData, linkedId: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[12px] font-black text-[#111111] uppercase tracking-widest mb-2 block">Notes</label>
                    <textarea 
                      className="w-full h-24 p-4 bg-[#F9FAFB] border border-[#ECEDEF] rounded-[16px] text-[15px] font-bold outline-none focus:border-[#D40073] resize-none"
                      placeholder="Add any specific details about this settlement..."
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="flex-1 h-14 bg-[#F3F4F6] text-[#525866] rounded-[18px] font-black">Back</button>
                  <button onClick={handleSubmit} className="flex-[2] h-14 bg-[#D40073] text-white rounded-[18px] font-black text-[16px] hover:bg-[#B80064] transition-all">Confirm & Record</button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 bg-[#16A34A] rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg shadow-[#16A34A]/20">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-[24px] font-black text-[#111111] mb-2">Payout Recorded</h3>
                <p className="text-[#8B93A7] font-medium mb-10 max-w-[280px] mx-auto">The settlement of <span className="text-[#111111] font-bold">GHS {parseFloat(formData.amount).toLocaleString()}</span> to {formData.supplier} has been logged.</p>
                <button 
                  onClick={resetAndClose}
                  className="w-full h-14 bg-[#111111] text-white rounded-[18px] font-black text-[16px] hover:bg-black transition-all"
                >
                  Done
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
