import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Navigation, Phone, User, Star, Clock, Truck, Bike, Car, ShieldCheck } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useDelivery, DeliveryAgent } from '../context/DeliveryContext';

// Fix Leaflet's default icon path issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Icon Creators
const createAgentIcon = (status: DeliveryAgent['status']) => {
  const color = status === 'On Delivery' ? '#D40073' : status === 'Available' ? '#16A34A' : '#8B93A7';
  const glow = status === 'On Delivery' ? 'rgba(212,0,115,0.4)' : 'rgba(22,163,74,0.4)';
  
  const html = `
    <div style="position: relative; display: flex; align-items: center; justify-content: center;">
      ${status !== 'Offline' ? `<div style="position: absolute; width: 48px; height: 48px; background-color: ${glow}; border-radius: 50%; blur: 8px; opacity: 0.2; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; transform: scale(1.5);"></div>` : ''}
      <div style="width: 36px; height: 36px; background-color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid ${color}; box-shadow: 0 8px 16px -4px rgba(0,0,0,0.2);">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="${color}" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(45deg);"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
      </div>
    </div>
  `;

  return L.divIcon({
    className: 'agent-leaflet-icon',
    html: html,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

const StatusBadge = ({ status }: { status: DeliveryAgent['status'] }) => (
  <div className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${
    status === 'On Delivery' ? 'bg-[#D40073]/10 text-[#D40073]' : 'bg-[#16A34A]/10 text-[#16A34A]'
  }`}>
    {status === 'On Delivery' && <div className="w-1.5 h-1.5 rounded-full bg-[#D40073] animate-pulse" />}
    {status === 'On Delivery' ? 'Live' : 'Available'}
  </div>
);

const VehicleIcon = ({ type, size = 14 }: { type: DeliveryAgent['vehicleType'], size?: number }) => {
  switch (type) {
    case 'bike': return <Bike size={size} />;
    case 'truck': return <Truck size={size} />;
    case 'van': return <Car size={size} />;
    default: return <Car size={size} />;
  }
};

interface AgentsMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAgentId?: string;
}

export function AgentsMapModal({ isOpen, onClose, selectedAgentId }: AgentsMapModalProps) {
  const { agents } = useDelivery();
  
  const activeAgents = agents.filter(a => a.location && a.status !== 'Offline');
  const selectedAgent = activeAgents.find(a => a.id === selectedAgentId);
  const initialCenter: [number, number] = selectedAgent 
    ? [selectedAgent.location.lat, selectedAgent.location.lng] 
    : [5.6037, -0.1870];

  if (!isOpen) return null;

  const totalAvailable = agents.filter(a => a.status === 'Available').length;
  const totalActive = agents.filter(a => a.status === 'On Delivery').length;
  const healthPercent = Math.round((totalAvailable / (totalAvailable + totalActive || 1)) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/50 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.98 }}
            className="w-full max-w-[1440px] h-[92vh] bg-[#0B0F1A] rounded-[40px] overflow-hidden flex flex-col relative border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]"
          >
            {/* ── Page Header ── */}
            <div className="h-[80px] px-12 border-b border-white/5 flex items-center justify-between shrink-0 bg-[#0B0F1A]/90 backdrop-blur-lg z-10">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-[14px] bg-[#D40073] text-white flex items-center justify-center shadow-lg shadow-[#D40073]/20">
                  <Navigation size={22} className="transform rotate-45" />
                </div>
                <div>
                  <h2 className="text-[24px] font-black text-white tracking-tight leading-none mb-1">Fleet Operations</h2>
                  <p className="text-[13px] font-semibold text-[#8B93A7]">
                    {selectedAgent ? `Tracking Active Field Agent: ${selectedAgent.name}` : `${activeAgents.length} Agents currently on field`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="hidden md:flex items-center gap-6 text-[12px] font-black uppercase tracking-wider text-[#8B93A7]">
                   <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#16A34A] shadow-[0_0_8px_rgba(22,163,74,0.5)]" />
                      <span className="text-white/80">Ready</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#D40073] shadow-[0_0_8px_rgba(212,0,115,0.5)]" />
                      <span className="text-white/80">In Transit</span>
                   </div>
                </div>
                <button 
                  onClick={onClose}
                  className="w-11 h-11 rounded-full bg-white/5 hover:bg-[#D40073] hover:text-white flex items-center justify-center transition-all duration-300 text-white/60 active:scale-90 border border-white/5"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* ── Map Container ── */}
            <div className="flex-1 relative bg-[#0B0F1A] overflow-hidden">
              <MapContainer 
                center={initialCenter} zoom={selectedAgent ? 15 : 13} 
                className="w-full h-full z-0" zoomControl={false} attributionControl={false}
              >
                <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                
                {activeAgents.map((agent) => (
                  <Marker 
                    key={agent.id} position={[agent.location.lat, agent.location.lng]} icon={createAgentIcon(agent.status)}
                  >
                    <Popup className="agent-popup-custom shadow-none" offset={[0, -10]}>
                      <div className="w-[280px] p-0 overflow-hidden font-sans bg-[#151B2B] text-white">
                        {/* Agent Identity */}
                        <div className="p-5 bg-gradient-to-br from-[#1C2539] to-[#151B2B] border-b border-white/5">
                          <div className="flex items-center gap-4 mb-4">
                            <div className={`relative w-14 h-14 rounded-[18px] flex items-center justify-center text-[20px] font-black border-2 ${
                              agent.status === 'On Delivery' ? 'border-[#D40073] bg-[#D40073]/10 text-[#D40073]' : 'border-[#16A34A] bg-[#16A34A]/10 text-[#16A34A]'
                            }`}>
                              {agent.name.split(' ').map(n => n[0]).join('')}
                              {agent.status === 'On Delivery' && (
                                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#D40073] rounded-full border-2 border-[#151B2B] flex items-center justify-center">
                                  <Navigation size={10} className="text-white transform rotate-45" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                   <StatusBadge status={agent.status} />
                                   <div className="flex items-center gap-1 text-[#EAB308] text-[11px] font-black">
                                      <Star size={12} fill="currentColor" />
                                      {agent.rating}
                                   </div>
                                </div>
                                <h4 className="text-[17px] font-black text-white truncate tracking-tight">{agent.name}</h4>
                                <p className="text-[12px] font-bold text-[#8B93A7]">{agent.id}</p>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                             <div className="flex-1 flex items-center gap-2 h-9 px-3 bg-white/5 border border-white/10 rounded-[10px]">
                                <VehicleIcon type={agent.vehicleType} />
                                <span className="text-[11px] font-black text-white uppercase tracking-wider">{agent.vehicleType}</span>
                             </div>
                             <div className="flex-1 flex items-center gap-2 h-9 px-3 bg-white/5 border border-white/10 rounded-[10px]">
                                <ShieldCheck size={14} className="text-[#16A34A]" />
                                <span className="text-[11px] font-black text-white uppercase tracking-wider">Verified</span>
                             </div>
                          </div>
                        </div>

                        {/* Performance Stats */}
                        <div className="p-5 space-y-4 bg-[#151B2B]">
                           <div className="grid grid-cols-2 gap-4">
                              <div>
                                 <p className="text-[10px] font-bold text-[#8B93A7] uppercase tracking-widest mb-1.5">Completed</p>
                                 <p className="text-[18px] font-black text-white leading-none">{agent.deliveries}</p>
                                 <p className="text-[10px] font-semibold text-[#16A34A] mt-1 flex items-center gap-1">
                                    <Clock size={10} /> Lifetime
                                 </p>
                              </div>
                              <div className="text-right">
                                 <p className="text-[10px] font-bold text-[#8B93A7] uppercase tracking-widest mb-1.5">Reg No.</p>
                                 <p className="text-[16px] font-black text-white leading-none">{agent.licensePlate}</p>
                              </div>
                           </div>

                           <button className="w-full h-12 bg-white text-[#111111] hover:bg-[#D40073] hover:text-white rounded-[14px] text-[13px] font-black flex items-center justify-center gap-2.5 transition-all duration-300 shadow-xl shadow-black/20 active:scale-95">
                              <Phone size={16} />
                              Quick Contact
                           </button>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>

              {/* ── Fleet Summary Overlay ── */}
              <div className="absolute bottom-12 left-12 w-[340px] p-8 bg-[#151B2B]/90 backdrop-blur-2xl rounded-[32px] border border-white/10 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)] z-[1000]">
                 <div className="flex items-center justify-between mb-6">
                    <p className="text-[12px] font-black text-white uppercase tracking-[0.15em]">Fleet Operations</p>
                    <div className="px-2 py-1 bg-[#16A34A] text-white text-[9px] font-black rounded-lg uppercase">Optimal</div>
                 </div>
                 
                 <div className="flex items-end gap-6 mb-6">
                    <div className="flex-1">
                       <p className="text-[11px] font-bold text-[#8B93A7] uppercase mb-1">Available</p>
                       <div className="flex items-center gap-2">
                          <span className="text-[32px] font-black text-white leading-none">{totalAvailable}</span>
                          <div className="w-2.5 h-2.5 rounded-full bg-[#16A34A] shadow-[0_0_10px_#16A34A]" />
                       </div>
                    </div>
                    <div className="flex-1 text-right">
                       <p className="text-[11px] font-bold text-[#8B93A7] uppercase mb-1">In Transit</p>
                       <div className="flex items-center justify-end gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#D40073] shadow-[0_0_10px_#D40073]" />
                          <span className="text-[32px] font-black text-white leading-none">{totalActive}</span>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-black text-white/60 uppercase">
                       <span>Availability Health</span>
                       <span className="text-white">{healthPercent}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                          initial={{ width: 0 }} animate={{ width: `${healthPercent}%` }}
                          className="h-full bg-gradient-to-r from-[#16A34A] to-[#22C55E] shadow-[0_0_10px_rgba(22,163,74,0.3)]" 
                       />
                    </div>
                 </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
