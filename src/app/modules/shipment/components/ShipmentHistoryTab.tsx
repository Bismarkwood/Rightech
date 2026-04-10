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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#151B2B] p-4 rounded-[22px] border border-[#ECEDEF] dark:border-white/10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B93A7] group-focus-within:text-[#D40073] transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search history..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[300px] h-11 pl-11 pr-4 bg-white dark:bg-white/5 border border-[#E4E7EC] dark:border-white/10 rounded-[12px] text-[13px] font-bold text-[#111111] dark:text-white placeholder:text-[#8B93A7] focus:outline-none focus:border-[#D40073] focus:ring-4 focus:ring-[#D40073]/5 transition-all shadow-sm"
            />
          </div>
          <button className="h-11 px-5 flex items-center gap-2 bg-white dark:bg-white/5 text-[#525866] dark:text-[#8B93A7] rounded-[12px] text-[13px] font-black border border-[#E4E7EC] dark:border-white/10 hover:border-[#D40073] transition-all shadow-sm group">
            <Filter size={16} className="group-hover:text-[#D40073] transition-colors" />
            ADVANCED FILTERS
          </button>
        </div>

        <button className="h-11 px-6 flex items-center gap-2 bg-[#111111] dark:bg-white text-white dark:text-[#111111] rounded-[12px] text-[13px] font-black hover:bg-[#D40073] hover:text-white transition-all active:scale-95 shadow-sm">
          <Download size={16} strokeWidth={3} />
          EXPORT HISTORY
        </button>
      </div>

      {/* History Ledger */}
      <div className="bg-white dark:bg-[#151B2B] rounded-[22px] border border-[#ECEDEF] dark:border-white/10 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F9FAFB] dark:bg-white/5 border-b border-[#ECEDEF] dark:border-white/5">
              <th className="px-6 py-4 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest">Historical Identifier</th>
              <th className="px-6 py-4 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest">Consignor Assessment</th>
              <th className="px-6 py-4 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest">Verification Date</th>
              <th className="px-6 py-4 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest">Terminal Hub</th>
              <th className="px-6 py-4 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest text-center">Audit Outcome</th>
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
                  <div className="text-[11px] font-bold text-[#8B93A7] uppercase mt-1 tracking-widest italic">{s.freightMethod} CHANNEL</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-[14px] font-black text-[#111111] dark:text-white uppercase tracking-tight italic">{new Date(s.arrivalDate || s.eta).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  <div className="text-[11px] font-bold text-[#8B93A7] mt-1 uppercase tracking-widest italic opacity-70">Audited Ledger</div>
                </td>
                <td className="px-6 py-4">
                   <div className="text-[14px] font-black text-[#111111] dark:text-white uppercase tracking-tight">{s.destinationWarehouse}</div>
                   <div className="text-[11px] font-bold text-[#8B93A7] mt-1 uppercase tracking-widest italic opacity-70">Primary Terminal</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    {s.discrepancies?.length ? (
                      <span className="px-2.5 py-1 bg-[#FEF2F2] dark:bg-[#7F1D1D]/30 text-[#EF4444] rounded-[6px] text-[11px] font-black flex items-center gap-1.5 uppercase tracking-wider border border-[#EF4444]/20 shadow-sm">
                        <Icon icon="solar:danger-triangle-bold" className="text-[14px]" />
                        Discrepancy
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-[#ECFDF5] dark:bg-[#064E3B]/30 text-[#16A34A] rounded-[6px] text-[11px] font-black flex items-center gap-1.5 uppercase tracking-wider border border-[#16A34A]/20 shadow-sm">
                        <Icon icon="solar:check-circle-bold" className="text-[14px]" />
                        Perfect Order
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                   <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      openShipmentDetail(s.id);
                    }}
                    className="h-9 px-4 bg-white dark:bg-white/5 border border-[#ECEDEF] dark:border-white/10 rounded-[10px] text-[12px] font-black text-[#111111] dark:text-white hover:border-[#D40073] hover:text-[#D40073] hover:bg-[#D40073]/5 transition-all shadow-sm uppercase tracking-wider"
                   >
                      View Details
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
