import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, AlertCircle, Clock, FileText, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent } from '../../../core/components/ui/dialog';
import { useShipments } from '../context/ShipmentContext';
import { Shipment } from '../../../core/data/mockShipments';

interface UpdateShipmentStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipment: Shipment | undefined;
}

export function UpdateShipmentStatusModal({ isOpen, onClose, shipment }: UpdateShipmentStatusModalProps) {
  const { updateShipmentStatus } = useShipments();
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!shipment) return null;

  const nextStage = shipment.timeline.find(t => !t.completed);
  const nextStatusMap: Record<string, Shipment['status']> = {
    'In transit': 'In Transit',
    'Customs clearance': 'Customs',
    'Arrived at warehouse': 'Arrived'
  };

  const handleUpdate = () => {
    if (nextStage) {
      const nextStatus = nextStatusMap[nextStage.stage] || 'In Transit';
      updateShipmentStatus(shipment.id, nextStatus, notes);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setNotes('');
        onClose();
      }, 1500);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-[440px] p-0 bg-white rounded-[28px] border-none shadow-2xl overflow-hidden">
        <div className="p-8">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div 
                key="form" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-2">
                   <h3 className="text-[20px] font-black text-[#111111]">Update Milestone</h3>
                   <button onClick={onClose} className="p-2 hover:bg-[#F3F4F6] rounded-full transition-all">
                      <X size={20} />
                   </button>
                </div>

                <div className="bg-[#F9FAFB] p-5 rounded-[20px] border border-[#ECEDEF]">
                  <div className="text-[11px] font-black text-[#8B93A7] uppercase tracking-widest mb-1">Next Milestone</div>
                  <div className="text-[16px] font-black text-[#D40073] flex items-center gap-2">
                     <Clock size={16} />
                     {nextStage?.stage || 'No more milestones'}
                  </div>
                </div>

                <div>
                   <label className="text-[12px] font-black text-[#111111] uppercase tracking-widest mb-2 block">Notes & Observations</label>
                   <textarea 
                     className="w-full h-28 p-4 bg-[#F9FAFB] border border-[#ECEDEF] rounded-[16px] text-[14px] font-bold outline-none focus:border-[#D40073] resize-none"
                     placeholder="e.g., Vessel delayed by 2 days due to weather..."
                     value={notes}
                     onChange={(e) => setNotes(e.target.value)}
                   />
                </div>

                <button 
                  onClick={handleUpdate}
                  disabled={!nextStage}
                  className="w-full h-14 bg-[#111111] text-white rounded-[18px] font-black text-[16px] hover:bg-black transition-all disabled:opacity-50"
                >
                  Mark as Completed
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className="w-16 h-16 bg-[#16A34A] rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-[20px] font-black text-[#111111]">Status Updated</h3>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
