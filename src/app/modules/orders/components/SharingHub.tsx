import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from '@iconify/react';
import { toast } from 'sonner';

interface SharingHubProps {
  order: any;
}

export function SharingHub({ order }: SharingHubProps) {
  const [isCopied, setIsCopied] = useState(false);
  
  // Use id as token for now, or generating a random suffix if not present
  const trackingToken = order.trackingToken || `${order.id}-K8X2`;
  const trackingUrl = `${window.location.protocol}//${window.location.host}/track/${trackingToken}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(trackingUrl);
    setIsCopied(true);
    toast.success('Tracking link copied to clipboard');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    const isDelivery = order.deliveryMethod === 'delivery' || order.deliveryMethod === 'Dispatch';
    const riderName = order.rider?.name || order.deliveryAgentId || 'Rider';
    
    const message = isDelivery 
      ? `Hi ${order.customer?.name || 'Customer'},\nyour order from RightTech is on the way 🛵\n\nTrack your delivery live here:\n${trackingUrl}\n\nYour rider ${riderName} will call when close.`
      : `Hi ${order.customer?.name || 'Customer'},\nyour order ${order.id} from RightTech is ready for collection 📦\n\nView details and location here:\n${trackingUrl}`;
      
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${order.customer?.contact?.replace(/\s+/g, '') || ''}?text=${encoded}`, '_blank');
  };

  return (
    <div className="mt-6 pt-5 border-t border-[#F1F3F5]">
      <div className="text-[11px] font-black text-[#8B93A7] uppercase tracking-[0.15em] mb-3 flex items-center justify-between">
        Share Tracking Link
        <span className="text-[#16A34A] flex items-center gap-1 normal-case tracking-normal">
          <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
          Live Tracking Active
        </span>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 h-11 bg-[#F8F9FA] border border-[#ECEDEF] rounded-[10px] px-3 flex items-center overflow-hidden">
          <span className="text-[13px] font-mono text-[#525866] truncate">{trackingUrl}</span>
        </div>
        <button 
          onClick={handleCopy}
          className={`h-11 px-4 rounded-[10px] font-black text-[12px] transition-all flex items-center gap-2 ${isCopied ? 'bg-[#16A34A] text-white' : 'bg-[#111111] text-white hover:bg-black'}`}
        >
          <Icon icon={isCopied ? "solar:check-circle-bold" : "solar:copy-bold"} className="text-[16px]" />
          {isCopied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button 
          onClick={shareWhatsApp}
          className="h-11 bg-white border border-[#ECEDEF] rounded-[12px] flex items-center justify-center gap-2 text-[12px] font-bold text-[#111111] hover:bg-[#F3F4F6] transition-all"
        >
          <Icon icon="logos:whatsapp-icon" className="text-[16px]" />
          WhatsApp
        </button>
        <button className="h-11 bg-white border border-[#ECEDEF] rounded-[12px] flex items-center justify-center gap-2 text-[12px] font-bold text-[#111111] hover:bg-[#F3F4F6] transition-all">
          <Icon icon="solar:letter-bold-duotone" className="text-[16px] text-[#2563EB]" />
          SMS
        </button>
        <button className="h-11 bg-white border border-[#ECEDEF] rounded-[12px] flex items-center justify-center gap-2 text-[12px] font-bold text-[#111111] hover:bg-[#F3F4F6] transition-all">
          <Icon icon="solar:menu-dots-bold" className="text-[16px] text-[#8B93A7]" />
          More
        </button>
      </div>
      
      <div className="mt-4 flex items-center gap-2 text-[11px] font-medium text-[#8B93A7]">
        <Icon icon="solar:info-circle-linear" className="text-[14px]" />
        Link expires 24h after delivery completion.
      </div>
    </div>
  );
}
