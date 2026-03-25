import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Filter, Plus, MoreHorizontal, Download, ArrowUpRight,
  UserPlus, Mail, Phone, MapPin, CreditCard, X, Briefcase, Activity
} from 'lucide-react';

const MOCK_DEALERS = [
  { id: 'DLR-101', name: 'Metro Electronics', region: 'Accra Central', orders: 156, creditScore: 850, outstanding: '$12,400', status: 'Active', lastOrder: '2 hours ago' },
  { id: 'DLR-102', name: 'Westside Tech', region: 'Kumasi', orders: 84, creditScore: 720, outstanding: '$4,500', status: 'Active', lastOrder: 'Yesterday' },
  { id: 'DLR-103', name: 'Elite Gadgets Hub', region: 'Tema Port', orders: 230, creditScore: 910, outstanding: '$0', status: 'Active', lastOrder: 'Today, 09:15 AM' },
  { id: 'DLR-104', name: 'Rapid Mobile Solutions', region: 'Takoradi', orders: 42, creditScore: 540, outstanding: '$18,200', status: 'Warning', lastOrder: '3 days ago' },
  { id: 'DLR-105', name: 'Northern Appliances', region: 'Tamale', orders: 12, creditScore: 610, outstanding: '$1,200', status: 'Inactive', lastOrder: '2 weeks ago' },
  { id: 'DLR-106', name: 'City Center Hub', region: 'Accra Central', orders: 315, creditScore: 890, outstanding: '$5,600', status: 'Active', lastOrder: 'Today, 11:30 AM' }
];

export default function DealerManagement() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDealer, setSelectedDealer] = useState<any>(null);

  return (
    <div className="flex flex-col h-full w-full bg-[#F7F7F8] relative min-h-0">
      {/* Header */}
      <div className="px-6 md:px-8 pt-8 pb-6 bg-[#F7F7F8] shrink-0 sticky top-0 z-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-[28px] font-bold text-[#111111] tracking-tight mb-2">Dealer Management</h1>
            <p className="text-[14px] text-[#525866] max-w-xl leading-relaxed">
              Browse & order products · Pay (cash / e-cash / credit)<br />
              View consignment history · View credit score
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="h-[40px] px-4 flex items-center gap-2 bg-white border border-[#E4E7EC] rounded-[12px] text-[14px] font-semibold text-[#111111] hover:bg-[#F3F4F6] transition-colors">
              <Download size={16} />
              Export Data
            </button>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="h-[40px] px-4 flex items-center gap-2 bg-[#D40073] hover:bg-[#B80063] text-white rounded-[12px] text-[14px] font-semibold transition-colors"
            >
              <Plus size={16} />
              Create Dealer
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
          <div className="bg-white p-5 rounded-[16px] border border-[#ECEDEF]">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#111111]">
                <Briefcase size={20} />
              </div>
            </div>
            <p className="text-[13px] font-medium text-[#525866] mb-1">Total Dealers</p>
            <p className="text-[24px] font-bold text-[#111111]">1,248</p>
          </div>
          <div className="bg-white p-5 rounded-[16px] border border-[#ECEDEF]">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#111111]">
                <Activity size={20} />
              </div>
              <span className="px-2 py-1 rounded-[6px] bg-[#ECFDF5] text-[#059669] text-[12px] font-bold">+5.2%</span>
            </div>
            <p className="text-[13px] font-medium text-[#525866] mb-1">Active Orders</p>
            <p className="text-[24px] font-bold text-[#111111]">342</p>
          </div>
          <div className="bg-white p-5 rounded-[16px] border border-[#ECEDEF]">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#111111]">
                <CreditCard size={20} />
              </div>
            </div>
            <p className="text-[13px] font-medium text-[#525866] mb-1">Avg Credit Score</p>
            <p className="text-[24px] font-bold text-[#111111]">745</p>
          </div>
          <div className="bg-white p-5 rounded-[16px] border border-[#ECEDEF]">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-full bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center">
                <CreditCard size={20} />
              </div>
            </div>
            <p className="text-[13px] font-medium text-[#525866] mb-1">Total Outstanding</p>
            <p className="text-[24px] font-bold text-[#111111]">$41,900</p>
          </div>
        </div>
      </div>

      {/* Main Content Area - Table */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 pt-0 min-h-0">
        <div className="max-w-[1400px] mx-auto">
          <div className="bg-white rounded-[16px] border border-[#ECEDEF] overflow-hidden">
            <div className="p-4 border-b border-[#ECEDEF] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative max-w-md w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B93A7]" size={18} />
                <input 
                  type="text" 
                  placeholder="Search dealers by name or ID..."
                  className="w-full pl-10 pr-4 h-[40px] bg-[#F7F7F8] border border-[#ECEDEF] rounded-[12px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#D40073]/20 focus:border-[#D40073] transition-all"
                />
              </div>
              <button className="h-[40px] px-4 flex items-center justify-center gap-2 bg-white border border-[#E4E7EC] rounded-[12px] text-[14px] font-semibold text-[#111111] hover:bg-[#F3F4F6] transition-colors">
                <Filter size={16} />
                Filters
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#ECEDEF]">
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
                      className="hover:bg-[#F7F7F8] transition-colors group cursor-pointer"
                      onClick={() => setSelectedDealer(dealer)}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#111111] font-bold shrink-0">
                            {dealer.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-[14px] font-bold text-[#111111]">{dealer.name}</p>
                            <p className="text-[13px] text-[#525866]">{dealer.id} • {dealer.region}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex px-2.5 py-1 rounded-[6px] text-[12px] font-bold ${
                          dealer.status === 'Active' ? 'bg-[#ECFDF5] text-[#059669]' : 
                          dealer.status === 'Warning' ? 'bg-[#FFFBEB] text-[#D97706]' : 
                          'bg-[#F3F4F6] text-[#525866]'
                        }`}>
                          {dealer.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className={`h-1.5 w-16 rounded-full overflow-hidden bg-[#ECEDEF]`}>
                            <div 
                              className={`h-full rounded-full ${dealer.creditScore >= 800 ? 'bg-[#059669]' : dealer.creditScore >= 600 ? 'bg-[#D97706]' : 'bg-[#DC2626]'}`} 
                              style={{ width: `${(dealer.creditScore / 1000) * 100}%` }}
                            />
                          </div>
                          <span className="text-[14px] font-bold text-[#111111]">{dealer.creditScore}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-[14px] font-bold text-[#111111]">{dealer.orders}</p>
                        <p className="text-[13px] text-[#525866]">Last: {dealer.lastOrder}</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-[14px] font-bold text-[#111111]">{dealer.outstanding}</p>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#525866] hover:bg-white hover:shadow-sm hover:text-[#111111] transition-all border border-transparent hover:border-[#ECEDEF]">
                            <ArrowUpRight size={16} />
                          </button>
                          <button className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#525866] hover:bg-white hover:shadow-sm hover:text-[#111111] transition-all border border-transparent hover:border-[#ECEDEF]">
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
        </div>
      </div>

      {/* Dealer Details Drawer */}
      <AnimatePresence>
        {selectedDealer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDealer(null)}
              className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-[480px] bg-white/85 backdrop-blur-2xl border-l border-[#ECEDEF] shadow-none z-50 flex flex-col"
            >
              {/* Drawer Header */}
              <div className="h-[72px] px-6 border-b border-[#ECEDEF] flex items-center justify-between shrink-0">
                <div>
                  <h2 className="text-[18px] font-bold text-[#111111]">Dealer Details</h2>
                  <p className="text-[13px] text-[#525866]">{selectedDealer.id}</p>
                </div>
                <button 
                  onClick={() => setSelectedDealer(null)}
                  className="w-10 h-10 rounded-full hover:bg-black/5 flex items-center justify-center transition-colors text-[#525866]"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                
                {/* Profile Block */}
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-[#F3F4F6] border border-[#ECEDEF] flex items-center justify-center text-[#111111] text-[24px] font-bold shrink-0">
                      {selectedDealer.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-[18px] font-bold text-[#111111]">{selectedDealer.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex px-2 py-0.5 rounded-[4px] text-[11px] font-bold ${
                          selectedDealer.status === 'Active' ? 'bg-[#ECFDF5] text-[#059669]' : 
                          selectedDealer.status === 'Warning' ? 'bg-[#FFFBEB] text-[#D97706]' : 
                          'bg-[#F3F4F6] text-[#525866]'
                        }`}>
                          {selectedDealer.status}
                        </span>
                        <span className="text-[13px] text-[#525866]">· {selectedDealer.region}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-[12px] bg-white border border-[#ECEDEF]">
                      <p className="text-[13px] text-[#525866] mb-1">Credit Score</p>
                      <div className="flex items-center gap-2">
                        <p className="text-[18px] font-bold text-[#111111]">{selectedDealer.creditScore}</p>
                        <div className={`h-1.5 w-12 rounded-full overflow-hidden bg-[#ECEDEF]`}>
                          <div 
                            className={`h-full rounded-full ${selectedDealer.creditScore >= 800 ? 'bg-[#059669]' : selectedDealer.creditScore >= 600 ? 'bg-[#D97706]' : 'bg-[#DC2626]'}`} 
                            style={{ width: `${(selectedDealer.creditScore / 1000) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="p-4 rounded-[12px] bg-white border border-[#ECEDEF]">
                      <p className="text-[13px] text-[#525866] mb-1">Outstanding</p>
                      <p className={`text-[18px] font-bold ${selectedDealer.outstanding === '$0' ? 'text-[#059669]' : 'text-[#DC2626]'}`}>
                        {selectedDealer.outstanding}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions Grid */}
                <div>
                  <h3 className="text-[13px] font-bold text-[#8B93A7] uppercase tracking-wider mb-3">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex flex-col items-center justify-center p-4 rounded-[12px] border border-[#ECEDEF] bg-white hover:border-[#D40073] hover:bg-[#FDF2F8] transition-all group">
                      <div className="w-10 h-10 rounded-full bg-[#F7F7F8] group-hover:bg-white flex items-center justify-center mb-2">
                        <Activity size={18} className="text-[#111111] group-hover:text-[#D40073]" />
                      </div>
                      <span className="text-[13px] font-semibold text-[#111111] group-hover:text-[#D40073]">Browse & Order</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-4 rounded-[12px] border border-[#ECEDEF] bg-white hover:border-[#D40073] hover:bg-[#FDF2F8] transition-all group">
                      <div className="w-10 h-10 rounded-full bg-[#F7F7F8] group-hover:bg-white flex items-center justify-center mb-2">
                        <CreditCard size={18} className="text-[#111111] group-hover:text-[#D40073]" />
                      </div>
                      <span className="text-[13px] font-semibold text-[#111111] group-hover:text-[#D40073]">Make Payment</span>
                    </button>
                  </div>
                </div>

                {/* Consignment History */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[13px] font-bold text-[#8B93A7] uppercase tracking-wider">Consignment History</h3>
                    <button className="text-[12px] font-bold text-[#D40073] hover:text-[#B80063]">View All</button>
                  </div>
                  <div className="space-y-3">
                    <div className="p-4 rounded-[12px] bg-white border border-[#ECEDEF]">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-[14px] font-bold text-[#111111]">CON-9021</p>
                          <p className="text-[12px] text-[#525866]">Delivered • 2 days ago</p>
                        </div>
                        <span className="text-[14px] font-bold text-[#111111]">$4,200</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="px-2 py-1 bg-[#F3F4F6] text-[#525866] text-[11px] font-bold rounded-[4px]">120 Items</span>
                        <span className="px-2 py-1 bg-[#ECFDF5] text-[#059669] text-[11px] font-bold rounded-[4px]">Paid in full</span>
                      </div>
                    </div>
                    <div className="p-4 rounded-[12px] bg-white border border-[#ECEDEF]">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-[14px] font-bold text-[#111111]">CON-8944</p>
                          <p className="text-[12px] text-[#525866]">In Transit • ETA Tomorrow</p>
                        </div>
                        <span className="text-[14px] font-bold text-[#111111]">$8,500</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="px-2 py-1 bg-[#F3F4F6] text-[#525866] text-[11px] font-bold rounded-[4px]">45 Items</span>
                        <span className="px-2 py-1 bg-[#FFFBEB] text-[#D97706] text-[11px] font-bold rounded-[4px]">Pending Payment</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-[#ECEDEF] bg-white/50 shrink-0">
                <button className="w-full h-[44px] flex items-center justify-center gap-2 bg-[#111111] text-white font-semibold text-[14px] rounded-[12px] hover:bg-[#333333] transition-colors">
                  <CreditCard size={16} />
                  Process New Order
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Create Dealer Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full max-w-[600px] bg-white rounded-[24px] border border-[#ECEDEF] shadow-none relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="h-[72px] px-6 border-b border-[#ECEDEF] flex items-center justify-between shrink-0 bg-[#F7F7F8]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white border border-[#ECEDEF] flex items-center justify-center text-[#111111]">
                    <UserPlus size={18} />
                  </div>
                  <div>
                    <h2 className="text-[18px] font-bold text-[#111111]">Create New Dealer</h2>
                    <p className="text-[13px] text-[#525866]">Add a new dealer to your network.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-white flex items-center justify-center transition-colors text-[#525866] border border-transparent hover:border-[#ECEDEF]"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6">
                <div className="space-y-4">
                  <h3 className="text-[14px] font-bold text-[#111111]">Company Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-medium text-[#111111]">Dealer Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Metro Electronics"
                        className="w-full h-[40px] px-3 bg-white border border-[#ECEDEF] rounded-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#D40073]/20 focus:border-[#D40073] transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-medium text-[#111111]">Region / Location</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Accra Central"
                        className="w-full h-[40px] px-3 bg-white border border-[#ECEDEF] rounded-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#D40073]/20 focus:border-[#D40073] transition-all"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-[#111111]">Tax ID / Business Registration</label>
                    <input 
                      type="text" 
                      placeholder="Enter business registration number"
                      className="w-full h-[40px] px-3 bg-white border border-[#ECEDEF] rounded-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#D40073]/20 focus:border-[#D40073] transition-all"
                    />
                  </div>
                </div>

                <div className="h-[1px] w-full bg-[#ECEDEF]" />

                <div className="space-y-4">
                  <h3 className="text-[14px] font-bold text-[#111111]">Contact Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-medium text-[#111111]">Contact Person</label>
                      <input 
                        type="text" 
                        placeholder="Full name"
                        className="w-full h-[40px] px-3 bg-white border border-[#ECEDEF] rounded-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#D40073]/20 focus:border-[#D40073] transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-medium text-[#111111]">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B93A7]" size={16} />
                        <input 
                          type="email" 
                          placeholder="Email"
                          className="w-full pl-9 pr-3 h-[40px] bg-white border border-[#ECEDEF] rounded-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#D40073]/20 focus:border-[#D40073] transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[13px] font-medium text-[#111111]">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B93A7]" size={16} />
                        <input 
                          type="tel" 
                          placeholder="+233"
                          className="w-full pl-9 pr-3 h-[40px] bg-white border border-[#ECEDEF] rounded-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#D40073]/20 focus:border-[#D40073] transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-[1px] w-full bg-[#ECEDEF]" />

                <div className="space-y-4">
                  <h3 className="text-[14px] font-bold text-[#111111]">Financial Settings</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-medium text-[#111111]">Initial Credit Limit</label>
                      <input 
                        type="number" 
                        placeholder="$0.00"
                        className="w-full h-[40px] px-3 bg-white border border-[#ECEDEF] rounded-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#D40073]/20 focus:border-[#D40073] transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-medium text-[#111111]">Payment Terms</label>
                      <select className="w-full h-[40px] px-3 bg-white border border-[#ECEDEF] rounded-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#D40073]/20 focus:border-[#D40073] transition-all appearance-none">
                        <option>Net 15</option>
                        <option>Net 30</option>
                        <option>Net 60</option>
                        <option>Cash on Delivery</option>
                      </select>
                    </div>
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-[#ECEDEF] bg-[#F7F7F8] shrink-0 flex items-center justify-end gap-3">
                <button 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="h-[40px] px-6 flex items-center justify-center bg-white border border-[#E4E7EC] text-[#111111] font-semibold text-[14px] rounded-[10px] hover:bg-[#F3F4F6] transition-colors"
                >
                  Cancel
                </button>
                <button className="h-[40px] px-6 flex items-center justify-center bg-[#111111] text-white font-semibold text-[14px] rounded-[10px] hover:bg-[#333333] transition-colors">
                  Create Dealer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
