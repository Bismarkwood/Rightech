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
    <div className="flex flex-col gap-6 p-6">
      
      {/* 1. Logistics Section */}
      <div className="bg-[#F8F9FA] rounded-[24px] p-6 border border-[#ECEDEF]">
         <div className="flex items-center gap-2 mb-4">
            <Icon icon="solar:routing-bold-duotone" className="text-[#D40073] text-[20px]" />
            <h4 className="text-[12px] font-black text-[#8B93A7] uppercase tracking-[0.2em]">Logistics</h4>
         </div>
         <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/50 pb-3">
               <span className="text-[14px] font-bold text-[#111111]">Method</span>
               <span className="text-[14px] font-black text-[#D40073] uppercase tracking-wider">{order.deliveryMethod === 'collection' ? 'In-Store Pickup' : 'Delivery'}</span>
            </div>
            {order.deliveryMethod === 'collection' && (
               <div className="text-[13px] font-medium text-[#525866] italic">Customer will collect from HQ</div>
            )}
         </div>
      </div>

      {/* 2. Boarding Pass Tracking Card */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-[#111111] rounded-[28px] overflow-hidden shadow-xl"
      >
        <div className="p-6 pb-4 bg-gradient-to-br from-[#111111] to-[#2D2D2D] relative">
          <div className="flex items-start justify-between relative z-10 mb-6">
            <div className="space-y-1">
               <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-[#16A34A]/20 border border-[#16A34A]/10">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                  <span className="text-[9px] font-black text-[#16A34A] uppercase tracking-[0.14em]">Tracking Secured</span>
               </div>
               <h3 className="text-[20px] font-black text-white tracking-tight">{trackingToken}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
               <Icon icon="solar:routing-2-bold-duotone" className="text-[24px] text-[#D40073]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 relative z-10 border-t border-white/5 pt-4">
             <div>
                <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Destination</p>
                <p className="text-[13px] font-bold text-white truncate">{order.customer?.name || order.customer || 'Customer Name'}</p>
             </div>
             <div className="text-right">
                <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Est. Arrival</p>
                <p className="text-[13px] font-bold text-[#D40073]">12 - 15 Mins</p>
             </div>
          </div>
        </div>

        <div className="relative h-4 flex items-center justify-between px-[-2px]">
           <div className="w-4 h-4 rounded-full bg-white translate-x-[-50%]" />
           <div className="flex-1 border-t border-dashed border-white/20 mx-4 h-[1px]" />
           <div className="w-4 h-4 rounded-full bg-white translate-x-[50%]" />
        </div>

        <div className="p-6 pt-2">
           <div className="flex items-center justify-between text-white/90">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-black text-[10px]">KM</div>
                 <div>
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-0.5">Assignee</p>
                    <p className="text-[12px] font-bold">{order.agent?.name || order.rider?.name || 'Kofi Mensah'}</p>
                 </div>
              </div>
              <div className="text-right">
                 <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-0.5">Status</p>
                 <p className="text-[12px] font-bold">{order.delStatus || 'In Transit'}</p>
              </div>
           </div>
        </div>
      </motion.div>

      {/* 3. Social & Copy Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={shareWhatsApp}
          className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-[#ECEDEF] rounded-[24px] hover:border-[#25D366] hover:bg-[#25D366]/5 transition-all active:scale-95"
        >
          <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center">
            <Icon icon="logos:whatsapp-icon" className="text-[20px]" />
          </div>
          <div className="text-center">
            <p className="text-[13px] font-black text-[#111111]">WhatsApp</p>
            <p className="text-[10px] font-bold text-[#8B93A7]">Direct message</p>
          </div>
        </button>
        <button 
          className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-[#ECEDEF] rounded-[24px] hover:border-[#D40073] hover:bg-[#D40073]/5 transition-all active:scale-95"
        >
          <div className="w-10 h-10 rounded-full bg-[#D40073]/10 flex items-center justify-center">
            <Icon icon="solar:letter-bold-duotone" className="text-[20px] text-[#D40073]" />
          </div>
          <div className="text-center">
            <p className="text-[13px] font-black text-[#111111]">SMS / Text</p>
            <p className="text-[10px] font-bold text-[#8B93A7]">Mobile delivery</p>
          </div>
        </button>
      </div>

      {/* 4. Link & Copy */}
      <div className="space-y-3">
        <label className="text-[10px] font-black text-[#8B93A7] uppercase tracking-[0.2em] ml-1">Universal Access Link</label>
        <div className="flex items-center gap-2 p-1 bg-[#F8F9FA] border border-[#ECEDEF] rounded-[20px] focus-within:border-[#D40073] transition-all">
          <div className="flex-1 px-4 py-2 overflow-hidden">
            <p className="text-[13px] font-bold text-[#111111]/60 truncate tracking-tight">{trackingUrl}</p>
          </div>
          <button 
            onClick={handleCopy}
            className={`h-10 px-4 rounded-[16px] font-black text-[12px] transition-all flex items-center gap-2 active:scale-90 ${
              isCopied ? 'bg-[#16A34A] text-white' : 'bg-[#111111] text-white hover:bg-black'
            }`}
          >
            <Icon icon={isCopied ? "solar:check-circle-bold" : "solar:copy-bold"} className="text-[16px]" />
            {isCopied ? 'Copied' : 'Copy Link'}
          </button>
        </div>
      </div>

      {/* 5. Settlement Section */}
      <div className="bg-[#111111] rounded-[28px] p-6 text-white shadow-lg overflow-hidden relative">
         <div className="absolute top-0 right-0 w-32 h-32 bg-[#D40073] opacity-10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2" />
         
         <div className="flex items-center gap-2 mb-6">
            <Icon icon="solar:card-2-bold-duotone" className="text-[#D40073] text-[20px]" />
            <h4 className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em]">Settlement</h4>
         </div>

         <div className="grid grid-cols-2 gap-8 mb-6 border-b border-white/10 pb-6">
            <div>
               <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1.5">Method</p>
               <p className="text-[14px] font-black text-white tracking-tight">{order.paymentMethod === 'cash' ? 'Cash on Delivery' : 'Mobile Money'}</p>
            </div>
            <div className="text-right">
               <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1.5">Status</p>
               <span className="px-3 py-1 rounded-full bg-[#EF4444] text-white text-[10px] font-black uppercase tracking-[0.1em]">Unpaid</span>
            </div>
         </div>

         <div className="space-y-4">
            <div className="flex items-center justify-between">
               <span className="text-[13px] font-bold text-white/50">Amount Paid</span>
               <span className="text-[14px] font-black text-white">GHS 0.00</span>
            </div>
            <div className="flex items-center justify-between">
               <span className="text-[13px] font-bold text-white/50">Outstanding</span>
               <span className="text-[18px] font-black text-[#EF4444]">GHS {order.amount || order.total?.toFixed(2) || '0.00'}</span>
            </div>
         </div>
      </div>

    </div>
  );
}
