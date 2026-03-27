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
          <h2 className="text-[20px] font-black text-[#111111] tracking-tight">Logistics Partners</h2>
          <p className="text-[14px] font-medium text-[#8B93A7]">Reference library for freight carriers and tracking templates.</p>
        </div>
        <button className="h-11 px-6 bg-[#111111] text-white rounded-[14px] text-[13px] font-black hover:bg-black transition-all flex items-center gap-2">
          <Plus size={18} strokeWidth={3} />
          Add Carrier
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {carriers.map((carrier) => (
          <div key={carrier.id} className="bg-white p-6 rounded-[28px] border border-[#ECEDEF] group hover:border-[#D40073]/40 transition-all flex flex-col h-full shadow-none hover:shadow-none">
            <div className="flex items-start justify-between mb-6">
              <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center ${
                carrier.type === 'Sea' ? 'bg-[#2563EB]/10 text-[#2563EB]' :
                carrier.type === 'Air' ? 'bg-[#D40073]/10 text-[#D40073]' :
                'bg-[#16A34A]/10 text-[#16A34A]'
              }`}>
                {carrier.type === 'Sea' && <Ship size={24} strokeWidth={2.5} />}
                {carrier.type === 'Air' && <Plane size={24} strokeWidth={2.5} />}
                {carrier.type === 'Road' && <Truck size={24} strokeWidth={2.5} />}
              </div>
              <button className="p-2 text-[#8B93A7] hover:text-[#111111] hover:bg-[#F3F4F6] rounded-lg transition-all">
                <Edit2 size={16} />
              </button>
            </div>

            <div className="flex-1">
              <h3 className="text-[18px] font-black text-[#111111] mb-1">{carrier.name}</h3>
              <div className="flex items-center gap-2 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest mb-4">
                {carrier.type} Freight
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-[14px] font-bold text-[#525866]">
                  <Mail size={16} className="text-[#8B93A7]" />
                  {carrier.contact}
                </div>
                <div className="flex items-center gap-3 text-[14px] font-bold text-[#D40073] group/link cursor-pointer overflow-hidden">
                  <Link2 size={16} className="text-[#D40073]" />
                  <span className="truncate group-hover/link:underline">{carrier.trackingUrlTemplate}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#F1F3F5] flex items-center justify-between">
              <div>
                <div className="text-[11px] font-black text-[#8B93A7] uppercase tracking-wider mb-0.5">Shipments used</div>
                <div className="text-[16px] font-black text-[#111111]">{carrier.shipmentsCount}</div>
              </div>
              <Icon icon="solar:round-transfer-horizontal-linear" className="text-[24px] text-[#ECEDEF]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
