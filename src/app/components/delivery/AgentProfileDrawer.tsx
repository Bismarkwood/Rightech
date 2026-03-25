import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, User, Phone, Star, Bike, Car, Truck, 
  Trash2, MapPin, Package, CheckCircle2, Calendar, ShieldAlert
} from 'lucide-react';

interface AgentProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  agent: any | null;
  onDelete: (id: string) => void;
}

// Mock delivery history
const MOCK_HISTORY = [
  { id: 'DL-8932', date: 'Today, 2:30 PM', destination: 'Osu, Oxford St', status: 'completed', distance: '4.2 km' },
  { id: 'DL-8929', date: 'Today, 11:15 AM', destination: 'Cantonments, 4th Circular', status: 'completed', distance: '2.8 km' },
  { id: 'DL-8810', date: 'Yesterday, 4:45 PM', destination: 'East Legon, Boundary Rd', status: 'completed', distance: '8.5 km' },
  { id: 'DL-8795', date: 'Yesterday, 1:20 PM', destination: 'Spintex Road, Coca Cola', status: 'completed', distance: '12.1 km' },
  { id: 'DL-8782', date: 'Mon, 9:00 AM', destination: 'Tema Comm 1, Market', status: 'completed', distance: '18.4 km' },
  { id: 'DL-8750', date: 'Sun, 3:10 PM', destination: 'Madina, Zongo Junction', status: 'completed', distance: '9.3 km' },
];

export function AgentProfileDrawer({ isOpen, onClose, agent, onDelete }: AgentProfileDrawerProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!agent) return null;

  const getVehicleIcon = () => {
    switch (agent.vehicleType) {
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
            className="fixed inset-0 bg-[#111111]/20 z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-[480px] bg-white/80 backdrop-blur-2xl border-l border-[#ECEDEF] z-50 flex flex-col"
          >
            {/* Header */}
            <div className="h-[80px] px-8 flex items-center justify-between border-b border-[#ECEDEF] shrink-0 bg-white/50">
              <div>
                <h2 className="text-[20px] font-bold text-[#111111]">Agent Profile</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[13px] text-[#525866] font-medium">{agent.id}</span>
                  <span className="w-1 h-1 rounded-full bg-[#D40073]" />
                  <span className={`text-[12px] font-bold uppercase tracking-wider ${agent.status === 'active' ? 'text-[#16A34A]' : 'text-[#8B93A7]'}`}>
                    {agent.status}
                  </span>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white border border-[#ECEDEF] hover:bg-[#F7F7F8] flex items-center justify-center transition-colors text-[#111111]"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-8 space-y-8">
                
                {/* Agent Identity Card */}
                <div className="bg-white border border-[#ECEDEF] rounded-[16px] p-6 flex items-start gap-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#D40073]/5 rounded-bl-[100px] -z-10" />
                  
                  <div className="relative shrink-0">
                    <div className="w-[72px] h-[72px] rounded-full bg-[#F7F7F8] flex items-center justify-center border border-[#ECEDEF]">
                      <User size={32} className="text-[#8B93A7]" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-[#111111] text-white px-2 py-1 rounded-[8px] flex items-center gap-1 border-2 border-white">
                      <Star size={12} className="text-[#D40073]" fill="currentColor" />
                      <span className="text-[12px] font-bold">{agent.rating}</span>
                    </div>
                  </div>

                  <div className="flex-1 pt-1">
                    <h3 className="text-[20px] font-bold text-[#111111] mb-1">{agent.name}</h3>
                    <div className="space-y-2 mt-3">
                      <div className="flex items-center gap-2 text-[14px] text-[#525866]">
                        <Phone size={16} className="text-[#8B93A7]" />
                        {agent.phone}
                      </div>
                      <div className="flex items-center gap-2 text-[14px] text-[#525866] capitalize">
                        <span className="text-[#8B93A7]">{getVehicleIcon()}</span>
                        {agent.vehicleType} • <span className="font-bold text-[#111111]">{agent.licensePlate}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#F7F7F8] border border-[#ECEDEF] rounded-[12px] p-4 flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-[#525866] mb-1">
                      <Package size={16} />
                      <span className="text-[12px] font-bold uppercase tracking-wider">Total Deliveries</span>
                    </div>
                    <p className="text-[24px] font-bold text-[#111111]">{agent.deliveries}</p>
                  </div>
                  <div className="bg-[#F7F7F8] border border-[#ECEDEF] rounded-[12px] p-4 flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-[#525866] mb-1">
                      <Calendar size={16} />
                      <span className="text-[12px] font-bold uppercase tracking-wider">Joined Date</span>
                    </div>
                    <p className="text-[16px] font-bold text-[#111111] mt-1">Oct 2023</p>
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
              </div>
            </div>

            {/* Footer / Danger Zone */}
            <div className="p-8 border-t border-[#ECEDEF] bg-white/50 shrink-0">
              {isDeleting ? (
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