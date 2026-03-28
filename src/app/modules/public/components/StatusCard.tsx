import React from 'react';
import { motion } from 'motion/react';
import { Icon } from '@iconify/react';
import { RetailerOrder } from '../../../core/data/mockRetailerOrders';
import { GhanaAddress } from '../../../core/types/address';

interface StatusCardProps {
  order: RetailerOrder;
}

export function StatusCard({ order }: StatusCardProps) {
  const address = order.deliveryAddress as GhanaAddress;
  const riderName = order.agent?.name?.split(' ')[0] || 'Your rider';

  return (
    <div className="relative px-0 pb-6 mt-0">
      <div className="bg-white rounded-[24px] p-6 border border-[#ECEDEF]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
            <span className="text-[15px] font-black text-[#16A34A] uppercase tracking-widest">On the way</span>
          </div>
          <div className="text-[13px] font-black text-[#111111] px-3 py-1 rounded-full bg-[#F3F4F6]">
            ~{order.estimatedArrivalMin || 12} min
          </div>
        </div>

        <h3 className="text-[18px] font-black text-[#111111] mb-1 tracking-tight">
          {riderName} is heading to you
        </h3>
        <p className="text-[13px] font-medium text-[#8B93A7] mb-6 flex items-center gap-1.5 leading-none">
          <Icon icon="solar:map-point-bold-duotone" className="text-[#D40073] text-[16px]" />
          {address?.area || 'Accra'}, {address?.region || 'Greater Accra'}
        </p>

        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-[#F3F4F6] rounded-full overflow-hidden relative">
          <motion.div 
            initial={{ width: '40%' }}
            animate={{ width: '75%' }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="absolute left-0 top-0 h-full bg-[#111111] rounded-full"
          />
        </div>
        
        <div className="flex justify-between mt-3">
          <span className="text-[11px] font-black text-[#111111] uppercase tracking-wider">Picking up</span>
          <span className="text-[11px] font-black text-[#8B93A7] uppercase tracking-wider opacity-40">Delivered</span>
        </div>
      </div>
    </div>
  );
}
