import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from '@iconify/react';
import { RetailerOrder } from '../../../core/data/mockRetailerOrders';

interface OrderBriefProps {
  order: RetailerOrder;
}

export function OrderBrief({ order }: OrderBriefProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-[#F8F9FA] border-t border-[#ECEDEF] px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <button 
          onClick={() => window.location.href = `tel:${order.agent?.phone || '0240000000'}`}
          className="flex-1 h-14 bg-[#111111] text-white rounded-[22px] font-black text-[15px] flex items-center justify-center gap-3 active:scale-95 transition-all"
        >
          <Icon icon="solar:phone-calling-bold" className="text-[20px]" />
          Call Rider
        </button>
        <button 
          onClick={() => window.open(`https://wa.me/233241234567?text=Hi, I have a question about my order ${order.id}`, '_blank')}
          className="w-14 h-14 bg-white border border-[#ECEDEF] rounded-[22px] flex items-center justify-center text-[#16A34A] active:scale-95 transition-all"
        >
          <Icon icon="logos:whatsapp-icon" className="text-[24px]" />
        </button>
      </div>

      <div className="flex items-center justify-between text-[11px] font-black text-[#8B93A7] uppercase tracking-[0.15em] mb-6">
        <span>Order Summary • {order.items?.length || 0} Items</span>
      </div>

      <div className="space-y-4">
        {order.items?.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[12px] bg-white border border-[#ECEDEF] flex items-center justify-center overflow-hidden">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <Icon icon="solar:box-linear" className="text-[#8B93A7] text-[20px]" />
                )}
              </div>
              <div>
                <div className="text-[13px] font-bold text-[#111111]">{item.name}</div>
                <div className="text-[11px] font-medium text-[#8B93A7]">Quantity: {item.qty}</div>
              </div>
            </div>
            <div className="text-[13px] font-black text-[#111111] tracking-tight">{item.lineTotal}</div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 pt-6 border-t border-[#ECEDEF] flex items-center justify-between">
         <div className="text-[11px] font-black text-[#8B93A7] uppercase tracking-widest leading-none mb-1">Total to Pay</div>
         <div className="text-[18px] font-black text-[#111111] leading-none">{order.amount}</div>
      </div>
    </div>
  );
}
