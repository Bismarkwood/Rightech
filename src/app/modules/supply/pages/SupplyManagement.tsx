import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Filter, Plus,
  MoreHorizontal, Download, ArrowUpRight, Box, X
} from 'lucide-react';
import { Icon } from '@iconify/react';
import { useSuppliers, Supplier, VettingStatus } from '../context/SupplierContext';
import { useConsignment } from '../../consignment/context/ConsignmentContext';
import { useProducts } from '../../products/context/ProductContext';
import { SupplierDetailDrawer } from '../components/SupplierDetailDrawer';
import { SupplierConsignmentsModal } from '../components/SupplierConsignmentsModal';
import { SupplyAddSupplierModal } from '../components/SupplyAddSupplierModal';
import { SupplierFilterModal } from '../components/SupplierFilterModal';
import { SupplierVettingModal } from '../components/SupplierVettingModal';

interface FilterState {
  status: VettingStatus[];
  category: string[];
  minRating: number | null;
}

const MOCK_CONSIGNMENTS = [
  { id: 'CON-8932', supplier: 'Global Tech Electronics', items: 450, value: '$32,000', status: 'In Transit', eta: 'Tomorrow, 14:00', origin: 'Shenzhen, China', destination: 'Accra Central', mode: 'Sea Freight' },
  { id: 'CON-8933', supplier: 'NextGen Mobile Solutions', items: 1200, value: '$85,000', status: 'Customs Clearance', eta: 'Oct 28', origin: 'Dubai, UAE', destination: 'Tema Port', mode: 'Air Freight' },
  { id: 'CON-8934', supplier: 'Premium Appliance Hub', items: 32, value: '$12,850', status: 'Delivered', eta: 'Delivered Yesterday', origin: 'Lagos, Nigeria', destination: 'Kumasi Hub', mode: 'Road Freight' },
  { id: 'CON-8935', supplier: 'QuickSpares Auto', items: 210, value: '$15,400', status: 'Pending', eta: 'Nov 02', origin: 'Johannesburg, SA', destination: 'Takoradi Hub', mode: 'Road Freight' },
];


export default function SupplyManagement() {
  const { suppliers, setAddSupplierModalOpen } = useSuppliers();
  const { inboundConsignments } = useConsignment();
  const [activeTab, setActiveTab] = useState('Suppliers');
  const navigate = useNavigate();
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [archiveSupplier, setArchiveSupplier] = useState<Supplier | null>(null);
  
  // Filtering state
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    category: [],
    minRating: null,
  });
  // Vetting Hub state
  const [isVettingModalOpen, setIsVettingModalOpen] = useState(false);

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(s => {
      const matchesSearch = 
        !searchQuery || 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = filters.status.length === 0 || filters.status.includes(s.status);
      const matchesCategory = filters.category.length === 0 || filters.category.includes(s.category);
      const matchesRating = filters.minRating === null || s.rating >= filters.minRating;

      return matchesSearch && matchesStatus && matchesCategory && matchesRating;
    });
  }, [suppliers, searchQuery, filters]);

  const activeFilterCount = filters.status.length + filters.category.length + (filters.minRating ? 1 : 0);

  return (
    <div className="flex flex-col h-full w-full bg-[#F7F7F8] relative min-h-0">

      {/* ── Page Header ── */}
      <div className="bg-white border-b border-[#ECEDEF] px-8 pt-6 shrink-0">
        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-[11px] bg-[#111111] text-white flex items-center justify-center">
                <Icon icon="solar:box-minimalistic-bold-duotone" className="text-[18px]" />
              </div>
              <h1 className="text-[24px] font-black text-[#111111] tracking-tight">Supply Management</h1>
            </div>
            <p className="text-[13px] font-medium text-[#8B93A7] mt-0.5 ml-0.5">
              Manage suppliers, consignments, and incoming shipments.
            </p>
          </div>
          <div className="flex items-center gap-3 mb-1">
            <button 
              onClick={() => setIsVettingModalOpen(true)}
              className="h-10 px-4 bg-white border border-[#E4E7EC] text-[#111111] text-[13px] font-bold rounded-[10px] flex items-center gap-2 hover:bg-[#F3F4F6] transition-colors"
            >
              <div className="w-5 h-5 rounded-full bg-[#2563EB] text-white flex items-center justify-center">
                 <Icon icon="solar:shield-check-bold" className="text-[12px]" />
              </div>
              Vetting Hub
            </button>
            <button className="h-10 px-4 bg-white border border-[#E4E7EC] text-[#111111] text-[13px] font-bold rounded-[10px] flex items-center gap-2 hover:bg-[#F3F4F6] transition-colors">
              <Download size={16} />
              Export
            </button>
            <button
              onClick={() => setAddSupplierModalOpen(true)}
              className="h-10 px-5 bg-[#D40073] hover:bg-[#B80063] text-white text-[13px] font-bold rounded-[10px] flex items-center gap-2 transition-colors"
            >
              <Plus size={15} />
              Add Supplier
            </button>
          </div>
        </div>

        {/* Tab Nav */}
        <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
          {['Suppliers'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-[14px] font-bold whitespace-nowrap transition-all relative ${
                activeTab === tab ? 'text-[#D40073]' : 'text-[#8B93A7] hover:text-[#111111]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon
                  icon={activeTab === tab ? 'solar:users-group-two-rounded-bold' : 'solar:users-group-two-rounded-linear'}
                  className="text-[18px]"
                />
                {tab}
              </div>
              {activeTab === tab && (
                <motion.div
                  layoutId="supplyTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#D40073] rounded-t-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
          {activeTab === 'Suppliers' && (
            <div className="bg-white dark:bg-[#151B2B] rounded-[22px] border border-[#ECEDEF] dark:border-white/10 overflow-hidden">
              <div className="h-16 px-4 border-b border-[#ECEDEF] dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#F9FAFB] dark:bg-white/5 relative">
                <div className="relative max-w-md w-full group">
                  <Icon icon="solar:magnifer-linear" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B93A7] group-focus-within:text-[#D40073] transition-colors text-[18px]" />
                  <input 
                    type="text" 
                    placeholder="Search by supplier name, ID or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 h-10 bg-white dark:bg-white/5 border border-[#E4E7EC] dark:border-white/10 rounded-[10px] text-[13px] font-black text-[#111111] dark:text-white placeholder:text-[#8B93A7] focus:outline-none focus:border-[#D40073] transition-all shadow-sm"
                  />
                </div>
                <button 
                  onClick={() => setIsFilterModalOpen(true)}
                  className={`h-10 px-5 flex items-center justify-center gap-2 rounded-[10px] text-[13px] font-black transition-all border shadow-sm uppercase tracking-wider ${
                    activeFilterCount > 0 
                      ? 'bg-[#111111] dark:bg-white border-[#111111] dark:border-white text-white dark:text-[#111111]' 
                      : 'bg-white dark:bg-white/5 border-[#E4E7EC] dark:border-white/10 text-[#525866] dark:text-[#8B93A7] hover:border-[#D40073]'
                  }`}
                >
                  <Icon icon="solar:filter-bold-duotone" className="text-[18px]" />
                  FILTER
                  {activeFilterCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-[#D40073] dark:bg-[#D40073] text-white text-[10px] flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Active Filters Strip */}
              {activeFilterCount > 0 && (
                <div className="px-4 py-3 bg-[#FBFBFC] border-b border-[#ECEDEF] flex items-center flex-wrap gap-2">
                  <span className="text-[11px] font-black text-[#8B93A7] uppercase tracking-wider mr-2">Active Criteria:</span>
                  {filters.status.map((s: VettingStatus) => (
                    <div key={s} className="px-2 py-1 bg-white border border-[#ECEDEF] rounded-[6px] flex items-center gap-2">
                      <span className="text-[11px] font-black text-[#111111] uppercase tracking-wider">{s}</span>
                      <button onClick={() => setFilters({...filters, status: filters.status.filter((x: VettingStatus) => x !== s)})}>
                        <X size={12} className="text-[#8B93A7] hover:text-[#D40073]" />
                      </button>
                    </div>
                  ))}
                  {filters.category.map((c: string) => (
                    <div key={c} className="px-2 py-1 bg-white border border-[#ECEDEF] rounded-[6px] flex items-center gap-2">
                      <span className="text-[11px] font-black text-[#111111] uppercase tracking-wider">{c}</span>
                      <button onClick={() => setFilters({...filters, category: filters.category.filter((x: string) => x !== c)})}>
                        <X size={12} className="text-[#8B93A7] hover:text-[#D40073]" />
                      </button>
                    </div>
                  ))}
                  {filters.minRating && (
                    <div className="px-2 py-1 bg-white border border-[#ECEDEF] rounded-[6px] flex items-center gap-2">
                      <span className="text-[11px] font-black text-[#111111] uppercase tracking-wider">{filters.minRating}+ Stars</span>
                      <button onClick={() => setFilters({...filters, minRating: null})}>
                        <X size={12} className="text-[#8B93A7] hover:text-[#D40073]" />
                      </button>
                    </div>
                  )}
                  <button 
                    onClick={() => setFilters({ status: [], category: [], minRating: null })}
                    className="ml-auto text-[11px] font-black text-[#D40073] uppercase tracking-widest hover:underline"
                  >
                    Clear All
                  </button>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F9FAFB] dark:bg-white/5 border-b border-[#ECEDEF] dark:border-white/5 sticky top-0 z-10">
                      <th className="py-4 px-6 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest">Supplier Entity</th>
                      <th className="py-4 px-6 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest">Status</th>
                      <th className="py-4 px-6 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest">Volume</th>
                      <th className="py-4 px-6 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest">Outstanding</th>
                      <th className="py-4 px-6 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest">Last Activity</th>
                      <th className="py-4 px-6 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ECEDEF] dark:divide-white/5">
                    {filteredSuppliers.map((supplier) => (
                      <tr 
                        key={supplier.id} 
                        onClick={() => setSelectedSupplier(supplier)}
                        className="hover:bg-[#FBFBFC] dark:hover:bg-white/5 transition-all group cursor-pointer"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-[12px] bg-[#F7F7F8] dark:bg-white/5 border border-[#ECEDEF] dark:border-white/10 flex items-center justify-center text-[#111111] dark:text-white font-black shrink-0 text-[18px] group-hover:bg-[#111111] group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-[#111111] transition-all">
                              {supplier.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-[14px] font-black text-[#111111] dark:text-white group-hover:text-[#D40073] transition-colors">{supplier.name}</p>
                              <p className="text-[11px] font-bold text-[#8B93A7] mt-1 uppercase tracking-wider">{supplier.id} • {supplier.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex px-2.5 py-1 rounded-[6px] text-[11px] font-black uppercase tracking-wider border shadow-sm ${
                            supplier.status === 'Verified' ? 'bg-[#ECFDF5] dark:bg-[#064E3B]/30 text-[#059669] border-[#059669]/10' : 
                            supplier.status === 'Pending' ? 'bg-[#FFFBEB] dark:bg-[#78350F]/30 text-[#D97706] border-[#D97706]/10' : 
                            'bg-[#F3F4F6] dark:bg-white/5 text-[#525866] dark:text-[#8B93A7] border-transparent'
                          }`}>
                            {supplier.status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-[14px] font-black text-[#111111] dark:text-white uppercase tracking-tight">{supplier.totalConsignments} ITEMS</p>
                          <p className="text-[11px] font-bold text-[#8B93A7] mt-1 uppercase tracking-wider">
                            {inboundConsignments.filter(c => c.partnerId === supplier.id).length} CONSIGNMENTS
                          </p>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-[16px] font-black text-[#111111] dark:text-white tracking-tight">GHS {supplier.rating * 1000}</p>
                        </td>
                        <td className="py-4 px-6 text-[13px] font-black text-[#8B93A7] uppercase tracking-tighter">
                          RECENTLY
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#525866] dark:text-[#8B93A7] hover:bg-white dark:hover:bg-white/10 hover:text-[#111111] dark:hover:text-white transition-all border border-transparent hover:border-[#ECEDEF] dark:hover:border-white/10">
                              <ArrowUpRight size={16} />
                            </button>
                            <button className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#525866] dark:text-[#8B93A7] hover:bg-white dark:hover:bg-white/10 hover:text-[#111111] dark:hover:text-white transition-all border border-transparent hover:border-[#ECEDEF] dark:hover:border-white/10">
                              <MoreHorizontal size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeTab === 'Payments' && (
            <div className="bg-white rounded-[22px] border border-[#ECEDEF] p-16 text-center">
              <h3 className="text-[18px] font-bold text-[#111111] mb-2">Payment Status</h3>
              <p className="text-[14px] text-[#525866]">Supplier payment tracking features go here.</p>
            </div>
          )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Add Supplier Modal */}
      <SupplyAddSupplierModal />

       <SupplierDetailDrawer
         supplier={selectedSupplier}
         onClose={() => setSelectedSupplier(null)}
         onViewAllConsignments={() => setArchiveSupplier(selectedSupplier)}
       />

       <SupplierConsignmentsModal 
         isOpen={!!archiveSupplier} 
         onClose={() => setArchiveSupplier(null)} 
         supplier={archiveSupplier} 
       />

       <SupplierFilterModal
         isOpen={isFilterModalOpen}
         onClose={() => setIsFilterModalOpen(false)}
         onApply={setFilters}
         initialFilters={filters}
       />

       <SupplierVettingModal
         isOpen={isVettingModalOpen}
         onClose={() => setIsVettingModalOpen(false)}
       />
    </div>
  );
}