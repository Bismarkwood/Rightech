import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, User, Phone, Star, Bike, Car, Truck, 
  Trash2, MapPin, Package, CheckCircle2, Calendar, ShieldAlert, Edit2, Save
} from 'lucide-react';

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

// Mock delivery history
const MOCK_HISTORY = [
  { id: 'DL-8932', date: 'Today, 2:30 PM', destination: 'Osu, Oxford St', status: 'completed', distance: '4.2 km' },
  { id: 'DL-8929', date: 'Today, 11:15 AM', destination: 'Cantonments, 4th Circular', status: 'completed', distance: '2.8 km' },
  { id: 'DL-8810', date: 'Yesterday, 4:45 PM', destination: 'East Legon, Boundary Rd', status: 'completed', distance: '8.5 km' },
  { id: 'DL-8795', date: 'Yesterday, 1:20 PM', destination: 'Spintex Road, Coca Cola', status: 'completed', distance: '12.1 km' },
  { id: 'DL-8782', date: 'Mon, 9:00 AM', destination: 'Tema Comm 1, Market', status: 'completed', distance: '18.4 km' },
  { id: 'DL-8750', date: 'Sun, 3:10 PM', destination: 'Madina, Zongo Junction', status: 'completed', distance: '9.3 km' },
];

export function AgentProfileDrawer({ isOpen, onClose, agent, onDelete, onUpdate }: AgentProfileDrawerProps) {
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

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'bike': return <Bike size={18} />;
      case 'van': return <Car size={18} />;
      case 'truck': return <Truck size={18} />;
      default: return <Bike size={18} />;
    }
  };

  const handleDeleteConfirm = () => {
    onDelete(agent.id);
    setIsDeleting(false);
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate({
        ...agent,
        ...editData
      });
    }
    setIsEditing(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#111111]/20 z-40 backdrop-blur-[2px]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-[480px] bg-white border-l border-[#ECEDEF] z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="h-[80px] px-8 flex items-center justify-between border-b border-[#ECEDEF] shrink-0 bg-white">
              <div>
                <h2 className="text-[20px] font-bold text-[#111111]">{isEditing ? 'Edit Profile' : 'Agent Profile'}</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[13px] text-[#525866] font-medium">{agent.id}</span>
                  <span className="w-1 h-1 rounded-full bg-[#D40073]" />
                  <span className={`text-[12px] font-bold uppercase tracking-wider ${agent.status === 'active' ? 'text-[#16A34A]' : 'text-[#8B93A7]'}`}>
                    {agent.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {!isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="h-10 px-4 rounded-[12px] bg-[#F7F7F8] hover:bg-[#E4E7EC] flex items-center gap-2 text-[13px] font-bold text-[#111111] transition-colors"
                  >
                    <Edit2 size={16} /> Edit
                  </button>
                )}
                <button 
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-white border border-[#ECEDEF] hover:bg-[#F7F7F8] flex items-center justify-center transition-colors text-[#111111]"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-8 space-y-8">
                
                {/* Agent Identity Card */}
                <div className="bg-white border border-[#ECEDEF] rounded-[16px] p-6 flex flex-col gap-6 relative overflow-hidden shadow-sm">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-[#D40073]/5 rounded-bl-[100px] -z-10" />
                  
                  <div className="flex items-start gap-5">
                    <div className="relative shrink-0">
                      <div className="w-[84px] h-[84px] rounded-full bg-[#F7F7F8] flex items-center justify-center border border-[#ECEDEF]">
                        <User size={36} className="text-[#8B93A7]" />
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-[#111111] text-white px-2 py-1 rounded-[8px] flex items-center gap-1 border-2 border-white shadow-sm">
                        <Star size={12} className="text-[#FEF08A]" fill="currentColor" />
                        <span className="text-[12px] font-bold">{agent.rating}</span>
                      </div>
                    </div>
  
                    <div className="flex-1 pt-2 w-full">
                      {isEditing ? (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider mb-1">Full Name</label>
                            <input 
                              type="text" 
                              value={editData.name}
                              onChange={e => setEditData({...editData, name: e.target.value})}
                              className="w-full h-10 px-3 bg-[#F7F7F8] border border-[#E4E7EC] focus:border-[#D40073] rounded-[8px] outline-none text-[14px] font-bold text-[#111111] transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider mb-1">Phone Number</label>
                            <input 
                              type="tel" 
                              value={editData.phone}
                              onChange={e => setEditData({...editData, phone: e.target.value})}
                              className="w-full h-10 px-3 bg-[#F7F7F8] border border-[#E4E7EC] focus:border-[#D40073] rounded-[8px] outline-none text-[14px] font-medium text-[#111111] transition-colors"
                            />
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3 className="text-[22px] font-bold text-[#111111] mb-2">{agent.name}</h3>
                          <div className="flex items-center gap-2 text-[14px] text-[#525866] mb-1">
                            <Phone size={16} className="text-[#8B93A7]" />
                            {agent.phone}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Vehicle Section inside Identity Card */}
                  <div className="pt-5 border-t border-[#ECEDEF]">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider mb-2">Vehicle Type</label>
                          <div className="grid grid-cols-3 gap-2">
                            {VEHICLE_TYPES.map(type => (
                              <button
                                key={type.id}
                                onClick={() => setEditData({...editData, vehicleType: type.id})}
                                className={`h-[44px] flex items-center justify-center gap-2 rounded-[8px] border text-[13px] font-bold transition-colors ${
                                  editData.vehicleType === type.id 
                                    ? 'bg-[#FFF5F9] border-[#D40073] text-[#D40073]' 
                                    : 'bg-white border-[#E4E7EC] text-[#525866] hover:bg-[#F7F7F8]'
                                }`}
                              >
                                <type.icon size={16} />
                                {type.label.split(' ')[0]}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider mb-1">License Plate / ID</label>
                          <input 
                            type="text" 
                            value={editData.licensePlate}
                            onChange={e => setEditData({...editData, licensePlate: e.target.value})}
                            className="w-full h-10 px-3 bg-[#F7F7F8] border border-[#E4E7EC] focus:border-[#D40073] rounded-[8px] outline-none text-[14px] font-medium text-[#111111] uppercase transition-colors"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#525866]">
                          {getVehicleIcon(agent.vehicleType)}
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider mb-0.5">Vehicle</p>
                          <p className="text-[14px] font-bold text-[#111111] capitalize">{agent.vehicleType} • {agent.licensePlate}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {!isEditing && (
                  <>
                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#F7F7F8] border border-[#ECEDEF] rounded-[16px] p-5 flex flex-col justify-center transition-transform hover:scale-[1.02]">
                        <div className="flex items-center gap-2 text-[#525866] mb-2">
                          <Package size={18} className="text-[#8B93A7]" />
                          <span className="text-[12px] font-bold uppercase tracking-wider">Total Deliveries</span>
                        </div>
                        <p className="text-[28px] font-bold text-[#111111]">{agent.deliveries}</p>
                      </div>
                      <div className="bg-[#F7F7F8] border border-[#ECEDEF] rounded-[16px] p-5 flex flex-col justify-center transition-transform hover:scale-[1.02]">
                        <div className="flex items-center gap-2 text-[#525866] mb-2">
                          <Calendar size={18} className="text-[#8B93A7]" />
                          <span className="text-[12px] font-bold uppercase tracking-wider">Joined Date</span>
                        </div>
                        <p className="text-[18px] font-bold text-[#111111] mt-1">Oct 2023</p>
                      </div>
                    </div>

                    {/* Delivery History Section */}
                    <div>
                      <h3 className="text-[16px] font-bold text-[#111111] mb-4">Recent Deliveries</h3>
                      <div className="bg-white border border-[#ECEDEF] rounded-[16px] overflow-hidden">
                        {MOCK_HISTORY.map((history, index) => (
                          <div 
                            key={history.id} 
                            className={`p-4 flex items-start gap-4 ${index !== MOCK_HISTORY.length - 1 ? 'border-b border-[#ECEDEF]' : ''} hover:bg-[#FBFBFC] transition-colors`}
                          >
                            <div className="w-10 h-10 rounded-full bg-[#ECFDF3] flex items-center justify-center shrink-0 border border-[#D1FADF]">
                              <CheckCircle2 size={18} className="text-[#16A34A]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[14px] font-bold text-[#111111]">{history.id}</span>
                                <span className="text-[12px] font-medium text-[#8B93A7]">{history.date}</span>
                              </div>
                              <div className="flex items-start gap-1.5 text-[13px] text-[#525866]">
                                <MapPin size={14} className="shrink-0 mt-0.5 text-[#D40073]" />
                                <span className="truncate">{history.destination}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button className="w-full h-[48px] mt-4 rounded-[12px] border border-[#ECEDEF] bg-white text-[#111111] font-bold text-[14px] hover:bg-[#F7F7F8] transition-colors">
                        View Full History
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Footer / Actions */}
            <div className="p-8 border-t border-[#ECEDEF] bg-white shrink-0">
              {isEditing ? (
                <div className="flex gap-4">
                  <button 
                    onClick={() => {
                      setIsEditing(false);
                      setEditData({
                        name: agent.name || '',
                        phone: agent.phone || '',
                        vehicleType: agent.vehicleType || '',
                        licensePlate: agent.licensePlate || '',
                      });
                    }}
                    className="flex-1 h-[48px] rounded-[14px] bg-[#F3F4F6] text-[#525866] font-bold text-[14px] hover:bg-[#E4E7EC] hover:text-[#111111] transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={!editData.name || !editData.phone || !editData.vehicleType || !editData.licensePlate}
                    className="flex-1 h-[48px] rounded-[14px] bg-gradient-to-r from-[#111111] to-[#333333] text-white font-bold text-[14px] hover:shadow-lg disabled:opacity-50 disabled:hover:shadow-none transition-all flex items-center justify-center gap-2"
                  >
                    <Save size={18} /> Save Changes
                  </button>
                </div>
              ) : isDeleting ? (
                <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-[16px] p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <ShieldAlert size={20} className="text-[#DC2626] shrink-0" />
                    <div>
                      <h4 className="text-[14px] font-bold text-[#DC2626]">Delete Agent?</h4>
                      <p className="text-[13px] text-[#991B1B] mt-1">This action cannot be undone. They will be removed from all active rosters.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setIsDeleting(false)}
                      className="flex-1 h-[40px] rounded-[8px] bg-white border border-[#FECACA] text-[#525866] font-bold text-[13px] hover:bg-[#FEE2E2] transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleDeleteConfirm}
                      className="flex-1 h-[40px] rounded-[8px] bg-[#DC2626] text-white font-bold text-[13px] hover:bg-[#B91C1C] transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 size={16} /> Yes, Delete
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setIsDeleting(true)}
                  className="w-full h-[48px] rounded-[12px] border border-[#FECACA] bg-[#FEF2F2] text-[#DC2626] font-bold text-[14px] flex items-center justify-center gap-2 hover:bg-[#FEE2E2] hover:border-[#FCA5A5] transition-colors"
                >
                  <Trash2 size={18} />
                  Remove Agent
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}