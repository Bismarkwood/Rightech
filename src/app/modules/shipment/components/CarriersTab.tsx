import React from 'react';
import { motion } from 'motion/react';
import { Icon } from '@iconify/react';
import { useShipments } from '../context/ShipmentContext';
import { Ship, Plane, Truck, Train, Mail, Link2, Plus, Edit2, ExternalLink } from 'lucide-react';

export function CarriersTab() {
  const { carriers } = useShipments();

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between px-2">
        <div>
          <h2 className="text-[20px] font-black text-[#111111] dark:text-white tracking-tight">Logistics Partners</h2>
          <p className="text-[14px] font-medium text-[#8B93A7]">Reference library for freight carriers and tracking templates.</p>
        </div>
        <button className="h-11 px-6 bg-[#111111] dark:bg-[#D40073] text-white rounded-[14px] text-[13px] font-black hover:bg-black dark:hover:bg-[#D40073]/90 transition-all flex items-center gap-2 shadow-sm uppercase tracking-widest">
          <Icon icon="solar:user-plus-bold" className="text-[18px]" />
          Add Carrier
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {carriers.map((carrier) => (
          <div key={carrier.id} className="bg-white dark:bg-[#151B2B] p-6 rounded-[28px] border border-[#ECEDEF] dark:border-white/10 group hover:border-[#D40073] transition-all flex flex-col h-full shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-black/5 dark:from-white/5 to-transparent rounded-bl-[40px] transition-transform group-hover:scale-110" />
            
            <div className="flex items-start justify-between mb-6 relative z-10">
              <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center border shadow-sm ${
                carrier.type === 'Sea' ? 'bg-[#EFF6FF] dark:bg-[#1E3A8A]/30 text-[#2563EB] border-[#2563EB]/10' :
                carrier.type === 'Air' ? 'bg-[#FFF5FA] dark:bg-[#D40073]/30 text-[#D40073] border-[#D40073]/10' :
                'bg-[#F0FDF4] dark:bg-[#16A34A]/30 text-[#16A34A] border-[#16A34A]/10'
              }`}>
                {carrier.type === 'Sea' && <Icon icon="solar:ship-bold" className="text-[28px]" />}
                {carrier.type === 'Air' && <Icon icon="solar:plain-2-bold" className="text-[28px]" />}
                {carrier.type === 'Road' && <Icon icon="solar:truck-bold" className="text-[28px]" />}
              </div>
              <button className="w-9 h-9 flex items-center justify-center text-[#8B93A7] hover:text-[#111111] dark:hover:text-white hover:bg-[#F3F4F6] dark:hover:bg-white/10 rounded-full transition-all border border-transparent hover:border-[#ECEDEF] dark:hover:border-white/10">
                <Icon icon="solar:pen-bold" className="text-[18px]" />
              </button>
            </div>

            <div className="flex-1 relative z-10">
              <h3 className="text-[18px] font-black text-[#111111] dark:text-white mb-1 uppercase tracking-tight group-hover:text-[#D40073] transition-colors">{carrier.name}</h3>
              <div className="flex items-center gap-2 text-[11px] font-black text-[#8B93A7] uppercase tracking-widest mb-6 opacity-80">
                {carrier.type} FREIGHT CHANNEL
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-[14px] font-black text-[#525866] dark:text-white/80 uppercase tracking-tight">
                  <Icon icon="solar:letter-bold" className="text-[#8B93A7] text-[18px]" />
                  {carrier.contact}
                </div>
                <div className="flex items-center gap-3 text-[13px] font-bold text-[#D40073] group/link cursor-pointer overflow-hidden bg-[#D40073]/5 dark:bg-[#D40073]/10 px-3 py-2 rounded-[12px] border border-[#D40073]/10">
                  <Icon icon="solar:link-bold" className="text-[#D40073] text-[18px] shrink-0" />
                  <span className="truncate group-hover/link:underline italic">{carrier.trackingUrlTemplate}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#F1F3F5] dark:border-white/5 flex items-center justify-between relative z-10">
              <div>
                <div className="text-[10px] font-black text-[#8B93A7] uppercase tracking-widest mb-1">Operational Volume</div>
                <div className="text-[18px] font-black text-[#111111] dark:text-white italic tracking-tighter">{carrier.shipmentsCount} Shipments</div>
              </div>
              <div className="w-10 h-10 rounded-[12px] bg-[#F7F7F8] dark:bg-white/5 flex items-center justify-center text-[#8B93A7] border border-transparent group-hover:border-[#ECEDEF] dark:group-hover:border-white/10 transition-all shadow-inner">
                <Icon icon="solar:round-transfer-horizontal-bold-duotone" className="text-[18px]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
