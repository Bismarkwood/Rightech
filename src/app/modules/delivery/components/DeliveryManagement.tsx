import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Package, MapPin, Phone, User, Clock, CheckCircle2,
  AlertCircle, X, Navigation, Check, ChevronRight, Map, Plus, Car, Bike, Truck, Star, IdCard
} from 'lucide-react';
import { LiveMapModal } from './LiveMapModal';
import { NewAgentModal } from './NewAgentModal';
import { AgentProfileDrawer } from './AgentProfileDrawer';
import { useConsignment } from '../../consignment/context/ConsignmentContext';

const SUB_TABS = ['Overview', 'Assigned', 'Active', 'Completed', 'Agents', 'Notifications'];

// Mock Data
const MOCK_DELIVERIES = [
  { id: 'DL-4920', status: 'pending', customer: 'Kwame Asante', phone: '+233 54 123 4567', pickup: 'Accra Central Warehouse', dropoff: 'East Legon, Boundary Rd', distance: '5.2 km', time: '10 mins ago', priority: 'High', progress: -1, isConsignment: false },
  { id: 'DL-4921', status: 'pending', customer: 'Ama Serwaa', phone: '+233 20 987 6543', pickup: 'Spintex Branch', dropoff: 'Tema, Comm 4', distance: '12.4 km', time: '25 mins ago', priority: 'Normal', progress: -1, isConsignment: false },
  { id: 'DL-4918', status: 'active', customer: 'John Mensah', phone: '+233 24 555 7777', pickup: 'Accra Central Warehouse', dropoff: 'Osu, Oxford St', distance: '3.1 km', time: '1 hr ago', priority: 'High', progress: 1, isConsignment: false }, // 0: pickup, 1: transit, 2: delivered
  { id: 'DL-4919', status: 'active', customer: 'Kofi Osei', phone: '+233 27 111 2222', pickup: 'Spintex Branch', dropoff: 'Madina Market', distance: '8.5 km', time: '1.5 hrs ago', priority: 'Normal', progress: 0, isConsignment: false },
  { id: 'DL-4910', status: 'completed', customer: 'Yaw Yeboah', phone: '+233 55 444 3333', pickup: 'Tema Branch', dropoff: 'Ashaiman', distance: '15.0 km', time: 'Today, 09:30 AM', priority: 'Normal', progress: 2, isConsignment: false },
];

const MOCK_AGENTS = [
  { id: 'AG-1021', name: 'James Osei', phone: '+233 24 111 2222', vehicleType: 'van', licensePlate: 'GW-4910-22', status: 'active', rating: '4.8', deliveries: 1240 },
  { id: 'AG-1054', name: 'Sandra Appiah', phone: '+233 55 444 3333', vehicleType: 'bike', licensePlate: 'M-GR-201-23', status: 'active', rating: '4.9', deliveries: 856 },
  { id: 'AG-1011', name: 'Emmanuel Tetteh', phone: '+233 20 987 6543', vehicleType: 'truck', licensePlate: 'GT-8812-19', status: 'inactive', rating: '4.5', deliveries: 412 },
];

const NOTIFICATIONS = [
  { id: 1, type: 'assignment', text: 'New delivery #DL-4922 assigned to you.', time: '2 mins ago' },
  { id: 2, type: 'completed', text: 'Order #DL-4910 successfully delivered.', time: '4 hrs ago' },
  { id: 3, type: 'alert', text: 'Traffic delay reported on route to Madina Market.', time: '5 hrs ago' },
  { id: 4, type: 'update', text: 'Customer updated dropoff pin for #DL-4918.', time: '6 hrs ago' },
];

export function DeliveryManagement() {
  const { inboundConsignments, outboundConsignments } = useConsignment();
  const [activeTab, setActiveTab] = useState('Agents');
  const [deliveries, setDeliveries] = useState(MOCK_DELIVERIES);
  const [agents, setAgents] = useState(MOCK_AGENTS);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState<string | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isNewAgentOpen, setIsNewAgentOpen] = useState(false);
  const [selectedMapDelivery, setSelectedMapDelivery] = useState<any>(null);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);

  // Map Consignments to Deliveries dynamically
  const transitConsignments = [...inboundConsignments, ...outboundConsignments]
    .filter(c => c.status === 'In Transit')
    .map(c => ({
      id: c.id,
      status: 'active',
      customer: `[Consignment] ${c.partnerName}`,
      phone: 'N/A',
      pickup: c.type === 'Inbound' ? (c.location || 'Partner Hub') : 'Main Warehouse',
      dropoff: c.type === 'Outbound' ? (c.location || 'Partner Hub') : 'Main Warehouse',
      distance: 'Pending GPS',
      time: c.date,
      priority: 'High',
      progress: 1,
      isConsignment: true
    }));

  const allActiveDeliveries = [...deliveries, ...transitConsignments];

  // Actions
  const handleAccept = (id: string) => {
    setDeliveries(prev => prev.map(d => d.id === id ? { ...d, status: 'active', progress: 0 } : d));
  };

  const handleReject = (id: string) => {
    setDeliveries(prev => prev.filter(d => d.id !== id));
    setIsRejectModalOpen(null);
  };

  const handleProgress = (id: string) => {
    // If it's a consignment mapped dynamically, we skip local state update for now
    // In a real app, we would update the consignment context to 'Settled' or 'Delivered'
    setDeliveries(prev => prev.map(d => {
      if (d.id === id) {
        if (d.progress === 0) return { ...d, progress: 1 };
        if (d.progress === 1) return { ...d, status: 'completed', time: 'Just now' };
      }
      return d;
    }));
  };

  // Filtered Lists
  const assignedList = allActiveDeliveries.filter(d => d.status === 'pending');
  const activeList = allActiveDeliveries.filter(d => d.status === 'active');
  const completedList = allActiveDeliveries.filter(d => d.status === 'completed');

  // Helpers
  const Card = ({ children, className = "" }: any) => (
    <div className={`bg-white rounded-[16px] border border-[#ECEDEF] overflow-hidden ${className}`}>
      {children}
    </div>
  );

  const PriorityBadge = ({ priority }: { priority: string }) => {
    if (priority === 'High') return <span className="px-2 py-0.5 rounded-[4px] bg-[#FEF2F2] text-[#DC2626] text-[11px] font-bold">High Priority</span>;
    return <span className="px-2 py-0.5 rounded-[4px] bg-[#F3F4F6] text-[#525866] text-[11px] font-bold">Normal</span>;
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#F7F7F8] relative min-h-0">
      {/* Header & Sub Navigation */}
      <div className="px-6 md:px-8 pt-8 pb-0 bg-[#F7F7F8] shrink-0 sticky top-0 z-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-[28px] font-bold text-[#111111] tracking-tight mb-1">Delivery Agent</h1>
            <p className="text-[14px] text-[#525866]">Manage assigned tasks, active routes, and update delivery status</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setSelectedMapDelivery(activeList[0] || null);
                setIsMapOpen(true);
              }}
              className="h-[40px] px-4 flex items-center gap-2 bg-white border border-[#E4E7EC] rounded-[12px] text-[14px] font-semibold text-[#111111] hover:bg-[#F3F4F6] transition-colors"
            >
              <Navigation size={16} />
              Open Map
            </button>
          </div>
        </div>

        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar border-b border-[#ECEDEF]">
          {SUB_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-[14px] font-medium whitespace-nowrap transition-colors relative ${
                activeTab === tab ? 'text-[#D40073]' : 'text-[#525866] hover:text-[#111111]'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="deliveryTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D40073]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 min-h-0">
        <AnimatePresence mode="wait">
          
          {/* --- OVERVIEW TAB --- */}
          {activeTab === 'Overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-[1200px] mx-auto space-y-8"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-5 flex flex-col justify-between h-[120px] bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] text-white border-0 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-[100px] h-[100px] bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/3"></div>
                  <p className="text-[14px] font-medium text-white/80 relative z-10">Assigned Today</p>
                  <div className="flex items-end justify-between relative z-10">
                    <p className="text-[32px] font-bold text-white">{assignedList.length}</p>
                    <Package size={24} className="text-white/50 mb-2" />
                  </div>
                </Card>
                <Card className="p-5 flex flex-col justify-between h-[120px] bg-gradient-to-br from-[#3B82F6] to-[#2563EB] text-white border-0 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-[100px] h-[100px] bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/3"></div>
                  <p className="text-[14px] font-medium text-white/80 relative z-10">Active Deliveries</p>
                  <div className="flex items-end justify-between relative z-10">
                    <p className="text-[32px] font-bold text-white">{activeList.length}</p>
                    <Truck size={24} className="text-white/50 mb-2" />
                  </div>
                </Card>
                <Card className="p-5 flex flex-col justify-between h-[120px] bg-gradient-to-br from-[#10B981] to-[#059669] text-white border-0 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-[100px] h-[100px] bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/3"></div>
                  <p className="text-[14px] font-medium text-white/80 relative z-10">Completed Today</p>
                  <div className="flex items-end justify-between relative z-10">
                    <p className="text-[32px] font-bold text-white">{completedList.length}</p>
                    <CheckCircle2 size={24} className="text-white/50 mb-2" />
                  </div>
                </Card>
                <Card className="p-5 flex flex-col justify-between h-[120px] bg-gradient-to-br from-[#EF4444] to-[#DC2626] text-white border-0 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-[100px] h-[100px] bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/3"></div>
                  <p className="text-[14px] font-medium text-white/80 relative z-10">Failed Deliveries</p>
                  <div className="flex items-end justify-between relative z-10">
                    <p className="text-[32px] font-bold text-white">0</p>
                    <AlertCircle size={24} className="text-white/50 mb-2" />
                  </div>
                </Card>
              </div>

              <Card className="p-6">
                <h3 className="text-[16px] font-bold text-[#111111] mb-6">Activity Snapshot</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center"><Package size={16} /></div>
                    <p className="text-[14px] text-[#111111]"><span className="font-bold">{assignedList.length} new delivery tasks</span> assigned</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#ECFDF3] text-[#16A34A] flex items-center justify-center"><CheckCircle2 size={16} /></div>
                    <p className="text-[14px] text-[#111111]"><span className="font-bold">{completedList.length} deliveries completed</span> successfully</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* --- ASSIGNED DELIVERIES TAB --- */}
          {activeTab === 'Assigned' && (
            <motion.div
              key="assigned"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-[1200px] mx-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[18px] font-bold text-[#111111]">Pending Assignment ({assignedList.length})</h2>
              </div>
              
              {assignedList.length === 0 ? (
                <div className="h-[200px] flex flex-col items-center justify-center text-center border-2 border-dashed border-[#ECEDEF] rounded-[16px]">
                  <CheckCircle2 size={24} className="text-[#16A34A] mb-2" />
                  <p className="text-[14px] font-medium text-[#111111]">All caught up!</p>
                  <p className="text-[13px] text-[#525866]">No new deliveries assigned.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AnimatePresence>
                    {assignedList.map(delivery => (
                      <motion.div
                        key={delivery.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                      >
                        <Card className="p-5 flex flex-col h-full hover:border-[#D40073]/30 transition-colors">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-[16px] font-bold text-[#111111]">Order {delivery.id}</h3>
                                <span className="px-2 py-0.5 rounded-[4px] bg-[#F3F4F6] text-[#525866] text-[11px] font-bold">Pending</span>
                              </div>
                              <p className="text-[12px] text-[#8B93A7] flex items-center gap-1"><Clock size={12} /> {delivery.time}</p>
                            </div>
                            <PriorityBadge priority={delivery.priority} />
                          </div>

                          <div className="space-y-4 mb-6 flex-1">
                            <div className="relative pl-6 before:absolute before:left-[11px] before:top-2 before:bottom-[-16px] before:w-[2px] before:bg-[#E4E7EC]">
                              <div className="absolute left-2 top-1.5 w-2 h-2 rounded-full bg-[#D40073] border-2 border-white shadow-[0_0_0_2px_#D40073]" />
                              <p className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider mb-0.5">Pickup</p>
                              <p className="text-[13px] font-medium text-[#111111]">{delivery.pickup}</p>
                            </div>
                            <div className="relative pl-6">
                              <div className="absolute left-2 top-1.5 w-2 h-2 rounded-full bg-[#111111] border-2 border-white shadow-[0_0_0_2px_#111111]" />
                              <p className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider mb-0.5">Dropoff</p>
                              <p className="text-[13px] font-medium text-[#111111]">{delivery.dropoff}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-3 bg-[#F7F7F8] rounded-[8px] mb-6">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-[#ECEDEF]"><User size={14} className="text-[#525866]" /></div>
                              <div>
                                <p className="text-[13px] font-semibold text-[#111111]">{delivery.customer}</p>
                                <p className="text-[12px] text-[#525866]">{delivery.phone}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider mb-0.5">Distance</p>
                              <p className="text-[13px] font-bold text-[#111111]">{delivery.distance}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 mt-auto">
                            <button 
                              onClick={() => setIsRejectModalOpen(delivery.id)}
                              className="h-[40px] border border-[#ECEDEF] text-[#525866] font-semibold text-[14px] rounded-[12px] hover:bg-[#F3F4F6] transition-colors"
                            >
                              Reject
                            </button>
                            <button 
                              onClick={() => handleAccept(delivery.id)}
                              className="h-[40px] bg-[#D40073] hover:bg-[#B80063] text-white font-semibold text-[14px] rounded-[12px] transition-colors"
                            >
                              Accept Task
                            </button>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}

          {/* --- ACTIVE DELIVERIES TAB --- */}
          {activeTab === 'Active' && (
            <motion.div
              key="active"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-[1200px] mx-auto space-y-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[18px] font-bold text-[#111111]">In Transit ({activeList.length})</h2>
              </div>

              {activeList.length === 0 ? (
                <div className="h-[200px] flex flex-col items-center justify-center text-center border-2 border-dashed border-[#ECEDEF] rounded-[16px]">
                  <Navigation size={24} className="text-[#8B93A7] mb-2" />
                  <p className="text-[14px] font-medium text-[#111111]">No active deliveries</p>
                </div>
              ) : (
                <div className="bg-white rounded-[16px] border border-[#ECEDEF] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[#ECEDEF] bg-[#F7F7F8]">
                          <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Order ID</th>
                          <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Customer</th>
                          <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Locations</th>
                          <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Progress</th>
                          <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#ECEDEF]">
                        {activeList.map(delivery => (
                          <tr key={delivery.id} className="hover:bg-[#F7F7F8] transition-colors group">
                            <td className="py-4 px-6">
                              <span className="text-[14px] font-bold text-[#111111]">{delivery.id}</span>
                              <div className="mt-1 flex items-center gap-1">
                                {delivery.priority === 'High' && <span className="w-2 h-2 rounded-full bg-[#D40073]" />}
                                <span className="text-[12px] text-[#525866]">{delivery.priority} Priority</span>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <p className="text-[14px] font-semibold text-[#111111]">{delivery.customer}</p>
                              <a href={`tel:${delivery.phone}`} className="text-[13px] text-[#525866] hover:text-[#D40073]">{delivery.phone}</a>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-[13px] text-[#111111]">
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#111111]" />
                                  <span className="truncate max-w-[150px]" title={delivery.pickup}>{delivery.pickup}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[13px] text-[#111111]">
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#D40073]" />
                                  <span className="truncate max-w-[150px]" title={delivery.dropoff}>{delivery.dropoff}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6 min-w-[200px]">
                              <div className="flex flex-col gap-2 w-full max-w-[180px]">
                                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#8B93A7] px-1">
                                  <span className={delivery.progress >= 0 ? "text-[#111111]" : ""}>Assigned</span>
                                  <span className={delivery.progress >= 1 ? "text-[#111111]" : ""}>Picked</span>
                                  <span className={delivery.progress >= 2 ? "text-[#111111]" : ""}>Delivered</span>
                                </div>
                                <div className="h-1.5 w-full bg-[#F3F4F6] rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-[#D40073] rounded-full transition-all duration-500"
                                    style={{ width: delivery.progress === 0 ? '33%' : delivery.progress === 1 ? '66%' : '100%' }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setSelectedMapDelivery(delivery);
                                    setIsMapOpen(true);
                                  }}
                                  className="h-8 px-3 rounded-[8px] bg-white border border-[#E4E7EC] text-[#111111] hover:bg-[#F3F4F6] text-[12px] font-bold flex items-center gap-1.5 transition-colors"
                                >
                                  <Map size={14} /> Map
                                </button>
                                <button
                                  onClick={() => handleProgress(delivery.id)}
                                  className="h-8 px-3 rounded-[8px] flex items-center justify-center bg-[#111111] text-white text-[12px] font-bold hover:bg-[#333333] transition-colors whitespace-nowrap"
                                >
                                  {delivery.progress === 0 ? 'Picked Up' : 'Complete'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* --- COMPLETED DELIVERIES TAB --- */}
          {activeTab === 'Completed' && (
            <motion.div
              key="completed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-[1200px] mx-auto"
            >
               <Card className="overflow-hidden">
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="bg-[#F7F7F8] border-b border-[#ECEDEF]">
                       <th className="py-3 px-5 text-[12px] font-semibold text-[#525866] uppercase tracking-wider">Order ID</th>
                       <th className="py-3 px-5 text-[12px] font-semibold text-[#525866] uppercase tracking-wider">Delivered To</th>
                       <th className="py-3 px-5 text-[12px] font-semibold text-[#525866] uppercase tracking-wider">Date / Time</th>
                       <th className="py-3 px-5 text-[12px] font-semibold text-[#525866] uppercase tracking-wider">Status</th>
                     </tr>
                   </thead>
                   <tbody className="text-[13px]">
                     {completedList.map(delivery => (
                       <tr key={delivery.id} className="border-b border-[#ECEDEF] last:border-0 hover:bg-[#FBFBFC] transition-colors">
                         <td className="py-4 px-5 font-bold text-[#111111]">{delivery.id}</td>
                         <td className="py-4 px-5">
                           <p className="font-semibold text-[#111111]">{delivery.customer}</p>
                           <p className="text-[12px] text-[#525866]">{delivery.dropoff}</p>
                         </td>
                         <td className="py-4 px-5 font-medium text-[#525866]">{delivery.time}</td>
                         <td className="py-4 px-5">
                           <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[6px] text-[12px] font-bold bg-[#ECFDF3] text-[#16A34A]">
                             <CheckCircle2 size={12} /> Completed
                           </span>
                         </td>
                       </tr>
                     ))}
                     {completedList.length === 0 && (
                       <tr>
                         <td colSpan={4} className="py-12 text-center text-[#525866]">No completed deliveries yet.</td>
                       </tr>
                     )}
                   </tbody>
                 </table>
               </Card>
            </motion.div>
          )}

          {/* --- AGENTS TAB --- */}
          {activeTab === 'Agents' && (
            <motion.div
              key="agents"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-[1200px] mx-auto space-y-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[18px] font-bold text-[#111111]">Delivery Agents ({agents.length})</h2>
                <button
                  onClick={() => setIsNewAgentOpen(true)}
                  className="h-[40px] px-4 bg-[#D40073] hover:bg-[#B3005F] text-white font-bold text-[14px] rounded-[12px] flex items-center gap-2 transition-colors"
                >
                  <Plus size={16} />
                  Add New Agent
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {agents.map((agent) => (
                    <motion.div
                      key={agent.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <Card className="p-5 flex flex-col h-full hover:border-[#D40073]/30 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex gap-3">
                            <div className="relative">
                              <div className="w-12 h-12 rounded-full bg-[#F3F4F6] flex items-center justify-center border border-[#ECEDEF]">
                                <User size={20} className="text-[#8B93A7]" />
                              </div>
                              <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-white rounded-full ${agent.status === 'active' ? 'bg-[#16A34A]' : 'bg-[#8B93A7]'}`} />
                            </div>
                            <div>
                              <h3 className="text-[16px] font-bold text-[#111111]">{agent.name}</h3>
                              <p className="text-[12px] text-[#525866]">{agent.id}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 bg-[#FFFBEB] text-[#D97706] px-2 py-1 rounded-[6px] text-[12px] font-bold">
                            <Star size={12} fill="currentColor" /> {agent.rating}
                          </div>
                        </div>

                        <div className="space-y-3 mb-6 flex-1">
                          <div className="flex items-center gap-2 text-[13px] text-[#525866]">
                            <Phone size={14} className="text-[#8B93A7]" />
                            {agent.phone}
                          </div>
                          <div className="flex items-center gap-2 text-[13px] text-[#525866] capitalize">
                            {agent.vehicleType === 'bike' ? <Bike size={14} className="text-[#8B93A7]" /> :
                             agent.vehicleType === 'van' ? <Car size={14} className="text-[#8B93A7]" /> :
                             <Truck size={14} className="text-[#8B93A7]" />}
                            {agent.vehicleType} • {agent.licensePlate}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-[#ECEDEF]">
                          <div>
                            <p className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider mb-0.5">Total Deliveries</p>
                            <p className="text-[16px] font-bold text-[#111111]">{agent.deliveries}</p>
                          </div>
                          <button 
                            onClick={() => setSelectedAgent(agent)}
                            className="h-[36px] px-4 rounded-[8px] bg-[#F7F7F8] hover:bg-[#E4E7EC] text-[#111111] text-[13px] font-bold transition-colors"
                          >
                            View Profile
                          </button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* --- NOTIFICATIONS TAB --- */}
          {activeTab === 'Notifications' && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-[800px] mx-auto"
            >
              <Card className="flex flex-col">
                <div className="p-4 border-b border-[#ECEDEF]">
                  <h3 className="text-[16px] font-bold text-[#111111]">Recent Alerts</h3>
                </div>
                <div className="flex flex-col">
                  {NOTIFICATIONS.map(note => {
                    let dotColor = 'bg-[#8B93A7]';
                    let icon = <Navigation size={14} className="text-[#8B93A7]" />;
                    
                    if (note.type === 'assignment') { dotColor = 'bg-[#2563EB]'; icon = <Package size={14} className="text-[#2563EB]" />; }
                    if (note.type === 'completed') { dotColor = 'bg-[#16A34A]'; icon = <CheckCircle2 size={14} className="text-[#16A34A]" />; }
                    if (note.type === 'alert') { dotColor = 'bg-[#DC2626]'; icon = <AlertCircle size={14} className="text-[#DC2626]" />; }

                    return (
                      <div key={note.id} className="flex items-start gap-4 p-4 border-b border-[#ECEDEF] last:border-0 hover:bg-[#FBFBFC] transition-colors cursor-pointer">
                        <div className={`mt-0.5 shrink-0 w-[32px] h-[32px] rounded-full bg-white border border-[#ECEDEF] flex items-center justify-center`}>
                          {icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] font-medium text-[#111111]">{note.text}</p>
                          <p className="text-[12px] font-medium text-[#8B93A7] mt-1">{note.time}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Reject Modal */}
      <AnimatePresence>
        {isRejectModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsRejectModalOpen(null)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[400px] bg-white rounded-[20px] border border-[#ECEDEF] z-50 overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-[18px] font-bold text-[#111111] mb-2">Reject Task</h3>
                <p className="text-[14px] text-[#525866] mb-6">Are you sure you want to reject this delivery? It will be reassigned to another agent.</p>
                
                <div className="space-y-2 mb-8">
                  {['Too far away', 'Traffic delay', 'End of shift', 'Other reason'].map(reason => (
                    <label key={reason} className="flex items-center gap-3 p-3 border border-[#ECEDEF] rounded-[10px] cursor-pointer hover:border-[#D40073]/50 transition-colors">
                      <input type="radio" name="reject_reason" className="text-[#D40073] focus:ring-[#D40073]" />
                      <span className="text-[14px] font-medium text-[#111111]">{reason}</span>
                    </label>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsRejectModalOpen(null)}
                    className="flex-1 h-[44px] font-semibold text-[#525866] bg-[#F3F4F6] rounded-[12px] hover:bg-[#E4E7EC] transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => handleReject(isRejectModalOpen)}
                    className="flex-1 h-[44px] font-semibold text-white bg-[#DC2626] rounded-[12px] hover:bg-[#B91C1C] transition-colors"
                  >
                    Confirm Reject
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <LiveMapModal 
        isOpen={isMapOpen} 
        onClose={() => setIsMapOpen(false)} 
        delivery={selectedMapDelivery || activeList[0]} 
      />

      <NewAgentModal 
        isOpen={isNewAgentOpen}
        onClose={() => setIsNewAgentOpen(false)}
        onAdd={(newAgent) => setAgents([...agents, newAgent])}
      />

      <AgentProfileDrawer
        isOpen={!!selectedAgent}
        onClose={() => setSelectedAgent(null)}
        agent={selectedAgent}
        onDelete={(id) => {
          setAgents(agents.filter(a => a.id !== id));
          setSelectedAgent(null);
        }}
        onUpdate={(updatedAgent) => {
          setAgents(agents.map(a => a.id === updatedAgent.id ? updatedAgent : a));
          setSelectedAgent(updatedAgent);
        }}
      />
    </div>
  );
}
