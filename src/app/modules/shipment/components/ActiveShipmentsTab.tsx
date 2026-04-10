import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Icon } from '@iconify/react';
import { useShipments } from '../context/ShipmentContext';
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#151B2B] p-4 rounded-[22px] border border-[#ECEDEF] dark:border-white/10 shadow-sm">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative group w-full max-w-[400px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B93A7] group-focus-within:text-[#D40073] transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search ID, Supplier, or Consignment..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 pl-11 pr-4 bg-white dark:bg-white/5 border border-[#E4E7EC] dark:border-white/10 rounded-[12px] text-[13px] font-bold text-[#111111] dark:text-white placeholder:text-[#8B93A7] focus:outline-none focus:border-[#D40073] focus:ring-4 focus:ring-[#D40073]/5 transition-all"
            />
          </div>
          <select className="h-11 px-4 bg-white dark:bg-white/5 border border-[#E4E7EC] dark:border-white/10 rounded-[12px] text-[13px] font-bold text-[#525866] dark:text-[#8B93A7] outline-none cursor-pointer appearance-none shadow-sm min-w-[160px]">
            <option>All Methods</option>
            <option>Sea Freight</option>
            <option>Air Freight</option>
            <option>Road</option>
          </select>
        </div>

        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="h-11 px-6 flex items-center gap-2 bg-[#111111] dark:bg-white text-white dark:text-[#111111] rounded-[12px] text-[13px] font-black hover:bg-[#D40073] hover:text-white transition-all active:scale-95 shadow-sm"
        >
          <Plus size={16} strokeWidth={3} />
          NEW SHIPMENT
        </button>
      </div>

      {/* Ledger Table */}
      <div className="bg-white dark:bg-[#151B2B] rounded-[22px] border border-[#ECEDEF] dark:border-white/10 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F9FAFB] dark:bg-white/5 border-b border-[#ECEDEF] dark:border-white/5">
              <th className="px-6 py-4 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest">Logistics Identifier</th>
              <th className="px-6 py-4 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest">Consignor & Dispatch</th>
              <th className="px-6 py-4 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest text-center">Channel</th>
              <th className="px-6 py-4 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest text-center">Operational Status</th>
              <th className="px-6 py-4 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest">Arrival Assessment</th>
              <th className="px-6 py-4 text-right px-6 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ECEDEF] dark:divide-white/5">
            {filtered.map((s) => (
              <tr 
                key={s.id} 
                onClick={() => openShipmentDetail(s.id)}
                className="hover:bg-[#FBFBFC] dark:hover:bg-white/10 transition-all border-b border-[#ECEDEF] dark:border-white/5 group cursor-pointer"
              >
                <td className="px-6 py-4">
                  <div className="text-[14px] font-black text-[#111111] dark:text-white uppercase tracking-tight group-hover:text-[#D40073] transition-colors">{s.id}</div>
                  <div className="text-[11px] font-black text-[#8B93A7] mt-1 uppercase tracking-widest opacity-80">Ref: {s.consignmentId}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-[14px] font-black text-[#111111] dark:text-white uppercase tracking-tight">{s.supplierName}</div>
                  <div className="text-[11px] font-bold text-[#8B93A7] uppercase mt-1 tracking-widest">{s.originPort}</div>
                </td>
                <td className="px-6 py-4 text-center">
                   <div className="flex flex-col items-center gap-1.5">
                      {s.freightMethod === 'Sea' && <Ship size={20} className="text-[#2563EB]" />}
                      {s.freightMethod === 'Air' && <Plane size={20} className="text-[#D40073]" />}
                      {s.freightMethod === 'Road' && <Truck size={20} className="text-[#16A34A]" />}
                      <span className="text-[11px] font-black text-[#8B93A7] uppercase tracking-widest">{s.freightMethod}</span>
                   </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <span className={`px-2.5 py-1 rounded-[6px] text-[11px] font-black uppercase tracking-wider border shadow-sm ${
                      s.status === 'In Transit' ? 'bg-[#ECFDF5] dark:bg-[#064E3B]/30 text-[#16A34A] border-[#16A34A]/20' :
                      s.status === 'Dispatched' ? 'bg-[#EFF6FF] dark:bg-[#1E3A8A]/30 text-[#2563EB] border-[#2563EB]/20' :
                      'bg-[#FFF7ED] dark:bg-[#78350F]/30 text-[#D97706] border-[#D97706]/20'
                    }`}>
                      {s.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-[14px] font-black text-[#111111] dark:text-white uppercase tracking-tight italic">{new Date(s.eta).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  <div className="text-[11px] font-bold text-[#8B93A7] mt-1 uppercase tracking-widest italic opacity-70">Schedule Finality</div>
                </td>
                <td className="px-6 py-4 text-right">
                   <button className="w-10 h-10 inline-flex items-center justify-center text-[#8B93A7] hover:text-[#111111] dark:hover:text-white hover:bg-white dark:hover:bg-white/10 rounded-[10px] border border-transparent hover:border-[#ECEDEF] dark:hover:border-white/10 transition-all shadow-sm">
                      <MoreVertical size={18} />
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filtered.length === 0 && (
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-[#F9FAFB] dark:bg-white/5 flex items-center justify-center text-[#8B93A7] mb-6">
              <Icon icon="solar:box-minimalistic-linear" className="text-[40px]" />
            </div>
            <h3 className="text-[18px] font-black text-[#111111] dark:text-white uppercase tracking-tight">No shipments found</h3>
            <p className="text-[14px] font-bold text-[#8B93A7] mt-2 uppercase tracking-wider">Try adjusting your filters or search terms</p>
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
