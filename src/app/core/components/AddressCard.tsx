import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, MessageSquare, ExternalLink } from 'lucide-react';
import { GhanaAddress } from '../types/address';

interface AddressCardProps {
  address: GhanaAddress;
  isRiderView?: boolean;
}

export const AddressCard: React.FC<AddressCardProps> = ({ address, isRiderView = false }) => {
  const openMaps = () => {
    const query = encodeURIComponent(`${address.area}, ${address.landmark}, ${address.city}, Ghana`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white border border-[#ECEDEF] rounded-[24px] overflow-hidden ${isRiderView ? 'ring-2 ring-[#D40073]/5 border-[#D40073]/20' : ''}`}
    >
      <div className="p-6 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-[#D40073]/5 text-[#D40073] flex items-center justify-center">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-[12px] font-black text-[#8B93A7] uppercase tracking-wider leading-none mb-1">
                {address.region} · {address.city}
              </p>
              <h3 className="text-[18px] font-black text-[#111111] tracking-tight">{address.area}</h3>
            </div>
          </div>
          {isRiderView && (
            <button 
              onClick={openMaps}
              className="h-10 px-4 bg-[#111111] text-white rounded-[12px] text-[12px] font-bold flex items-center gap-2 hover:bg-black transition-all"
            >
              <ExternalLink size={14} />
              Open Maps
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div className="p-5 bg-[#F9FAFB] rounded-[20px] border border-[#ECEDEF]">
            <p className="text-[11px] font-black text-[#8B93A7] uppercase tracking-wider mb-2">Location Landmark</p>
            <p className="text-[14px] font-bold text-[#111111] leading-relaxed italic">"{address.landmark}"</p>
          </div>

          {address.instructions && (
            <div className="p-5 bg-white border-2 border-dashed border-[#ECEDEF] rounded-[20px]">
              <p className="text-[11px] font-black text-[#8B93A7] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <MessageSquare size={12} className="text-[#D40073]" />
                Final Approach Instructions
              </p>
              <p className="text-[15px] font-black text-[#D40073] uppercase leading-tight">{address.instructions}</p>
            </div>
          )}
        </div>

        <div className="pt-2 flex items-center gap-4">
          <div className="flex-1 flex items-center gap-3 p-3 bg-white border border-[#ECEDEF] rounded-[16px]">
            <div className="w-8 h-8 rounded-full bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center">
              <Phone size={14} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#8B93A7] uppercase tracking-widest">Call on Arrival</p>
              <p className="text-[14px] font-black text-[#111111]">{address.contactPhone}</p>
            </div>
          </div>
          {isRiderView && (
            <a 
              href={`tel:${address.contactPhone}`}
              className="h-14 w-14 rounded-full bg-[#16A34A] text-white flex items-center justify-center hover:scale-105 transition-all"
            >
              <Phone size={24} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};
