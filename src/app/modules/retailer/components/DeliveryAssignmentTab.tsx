import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from '@iconify/react';
import { useRetailer } from './RetailerContext';

// Mock agents data (could be moved to a separate file later)
const MOCK_AGENTS = [
  { id: 'AGT-1', name: 'James Osei', vehicle: 'Motorcycle', rating: 4.8, status: 'Available', zone: 'Accra Central' },
  { id: 'AGT-2', name: 'Sandra Appiah', vehicle: 'Van', rating: 4.9, status: 'Available', zone: 'Osu / Labadi' },
  { id: 'AGT-3', name: 'Robert Tetteh', vehicle: 'Motorcycle', rating: 4.7, status: 'On Delivery', zone: 'East Legon' },
  { id: 'AGT-4', name: 'Emmanuel Boateng', vehicle: 'Motorcycle', rating: 4.5, status: 'Available', zone: 'Spintex' },
];

export function DeliveryAssignmentTab() {
  const { orders, assignAgent } = useRetailer();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);

  // Filter orders from context
  const dispatchQueue = useMemo(() => 
    orders.filter(o => o.delStatus === 'Ready'),
    [orders]
  );

  const activeDeliveries = useMemo(() => 
    orders.filter(o => o.delStatus === 'In Transit'),
    [orders]
  );

  const selectedOrder = useMemo(() => 
    dispatchQueue.find(o => o.id === selectedOrderId),
    [dispatchQueue, selectedOrderId]
  );

  const handleAssign = async () => {
    if (!selectedOrderId || !selectedAgentId) return;
    
    setIsAssigning(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    assignAgent(selectedOrderId, selectedAgentId);
    
    setIsAssigning(false);
    setSelectedOrderId(null);
    setSelectedAgentId(null);
  };

  return (
    <div className="flex h-full gap-6 overflow-hidden">
      {/* Left Panel: Dispatch Queue */}
      <div className="flex-1 flex flex-col bg-white border border-[#ECEDEF] rounded-[20px] overflow-hidden">
        <div className="p-5 border-b border-[#ECEDEF] flex items-center justify-between bg-[#FBFBFC]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#D40073]/10 flex items-center justify-center text-[#D40073]">
              <Icon icon="solar:box-minimalistic-bold" className="text-[18px]" />
            </div>
            <h3 className="text-[16px] font-bold text-[#111111]">Dispatch Queue</h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#D40073]/10 text-[#D40073] text-[12px] font-bold">
            {dispatchQueue.length} Ready
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {dispatchQueue.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 rounded-full bg-[#F3F4F6] flex items-center justify-center mb-4">
                <Icon icon="solar:document-text-linear" className="text-[32px] text-[#8B93A7]" />
              </div>
              <p className="text-[14px] font-bold text-[#111111]">No orders ready for dispatch</p>
              <p className="text-[12px] text-[#8B93A7] mt-1">Ready orders from the Orders tab will appear here</p>
            </div>
          ) : (
            dispatchQueue.map(order => (
              <motion.div
                key={order.id}
                layoutId={`order-${order.id}`}
                onClick={() => setSelectedOrderId(order.id)}
                className={`p-4 rounded-[16px] border transition-all cursor-pointer group ${
                  selectedOrderId === order.id 
                    ? 'border-[#D40073] bg-[#FFF5FA]' 
                    : 'border-[#ECEDEF] hover:border-[#D40073]/30 hover:bg-[#FBFBFC]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[14px] font-bold text-[#111111]">{order.id}</span>
                  <span className="text-[12px] font-bold text-[#D40073]">{order.amount}</span>
                </div>
                <div className="flex items-center gap-2 text-[13px] text-[#525866] mb-1">
                  <Icon icon="solar:user-linear" />
                  <span className="truncate">{order.customer}</span>
                </div>
                <div className="flex items-center gap-2 text-[12px] text-[#8B93A7]">
                  <Icon icon="solar:map-point-linear" />
                  <span className="truncate">{order.deliveryAddress || 'No address provided'}</span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Middle Panel: Active Deliveries / Tracking */}
      <div className="flex-1 flex flex-col bg-[#FBFBFC] border border-[#ECEDEF] rounded-[20px] overflow-hidden">
        <div className="p-5 border-b border-[#ECEDEF] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB]">
              <Icon icon="solar:routing-2-bold" className="text-[18px]" />
            </div>
            <h3 className="text-[16px] font-bold text-[#111111]">Active Deliveries</h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-[12px] font-bold">
            {activeDeliveries.length} In Transit
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeDeliveries.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
              <Icon icon="solar:map-point-wave-linear" className="text-[48px] text-[#8B93A7] mb-3" />
              <p className="text-[13px] font-medium text-[#525866]">No dispatches currently in transit</p>
            </div>
          ) : (
            activeDeliveries.map(order => (
              <div key={order.id} className="bg-white p-4 rounded-[16px] border border-[#ECEDEF]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-[#111111]">{order.id}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                  </div>
                  <span className="text-[11px] font-bold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded-full uppercase tracking-wider">In Transit</span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider">
                    <span>Progress</span>
                    <span>65%</span>
                  </div>
                  <div className="h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '65%' }}
                      className="h-full bg-[#2563EB]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 py-2 border-t border-[#F3F4F6]">
                  <div className="w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center overflow-hidden">
                    <Icon icon="solar:user-circle-bold" className="text-[24px] text-[#8B93A7]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[12px] font-bold text-[#111111] truncate">James Osei</div>
                    <div className="text-[11px] text-[#8B93A7] font-medium">Motorcycle • {order.deliveryAddress}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Dispatch Summary Card (Selected State) */}
        <AnimatePresence>
          {selectedOrder && (
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="p-5 bg-white border-t border-[#ECEDEF]"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider">Ready to Dispatch</div>
                  <div className="text-[15px] font-bold text-[#111111] mt-0.5">{selectedOrder.id} • {selectedOrder.customer}</div>
                </div>
                <div className="text-right">
                  <div className="text-[18px] font-extrabold text-[#D40073]">{selectedOrder.amount}</div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedOrderId(null)}
                  className="flex-1 h-11 rounded-[12px] bg-[#F3F4F6] hover:bg-[#E4E7EC] text-[#525866] font-bold text-[14px] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssign}
                  disabled={!selectedAgentId || isAssigning}
                  className={`flex-[2] h-11 rounded-[12px] font-bold text-[14px] flex items-center justify-center gap-2 transition-all ${
                    !selectedAgentId 
                      ? 'bg-[#F3F4F6] text-[#8B93A7] cursor-not-allowed' 
                      : 'bg-[#D40073] text-white hover:bg-[#B80063] active:scale-[0.98]'
                  }`}
                >
                  {isAssigning ? (
                    <Icon icon="eos-icons:loading" className="text-[20px]" />
                  ) : (
                    <>
                      <Icon icon="solar:check-circle-bold" className="text-[18px]" />
                      Confirm & Dispatch
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Panel: Agent Selection */}
      <div className="w-[340px] flex flex-col bg-white border border-[#ECEDEF] rounded-[20px] overflow-hidden">
        <div className="p-5 border-b border-[#ECEDEF] bg-[#FBFBFC]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#16A34A]/10 flex items-center justify-center text-[#16A34A]">
              <Icon icon="solar:user-bold" className="text-[18px]" />
            </div>
            <h3 className="text-[16px] font-bold text-[#111111]">Assign Agent</h3>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {MOCK_AGENTS.map(agent => (
            <div
              key={agent.id}
              onClick={() => setSelectedAgentId(agent.id)}
              className={`p-4 rounded-[16px] border transition-all cursor-pointer group ${
                selectedAgentId === agent.id 
                  ? 'border-[#16A34A] bg-[#F0FDF4]' 
                  : 'border-[#ECEDEF] hover:border-[#16A34A]/30 hover:bg-[#FBFBFC]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-[#ECFDF3] flex items-center justify-center text-[#16A34A] font-bold text-[14px]">
                    {agent.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-[#111111]">{agent.name}</div>
                    <div className="text-[11px] text-[#8B93A7] font-medium">{agent.vehicle} • {agent.zone}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-[12px] font-bold text-[#D97706]">
                    <Icon icon="solar:star-bold" />
                    {agent.rating}
                  </div>
                  <div className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${
                    agent.status === 'Available' ? 'text-[#16A34A]' : 'text-[#8B93A7]'
                  }`}>
                    {agent.status}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}