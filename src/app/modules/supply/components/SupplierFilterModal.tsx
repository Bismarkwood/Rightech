import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from '@iconify/react';
import { X, Check } from 'lucide-react';
import { VettingStatus } from '../context/SupplierContext';

interface FilterState {
  status: VettingStatus[];
  category: string[];
  minRating: number | null;
}

interface SupplierFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  initialFilters: FilterState;
}

const CATEGORIES = ['Electronics', 'Hardware', 'Logistics', 'Appliances', 'FMCG', 'Other'];
const STATUSES: VettingStatus[] = ['Verified', 'Pending', 'Rejected', 'Blacklisted'];
const RATINGS = [4.5, 4.0, 3.5, 3.0];

export function SupplierFilterModal({ isOpen, onClose, onApply, initialFilters }: SupplierFilterModalProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const toggleStatus = (status: VettingStatus) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status.includes(status) 
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status]
    }));
  };

  const toggleCategory = (cat: string) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category.includes(cat)
        ? prev.category.filter(c => c !== cat)
        : [...prev.category, cat]
    }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    const resetState = { status: [], category: [], minRating: null };
    setFilters(resetState);
    onApply(resetState);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 font-['Manrope']">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-[480px] bg-white rounded-[32px] overflow-hidden flex flex-col shadow-none border border-[#ECEDEF]"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-[#ECEDEF] flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[12px] bg-[#111111] text-white flex items-center justify-center">
                  <Icon icon="solar:filter-bold" className="text-[22px]" />
                </div>
                <h2 className="text-[20px] font-black text-[#111111] tracking-tight">Filter Partners</h2>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full hover:bg-[#F3F4F6] flex items-center justify-center text-[#8B93A7] transition-all active:scale-95"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto no-scrollbar">
              
              {/* Vetting Status */}
              <section>
                <p className="text-[11px] font-black text-[#8B93A7] uppercase tracking-[0.15em] mb-4">Vetting Status</p>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map(status => (
                    <button
                      key={status}
                      onClick={() => toggleStatus(status)}
                      className={`h-9 px-4 rounded-[10px] text-[13px] font-black transition-all flex items-center gap-2 border ${
                        filters.status.includes(status)
                        ? 'bg-[#111111] border-[#111111] text-white'
                        : 'bg-white border-[#ECEDEF] text-[#525866] hover:border-[#111111]'
                      }`}
                    >
                      {filters.status.includes(status) && <Check size={14} strokeWidth={3} />}
                      {status}
                    </button>
                  ))}
                </div>
              </section>

              {/* Industry Category */}
              <section>
                <p className="text-[11px] font-black text-[#8B93A7] uppercase tracking-[0.15em] mb-4">Industry Category</p>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={`h-10 px-4 rounded-[12px] text-[13px] font-black transition-all flex items-center justify-between border ${
                        filters.category.includes(cat)
                        ? 'bg-[#D40073] border-[#D40073] text-white'
                        : 'bg-white border-[#ECEDEF] text-[#525866] hover:border-[#D40073]'
                      }`}
                    >
                      {cat}
                      {filters.category.includes(cat) ? (
                        <Check size={14} strokeWidth={3} />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#ECEDEF]" />
                      )}
                    </button>
                  ))}
                </div>
              </section>

              {/* Performance Rating */}
              <section>
                <p className="text-[11px] font-black text-[#8B93A7] uppercase tracking-[0.15em] mb-4">Minimum Rating</p>
                <div className="flex items-center gap-2">
                  {RATINGS.map(rating => (
                    <button
                      key={rating}
                      onClick={() => setFilters({ ...filters, minRating: filters.minRating === rating ? null : rating })}
                      className={`flex-1 h-11 rounded-[14px] text-[14px] font-black transition-all flex items-center justify-center gap-1.5 border ${
                        filters.minRating === rating
                        ? 'bg-[#FFB800] border-[#FFB800] text-[#111111]'
                        : 'bg-white border-[#ECEDEF] text-[#525866] hover:border-[#FFB800]'
                      }`}
                    >
                      <Icon icon="solar:star-bold" className={filters.minRating === rating ? "text-[#111111]" : "text-[#FFB800]"} />
                      {rating}+
                    </button>
                  ))}
                </div>
              </section>

            </div>

            {/* Footer */}
            <div className="px-8 py-6 border-t border-[#ECEDEF] bg-[#FBFBFC] flex items-center gap-3 shrink-0">
              <button 
                onClick={handleReset}
                className="h-12 px-6 bg-white border border-[#ECEDEF] hover:bg-[#F3F4F6] text-[#525866] text-[13px] font-black uppercase tracking-widest rounded-[14px] transition-all"
              >
                Reset All
              </button>
              <button 
                onClick={handleApply}
                className="flex-1 h-12 bg-[#111111] hover:bg-[#333333] text-white text-[13px] font-black uppercase tracking-widest rounded-[14px] transition-all active:scale-95"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
