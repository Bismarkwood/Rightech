import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Icon } from '@iconify/react';
import { toast } from 'sonner';

interface SharingHubProps {
  order: any;
}

export function SharingHub({ order }: SharingHubProps) {
  const [isCopied, setIsCopied] = useState(false);
  
  const trackingToken = order.trackingToken || `${order.id}-K8X2`;
  const trackingUrl = `${window.location.protocol}//${window.location.host}/track/${trackingToken}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(trackingUrl);
    setIsCopied(true);
    toast.success('Tracking link copied');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    const isDelivery = order.deliveryMethod === 'delivery' || order.deliveryMethod === 'Dispatch';
    const riderName = order.rider?.name || order.deliveryAgentId || 'Rider';
    
    const message = isDelivery 
      ? `Hi ${order.customer?.name || order.customer || 'Customer'},\nyour order from RightTech is on the way 🛵\n\nTrack your delivery live here:\n${trackingUrl}\n\nYour rider ${riderName} will call when close.`
      : `Hi ${order.customer?.name || order.customer || 'Customer'},\nyour order ${order.id} from RightTech is ready for collection 📦\n\nView details and location here:\n${trackingUrl}`;
      
    const encoded = encodeURIComponent(message);
    const phone = (order.customer?.contact || order.phone || '').replace(/\s+/g, '');
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Preview Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#111111] to-[#2D2D2D] rounded-[24px] p-6 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D40073] opacity-20 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2" />
        
        <div className="flex items-start justify-between relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/90">Live Tracking Active</span>
            </div>
            <h3 className="text-[18px] font-black tracking-tight">{order.id}</h3>
            <p className="text-[13px] text-white/60 font-medium">To: {order.customer?.name || order.customer || 'Customer'}</p>
          </div>
          <div className="w-12 h-12 rounded-[16px] bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
             <Icon icon={order.deliveryMethod === 'Pickup' ? "solar:box-bold-duotone" : "solar:routing-2-bold-duotone"} className="text-[24px] text-[#D40073]" />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between relative z-10 border-t border-white/5 pt-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Status</span>
            <span className="text-[13px] font-bold text-white/90">{order.delStatus || order.status || 'Processing'}</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">ETA</span>
            <span className="text-[13px] font-bold text-[#D40073]">12 - 15 mins</span>
          </div>
        </div>
      </div>

      {/* 2. Link Section */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-widest ml-1">Universal Tracking Link</label>
        <div className="flex items-center gap-2 p-1 bg-[#F8F9FA] border border-[#ECEDEF] rounded-[16px] group focus-within:border-[#D40073] transition-all">
          <div className="flex-1 px-3 py-2 overflow-hidden">
            <p className="text-[13px] font-mono text-[#525866] truncate">{trackingUrl}</p>
          </div>
          <button 
            onClick={handleCopy}
            className={`h-10 px-4 rounded-[12px] font-bold text-[13px] transition-all flex items-center gap-2 ${
              isCopied ? 'bg-[#16A34A] text-white' : 'bg-[#111111] text-white hover:bg-black'
            } active:scale-95`}
          >
            <Icon icon={isCopied ? "solar:check-circle-bold" : "solar:copy-bold"} className="text-[16px]" />
            {isCopied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* 3. Share Grid */}
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={shareWhatsApp}
          className="group relative flex flex-col items-center justify-center gap-3 p-5 bg-white border border-[#ECEDEF] rounded-[24px] hover:border-[#25D366] hover:bg-[#25D366]/5 transition-all active:scale-[0.98]"
        >
          <div className="w-12 h-12 rounded-full bg-[#25D366]/10 flex items-center justify-center group-hover:bg-[#25D366]/20 transition-colors">
            <Icon icon="logos:whatsapp-icon" className="text-[24px]" />
          </div>
          <div className="text-center">
            <p className="text-[14px] font-bold text-[#111111]">WhatsApp</p>
            <p className="text-[11px] font-medium text-[#8B93A7]">Direct message</p>
          </div>
        </button>

        <button 
          className="group relative flex flex-col items-center justify-center gap-3 p-5 bg-white border border-[#ECEDEF] rounded-[24px] hover:border-[#2563EB] hover:bg-[#2563EB]/5 transition-all active:scale-[0.98]"
        >
          <div className="w-12 h-12 rounded-full bg-[#2563EB]/10 flex items-center justify-center group-hover:bg-[#2563EB]/20 transition-colors">
            <Icon icon="solar:letter-bold-duotone" className="text-[24px] text-[#2563EB]" />
          </div>
          <div className="text-center">
            <p className="text-[14px] font-bold text-[#111111]">SMS / iMessage</p>
            <p className="text-[11px] font-medium text-[#8B93A7]">Mobile notification</p>
          </div>
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 text-[11px] font-medium text-[#8B93A7] bg-[#F8F9FA] py-2.5 rounded-full mt-2">
        <Icon icon="solar:lock-bold-duotone" className="text-[14px] text-[#D40073]" />
        Secure, unguessable tracking link active for 24h
      </div>
    </div>
  );
}
