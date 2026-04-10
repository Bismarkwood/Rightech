import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSearchParams } from 'react-router';
import { Icon } from '@iconify/react';
import { useConsignment } from '../context/ConsignmentContext';
import { ConsignmentDetailsModal } from '../components/ConsignmentDetailsModal';
import { NewConsignmentModal } from '../components/NewConsignmentModal';
import { toast } from 'sonner';
import { ConsignmentItem } from '../../../core/data/consignmentData';

const TABS = ['All Consignments', 'Supplier Intake', 'Dealer Outbound', 'Settlements', 'Returns'];

export default function ConsignmentManagement() {
  const { inboundConsignments, outboundConsignments, setNewConsignmentModalOpen, deleteConsignment } = useConsignment();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'All Consignments');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedConsignment, setSelectedConsignment] = useState<ConsignmentItem | null>(null);

  React.useEffect(() => {
    const q = searchParams.get('search');
    const t = searchParams.get('tab');
    if (q) setSearchQuery(q);
    if (t) setActiveTab(t);
  }, [searchParams]);

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
      <div className="bg-white border-b border-[#ECEDEF] px-8 pt-6 shrink-0">
        <div className="flex items-end justify-between mb-4">
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
          <div className="flex items-center gap-3 mb-1">
            <button className="h-10 px-4 flex items-center gap-2 bg-white border border-[#E4E7EC] rounded-[10px] text-[13px] font-bold text-[#111111] hover:bg-[#F3F4F6] transition-colors">
              <Icon icon="solar:download-square-linear" className="text-[18px]" />
              Export
            </button>
            <button 
              onClick={() => setNewConsignmentModalOpen(true)}
              className="h-10 px-5 flex items-center gap-2 bg-[#D40073] hover:bg-[#B80063] text-white rounded-[10px] text-[13px] font-bold transition-all"
            >
              <Icon icon="solar:add-circle-bold" className="text-[18px]" />
              Create New Consignment
            </button>
          </div>
        </div>
      </div>
      {/* Quick Insights */}
      <div className="px-6 md:px-8 pt-6 pb-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Stat 1 */}
          <div className="group relative p-6 rounded-[22px] overflow-hidden bg-white dark:bg-[#151B2B] border border-[#ECEDEF] dark:border-white/10 shadow-sm transition-all hover:translate-y-[-2px] hover:shadow-md">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#D40073]/5 to-transparent rounded-bl-full transition-all group-hover:scale-110" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-[14px] bg-[#FDEDF5] dark:bg-[#D40073]/10 border border-[#FADDEE] dark:border-[#D40073]/20 flex items-center justify-center text-[#D40073] group-hover:bg-[#D40073] group-hover:text-white transition-all">
                <Icon icon="solar:box-minimalistic-bold" className="text-[24px]" />
              </div>
              <div>
                <p className="text-[11px] font-black text-[#8B93A7] uppercase tracking-widest group-hover:text-[#D40073] transition-colors">Active Inventory Value</p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <p className="text-[26px] font-black text-[#111111] dark:text-white tracking-tighter">GHS {totalValue.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
          {/* Stat 2 */}
          <div className="group relative p-6 rounded-[22px] overflow-hidden bg-white dark:bg-[#151B2B] border border-[#ECEDEF] dark:border-white/10 shadow-sm transition-all hover:translate-y-[-2px] hover:shadow-md">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#16A34A]/5 to-transparent rounded-bl-full transition-all group-hover:scale-110" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-[14px] bg-[#ECFDF5] dark:bg-[#16A34A]/10 border border-[#D1FAE5] dark:border-[#16A34A]/20 flex items-center justify-center text-[#16A34A] group-hover:bg-[#16A34A] group-hover:text-white transition-all">
                <Icon icon="solar:bill-list-bold" className="text-[24px]" />
              </div>
              <div>
                <p className="text-[11px] font-black text-[#8B93A7] uppercase tracking-widest group-hover:text-[#16A34A] transition-colors">Pending Settlements</p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <p className="text-[26px] font-black text-[#111111] dark:text-white tracking-tighter">GHS {totalSold.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
          {/* Stat 3 */}
          <div className="group relative p-6 rounded-[22px] overflow-hidden bg-[#111111] dark:bg-white border border-transparent shadow-sm transition-all hover:translate-y-[-2px]">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/10 to-transparent dark:from-black/5 rounded-bl-full transition-all" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-[14px] bg-white/10 dark:bg-black/5 flex items-center justify-center text-white dark:text-[#111111]">
                <Icon icon="solar:graph-up-bold" className="text-[24px]" />
              </div>
              <div>
                <p className="text-[11px] font-black text-white/60 dark:text-black/50 uppercase tracking-widest">Avg. Sold-Through</p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <p className="text-[26px] font-black text-white dark:text-[#111111] tracking-tighter">
                    {Math.round((allConsignments.reduce((acc: number, c: ConsignmentItem) => acc + c.items.reduce((sum: number, i: any) => sum + i.soldQty, 0), 0) / 
                      (allConsignments.reduce((acc: number, c: ConsignmentItem) => acc + c.items.reduce((sum: number, i: any) => sum + i.suppliedQty, 0), 0) || 1)) * 100)}%
                  </p>
                </div>
              </div>
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
                  className={`whitespace-nowrap h-10 px-5 rounded-[12px] text-[13px] font-black uppercase tracking-wider transition-all shadow-sm ${
                    activeTab === t 
                      ? 'bg-[#111111] dark:bg-white text-white dark:text-[#111111]' 
                      : 'bg-white dark:bg-white/5 border border-[#E4E7EC] dark:border-white/10 text-[#525866] dark:text-[#8B93A7] hover:border-[#D40073] hover:text-[#D40073]'
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
                className="w-full sm:w-[280px] h-10 pl-11 pr-4 bg-white dark:bg-white/5 border border-[#E4E7EC] dark:border-white/10 rounded-[12px] text-[13px] font-black text-[#111111] dark:text-white placeholder:text-[#8B93A7] focus:outline-none focus:border-[#D40073] transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-[#151B2B] rounded-[22px] border border-[#ECEDEF] dark:border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F9FAFB] dark:bg-white/5 border-b border-[#ECEDEF] dark:border-white/5 sticky top-0 z-10">
                    <th className="py-4 px-6 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest">Consignment Batch</th>
                    <th className="py-4 px-6 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest">Partner Details</th>
                    <th className="py-4 px-6 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest">Intake Type</th>
                    <th className="py-4 px-6 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest">Inventory Health</th>
                    <th className="py-4 px-6 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest text-right">Value</th>
                    <th className="py-4 px-6 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECEDEF] dark:divide-white/5">
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
                          className="hover:bg-[#FBFBFC] dark:hover:bg-white/10 transition-all group cursor-pointer"
                        >
                          <td className="py-4 px-6">
                            <p className="text-[14px] font-black text-[#111111] dark:text-white group-hover:text-[#D40073] transition-colors">{item.name}</p>
                            <p className="text-[11px] font-bold text-[#8B93A7] tracking-wider uppercase mt-1">{item.id} • {item.items.length} items</p>
                          </td>
                          <td className="py-4 px-6">
                            <p className="text-[14px] font-black text-[#111111] dark:text-white">{item.partnerName}</p>
                            <p className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider mt-1">{item.date}</p>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex px-2.5 py-1 rounded-[6px] text-[11px] font-black uppercase tracking-widest border shadow-sm ${
                              isSupplier ? 'bg-[#EFF6FF] dark:bg-[#1E3A8A]/30 text-[#2563EB] border-[#2563EB]/10' : 'bg-[#FFF7ED] dark:bg-[#7C2D12]/30 text-[#EA580C] border-[#EA580C]/10'
                            }`}>
                              {isSupplier ? 'Intake' : 'Outbound'}
                            </span>
                          </td>
                          <td className="py-4 px-6 min-w-[180px]">
                            <div className="flex items-center justify-between text-[11px] font-bold mb-1.5">
                              <span className={soldPct > 80 ? 'text-[#DC2626]' : 'text-[#16A34A]'}>{totalSold} / {totalSupplied} sold</span>
                              <span className="text-[#8B93A7] dark:text-[#8B93A7]">{soldPct}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-[#F3F4F6] dark:bg-white/5 rounded-full overflow-hidden">
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
                          <td className="py-4 px-6 text-right font-black text-[15px] text-[#111111] dark:text-white">
                            GHS {item.totalValue.toLocaleString()}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-[11px] font-black uppercase tracking-wider border shadow-sm ${
                              item.status === 'Settled' ? 'bg-[#ECFDF3] dark:bg-[#064E3B]/30 text-[#16A34A] border-[#16A34A]/10' : 
                              item.status === 'In Transit' ? 'bg-[#EEF2FF] dark:bg-[#1E3A8A]/30 text-[#4F46E5] border-[#4F46E5]/10' : 'bg-[#FFF7ED] dark:bg-[#7C2D12]/30 text-[#EA580C] border-[#EA580C]/10'
                            }`}>
                              <Icon icon={item.status === 'Settled' ? 'solar:check-circle-bold' : item.status === 'In Transit' ? 'solar:delivery-bold' : 'solar:clock-circle-bold'} />
                              {item.status}
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
                <h3 className="text-[18px] font-bold text-[#111111]">No consignments found</h3>
                <p className="text-[14px] text-[#525866] mt-1">Try adjusting your filters or create a new consignment.</p>
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
