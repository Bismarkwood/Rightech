import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MoreVertical, MapPin, Receipt, CreditCard, Clock, Truck, UserRound, Smartphone, Banknote } from 'lucide-react';
import { Icon } from '@iconify/react';
import { Dialog, DialogContent } from '../../../core/components/ui/dialog';
import { SharingHub } from './SharingHub';

export interface OrderDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  order: any | null; // Typed loosely right now, relies on the mock structure passed from CreateOrderModal
}

export function OrderDetailDrawer({ isOpen, onClose, order }: OrderDetailDrawerProps) {
  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent 
        className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] h-full sm:h-auto bg-[#FAFBFC] border-l border-[#ECEDEF] shadow-2xl p-0 m-0 sm:max-w-none rounded-none overflow-y-auto custom-scrollbar transition-transform duration-300 data-[state=closed]:translate-x-full data-[state=open]:translate-x-0"
        style={{ borderRadius: 0 }}
      >
        {/* Header Strip */}
        <div className="bg-white px-6 py-5 border-b border-[#ECEDEF] sticky top-0 z-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-[20px] font-black text-[#111111] leading-none tracking-tight">{order.id}</h2>
              <span className="px-2.5 py-1 rounded-[6px] text-[10px] font-black tracking-widest uppercase bg-[#E0E7FF] text-[#4F46E5] border border-[#C7D2FE]">
                Processing
              </span>
            </div>
            <div className="text-[13px] font-medium text-[#8B93A7] flex items-center gap-1">
              <Clock size={14} /> Created {order.createdAt?.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) || '10:24 AM'}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-full flex items-center justify-center text-[#525866] hover:bg-[#F1F3F5] transition-colors">
              <MoreVertical size={18} />
            </button>
            <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-[#525866] hover:bg-[#FEF2F2] hover:text-[#EF4444] transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Customer Block */}
          <div className="bg-white rounded-[16px] border border-[#ECEDEF] p-5 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-[11px] font-black text-[#8B93A7] uppercase tracking-[0.1em] flex items-center gap-1.5">
                <UserRound size={14} /> Customer
              </h3>
            </div>
            
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 rounded-full bg-[#FAFBFC] border border-[#ECEDEF] flex items-center justify-center text-[#111111] font-black text-[16px]">
                {order.customer?.name?.charAt(0) || 'C'}
              </div>
              <div className="flex-1">
                <div className="text-[16px] font-bold text-[#111111] flex items-center gap-2">
                  {order.customer?.name}
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase ${order.customer?.type === 'Dealer' ? 'bg-[#D40073]/10 text-[#D40073]' : 'bg-[#16A34A]/10 text-[#16A34A]'}`}>
                    {order.customer?.type}
                  </span>
                </div>
                <div className="text-[13px] font-medium text-[#525866] mt-0.5">{order.customer?.contact}</div>
              </div>
              
              {order.customer?.creditScore && (
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-[#8B93A7] uppercase tracking-widest mb-0.5">Score</span>
                  <span className="px-2 py-1 bg-[#111111] text-white rounded-[6px] text-[12px] font-black leading-none">{order.customer?.creditScore}</span>
                </div>
              )}
            </div>
          </div>

          {/* Items Block */}
          <div className="bg-white rounded-[16px] border border-[#ECEDEF] shadow-sm overflow-hidden">
            <div className="p-5 border-b border-[#F1F3F5] flex items-center justify-between">
              <h3 className="text-[11px] font-black text-[#8B93A7] uppercase tracking-[0.1em] flex items-center gap-1.5">
                <Receipt size={14} /> Order Items
              </h3>
              <span className="text-[12px] font-bold text-[#525866] bg-[#F1F3F5] px-2 py-0.5 rounded-md">{order.items?.length || 0} items</span>
            </div>
            
            <div className="divide-y divide-[#F1F3F5]">
              {order.items?.map((item: any, idx: number) => (
                <div key={idx} className="p-4 flex items-center gap-3 hover:bg-[#FAFBFC] transition-colors">
                  <div className="w-10 h-10 rounded-[8px] bg-[#ECEDEF] overflow-hidden shrink-0">
                    {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-bold text-[#111111] truncate">{item.name}</div>
                    <div className="text-[12px] font-medium text-[#8B93A7]">Qty [{item.qty}] <span className="mx-1">•</span> GHS {item.unitPrice?.toFixed(2)}</div>
                  </div>
                  <div className="text-[14px] font-black text-[#111111] shrink-0">
                    GHS {(item.qty * item.unitPrice)?.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#FAFBFC] p-4 flex items-center justify-between border-t border-[#F1F3F5]">
              <span className="text-[13px] font-bold text-[#525866]">Subtotal</span>
              <span className="text-[18px] font-black text-[#111111]">GHS {order.total?.toFixed(2)}</span>
            </div>
          </div>

          {/* Delivery Block */}
          <div className="bg-white rounded-[16px] border border-[#ECEDEF] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[11px] font-black text-[#8B93A7] uppercase tracking-[0.1em] flex items-center gap-1.5">
                <Truck size={14} /> Logistics
              </h3>
              <span className="text-[12px] font-bold text-[#111111] bg-[#F1F3F5] px-2 py-0.5 rounded-md capitalize">{order.deliveryMethod === 'collection' ? 'Self Collection' : 'Delivery'}</span>
            </div>

            {order.deliveryMethod === 'delivery' ? (
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FAFBFC] border border-[#ECEDEF] flex items-center justify-center shrink-0">
                    <MapPin size={14} className="text-[#525866]" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider mb-0.5">Dest. Address</div>
                    <div className="text-[14px] font-medium text-[#111111]">{order.deliveryAddress || order.customer?.address}</div>
                  </div>
                </div>

                {order.rider && (
                  <div className="flex items-center gap-3 p-3 bg-[#FAFBFC] border border-[#ECEDEF] rounded-[12px]">
                    <div className="w-10 h-10 rounded-full bg-[#D40073] text-white flex items-center justify-center font-black text-[12px]">
                      {order.rider.avatar}
                    </div>
                    <div>
                      <div className="text-[14px] font-bold text-[#111111] leading-tight">{order.rider.name}</div>
                      <div className="text-[12px] font-medium text-[#16A34A]">Agent Assigned</div>
                    </div>
                  </div>
                )}

                {/* Mini Timeline */}
                <div className="pl-4 border-l-[2px] border-[#ECEDEF] space-y-6 relative ml-4 mt-2">
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#111111] ring-4 ring-white" />
                    <div className="flex justify-between items-center w-full">
                      <span className="text-[13px] font-bold text-[#111111] ml-4">Order placed</span>
                      <span className="text-[12px] font-medium text-[#8B93A7]">{order.createdAt?.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) || '10:24 AM'}</span>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#4F46E5] ring-4 ring-white" />
                    <div className="flex justify-between items-center w-full">
                      <span className="text-[13px] font-bold text-[#111111] ml-4">Agent assigned</span>
                      <span className="text-[12px] font-medium text-[#8B93A7]">10:25 AM</span>
                    </div>
                  </div>
                  <div className="relative opacity-40">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-[#8B93A7] bg-white ring-4 ring-white" />
                    <div className="flex justify-between items-center w-full">
                      <span className="text-[13px] font-bold text-[#525866] ml-4">Picked up</span>
                      <span className="text-[12px] font-medium text-[#8B93A7]">—</span>
                    </div>
                  </div>
                  <div className="relative opacity-40">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-[#8B93A7] bg-white ring-4 ring-white" />
                    <div className="flex justify-between items-center w-full">
                      <span className="text-[13px] font-bold text-[#525866] ml-4">Delivered</span>
                      <span className="text-[12px] font-medium text-[#8B93A7]">---</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-[#FAFBFC] border border-[#ECEDEF] rounded-[12px]">
                <Icon icon="solar:shop-2-bold" className="text-[#8B93A7] text-[24px]" />
                <div>
                  <div className="text-[14px] font-bold text-[#111111]">In-Store Pickup</div>
                  <div className="text-[12px] font-medium text-[#525866]">Customer will collect from HQ</div>
                </div>
              </div>
            )}

            <SharingHub order={order} />
          </div>

          {/* Payment Block */}
          <div className="bg-white rounded-[16px] border border-[#ECEDEF] p-5 shadow-sm">
            <h3 className="text-[11px] font-black text-[#8B93A7] uppercase tracking-[0.1em] flex items-center gap-1.5 mb-4">
              <CreditCard size={14} /> Settlement
            </h3>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {order.paymentMethod === 'cash' ? <Banknote size={16} className="text-[#525866]" /> :
                 order.paymentMethod === 'credit' ? <CreditCard size={16} className="text-[#525866]" /> :
                 <Smartphone size={16} className="text-[#525866]" />}
                <span className="text-[14px] font-bold text-[#111111] capitalize">
                  {order.paymentMethod === 'momo' ? 'Mobile Money' : order.paymentMethod === 'credit' ? 'Store Credit' : 'Cash on Delivery'}
                </span>
              </div>
              <span className="px-2 py-1 rounded-[6px] text-[10px] font-black tracking-widest uppercase bg-[#FEF2F2] text-[#EF4444] border border-[#FECACA]">
                Unpaid
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-[13px]">
                <span className="font-medium text-[#525866]">Amount Paid</span>
                <span className="font-bold text-[#111111]">GHS 0.00</span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="font-medium text-[#525866]">Outstanding</span>
                <span className="font-black text-[#EF4444]">GHS {order.total?.toFixed(2)}</span>
              </div>
              {order.paymentMethod === 'credit' && order.customer?.type === 'Dealer' && (
                <div className="flex items-center justify-between text-[12px] pt-2 mt-2 border-t border-[#F1F3F5]">
                  <span className="font-medium text-[#8B93A7]">Remaining Credit Limit</span>
                  <span className="font-bold text-[#111111]">GHS {(order.customer.limit - order.customer.balance - order.total).toFixed(2)}</span>
                </div>
              )}
            </div>
            
            {order.notes && (
              <div className="mt-4 p-3 bg-[#FFFAF0] border border-[#FDE68A] rounded-[10px] text-[12px] font-medium text-[#D97706]">
                <span className="font-bold block mb-1">Order Notes:</span>
                "{order.notes}"
              </div>
            )}
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
