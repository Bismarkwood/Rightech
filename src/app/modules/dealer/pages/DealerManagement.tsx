import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'motion/react';
import { useCredit } from '../../credit/context/CreditContext';
import { useDealerWorkflow } from '../components/DealerWorkflowContext';
import { useOrderWorkflow } from '../../orders/components/OrderWorkflowContext';
import { useOrderManagement } from '../../orders/context/OrderManagementContext';
import { useConsignment } from '../../consignment/context/ConsignmentContext';
import * as Dialog from '@radix-ui/react-dialog';
import { 
  MOCK_DEALERS, MOCK_DEALER_ORDERS, MOCK_DEALER_PAYMENTS, MOCK_DEALER_CONSIGNMENTS, Dealer
} from '../../../core/data/mockDealerData';


const CATALOG = [
  { label: 'Sony WH-1000XM5', price: 3400 },
  { label: 'Apple Watch Series 9', price: 4200 },
];

export default function DealerManagement() {
  const { openCreateDealer } = useDealerWorkflow();
  const { openCreateOrder, openSharingModal } = useOrderWorkflow();
  const { accounts, getAccountByDealerId } = useCredit();
  const { orders: globalOrders } = useOrderManagement();
  const { outboundConsignments } = useConsignment();

  const dealerOrders = useMemo(() => {
    return globalOrders.filter(o => o.type === 'Dealer');
  }, [globalOrders]);
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedDealer, setSelectedDealer] = useState<any>(null);

  // Sync selectedDealer credit data with CreditContext
  const creditAccount = useMemo(() => {
    if (!selectedDealer) return null;
    return getAccountByDealerId(selectedDealer.id);
  }, [selectedDealer, accounts, getAccountByDealerId]);

  const dealerWithLiveCredit = useMemo(() => {
    if (!selectedDealer || !creditAccount) return selectedDealer;
    return {
      ...selectedDealer,
      creditLimit: creditAccount.creditLimit,
      outstanding: creditAccount.usedAmount,
      creditScore: creditAccount.band,
      scoreValue: creditAccount.score
    };
  }, [selectedDealer, creditAccount]);

  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isAllOrdersModalOpen, setIsAllOrdersModalOpen] = useState(false);
  const [orderSearch, setOrderSearch] = useState('');
  const [statusFilterModal, setStatusFilterModal] = useState('All Status');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [regionFilter, setRegionFilter] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [isReplenishModalOpen, setIsReplenishModalOpen] = useState(false);

  const filteredDealers = MOCK_DEALERS.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'All' || d.status === statusFilter;
    const matchRegion = regionFilter === 'All' || d.region === regionFilter;
    return matchSearch && matchStatus && matchRegion;
  });

  const regions = Array.from(new Set(MOCK_DEALERS.map(d => d.region)));


  const formatMoney = (val: number) => `GHS ${val.toLocaleString()}`;

  // Credit risk logic
  const getRiskColor = (score: number) => {
    if (score >= 800) return '#16A34A'; // Green
    if (score >= 600) return '#D97706'; // Orange
    return '#DC2626'; // Red
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#F7F7F8] relative min-h-0 font-sans">
      {/* ── Page Header ── */}
      <div className="bg-white dark:bg-[#151B2B] border-b border-[#ECEDEF] dark:border-white/5 px-8 pt-6 shrink-0 sticky top-0 z-20">
        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-[11px] bg-[#111111] text-white flex items-center justify-center">
                <Icon icon="solar:users-group-two-rounded-bold-duotone" className="text-[18px]" />
              </div>
              <h1 className="text-[24px] font-black text-[#111111] tracking-tight">Dealer Management</h1>
            </div>
            <p className="text-[13px] font-medium text-[#8B93A7] mt-0.5 ml-0.5">
              Browse products, process orders, and manage dealer credit.
            </p>
          </div>
          <div className="flex items-center gap-3 mb-1">
            <button className="h-10 px-4 flex items-center gap-2 bg-white border border-[#E4E7EC] text-[#111111] text-[13px] font-bold hover:bg-[#F3F4F6] transition-colors rounded-[10px]">
              <Icon icon="solar:download-square-linear" className="text-[18px]" />
              Export
            </button>
            <button 
              onClick={() => openCreateDealer()}
              className="h-10 px-5 flex items-center gap-2 bg-[#D40073] hover:bg-[#B80063] text-white rounded-[10px] text-[13px] font-bold transition-all"
            >
              <Icon icon="solar:add-circle-bold" className="text-[18px]" />
              Create Dealer
            </button>
          </div>
        </div>


      </div>

      {/* ── Main Scrollable Area ── */}
      <div className="flex-1 overflow-y-auto min-h-0 bg-[#F7F7F8] dark:bg-[#0B0F1A]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-8 py-6 flex flex-col gap-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Stat 1 */}
            <div className="relative p-6 rounded-[22px] overflow-hidden bg-white dark:bg-[#151B2B] border border-[#ECEDEF] dark:border-white/10 shadow-sm transition-all hover:translate-y-[-2px] hover:shadow-md group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#111111]/5 to-transparent dark:from-white/5 rounded-bl-full transition-all group-hover:scale-110" />
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-[12px] bg-[#F7F7F8] dark:bg-white/5 border border-[#ECEDEF] dark:border-white/10 flex items-center justify-center text-[#111111] dark:text-white group-hover:bg-[#111111] group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-[#111111] transition-all">
                  <Icon icon="solar:users-group-two-rounded-bold" className="text-[22px]" />
                </div>
              </div>
              <p className="text-[11px] font-black text-[#8B93A7] uppercase tracking-widest mb-1 group-hover:text-[#111111] dark:group-hover:text-white transition-colors">Total Dealers</p>
              <div className="flex items-baseline gap-2">
                <p className="text-[26px] font-black text-[#111111] dark:text-white tracking-tight">1,248</p>
                <span className="text-[12px] font-black text-[#16A34A] flex items-center gap-0.5">
                  <Icon icon="solar:arrow-up-right-bold" />
                  +12%
                </span>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="relative p-6 rounded-[22px] overflow-hidden bg-white dark:bg-[#151B2B] border border-[#ECEDEF] dark:border-white/10 shadow-sm transition-all hover:translate-y-[-2px] hover:shadow-md group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#4F46E5]/5 to-transparent rounded-bl-full transition-all group-hover:scale-110" />
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-[12px] bg-[#EEF2FF] dark:bg-[#4F46E5]/10 border border-[#E0E7FF] dark:border-[#4F46E5]/20 flex items-center justify-center text-[#4F46E5] group-hover:bg-[#4F46E5] group-hover:text-white transition-all">
                  <Icon icon="solar:chart-square-bold" className="text-[22px]" />
                </div>
              </div>
              <p className="text-[11px] font-black text-[#8B93A7] uppercase tracking-widest mb-1 group-hover:text-[#4F46E5] transition-colors">Active Orders</p>
              <div className="flex items-baseline gap-2">
                <p className="text-[26px] font-black text-[#111111] dark:text-white tracking-tight">342</p>
                <span className="text-[12px] font-black text-[#16A34A] flex items-center gap-0.5">
                  <Icon icon="solar:arrow-up-right-bold" />
                  +5%
                </span>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="relative p-6 rounded-[22px] overflow-hidden bg-white dark:bg-[#151B2B] border border-[#ECEDEF] dark:border-white/10 shadow-sm transition-all hover:translate-y-[-2px] hover:shadow-md group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#059669]/5 to-transparent rounded-bl-full transition-all group-hover:scale-110" />
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-[12px] bg-[#ECFDF5] dark:bg-[#059669]/10 border border-[#D1FAE5] dark:border-[#059669]/20 flex items-center justify-center text-[#059669] group-hover:bg-[#059669] group-hover:text-white transition-all">
                  <Icon icon="solar:chart-pie-bold" className="text-[22px]" />
                </div>
              </div>
              <p className="text-[11px] font-black text-[#8B93A7] uppercase tracking-widest mb-1 group-hover:text-[#059669] transition-colors">Avg Credit Score</p>
              <p className="text-[26px] font-black text-[#111111] dark:text-white tracking-tight">745</p>
            </div>

            {/* Stat 4 */}
            <div className="relative p-6 rounded-[22px] overflow-hidden bg-white dark:bg-[#151B2B] border border-[#ECEDEF] dark:border-white/10 shadow-sm transition-all hover:translate-y-[-2px] hover:shadow-md group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#D40073]/5 to-transparent rounded-bl-full transition-all group-hover:scale-110" />
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-[12px] bg-[#FFF1F2] dark:bg-[#D40073]/10 border border-[#FFE4E6] dark:border-[#D40073]/20 flex items-center justify-center text-[#D40073] group-hover:bg-[#D40073] group-hover:text-white transition-all">
                  <Icon icon="solar:wallet-bold" className="text-[22px]" />
                </div>
              </div>
              <p className="text-[11px] font-black text-[#8B93A7] uppercase tracking-widest mb-1 group-hover:text-[#D40073] transition-colors">Total Outstanding</p>
              <p className="text-[26px] font-black text-[#111111] dark:text-white tracking-tight">GHS 41.9k</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#151B2B] border border-[#ECEDEF] dark:border-white/10 shadow-sm rounded-[22px] overflow-hidden">
            
            {/* Table Toolbar */}
            <div className="h-16 px-4 border-b border-[#ECEDEF] dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#F9FAFB] dark:bg-white/5 relative">
              <div className="relative max-w-md w-full group">
                <Icon icon="solar:magnifer-linear" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B93A7] group-focus-within:text-[#D40073] transition-colors text-[18px]" />
                <input 
                   type="text" 
                   placeholder="Search dealers by name or ID..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full pl-10 pr-4 h-10 bg-white dark:bg-white/5 border border-[#E4E7EC] dark:border-white/10 rounded-[10px] text-[13px] font-black text-[#111111] dark:text-white placeholder:text-[#8B93A7] focus:outline-none focus:border-[#D40073] transition-all"
                />
              </div>
              
              <div className="relative">
                <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`h-10 px-4 flex items-center justify-center gap-2 border rounded-[10px] text-[13px] font-bold transition-all ${
                    statusFilter !== 'All' || regionFilter !== 'All' 
                    ? 'bg-[#111111] text-white border-[#111111]' 
                    : 'bg-white border-[#E4E7EC] text-[#111111] hover:bg-[#F3F4F6]'
                  }`}
                >
                  <Icon icon="solar:filter-linear" className="text-[18px]" />
                  Filters
                  {(statusFilter !== 'All' || regionFilter !== 'All') && (
                    <span className="w-2 h-2 rounded-full bg-[#D40073] ml-1" />
                  )}
                </button>

                {isFilterOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setIsFilterOpen(false)} />
                    <div className="absolute right-0 mt-2 w-[280px] bg-white border border-[#E4E7EC] rounded-[16px] p-5 z-40 transform origin-top-right transition-all">
                       <h3 className="text-[14px] font-bold text-[#111111] mb-4">Filter Table</h3>
                       
                       <div className="space-y-4">
                         <div>
                           <label className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider mb-2 block">Status</label>
                           <div className="flex flex-wrap gap-2">
                             {['All', 'Active', 'Warning', 'Inactive'].map(s => (
                               <button 
                                 key={s} 
                                 onClick={() => setStatusFilter(s)}
                                 className={`px-3 py-1.5 rounded-[8px] text-[12px] font-bold border transition-all ${
                                   statusFilter === s ? 'bg-[#111111] text-white border-[#111111]' : 'bg-white border-[#ECEDEF] text-[#525866] hover:border-[#111111]'
                                 }`}
                               >
                                 {s}
                               </button>
                             ))}
                           </div>
                         </div>

                         <div>
                           <label className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider mb-2 block">Region</label>
                           <select 
                             value={regionFilter}
                             onChange={(e) => setRegionFilter(e.target.value)}
                             className="w-full h-10 px-3 bg-[#F7F7F8] border border-[#E4E7EC] rounded-[10px] text-[13px] font-medium focus:outline-none focus:border-[#D40073]"
                           >
                             <option value="All">All Regions</option>
                             {regions.map(r => <option key={r} value={r}>{r}</option>)}
                           </select>
                         </div>

                         <div className="pt-4 border-t border-[#ECEDEF] flex gap-2">
                           <button 
                             onClick={() => { setStatusFilter('All'); setRegionFilter('All'); setIsFilterOpen(false); }}
                             className="flex-1 h-9 bg-[#F3F4F6] text-[#111111] rounded-[8px] text-[12px] font-bold hover:bg-[#E4E7EC]"
                           >
                             Reset
                           </button>
                           <button 
                             onClick={() => setIsFilterOpen(false)}
                             className="flex-1 h-9 bg-[#111111] text-white rounded-[8px] text-[12px] font-bold hover:bg-[#333333]"
                           >
                             Apply
                           </button>
                         </div>
                       </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F9FAFB] dark:bg-white/5 border-b border-[#ECEDEF] dark:border-white/5">
                    <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Dealer Details</th>
                    <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Status</th>
                    <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Credit Score</th>
                    <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Activity</th>
                    <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Outstanding</th>
                    <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECEDEF] dark:divide-white/5">
                  {filteredDealers.map((dealer) => (
                    <tr 
                      key={dealer.id} 
                      className="hover:bg-[#FBFBFC] dark:hover:bg-white/5 transition-all group cursor-pointer"
                      onClick={() => setSelectedDealer(dealer)}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-[12px] bg-[#F7F7F8] dark:bg-white/5 border border-[#ECEDEF] dark:border-white/10 flex items-center justify-center text-[#111111] dark:text-white font-black shrink-0 text-[18px] group-hover:bg-[#111111] group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-[#111111] transition-all">
                            {dealer.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-[14px] font-black text-[#111111] dark:text-white group-hover:text-[#D40073] transition-colors">{dealer.name}</p>
                            <p className="text-[12px] font-bold text-[#8B93A7] mt-1 uppercase tracking-wider">{dealer.id} • {dealer.region}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex px-2.5 py-1 rounded-[6px] text-[11px] font-black uppercase tracking-wider border shadow-sm ${
                          dealer.status === 'Active' ? 'bg-[#ECFDF3] dark:bg-[#064E3B]/30 text-[#16A34A] border-[#16A34A]/10' : 
                          dealer.status === 'Warning' ? 'bg-[#FFF7ED] dark:bg-[#78350F]/30 text-[#D97706] border-[#D97706]/10' : 
                          'bg-[#F3F4F6] dark:bg-white/5 text-[#525866] dark:text-[#8B93A7] border-transparent'
                        }`}>
                          {dealer.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`h-1.5 w-16 rounded-full overflow-hidden bg-[#F3F4F6] dark:bg-white/10`}>
                            <div 
                              className="h-full rounded-full transition-all" 
                              style={{ width: `${(dealer.creditScore / 1000) * 100}%`, background: getRiskColor(dealer.creditScore) }}
                            />
                          </div>
                          <span className="text-[14px] font-black text-[#111111] dark:text-white">{dealer.creditScore}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-[14px] font-black text-[#111111] dark:text-white">{dealer.ordersCount} ORDERS</p>
                        <p className="text-[11px] font-bold text-[#8B93A7] mt-1 uppercase tracking-wider">Last: {dealer.lastOrder}</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-[16px] font-black text-[#111111] dark:text-white tracking-tight">{formatMoney(dealer.outstanding)}</p>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#8B93A7] hover:bg-white hover:text-[#111111] transition-all border border-transparent hover:border-[#ECEDEF]">
                            <Icon icon="solar:arrow-up-right-linear" className="text-[18px]" />
                          </button>
                          <button className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#8B93A7] hover:bg-white hover:text-[#111111] transition-all border border-transparent hover:border-[#ECEDEF]">
                            <Icon icon="solar:menu-dots-bold" className="text-[18px]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Empty State */}
            {filteredDealers.length === 0 && (
              <div className="py-20 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#8B93A7] mb-4">
                  <Icon icon="solar:magnifer-broken" className="text-[32px]" />
                </div>
                <h3 className="text-[18px] font-bold text-[#111111]">No dealers found</h3>
                <p className="text-[14px] text-[#525866] max-w-[280px] mt-1">Try adjusting your search or filters to find what you're looking for.</p>
                <button 
                  onClick={() => { setSearchQuery(''); setStatusFilter('All'); setRegionFilter('All'); }}
                  className="mt-6 h-10 px-6 bg-[#111111] text-white rounded-[10px] text-[13px] font-bold hover:bg-[#333333] transition-all"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Pagination footer */}
            <div className="p-4 border-t border-[#ECEDEF] dark:border-white/5 flex items-center justify-between text-[13px] font-black text-[#8B93A7] bg-[#F9FAFB] dark:bg-white/5 uppercase tracking-wider">
              <span>Showing {filteredDealers.length} of {MOCK_DEALERS.length} dealers</span>
              <span>Page 1 of 1</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Dealer Details Drawer (Comprehensive Tabbed View) ── */}
      <AnimatePresence>
        {selectedDealer && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedDealer(null)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-[600px] bg-white dark:bg-[#151B2B] border-l border-[#ECEDEF] dark:border-white/10 z-50 flex flex-col font-sans"
            >
              {/* Drawer Header */}
              <div className="px-6 py-6 border-b border-white/10 dark:border-white/5 shrink-0 bg-white/5 relative overflow-hidden">
                <button 
                  onClick={() => setSelectedDealer(null)}
                  className="absolute top-6 right-6 w-8 h-8 rounded-full hover:bg-[#E4E7EC] flex items-center justify-center transition-colors text-[#8B93A7] hover:text-[#111111]"
                >
                  <Icon icon="solar:close-square-linear" className="text-[22px]" />
                </button>

                <div className="flex items-center gap-4 mb-5">
                  <div className="w-16 h-16 rounded-[14px] bg-white border border-[#E4E7EC] flex items-center justify-center text-[#111111] text-[24px] font-bold shrink-0">
                    {selectedDealer.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-[22px] font-bold text-[#111111] tracking-tight">{selectedDealer.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-flex px-2 py-0.5 rounded-[6px] text-[11px] font-bold ${
                        selectedDealer.status === 'Active' ? 'bg-[#ECFDF3] text-[#16A34A]' : 
                        selectedDealer.status === 'Warning' ? 'bg-[#FFF7ED] text-[#D97706]' : 
                        'bg-[#F3F4F6] text-[#525866]'
                      }`}>
                        {selectedDealer.status}
                      </span>
                      <span className="text-[13px] font-medium text-[#525866]">· {selectedDealer.region}</span>
                      <span className="text-[13px] font-medium text-[#8B93A7]">· {selectedDealer.id}</span>
                    </div>
                  </div>
                </div>


              </div>

              {/* Drawer Scrolled Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-transparent">
                
                 {/* ── Overview ── */}
                   <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative p-4 rounded-[14px] overflow-hidden text-white" style={{ background: 'linear-gradient(135deg, #059669 0%, #064e3b 100%)' }}>
                         <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full pointer-events-none opacity-20" style={{ background: 'radial-gradient(circle, #34d399, transparent 70%)' }} />
                         <p className="relative text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Credit Score</p>
                         <div className="relative flex items-center gap-3 mt-1">
                           <p className="text-[22px] font-bold text-white tracking-tight">{selectedDealer.creditScore}</p>
                           <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.2)' }}>
                             <div className="h-full rounded-full bg-white" style={{ width: `${(selectedDealer.creditScore/1000)*100}%` }} />
                           </div>
                         </div>
                      </div>
                      <div className="relative p-4 rounded-[14px] overflow-hidden text-white" style={{ background: 'linear-gradient(135deg, #120009 0%, #2e001a 100%)' }}>
                         <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full pointer-events-none opacity-20" style={{ background: 'radial-gradient(circle, #D40073, transparent 70%)' }} />
                         <p className="relative text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Total Orders</p>
                         <p className="relative text-[22px] font-bold text-white tracking-tight mt-1">{selectedDealer.ordersCount}</p>
                      </div>
                      <div className="relative p-4 rounded-[14px] overflow-hidden text-white" style={{ background: 'linear-gradient(135deg, #ea580c 0%, #7c2d12 100%)' }}>
                         <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full pointer-events-none opacity-20" style={{ background: 'radial-gradient(circle, #fdba74, transparent 70%)' }} />
                         <p className="relative text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Outstanding</p>
                         <p className="relative text-[22px] font-bold text-white tracking-tight mt-1">
                           {formatMoney(selectedDealer.outstanding)}
                         </p>
                      </div>
                      <div className="relative p-4 rounded-[14px] overflow-hidden text-white" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)' }}>
                         <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full pointer-events-none opacity-20" style={{ background: 'radial-gradient(circle, #818cf8, transparent 70%)' }} />
                         <p className="relative text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Used Credit</p>
                         <p className="relative text-[22px] font-bold text-white tracking-tight mt-1">
                           {formatMoney((selectedDealer.outstanding / selectedDealer.creditLimit) * selectedDealer.creditLimit)}
                         </p>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div>
                      <h3 className="text-[14px] font-bold text-[#111111] mb-3">Contact Information</h3>
                      <div className="bg-[#F7F7F8] border border-[#ECEDEF] rounded-[14px] p-1 divide-y divide-[#E4E7EC]">
                        <div className="flex items-center gap-3 p-3">
                          <div className="w-8 h-8 rounded-[8px] bg-white flex items-center justify-center border border-[#ECEDEF] text-[#525866]">
                            <Icon icon="solar:phone-linear" className="text-[16px]" />
                          </div>
                          <div className="flex-1">
                            <p className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider">Phone</p>
                            <p className="text-[13px] font-bold text-[#111111]">{selectedDealer.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3">
                          <div className="w-8 h-8 rounded-[8px] bg-white flex items-center justify-center border border-[#ECEDEF] text-[#525866]">
                            <Icon icon="solar:letter-linear" className="text-[16px]" />
                          </div>
                          <div className="flex-1">
                            <p className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider">Email</p>
                            <p className="text-[13px] font-bold text-[#111111]">{selectedDealer.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3">
                          <div className="w-8 h-8 rounded-[8px] bg-white flex items-center justify-center border border-[#ECEDEF] text-[#525866]">
                            <Icon icon="solar:document-linear" className="text-[16px]" />
                          </div>
                          <div className="flex-1">
                            <p className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider">Tax ID</p>
                            <p className="text-[13px] font-bold text-[#111111]">{selectedDealer.registrationId}</p>
                          </div>
                        </div>
                      </div>
                    </div>
 
                     {/* Performance Scorecard */}
                     <div>
                       <div className="flex items-center justify-between mb-3">
                         <h3 className="text-[14px] font-bold text-[#111111]">Performance Scorecard</h3>
                         <span className="text-[11px] font-bold text-[#D40073] bg-[#D40073]/5 px-2 py-0.5 rounded-full uppercase">Live KPI</span>
                       </div>
                       <div className="grid grid-cols-3 gap-3">
                         <div className="p-3 bg-white border border-[#ECEDEF] rounded-[14px]">
                           <p className="text-[10px] font-bold text-[#8B93A7] uppercase tracking-wider mb-1">Sales Rank</p>
                           <p className="text-[16px] font-bold text-[#111111]">#12 <span className="text-[10px] text-[#16A34A] tracking-normal">↑4</span></p>
                         </div>
                         <div className="p-3 bg-white border border-[#ECEDEF] rounded-[14px]">
                           <p className="text-[10px] font-bold text-[#8B93A7] uppercase tracking-wider mb-1">Return Rate</p>
                           <p className="text-[16px] font-bold text-[#111111]">1.2% <span className="text-[10px] text-[#16A34A]">Good</span></p>
                         </div>
                         <div className="p-3 bg-white border border-[#ECEDEF] rounded-[14px]">
                           <p className="text-[10px] font-bold text-[#8B93A7] uppercase tracking-wider mb-1">Payout Day</p>
                           <p className="text-[16px] font-bold text-[#111111]">18 <span className="text-[10px] text-[#8B93A7]">Avg</span></p>
                         </div>
                       </div>
                       <div className="mt-3 p-4 bg-[#F7F7F8] border border-[#ECEDEF] rounded-[16px]">
                         <div className="flex items-center justify-between mb-2">
                           <p className="text-[12px] font-bold text-[#111111]">Inventory Health</p>
                           <p className="text-[12px] font-bold text-[#16A34A]">94%</p>
                         </div>
                         <div className="w-full h-2 bg-[#ECEDEF] rounded-full overflow-hidden">
                           <div className="h-full bg-[#16A34A] rounded-full" style={{ width: '94%' }} />
                         </div>
                         <p className="text-[11px] text-[#8B93A7] mt-2 font-medium italic">"Consistent stock rotation and zero aging inventory."</p>
                       </div>
                     </div>
                    </motion.div>

                 <div className="h-px bg-[#ECEDEF] my-2" />

                 {/* ── Orders ── */}
                   <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                     <div className="flex items-center justify-between">
                       <h3 className="text-[15px] font-bold text-[#111111]">Recent Orders</h3>
                       <button 
                         onClick={() => setIsAllOrdersModalOpen(true)}
                         className="text-[13px] font-bold text-[#D40073] hover:underline"
                       >
                         View All
                       </button>
                     </div>
                      <div className="space-y-3">
                        {dealerOrders.map(o => (
                          <div 
                            key={o.id} 
                            onClick={() => setSelectedOrder(o)}
                            className="p-4 bg-white border border-[#ECEDEF] rounded-[14px] flex items-center justify-between hover:border-[#D40073] transition-colors cursor-pointer group"
                          >
                             <div>
                               <p className="text-[14px] font-bold text-[#111111] group-hover:text-[#D40073] transition-colors">{o.id}</p>
                               <p className="text-[13px] font-medium text-[#525866] mt-0.5">{new Date(o.createdAt).toLocaleDateString()} · {o.items.length} items</p>
                             </div>
                             <div className="text-right">
                               <p className="text-[15px] font-bold text-[#111111]">{formatMoney(o.totalAmount)}</p>
                               <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-[4px] mt-1 text-[11px] font-bold ${
                                 o.paymentStatus === 'Paid' ? 'bg-[#ECFDF3] text-[#16A34A]' : 'bg-[#EFF6FF] text-[#2563EB]'
                               }`}>{o.paymentStatus}</span>
                             </div>
                          </div>
                        ))}
                      </div>
                   </motion.div>

                 <div className="h-px bg-[#ECEDEF] my-2" />

                 {/* ── Payments ── */}
                   <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="flex items-center justify-between">
                       <h3 className="text-[15px] font-bold text-[#111111]">Payment History</h3>
                       <button className="h-8 px-3 bg-[#111111] text-white rounded-[8px] text-[12px] font-bold hover:bg-[#333333] transition-colors">
                         Record Payment
                       </button>
                     </div>
                     <div className="bg-white border border-[#ECEDEF] rounded-[14px] overflow-hidden">
                       <table className="w-full text-left border-collapse">
                         <thead>
                           <tr className="bg-[#F7F7F8] border-b border-[#ECEDEF]">
                             <th className="py-3 px-4 text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider">Reference</th>
                             <th className="py-3 px-4 text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider">Amount</th>
                             <th className="py-3 px-4 text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider">Method</th>
                           </tr>
                         </thead>
                          <tbody className="divide-y divide-[#ECEDEF]">
                            {MOCK_DEALER_PAYMENTS.map(p => (
                              <tr key={p.id}>
                                <td className="py-3 px-4">
                                  <p className="text-[13px] font-bold text-[#111111]">{p.id}</p>
                                  <p className="text-[12px] font-medium text-[#525866]">{p.date}</p>
                                </td>
                                <td className="py-3 px-4 text-[13px] font-bold text-[#111111]">{formatMoney(p.amount)}</td>
                                <td className="py-3 px-4 text-[13px] font-medium text-[#525866]">{p.method}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>

                 <div className="h-px bg-[#ECEDEF] my-2" />

                 {/* ── Credit ── */}
                     <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                       <div className="p-8 bg-[#F7F7F8] border border-[#ECEDEF] rounded-[24px] text-center">
                          <div className="w-16 h-16 rounded-full bg-[#111111] text-white flex items-center justify-center mx-auto mb-4">
                            <Icon icon="solar:chart-square-bold-duotone" className="text-[32px]" />
                          </div>
                          <h3 className="text-[18px] font-black text-[#111111]">Centralized Credit Management</h3>
                          <p className="text-[14px] font-medium text-[#525866] mt-2 max-w-sm mx-auto">
                            Detailed credit accounts, repayment history, and automated scoring have moved to the new Credit module.
                          </p>
                          
                          <div className="mt-8 grid grid-cols-2 gap-4 text-left">
                            <div className="p-4 bg-white border border-[#ECEDEF] rounded-[18px]">
                               <p className="text-[11px] font-black text-[#8B93A7] uppercase tracking-wider">Credit Score</p>
                               <p className="text-[20px] font-black text-[#111111] mt-1">{dealerWithLiveCredit.creditScore}</p>
                            </div>
                            <div className="p-4 bg-white border border-[#ECEDEF] rounded-[18px]">
                               <p className="text-[11px] font-black text-[#8B93A7] uppercase tracking-wider">Available</p>
                               <p className="text-[20px] font-black text-[#111111] mt-1">{formatMoney(dealerWithLiveCredit.creditLimit - dealerWithLiveCredit.outstanding)}</p>
                            </div>
                          </div>

                          <Link 
                            to="/dashboard/credit"
                            className="mt-6 w-full h-12 bg-[#111111] text-white rounded-[16px] text-[14px] font-black flex items-center justify-center gap-2 hover:bg-black transition-all"
                          >
                            Manage in Credit Module
                            <Icon icon="solar:arrow-right-up-linear" className="text-[18px]" />
                          </Link>
                       </div>

                       <div className="space-y-4">
                          <h4 className="text-[13px] font-black text-[#111111] uppercase tracking-widest">Recent Activity</h4>
                          {[
                            { label: 'Repayment Received', date: '25 Mar, 2024', amount: '+ GHS 5,000', color: 'text-[#16A34A]' },
                            { label: 'Credit Order #5521', date: '20 Mar, 2024', amount: '- GHS 12,500', color: 'text-[#EF4444]' },
                          ].map((act, i) => (
                             <div key={i} className="flex items-center justify-between p-4 bg-white border border-[#ECEDEF] rounded-[18px]">
                                <div>
                                   <p className="text-[14px] font-black text-[#111111]">{act.label}</p>
                                   <p className="text-[12px] font-bold text-[#8B93A7]">{act.date}</p>
                                </div>
                                <p className={`text-[14px] font-black ${act.color}`}>{act.amount}</p>
                             </div>
                          ))}
                       </div>
                     </motion.div>

                 <div className="h-px bg-[#ECEDEF] my-2" />

                 {/* ── Consignment ── */}
                     <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                       <div className="flex items-center justify-between">
                         <h3 className="text-[15px] font-bold text-[#111111]">Stock Consignments</h3>
                         <span className="text-[11px] font-bold text-[#D40073] bg-[#D40073]/5 px-2 py-0.5 rounded-full uppercase">Live Manifest</span>
                       </div>
                       
                       <div className="space-y-3">
                         {outboundConsignments.filter(c => c.partnerId === selectedDealer.id).length > 0 ? (
                           outboundConsignments.filter(c => c.partnerId === selectedDealer.id).map(c => (
                             <div key={c.id} className="p-4 bg-white border border-[#ECEDEF] rounded-[20px] flex items-center justify-between hover:border-[#D40073] transition-all group">
                               <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-[12px] bg-[#F3F4F6] flex items-center justify-center text-[#D40073]">
                                   <Icon icon="solar:box-minimalistic-bold" className="text-[20px]" />
                                 </div>
                                 <div>
                                   <p className="text-[14px] font-black text-[#111111]">{c.name}</p>
                                   <p className="text-[12px] font-medium text-[#8B93A7] mt-0.5">{c.date} · {c.items.length} items</p>
                                 </div>
                               </div>
                               <div className="text-right">
                                 <p className="text-[15px] font-black text-[#111111]">{formatMoney(c.totalValue)}</p>
                                 <span className={`inline-flex px-2 py-0.5 rounded-[6px] mt-1 text-[10px] font-bold uppercase tracking-wider ${
                                   c.status === 'Settled' ? 'bg-[#ECFDF3] text-[#16A34A]' : 
                                   c.status === 'On Shelf' ? 'bg-[#EFF6FF] text-[#2563EB]' :
                                   'bg-[#FFF7ED] text-[#D97706]'
                                 }`}>{c.status}</span>
                               </div>
                             </div>
                           ))
                         ) : (
                           <div className="py-12 flex flex-col items-center justify-center text-center bg-[#F7F7F8] rounded-[24px] border border-dashed border-[#ECEDEF]">
                             <div className="w-14 h-14 rounded-full bg-white border border-[#ECEDEF] flex items-center justify-center text-[#D1D5DB] mb-3">
                               <Icon icon="solar:box-minimalistic-broken" className="text-[28px]" />
                             </div>
                             <p className="text-[14px] font-bold text-[#111111]">No Consignments Found</p>
                             <p className="text-[12px] text-[#8B93A7] mt-1 max-w-[200px] mx-auto">This dealer currently has no active stock movements.</p>
                           </div>
                         )}
                       </div>
                     </motion.div>

              </div>

              {/* Drawer Footer (Global Add Order) */}
              <div className="p-5 border-t border-[#ECEDEF] bg-[#F7F7F8] shrink-0">
                <button 
                  onClick={() => openCreateOrder(selectedDealer.id)}
                  className="w-full h-[46px] flex items-center justify-center gap-2 bg-[#D40073] hover:bg-[#B80063] text-white font-bold text-[14px] rounded-[12px] transition-all"
                >
                  <Icon icon="solar:cart-plus-bold" className="text-[18px]" />
                  Process New Order
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>


      {/* ── Order Details Modal ── */}
      <Dialog.Root open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <AnimatePresence>
          {selectedOrder && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/55 backdrop-blur-[6px] z-[80]" />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] z-[90] bg-white dark:bg-[#151B2B] border border-[#ECEDEF] dark:border-white/10 rounded-[24px] overflow-hidden font-sans"
                >
                  <div className="p-6 border-b border-[#ECEDEF] flex justify-between items-center bg-[#F7F7F8]">
                    <div>
                      <h2 className="text-[18px] font-bold text-[#111111]">{selectedOrder.id}</h2>
                      <p className="text-[13px] text-[#8B93A7] font-medium">{selectedOrder.date}</p>
                    </div>
                    <Dialog.Close asChild>
                      <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[rgba(0,0,0,0.05)] text-[#8B93A7]">
                        <Icon icon="solar:close-square-linear" className="text-[22px]" />
                      </button>
                    </Dialog.Close>
                  </div>
                  <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-[12px] bg-[#F7F7F8] border border-[#ECEDEF]">
                        <p className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider mb-1">Status</p>
                        <span className="px-2 py-0.5 rounded-[4px] bg-[#ECFDF3] text-[#16A34A] text-[12px] font-bold">{selectedOrder.status}</span>
                      </div>
                      <div className="p-3 rounded-[12px] bg-[#F7F7F8] border border-[#ECEDEF]">
                        <p className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider mb-1">Payment</p>
                        <span className="px-2 py-0.5 rounded-[4px] bg-[#EFF6FF] text-[#2563EB] text-[12px] font-bold">{selectedOrder.payment}</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-[14px] font-bold text-[#111111] mb-3">Order Items</h3>
                      <div className="space-y-2">
                        {selectedOrder.lines?.map((line: any, i: number) => (
                          <div key={i} className="flex justify-between items-center p-3 rounded-[12px] border border-[#ECEDEF]">
                             <div>
                               <p className="text-[13px] font-bold text-[#111111]">{line.name}</p>
                               <p className="text-[12px] text-[#8B93A7]">Qty: {line.qty} × {formatMoney(line.price)}</p>
                             </div>
                             <p className="text-[14px] font-bold text-[#111111]">{formatMoney(line.qty * line.price)}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-[16px] bg-[#111111] text-white">
                      <div className="flex justify-between items-center mb-1 opacity-60 text-[13px]">
                        <span>Subtotal</span>
                        <span>{formatMoney(selectedOrder.total)}</span>
                      </div>
                      <div className="flex justify-between items-center mb-3 opacity-60 text-[13px]">
                        <span>Delivery Fee</span>
                        <span>GHS 0.00</span>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-white/10">
                        <span className="font-bold">Total Amount</span>
                        <span className="text-[18px] font-bold">{formatMoney(selectedOrder.total)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 border-t border-[#ECEDEF] flex gap-3">
                    <button 
                      onClick={() => openSharingModal(selectedOrder)}
                      className="flex-1 h-11 bg-[#F3F4F6] text-[#111111] font-bold rounded-[12px] text-[14px]"
                    >
                      Update Status
                    </button>
                    <button className="flex-1 h-11 bg-[#D40073] text-white font-bold rounded-[12px] text-[14px]">Print Invoice</button>
                  </div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>

      {/* ── All Orders Modal (Enhanced with Filters & Big Table) ── */}
      <Dialog.Root open={isAllOrdersModalOpen} onOpenChange={setIsAllOrdersModalOpen}>
        <AnimatePresence>
          {isAllOrdersModalOpen && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-[8px] z-[60]" />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0.98, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: 15 }}
                  className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1024px] z-[70] bg-white rounded-[28px] overflow-hidden border border-[#ECEDEF] font-sans flex flex-col max-h-[90vh]"
                >
                  {/* Header */}
                  <div className="p-8 border-b border-[#ECEDEF] flex justify-between items-center bg-[#F7F7F8]">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-[14px] bg-[#111111] flex items-center justify-center text-white">
                        <Icon icon="solar:clipboard-list-bold-duotone" className="text-[24px]" />
                      </div>
                      <div>
                        <h2 className="text-[22px] font-bold text-[#111111] tracking-tight">Full Order History</h2>
                        <p className="text-[14px] text-[#525866] font-medium flex items-center gap-1.5 mt-0.5">
                          Tracking transactions for <span className="text-[#111111] font-bold">{selectedDealer?.name}</span>
                        </p>
                      </div>
                    </div>
                    <Dialog.Close asChild>
                      <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[rgba(0,0,0,0.05)] text-[#8B93A7] transition-all">
                        <Icon icon="solar:close-square-linear" className="text-[26px]" />
                      </button>
                    </Dialog.Close>
                  </div>

                  {/* Filter Bar */}
                  <div className="px-8 py-5 border-b border-[#ECEDEF] dark:border-white/5 flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-[#151B2B] sticky top-0 z-10">
                    <div className="flex items-center gap-3 flex-1 min-w-[300px]">
                      <div className="relative flex-1 group">
                        <Icon icon="solar:magnifer-linear" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B93A7] group-focus-within:text-[#D40073] transition-colors" />
                        <input 
                          type="text" 
                          placeholder="Search order ID or items..."
                          value={orderSearch}
                          onChange={(e) => setOrderSearch(e.target.value)}
                          className="w-full h-11 pl-11 pr-4 bg-white dark:bg-white/5 border border-[#E4E7EC] dark:border-white/10 rounded-[12px] text-[13px] font-black text-[#111111] dark:text-white placeholder:text-[#8B93A7] focus:outline-none focus:border-[#D40073] transition-all shadow-sm"
                        />
                      </div>
                      <div className="relative">
                        <select 
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="h-11 pl-4 pr-10 bg-white dark:bg-white/5 border border-[#E4E7EC] dark:border-white/10 rounded-[12px] text-[13px] font-black text-[#111111] dark:text-white cursor-pointer appearance-none hover:bg-[#F3F4F6] dark:hover:bg-white/10 transition-colors min-w-[140px] shadow-sm"
                        >
                          <option>All Status</option>
                          <option>Delivered</option>
                          <option>Pending</option>
                          <option>Canceled</option>
                        </select>
                        <Icon icon="solar:alt-arrow-down-linear" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8B93A7] pointer-events-none" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="h-11 px-5 rounded-[12px] bg-white dark:bg-white/5 border border-[#E4E7EC] dark:border-white/10 text-[13px] font-black text-[#525866] dark:text-[#8B93A7] hover:border-[#D40073] flex items-center gap-2 transition-all shadow-sm uppercase tracking-wider">
                        <Icon icon="solar:calendar-linear" className="text-[18px]" />
                        TIME RANGE
                      </button>
                      <button className="h-11 px-6 bg-[#111111] dark:bg-white text-white dark:text-[#111111] rounded-[12px] text-[13px] font-black hover:bg-[#D40073] hover:text-white transition-all shadow-sm uppercase tracking-widest">
                        EXPORT LIST
                      </button>
                    </div>
                  </div>

                  {/* Table Body */}
                  <div className="flex-1 overflow-y-auto min-h-0 bg-white dark:bg-[#151B2B]">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#F9FAFB] dark:bg-white/5 border-b border-[#ECEDEF] dark:border-white/5 sticky top-0 z-20">
                          <th className="py-4 px-8 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest">Order Details</th>
                          <th className="py-4 px-6 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest">Fulfillment</th>
                          <th className="py-4 px-6 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest text-center">Status</th>
                          <th className="py-4 px-6 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest">Amount</th>
                          <th className="py-4 px-8 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#ECEDEF]">
                        {[...MOCK_DEALER_ORDERS, ...MOCK_DEALER_ORDERS, ...MOCK_DEALER_ORDERS].map((o, i) => (
                          <tr key={o.id + i} className="group hover:bg-[#FBFBFC] dark:hover:bg-white/5 transition-all">
                            <td className="py-5 px-8">
                              <div className="flex flex-col">
                                <span className="text-[14px] font-black text-[#111111] dark:text-white group-hover:text-[#D40073] transition-colors">{o.id}</span>
                                <span className="text-[11px] font-bold text-[#8B93A7] uppercase mt-1 tracking-wider">{o.date} • {o.items} UNITS</span>
                              </div>
                            </td>
                            <td className="py-5 px-6">
                               <div className="flex flex-col gap-1.5">
                                 <div className="flex items-center gap-1.5 text-[13px] font-black text-[#111111] dark:text-white uppercase tracking-tight">
                                   <div className={`w-2 h-2 rounded-full ${o.status === 'Delivered' ? 'bg-[#16A34A]' : 'bg-[#D97706]'}`} />
                                   {o.status}
                                 </div>
                                 <span className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider">{o.fulfillment}</span>
                               </div>
                            </td>
                            <td className="py-5 px-6 text-center">
                              <span className={`inline-flex px-2.5 py-1 rounded-[6px] text-[11px] font-black uppercase tracking-wider border shadow-sm ${
                                o.payment === 'Paid' ? 'bg-[#ECFDF3] dark:bg-[#064E3B]/30 text-[#16A34A] border-[#16A34A]/10' : 'bg-[#EFF6FF] dark:bg-[#1E3A8A]/30 text-[#2563EB] border-[#2563EB]/10'
                              }`}>
                                {o.payment}
                              </span>
                            </td>
                            <td className="py-5 px-6">
                               <span className="text-[16px] font-black text-[#111111] dark:text-white tracking-tight">{formatMoney(o.total)}</span>
                            </td>
                            <td className="py-5 px-8 text-right">
                               <button 
                                 onClick={() => setSelectedOrder(o)}
                                 className="h-10 px-4 rounded-[10px] bg-white dark:bg-white/5 border border-[#E4E7EC] dark:border-white/10 text-[12px] font-black text-[#111111] dark:text-white hover:border-[#D40073] hover:text-[#D40073] hover:bg-[#D40073]/5 transition-all shadow-sm uppercase tracking-wider"
                               >
                                 Details
                               </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Footer */}
                  <div className="px-8 py-5 border-t border-[#ECEDEF] dark:border-white/5 bg-[#F9FAFB] dark:bg-white/5 flex items-center justify-between shrink-0">
                    <p className="text-[13px] text-[#8B93A7] font-black uppercase tracking-wider">Total <span className="text-[#111111] dark:text-white">12 Orders</span> found</p>
                    <Dialog.Close asChild>
                      <button className="h-11 px-8 bg-[#111111] dark:bg-white text-white dark:text-[#111111] font-black rounded-[14px] text-[13px] hover:bg-[#D40073] hover:text-white transition-all shadow-sm uppercase tracking-widest">CLOSE HISTORY</button>
                    </Dialog.Close>
                  </div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>

      {/* ── Returns (RMA) Modal ── */}
      <Dialog.Root open={isReturnModalOpen} onOpenChange={setIsReturnModalOpen}>
        <AnimatePresence>
          {isReturnModalOpen && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-[8px] z-[150]" />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] z-[160] bg-white rounded-[28px] overflow-hidden border border-[#ECEDEF] font-sans"
                >
                  <div className="p-6 border-b border-[#ECEDEF] bg-[#F7F7F8] flex justify-between items-center">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-[12px] bg-[#DC2626] text-white flex items-center justify-center">
                         <Icon icon="solar:backspace-bold" className="text-[20px]" />
                       </div>
                       <h2 className="text-[18px] font-bold text-[#111111]">Process Inventory Return</h2>
                    </div>
                    <Dialog.Close asChild>
                      <button className="w-8 h-8 rounded-full hover:bg-[rgba(0,0,0,0.05)] text-[#8B93A7] flex items-center justify-center">
                        <Icon icon="solar:close-square-linear" className="text-[22px]" />
                      </button>
                    </Dialog.Close>
                  </div>
                  <div className="p-6 space-y-5">
                    <div className="flex flex-col gap-2">
                       <label className="text-[12px] font-bold text-[#525866]">Select Product to Return</label>
                       <select className="h-11 px-4 bg-[#F7F7F8] border border-[#ECEDEF] rounded-[12px] text-[13px] font-medium outline-none focus:border-[#D40073]">
                         <option>Ultra-Bond Cement</option>
                         <option>Steel Rods 12mm</option>
                         <option>Gyp-Rock Plaster</option>
                       </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="flex flex-col gap-2">
                         <label className="text-[12px] font-bold text-[#525866]">Quantity</label>
                         <input type="number" placeholder="0" className="h-11 px-4 bg-[#F7F7F8] border border-[#ECEDEF] rounded-[12px] text-[13px] font-medium outline-none focus:border-[#D40073]" />
                       </div>
                       <div className="flex flex-col gap-2">
                         <label className="text-[12px] font-bold text-[#525866]">Reason</label>
                         <select className="h-11 px-4 bg-[#F7F7F8] border border-[#ECEDEF] rounded-[12px] text-[13px] font-medium outline-none focus:border-[#D40073]">
                           <option>Damaged</option>
                           <option>Expired</option>
                           <option>Exchange</option>
                         </select>
                       </div>
                    </div>
                    <div className="p-4 rounded-[16px] bg-[#FEF2F2] border border-[#FEE2E2]">
                       <p className="text-[12px] font-medium text-[#991B1B] leading-relaxed">
                         <strong>Note:</strong> Processing this return will automatically generate a Credit Note for {selectedDealer?.name} and update the main inventory.
                       </p>
                    </div>
                  </div>
                  <div className="p-6 bg-[#F7F7F8] border-t border-[#ECEDEF] flex gap-3">
                    <Dialog.Close asChild>
                      <button className="flex-1 h-11 bg-white border border-[#ECEDEF] text-[#111111] font-bold rounded-[12px] text-[13px]">Cancel</button>
                    </Dialog.Close>
                    <button className="flex-1 h-11 bg-[#DC2626] text-white font-bold rounded-[12px] text-[13px]">Process & Credit</button>
                  </div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>

      {/* ── Replenish Stock Modal ── */}
      <Dialog.Root open={isReplenishModalOpen} onOpenChange={setIsReplenishModalOpen}>
        <AnimatePresence>
          {isReplenishModalOpen && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-[8px] z-[150]" />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] z-[160] bg-white rounded-[28px] overflow-hidden border border-[#ECEDEF] font-sans"
                >
                  <div className="p-6 border-b border-[#ECEDEF] bg-[#F7F7F8] flex justify-between items-center">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-[12px] bg-[#111111] text-white flex items-center justify-center">
                         <Icon icon="solar:box-bold" className="text-[20px]" />
                       </div>
                       <h2 className="text-[18px] font-bold text-[#111111]">Replenish Consignment</h2>
                    </div>
                    <Dialog.Close asChild>
                      <button className="w-8 h-8 rounded-full hover:bg-[rgba(0,0,0,0.05)] text-[#8B93A7] flex items-center justify-center">
                        <Icon icon="solar:close-square-linear" className="text-[22px]" />
                      </button>
                    </Dialog.Close>
                  </div>
                  <div className="p-6 space-y-4">
                    <p className="text-[13px] text-[#525866] font-medium">Quickly reload high-velocity items for {selectedDealer?.name}.</p>
                    <div className="space-y-3">
                       {[
                         { name: 'Ultra-Bond Cement', autoQty: 100, current: 45 },
                         { name: 'Steel Rods 12mm', autoQty: 25, current: 8 },
                       ].map((item, i) => (
                         <div key={i} className="flex flex-col p-4 bg-[#F7F7F8] rounded-[16px] border border-[#ECEDEF]">
                            <div className="flex justify-between items-center mb-2">
                               <p className="text-[14px] font-bold text-[#111111]">{item.name}</p>
                               <span className="text-[11px] font-bold text-[#D40073]">Auto-Suggest</span>
                            </div>
                            <div className="flex items-center gap-4">
                               <div className="flex-1">
                                 <p className="text-[11px] text-[#8B93A7] uppercase font-bold">New Delivery Qty</p>
                                 <input type="number" defaultValue={item.autoQty} className="w-full h-10 bg-white border border-[#ECEDEF] rounded-[8px] px-3 mt-1 text-[13px] font-bold" />
                               </div>
                               <div className="w-px h-8 bg-[#ECEDEF]" />
                               <div>
                                 <p className="text-[11px] text-[#8B93A7] uppercase font-bold">Current</p>
                                 <p className="text-[15px] font-bold text-[#111111] mt-1">{item.current}</p>
                               </div>
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>
                  <div className="p-6 bg-[#F7F7F8] border-t border-[#ECEDEF] flex gap-3">
                    <Dialog.Close asChild>
                      <button className="flex-1 h-11 bg-white border border-[#ECEDEF] text-[#111111] font-bold rounded-[12px] text-[13px]">Cancel</button>
                    </Dialog.Close>
                    <button className="flex-1 h-11 bg-[#111111] text-white font-bold rounded-[12px] text-[13px]">Confirm Dispatch</button>
                  </div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>

    </div>
  );
}
