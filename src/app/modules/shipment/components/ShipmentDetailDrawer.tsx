import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, MapPin, Package, Ship, Plane, Truck, 
  ExternalLink, Calendar, CheckCircle2, Clock, 
  Landmark, FileText, ChevronRight, Info,
  Box, AlertCircle, TrendingUp, Navigation
} from 'lucide-react';
import { Icon } from '@iconify/react';
import { useShipments } from '../context/ShipmentContext';
import { UpdateShipmentStatusModal } from './UpdateShipmentStatusModal';
import { AddressCard } from '../../../core/components/AddressCard';
import { GhanaAddress } from '../../../core/types/address';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon path issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Icon for Map
const truckIcon = L.divIcon({
  className: 'custom-leaflet-icon',
  html: `<div style="background-color: white; border: 2px solid #D40073; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center;"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D40073" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

export function ShipmentDetailDrawer() {
  const { shipments, carriers, selectedShipmentId, closeShipmentDetail, markAsArrived } = useShipments();
  
  const shipment = shipments.find(s => s.id === selectedShipmentId);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isManifestOpen, setIsManifestOpen] = useState(false);

  if (!selectedShipmentId || !shipment) return null;

  const handleMarkArrived = () => {
    markAsArrived(shipment.id, new Date().toISOString().split('T')[0], 'Arrived in good condition.');
    closeShipmentDetail();
  };

  const carrier = carriers.find(c => c.id === shipment.carrierId);

  // Status-based color mapping for "Very Colorful" design
  const statusConfig = ({
    'In Transit': {
      bg: 'bg-gradient-to-br from-[#2563EB] to-[#3B82F6]',
      lightBg: 'bg-[#2563EB]/5',
      accent: 'text-[#2563EB]',
      icon: 'solar:delivery-bold-duotone'
    },
    'Arrived': {
      bg: 'bg-gradient-to-br from-[#059669] to-[#10B981]',
      lightBg: 'bg-[#059669]/5',
      accent: 'text-[#059669]',
      icon: 'solar:check-circle-bold-duotone'
    },
    'Pending': {
      bg: 'bg-gradient-to-br from-[#D97706] to-[#F59E0B]',
      lightBg: 'bg-[#D97706]/5',
      accent: 'text-[#D97706]',
      icon: 'solar:clock-circle-bold-duotone'
    },
    'Delayed': {
      bg: 'bg-gradient-to-br from-[#DC2626] to-[#EF4444]',
      lightBg: 'bg-[#DC2626]/5',
      accent: 'text-[#DC2626]',
      icon: 'solar:danger-bold-duotone'
    }
  } as Record<string, any>)[shipment.status] || {
    bg: 'bg-gradient-to-br from-[#525866] to-[#717680]',
    lightBg: 'bg-[#525866]/5',
    accent: 'text-[#525866]',
    icon: 'solar:box-bold-duotone'
  };

  return (
    <AnimatePresence>
      {selectedShipmentId && (
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
            className="fixed top-0 right-0 h-full w-[540px] bg-[#F8F9FA] z-[110] flex flex-col overflow-hidden"
          >
            {/* Colorful Header Section */}
            <div className={`relative px-8 pt-10 pb-12 overflow-hidden shrink-0 ${statusConfig.bg}`}>
              {/* Abstract decorative circles */}
              <div className="absolute top-[-20px] right-[-20px] w-40 h-40 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute bottom-[-40px] left-[-20px] w-64 h-64 rounded-full bg-black/10 blur-3xl" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[14px] bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                      <Icon icon={statusConfig.icon} className="text-white text-[22px]" />
                    </div>
                    <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-[11px] font-black text-white uppercase tracking-wider">
                      {shipment.status}
                    </div>
                  </div>
                  <button 
                    onClick={closeShipmentDetail}
                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <h2 className="text-[36px] font-black text-white tracking-tight leading-none mb-2">{shipment.id}</h2>
                    <div className="flex items-center gap-2 text-[16px] font-medium text-white/80">
                      <Landmark size={16} />
                      {shipment.supplierName}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] font-black text-white/60 uppercase tracking-widest mb-1">Expected Arrival</div>
                    <div className="text-[18px] font-black text-white">{new Date(shipment.eta).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto mt-[-24px] rounded-t-[32px] bg-[#F8F9FA] relative z-20 px-8 py-10 custom-scrollbar space-y-8">
              
              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-[12px] bg-[#D40073]/5 flex items-center justify-center text-[#D40073]">
                      <Navigation size={20} strokeWidth={2.5} />
                    </div>
                    <div className="text-[11px] font-black text-[#8B93A7] uppercase tracking-widest leading-none">Destination & Logistics</div>
                  </div>
                  <AddressCard address={shipment.destinationAddress} />
                </div>

                <div className="bg-white p-5 rounded-[24px] border border-[#ECEDEF] group hover:border-[#D40073]/30 transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-[12px] bg-[#2563EB]/5 flex items-center justify-center text-[#2563EB]">
                      <Icon icon="solar:shield-check-bold-duotone" className="text-[20px]" />
                    </div>
                    <div className="text-[11px] font-black text-[#8B93A7] uppercase tracking-widest leading-none">Security</div>
                  </div>
                  <div className="text-[15px] font-black text-[#111111]">Insured Shipment</div>
                  <div className="text-[13px] font-medium text-[#525866] mt-1 flex items-center gap-1.5 opacity-60">
                    <AlertCircle size={14} />
                    Awaiting Validation
                  </div>
                </div>
              </div>

              {/* Journey Map Visual Placeholder -> Real Map */}
              <div className="bg-white p-2 rounded-[28px] border border-[#ECEDEF] relative overflow-hidden group">
                <div className="h-[200px] rounded-[22px] bg-[#F1F3F5] overflow-hidden relative z-0">
                  <MapContainer 
                    center={[5.6000, -0.1700]} 
                    zoom={12} 
                    className="w-full h-full z-0"
                    zoomControl={false}
                    attributionControl={false}
                  >
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                    <Marker position={[5.6000, -0.1700]} icon={truckIcon}>
                      <Popup className="text-[12px] font-bold">Current Location</Popup>
                    </Marker>
                  </MapContainer>
                  
                  {/* Overlay for "Simulated Transit Monitor" effect */}
                  <div className="absolute top-4 left-4 right-4 z-[400] pointer-events-none">
                    <div className="bg-[#111111]/90 backdrop-blur-md rounded-[16px] p-3 border border-white/10 flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-[#D40073]/20 flex items-center justify-center">
                          <Navigation size={14} className="text-[#D40073]" />
                       </div>
                       <div>
                          <div className="text-[12px] font-black text-white leading-none mb-1">Simulated Transit Monitor</div>
                          <div className="text-[10px] font-medium text-[#8B93A7] leading-none">Real-time GPS tracking is active for this shipment</div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transit Progress */}
              <section>
                <div className="flex items-center justify-between mb-6">
                   <h3 className="text-[13px] font-black text-[#111111] uppercase tracking-[0.1em] flex items-center gap-2">
                      <Icon icon="solar:routing-bold-duotone" className="text-[18px] text-[#D40073]" />
                      Transit Milestone
                   </h3>
                   <span className="text-[12px] font-black text-[#D40073] bg-[#D40073]/5 px-3 py-1 rounded-full uppercase">
                      Stage {shipment.timeline.filter(t => t.completed).length}/{shipment.timeline.length}
                   </span>
                </div>
                
                <div className="space-y-6 relative ml-2">
                  <div className="absolute left-[13px] top-2 bottom-2 w-px bg-gradient-to-b from-[#16A34A] via-[#ECEDEF] to-[#ECEDEF]" />
                  {shipment.timeline.map((item, idx) => (
                    <div key={idx} className="relative pl-10 group">
                      <div className={`absolute left-0 top-1 w-[26px] h-[26px] rounded-full border-2 border-[#F8F9FA] z-10 flex items-center justify-center transition-all ${
                        item.completed ? 'bg-[#16A34A] text-white scale-110' : 
                        idx === shipment.timeline.findIndex(t => !t.completed) ? 'bg-[#D40073] text-white ring-4 ring-[#D40073]/10 scale-125' :
                        'bg-white border-[#ECEDEF] text-[#8B93A7]'
                      }`}>
                         {item.completed ? <CheckCircle2 size={12} /> : idx === shipment.timeline.findIndex(t => !t.completed) ? <Box size={12} className="animate-pulse" /> : null}
                      </div>
                      <div>
                        <div className="flex items-center justify-between gap-4">
                           <span className={`text-[14px] font-black ${item.completed ? 'text-[#111111]' : 'text-[#8B93A7] font-bold group-hover:text-[#111111] transition-colors'}`}>{item.stage}</span>
                           <span className="text-[11px] font-black text-[#8B93A7] uppercase tracking-tighter">{item.date || 'Pending'}</span>
                        </div>
                        <p className="text-[13px] font-medium text-[#525866] mt-0.5 leading-relaxed opacity-80">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Cargo Breakdown Card */}
              <section className="bg-white rounded-[28px] border border-[#ECEDEF] overflow-hidden transition-transform hover:translate-y-[-2px]">
                 <div className="px-6 py-5 border-b border-[#F1F3F5] bg-[#FAFBFC] flex items-center justify-between">
                    <h3 className="text-[13px] font-black text-[#111111] uppercase tracking-wider flex items-center gap-2">
                       <Package size={18} className="text-[#D40073]" />
                       Manifest Details
                    </h3>
                    <div className="w-8 h-8 rounded-full bg-white border border-[#ECEDEF] flex items-center justify-center text-[#525866]">
                       <TrendingUp size={14} />
                    </div>
                 </div>
                 <div className="p-6">
                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-6">
                          <div>
                             <div className="text-[11px] font-black text-[#8B93A7] uppercase tracking-[0.15em] mb-1.5 leading-none">Total Weight</div>
                             <div className="text-[20px] font-black text-[#111111] tracking-tight">2,420 <span className="text-[13px] font-bold text-[#8B93A7]">kg</span></div>
                          </div>
                          <div>
                             <div className="text-[11px] font-black text-[#8B93A7] uppercase tracking-[0.15em] mb-1.5 leading-none">Carton Count</div>
                             <div className="text-[20px] font-black text-[#111111] tracking-tight">{shipment.cartonCount} <span className="text-[13px] font-bold text-[#8B93A7]">units</span></div>
                          </div>
                       </div>
                       <div className="space-y-6">
                          <div>
                             <div className="text-[11px] font-black text-[#8B93A7] uppercase tracking-[0.15em] mb-1.5 leading-none">Volume Metric</div>
                             <div className="text-[20px] font-black text-[#111111] tracking-tight">18.5 <span className="text-[13px] font-bold text-[#8B93A7]">CBM</span></div>
                          </div>
                          <div>
                             <div className="text-[11px] font-black text-[#8B93A7] uppercase tracking-[0.15em] mb-1.5 leading-none">Item Count</div>
                             <div className="text-[20px] font-black text-[#111111] tracking-tight">{shipment.itemCount.toLocaleString()} <span className="text-[13px] font-bold text-[#8B93A7]">items</span></div>
                          </div>
                       </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-[#F1F3F5]">
                       <button 
                          onClick={() => setIsManifestOpen(true)}
                          className="w-full flex items-center justify-center gap-2 text-[13px] font-black text-[#D40073] hover:gap-3 transition-all"
                       >
                          <FileText size={16} />
                          Browse Packing List Manifest
                          <ChevronRight size={16} />
                       </button>
                    </div>
                 </div>
              </section>

              {/* Partner Section */}
              <section className="bg-[#111111] rounded-[28px] p-6 text-white relative overflow-hidden group">
                 <div className="absolute top-[-10px] right-[-10px] w-24 h-24 rounded-full bg-white/5 group-hover:scale-110 transition-transform" />
                 <h3 className="text-[11px] font-black text-white/50 uppercase tracking-[0.2em] mb-4">Contractor & Tracking</h3>
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10 transition-transform group-hover:rotate-6">
                       <Icon icon={shipment.freightMethod === 'Sea' ? 'solar:ship-bold-duotone' : shipment.freightMethod === 'Air' ? 'solar:plain-bold-duotone' : 'solar:truck-bold-duotone'} className="text-white text-[28px]" />
                    </div>
                    <div className="flex-1">
                       <div className="text-[17px] font-black text-white tracking-tight leading-none mb-1">{carrier?.name || 'Logistics Partner'}</div>
                       <div className="text-[13px] font-medium text-white/60 flex items-center gap-1.5">
                          Method: {shipment.freightMethod} • {shipment.incoterm}
                       </div>
                    </div>
                    <a 
                      href="#" 
                      className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-[#111111] transition-all"
                    >
                       <ExternalLink size={18} />
                    </a>
                 </div>
                 <div className="mt-6 pt-5 border-t border-white/10">
                    <div className="flex items-center justify-between text-[11px] font-black text-white/40 uppercase tracking-widest mb-1.5">
                       Tracking Reference
                       <span className="text-[#16A34A] flex items-center gap-1 text-[9px]">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                          Live Tracking Active
                       </span>
                    </div>
                    <div className="text-[18px] font-mono text-white/90 font-bold tracking-tight">{shipment.trackingNumber}</div>
                 </div>
              </section>

            </div>

            {/* Premium Footer Actions */}
            <div className="p-8 border-t border-[#F1F3F5] bg-white flex items-center gap-4 selection-none shrink-0">
               <button 
                  onClick={() => setIsUpdateModalOpen(true)}
                  className="flex-1 h-14 bg-[#111111] text-white rounded-[22px] font-black text-[15px] flex items-center justify-center gap-2 hover:bg-black transition-all hover:scale-[1.02] active:scale-[0.98]"
               >
                  <Icon icon="solar:pen-new-square-bold-duotone" className="text-[20px]" />
                  Update Progress
               </button>
               {shipment.status !== 'Arrived' && shipment.status !== 'Received' && (
                  <button 
                    onClick={handleMarkArrived}
                    className="flex-1 h-14 bg-white border-2 border-[#ECEDEF] text-[#111111] rounded-[22px] font-black text-[15px] hover:border-[#D40073] hover:text-[#D40073] transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    Mark as Arrived
                  </button>
               )}
            </div>

          </motion.div>
          
          {/* Manifest Modal */}
          <AnimatePresence>
            {isManifestOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsManifestOpen(false)}
                  className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[200]"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[700px] h-[80vh] flex flex-col bg-white rounded-[32px] z-[210] overflow-hidden"
                >
                  <div className="px-8 py-6 border-b border-[#F1F3F5] flex items-center justify-between shrink-0 bg-[#FAFBFC]">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-[16px] bg-[#D40073]/10 flex items-center justify-center text-[#D40073]">
                        <Package size={24} />
                      </div>
                      <div>
                        <h2 className="text-[20px] font-black text-[#111111] tracking-tight">Packing List Manifest</h2>
                        <p className="text-[13px] font-medium text-[#8B93A7] mt-0.5">Shipment {shipment.id}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsManifestOpen(false)}
                      className="w-10 h-10 rounded-full bg-white border border-[#ECEDEF] flex items-center justify-center text-[#525866] hover:bg-[#F3F4F6] transition-all"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {/* Mock Manifest Table */}
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[#ECEDEF]">
                          <th className="pb-4 text-[11px] font-black text-[#8B93A7] uppercase tracking-wider">SKU / Item</th>
                          <th className="pb-4 text-[11px] font-black text-[#8B93A7] uppercase tracking-wider text-right">Qty</th>
                          <th className="pb-4 text-[11px] font-black text-[#8B93A7] uppercase tracking-wider text-right">Weight (kg)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F1F3F5]">
                        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                          <tr key={i} className="hover:bg-[#F9FAFB] transition-colors group">
                            <td className="py-4">
                              <div className="text-[14px] font-bold text-[#111111]">Premium Cement Bag 50kg</div>
                              <div className="text-[12px] font-mono text-[#8B93A7] mt-0.5">SKU-CEM-{1000 + i}</div>
                            </td>
                            <td className="py-4 text-right">
                              <span className="text-[14px] font-black text-[#111111]">{(shipment.itemCount / 7).toFixed(0)}</span>
                            </td>
                            <td className="py-4 text-right">
                              <span className="text-[14px] font-medium text-[#525866]">{(2420 / 7).toFixed(1)}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="px-8 py-5 border-t border-[#F1F3F5] bg-[#FAFBFC] flex items-center justify-between shrink-0">
                    <div className="text-[13px] font-medium text-[#8B93A7]">
                      Total Items: <span className="font-black text-[#111111]">{shipment.itemCount}</span>
                    </div>
                    <button className="px-6 h-12 bg-[#111111] hover:bg-black text-white rounded-[16px] font-black text-[14px] transition-all flex items-center gap-2">
                       <FileText size={16} />
                       Download PDF
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
