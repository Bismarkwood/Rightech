import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from '@iconify/react';
import { Search, MapPin, Info, Phone, AlertCircle } from 'lucide-react';
import { GhanaAddress } from '../types/address';
import { GHANA_REGIONS, KNOWN_AREAS } from '../data/ghanaAddressData';

interface GhanaAddressFormProps {
  value: Partial<GhanaAddress>;
  onChange: (value: GhanaAddress) => void;
}

export const GhanaAddressForm: React.FC<GhanaAddressFormProps> = ({ value, onChange }) => {
  const [areaSearch, setAreaSearch] = useState(value.area || '');
  const [isAreaFocused, setIsAreaFocused] = useState(false);

  const selectedRegionData = useMemo(() => 
    GHANA_REGIONS.find(r => r.name === value.region), 
    [value.region]
  );

  const filteredAreas = useMemo(() => {
    if (!areaSearch) return [];
    return KNOWN_AREAS.filter(a => 
      a.name.toLowerCase().includes(areaSearch.toLowerCase()) &&
      (value.city ? a.city === value.city : true)
    ).slice(0, 5);
  }, [areaSearch, value.city]);

  const handleUpdate = (patch: Partial<GhanaAddress>) => {
    onChange({
      region: value.region || '',
      city: value.city || '',
      area: value.area || '',
      landmark: value.landmark || '',
      instructions: value.instructions || '',
      contactPhone: value.contactPhone || '',
      ...patch
    } as GhanaAddress);
  };

  const isAreaKnown = KNOWN_AREAS.some(a => a.name === value.area);

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* Layer 1: Region & City */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-black text-[#8B93A7] uppercase tracking-wider ml-1">Delivery Region</label>
          <div className="relative">
            <select
              value={value.region || ''}
              onChange={(e) => {
                handleUpdate({ region: e.target.value, city: '', area: '' });
                setAreaSearch('');
              }}
              className="w-full h-11 pl-4 pr-10 bg-[#F9FAFB] border border-[#ECEDEF] rounded-[12px] text-[14px] font-bold text-[#111111] focus:bg-white focus:border-[#D40073] outline-none appearance-none transition-all"
            >
              <option value="" disabled>Select Region</option>
              {GHANA_REGIONS.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
            </select>
            <Icon icon="solar:alt-arrow-down-linear" className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B93A7] pointer-events-none" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-black text-[#8B93A7] uppercase tracking-wider ml-1">City / Town</label>
          <div className="relative">
            <select
              disabled={!value.region}
              value={value.city || ''}
              onChange={(e) => handleUpdate({ city: e.target.value, area: '' })}
              className="w-full h-11 pl-4 pr-10 bg-[#F9FAFB] border border-[#ECEDEF] rounded-[12px] text-[14px] font-bold text-[#111111] focus:bg-white focus:border-[#D40073] outline-none appearance-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="" disabled>Select City</option>
              {selectedRegionData?.cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <Icon icon="solar:alt-arrow-down-linear" className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B93A7] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Layer 2: Area / Neighborhood */}
      <div className="space-y-1.5 relative">
        <label className="text-[11px] font-black text-[#8B93A7] uppercase tracking-wider ml-1">Area / Neighbourhood</label>
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B93A7]" size={16} />
          <input
            type="text"
            placeholder="Type area name (e.g. Adenta Housing)"
            value={areaSearch}
            onChange={(e) => {
              setAreaSearch(e.target.value);
              handleUpdate({ area: e.target.value });
            }}
            onFocus={() => setIsAreaFocused(true)}
            onBlur={() => setTimeout(() => setIsAreaFocused(false), 200)}
            className="w-full h-11 pl-12 pr-4 bg-[#F9FAFB] border border-[#ECEDEF] rounded-[12px] text-[14px] font-medium text-[#111111] focus:bg-white focus:border-[#D40073] outline-none transition-all"
          />
        </div>
        
        {/* Smart Search Suggestions */}
        <AnimatePresence>
          {isAreaFocused && filteredAreas.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute left-0 right-0 top-full mt-2 bg-white border border-[#ECEDEF] rounded-[16px] z-50 overflow-hidden"
            >
              {filteredAreas.map(area => (
                <button
                  key={area.name}
                  onMouseDown={() => {
                    setAreaSearch(area.name);
                    handleUpdate({ area: area.name, city: area.city, region: area.region });
                  }}
                  className="w-full px-5 py-3 text-left hover:bg-[#F9FAFB] flex items-center gap-3 border-b border-[#F1F3F5] last:border-0 transition-colors"
                >
                  <MapPin size={14} className="text-[#D40073]" />
                  <div>
                    <div className="text-[13px] font-bold text-[#111111]">{area.name}</div>
                    <div className="text-[11px] text-[#8B93A7]">{area.city}, {area.region}</div>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {areaSearch && !isAreaKnown && !isAreaFocused && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 mt-2 px-3 py-2 bg-[#FFFBEB] rounded-[8px] border border-[#FEF3C7]"
          >
            <AlertCircle size={14} className="text-[#D97706]" />
            <p className="text-[11px] font-medium text-[#92400E]">We don't recognise this area — please check spelling or select the nearest known area.</p>
          </motion.div>
        )}
      </div>

      {/* Layer 3: Street / Landmark */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-black text-[#8B93A7] uppercase tracking-wider ml-1">Street / Nearest Landmark</label>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B93A7]" size={16} />
          <input
            type="text"
            placeholder="e.g. Near Shoprite, opposite red gate..."
            value={value.landmark || ''}
            onChange={(e) => handleUpdate({ landmark: e.target.value })}
            className="w-full h-11 pl-12 pr-4 bg-[#F9FAFB] border border-[#ECEDEF] rounded-[12px] text-[14px] font-medium text-[#111111] focus:bg-white focus:border-[#D40073] outline-none transition-all"
          />
        </div>
        {(value.landmark && value.landmark.length < 10) && (
          <p className="text-[10px] font-bold text-[#8B93A7] mt-1 ml-1">Please add a landmark or street name so the rider can find you.</p>
        )}
      </div>

      {/* Layer 4: Instructions & Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-black text-[#8B93A7] uppercase tracking-wider ml-1">Delivery Instructions</label>
          <input
            type="text"
            placeholder="e.g. Blue gate, call Maame..."
            value={value.instructions || ''}
            maxLength={100}
            onChange={(e) => handleUpdate({ instructions: e.target.value })}
            className="w-full h-11 px-4 bg-[#F9FAFB] border border-[#ECEDEF] rounded-[12px] text-[14px] font-medium text-[#111111] focus:bg-white focus:border-[#D40073] outline-none transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-black text-[#8B93A7] uppercase tracking-wider ml-1 flex items-center gap-1.5">
            <Phone size={10} className="text-[#D40073]" />
            Contact on Arrival
          </label>
          <input
            type="tel"
            placeholder="Recipient's phone number"
            value={value.contactPhone || ''}
            onChange={(e) => handleUpdate({ contactPhone: e.target.value })}
            className="w-full h-11 px-4 bg-[#F9FAFB] border border-[#ECEDEF] rounded-[12px] text-[14px] font-bold text-[#111111] focus:bg-white focus:border-[#D40073] outline-none transition-all"
          />
        </div>
      </div>

      <div className="p-3 bg-blue-50/50 rounded-[10px] border border-blue-100 flex items-start gap-2.5">
        <Info size={14} className="text-blue-600 mt-0.5 shrink-0" />
        <p className="text-[11px] text-blue-700 leading-relaxed">
          Adding a clear landmark and a direct contact number ensures your order is delivered correctly on the first attempt.
        </p>
      </div>
    </div>
  );
};
