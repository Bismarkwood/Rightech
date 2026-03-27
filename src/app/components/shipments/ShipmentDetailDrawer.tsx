import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Package, Ship, Plane, Truck, ExternalLink, Calendar, CheckCircle2, Clock, Landmark, FileText, ChevronRight } from 'lucide-react';
import { useShipments } from '../../context/ShipmentContext';
import { UpdateShipmentStatusModal } from './UpdateShipmentStatusModal';

export function ShipmentDetailDrawer() {
  const { shipments, carriers, selectedShipmentId, closeShipmentDetail, markAsArrived } = useShipments();
  
  const shipment = shipments.find(s => s.id === selectedShipmentId);
  if (!selectedShipmentId) return null;

  const handleMarkArrived = () => {
    if (shipment) {
      markAsArrived(shipment.id, new Date().toISOString().split('T')[0], 'Arrived in good condition.');
      closeShipmentDetail();
    }
  };

  const carrier = carriers.find(c => c.id === shipment?.carrierId);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = React.useState(false);

  return (
    <AnimatePresence>
      {selectedShipmentId && shipment && (
        <>
          <UpdateShipmentStatusModal 
            isOpen={isUpdateModalOpen} 
            onClose={() => setIsUpdateModalOpen(false)} 
            shipment={shipment} 
          />
          
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeShipmentDetail}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[100]"
          />
          
          {/* Drawer */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-[480px] bg-white z-[110] flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.1)]"
          >
            {/* Header */}
            <div className="p-8 border-b border-[#F1F3F5] shrink-0">
              <div className="flex items-center justify-between mb-6">
                <div className={`px-4 py-1.5 rounded-full text-[12px] font-black uppercase tracking-tight ${
                  shipment.status === 'In Transit' ? 'bg-[#2563EB]/10 text-[#2563EB]' :
                  shipment.status === 'Arrived' ? 'bg-[#16A34A]/10 text-[#16A34A]' :
                  'bg-[#525866]/10 text-[#525866]'
                }`}>
                  {shipment.status}
                </div>
                <button 
                  onClick={closeShipmentDetail}
                  className="w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#525866] hover:bg-[#ECEDEF] transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <h2 className="text-[32px] font-black text-[#111111] tracking-tight">{shipment.id}</h2>
              <div className="flex items-center gap-2 text-[15px] font-bold text-[#D40073] mt-1">
                {shipment.supplierName}
              </div>
              <div className="flex items-center gap-2 text-[13px] font-bold text-[#8B93A7] mt-3">
                 Consignment <span className="text-[#111111]">#{shipment.consignmentId}</span>
                 <ChevronRight size={14} />
                 <span className="text-[#D40073] cursor-pointer hover:underline">View Details</span>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-10">
              
              {/* Journey Timeline */}
              <section>
                <h3 className="text-[12px] font-black text-[#111111] uppercase tracking-[0.2em] mb-8">Journey Timeline</h3>
                <div className="space-y-10 relative">
                  <div className="absolute left-[15px] top-2 bottom-2 w-px bg-[#ECEDEF]" />
                  {shipment.timeline.map((item, idx) => (
                    <div key={idx} className="relative pl-12">
                      <div className={`absolute left-0 top-1 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center ${
                        item.completed ? 'bg-[#16A34A] text-white' : 
                        idx === shipment.timeline.findIndex(t => !t.completed) ? 'bg-[#D40073] text-white animate-pulse' :
                        'bg-[#ECEDEF] text-[#8B93A7]'
                      }`}>
                         {item.completed ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                      </div>
                      <div>
                        <div className="flex items-center justify-between gap-4">
                           <span className={`text-[15px] font-black ${item.completed ? 'text-[#111111]' : 'text-[#8B93A7]'}`}>{item.stage}</span>
                           <span className="text-[12px] font-bold text-[#8B93A7]">{item.date || '—'}</span>
                        </div>
                        <p className="text-[13px] font-medium text-[#525866] mt-0.5">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Contents Selection */}
              <section className="bg-[#F9FAFB] rounded-[24px] p-6 border border-[#ECEDEF]">
                 <h3 className="text-[12px] font-black text-[#111111] uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Package size={16} />
                    Shipment Contents
                 </h3>
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <span className="text-[14px] font-bold text-[#525866]">Total Cartons</span>
                       <span className="text-[14px] font-black text-[#111111]">{shipment.cartonCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[14px] font-bold text-[#525866]">Total Unit Count</span>
                       <span className="text-[14px] font-black text-[#111111]">{shipment.itemCount}</span>
                    </div>
                    <div className="pt-4 mt-4 border-t border-[#ECEDEF]">
                       <button className="text-[13px] font-black text-[#D40073] flex items-center gap-2">
                          <FileText size={14} />
                          View Packing List
                       </button>
                    </div>
                 </div>
              </section>

              {/* Logistics Details */}
              <section className="space-y-6">
                <h3 className="text-[12px] font-black text-[#111111] uppercase tracking-[0.2em]">Logistics & Carrier</h3>
                <div className="grid grid-cols-2 gap-6">
                   <div>
                      <div className="text-[11px] font-black text-[#8B93A7] uppercase tracking-wider mb-1">Carrier</div>
                      <div className="text-[14px] font-black text-[#111111]">{carrier?.name || 'N/A'}</div>
                   </div>
                   <div>
                      <div className="text-[11px] font-black text-[#8B93A7] uppercase tracking-wider mb-1">Tracking #</div>
                      <div className="text-[14px] font-black text-[#D40073] flex items-center gap-1 group cursor-pointer hover:underline truncate">
                         {shipment.trackingNumber}
                         <ExternalLink size={12} className="group-hover:translate-x-0.5 transition-transform" />
                      </div>
                   </div>
                   <div>
                      <div className="text-[11px] font-black text-[#8B93A7] uppercase tracking-wider mb-1">Freight Method</div>
                      <div className="text-[14px] font-black text-[#111111] flex items-center gap-1.5">
                         {shipment.freightMethod === 'Sea' && <Ship size={14} />}
                         {shipment.freightMethod === 'Air' && <Plane size={14} />}
                         {shipment.freightMethod === 'Road' && <Truck size={14} />}
                         {shipment.freightMethod}
                      </div>
                   </div>
                   <div>
                      <div className="text-[11px] font-black text-[#8B93A7] uppercase tracking-wider mb-1">Incoterm</div>
                      <div className="text-[14px] font-black text-[#111111]">{shipment.incoterm}</div>
                   </div>
                </div>
              </section>

            </div>

            {/* Footer Actions */}
            <div className="p-8 border-t border-[#F1F3F5] bg-[#FAFBFC] flex items-center gap-4">
               <button 
                  onClick={() => setIsUpdateModalOpen(true)}
                  className="flex-1 h-14 bg-[#111111] text-white rounded-[18px] font-black text-[15px] flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg shadow-black/10"
               >
                  Update Status
               </button>
               {shipment.status !== 'Arrived' && shipment.status !== 'Received' && (
                  <button 
                    onClick={handleMarkArrived}
                    className="flex-1 h-14 bg-white border border-[#E4E7EC] text-[#111111] rounded-[18px] font-black text-[15px] hover:bg-[#F3F4F6] transition-all"
                  >
                    Mark Arrived
                  </button>
               )}
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
