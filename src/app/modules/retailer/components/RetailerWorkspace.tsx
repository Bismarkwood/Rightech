import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from '@iconify/react';
import { Plus, X, Search, Package, Truck, CreditCard, CheckCircle, Clock, ArrowUpRight } from 'lucide-react';
import { useRetailer } from './RetailerContext';
import { useOrderWorkflow } from '../../orders/components/OrderWorkflowContext';

type OrderStatus = 'All' | 'New' | 'Pending Payment' | 'Ready for Dispatch' | 'In Transit' | 'Completed' | 'Credit Orders';

const STATUS_FILTERS: OrderStatus[] = ['All', 'New', 'Pending Payment', 'Ready for Dispatch', 'In Transit', 'Completed'];

const PAY_BADGE = {
  Paid: { bg: '#ECFDF3', color: '#16A34A' },
  Credit: { bg: '#EFF6FF', color: '#2563EB' },
  Pending: { bg: '#FFF7ED', color: '#D97706' },
};

const DEL_ICON: Record<string, { icon: string; color: string }> = {
  Delivered: { icon: 'solar:check-circle-bold', color: '#16A34A' },
  'In Transit': { icon: 'solar:routing-2-bold', color: '#2563EB' },
  Ready: { icon: 'solar:box-bold', color: '#D40073' },
  Pending: { icon: 'solar:clock-circle-bold', color: '#8B93A7' },
};

export function RetailerWorkspace() {
  const { orders } = useRetailer();
  const { openCreateOrder, openSharingModal } = useOrderWorkflow();

  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<OrderStatus>('All');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchSearch =
        !search ||
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.customer.toLowerCase().includes(search.toLowerCase());
      const matchFilter =
        activeFilter === 'All' ||
        (activeFilter === 'Ready for Dispatch' && o.delStatus === 'Ready') ||
        (activeFilter === 'In Transit' && o.delStatus === 'In Transit') ||
        (activeFilter === 'Completed' && o.delStatus === 'Delivered') ||
        (activeFilter === 'Pending Payment' && o.payStatus === 'Pending') ||
        (activeFilter === 'Credit Orders' && o.payStatus === 'Credit') ||
        (activeFilter === 'New' && o.delStatus === 'Pending');
      return matchSearch && matchFilter;
    });
  }, [orders, search, activeFilter]);

  const selectedOrder = orders.find(o => o.id === selectedOrderId) || null;

  // KPI calculations
  const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.amount.replace(/[^0-9.]/g, '')), 0);
  const pending = orders.filter(o => o.delStatus === 'Pending').length;
  const inTransit = orders.filter(o => o.delStatus === 'In Transit').length;
  const completed = orders.filter(o => o.delStatus === 'Delivered').length;

  return (
    <div className="flex h-full bg-[#F7F7F8] overflow-hidden">
      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* ── Page Header ── */}
        <div className="bg-white border-b border-[#ECEDEF] px-8 pt-6 shrink-0">
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-9 h-9 rounded-[11px] bg-[#111111] text-white flex items-center justify-center">
                  <Icon icon="solar:shop-2-bold-duotone" className="text-[18px]" />
                </div>
                <h1 className="text-[24px] font-black text-[#111111] tracking-tight">Order Management</h1>
              </div>
              <p className="text-[13px] font-medium text-[#8B93A7] mt-0.5 ml-0.5">{orders.length} total retailer orders</p>
            </div>
            <button
              onClick={() => openCreateOrder()}
              className="h-10 px-5 bg-[#D40073] hover:bg-[#B80064] text-white text-[13px] font-bold rounded-[10px] flex items-center gap-2 transition-colors mb-1"
            >
              <Plus size={15} strokeWidth={2.5} />
              New Order
            </button>
          </div>
        </div>

        {/* ── KPI Row ── */}
        <div className="grid grid-cols-4 gap-5 px-8 py-6 shrink-0">
          {[
            { label: 'Total Revenue', value: `GHS ${totalRevenue.toLocaleString()}`, icon: 'solar:dollar-minimalistic-bold-duotone', color: '#D40073', bg: '#FDEDF5', border: '#FADDEE' },
            { label: 'Pending Dispatch', value: String(pending), icon: 'solar:clock-square-bold-duotone', color: '#D97706', bg: '#FFFBEB', border: '#FEF3C7' },
            { label: 'Active In Transit', value: String(inTransit), icon: 'solar:routing-2-bold-duotone', color: '#2563EB', bg: '#EFF6FF', border: '#DBEAFE' },
            { label: 'Completed Deliveries', value: String(completed), icon: 'solar:check-square-bold-duotone', color: '#16A34A', bg: '#ECFDF5', border: '#D1FAE5' },
          ].map(kpi => (
            <div key={kpi.label} className="group relative bg-white dark:bg-[#151B2B] border border-[#ECEDEF] dark:border-white/10 rounded-[22px] p-6 flex items-center gap-5 transition-all hover:translate-y-[-2px] hover:shadow-md overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-black/5 dark:from-white/5 to-transparent rounded-bl-[40px] transition-transform group-hover:scale-110" />
              <div className="w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0 border transition-all group-hover:scale-110" style={{ background: kpi.bg, borderColor: kpi.border }}>
                <Icon icon={kpi.icon} className="text-[24px]" style={{ color: kpi.color }} />
              </div>
              <div className="relative z-10">
                <p className="text-[11px] font-black text-[#8B93A7] uppercase tracking-widest group-hover:text-[#111111] dark:group-hover:text-white transition-colors">{kpi.label}</p>
                <p className="text-[24px] font-black text-[#111111] dark:text-white tracking-tighter mt-0.5">{kpi.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Filters + Search ── */}
        <div className="px-8 pb-4 shrink-0 flex items-center gap-4 flex-wrap">
          {/* Search */}
          <div className="relative group">
            <Icon icon="solar:magnifer-linear" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B93A7] group-focus-within:text-[#D40073] transition-colors text-[18px]" size={16} />
            <input
              type="text"
              placeholder="Search by order ID, customer name or phone..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="h-10 pl-11 pr-4 bg-white dark:bg-white/5 border border-[#E4E7EC] dark:border-white/10 rounded-[12px] text-[13px] font-black text-[#111111] dark:text-white placeholder:text-[#8B93A7] focus:outline-none focus:border-[#D40073] transition-all w-[320px] shadow-sm"
            />
          </div>

          {/* Status Filters */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {STATUS_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`whitespace-nowrap h-10 px-5 rounded-[12px] text-[13px] font-black uppercase tracking-wider transition-all shadow-sm ${
                  activeFilter === f
                    ? 'bg-[#111111] dark:bg-white text-white dark:text-[#111111]'
                    : 'bg-white dark:bg-white/5 border border-[#E4E7EC] dark:border-white/10 text-[#525866] dark:text-[#8B93A7] hover:border-[#D40073] hover:text-[#D40073]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* ── Orders Table ── */}
        <div className="flex-1 px-8 pb-8 overflow-hidden">
          <div className="h-full bg-white border border-[#ECEDEF] rounded-[24px] overflow-hidden flex flex-col">
            <div className="overflow-y-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F9FAFB] dark:bg-white/5 border-b border-[#ECEDEF] dark:border-white/5 sticky top-0 z-10">
                    <th className="py-4 px-6 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest">Order ID</th>
                    <th className="py-4 px-6 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest">Retailer Customer</th>
                    <th className="py-4 px-6 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest">Face Value</th>
                    <th className="py-4 px-6 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest">Financing</th>
                    <th className="py-4 px-6 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest">Logistics</th>
                    <th className="py-4 px-6 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest">Timestamp</th>
                    <th className="py-4 px-6"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F3F5]">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7}>
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                          <Icon icon="solar:cart-cross-linear" className="text-[48px] text-[#ECEDEF] mb-3" />
                          <p className="text-[15px] font-bold text-[#8B93A7]">No orders found</p>
                          <p className="text-[13px] font-medium text-[#B0B7C3] mt-1">Try adjusting your filters or create a new order</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredOrders.map(order => {
                    const isSelected = order.id === selectedOrderId;
                    const payStyle = (PAY_BADGE as any)[order.payStatus] || PAY_BADGE.Pending;
                    const delIcon = DEL_ICON[order.delStatus] || DEL_ICON.Pending;
                    return (
                      <tr
                        key={order.id}
                        onClick={() => setSelectedOrderId(isSelected ? null : order.id)}
                        className={`cursor-pointer transition-all group ${isSelected ? 'bg-[#FBFBFC] dark:bg-white/10' : 'hover:bg-[#FBFBFC] dark:hover:bg-white/5'} border-b border-[#ECEDEF] dark:border-white/5`}
                      >
                        <td className="py-4 px-6">
                          <span className={`font-black text-[14px] uppercase tracking-tight ${isSelected ? 'text-[#D40073]' : 'text-[#111111] dark:text-white group-hover:text-[#D40073]'} transition-colors`}>{order.id}</span>
                        </td>
                        <td className="py-4 px-6 font-black text-[14px] text-[#111111] dark:text-white group-hover:text-[#D40073] transition-colors uppercase tracking-tight">{order.customer}</td>
                        <td className="py-4 px-6 font-black text-[16px] text-[#111111] dark:text-white tracking-tighter italic">{order.amount}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-[6px] text-[11px] font-black uppercase tracking-wider border shadow-sm ${
                            order.payStatus === 'Paid' ? 'bg-[#ECFDF5] dark:bg-[#064E3B]/30 text-[#16A34A] border-[#16A34A]/10' :
                            order.payStatus === 'Credit' ? 'bg-[#EFF6FF] dark:bg-[#1E3A8A]/30 text-[#2563EB] border-[#2563EB]/10' :
                            'bg-[#FFF7ED] dark:bg-[#78350F]/30 text-[#D97706] border-[#D97706]/10'
                          }`}>
                            {order.payStatus}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className={`flex items-center gap-2 font-black text-[11px] uppercase tracking-widest ${
                            order.delStatus === 'Delivered' ? 'text-[#16A34A]' :
                            order.delStatus === 'In Transit' ? 'text-[#2563EB]' :
                            order.delStatus === 'Ready' ? 'text-[#D40073]' : 'text-[#8B93A7]'
                          }`}>
                            <Icon icon={delIcon.icon} className="text-[18px]" />
                            {order.delStatus}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-widest">{order.date}</td>
                        <td className="py-4 px-6 text-right">
                          <div className={`w-9 h-9 inline-flex items-center justify-center rounded-[10px] transition-all border shadow-sm ${isSelected ? 'bg-[#D40073] border-[#D40073] text-white' : 'bg-white dark:bg-white/5 border-[#ECEDEF] dark:border-white/10 text-[#8B93A7] group-hover:text-[#D40073] group-hover:bg-white dark:group-hover:bg-white/10'}`}>
                            <Icon icon="solar:arrow-right-up-bold" className="text-[20px]" />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-[#ECEDEF] bg-[#F7F7F8] text-[13px] font-medium text-[#525866] shrink-0">
              Showing <span className="font-bold text-[#111111]">{filteredOrders.length}</span> of {orders.length} orders
            </div>
          </div>
        </div>
      </div>

      {/* ── Order Detail Side Drawer ── */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrderId(null)}
              className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40"
            />
            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="fixed right-0 top-0 bottom-0 w-[480px] bg-white z-50 flex flex-col"
            >
              {/* Drawer Header */}
              <div className="p-7 border-b border-[#ECEDEF] flex items-center justify-between shrink-0 bg-[#F7F7F8]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[14px] bg-[#111111] text-white flex items-center justify-center">
                    <Icon icon="solar:clipboard-list-bold-duotone" className="text-[22px]" />
                  </div>
                  <div>
                    <h2 className="text-[18px] font-black text-[#111111]">{selectedOrder.id}</h2>
                    <p className="text-[13px] font-medium text-[#8B93A7]">{selectedOrder.date}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedOrderId(null)}
                  className="w-10 h-10 rounded-full hover:bg-[rgba(0,0,0,0.05)] flex items-center justify-center text-[#8B93A7] transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-7 space-y-6">
                {/* Customer */}
                <div className="bg-[#F7F7F8] rounded-[20px] p-5 space-y-1">
                  <p className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider">Customer</p>
                  <p className="text-[16px] font-black text-[#111111]">{selectedOrder.customer}</p>
                  <p className="text-[13px] font-medium text-[#525866]">{(selectedOrder as any).contact || 'No contact info'}</p>
                </div>

                {/* Status Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white border border-[#ECEDEF] rounded-[18px] p-4">
                    <p className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider mb-2">Payment</p>
                    {(() => {
                      const s = (PAY_BADGE as any)[selectedOrder.payStatus] || PAY_BADGE.Pending;
                      return (
                        <span className="inline-flex items-center px-3 py-1.5 rounded-[8px] text-[13px] font-bold" style={{ background: s.bg, color: s.color }}>
                          {selectedOrder.payStatus}
                        </span>
                      );
                    })()}
                  </div>
                  <div className="bg-white border border-[#ECEDEF] rounded-[18px] p-4">
                    <p className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider mb-2">Delivery</p>
                    {(() => {
                      const d = DEL_ICON[selectedOrder.delStatus] || DEL_ICON.Pending;
                      return (
                        <div className="flex items-center gap-1.5">
                          <Icon icon={d.icon} className="text-[18px]" style={{ color: d.color }} />
                          <span className="text-[13px] font-bold text-[#111111]">{selectedOrder.delStatus}</span>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Order Info */}
                <div className="bg-white border border-[#ECEDEF] rounded-[20px] p-6 space-y-4">
                  <h3 className="text-[13px] font-black text-[#111111] uppercase tracking-wider">Order Details</h3>
                  <div className="flex justify-between items-center py-3 border-b border-[#F1F3F5]">
                    <span className="text-[14px] font-medium text-[#525866]">Order Type</span>
                    <span className="text-[14px] font-bold text-[#111111]">{selectedOrder.type}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-[#F1F3F5]">
                    <span className="text-[14px] font-medium text-[#525866]">Amount</span>
                    <span className="text-[18px] font-black text-[#D40073]">{selectedOrder.amount}</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-[14px] font-medium text-[#525866]">Date</span>
                    <span className="text-[14px] font-bold text-[#111111]">{selectedOrder.date}</span>
                  </div>
                </div>

                {/* Items Preview (if available) */}
                {Array.isArray((selectedOrder as any).items) && (selectedOrder as any).items.length > 0 && (
                  <div className="bg-white border border-[#ECEDEF] rounded-[20px] p-6 space-y-4">
                    <h3 className="text-[13px] font-black text-[#111111] uppercase tracking-wider">Items</h3>
                    {(selectedOrder as any).items.map((item: any, i: number) => (
                      <div key={i} className="flex items-center gap-3 py-2 border-b border-[#F1F3F5] last:border-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-10 h-10 rounded-[10px] object-cover border border-[#ECEDEF]" />
                        ) : (
                          <div className="w-10 h-10 rounded-[10px] bg-[#F3F4F6] flex items-center justify-center">
                            <Package size={16} className="text-[#8B93A7]" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-[14px] font-bold text-[#111111]">{item.name}</p>
                          <p className="text-[12px] font-medium text-[#8B93A7]">Qty: {item.qty}</p>
                        </div>
                        <p className="text-[14px] font-bold text-[#111111]">GHS {(item.price * item.qty).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              <div className="p-7 border-t border-[#ECEDEF] bg-[#F7F7F8] flex gap-3 shrink-0">
                <button 
                  onClick={() => openSharingModal(selectedOrder)}
                  className="flex-1 h-12 bg-white border border-[#ECEDEF] text-[#111111] font-bold rounded-[14px] text-[14px] hover:bg-[#F3F4F6] transition-all"
                >
                  Update Status
                </button>
                <button className="flex-1 h-12 bg-[#D40073] text-white font-bold rounded-[14px] text-[14px] hover:bg-[#B80063] transition-all">
                  Print Invoice
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}