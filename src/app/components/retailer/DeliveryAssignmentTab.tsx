import React, { useState } from 'react';
import { Truck, MapPin, Package, User, Star, ChevronRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

const MOCK_READY_ORDERS = [
  { id: 'ORD-8991', customer: 'K.A Enterprise', address: 'East Legon, Boundary Rd', items: 12, priority: 'High' },
  { id: 'ORD-8989', customer: 'John Mensah', address: 'Osu, Oxford St', items: 2, priority: 'Normal' },
  { id: 'ORD-8975', customer: 'Kingsway Const.', address: 'Tema Comm 1', items: 45, priority: 'Normal' },
];

const MOCK_AGENTS = [
  { id: 'AG-1021', name: 'James Osei', vehicle: 'Van', location: 'Accra Central', status: 'Available', rating: 4.8 },
  { id: 'AG-1054', name: 'Sandra Appiah', vehicle: 'Bike', location: 'Osu', status: 'Available', rating: 4.9 },
  { id: 'AG-1011', name: 'Emmanuel Tetteh', vehicle: 'Truck', location: 'Spintex', status: 'Busy', rating: 4.5 },
];

export function DeliveryAssignmentTab() {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const [assigned, setAssigned] = useState<string[]>([]);

  const handleAssign = () => {
    if (!selectedOrder || !selectedAgent) return;
    setIsAssigning(true);
    setTimeout(() => {
      setAssigned([...assigned, selectedOrder]);
      setSelectedOrder(null);
      setSelectedAgent(null);
      setIsAssigning(false);
    }, 800);
  };

  const activeOrders = MOCK_READY_ORDERS.filter(o => !assigned.includes(o.id));

  return (
    <div className="flex h-full gap-1 overflow-hidden p-6 md:p-8 max-w-[1600px] mx-auto w-full">
      {/* Left Panel - Orders */}
      <div className="flex-1 flex flex-col bg-white border border-[#ECEDEF] rounded-l-[16px] overflow-hidden">
        <div className="p-5 border-b border-[#ECEDEF] bg-[#F7F7F8]">
          <h2 className="text-[16px] font-bold text-[#111111]">Ready for Dispatch</h2>
          <p className="text-[13px] text-[#525866] mt-1">Select an order to assign a delivery agent</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activeOrders.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-[#8B93A7]">
              <CheckCircle2 size={48} className="mb-4 text-[#16A34A] opacity-20" />
              <p className="text-[14px] font-medium">All ready orders have been assigned</p>
            </div>
          ) : (
            activeOrders.map(order => (
              <div 
                key={order.id}
                onClick={() => setSelectedOrder(order.id)}
                className={`p-4 rounded-[12px] border transition-all cursor-pointer ${
                  selectedOrder === order.id 
                    ? 'border-[#D40073] bg-[#FFF0F7] shadow-[0_0_0_1px_#D40073]' 
                    : 'border-[#ECEDEF] bg-white hover:border-[#D40073]/50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="font-bold text-[#111111]">{order.id}</span>
                  {order.priority === 'High' && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#DC2626] bg-[#FEF2F2] px-2 py-0.5 rounded-[4px]">
                      High Priority
                    </span>
                  )}
                </div>
                <h4 className="text-[14px] font-semibold text-[#111111] mb-1">{order.customer}</h4>
                <div className="space-y-1.5 mt-3">
                  <div className="flex items-center gap-2 text-[12px] text-[#525866]">
                    <MapPin size={14} className="text-[#8B93A7]" />
                    {order.address}
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-[#525866]">
                    <Package size={14} className="text-[#8B93A7]" />
                    {order.items} items to deliver
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Panel - Agents */}
      <div className="w-[450px] shrink-0 flex flex-col bg-white border border-[#ECEDEF] rounded-r-[16px] overflow-hidden">
        <div className="p-5 border-b border-[#ECEDEF] bg-[#F7F7F8]">
          <h2 className="text-[16px] font-bold text-[#111111]">Available Agents</h2>
          <p className="text-[13px] text-[#525866] mt-1">Select an agent for the selected order</p>
        </div>
        
        <div className={`flex-1 overflow-y-auto p-4 space-y-3 transition-opacity ${!selectedOrder ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          {!selectedOrder && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-[1px]">
              <div className="bg-white border border-[#ECEDEF] px-4 py-2 rounded-full text-[13px] font-bold text-[#111111]">
                Select an order first
              </div>
            </div>
          )}
          
          <div className="relative h-full">
            {MOCK_AGENTS.map(agent => (
              <div 
                key={agent.id}
                onClick={() => agent.status === 'Available' && setSelectedAgent(agent.id)}
                className={`p-4 rounded-[12px] border transition-all mb-3 ${
                  agent.status !== 'Available' 
                    ? 'opacity-50 cursor-not-allowed bg-[#F7F7F8] border-[#ECEDEF]'
                    : selectedAgent === agent.id 
                      ? 'border-[#D40073] bg-[#FFF0F7] shadow-[0_0_0_1px_#D40073] cursor-pointer' 
                      : 'border-[#ECEDEF] bg-white hover:border-[#D40073]/50 cursor-pointer'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center shrink-0 border border-[#ECEDEF]">
                    <User size={18} className="text-[#8B93A7]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="text-[14px] font-bold text-[#111111] truncate">{agent.name}</h4>
                      <span className={`text-[11px] font-bold uppercase tracking-wider ${
                        agent.status === 'Available' ? 'text-[#16A34A]' : 'text-[#D97706]'
                      }`}>
                        {agent.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[12px] text-[#525866]">
                      <span className="flex items-center gap-1"><Truck size={12} /> {agent.vehicle}</span>
                      <span className="flex items-center gap-1"><MapPin size={12} /> {agent.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-5 border-t border-[#ECEDEF] bg-white shrink-0">
          <button
            onClick={handleAssign}
            disabled={!selectedOrder || !selectedAgent || isAssigning}
            className={`w-full h-12 rounded-[12px] flex items-center justify-center gap-2 text-[14px] font-bold transition-all ${
              selectedOrder && selectedAgent && !isAssigning
                ? 'bg-[#D40073] text-white hover:bg-[#B80063]' 
                : 'bg-[#F3F4F6] text-[#8B93A7] cursor-not-allowed'
            }`}
          >
            {isAssigning ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>Assign Delivery <ChevronRight size={18} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}