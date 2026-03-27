import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Phone, MapPin, ExternalLink, Calendar, Star, Box, TrendingUp, History, Info } from 'lucide-react';
import { Icon } from '@iconify/react';
import { Supplier } from '../context/SupplierContext';
import { useConsignment } from '../../consignment/context/ConsignmentContext';
import { useProducts } from '../../products/context/ProductContext';

interface SupplierDetailDrawerProps {
  supplier: Supplier | null;
  onClose: () => void;
}

export function SupplierDetailDrawer({ supplier, onClose }: SupplierDetailDrawerProps) {
  const { inboundConsignments } = useConsignment();
  const { products } = useProducts();

  if (!supplier) return null;

  const supplierConsignments = inboundConsignments.filter(c => c.partnerId === supplier.id);
  const supplierProducts = products.filter(p => p.supplierId === supplier.id);

  return (
    <AnimatePresence>
      {supplier && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-[500px] bg-white border-l border-[#ECEDEF] z-[70] flex flex-col shadow-[-8px_0_24px_rgba(0,0,0,0.04)]"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-[#ECEDEF] flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#111111] font-bold">
                  {supplier.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-[18px] font-bold text-[#111111] leading-tight">{supplier.name}</h2>
                  <p className="text-[12px] text-[#525866]">{supplier.id} • {supplier.category}</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full hover:bg-[#F3F4F6] flex items-center justify-center text-[#525866] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
              <div className="p-6 space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-4 rounded-[16px] bg-[#F7F7F8] border border-[#ECEDEF]">
                    <p className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider mb-1">Rating</p>
                    <div className="flex items-center gap-1.5 ">
                      <span className="text-[16px] font-black text-[#111111]">{supplier.rating}</span>
                      <Star size={14} className="fill-[#FFB800] text-[#FFB800]" />
                    </div>
                  </div>
                  <div className="p-4 rounded-[16px] bg-[#F7F7F8] border border-[#ECEDEF]">
                    <p className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider mb-1">Consignments</p>
                    <p className="text-[16px] font-black text-[#111111]">{supplier.totalConsignments}</p>
                  </div>
                  <div className="p-4 rounded-[16px] bg-[#ECFDF5] border border-[#D1FAE5]">
                    <p className="text-[11px] font-bold text-[#059669] uppercase tracking-wider mb-1">Status</p>
                    <p className="text-[14px] font-bold text-[#059669]">{supplier.status}</p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-[14px] font-bold text-[#111111] flex items-center gap-2">
                    <Info size={16} className="text-[#8B93A7]" />
                    Contact Details
                  </h3>
                  <div className="space-y-3 bg-white border border-[#ECEDEF] rounded-[16px] p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-[8px] bg-[#F3F4F6] flex items-center justify-center text-[#525866]">
                        <Icon icon="solar:user-rounded-linear" className="text-[18px]" />
                      </div>
                      <div>
                        <p className="text-[11px] text-[#8B93A7] font-medium leading-none mb-1">Contact Person</p>
                        <p className="text-[13px] font-bold text-[#111111]">{supplier.contactPerson}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-[8px] bg-[#F3F4F6] flex items-center justify-center text-[#525866]">
                        <Mail size={16} />
                      </div>
                      <div>
                        <p className="text-[11px] text-[#8B93A7] font-medium leading-none mb-1">Email</p>
                        <p className="text-[13px] font-bold text-[#111111]">{supplier.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-[8px] bg-[#F3F4F6] flex items-center justify-center text-[#525866]">
                        <Phone size={16} />
                      </div>
                      <div>
                        <p className="text-[11px] text-[#8B93A7] font-medium leading-none mb-1">Phone</p>
                        <p className="text-[13px] font-bold text-[#111111]">{supplier.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Consignments */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[14px] font-bold text-[#111111] flex items-center gap-2">
                      <Box size={16} className="text-[#8B93A7]" />
                      Recent Consignments
                    </h3>
                    <button className="text-[12px] font-bold text-[#D40073] hover:underline">View All</button>
                  </div>
                  <div className="space-y-2">
                    {supplierConsignments.length > 0 ? (
                      supplierConsignments.slice(0, 3).map(c => (
                        <div key={c.id} className="p-3 bg-white border border-[#ECEDEF] rounded-[12px] flex items-center justify-between group hover:border-[#D40073] transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-[8px] bg-[#F3F4F6] flex items-center justify-center text-[#111111] font-bold text-[10px]">
                              #
                            </div>
                            <div>
                              <p className="text-[13px] font-bold text-[#111111]">{c.name}</p>
                              <p className="text-[11px] text-[#8B93A7]">{c.date} • {c.items.length} products</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[13px] font-bold text-[#111111]">GHS {c.totalValue}</p>
                            <p className="text-[11px] text-[#059669] font-medium">{c.status}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center bg-[#F7F7F8] rounded-[16px] border border-dashed border-[#ECEDEF]">
                        <p className="text-[13px] text-[#8B93A7]">No consignments recorded yet.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Linked Catalog */}
                <div className="space-y-4 pb-8">
                  <h3 className="text-[14px] font-bold text-[#111111] flex items-center gap-2">
                    <Icon icon="solar:folder-linear" className="text-[#8B93A7] text-[18px]" />
                    Linked Products
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {supplierProducts.length > 0 ? (
                      supplierProducts.map(p => (
                        <div key={p.id} className="p-3 bg-white border border-[#ECEDEF] rounded-[16px] hover:border-[#D40073] transition-colors">
                          <div className="w-full aspect-square bg-[#F3F4F6] rounded-[10px] mb-3 overflow-hidden">
                            {p.image ? (
                              <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#8B93A7]">
                                <Icon icon="solar:box-linear" className="text-[24px]" />
                              </div>
                            )}
                          </div>
                          <p className="text-[12px] font-bold text-[#111111] truncate">{p.name}</p>
                          <p className="text-[11px] text-[#525866]">GHS {p.price}</p>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 p-8 text-center bg-[#F7F7F8] rounded-[16px] border border-dashed border-[#ECEDEF]">
                        <p className="text-[13px] text-[#8B93A7]">No products linked to this supplier.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-[#ECEDEF] bg-[#F7F7F8] flex items-center gap-3">
              <button className="flex-1 h-11 bg-white border border-[#E4E7EC] hover:bg-[#F3F4F6] text-[#111111] text-[13px] font-bold rounded-[12px] transition-colors">
                Edit Profile
              </button>
              <button className="h-11 px-4 bg-white border border-[#E4E7EC] hover:bg-[#FDF2F2] hover:text-[#DC2626] hover:border-[#FEE2E2] text-[#525866] rounded-[12px] transition-all">
                <Icon icon="solar:trash-bin-trash-linear" className="text-[20px]" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
