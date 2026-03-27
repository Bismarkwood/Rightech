import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from '@iconify/react';
import { useConsignment } from '../context/ConsignmentContext';
import { NewConsignmentModal } from '../components/consignment/NewConsignmentModal';
import { toast } from 'sonner';
import { ConsignmentItem } from '../data/consignmentData';

const TABS = ['All Consignments', 'Supplier Intake', 'Dealer Outbound', 'Settlements', 'Returns'];

export default function ConsignmentManagement() {
  const { inboundConsignments, outboundConsignments, setNewConsignmentModalOpen, deleteConsignment } = useConsignment();
  const [activeTab, setActiveTab] = useState('All Consignments');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConsignment, setSelectedConsignment] = useState<ConsignmentItem | null>(null);

  const allConsignments = [...inboundConsignments, ...outboundConsignments].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const filteredItems = allConsignments.filter(item => {
    const name = item?.name || '';
    const partnerName = item?.partnerName || '';
    const id = item?.id || '';
    const q = searchQuery.toLowerCase();

    const matchesSearch = name.toLowerCase().includes(q) || 
                          partnerName.toLowerCase().includes(q) ||
                          id.toLowerCase().includes(q);
    
    if (activeTab === 'Supplier Intake') return matchesSearch && item.type === 'Inbound';
    if (activeTab === 'Dealer Outbound') return matchesSearch && item.type === 'Outbound';
    if (activeTab === 'Settlements') return matchesSearch && item.status === 'Settled';
    if (activeTab === 'Returns') return matchesSearch && item.items.some((i: any) => i.returnedQty > 0);
    return matchesSearch;
  });

  const totalValue = filteredItems.reduce((acc: number, item: ConsignmentItem) => acc + item.totalValue, 0);
  const totalSold = filteredItems.reduce((acc: number, item: ConsignmentItem) => {
    const itemSold = item.items.reduce((sum: number, p: any) => sum + (p.soldQty * p.unitPrice), 0);
    return acc + itemSold;
  }, 0);

  const handleDeleteCallback = (id: string) => {
    if (window.confirm('Are you sure you want to delete this consignment? This will also remove it from delivery tracking.')) {
      deleteConsignment(id);
      toast.success('Consignment deleted successfully');
      setSelectedConsignment(null);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#F7F7F8] relative min-h-0 font-sans">

      {/* ── Page Header ── */}
      <div className="bg-white border-b border-[#ECEDEF] px-8 pt-6 pb-5 shrink-0">
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-[11px] bg-[#111111] text-white flex items-center justify-center">
                <Icon icon="solar:box-bold-duotone" className="text-[18px]" />
              </div>
              <h1 className="text-[24px] font-black text-[#111111] tracking-tight">Consignment Hub</h1>
            </div>
            <p className="text-[13px] font-medium text-[#8B93A7] mt-0.5 ml-0.5">
              Manage inbound supply and outbound dealer stock. Track sell-through and settlements.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="h-10 px-4 flex items-center gap-2 bg-white border border-[#E4E7EC] rounded-[10px] text-[13px] font-bold text-[#111111] hover:bg-[#F3F4F6] transition-colors">
              <Icon icon="solar:download-square-linear" className="text-[18px]" />
              Export
            </button>
            <button 
              onClick={() => setNewConsignmentModalOpen(true)}
              className="h-10 px-5 flex items-center gap-2 bg-[#D40073] hover:bg-[#B80063] text-white rounded-[10px] text-[13px] font-bold transition-all"
            >
              <Icon icon="solar:add-circle-bold" className="text-[18px]" />
              New Movement
            </button>
          </div>
        </div>
      </div>
      {/* Quick Insights */}
      <div className="px-6 md:px-8 pt-6 pb-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-[20px] bg-white border border-[#ECEDEF] flex items-center gap-4">
            <div className="w-12 h-12 rounded-[16px] bg-[#D40073]/10 flex items-center justify-center text-[#D40073]">
              <Icon icon="solar:box-minimalistic-bold" className="text-[24px]" />
            </div>
            <div>
              <p className="text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Active Inventory Value</p>
              <p className="text-[22px] font-black text-[#111111]">GHS {totalValue.toLocaleString()}</p>
            </div>
          </div>
          <div className="p-5 rounded-[20px] bg-white border border-[#ECEDEF] flex items-center gap-4">
            <div className="w-12 h-12 rounded-[16px] bg-[#16A34A]/10 flex items-center justify-center text-[#16A34A]">
              <Icon icon="solar:bill-list-bold" className="text-[24px]" />
            </div>
            <div>
              <p className="text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Pending Settlements</p>
              <p className="text-[22px] font-black text-[#111111]">GHS {totalSold.toLocaleString()}</p>
            </div>
          </div>
          <div className="p-5 rounded-[20px] bg-[#111111] text-white flex items-center gap-4">
            <div className="w-12 h-12 rounded-[16px] bg-white/10 flex items-center justify-center text-white">
              <Icon icon="solar:graph-up-bold" className="text-[24px]" />
            </div>
            <div>
              <p className="text-[12px] font-bold opacity-60 uppercase tracking-wider">Avg. Sold-Through</p>
              <p className="text-[22px] font-black">
                {Math.round((allConsignments.reduce((acc: number, c: ConsignmentItem) => acc + c.items.reduce((sum: number, i: any) => sum + i.soldQty, 0), 0) / 
                  (allConsignments.reduce((acc: number, c: ConsignmentItem) => acc + c.items.reduce((sum: number, i: any) => sum + i.suppliedQty, 0), 0) || 1)) * 100)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main List Area ── */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 pt-0 min-h-0">
        <div className="max-w-[1400px] mx-auto">
          {/* Sub Nav & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
              {TABS.map(t => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`whitespace-nowrap h-9 px-4 rounded-[10px] text-[13px] font-bold transition-all ${
                    activeTab === t 
                      ? 'bg-[#111111] text-white shadow-md' 
                      : 'bg-white border border-[#E4E7EC] text-[#525866] hover:border-[#D40073] hover:text-[#D40073]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="relative group">
              <Icon icon="solar:magnifer-linear" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B93A7] group-focus-within:text-[#D40073] transition-all text-[18px]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search partner or batch..."
                className="w-full sm:w-[280px] h-10 pl-11 pr-4 bg-white border border-[#ECEDEF] rounded-[12px] text-[13px] font-medium focus:outline-none focus:border-[#D40073] focus:ring-4 focus:ring-[#D40073]/5 transition-all"
              />
            </div>
          </div>

          <div className="bg-white rounded-[24px] border border-[#ECEDEF] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-0">
                <thead>
                  <tr className="bg-[#F7F7F8] border-b border-[#ECEDEF]">
                    <th className="py-4 px-6 text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider">Consignment Batch</th>
                    <th className="py-4 px-6 text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider">Partner</th>
                    <th className="py-4 px-6 text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider">Type</th>
                    <th className="py-4 px-6 text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider">Inventory Hub</th>
                    <th className="py-4 px-6 text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider text-right">Value</th>
                    <th className="py-4 px-6 text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECEDEF]">
                  <AnimatePresence mode="popLayout">
                    {filteredItems.map((item) => {
                      const totalSupplied = item.items.reduce((sum: number, i: any) => sum + i.suppliedQty, 0);
                      const totalSold = item.items.reduce((sum: number, i: any) => sum + i.soldQty, 0);
                      const soldPct = Math.round((totalSold / totalSupplied) * 100);
                      const isSupplier = item.type === 'Inbound';
                      
                      return (
                        <motion.tr
                          key={item.id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={() => setSelectedConsignment(item)}
                          className="hover:bg-[#FBFBFC] transition-colors group cursor-pointer"
                        >
                          <td className="py-5 px-6">
                            <p className="text-[14px] font-bold text-[#111111] group-hover:text-[#D40073] transition-colors">{item.name}</p>
                            <p className="text-[11px] font-bold text-[#8B93A7] tracking-wider uppercase mt-0.5">{item.id} • {item.items.length} items</p>
                          </td>
                          <td className="py-5 px-6">
                            <p className="text-[14px] font-bold text-[#111111]">{item.partnerName}</p>
                            <p className="text-[11px] font-medium text-[#8B93A7] mt-0.5">{item.date}</p>
                          </td>
                          <td className="py-5 px-6">
                            <span className={`inline-flex px-2 py-0.5 rounded-[6px] text-[10px] font-black uppercase tracking-widest ${
                              isSupplier ? 'bg-[#EFF6FF] text-[#2563EB]' : 'bg-[#FFF7ED] text-[#EA580C]'
                            }`}>
                              {isSupplier ? 'Intake' : 'Outbound'}
                            </span>
                          </td>
                          <td className="py-5 px-6 min-w-[180px]">
                            <div className="flex items-center justify-between text-[11px] font-bold mb-1.5">
                              <span className={soldPct > 80 ? 'text-[#DC2626]' : 'text-[#16A34A]'}>{totalSold} / {totalSupplied} sold</span>
                              <span className="text-[#8B93A7]">{soldPct}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-[#F3F4F6] rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${soldPct}%` }}
                                transition={{ duration: 1 }}
                                className={`h-full rounded-full ${
                                  soldPct > 80 ? 'bg-[#DC2626]' : soldPct > 50 ? 'bg-[#EA580C]' : 'bg-[#16A34A]'
                                }`}
                              />
                            </div>
                          </td>
                          <td className="py-5 px-6 text-right font-black text-[15px] text-[#111111]">
                            GHS {item.totalValue.toLocaleString()}
                          </td>
                          <td className="py-5 px-6 text-center">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${
                              item.status === 'Settled' ? 'bg-[#ECFDF3] text-[#16A34A]' : 
                              item.status === 'In Transit' ? 'bg-[#EEF2FF] text-[#4F46E5]' : 'bg-[#FFF7ED] text-[#EA580C]'
                            }`}>
                              <Icon icon={item.status === 'Settled' ? 'solar:check-circle-bold' : item.status === 'In Transit' ? 'solar:delivery-bold' : 'solar:clock-circle-bold'} />
                              {item.status.toUpperCase()}
                            </span>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
            
            {filteredItems.length === 0 && (
              <div className="py-24 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#8B93A7] mb-4">
                  <Icon icon="solar:box-minimalistic-broken" className="text-[32px]" />
                </div>
                <h3 className="text-[18px] font-bold text-[#111111]">No movements found</h3>
                <p className="text-[14px] text-[#525866] mt-1">Try adjusting your filters or record a new stock movement.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConsignmentDetailsModal 
        consignment={selectedConsignment} 
        onClose={() => setSelectedConsignment(null)} 
        onDelete={handleDeleteCallback}
      />
      <NewConsignmentModal />
    </div>
  );
}
function ConsignmentDetailsModal({ consignment, onClose, onDelete }: { consignment: ConsignmentItem | null, onClose: () => void, onDelete: (id: string) => void }) {
  if (!consignment) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-[700px] bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="px-10 py-8 border-b border-black/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-[18px] flex items-center justify-center ${consignment.type === 'Inbound' ? 'bg-[#EFF6FF] text-[#2563EB]' : 'bg-[#FFF7ED] text-[#EA580C]'}`}>
                <Icon icon={consignment.type === 'Inbound' ? 'solar:import-bold' : 'solar:export-bold'} className="text-[28px]" />
              </div>
              <div>
                <h2 className="text-[22px] font-black text-[#111111]">{consignment.name}</h2>
                <p className="text-[13px] text-[#8B93A7] font-bold uppercase tracking-wider">{consignment.id} • {consignment.date}</p>
              </div>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-black/5 flex items-center justify-center border border-black/5">
              <Icon icon="solar:close-square-bold" className="text-[24px]" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-[24px] bg-[#F9FAFB] border border-[#ECEDEF]">
                <p className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider mb-2">Partner Details</p>
                <p className="text-[15px] font-black text-[#111111]">{consignment.partnerName}</p>
                <p className="text-[13px] font-medium text-[#525866] mt-0.5">{consignment.type === 'Inbound' ? 'Supply Partner' : 'Official Dealer'}</p>
              </div>
              <div className="p-5 rounded-[24px] bg-[#F9FAFB] border border-[#ECEDEF]">
                <p className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider mb-2">Movement Status</p>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                    consignment.status === 'Settled' ? 'bg-[#ECFDF3] text-[#16A34A]' : 
                    consignment.status === 'In Transit' ? 'bg-[#EEF2FF] text-[#4F46E5]' : 'bg-[#FFF7ED] text-[#EA580C]'
                  }`}>
                    {consignment.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[16px] font-black text-[#111111] flex items-center gap-2">
                <Icon icon="solar:box-bold" className="text-[#D40073]" />
                Inventory List
              </h3>
              <div className="space-y-3">
                {consignment.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-white border border-[#ECEDEF] rounded-[20px]">
                    <div className="flex items-center gap-4">
                      <img src={item.image} alt="" className="w-12 h-12 rounded-[12px] object-cover" />
                      <div>
                        <p className="text-[14px] font-bold text-[#111111]">{item.productName}</p>
                        <p className="text-[11px] font-medium text-[#8B93A7]">{item.sku} • {item.suppliedQty} units</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[14px] font-black text-[#111111]">GHS {item.unitPrice.toLocaleString()}</p>
                      <p className="text-[11px] font-bold text-[#16A34A]">{item.soldQty} sold</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {consignment.location && (
              <div className="p-6 rounded-[24px] bg-[#F9FAFB] border border-[#ECEDEF] space-y-2">
                <p className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider">Destination / Pickup Point</p>
                <div className="flex items-center gap-3">
                  <Icon icon="solar:map-point-bold" className="text-[#D40073] text-[20px]" />
                  <p className="text-[14px] font-bold text-[#111111]">{consignment.location}</p>
                </div>
              </div>
            )}
          </div>

          <div className="px-10 py-8 border-t border-black/5 bg-white flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider">Total Combined Value</p>
              <p className="text-[24px] font-black text-[#111111]">GHS {consignment.totalValue.toLocaleString()}</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => onDelete(consignment.id)}
                className="h-12 px-6 rounded-[16px] bg-red-50 text-red-600 font-bold text-[14px] hover:bg-red-100 transition-all flex items-center gap-2"
              >
                <Icon icon="solar:trash-bin-trash-bold" />
                Discard Movement
              </button>
              <button 
                className="h-12 px-8 rounded-[16px] bg-[#111111] text-white font-bold text-[14px] hover:bg-black transition-all"
              >
                Export PDF
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
