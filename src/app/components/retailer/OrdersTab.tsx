import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from '@iconify/react';
import * as Dialog from '@radix-ui/react-dialog';
import { useNavigate } from 'react-router';
import { MOCK_RETAILER_ORDERS } from '../../data/mockRetailerOrders';

const FILTERS = ['All Orders', 'New', 'Pending Payment', 'Ready for Dispatch', 'In Transit', 'Completed', 'Credit Orders'];

export function OrdersTab() {
  const [activeFilter, setActiveFilter] = useState('All Orders');
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-[16px] border border-[#ECEDEF] flex flex-col min-h-[600px]">
      {/* Header and Filters */}
      <div className="p-4 border-b border-[#ECEDEF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <div className="relative group w-full sm:w-[320px] shrink-0">
            <Icon icon="solar:magnifer-linear" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B93A7] group-focus-within:text-[#D40073] transition-colors text-[16px]" />
            <input 
              type="text" 
              placeholder="Search orders..." 
              className="w-full h-10 pl-10 pr-4 bg-[#F7F7F8] border border-transparent rounded-[8px] text-[13px] text-[#111111] placeholder:text-[#8B93A7] focus:outline-none focus:bg-white focus:border-[#D40073] transition-all"
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0 flex-1">
            {FILTERS.map(f => (
              <button 
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`whitespace-nowrap h-8 px-3 rounded-[6px] text-[13px] font-semibold transition-colors ${
                  activeFilter === f ? 'bg-[#111111] text-white' : 'bg-[#F7F7F8] text-[#525866] hover:bg-[#ECEDEF]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        
        <button 
          onClick={() => setIsNewOrderModalOpen(true)}
          className="h-10 px-4 shrink-0 flex items-center gap-2 bg-[#D40073] hover:bg-[#B80063] text-white rounded-[10px] text-[13px] font-semibold transition-colors"
        >
          <Icon icon="solar:add-circle-linear" className="text-[18px]" />
          Issue New Order
        </button>
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
            {MOCK_RETAILER_ORDERS.map((order) => (
              <tr
                key={order.id}
                onClick={() => navigate(`/dashboard/retailer/orders/${order.id}`)}
                className="border-b border-[#ECEDEF] last:border-0 hover:bg-[#FBFBFC] transition-colors cursor-pointer group"
              >
                <td className="py-4 px-5">
                  <span className="font-bold text-[#111111]">{order.id}</span>
                </td>
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
         <span>Showing {MOCK_RETAILER_ORDERS.length} of {MOCK_RETAILER_ORDERS.length} orders</span>
      </div>

      {/* Issue New Order Modal */}
      <Dialog.Root open={isNewOrderModalOpen} onOpenChange={setIsNewOrderModalOpen}>
        <AnimatePresence>
          {isNewOrderModalOpen && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-[24px] p-6 md:p-8 z-50 shadow-2xl focus:outline-none flex flex-col max-h-[90vh]"
                >
                  <div className="flex items-center justify-between mb-6 shrink-0">
                    <div>
                      <h2 className="text-[22px] font-bold text-[#111111] tracking-tight">Issue New Order</h2>
                      <p className="text-[14px] text-[#525866] mt-1">Create a new order for a customer from available inventory.</p>
                    </div>
                    <Dialog.Close asChild>
                      <button className="w-8 h-8 flex items-center justify-center text-[#8B93A7] hover:bg-[#F3F4F6] rounded-full transition-colors">
                        <Icon icon="solar:close-circle-linear" className="text-[24px]" />
                      </button>
                    </Dialog.Close>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                    {/* Customer Info */}
                    <div className="space-y-4">
                      <h3 className="text-[15px] font-bold text-[#111111] flex items-center gap-2">
                        <Icon icon="solar:user-rounded-linear" className="text-[#D40073]" />
                        Customer Information
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[13px] font-bold text-[#525866]">Customer Name</label>
                          <input type="text" placeholder="Enter customer name" className="w-full h-11 px-4 bg-[#F7F7F8] border border-[#ECEDEF] rounded-[10px] text-[14px] focus:outline-none focus:border-[#D40073] focus:bg-white transition-colors" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[13px] font-bold text-[#525866]">Phone Number</label>
                          <input type="tel" placeholder="e.g. 024 XXX XXXX" className="w-full h-11 px-4 bg-[#F7F7F8] border border-[#ECEDEF] rounded-[10px] text-[14px] focus:outline-none focus:border-[#D40073] focus:bg-white transition-colors" />
                        </div>
                      </div>
                    </div>

                    <div className="h-[1px] bg-[#ECEDEF]" />

                    {/* Order Details */}
                    <div className="space-y-4">
                      <h3 className="text-[15px] font-bold text-[#111111] flex items-center gap-2">
                        <Icon icon="solar:box-linear" className="text-[#D40073]" />
                        Order Items
                      </h3>
                      <div className="bg-[#F7F7F8] border border-[#ECEDEF] rounded-[12px] p-4">
                        <div className="flex items-center gap-3">
                          <select className="flex-1 h-11 px-4 bg-white border border-[#ECEDEF] rounded-[10px] text-[14px] focus:outline-none focus:border-[#D40073] transition-colors appearance-none">
                            <option value="">Select an item...</option>
                            <option value="1">Portland Cement 50kg - 85 GHS</option>
                            <option value="2">Iron Rods 16mm - 120 GHS</option>
                            <option value="3">Emulsion Paint 20L - 450 GHS</option>
                          </select>
                          <input type="number" placeholder="Qty" min="1" defaultValue="1" className="w-24 h-11 px-4 bg-white border border-[#ECEDEF] rounded-[10px] text-[14px] focus:outline-none focus:border-[#D40073] transition-colors" />
                          <button className="h-11 px-4 bg-[#111111] text-white rounded-[10px] text-[13px] font-bold hover:bg-[#333333] transition-colors">
                            Add
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="h-[1px] bg-[#ECEDEF]" />

                    {/* Fulfillment */}
                    <div className="space-y-4">
                      <h3 className="text-[15px] font-bold text-[#111111] flex items-center gap-2">
                        <Icon icon="solar:routing-2-linear" className="text-[#D40073]" />
                        Fulfillment & Payment
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[13px] font-bold text-[#525866]">Delivery Method</label>
                          <select className="w-full h-11 px-4 bg-[#F7F7F8] border border-[#ECEDEF] rounded-[10px] text-[14px] focus:outline-none focus:border-[#D40073] transition-colors appearance-none">
                            <option>Delivery / Dispatch</option>
                            <option>In-Store Pickup</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[13px] font-bold text-[#525866]">Payment Status</label>
                          <select className="w-full h-11 px-4 bg-[#F7F7F8] border border-[#ECEDEF] rounded-[10px] text-[14px] focus:outline-none focus:border-[#D40073] transition-colors appearance-none">
                            <option>Pending Payment</option>
                            <option>Paid (Cash)</option>
                            <option>Paid (Mobile Money)</option>
                            <option>Credit Issue</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-[#ECEDEF] flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
                    <div className="text-left w-full sm:w-auto">
                      <div className="text-[13px] text-[#525866] font-medium">Estimated Total</div>
                      <div className="text-[20px] font-bold text-[#111111]">0.00 GHS</div>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                      <button 
                        onClick={() => setIsNewOrderModalOpen(false)}
                        className="flex-1 sm:flex-none h-11 px-6 bg-[#F3F4F6] hover:bg-[#E4E7EC] text-[#111111] rounded-[12px] font-bold text-[14px] transition-colors"
                      >
                        Cancel
                      </button>
                      <button className="flex-1 sm:flex-none h-11 px-8 bg-[#D40073] hover:bg-[#B80063] text-white rounded-[12px] font-bold text-[14px] transition-colors flex items-center justify-center gap-2 shadow-[0_2px_10px_rgba(212,0,115,0.2)]">
                        <Icon icon="solar:check-circle-linear" className="text-[18px]" />
                        Confirm Order
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