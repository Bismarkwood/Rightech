import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, User, Phone, Star, Bike, Car, Truck, 
  Trash2, MapPin, Package, CheckCircle2, Calendar, ShieldAlert, Edit2, Save
} from 'lucide-react';
import { Icon } from '@iconify/react';

interface AgentProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  agent: any | null;
  onDelete: (id: string) => void;
  onUpdate?: (agent: any) => void;
}

const VEHICLE_TYPES = [
  { id: 'bike', label: 'Motorbike', icon: Bike },
  { id: 'van', label: 'Delivery Van', icon: Car },
  { id: 'truck', label: 'Box Truck', icon: Truck },
];

const MOCK_HISTORY = [
  { id: 'DL-8932', date: 'Today, 2:30 PM', destination: 'Osu, Oxford St', status: 'completed', distance: '4.2 km' },
  { id: 'DL-8929', date: 'Today, 11:15 AM', destination: 'Cantonments, 4th Circular', status: 'completed', distance: '2.8 km' },
  { id: 'DL-8810', date: 'Yesterday, 4:45 PM', destination: 'East Legon, Boundary Rd', status: 'completed', distance: '8.5 km' },
  { id: 'DL-8795', date: 'Yesterday, 1:20 PM', destination: 'Spintex Road, Coca Cola', status: 'completed', distance: '12.1 km' },
  { id: 'DL-8782', date: 'Mon, 9:00 AM', destination: 'Tema Comm 1, Market', status: 'completed', distance: '18.4 km' },
];

export function AgentProfileModal({ isOpen, onClose, agent, onDelete, onUpdate }: AgentProfileDrawerProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    phone: '',
    vehicleType: '',
    licensePlate: '',
  });

  useEffect(() => {
    if (agent && isOpen) {
      setEditData({
        name: agent.name || '',
        phone: agent.phone || '',
        vehicleType: agent.vehicleType || '',
        licensePlate: agent.licensePlate || '',
      });
      setIsEditing(false);
      setIsDeleting(false);
    }
  }, [agent, isOpen]);

  if (!agent) return null;

  const handleSave = () => {
    if (onUpdate) {
      onUpdate({ ...agent, ...editData });
    }
    setIsEditing(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto overflow-x-hidden no-scrollbar">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#111111]/40 backdrop-blur-md z-[-1]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-[640px] bg-white/95 backdrop-blur-2xl rounded-[32px] border border-white/20 overflow-hidden flex flex-col relative my-auto"
          >
            {/* Elegant Header with Abstract Shape */}
            <div className="relative h-[200px] shrink-0 overflow-hidden bg-gradient-to-br from-[#111111] to-[#333333]">
              <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-[#D40073]/20 rounded-full blur-3xl opacity-60" />
              <div className="absolute bottom-[-30px] left-[-30px] w-40 h-40 bg-[#D40073]/10 rounded-full blur-2xl opacity-40" />
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="flex items-end justify-between">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-[100px] h-[100px] rounded-[24px] bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center overflow-hidden">
                        {agent.avatar ? (
                          <img src={agent.avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <User size={48} className="text-white/40" />
                        )}
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-white text-[#111111] px-2 py-1 rounded-[10px] flex items-center gap-1.5 border-2 border-[#111111]">
                        <Star size={12} className="text-[#D40073]" fill="currentColor" />
                        <span className="text-[12px] font-black">{agent.rating}</span>
                      </div>
                    </div>
                    <div className="mb-2">
                       <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-[#D40073] text-white text-[9px] font-black rounded-full uppercase tracking-widest border border-white/20">
                          {agent.id}
                        </span>
                        <div className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-[#16A34A]' : 'bg-[#8B93A7]'}`} />
                       </div>
                       <h2 className="text-[28px] font-black text-white tracking-tight leading-tight">{agent.name}</h2>
                       <p className="text-white/60 text-[14px] font-medium flex items-center gap-2 mt-1">
                        <Phone size={14} className="text-[#D40073]" />
                        {agent.phone}
                       </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-3 mb-2">
                    <button 
                      onClick={onClose}
                      className="w-10 h-10 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 flex items-center justify-center transition-all text-white group"
                    >
                      <X size={20} className="group-hover:scale-110 transition-transform" />
                    </button>
                    {!isEditing && (
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="h-10 px-4 rounded-[14px] bg-white text-[#111111] hover:scale-[1.02] flex items-center gap-2 text-[13px] font-bold transition-all"
                      >
                        <Edit2 size={16} className="text-[#D40073]" /> Edit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto max-h-[60vh] no-scrollbar">
              <div className="p-8 space-y-8">
                {isEditing ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-2 gap-6">
                      <div className="col-span-2">
                        <label className="text-[12px] font-black text-[#111111] uppercase tracking-wider mb-2 block">Agent Name</label>
                        <input 
                          type="text" 
                          value={editData.name}
                          onChange={e => setEditData({...editData, name: e.target.value})}
                          className="w-full h-12 px-4 bg-[#F7F7F8] border border-[#E4E7EC] focus:border-[#D40073] focus:ring-4 focus:ring-[#D40073]/5 rounded-[16px] outline-none text-[15px] font-bold text-[#111111] transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-[12px] font-black text-[#111111] uppercase tracking-wider mb-2 block">Vehicle Type</label>
                        <div className="flex gap-2">
                          {VEHICLE_TYPES.map(type => (
                            <button
                              key={type.id}
                              onClick={() => setEditData({...editData, vehicleType: type.id})}
                              className={`flex-1 h-12 rounded-[14px] border transition-all flex items-center justify-center ${
                                editData.vehicleType === type.id 
                                  ? 'bg-[#111111] border-[#111111] text-white' 
                                  : 'bg-white border-[#E4E7EC] text-[#8B93A7] hover:border-[#D40073]/40'
                              }`}
                            >
                              <type.icon size={18} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-[12px] font-black text-[#111111] uppercase tracking-wider mb-2 block">License Plate</label>
                        <input 
                          type="text" 
                          value={editData.licensePlate}
                          onChange={e => setEditData({...editData, licensePlate: e.target.value.toUpperCase()})}
                          className="w-full h-12 px-4 bg-[#F7F7F8] border border-[#E4E7EC] focus:border-[#D40073] focus:ring-4 focus:ring-[#D40073]/5 rounded-[16px] outline-none text-[14px] font-bold text-[#111111] uppercase tracking-widest transition-all"
                        />
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    {/* Stats Summary */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-[#FAFBFC] border border-[#ECEDEF] rounded-[20px] p-5 flex flex-col items-center text-center transition-all hover:border-[#D40073]/20">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-3">
                          <Package size={20} className="text-[#D40073]" />
                        </div>
                        <p className="text-[24px] font-black text-[#111111]">{agent.deliveries}</p>
                        <p className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-widest">Deliveries</p>
                      </div>
                      <div className="bg-[#FAFBFC] border border-[#ECEDEF] rounded-[20px] p-5 flex flex-col items-center text-center transition-all hover:border-[#D40073]/20">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-3">
                          <Icon icon="solar:route-bold-duotone" className="text-[#D40073] text-[20px]" />
                        </div>
                        <p className="text-[24px] font-black text-[#111111]">1.2k</p>
                        <p className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-widest">KM Traveled</p>
                      </div>
                      <div className="bg-[#FAFBFC] border border-[#ECEDEF] rounded-[20px] p-5 flex flex-col items-center text-center transition-all hover:border-[#D40073]/20">
                        <div className="w-10 h-10 rounded-full bg-white border border-[#ECEDEF] flex items-center justify-center mb-3">
                          <Calendar size={20} className="text-[#D40073]" />
                        </div>
                        <p className="text-[18px] font-black text-[#111111] leading-[24px] mt-1.5">OCT '23</p>
                        <p className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-widest mt-1">Joined</p>
                      </div>
                    </div>

                    {/* Vehicle Details Card */}
                    <div className="bg-gradient-to-br from-[#FAFBFC] to-white border border-[#ECEDEF] rounded-[24px] p-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-5">
                        {editData.vehicleType === 'bike' ? <Bike size={120} /> : editData.vehicleType === 'van' ? <Car size={120} /> : <Truck size={120} />}
                      </div>
                      <h3 className="text-[12px] font-black text-[#111111] uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-1 h-3 bg-[#D40073] rounded-full" />
                        Vehicle Assignment
                      </h3>
                      <div className="flex items-center gap-4">
                         <div className="w-[52px] h-[52px] rounded-[16px] bg-[#111111] text-white flex items-center justify-center">
                            {editData.vehicleType === 'bike' ? <Bike size={24} /> : editData.vehicleType === 'van' ? <Car size={24} /> : <Truck size={24} />}
                         </div>
                         <div className="flex-1">
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="text-[15px] font-black text-[#111111] capitalize">{editData.vehicleType} Fleet</span>
                              <span className="text-[13px] font-mono font-black text-[#D40073] bg-[#D40073]/5 px-2 py-0.5 rounded-md border border-[#D40073]/10 uppercase">{editData.licensePlate}</span>
                            </div>
                            <p className="text-[13px] font-medium text-[#8B93A7]">Active tracking assigned to Central Hub</p>
                         </div>
                      </div>
                    </div>

                    {/* Delivery History */}
                    <div>
                      <div className="flex items-center justify-between mb-4 px-1">
                        <h3 className="text-[12px] font-black text-[#111111] uppercase tracking-widest flex items-center gap-2">
                          <span className="w-1 h-3 bg-[#D40073] rounded-full" />
                          Recent Manifests
                        </h3>
                        <button className="text-[11px] font-black text-[#D40073] hover:underline uppercase tracking-wider">Expand Details</button>
                      </div>
                      <div className="space-y-3">
                        {MOCK_HISTORY.map((h) => (
                          <div key={h.id} className="p-4 bg-white border border-[#ECEDEF] rounded-[20px] flex items-center gap-4 transition-all hover:border-[#111111]/10 group cursor-pointer">
                            <div className="w-11 h-11 rounded-full bg-[#F7F7F8] flex items-center justify-center text-[#111111] group-hover:bg-[#111111] group-hover:text-white transition-all scale-90 group-hover:scale-100">
                              <CheckCircle2 size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-0.5">
                                <span className="text-[14px] font-black text-[#111111]">{h.id}</span>
                                <span className="text-[11px] font-bold text-[#8B93A7]">{h.date}</span>
                              </div>
                              <div className="flex items-center gap-2 text-[12px] text-[#525866] font-medium truncate">
                                <MapPin size={12} className="text-[#D40073]" />
                                <span className="truncate">{h.destination}</span>
                                <span className="w-1 h-1 rounded-full bg-[#ECEDEF] shrink-0" />
                                <span className="shrink-0">{h.distance}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Premium Footer */}
            <div className="p-8 border-t border-[#ECEDEF] bg-[#FBFBFC] shrink-0">
               {isEditing ? (
                 <div className="flex gap-4">
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="flex-1 h-14 rounded-[20px] bg-white border border-[#ECEDEF] text-[#525866] font-bold text-[15px] hover:bg-[#F3F4F6] transition-all"
                    >
                      Discard
                    </button>
                    <button 
                      onClick={handleSave}
                      className="flex-2 flex-[2] h-14 rounded-[20px] bg-[#111111] text-white font-bold text-[15px] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                    >
                      <Save size={20} />
                      Commit Changes
                    </button>
                 </div>
               ) : isDeleting ? (
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.98 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="bg-[#DC2626]/5 border border-[#DC2626]/20 rounded-[24px] p-6"
                 >
                   <div className="flex items-start gap-4 mb-5">
                     <div className="w-12 h-12 rounded-full bg-[#DC2626] text-white flex items-center justify-center shrink-0">
                       <ShieldAlert size={24} />
                     </div>
                     <div>
                       <h4 className="text-[15px] font-black text-[#DC2626]">Offboard Agent?</h4>
                       <p className="text-[13px] text-[#991B1B]/70 font-medium mt-1">This will revoke all active credentials and manifests for {agent.name}. This is irreversible.</p>
                     </div>
                   </div>
                   <div className="flex gap-3">
                     <button onClick={() => setIsDeleting(false)} className="flex-1 h-12 rounded-[16px] bg-white border border-[#ECEDEF] text-[#525866] font-bold text-[13px] hover:bg-[#F3F4F6] transition-all">Cancel</button>
                     <button onClick={() => onDelete(agent.id)} className="flex-1 h-12 rounded-[16px] bg-[#DC2626] text-white font-bold text-[13px] hover:bg-[#B91C1C] transition-all">Confirm Offboard</button>
                   </div>
                 </motion.div>
               ) : (
                 <div className="flex items-center justify-between gap-6">
                    <button 
                      onClick={() => setIsDeleting(true)}
                      className="h-14 px-6 rounded-[20px] border border-transparent hover:border-[#DC2626]/20 text-[#DC2626] font-bold text-[14px] flex items-center gap-2 transition-all hover:bg-[#DC2626]/5"
                    >
                      <Trash2 size={18} />
                      Offboard
                    </button>
                    <button 
                      onClick={onClose}
                      className="flex-1 h-14 rounded-[20px] bg-[#111111] text-white font-bold text-[15px] transition-all"
                    >
                      Done Viewing
                    </button>
                 </div>
               )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}