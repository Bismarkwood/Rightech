import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'motion/react';
import { useCredit } from '../context/CreditContext';
import * as Dialog from '@radix-ui/react-dialog';
import { 
  MOCK_DEALERS, MOCK_DEALER_ORDERS, MOCK_DEALER_PAYMENTS, MOCK_DEALER_CONSIGNMENTS, Dealer
} from '../data/mockDealerData';

const TABS = ['Overview', 'Orders', 'Payments', 'Credit'];
const CATALOG = [
  { label: 'Samsung Galaxy A54', price: 2500 },
  { label: 'LG 55" UHD TV', price: 9000 },
  { label: 'JBL Flip 6', price: 1280 },
  { label: 'Sony WH-1000XM5', price: 3400 },
  { label: 'Apple Watch Series 9', price: 4200 },
];

export default function DealerManagement() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { accounts, getAccountByDealerId } = useCredit();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
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
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
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
  const [itemRows, setItemRows] = useState([0]);

  const filteredDealers = MOCK_DEALERS.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'All' || d.status === statusFilter;
    const matchRegion = regionFilter === 'All' || d.region === regionFilter;
    return matchSearch && matchStatus && matchRegion;
  });

  const regions = Array.from(new Set(MOCK_DEALERS.map(d => d.region)));

  const addRow = () => setItemRows(r => [...r, Date.now()]);
  const removeRow = (key: number) => setItemRows(r => r.filter(k => k !== key));

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
      <div className="px-6 md:px-8 pt-8 pb-6 bg-[#F7F7F8] shrink-0 sticky top-0 z-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-[28px] font-bold text-[#111111] tracking-tight mb-2">Dealer Management</h1>
            <p className="text-[14px] text-[#525866] max-w-xl leading-relaxed font-medium">
              Browse & order products · Pay (cash / e-cash / credit)<br />
              View consignment history · View credit score
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="h-10 px-4 flex items-center gap-2 bg-white border border-[#E4E7EC] rounded-[10px] text-[13px] font-bold text-[#111111] hover:bg-[#F3F4F6] transition-colors">
              <Icon icon="solar:download-square-linear" className="text-[18px]" />
              Export Data
            </button>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="h-10 px-4 flex items-center gap-2 bg-[#D40073] hover:bg-[#B80063] text-white rounded-[10px] text-[13px] font-bold transition-colors"
            >
              <Icon icon="solar:add-circle-linear" className="text-[18px]" />
              Create Dealer
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
          {/* Stat 1 */}
          <div className="relative p-5 rounded-[16px] overflow-hidden text-white" style={{ background: 'linear-gradient(135deg, #120009 0%, #2e001a 100%)', boxShadow: '0 8px 24px rgba(46,0,26,0.15)' }}>
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full pointer-events-none opacity-20" style={{ background: 'radial-gradient(circle, #D40073, transparent 70%)' }} />
            <div className="relative flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <Icon icon="solar:users-group-two-rounded-bold" className="text-[20px]" />
              </div>
            </div>
            <p className="relative text-[13px] font-bold uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Total Dealers</p>
            <p className="relative text-[24px] font-bold text-white tracking-tight">1,248</p>
          </div>
          {/* Stat 2 */}
          <div className="relative p-5 rounded-[16px] overflow-hidden text-white" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)', boxShadow: '0 8px 24px rgba(49,46,129,0.15)' }}>
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full pointer-events-none opacity-20" style={{ background: 'radial-gradient(circle, #818cf8, transparent 70%)' }} />
            <div className="relative flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <Icon icon="solar:chart-square-bold" className="text-[20px]" />
              </div>
              <span className="px-2 py-1 rounded-[6px] text-[12px] font-bold" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>+5.2%</span>
            </div>
            <p className="relative text-[13px] font-bold uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Active Orders</p>
            <p className="relative text-[24px] font-bold text-white tracking-tight">342</p>
          </div>
          {/* Stat 3 */}
          <div className="relative p-5 rounded-[16px] overflow-hidden text-white" style={{ background: 'linear-gradient(135deg, #059669 0%, #064e3b 100%)', boxShadow: '0 8px 24px rgba(6,78,59,0.15)' }}>
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full pointer-events-none opacity-20" style={{ background: 'radial-gradient(circle, #34d399, transparent 70%)' }} />
            <div className="relative flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <Icon icon="solar:chart-pie-bold" className="text-[20px]" />
              </div>
            </div>
            <p className="relative text-[13px] font-bold uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Avg Credit Score</p>
            <p className="relative text-[24px] font-bold text-white tracking-tight">745</p>
          </div>
          {/* Stat 4 */}
          <div className="relative p-5 rounded-[16px] overflow-hidden text-white" style={{ background: 'linear-gradient(135deg, #ea580c 0%, #7c2d12 100%)', boxShadow: '0 8px 24px rgba(124,45,18,0.15)' }}>
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full pointer-events-none opacity-20" style={{ background: 'radial-gradient(circle, #fdba74, transparent 70%)' }} />
            <div className="relative flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <Icon icon="solar:wallet-bold" className="text-[20px]" />
              </div>
            </div>
            <p className="relative text-[13px] font-bold uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Total Outstanding</p>
            <p className="relative text-[24px] font-bold text-white tracking-tight">GHS 41,900</p>
          </div>
        </div>
      </div>

      {/* ── Main List Area ── */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 pt-0 min-h-0">
        <div className="max-w-[1400px] mx-auto">
          <div className="bg-white rounded-[16px] border border-[#ECEDEF] overflow-hidden">
            
            {/* Table Toolbar */}
            <div className="p-4 border-b border-[#ECEDEF] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#F7F7F8] relative">
              <div className="relative max-w-md w-full group">
                <Icon icon="solar:magnifer-linear" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B93A7] group-focus-within:text-[#D40073] transition-colors text-[18px]" />
                <input 
                  type="text" 
                  placeholder="Search dealers by name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 h-10 bg-white border border-[#E4E7EC] rounded-[10px] text-[13px] font-medium focus:outline-none focus:ring-[3px] focus:ring-[rgba(212,0,115,0.1)] focus:border-[#D40073] transition-all"
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
                    <div className="absolute right-0 mt-2 w-[280px] bg-white border border-[#E4E7EC] shadow-xl rounded-[16px] p-5 z-40 transform origin-top-right transition-all">
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
                  <tr className="border-b border-[#ECEDEF] bg-white">
                    <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Dealer</th>
                    <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Status</th>
                    <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Credit Score</th>
                    <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Orders</th>
                    <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Outstanding</th>
                    <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECEDEF]">
                  {filteredDealers.map((dealer) => (
                    <tr 
                      key={dealer.id} 
                      className="hover:bg-[#FBFBFC] transition-colors group cursor-pointer"
                      onClick={() => { setSelectedDealer(dealer); setActiveTab('Overview'); }}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-[10px] bg-[#F7F7F8] border border-[#ECEDEF] flex items-center justify-center text-[#111111] font-bold shrink-0 text-[16px]">
                            {dealer.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-[14px] font-bold text-[#111111]">{dealer.name}</p>
                            <p className="text-[13px] font-medium text-[#8B93A7]">{dealer.id} • {dealer.region}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-[6px] text-[12px] font-bold ${
                          dealer.status === 'Active' ? 'bg-[#ECFDF3] text-[#16A34A]' : 
                          dealer.status === 'Warning' ? 'bg-[#FFF7ED] text-[#D97706]' : 
                          'bg-[#F3F4F6] text-[#525866]'
                        }`}>
                          {dealer.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2.5">
                          <div className={`h-1.5 w-16 rounded-full overflow-hidden bg-[#F3F4F6]`}>
                            <div 
                              className="h-full rounded-full transition-all" 
                              style={{ width: `${(dealer.creditScore / 1000) * 100}%`, background: getRiskColor(dealer.creditScore) }}
                            />
                          </div>
                          <span className="text-[14px] font-bold text-[#111111]">{dealer.creditScore}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-[14px] font-bold text-[#111111]">{dealer.ordersCount}</p>
                        <p className="text-[12px] font-medium text-[#8B93A7]">Last: {dealer.lastOrder}</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-[14px] font-bold text-[#111111]">{formatMoney(dealer.outstanding)}</p>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#8B93A7] hover:bg-white hover:shadow-sm hover:text-[#111111] transition-all border border-transparent hover:border-[#ECEDEF]">
                            <Icon icon="solar:arrow-up-right-linear" className="text-[18px]" />
                          </button>
                          <button className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#8B93A7] hover:bg-white hover:shadow-sm hover:text-[#111111] transition-all border border-transparent hover:border-[#ECEDEF]">
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
            <div className="p-4 border-t border-[#ECEDEF] flex items-center justify-between text-[13px] font-medium text-[#525866] bg-[#F7F7F8]">
              <span>Showing {filteredDealers.length} of {MOCK_DEALERS.length} dealers</span>
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
              className="fixed top-0 right-0 bottom-0 w-full max-w-[600px] bg-white border-l border-[#ECEDEF] shadow-2xl z-50 flex flex-col font-sans"
            >
              {/* Drawer Header */}
              <div className="px-6 py-6 border-b border-[#ECEDEF] shrink-0 bg-[#F7F7F8] relative overflow-hidden">
                <button 
                  onClick={() => setSelectedDealer(null)}
                  className="absolute top-6 right-6 w-8 h-8 rounded-full hover:bg-[#E4E7EC] flex items-center justify-center transition-colors text-[#8B93A7] hover:text-[#111111]"
                >
                  <Icon icon="solar:close-square-linear" className="text-[22px]" />
                </button>

                <div className="flex items-center gap-4 mb-5">
                  <div className="w-16 h-16 rounded-[14px] bg-white border border-[#E4E7EC] shadow-sm flex items-center justify-center text-[#111111] text-[24px] font-bold shrink-0">
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

                {/* Tabs */}
                <div className="flex gap-1 bg-[#ECEDEF] p-1 rounded-[10px] w-fit">
                  {TABS.map(t => (
                    <button
                      key={t}
                      onClick={() => setActiveTab(t)}
                      className="h-8 px-4 rounded-[8px] text-[13px] font-bold transition-all"
                      style={activeTab === t ? { background: '#111111', color: '#fff' } : { color: '#525866' }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Drawer Scrolled Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
                
                {/* ── TAB: OVERVIEW ── */}
                {activeTab === 'Overview' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative p-4 rounded-[14px] overflow-hidden text-white" style={{ background: 'linear-gradient(135deg, #059669 0%, #064e3b 100%)', boxShadow: '0 4px 16px rgba(6,78,59,0.15)' }}>
                         <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full pointer-events-none opacity-20" style={{ background: 'radial-gradient(circle, #34d399, transparent 70%)' }} />
                         <p className="relative text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Credit Score</p>
                         <div className="relative flex items-center gap-3 mt-1">
                           <p className="text-[22px] font-bold text-white tracking-tight">{selectedDealer.creditScore}</p>
                           <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.2)' }}>
                             <div className="h-full rounded-full bg-white" style={{ width: `${(selectedDealer.creditScore/1000)*100}%` }} />
                           </div>
                         </div>
                      </div>
                      <div className="relative p-4 rounded-[14px] overflow-hidden text-white" style={{ background: 'linear-gradient(135deg, #120009 0%, #2e001a 100%)', boxShadow: '0 4px 16px rgba(46,0,26,0.15)' }}>
                         <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full pointer-events-none opacity-20" style={{ background: 'radial-gradient(circle, #D40073, transparent 70%)' }} />
                         <p className="relative text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Total Orders</p>
                         <p className="relative text-[22px] font-bold text-white tracking-tight mt-1">{selectedDealer.ordersCount}</p>
                      </div>
                      <div className="relative p-4 rounded-[14px] overflow-hidden text-white" style={{ background: 'linear-gradient(135deg, #ea580c 0%, #7c2d12 100%)', boxShadow: '0 4px 16px rgba(124,45,18,0.15)' }}>
                         <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full pointer-events-none opacity-20" style={{ background: 'radial-gradient(circle, #fdba74, transparent 70%)' }} />
                         <p className="relative text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Outstanding</p>
                         <p className="relative text-[22px] font-bold text-white tracking-tight mt-1">
                           {formatMoney(selectedDealer.outstanding)}
                         </p>
                      </div>
                      <div className="relative p-4 rounded-[14px] overflow-hidden text-white" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)', boxShadow: '0 4px 16px rgba(49,46,129,0.15)' }}>
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
                )}

                {/* ── TAB: ORDERS ── */}
                {activeTab === 'Orders' && (
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
                       {MOCK_DEALER_ORDERS.map(o => (
                         <div 
                           key={o.id} 
                           onClick={() => setSelectedOrder(o)}
                           className="p-4 bg-white border border-[#ECEDEF] rounded-[14px] flex items-center justify-between hover:border-[#D40073] transition-colors cursor-pointer group"
                         >
                            <div>
                              <p className="text-[14px] font-bold text-[#111111] group-hover:text-[#D40073] transition-colors">{o.id}</p>
                              <p className="text-[13px] font-medium text-[#525866] mt-0.5">{o.date} · {o.items} items</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[15px] font-bold text-[#111111]">{formatMoney(o.total)}</p>
                              <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-[4px] mt-1 text-[11px] font-bold ${
                                o.payment === 'Paid' ? 'bg-[#ECFDF3] text-[#16A34A]' : 'bg-[#EFF6FF] text-[#2563EB]'
                              }`}>{o.payment}</span>
                            </div>
                         </div>
                       ))}
                     </div>
                  </motion.div>
                )}

                {/* ── TAB: PAYMENTS ── */}
                {activeTab === 'Payments' && (
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
                 )}

                  {/* ── TAB: CREDIT (Centralized) ── */}
                  {activeTab === 'Credit' && (
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
                            className="mt-6 w-full h-12 bg-[#111111] text-white rounded-[16px] text-[14px] font-black flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg shadow-black/10"
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
                  )}
              </div>

              {/* Drawer Footer (Global Add Order) */}
              <div className="p-5 border-t border-[#ECEDEF] bg-[#F7F7F8] shrink-0">
                <button 
                  onClick={() => setIsNewOrderModalOpen(true)}
                  className="w-full h-[46px] flex items-center justify-center gap-2 bg-[#D40073] hover:bg-[#B80063] text-white font-bold text-[14px] rounded-[12px] transition-all"
                  style={{ boxShadow: '0 4px 14px rgba(212,0,115,0.25)' }}
                >
                  <Icon icon="solar:cart-plus-bold" className="text-[18px]" />
                  Process New Order
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Create Dealer Modal (Basic) ── */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCreateModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
             <motion.div
               initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
               className="w-full max-w-[500px] bg-white rounded-[20px] border border-[#ECEDEF] shadow-2xl relative z-10 overflow-hidden flex flex-col p-6 font-sans"
             >
               <h2 className="text-[20px] font-bold text-[#111111] mb-1">Create Dealer</h2>
               <p className="text-[14px] text-[#525866] mb-6">Enter basic information for the new dealer.</p>
               <input type="text" placeholder="Dealer Name" className="w-full h-[44px] px-4 border border-[#ECEDEF] rounded-[10px] mb-3 text-[14px] font-medium focus:outline-none focus:border-[#D40073]" />
               <input type="text" placeholder="Region" className="w-full h-[44px] px-4 border border-[#ECEDEF] rounded-[10px] mb-3 text-[14px] font-medium focus:outline-none focus:border-[#D40073]" />
               <input type="email" placeholder="Email" className="w-full h-[44px] px-4 border border-[#ECEDEF] rounded-[10px] mb-6 text-[14px] font-medium focus:outline-none focus:border-[#D40073]" />
               <div className="flex gap-3">
                 <button onClick={() => setIsCreateModalOpen(false)} className="flex-1 h-[44px] bg-[#F3F4F6] text-[#111111] font-bold rounded-[10px]">Cancel</button>
                 <button className="flex-1 h-[44px] bg-[#111111] text-white font-bold rounded-[10px]">Create</button>
               </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Premium "New Order" Modal for Dealer ── */}
      <Dialog.Root open={isNewOrderModalOpen} onOpenChange={setIsNewOrderModalOpen}>
        <AnimatePresence>
          {isNewOrderModalOpen && selectedDealer && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/55 backdrop-blur-[6px] z-[60]" />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.div
                  initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.97 }}
                  transition={{ type: 'spring', duration: 0.45, bounce: 0.16 }}
                  className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[640px] z-[70] focus:outline-none flex flex-col max-h-[92vh] rounded-[24px] overflow-hidden bg-white shadow-2xl border border-[rgba(255,255,255,0.1)]"
                >
                  {/* Header */}
                  <div className="relative px-8 pt-8 pb-6 bg-[#111111] shrink-0 text-white overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#D40073] opacity-20 rounded-full blur-[60px]" />
                    <div className="relative flex justify-between items-start">
                      <div className="flex gap-4 items-center">
                         <div className="w-12 h-12 rounded-[12px] bg-[rgba(255,255,255,0.1)] flex items-center justify-center border border-[rgba(255,255,255,0.1)] text-[#D40073]">
                           <Icon icon="solar:cart-large-4-bold" className="text-[24px]" />
                         </div>
                         <div>
                           <h2 className="text-[22px] font-bold tracking-tight leading-none">New Dealer Order</h2>
                           <p className="text-[13px] text-[rgba(255,255,255,0.6)] font-medium mt-1">Placing order for {selectedDealer.name}</p>
                         </div>
                      </div>
                      <Dialog.Close asChild>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full text-[rgba(255,255,255,0.5)] hover:bg-[rgba(255,255,255,0.1)] transition-colors">
                          <Icon icon="solar:close-square-linear" className="text-[22px]" />
                        </button>
                      </Dialog.Close>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="flex-1 overflow-y-auto bg-[#F7F7F8] p-6 space-y-4">
                     
                     <div className="bg-white rounded-[16px] border border-[#ECEDEF] p-5">
                       <h3 className="text-[14px] font-bold text-[#111111] flex items-center gap-2 mb-4">
                         <Icon icon="solar:box-linear" className="text-[#D40073]" /> Order Items
                       </h3>
                       <div className="space-y-3">
                         {itemRows.map(key => (
                           <div key={key} className="flex items-stretch gap-2 bg-[#F7F7F8] border border-[#E4E7EC] rounded-[10px] p-2">
                              <select className="flex-1 bg-transparent text-[13px] font-medium text-[#111111] focus:outline-none appearance-none ml-2 cursor-pointer">
                                {CATALOG.map((c, i) => <option key={i} value={i}>{c.label} - GHS {c.price}</option>)}
                              </select>
                              <div className="w-[1px] bg-[#E4E7EC] my-2" />
                              <div className="flex items-center gap-2 px-2 shrink-0">
                                <button className="w-7 h-7 rounded-[6px] bg-white border border-[#E4E7EC] flex items-center justify-center font-bold text-[#525866] hover:bg-[#F3F4F6]">−</button>
                                <span className="w-6 text-center text-[13px] font-bold">1</span>
                                <button className="w-7 h-7 rounded-[6px] bg-white border border-[#E4E7EC] flex items-center justify-center font-bold text-[#525866] hover:bg-[#F3F4F6]">+</button>
                              </div>
                              <button onClick={() => itemRows.length > 1 && removeRow(key)} className="w-9 shrink-0 flex items-center justify-center text-[#EF4444] hover:bg-[#FEF2F2] rounded-[8px] transition-colors">
                                <Icon icon="solar:trash-bin-trash-linear" className="text-[18px]" />
                              </button>
                           </div>
                         ))}
                         <button onClick={addRow} className="w-full h-10 border-2 border-dashed border-[#E4E7EC] rounded-[10px] text-[#8B93A7] font-bold text-[13px] hover:border-[#D40073] hover:text-[#D40073] hover:bg-[rgba(212,0,115,0.02)] transition-colors flex items-center justify-center gap-2">
                           <Icon icon="solar:add-circle-linear" className="text-[16px]" /> Add product line
                         </button>
                       </div>
                     </div>

                     <div className="bg-white rounded-[16px] border border-[#ECEDEF] p-5">
                       <h3 className="text-[14px] font-bold text-[#111111] flex items-center gap-2 mb-4">
                         <Icon icon="solar:card-linear" className="text-[#2563EB]" /> Payment terms
                       </h3>
                       <div className="grid grid-cols-2 gap-3">
                         <div className="relative">
                           <label className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider mb-1.5 block">Payment Method</label>
                           <select className="w-full h-[42px] px-3 bg-[#F7F7F8] border border-[#E4E7EC] rounded-[8px] text-[13px] font-medium focus:outline-none focus:border-[#2563EB] appearance-none">
                             <option>Cash / E-Cash</option>
                             <option>Net 15 (Credit)</option>
                             <option>Consignment</option>
                           </select>
                           <Icon icon="solar:alt-arrow-down-linear" className="absolute right-3 top-[32px] text-[#8B93A7] pointer-events-none" />
                         </div>
                         <div className="relative">
                           <label className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider mb-1.5 block">Fulfillment</label>
                           <select className="w-full h-[42px] px-3 bg-[#F7F7F8] border border-[#E4E7EC] rounded-[8px] text-[13px] font-medium focus:outline-none focus:border-[#2563EB] appearance-none">
                             <option>Direct Dispatch</option>
                             <option>In-Store Pickup</option>
                           </select>
                           <Icon icon="solar:alt-arrow-down-linear" className="absolute right-3 top-[32px] text-[#8B93A7] pointer-events-none" />
                         </div>
                       </div>
                     </div>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-5 bg-white border-t border-[#ECEDEF] flex justify-between items-center shrink-0">
                    <div>
                      <p className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider">Order Total</p>
                      <p className="text-[24px] font-bold text-[#111111] leading-none mt-1">GHS 2,500 <span className="text-[14px] text-[#8B93A7] font-medium">.00</span></p>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setIsNewOrderModalOpen(false)} className="h-[44px] px-5 bg-[#F3F4F6] hover:bg-[#E4E7EC] rounded-[10px] text-[#111111] font-bold text-[14px] transition-colors">
                        Cancel
                      </button>
                      <button className="h-[44px] px-6 bg-[#D40073] hover:bg-[#B80063] text-white rounded-[10px] font-bold text-[14px] flex items-center justify-center gap-2 transition-all shadow-md">
                        <Icon icon="solar:check-circle-bold" className="text-[18px]" /> Complete Order
                      </button>
                    </div>
                  </div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>

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
                  className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] z-[90] bg-white rounded-[24px] overflow-hidden shadow-2xl border border-[#ECEDEF] font-sans"
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
                    <button className="flex-1 h-11 bg-[#F3F4F6] text-[#111111] font-bold rounded-[12px] text-[14px]">Update Status</button>
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
                  className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1024px] z-[70] bg-white rounded-[28px] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.25)] border border-[#ECEDEF] font-sans flex flex-col max-h-[90vh]"
                >
                  {/* Header */}
                  <div className="p-8 border-b border-[#ECEDEF] flex justify-between items-center bg-[#F7F7F8]">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-[14px] bg-[#111111] flex items-center justify-center text-white shadow-lg">
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
                  <div className="px-8 py-5 border-b border-[#ECEDEF] flex flex-wrap items-center justify-between gap-4 bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-3 flex-1 min-w-[300px]">
                      <div className="relative flex-1 group">
                        <Icon icon="solar:magnifer-linear" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B93A7] group-focus-within:text-[#D40073] transition-colors" />
                        <input 
                          type="text" 
                          placeholder="Search order ID or items..."
                          value={orderSearch}
                          onChange={(e) => setOrderSearch(e.target.value)}
                          className="w-full h-11 pl-11 pr-4 bg-[#F7F7F8] border border-[#E4E7EC] rounded-[12px] text-[14px] font-medium focus:outline-none focus:ring-[3px] focus:ring-[rgba(212,0,115,0.08)] focus:border-[#D40073] transition-all"
                        />
                      </div>
                      <div className="relative">
                        <select 
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="h-11 pl-4 pr-10 bg-[#F7F7F8] border border-[#E4E7EC] rounded-[12px] text-[14px] font-bold text-[#111111] cursor-pointer appearance-none hover:bg-[#F3F4F6] transition-colors min-w-[140px]"
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
                      <button className="h-11 px-4 rounded-[12px] bg-white border border-[#E4E7EC] text-[13px] font-bold text-[#525866] hover:bg-[#F7F7F8] flex items-center gap-2 transition-all">
                        <Icon icon="solar:calendar-linear" className="text-[18px]" />
                        Date Range
                      </button>
                      <button className="h-11 px-6 bg-[#111111] text-white rounded-[12px] text-[13px] font-bold hover:bg-[#333333] transition-all shadow-md shadow-black/10">
                        Export List
                      </button>
                    </div>
                  </div>

                  {/* Table Body */}
                  <div className="flex-1 overflow-y-auto min-h-0 bg-white">
                    <table className="w-full text-left border-separate border-spacing-0">
                      <thead>
                        <tr className="bg-[#F7F7F8]/50 border-b border-[#ECEDEF] sticky top-0 z-20">
                          <th className="py-4 px-8 text-[11px] font-bold text-[#8B93A7] uppercase tracking-[0.05em] border-b border-[#ECEDEF]">Order Detail</th>
                          <th className="py-4 px-6 text-[11px] font-bold text-[#8B93A7] uppercase tracking-[0.05em] border-b border-[#ECEDEF]">Fulfillment</th>
                          <th className="py-4 px-6 text-[11px] font-bold text-[#8B93A7] uppercase tracking-[0.05em] border-b border-[#ECEDEF]">Payment</th>
                          <th className="py-4 px-6 text-[11px] font-bold text-[#8B93A7] uppercase tracking-[0.05em] border-b border-[#ECEDEF]">Amount</th>
                          <th className="py-4 px-8 text-[11px] font-bold text-[#8B93A7] uppercase tracking-[0.05em] border-b border-[#ECEDEF] text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#ECEDEF]">
                        {[...MOCK_DEALER_ORDERS, ...MOCK_DEALER_ORDERS, ...MOCK_DEALER_ORDERS].map((o, i) => (
                          <tr key={o.id + i} className="group hover:bg-[#FBFBFC] transition-colors">
                            <td className="py-5 px-8">
                              <div className="flex flex-col">
                                <span className="text-[15px] font-bold text-[#111111] group-hover:text-[#D40073] transition-colors">{o.id}</span>
                                <span className="text-[13px] text-[#8B93A7] font-medium mt-0.5">{o.date} • {o.items} units</span>
                              </div>
                            </td>
                            <td className="py-5 px-6">
                               <div className="flex flex-col gap-1.5">
                                 <div className="flex items-center gap-1.5">
                                   <div className={`w-2 h-2 rounded-full ${o.status === 'Delivered' ? 'bg-[#16A34A]' : 'bg-[#D97706]'}`} />
                                   <span className="text-[13px] font-bold text-[#111111]">{o.status}</span>
                                 </div>
                                 <span className="text-[11px] font-medium text-[#8B93A7]">{o.fulfillment}</span>
                               </div>
                            </td>
                            <td className="py-5 px-6">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-[6px] text-[12px] font-bold ${
                                o.payment === 'Paid' ? 'bg-[#ECFDF3] text-[#16A34A]' : 'bg-[#EFF6FF] text-[#2563EB]'
                              }`}>
                                {o.payment}
                              </span>
                            </td>
                            <td className="py-5 px-6">
                               <span className="text-[16px] font-bold text-[#111111] tracking-tight">{formatMoney(o.total)}</span>
                            </td>
                            <td className="py-5 px-8 text-right">
                               <button 
                                 onClick={() => setSelectedOrder(o)}
                                 className="h-10 px-4 rounded-[10px] bg-white border border-[#E4E7EC] text-[13px] font-bold text-[#111111] hover:border-[#D40073] hover:text-[#D40073] hover:bg-[rgba(212,0,115,0.02)] transition-all flex items-center gap-2 ml-auto"
                               >
                                 <Icon icon="solar:eye-linear" className="text-[18px]" />
                                 View Details
                               </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Footer */}
                  <div className="px-8 py-5 border-t border-[#ECEDEF] bg-[#F7F7F8] flex items-center justify-between shrink-0">
                    <p className="text-[13px] text-[#525866] font-medium">Showing <span className="text-[#111111] font-bold">12</span> of 12 orders found</p>
                    <Dialog.Close asChild>
                      <button className="h-11 px-8 bg-[#111111] text-white font-bold rounded-[14px] text-[14px] hover:bg-black transition-all">Close History</button>
                    </Dialog.Close>
                  </div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>

      {/* ── Create Dealer Modal (Production Ready) ── */}
      <Dialog.Root open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <AnimatePresence>
          {isCreateModalOpen && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-[8px] z-[120]" />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 30 }}
                  className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[700px] z-[130] bg-white rounded-[32px] overflow-hidden shadow-[0_32px_80px_-15px_rgba(0,0,0,0.3)] border border-[#ECEDEF] font-sans flex flex-col max-h-[90vh]"
                >
                  {/* Modal Header */}
                  <div className="p-8 border-b border-[#ECEDEF] bg-[#F7F7F8] relative">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-[18px] bg-[#111111] flex items-center justify-center text-white shadow-xl shadow-black/10">
                          <Icon icon="solar:user-plus-bold-duotone" className="text-[28px]" />
                        </div>
                        <div>
                          <h2 className="text-[24px] font-bold text-[#111111] tracking-tight">Register New Dealer</h2>
                          <p className="text-[14px] text-[#525866] font-medium mt-0.5">Enter business and contact details to onboard a new partner.</p>
                        </div>
                      </div>
                      <Dialog.Close asChild>
                        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[rgba(0,0,0,0.05)] text-[#8B93A7] transition-all">
                          <Icon icon="solar:close-square-linear" className="text-[26px]" />
                        </button>
                      </Dialog.Close>
                    </div>
                  </div>

                  {/* Form Content */}
                  <div className="p-8 overflow-y-auto space-y-8">
                    {/* Section: Basic Information */}
                    <div>
                      <div className="flex items-center gap-2 mb-5">
                        <div className="w-1.5 h-4 bg-[#D40073] rounded-full" />
                        <h3 className="text-[15px] font-bold text-[#111111] uppercase tracking-[0.05em]">General Information</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-5">
                        <div className="flex flex-col gap-2">
                          <label className="text-[12px] font-bold text-[#525866] ml-1">Dealer Full Name</label>
                          <input type="text" placeholder="e.g. John Doe" className="h-12 px-4 bg-[#F7F7F8] border border-[#E4E7EC] rounded-[14px] text-[14px] font-medium focus:outline-none focus:ring-[3px] focus:ring-[rgba(212,0,115,0.08)] focus:border-[#D40073] transition-all" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[12px] font-bold text-[#525866] ml-1">Business Name</label>
                          <input type="text" placeholder="e.g. JD Enterprises" className="h-12 px-4 bg-[#F7F7F8] border border-[#E4E7EC] rounded-[14px] text-[14px] font-medium focus:outline-none focus:ring-[3px] focus:ring-[rgba(212,0,115,0.08)] focus:border-[#D40073] transition-all" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[12px] font-bold text-[#525866] ml-1">Business Type</label>
                          <select className="h-12 px-4 bg-[#F7F7F8] border border-[#E4E7EC] rounded-[14px] text-[14px] font-medium focus:outline-none focus:border-[#D40073] cursor-pointer appearance-none">
                            <option>Retailer</option>
                            <option>Wholesaler</option>
                            <option>Distributor</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[12px] font-bold text-[#525866] ml-1">Tax ID (Optional)</label>
                          <input type="text" placeholder="TIN-000-000-000" className="h-12 px-4 bg-[#F7F7F8] border border-[#E4E7EC] rounded-[14px] text-[14px] font-medium focus:outline-none focus:ring-[3px] focus:ring-[rgba(212,0,115,0.08)] focus:border-[#D40073] transition-all" />
                        </div>
                      </div>
                    </div>

                    {/* Section: Contact & Location */}
                    <div className="pt-2">
                      <div className="flex items-center gap-2 mb-5">
                        <div className="w-1.5 h-4 bg-[#D40073] rounded-full" />
                        <h3 className="text-[15px] font-bold text-[#111111] uppercase tracking-[0.05em]">Contact & Location</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-5">
                        <div className="flex flex-col gap-2">
                          <label className="text-[12px] font-bold text-[#525866] ml-1">Phone Number</label>
                          <input type="tel" placeholder="+233 00 000 0000" className="h-12 px-4 bg-[#F7F7F8] border border-[#E4E7EC] rounded-[14px] text-[14px] font-medium focus:outline-none focus:ring-[3px] focus:ring-[rgba(212,0,115,0.08)] focus:border-[#D40073] transition-all" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[12px] font-bold text-[#525866] ml-1">Email Address</label>
                          <input type="email" placeholder="dealer@example.com" className="h-12 px-4 bg-[#F7F7F8] border border-[#E4E7EC] rounded-[14px] text-[14px] font-medium focus:outline-none focus:ring-[3px] focus:ring-[rgba(212,0,115,0.08)] focus:border-[#D40073] transition-all" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[12px] font-bold text-[#525866] ml-1">Region</label>
                          <select className="h-12 px-4 bg-[#F7F7F8] border border-[#E4E7EC] rounded-[14px] text-[14px] font-medium focus:outline-none focus:border-[#D40073] cursor-pointer appearance-none">
                            <option>Greater Accra</option>
                            <option>Ashanti Region</option>
                            <option>Central Region</option>
                            <option>Western Region</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[12px] font-bold text-[#525866] ml-1">City</label>
                          <input type="text" placeholder="e.g. Accra" className="h-12 px-4 bg-[#F7F7F8] border border-[#E4E7EC] rounded-[14px] text-[14px] font-medium focus:outline-none focus:ring-[3px] focus:ring-[rgba(212,0,115,0.08)] focus:border-[#D40073] transition-all" />
                        </div>
                        <div className="col-span-2 flex flex-col gap-2">
                          <label className="text-[12px] font-bold text-[#525866] ml-1">GPS Digital Address</label>
                          <input type="text" placeholder="GA-123-4567" className="h-12 px-4 bg-[#F7F7F8] border border-[#E4E7EC] rounded-[14px] text-[14px] font-medium focus:outline-none focus:ring-[3px] focus:ring-[rgba(212,0,115,0.08)] focus:border-[#D40073] transition-all" />
                        </div>
                      </div>
                    </div>

                    {/* Section: Credit & Terms */}
                    <div className="pt-2">
                      <div className="flex items-center gap-2 mb-5">
                        <div className="w-1.5 h-4 bg-[#D40073] rounded-full" />
                        <h3 className="text-[15px] font-bold text-[#111111] uppercase tracking-[0.05em]">Credit & Payments</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-5 p-5 bg-[#D40073]/[0.03] border border-[#D40073]/10 rounded-[20px]">
                        <div className="flex flex-col gap-2">
                          <label className="text-[12px] font-bold text-[#D40073] ml-1">Initial Credit Limit</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px] font-bold text-[#D40073]">GHS</span>
                            <input type="number" placeholder="5,000" className="w-full h-12 pl-14 pr-4 bg-white border border-[#D40073]/20 rounded-[14px] text-[14px] font-bold text-[#111111] focus:outline-none focus:border-[#D40073] focus:ring-[3px] focus:ring-[rgba(212,0,115,0.1)] transition-all" />
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[12px] font-bold text-[#D40073] ml-1">Payment Terms</label>
                          <select className="h-12 px-4 bg-white border border-[#D40073]/20 rounded-[14px] text-[14px] font-bold text-[#111111] focus:outline-none focus:border-[#D40073] cursor-pointer appearance-none">
                            <option>Cash Basis</option>
                            <option>Net 15 Days</option>
                            <option>Net 30 Days</option>
                            <option>Consignment</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="p-8 border-t border-[#ECEDEF] bg-[#F7F7F8] flex items-center justify-end gap-3 shrink-0">
                    <Dialog.Close asChild>
                      <button className="h-12 px-6 bg-[#F3F4F6] text-[#111111] font-bold rounded-[14px] text-[14px] hover:bg-[#E4E7EC] transition-all">Cancel</button>
                    </Dialog.Close>
                    <button className="h-12 px-8 bg-[#111111] text-white font-bold rounded-[14px] text-[14px] flex items-center gap-2 hover:bg-black transition-all shadow-lg shadow-black/10">
                      <Icon icon="solar:diskette-bold-duotone" className="text-[20px]" />
                      Complete Registration
                    </button>
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
                  className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] z-[160] bg-white rounded-[28px] overflow-hidden shadow-2xl border border-[#ECEDEF] font-sans"
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
                    <button className="flex-1 h-11 bg-[#DC2626] text-white font-bold rounded-[12px] text-[13px] shadow-lg shadow-red-500/20">Process & Credit</button>
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
                  className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] z-[160] bg-white rounded-[28px] overflow-hidden shadow-2xl border border-[#ECEDEF] font-sans"
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
                    <button className="flex-1 h-11 bg-[#111111] text-white font-bold rounded-[12px] text-[13px] shadow-lg shadow-black/10">Confirm Dispatch</button>
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
