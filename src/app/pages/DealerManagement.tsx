import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from '@iconify/react';
import * as Dialog from '@radix-ui/react-dialog';
import { 
  MOCK_DEALERS, MOCK_DEALER_ORDERS, MOCK_DEALER_PAYMENTS, MOCK_DEALER_CONSIGNMENTS, Dealer
} from '../data/mockDealerData';

const TABS = ['Overview', 'Orders', 'Payments', 'Consignment', 'Credit'];
const CATALOG = [
  { label: 'Samsung Galaxy A54', price: 2500 },
  { label: 'LG 55" UHD TV', price: 9000 },
  { label: 'JBL Flip 6', price: 1280 },
  { label: 'Sony WH-1000XM5', price: 3400 },
  { label: 'Apple Watch Series 9', price: 4200 },
];

export default function DealerManagement() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [itemRows, setItemRows] = useState([0]);

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
            <div className="p-4 border-b border-[#ECEDEF] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#F7F7F8]">
              <div className="relative max-w-md w-full group">
                <Icon icon="solar:magnifer-linear" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B93A7] group-focus-within:text-[#D40073] transition-colors text-[18px]" />
                <input 
                  type="text" 
                  placeholder="Search dealers by name or ID..."
                  className="w-full pl-10 pr-4 h-10 bg-white border border-[#E4E7EC] rounded-[10px] text-[13px] font-medium focus:outline-none focus:ring-[3px] focus:ring-[rgba(212,0,115,0.1)] focus:border-[#D40073] transition-all"
                />
              </div>
              <button className="h-10 px-4 flex items-center justify-center gap-2 bg-white border border-[#E4E7EC] rounded-[10px] text-[13px] font-bold text-[#111111] hover:bg-[#F3F4F6] transition-colors">
                <Icon icon="solar:filter-linear" className="text-[18px]" />
                Filters
              </button>
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
                  {MOCK_DEALERS.map((dealer) => (
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
            {/* Pagination footer */}
            <div className="p-4 border-t border-[#ECEDEF] flex items-center justify-between text-[13px] font-medium text-[#525866] bg-[#F7F7F8]">
              <span>Showing {MOCK_DEALERS.length} of {MOCK_DEALERS.length} dealers</span>
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
                  </motion.div>
                )}

                {/* ── TAB: ORDERS ── */}
                {activeTab === 'Orders' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                     <div className="flex items-center justify-between">
                       <h3 className="text-[15px] font-bold text-[#111111]">Recent Orders</h3>
                       <button className="text-[13px] font-bold text-[#D40073] hover:underline">View All</button>
                     </div>
                     <div className="space-y-3">
                       {MOCK_DEALER_ORDERS.map(o => (
                         <div key={o.id} className="p-4 bg-white border border-[#ECEDEF] rounded-[14px] flex items-center justify-between hover:border-[#D40073] transition-colors cursor-pointer group">
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

                {/* ── TAB: CONSIGNMENT ── */}
                {activeTab === 'Consignment' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="flex items-center justify-between">
                       <h3 className="text-[15px] font-bold text-[#111111]">Consignment Tracking</h3>
                     </div>
                     <div className="space-y-4">
                       {MOCK_DEALER_CONSIGNMENTS.map(c => {
                         const pct = Math.round((c.sold / c.supplied) * 100);
                         return (
                           <div key={c.id} className="p-4 bg-white border border-[#ECEDEF] rounded-[14px]">
                             <div className="flex items-start justify-between mb-3">
                               <div>
                                 <p className="text-[14px] font-bold text-[#111111]">{c.product}</p>
                                 <p className="text-[12px] font-medium text-[#8B93A7]">Supplied on {c.date} · Ref: {c.id}</p>
                               </div>
                               <span className="text-[14px] font-bold text-[#111111]">{formatMoney(c.value)}</span>
                             </div>
                             
                             <div className="bg-[#F7F7F8] p-3 rounded-[10px]">
                               <div className="flex items-center justify-between text-[12px] font-bold mb-2">
                                 <span className="text-[#16A34A]">{c.sold} Sold</span>
                                 <span className="text-[#8B93A7]">{c.supplied} Supplied</span>
                               </div>
                               <div className="h-2 w-full bg-[#E4E7EC] rounded-full overflow-hidden">
                                 <div className="h-full bg-[#16A34A] rounded-full" style={{ width: `${pct}%` }} />
                               </div>
                             </div>
                           </div>
                         );
                       })}
                     </div>
                  </motion.div>
                )}

                {/* ── TAB: CREDIT ── */}
                {activeTab === 'Credit' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                     <div className="p-6 bg-white border border-[#E4E7EC] rounded-[16px] text-center">
                        <div className="inline-flex w-20 h-20 rounded-full bg-[#F3F4F6] items-center justify-center mb-3">
                          <Icon icon="solar:wallet-bold" className="text-[36px]" style={{ color: getRiskColor(selectedDealer.creditScore) }} />
                        </div>
                        <h2 className="text-[32px] font-bold text-[#111111] tracking-tight">{selectedDealer.creditScore} <span className="text-[16px] text-[#8B93A7] font-medium">/ 1000</span></h2>
                        <p className="text-[14px] font-bold mt-1 uppercase tracking-wider" style={{ color: getRiskColor(selectedDealer.creditScore) }}>
                          {selectedDealer.creditScore >= 800 ? 'Low Risk' : selectedDealer.creditScore >= 600 ? 'Medium Risk' : 'High Risk'}
                        </p>
                     </div>

                     <div className="space-y-2">
                       <h3 className="text-[14px] font-bold text-[#111111] mb-1">Credit Usage</h3>
                       <div className="flex items-center justify-between text-[13px] font-bold text-[#525866] mb-1">
                         <span>Used: {formatMoney(selectedDealer.outstanding)}</span>
                         <span>Limit: {formatMoney(selectedDealer.creditLimit)}</span>
                       </div>
                       <div className="h-3 w-full bg-[#F3F4F6] rounded-full overflow-hidden">
                         <div 
                           className="h-full rounded-full transition-all" 
                           style={{ 
                             width: `${Math.min(100, (selectedDealer.outstanding / selectedDealer.creditLimit) * 100)}%`,
                             background: '#D40073'
                           }} 
                         />
                       </div>
                       <p className="text-[12px] font-medium text-[#8B93A7] mt-2 text-right">
                         {formatMoney(selectedDealer.creditLimit - selectedDealer.outstanding)} available
                       </p>
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

    </div>
  );
}
