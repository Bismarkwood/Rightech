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

  const isPickup = order.deliveryMethod === 'collection' || order.deliveryMethod === 'Pickup' || order.deliveryMethod === 'Self Collection';

  if (isPickup) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-[#F8F9FA] rounded-[32px] border border-[#ECEDEF] border-dashed">
        <div className="w-20 h-20 rounded-[28px] bg-white flex items-center justify-center mb-6 shadow-sm">
          <Icon icon="solar:shop-bold-duotone" className="text-[42px] text-[#8B93A7]" />
        </div>
        <h3 className="text-[18px] font-black text-[#111111] mb-2">Self-Collection</h3>
        <p className="text-[14px] text-[#525866] text-center max-w-[280px] font-medium leading-relaxed">
          Live tracking is optimized for rider-led deliveries to ensure secure, real-time updates.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* 1. Boarding Pass Preview Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-[#111111] rounded-[32px] overflow-hidden shadow-2xl shadow-black/20"
      >
        {/* Pass Top Section */}
        <div className="p-8 pb-6 bg-gradient-to-br from-[#111111] to-[#2D2D2D] relative">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#D40073]/20 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" />
          
          <div className="flex items-start justify-between relative z-10 mb-8">
            <div className="space-y-1.5">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16A34A]/20 border border-[#16A34A]/20 backdrop-blur-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                  <span className="text-[10px] font-black text-[#16A34A] uppercase tracking-[0.14em]">Tracking Secured</span>
               </div>
               <h3 className="text-[24px] font-black text-white tracking-tight">{order.id}</h3>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md">
               <Icon icon="solar:routing-2-bold-duotone" className="text-[28px] text-[#D40073]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 relative z-10">
             <div>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.14em] mb-1">Destination</p>
                <p className="text-[14px] font-bold text-white truncate">{order.customer?.name || order.customer || 'Customer Name'}</p>
             </div>
             <div className="text-right">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.14em] mb-1">Est. Arrival</p>
                <p className="text-[14px] font-bold text-[#D40073]">12 - 15 Mins</p>
             </div>
          </div>
        </div>

        {/* Dashed Separator */}
        <div className="relative h-6 bg-[#111111] flex items-center justify-between px-[-4px]">
           <div className="absolute left-0 w-6 h-6 rounded-full bg-white translate-x-[-50%] border-r border-[#ECEDEF]" />
           <div className="flex-1 border-t border-dashed border-white/20 mx-6 h-[1px]" />
           <div className="absolute right-0 w-6 h-6 rounded-full bg-white translate-x-[50%] border-l border-[#ECEDEF]" />
        </div>

        {/* Pass Bottom Section */}
        <div className="p-8 pt-4 bg-[#111111]">
           <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-black text-[12px] text-white">
                    KM
                 </div>
                 <div>
                    <p className="text-[11px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">Assignee</p>
                    <p className="text-[13px] font-bold text-white leading-none">{order.agent?.name || 'Kofi Mensah'}</p>
                 </div>
              </div>
              <div className="text-right">
                 <p className="text-[11px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">Status</p>
                 <p className="text-[13px] font-bold text-white leading-none">{order.delStatus || 'In Transit'}</p>
              </div>
           </div>
        </div>
      </motion.div>

      {/* 2. Tactile Share Grid */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { 
            id: 'whatsapp', 
            label: 'WhatsApp', 
            sub: 'Direct message', 
            icon: 'logos:whatsapp-icon', 
            color: '#25D366', 
            action: shareWhatsApp 
          },
          { 
            id: 'sms', 
            label: 'SMS / Text', 
            sub: 'Mobile delivery', 
            icon: 'solar:letter-bold-duotone', 
            color: '#D40073', 
            action: () => toast.info('SMS sharing coming soon') 
          }
        ].map((item, idx) => (
          <motion.button 
            key={item.id}
            initial={{ opacity: 0, x: idx === 0 ? -10 : 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * idx }}
            onClick={item.action}
            className="group relative h-40 bg-white border border-[#ECEDEF] rounded-[32px] p-6 flex flex-col items-center justify-center transition-all hover:bg-[#F8F9FA] hover:border-[#D40073]/30 active:scale-95 overflow-hidden"
          >
            <div 
               className="w-16 h-16 rounded-[22px] flex items-center justify-center mb-4 transition-all group-hover:scale-110"
               style={{ backgroundColor: `${item.color}15` }}
            >
               <Icon icon={item.icon} className="text-[32px]" style={{ color: item.id === 'whatsapp' ? undefined : item.color }} />
            </div>
            <div className="text-center">
              <h4 className="text-[15px] font-black text-[#111111]">{item.label}</h4>
              <p className="text-[12px] font-bold text-[#8B93A7]">{item.sub}</p>
            </div>
            
            {/* Background Accent */}
            <div 
               className="absolute top-0 right-0 w-24 h-24 rounded-full blur-[40px] opacity-0 group-hover:opacity-20 transition-opacity"
               style={{ backgroundColor: item.color }}
            />
          </motion.button>
        ))}
      </div>

      {/* 3. Link Section */}
      <div className="space-y-4">
        <label className="text-[11px] font-black text-[#8B93A7] uppercase tracking-[0.2em] ml-1">Universal Access Link</label>
        <div className="flex items-center gap-2 p-1.5 bg-[#F8F9FA] border border-[#ECEDEF] rounded-[24px] focus-within:border-[#D40073] focus-within:ring-4 focus-within:ring-[#D40073]/5 transition-all">
          <div className="flex-1 px-4 py-2 overflow-hidden">
            <p className="text-[14px] font-black text-[#111111]/70 truncate tracking-tight">{trackingUrl}</p>
          </div>
          <button 
            onClick={handleCopy}
            className={`h-12 px-6 rounded-[18px] font-black text-[13px] transition-all flex items-center gap-2 active:scale-90 ${
              isCopied ? 'bg-[#16A34A] text-white' : 'bg-[#111111] text-white hover:bg-black'
            }`}
          >
            <Icon icon={isCopied ? "solar:check-circle-bold" : "solar:copy-bold"} className="text-[18px]" />
            {isCopied ? 'Copied' : 'Copy Link'}
          </button>
        </div>
      </div>
    </div>
  );
}
