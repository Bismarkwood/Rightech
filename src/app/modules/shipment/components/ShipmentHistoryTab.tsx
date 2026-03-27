import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Icon } from '@iconify/react';
import { useShipments } from '../context/ShipmentContext';
import { Search, Filter, Download, CheckCircle2, AlertTriangle, FileText, ExternalLink } from 'lucide-react';

export function ShipmentHistoryTab() {
  const { shipments, openShipmentDetail } = useShipments();
  const [searchTerm, setSearchTerm] = useState('');

  const historyShipments = shipments.filter(s => s.status === 'Arrived' || s.status === 'Received');

  const filtered = historyShipments.filter(s => 
    s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
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
              placeholder="Search history..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 pl-10 pr-4 bg-[#F3F4F6] border-transparent rounded-[12px] text-[14px] focus:bg-white focus:border-[#D40073] outline-none transition-all w-[300px]"
            />
          </div>
          <button className="h-10 px-4 flex items-center gap-2 bg-[#F3F4F6] text-[#525866] rounded-[12px] text-[13px] font-bold">
            <Filter size={16} />
            More Filters
          </button>
        </div>

        <button className="h-10 px-4 flex items-center gap-2 bg-white border border-[#E4E7EC] rounded-[12px] text-[13px] font-bold text-[#111111] hover:bg-[#F3F4F6] transition-colors">
          <Download size={16} />
          Export History
        </button>
      </div>

      {/* History Ledger */}
      <div className="bg-white rounded-[24px] border border-[#ECEDEF] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#F1F3F5] bg-[#FAFBFC]">
              <th className="px-8 py-4 text-[11px] font-black text-[#8B93A7] uppercase tracking-wider">Shipment ID</th>
              <th className="px-6 py-4 text-[11px] font-black text-[#8B93A7] uppercase tracking-wider">Supplier</th>
              <th className="px-6 py-4 text-[11px] font-black text-[#8B93A7] uppercase tracking-wider">Arrival Date</th>
              <th className="px-6 py-4 text-[11px] font-black text-[#8B93A7] uppercase tracking-wider">Warehouse</th>
              <th className="px-6 py-4 text-[11px] font-black text-[#8B93A7] uppercase tracking-wider text-center">Outcome</th>
              <th className="px-8 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F3F5]">
             {filtered.map((s) => (
              <tr 
                key={s.id} 
                onClick={() => openShipmentDetail(s.id)}
                className="hover:bg-[#FAFBFC] transition-all group cursor-pointer"
              >
                <td className="px-8 py-5">
                  <div className="text-[14px] font-black text-[#111111]">{s.id}</div>
                  <div className="text-[12px] font-bold text-[#D40073] mt-0.5">#{s.consignmentId}</div>
                </td>
                <td className="px-6 py-5">
                  <div className="text-[14px] font-bold text-[#111111]">{s.supplierName}</div>
                  <div className="text-[12px] font-medium text-[#8B93A7] mt-0.5">{s.freightMethod} Freight</div>
                </td>
                <td className="px-6 py-5">
                  <div className="text-[14px] font-bold text-[#111111]">{new Date(s.arrivalDate || s.eta).toLocaleDateString()}</div>
                  <div className="text-[11px] font-bold text-[#8B93A7] mt-0.5 uppercase tracking-wider tracking-tighter">Received by Admin</div>
                </td>
                <td className="px-6 py-5">
                   <div className="text-[14px] font-bold text-[#111111]">{s.destinationWarehouse}</div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex justify-center">
                    {s.discrepancies?.length ? (
                      <span className="px-3 py-1 bg-[#EF4444]/10 text-[#EF4444] rounded-full text-[11px] font-black flex items-center gap-1.5 uppercase tracking-tight">
                        <AlertTriangle size={12} />
                        Discrepancy
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-[#16A34A]/10 text-[#16A34A] rounded-full text-[11px] font-black flex items-center gap-1.5 uppercase tracking-tight">
                        <CheckCircle2 size={12} />
                        Good Order
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-8 py-5 text-right">
                   <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      openShipmentDetail(s.id);
                    }}
                    className="px-4 py-2 bg-white border border-[#ECEDEF] rounded-[10px] text-[12px] font-black text-[#111111] hover:border-[#D40073] transition-all"
                   >
                      Details
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
