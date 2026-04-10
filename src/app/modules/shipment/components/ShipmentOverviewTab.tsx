import React from 'react';
import { motion } from 'motion/react';
import { Icon } from '@iconify/react';
import { useShipments } from '../context/ShipmentContext';
import { Ship, Plane, Truck, Train, Clock, CheckCircle2, AlertCircle, Package, ArrowRight } from 'lucide-react';

const StatusCounter = ({ label, count, sublabel, icon: IconComp, colorClass }: any) => (
  <div className="bg-white p-6 rounded-[24px] border border-[#ECEDEF] flex items-center justify-between">
    <div>
      <div className="text-[13px] font-black text-[#8B93A7] uppercase tracking-wider mb-1">{label}</div>
      <div className="text-[32px] font-black text-[#111111] leading-none mb-1">{count}</div>
      <div className="text-[12px] font-bold text-[#525866]">{sublabel}</div>
    </div>
    <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center ${colorClass}`}>
      <IconComp size={24} strokeWidth={2.5} />
    </div>
  </div>
);

const PipelineStage = ({ label, count, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`flex-1 flex flex-col items-center gap-3 py-6 px-4 border-r border-[#ECEDEF] last:border-r-0 transition-all ${
      active ? 'bg-[#D40073]/5' : 'hover:bg-[#FAFBFC]'
    }`}
  >
    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-[14px] ${
      active ? 'bg-[#D40073] text-white' : 'bg-[#F3F4F6] text-[#8B93A7]'
    }`}>
      {count}
    </div>
    <div className="flex items-center gap-2">
      <span className={`text-[13px] font-black uppercase tracking-wider ${active ? 'text-[#D40073]' : 'text-[#525866]'}`}>{label}</span>
      {label !== 'Arrived' && <ArrowRight size={14} className="text-[#ECEDEF]" />}
    </div>
  </button>
);

export function ShipmentOverviewTab() {
  const { shipments, openShipmentDetail } = useShipments();
  const [filterStage, setFilterStage] = React.useState<string | null>(null);

  const stats = {
    transit: shipments.filter(s => s.status === 'In Transit').length,
    soon: 3, // Mocked logic: shipments with ETA within 7 days
    arrived: shipments.filter(s => s.status === 'Arrived' || s.status === 'Received').length
  };

  const stages = [
    { label: 'Dispatched', count: shipments.filter(s => s.status === 'Dispatched').length },
    { label: 'In Transit', count: shipments.filter(s => s.status === 'In Transit').length },
    { label: 'Customs', count: shipments.filter(s => s.status === 'Customs').length },
    { label: 'Arrived', count: shipments.filter(s => s.status === 'Arrived').length },
  ];

  const displayShipments = filterStage 
    ? shipments.filter(s => s.status === filterStage)
    : shipments.filter(s => s.status !== 'Received').slice(0, 4);

  return (
    <div className="space-y-10 pb-16">
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatusCounter 
          label="In Transit" 
          count={stats.transit} 
          sublabel="Active shipments" 
          icon={Ship} 
          colorClass="bg-[#2563EB]/10 text-[#2563EB]"
        />
        <StatusCounter 
          label="Arriving Soon" 
          count={stats.soon} 
          sublabel="Within 7 days" 
          icon={Clock} 
          colorClass="bg-[#D97706]/10 text-[#D97706]"
        />
        <StatusCounter 
          label="Arrived This Month" 
          count={stats.arrived} 
          sublabel="All received" 
          icon={CheckCircle2} 
          colorClass="bg-[#16A34A]/10 text-[#16A34A]"
        />
      </div>

      {/* Pipeline Board */}
      <section className="bg-white rounded-[24px] border border-[#ECEDEF] overflow-hidden flex">
        {stages.map((stage) => (
          <PipelineStage 
            key={stage.label} 
            label={stage.label} 
            count={stage.count} 
            active={filterStage === stage.label}
            onClick={() => setFilterStage(filterStage === stage.label ? null : stage.label)}
          />
        ))}
      </section>

      {/* Shipment Feature Map Area (Mock) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-[#111111] rounded-[32px] h-[400px] relative overflow-hidden flex items-center justify-center p-12">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            <div className="relative text-center">
               <div className="w-16 h-16 bg-[#D40073] rounded-full flex items-center justify-center mx-auto mb-6 text-white animate-pulse">
                  <Icon icon="solar:globus-bold" className="text-[32px]" />
               </div>
               <h3 className="text-[20px] font-black text-white mb-2">Live Integrated Map</h3>
               <p className="text-[14px] font-medium text-[#8B93A7] max-w-[300px] mx-auto">Shipment locations are estimated based on port-to-port schedules and AIS data feeds.</p>
            </div>
         </div>

         <div className="space-y-4">
            <h3 className="text-[18px] font-black text-[#111111] px-2">Priority Shipments</h3>
            {displayShipments.map((s) => (
              <div 
                key={s.id} 
                onClick={() => openShipmentDetail(s.id)}
                className="bg-white p-6 rounded-[24px] border border-[#ECEDEF] group hover:border-[#D40073]/40 transition-all cursor-pointer"
              >                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-[12px] font-black text-[#8B93A7] uppercase tracking-wider">{s.id} · {s.supplierName}</div>
                    <div className="text-[16px] font-black text-[#111111] mt-0.5">Consignment #{s.consignmentId}</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[11px] font-black tracking-tight ${
                    s.status === 'In Transit' ? 'bg-[#2563EB]/10 text-[#2563EB]' : 'bg-[#D40073]/10 text-[#D40073]'
                  }`}>
                    {s.status}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider mb-2">
                    <span>Journey Progress</span>
                    <span>68%</span>
                  </div>
                  <div className="h-2 w-full bg-[#F3F4F6] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '68%' }}
                      className="h-full bg-[#D40073]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#F1F3F5]">
                  <div className="flex items-center gap-2 text-[13px] font-bold text-[#525866]">
                    <Package size={14} className="text-[#8B93A7]" />
                    {s.cartonCount} cartons
                  </div>
                  <div className="text-[13px] font-bold text-[#111111]">ETA: {new Date(s.eta).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}
