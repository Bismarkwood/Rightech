import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router';
import { useRetailer } from './RetailerContext';
import { NewOrderModal } from './NewOrderModal';
import { RetailerOrder } from '../../../core/data/mockRetailerOrders';

const FILTERS = ['All Orders', 'New', 'Pending Payment', 'Ready for Dispatch', 'In Transit', 'Completed', 'Credit Orders'];

export function OrdersTab() {
  const { orders, isNewOrderModalOpen, setNewOrderModalOpen } = useRetailer();
  const [activeFilter, setActiveFilter] = useState('All Orders');
  const navigate = useNavigate();

  const filteredOrders = orders.filter((o: RetailerOrder) => {
    if (activeFilter === 'All Orders') return true;
    if (activeFilter === 'Ready for Dispatch') return o.delStatus === 'Ready';
    if (activeFilter === 'In Transit') return o.delStatus === 'In Transit';
    if (activeFilter === 'Completed') return o.delStatus === 'Delivered';
    return true;
  });

  return (
    <div className="bg-white dark:bg-[#151B2B] rounded-[22px] border border-[#ECEDEF] dark:border-white/10 flex flex-col min-h-[600px] overflow-hidden">
      {/* Header and Filters */}
      <div className="p-4 border-b border-[#ECEDEF] dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <motion.div 
            initial={false}
            animate={{ width: 320 }}
            className="relative group shrink-0"
          >
            <Icon 
              icon="solar:magnifer-linear" 
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B93A7] group-focus-within:text-[#D40073] group-focus-within:scale-110 transition-all text-[18px]" 
            />
            <input
              type="text"
              placeholder="Search orders, customers, or items..."
              className="w-full h-11 pl-11 pr-4 bg-[#F7F7F8] dark:bg-white/5 border-2 border-transparent rounded-[12px] text-[14px] text-[#111111] dark:text-white placeholder:text-[#8B93A7] focus:outline-none focus:bg-white dark:focus:bg-white/10 focus:border-[#D40073]/20 focus:ring-4 focus:ring-[#D40073]/5 transition-all"
            />
          </motion.div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0 flex-1">
            {FILTERS.map(f => (
              <motion.button
                key={f}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveFilter(f)}
                className={`whitespace-nowrap h-9 px-4 rounded-[10px] text-[13px] font-bold transition-all ${
                  activeFilter === f 
                    ? 'bg-[#111111] dark:bg-white text-white dark:text-[#111111]' 
                    : 'bg-white dark:bg-white/5 border border-[#E4E7EC] dark:border-white/10 text-[#525866] dark:text-[#8B93A7] hover:border-[#D40073] hover:text-[#D40073]'
                }`}
              >
                {f}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F9FAFB] dark:bg-white/5 border-b border-[#ECEDEF] dark:border-white/5 sticky top-0 z-10">
              <th className="py-4 px-6 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest">Order Identifier</th>
              <th className="py-4 px-6 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest">Retailer Customer</th>
              <th className="py-4 px-6 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest">Type / Assessment</th>
              <th className="py-4 px-6 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest">Financing</th>
              <th className="py-4 px-6 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest">Logistics</th>
              <th className="py-4 px-6 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest">Date / Time</th>
              <th className="py-4 px-6 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ECEDEF] dark:divide-white/5">
            {filteredOrders.map((order: RetailerOrder) => (
              <tr
                key={order.id}
                onClick={() => navigate(`/dashboard/retailer/orders/${order.id}`)}
                className="hover:bg-[#FBFBFC] dark:hover:bg-white/10 transition-all border-b border-[#ECEDEF] dark:border-white/5 cursor-pointer group"
              >
                <td className="py-4 px-6"><span className="font-black text-[14px] text-[#111111] dark:text-white uppercase tracking-tight group-hover:text-[#D40073] transition-colors">{order.id}</span></td>
                <td className="py-4 px-6 font-black text-[14px] text-[#111111] dark:text-white uppercase tracking-tight group-hover:text-[#D40073] transition-colors">{order.customer}</td>
                <td className="py-4 px-6">
                  <div className="font-black text-[16px] text-[#111111] dark:text-white tracking-tighter italic">{order.amount}</div>
                  <div className="text-[11px] text-[#8B93A7] dark:text-[#8B93A7] font-bold uppercase tracking-widest mt-0.5">{order.type}</div>
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-[6px] text-[11px] font-black uppercase tracking-wider border shadow-sm ${
                    order.payStatus === 'Paid' ? 'bg-[#ECFDF5] dark:bg-[#16A34A]/20 text-[#16A34A] border-[#16A34A]/10' :
                    order.payStatus === 'Credit' ? 'bg-[#EFF6FF] dark:bg-[#1E3A8A]/20 text-[#2563EB] border-[#2563EB]/10' :
                    'bg-[#FFF7ED] dark:bg-[#78350F]/20 text-[#D97706] border-[#D97706]/10'
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
                    <Icon icon={order.delStatus === 'Delivered' ? "solar:check-circle-bold" : order.delStatus === 'In Transit' ? "solar:routing-2-bold" : order.delStatus === 'Ready' ? "solar:box-bold" : "solar:clock-circle-bold"} className="text-[18px]" />
                    {order.delStatus}
                  </div>
                </td>
                <td className="py-4 px-6 font-bold text-[12px] text-[#8B93A7] uppercase tracking-widest whitespace-nowrap">{order.date}</td>
                <td className="py-4 px-6 text-right">
                  <button
                    onClick={(e) => e.stopPropagation()}
                    type="button"
                    aria-label="Order actions"
                    className="w-8 h-8 inline-flex items-center justify-center text-[#8B93A7] hover:text-[#111111] dark:hover:text-white hover:bg-[#F3F4F6] dark:hover:bg-white/10 rounded-[8px] border border-transparent hover:border-[#ECEDEF] dark:hover:border-white/10 transition-colors"
                  >
                    <Icon icon="solar:menu-dots-bold" className="text-[18px]" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-[#ECEDEF] dark:border-white/5 flex items-center justify-between text-[13px] font-medium text-[#525866] dark:text-[#8B93A7] bg-[#F9FAFB] dark:bg-white/5">
        <span>Showing {filteredOrders.length} of {orders.length} orders</span>
      </div>

      {isNewOrderModalOpen && <NewOrderModal />}
    </div>
  );
}