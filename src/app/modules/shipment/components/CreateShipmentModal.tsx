import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, AlertCircle, Ship, Plane, Truck, Train, Search, Hash, Globe, Calendar, Package } from 'lucide-react';
import { Dialog, DialogContent } from '../../../core/components/ui/dialog';
import { useShipments } from '../context/ShipmentContext';
import { useConsignment } from '../../consignment/context/ConsignmentContext';
import { Shipment } from '../../../core/data/mockShipments';

interface CreateShipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateShipmentModal({ isOpen, onClose }: CreateShipmentModalProps) {
  const { addShipment, carriers } = useShipments();
  const { inboundConsignments } = useConsignment();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    consignmentId: '',
    supplierName: '',
    freightMethod: 'Sea' as Shipment['freightMethod'],
    carrierId: '',
    trackingNumber: '',
    originPort: '',
    eta: '',
    incoterm: 'FOB',
    destinationWarehouse: 'Accra Main Warehouse'
  });

  const activeConsignments = inboundConsignments.filter(c => c.status === 'On Shelf' || c.status === 'In Transit');

  const handleSelectConsignment = (c: any) => {
    setFormData({
      ...formData,
      consignmentId: c.id,
      supplierName: c.partnerName
    });
    setStep(2);
  };

  const handleSubmit = () => {
    const newShipment: Shipment = {
      id: `SHI-${Math.floor(Math.random() * 10000)}`,
      supplierName: formData.supplierName,
      consignmentId: formData.consignmentId,
      itemCount: 850, // Mocked from consignment logic
      cartonCount: 42,
      departureDate: new Date().toISOString().split('T')[0],
      eta: formData.eta,
      status: 'Dispatched',
      freightMethod: formData.freightMethod,
      carrierId: formData.carrierId || 'car-001',
      trackingNumber: formData.trackingNumber,
      originPort: formData.originPort,
      destinationWarehouse: formData.destinationWarehouse,
      incoterm: formData.incoterm,
      timeline: [
        { stage: 'Order placed', date: new Date().toISOString().split('T')[0], description: 'Consignment linked', completed: true },
        { stage: 'Goods dispatched', date: new Date().toISOString().split('T')[0], description: 'Shipment created in system', completed: true },
        { stage: 'In transit', description: 'Expected departure', completed: false },
        { stage: 'Arrived at warehouse', description: `ETA ${formData.eta}`, completed: false }
      ]
    };

    addShipment(newShipment);
    setStep(4);
  };

  const resetAndClose = () => {
    setStep(1);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(v) => !v && resetAndClose()}>
      <DialogContent className="max-w-[580px] p-0 bg-white rounded-[32px] border-none shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-[#F1F3F5] flex items-center justify-between bg-[#FAFBFC]">
          <div>
            <h2 className="text-[24px] font-black text-[#111111] tracking-tight">New Shipment</h2>
            <p className="text-[14px] font-medium text-[#8B93A7]">Link a consignment and track physical movement.</p>
          </div>
          <button onClick={resetAndClose} className="w-10 h-10 rounded-full bg-[#ECEDEF] flex items-center justify-center text-[#525866] hover:bg-[#D40073] hover:text-white transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="text-[12px] font-black text-[#111111] uppercase tracking-widest mb-3 block">Link to Consignment</label>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto no-scrollbar">
                    {activeConsignments.map((c: any) => (
                      <button 
                        key={c.id}
                        onClick={() => handleSelectConsignment(c)}
                        className="w-full p-5 bg-[#F9FAFB] border border-[#ECEDEF] rounded-[20px] text-left hover:border-[#D40073] hover:bg-white transition-all group"
                      >
                         <div className="flex items-center justify-between mb-1">
                            <span className="text-[15px] font-black text-[#111111]">{c.id}</span>
                            <span className="text-[11px] font-black px-2 py-0.5 bg-[#D40073]/10 text-[#D40073] rounded-full uppercase">{c.status}</span>
                         </div>
                         <div className="text-[13px] font-bold text-[#525866]">{c.partnerName}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-[12px] font-black text-[#111111] uppercase tracking-widest mb-2 block">Freight Method</label>
                    <div className="flex gap-2">
                      {['Sea', 'Air', 'Road'].map((m) => (
                        <button
                          key={m}
                          onClick={() => setFormData({...formData, freightMethod: m as any})}
                          className={`flex-1 h-12 rounded-[14px] text-[13px] font-black flex items-center justify-center gap-2 border transition-all ${
                            formData.freightMethod === m ? 'bg-[#D40073] text-white border-transparent shadow-lg shadow-[#D40073]/20' : 'bg-[#F9FAFB] text-[#8B93A7] border-[#ECEDEF] hover:border-[#D40073]/40'
                          }`}
                        >
                          {m === 'Sea' && <Ship size={16} />}
                          {m === 'Air' && <Plane size={16} />}
                          {m === 'Road' && <Truck size={16} />}
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[12px] font-black text-[#111111] uppercase tracking-widest mb-2 block">Carrier</label>
                    <select 
                      className="w-full h-14 bg-[#F9FAFB] border border-[#ECEDEF] rounded-[16px] px-4 font-bold text-[14px] outline-none"
                      onChange={(e) => setFormData({...formData, carrierId: e.target.value})}
                    >
                      {carriers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-[12px] font-black text-[#111111] uppercase tracking-widest mb-2 block">Tracking Number</label>
                    <input 
                      className="w-full h-14 bg-[#F9FAFB] border border-[#ECEDEF] rounded-[16px] px-4 font-bold text-[14px] outline-none"
                      placeholder="Ex: COS1283..."
                      value={formData.trackingNumber}
                      onChange={(e) => setFormData({...formData, trackingNumber: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="text-[12px] font-black text-[#111111] uppercase tracking-widest mb-2 block">Origin Port</label>
                    <input 
                      className="w-full h-14 bg-[#F9FAFB] border border-[#ECEDEF] rounded-[16px] px-4 font-bold text-[14px] outline-none"
                      placeholder="Shenzhen, China"
                      value={formData.originPort}
                      onChange={(e) => setFormData({...formData, originPort: e.target.value})}
                    />
                  </div>

                  <div>
                     <label className="text-[12px] font-black text-[#111111] uppercase tracking-widest mb-2 block">ETA</label>
                     <input 
                      type="date"
                      className="w-full h-14 bg-[#F9FAFB] border border-[#ECEDEF] rounded-[16px] px-4 font-bold text-[14px] outline-none"
                      value={formData.eta}
                      onChange={(e) => setFormData({...formData, eta: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="flex-1 h-14 bg-[#F3F4F6] text-[#525866] rounded-[18px] font-black">Back</button>
                  <button onClick={() => setStep(3)} className="flex-[2] h-14 bg-[#111111] text-white rounded-[18px] font-black text-[16px]">Next Step</button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                 <div className="bg-[#F9FAFB] rounded-[24px] p-6 border border-[#ECEDEF]">
                    <div className="text-[12px] font-black text-[#111111] uppercase tracking-widest mb-4">Confirm Contents</div>
                    <div className="space-y-4">
                       <div className="flex items-center justify-between">
                          <div className="text-[14px] font-bold text-[#525866]">Total Items</div>
                          <div className="text-[14px] font-black text-[#111111]">850 units</div>
                       </div>
                       <div className="flex items-center justify-between">
                          <div className="text-[14px] font-bold text-[#525866]">Carton Count</div>
                          <div className="text-[14px] font-black text-[#111111]">42 Cartons</div>
                       </div>
                       <div className="pt-4 border-t border-[#ECEDEF] text-[13px] font-medium text-[#8B93A7]">
                          Note: Quantities are synced from Consignment {formData.consignmentId}.
                       </div>
                    </div>
                 </div>

                 <div className="flex gap-4">
                  <button onClick={() => setStep(2)} className="flex-1 h-14 bg-[#F3F4F6] text-[#525866] rounded-[18px] font-black">Back</button>
                  <button onClick={handleSubmit} className="flex-[2] h-14 bg-[#D40073] text-white rounded-[18px] font-black text-[16px] shadow-lg shadow-[#D40073]/20">Create Shipment & Notify</button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 bg-[#16A34A] rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg shadow-[#16A34A]/20">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-[24px] font-black text-[#111111] mb-2">Shipment Created</h3>
                <p className="text-[#8B93A7] font-medium mb-10 max-w-[320px] mx-auto">Shipment {formData.trackingNumber} has been logged and assigned to {formData.supplierName}.</p>
                <button 
                  onClick={resetAndClose}
                  className="w-full h-14 bg-[#111111] text-white rounded-[18px] font-black text-[16px] hover:bg-black transition-all"
                >
                  Go to Active Shipments
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
