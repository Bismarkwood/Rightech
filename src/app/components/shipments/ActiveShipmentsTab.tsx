import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Icon } from '@iconify/react';
import { useShipments } from '../../context/ShipmentContext';
import { Search, Filter, Plus, Ship, Plane, Truck, Train, ExternalLink, MoreVertical } from 'lucide-react';
import { CreateShipmentModal } from './CreateShipmentModal';

export function ActiveShipmentsTab() {
  const { shipments, openShipmentDetail } = useShipments();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const activeShipments = shipments.filter(s => s.status !== 'Received' && s.status !== 'Arrived');

  const filtered = activeShipments.filter(s => 
    s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.consignmentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20">
      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-[20px] border border-[#ECEDEF]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B93A7]" size={16} />
            <input 
              type="text" 
              placeholder="Search ID, Supplier, or Consignment..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 pl-10 pr-4 bg-[#F3F4F6] border-transparent rounded-[12px] text-[14px] focus:bg-white focus:border-[#D40073] outline-none transition-all w-[300px]"
            />
          </div>
          <select className="h-10 px-4 bg-[#F3F4F6] border-transparent rounded-[12px] text-[14px] font-bold text-[#111111] focus:bg-white outline-none cursor-pointer">
            <option>All Methods</option>
            <option>Sea Freight</option>
            <option>Air Freight</option>
            <option>Road</option>
          </select>
        </div>

        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="h-10 px-6 flex items-center gap-2 bg-[#D40073] text-white rounded-[12px] text-[13px] font-black hover:bg-[#B80064] transition-all shadow-lg shadow-[#D40073]/20"
        >
          <Plus size={16} strokeWidth={3} />
          New Shipment
        </button>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-[24px] border border-[#ECEDEF] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#F1F3F5] bg-[#FAFBFC]">
              <th className="px-8 py-4 text-[11px] font-black text-[#8B93A7] uppercase tracking-wider">Shipment ID</th>
              <th className="px-6 py-4 text-[11px] font-black text-[#8B93A7] uppercase tracking-wider">Supplier & Origin</th>
              <th className="px-6 py-4 text-[11px] font-black text-[#8B93A7] uppercase tracking-wider">Method</th>
              <th className="px-6 py-4 text-[11px] font-black text-[#8B93A7] uppercase tracking-wider text-center">Status</th>
              <th className="px-6 py-4 text-[11px] font-black text-[#8B93A7] uppercase tracking-wider">ETA</th>
              <th className="px-8 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F3F5]">
            {filtered.map((s) => (
              <tr 
                key={s.id} 
                onClick={() => openShipmentDetail(s.id)}
                className="hover:bg-[#FAFBFC] transition-all group cursor-pointer"
              >                <td className="px-8 py-5">
                  <div className="text-[14px] font-black text-[#111111]">{s.id}</div>
                  <div className="text-[12px] font-bold text-[#D40073] mt-0.5">#{s.consignmentId}</div>
                </td>
                <td className="px-6 py-5">
                  <div className="text-[14px] font-bold text-[#111111]">{s.supplierName}</div>
                  <div className="text-[12px] font-medium text-[#8B93A7] mt-0.5">{s.originPort}</div>
                </td>
                <td className="px-6 py-5 text-center">
                   <div className="flex flex-col items-center gap-1">
                      {s.freightMethod === 'Sea' && <Ship size={18} className="text-[#2563EB]" />}
                      {s.freightMethod === 'Air' && <Plane size={18} className="text-[#D40073]" />}
                      {s.freightMethod === 'Road' && <Truck size={18} className="text-[#16A34A]" />}
                      <span className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-tight">{s.freightMethod}</span>
                   </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex justify-center">
                    <span className={`px-4 py-1.5 rounded-full text-[12px] font-black ${
                      s.status === 'In Transit' ? 'bg-[#2563EB]/10 text-[#2563EB]' :
                      s.status === 'Dispatched' ? 'bg-[#525866]/10 text-[#525866]' :
                      'bg-[#D97706]/10 text-[#D97706]'
                    }`}>
                      {s.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="text-[14px] font-bold text-[#111111]">{new Date(s.eta).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
                  <div className="text-[11px] font-bold text-[#8B93A7] mt-0.5 uppercase tracking-wider">Scheduled</div>
                </td>
                <td className="px-8 py-5 text-right">
                   <button className="p-2 text-[#8B93A7] hover:text-[#111111] hover:bg-[#F3F4F6] rounded-lg transition-all">
                      <MoreVertical size={18} />
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filtered.length === 0 && (
          <div className="p-20 text-center">
            <Icon icon="solar:box-minimalistic-linear" className="text-[48px] text-[#ECEDEF] mx-auto mb-4" />
            <p className="text-[15px] font-bold text-[#8B93A7]">No active shipments found matching your search.</p>
          </div>
        )}
      </div>

      <CreateShipmentModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </div>
  );
}
