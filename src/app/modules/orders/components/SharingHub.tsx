import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Icon } from '@iconify/react';
import { toast } from 'sonner';

interface SharingHubProps {
  order: any;
}

export function SharingHub({ order }: SharingHubProps) {
  const [isCopied, setIsCopied] = useState(false);
  
  const trackingToken = order.trackingToken || `RT-${Math.floor(Math.random() * 9000) + 1000}`;
  const trackingUrl = `http://localhost:5173/track/${trackingToken}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(trackingUrl);
    setIsCopied(true);
    toast.success('Tracking link copied');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    const isDelivery = order.deliveryMethod === 'delivery' || order.deliveryMethod === 'Dispatch';
    const riderName = order.agent?.name || order.rider?.name || 'Kofi Mensah';
    
    const message = isDelivery 
      ? `Hi ${order.customer?.name || order.customer || 'Customer'},\nyour order from RightTech is on the way 🛵\n\nTrack your delivery live here:\n${trackingUrl}\n\nYour rider ${riderName} will call when close.`
      : `Hi ${order.customer?.name || order.customer || 'Customer'},\nyour order ${order.id} from RightTech is ready for collection 📦\n\nView details and location here:\n${trackingUrl}`;
      
    const encoded = encodeURIComponent(message);
    const phone = (order.customer?.contact || order.phone || '').replace(/\s+/g, '');
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
  };

  return (
    <div className="flex flex-col gap-6 p-8 w-full bg-transparent">
      
      {/* High-Fidelity Boarding Pass - Ticket Centerpiece */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-[#111111] rounded-[36px] overflow-hidden border border-[#111111]"
      >
        <div className="p-8 pb-6 bg-gradient-to-br from-[#111111] to-[#333333] relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D40073]/20 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2" />
          
          <div className="flex items-start justify-between relative z-10 mb-8">
            <div className="space-y-1.5">
               <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#16A34A]/20 border border-[#16A34A]/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                  <span className="text-[9px] font-black text-[#16A34A] uppercase tracking-[0.2em]">Tracking Secured</span>
               </div>
               <h3 className="text-[26px] font-black text-white tracking-tighter">{trackingToken}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md">
               <Icon icon="solar:routing-2-bold-duotone" className="text-[26px] text-[#D40073]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 relative z-10 border-t border-white/5 pt-6">
             <div>
                <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-1.5">Destination</p>
                <p className="text-[14px] font-bold text-white truncate">{order.customer?.name || order.customer || 'Kwame Dealers Ltd'}</p>
             </div>
             <div className="text-right">
                <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-1.5">Arrival (Est)</p>
                <p className="text-[14px] font-bold text-[#D40073]">15 Mins</p>
             </div>
          </div>
        </div>

        {/* Separator */}
        <div className="relative h-4 bg-[#111111] flex items-center justify-between">
           <div className="w-4 h-4 rounded-full bg-[#F1F3F5] translate-x-[-50%] border-r-[2px] border-[#ECEDEF]" />
           <div className="flex-1 border-t-[1.5px] border-dashed border-white/20 mx-4 h-0" />
           <div className="w-4 h-4 rounded-full bg-[#F1F3F5] translate-x-[50%] border-l-[2px] border-[#ECEDEF]" />
        </div>

        {/* Pass Bottom */}
        <div className="px-8 py-6 pt-1 flex items-center justify-between text-white/95">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-black text-[10px] border border-white/10">KM</div>
              <p className="text-[13px] font-bold tracking-tight">{order.agent?.name || order.rider?.name || 'Kofi Mensah'}</p>
           </div>
           <p className="text-[12px] font-bold text-[#16A34A] tracking-wider uppercase">In Transit</p>
        </div>
      </motion.div>

      {/* Sharing Grid - Premium Compact */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { id: 'whatsapp', label: 'WhatsApp', sub: 'Direct message', icon: 'logos:whatsapp-icon', color: '#25D366', action: shareWhatsApp },
          { id: 'link', label: 'Copy Link', sub: 'Universal link', icon: 'solar:copy-bold-duotone', color: '#111111', action: handleCopy }
        ].map((item) => (
          <button 
            key={item.id}
            onClick={item.action}
            className="flex items-center gap-3 p-4 bg-white border border-[#ECEDEF] rounded-[24px] hover:bg-[#F8F9FA] hover:border-[#D40073]/50 transition-all active:scale-95 group shadow-none"
          >
            <div 
               className="w-10 h-10 rounded-full flex items-center justify-center grow-0 shrink-0 group-hover:scale-110 transition-transform"
               style={{ backgroundColor: `${item.color}10` }}
            >
               <Icon icon={item.icon} className="text-[20px]" style={{ color: item.id === 'whatsapp' ? undefined : item.id === 'link' ? '#D40073' : item.color }} />
            </div>
            <div className="text-left">
              <h4 className="text-[14px] font-black text-[#111111] leading-none mb-0.5">{item.label}</h4>
              <p className="text-[10px] font-bold text-[#8B93A7] uppercase tracking-wider">{item.sub}</p>
            </div>
          </button>
        ))}
      </div>

    </div>
  );
}
