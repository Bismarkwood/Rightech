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
    <div className="flex flex-col gap-10 p-10 bg-white">
      
      {/* 1. Boarding Pass Card - Zero Shadows, Full Contrast */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-[#111111] rounded-[40px] overflow-hidden border-[2px] border-[#111111]"
      >
        <div className="p-10 pb-8 bg-gradient-to-br from-[#111111] to-[#2D2D2D] relative">
          <div className="flex items-start justify-between relative z-10 mb-10">
            <div className="space-y-2">
               <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#16A34A]/20 border border-[#16A34A]/20">
                  <div className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
                  <span className="text-[10px] font-black text-[#16A34A] uppercase tracking-[0.2em]">Tracking Secured</span>
               </div>
               <h3 className="text-[32px] font-black text-white tracking-tighter">{trackingToken}</h3>
            </div>
            <div className="w-16 h-16 rounded-[22px] bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md">
               <Icon icon="solar:routing-2-bold-duotone" className="text-[32px] text-[#D40073]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 relative z-10 border-t border-white/10 pt-8">
             <div>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2">Destination</p>
                <p className="text-[16px] font-black text-white tracking-tight leading-tight">{order.customer?.name || order.customer || 'Kwame Dealers Ltd'}</p>
             </div>
             <div className="text-right">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2">Est. Arrival</p>
                <p className="text-[16px] font-black text-[#D40073] tracking-tight">12 - 15 Mins</p>
             </div>
          </div>
        </div>

        {/* Separator - Dashed */}
        <div className="relative h-6 bg-[#111111] flex items-center justify-between">
           <div className="w-6 h-6 rounded-full bg-white translate-x-[-50%] border-r-[2px] border-[#ECEDEF]" />
           <div className="flex-1 border-t-[2px] border-dashed border-white/20 mx-6 h-0" />
           <div className="w-6 h-6 rounded-full bg-white translate-x-[50%] border-l-[2px] border-[#ECEDEF]" />
        </div>

        {/* Bottom Pass Strip */}
        <div className="p-10 pt-4 bg-[#111111]">
           <div className="flex items-center justify-between text-white/90">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-black text-[13px] border border-white/10">KM</div>
                 <div>
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Assignee</p>
                    <p className="text-[15px] font-black tracking-tight">{order.agent?.name || order.rider?.name || 'Kofi Mensah'}</p>
                 </div>
              </div>
              <div className="text-right">
                 <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Status</p>
                 <div className="flex items-center gap-2 justify-end">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                    <p className="text-[15px] font-black tracking-tight uppercase tracking-wider text-[#16A34A]">{order.delStatus || 'In Transit'}</p>
                 </div>
              </div>
           </div>
        </div>
      </motion.div>

      {/* 2. Tactile Share Grid - Zero Shadows */}
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
          <button 
            key={item.id}
            onClick={item.action}
            className="group relative h-48 bg-[#F8F9FA] border-[1.5px] border-[#ECEDEF] rounded-[40px] p-8 flex flex-col items-center justify-center transition-all hover:bg-white hover:border-[#D40073]/50 active:scale-95 overflow-hidden shadow-none"
          >
            <div 
               className="w-16 h-16 rounded-[24px] flex items-center justify-center mb-4 transition-all group-hover:scale-110"
               style={{ backgroundColor: `${item.color}10` }}
            >
               <Icon icon={item.icon} className="text-[36px]" style={{ color: item.id === 'whatsapp' ? undefined : item.color }} />
            </div>
            <div className="text-center">
              <h4 className="text-[16px] font-black text-[#111111] tracking-tight">{item.label}</h4>
              <p className="text-[12px] font-black text-[#8B93A7] uppercase tracking-widest">{item.sub}</p>
            </div>
          </button>
        ))}
      </div>

      {/* 3. Link Section - Rounded Flat */}
      <div className="space-y-4">
        <label className="text-[11px] font-black text-[#8B93A7] uppercase tracking-[0.3em] ml-2">Universal Access Link</label>
        <div className="flex items-center gap-2 p-1.5 bg-[#F8F9FA] border-[1.5px] border-[#ECEDEF] rounded-[28px] focus-within:bg-white focus-within:border-[#D40073] transition-all">
          <div className="flex-1 px-5 py-2 overflow-hidden">
            <p className="text-[14px] font-black text-[#111111]/70 truncate tracking-tight">{trackingUrl}</p>
          </div>
          <button 
            onClick={handleCopy}
            className={`h-12 px-8 rounded-[22px] font-black text-[13px] transition-all flex items-center gap-2 active:scale-90 shadow-none ${
              isCopied ? 'bg-[#16A34A] text-white' : 'bg-[#111111] text-white hover:bg-black'
            }`}
          >
            <Icon icon={isCopied ? "solar:check-circle-bold" : "solar:copy-bold"} className="text-[20px]" />
            {isCopied ? 'Copied' : 'Copy Link'}
          </button>
        </div>
      </div>

      {/* 4. Settlement Section - Double Border Flat */}
      <div className="bg-[#F8F9FA] rounded-[40px] p-10 border-[1.5px] border-[#ECEDEF] relative overflow-hidden">
         <div className="flex items-center gap-3 mb-8 border-b border-[#ECEDEF] pb-5">
            <div className="w-10 h-10 rounded-[14px] bg-white border border-[#ECEDEF] flex items-center justify-center shadow-none">
               <Icon icon="solar:card-2-bold-duotone" className="text-[#D40073] text-[20px]" />
            </div>
            <h4 className="text-[12px] font-black text-[#8B93A7] uppercase tracking-[0.3em]">Settlement</h4>
         </div>

         <div className="grid grid-cols-2 gap-10 mb-8 border-b border-[#ECEDEF] pb-8">
            <div>
               <p className="text-[10px] font-black text-[#8B93A7] uppercase tracking-widest mb-2.5">Method</p>
               <p className="text-[16px] font-black text-[#111111] tracking-tight">{order.paymentMethod === 'cash' ? 'Cash on Delivery' : 'Mobile Money'}</p>
            </div>
            <div className="text-right">
               <p className="text-[10px] font-black text-[#8B93A7] uppercase tracking-widest mb-2.5">Status</p>
               <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#EF4444]/5 border border-[#EF4444]/10">
                  <span className="text-[12px] font-black text-[#EF4444] uppercase tracking-widest">Unpaid</span>
               </div>
            </div>
         </div>

         <div className="space-y-4">
            <div className="flex items-center justify-between">
               <span className="text-[14px] font-black text-[#8B93A7] uppercase tracking-widest">Amount Paid</span>
               <span className="text-[16px] font-black text-[#111111]">GHS 0.00</span>
            </div>
            <div className="flex items-center justify-between pt-2">
               <span className="text-[14px] font-black text-[#8B93A7] uppercase tracking-widest">Outstanding</span>
               <span className="text-[26px] font-black text-[#EF4444] tracking-tighter">GHS {order.amount || order.total?.toFixed(2) || '85.00'}</span>
            </div>
         </div>
      </div>

    </div>
  );
}
