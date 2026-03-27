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
    <div className="bg-white rounded-[16px] border border-[#ECEDEF] flex flex-col min-h-[600px]">
      {/* Header and Filters */}
      <div className="p-4 border-b border-[#ECEDEF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
              className="w-full h-11 pl-11 pr-4 bg-[#F7F7F8] border-2 border-transparent rounded-[12px] text-[14px] text-[#111111] placeholder:text-[#8B93A7] focus:outline-none focus:bg-white focus:border-[#D40073]/20 focus:ring-4 focus:ring-[#D40073]/5 transition-all"
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
                    ? 'bg-[#111111] text-white' 
                    : 'bg-white border border-[#E4E7EC] text-[#525866] hover:border-[#D40073] hover:text-[#D40073]'
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
            <tr className="bg-[#F7F7F8] border-b border-[#ECEDEF]">
              <th className="py-3 px-5 text-[12px] font-bold text-[#525866] uppercase tracking-wider">Order ID</th>
              <th className="py-3 px-5 text-[12px] font-bold text-[#525866] uppercase tracking-wider">Customer</th>
              <th className="py-3 px-5 text-[12px] font-bold text-[#525866] uppercase tracking-wider">Type / Amount</th>
              <th className="py-3 px-5 text-[12px] font-bold text-[#525866] uppercase tracking-wider">Payment Status</th>
              <th className="py-3 px-5 text-[12px] font-bold text-[#525866] uppercase tracking-wider">Delivery Status</th>
              <th className="py-3 px-5 text-[12px] font-bold text-[#525866] uppercase tracking-wider">Date</th>
              <th className="py-3 px-5 text-[12px] font-bold text-[#525866] uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-[13px]">
            {filteredOrders.map((order: RetailerOrder) => (
              <tr
                key={order.id}
                onClick={() => navigate(`/dashboard/retailer/orders/${order.id}`)}
                className="border-b border-[#ECEDEF] last:border-0 hover:bg-[#FBFBFC] transition-colors cursor-pointer group"
              >
                <td className="py-4 px-5"><span className="font-bold text-[#111111]">{order.id}</span></td>
                <td className="py-4 px-5 font-semibold text-[#111111]">{order.customer}</td>
                <td className="py-4 px-5">
                  <div className="font-bold text-[#111111]">{order.amount}</div>
                  <div className="text-[12px] text-[#8B93A7] font-medium">{order.type}</div>
                </td>
                <td className="py-4 px-5">
                  <span className={`inline-flex items-center px-2 py-1 rounded-[6px] text-[12px] font-bold ${
                    order.payStatus === 'Paid' ? 'bg-[#ECFDF3] text-[#16A34A]' :
                    order.payStatus === 'Credit' ? 'bg-[#EFF6FF] text-[#2563EB]' :
                    'bg-[#FFF7ED] text-[#D97706]'
                  }`}>
                    {order.payStatus}
                  </span>
                </td>
                <td className="py-4 px-5">
                  <div className="flex items-center gap-1.5 font-semibold text-[#525866]">
                    {order.delStatus === 'Delivered' && <Icon icon="solar:check-circle-bold" className="text-[#16A34A] text-[16px]" />}
                    {order.delStatus === 'In Transit' && <Icon icon="solar:routing-2-bold" className="text-[#2563EB] text-[16px]" />}
                    {order.delStatus === 'Ready' && <Icon icon="solar:box-bold" className="text-[#D40073] text-[16px]" />}
                    {order.delStatus === 'Pending' && <Icon icon="solar:clock-circle-bold" className="text-[#8B93A7] text-[16px]" />}
                    {order.delStatus}
                  </div>
                </td>
                <td className="py-4 px-5 font-medium text-[#525866]">{order.date}</td>
                <td className="py-4 px-5 text-right">
                  <button
                    onClick={(e) => e.stopPropagation()}
                    type="button"
                    aria-label="Order actions"
                    className="w-8 h-8 inline-flex items-center justify-center text-[#8B93A7] hover:text-[#111111] hover:bg-[#F3F4F6] rounded-[8px] transition-colors"
                  >
                    <Icon icon="solar:menu-dots-bold" className="text-[18px]" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-[#ECEDEF] flex items-center justify-between text-[13px] font-medium text-[#525866] bg-[#F7F7F8]">
        <span>Showing {filteredOrders.length} of {orders.length} orders</span>
      </div>

      {isNewOrderModalOpen && <NewOrderModal />}
    </div>
  );
}