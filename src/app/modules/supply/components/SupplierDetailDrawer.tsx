import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Phone, Star, Box, Info, Clock, CheckCircle2, AlertCircle, ShoppingBag, Folder, LayoutDashboard } from 'lucide-react';
import { Icon } from '@iconify/react';
import { useSuppliers, VettingStatus, Supplier } from '../context/SupplierContext';
import { useConsignment } from '../../consignment/context/ConsignmentContext';
import { useProducts } from '../../products/context/ProductContext';
import { ConsignmentDetailsModal } from '../../consignment/components/ConsignmentDetailsModal';
import { ConsignmentItem } from '../../../core/data/consignmentData';

interface SupplierDetailDrawerProps {
  supplier: Supplier | null;
  onClose: () => void;
  onViewAllConsignments?: () => void;
  onEditSupplier?: () => void;
}

type TabType = 'Overview' | 'Consignments' | 'Products';

export function SupplierDetailDrawer({ supplier, onClose, onViewAllConsignments }: SupplierDetailDrawerProps) {
  const { inboundConsignments } = useConsignment();
  const { products } = useProducts();
  const { setEditingSupplier, setAddSupplierModalOpen } = useSuppliers();
  const [activeTab, setActiveTab] = useState<TabType>('Overview');
  const [selectedConsignment, setSelectedConsignment] = useState<ConsignmentItem | null>(null);

  if (!supplier) return null;

  const supplierConsignments = inboundConsignments.filter(c => c.partnerId === supplier.id);
  const supplierProducts = products.filter(p => p.supplierId === supplier.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Shelf': return 'bg-[#16A34A] text-white';
      case 'Settled': return 'bg-[#2563EB] text-white';
      case 'Returned': return 'bg-[#DC2626] text-white';
      case 'In Transit': return 'bg-[#EA580C] text-white';
      default: return 'bg-[#525866] text-white';
    }
  };

  const tabs: { id: TabType; icon: any; label: string }[] = [
    { id: 'Overview', icon: LayoutDashboard, label: 'Overview' },
    { id: 'Consignments', icon: Box, label: 'Consignments' },
    { id: 'Products', icon: Folder, label: 'Products' },
  ];

  return (
    <AnimatePresence>
      {supplier && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-[600px] bg-white border-l border-[#ECEDEF] z-[70] flex flex-col shadow-none font-['Manrope']"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-[#ECEDEF] flex items-center justify-between sticky top-0 bg-white z-10 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-[14px] bg-[#111111] text-white flex items-center justify-center text-[20px] font-black">
                  {supplier.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-[20px] font-black text-[#111111] leading-none mb-1.5 tracking-tight">{supplier.name}</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black uppercase tracking-widest text-[#8B93A7]">{supplier.id}</span>
                    <div className="w-1 h-1 rounded-full bg-[#ECEDEF]" />
                    <span className="text-[11px] font-black uppercase tracking-widest text-[#D40073]">{supplier.category}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-11 h-11 rounded-full hover:bg-[#111111] hover:text-white flex items-center justify-center text-[#525866] border border-[#ECEDEF] transition-all active:scale-90 shadow-none"
              >
                <X size={22} />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="px-8 border-b border-[#ECEDEF] bg-white shrink-0">
              <div className="flex items-center gap-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pt-5 pb-4 text-[13px] font-black uppercase tracking-widest transition-all relative flex items-center gap-2 ${
                      activeTab === tab.id ? 'text-[#D40073]' : 'text-[#8B93A7] hover:text-[#111111]'
                    }`}
                  >
                    <tab.icon size={16} />
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeSupplierTab"
                        className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#D40073]"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar bg-[#FBFBFC]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="p-8"
                >
                  {activeTab === 'Overview' && (
                    <div className="space-y-8">
                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-5 rounded-[20px] bg-white border border-[#ECEDEF]">
                          <p className="text-[10px] font-black text-[#8B93A7] uppercase tracking-[0.1em] mb-2">Rating</p>
                          <div className="flex items-center gap-2">
                            <span className="text-[20px] font-black text-[#111111] leading-none">{supplier.rating}</span>
                            <Star size={18} className="fill-[#FFB800] text-[#FFB800]" />
                          </div>
                        </div>
                        <div className="p-5 rounded-[20px] bg-white border border-[#ECEDEF]">
                          <p className="text-[10px] font-black text-[#8B93A7] uppercase tracking-[0.1em] mb-2">Consignments</p>
                          <p className="text-[20px] font-black text-[#111111] leading-none">{supplier.totalConsignments}</p>
                        </div>
                        <div className="p-5 rounded-[20px] bg-[#16A34A] border-none">
                          <p className="text-[10px] font-black text-white/70 uppercase tracking-[0.1em] mb-2">Status</p>
                          <p className="text-[15px] font-black text-white uppercase tracking-wider">{supplier.status}</p>
                        </div>
                      </div>

                      {/* Contact Cards */}
                      <div className="bg-white border border-[#ECEDEF] rounded-[24px] overflow-hidden">
                        <div className="p-5 bg-[#F9FAFB] border-b border-[#ECEDEF]">
                          <h3 className="text-[13px] font-black text-[#111111] flex items-center gap-2 uppercase tracking-wider">
                            <Info size={16} className="text-[#8B93A7]" />
                            Partner Information
                          </h3>
                        </div>
                        <div className="p-6 space-y-5">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-[12px] bg-[#111111] flex items-center justify-center text-white shrink-0">
                               <Icon icon="solar:user-rounded-bold" className="text-[20px]" />
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-[#8B93A7] uppercase tracking-widest leading-none mb-1.5">Contact Person</p>
                              <p className="text-[14px] font-black text-[#111111]">{supplier.contactPerson}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-[12px] bg-[#2563EB] flex items-center justify-center text-white shrink-0">
                               <Mail size={18} />
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-[#8B93A7] uppercase tracking-widest leading-none mb-1.5">Email Address</p>
                              <p className="text-[14px] font-black text-[#111111]">{supplier.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-[12px] bg-[#16A34A] flex items-center justify-center text-white shrink-0">
                               <Phone size={18} />
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-[#8B93A7] uppercase tracking-widest leading-none mb-1.5">Phone Number</p>
                              <p className="text-[14px] font-black text-[#111111]">{supplier.phone}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'Consignments' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[12px] font-black text-[#111111] uppercase tracking-[0.1em]">Movement History</p>
                        {onViewAllConsignments && (
                          <button 
                            onClick={onViewAllConsignments}
                            className="px-3 py-1 bg-[#F3F4F6] hover:bg-[#111111] hover:text-white rounded-[8px] text-[11px] font-black uppercase tracking-wider transition-all"
                          >
                            Full Archive
                          </button>
                        )}
                      </div>
                      <div className="space-y-3">
                        {supplierConsignments.length > 0 ? (
                          supplierConsignments.map(c => (
                            <div 
                              key={c.id} 
                              onClick={() => setSelectedConsignment(c)}
                              className="p-5 bg-white border border-[#ECEDEF] rounded-[24px] hover:border-[#111111] transition-all group cursor-pointer active:scale-[0.98]"
                            >
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-[12px] bg-[#111111] flex items-center justify-center text-white font-black text-[12px]">
                                    {c.status === 'In Transit' ? <Icon icon="solar:delivery-bold" /> : <Box size={18} />}
                                  </div>
                                  <div>
                                    <p className="text-[15px] font-black text-[#111111] tracking-tight group-hover:text-[#D40073] transition-colors">{c.name}</p>
                                    <p className="text-[11px] font-black text-[#8B93A7] uppercase tracking-widest">{c.id}</p>
                                  </div>
                                </div>
                                <span className={`px-2 py-1 rounded-[6px] text-[10px] font-black uppercase tracking-widest ${getStatusColor(c.status)}`}>
                                  {c.status}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-4 py-4 border-y border-[#F3F4F6] mb-4">
                                <div>
                                  <p className="text-[10px] font-black text-[#8B93A7] uppercase tracking-wider mb-1">Batch Value</p>
                                  <p className="text-[16px] font-black text-[#111111]">GHS {c.totalValue.toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-[10px] font-black text-[#8B93A7] uppercase tracking-wider mb-1">Manifest</p>
                                  <p className="text-[14px] font-black text-[#111111]">{c.items.length} Products</p>
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-[#8B93A7]">
                                  <Clock size={14} />
                                  <span className="text-[11px] font-black uppercase tracking-wider">{c.date}</span>
                                </div>
                                <div className="flex items-center gap-1 text-[#D40073] text-[12px] font-black uppercase tracking-[0.1em]">
                                  Deep Details
                                  <Icon icon="solar:alt-arrow-right-bold" />
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="py-16 text-center bg-white border border-[#ECEDEF] border-dashed rounded-[24px]">
                            <p className="text-[13px] font-black text-[#8B93A7] uppercase tracking-widest">No consignments found</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'Products' && (
                    <div className="space-y-6">
                      <p className="text-[12px] font-black text-[#111111] uppercase tracking-[0.1em] mb-2">Linked Product Catalog</p>
                      <div className="grid grid-cols-2 gap-4">
                        {supplierProducts.length > 0 ? (
                          supplierProducts.map(p => (
                            <div key={p.id} className="p-4 bg-white border border-[#ECEDEF] rounded-[24px] hover:border-[#111111] transition-all group cursor-pointer font-['Manrope']">
                              <div className="w-full aspect-square bg-[#F3F4F6] rounded-[16px] mb-4 overflow-hidden relative border border-[#ECEDEF]">
                                {p.image ? (
                                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[#8B93A7]">
                                    <Icon icon="solar:box-bold" className="text-[32px]" />
                                  </div>
                                )}
                                <div className="absolute top-2 right-2 px-2 py-1 bg-[#111111] text-white text-[9px] font-black rounded-[6px] uppercase">
                                   CAT: {p.category.slice(0, 3)}
                                </div>
                              </div>
                              <h4 className="text-[13px] font-black text-[#111111] group-hover:text-[#D40073] transition-colors truncate mb-1">{p.name}</h4>
                              <p className="text-[12px] font-black text-[#8B93A7]">GHS {p.price.toLocaleString()}</p>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-2 py-16 text-center bg-white border border-[#ECEDEF] border-dashed rounded-[24px]">
                            <p className="text-[13px] font-black text-[#8B93A7] uppercase tracking-widest">No products linked</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="px-8 py-6 border-t border-[#ECEDEF] bg-[#FBFBFC] flex items-center gap-4 shrink-0">
              <button 
                onClick={() => {
                  setEditingSupplier(supplier);
                  setAddSupplierModalOpen(true);
                }}
                className="flex-1 h-12 bg-[#111111] hover:bg-[#333333] text-white text-[13px] font-black uppercase tracking-widest rounded-[14px] transition-all active:scale-95 shadow-none"
              >
                Edit Profile
              </button>
              <button className="w-12 h-12 bg-white border border-[#ECEDEF] hover:bg-[#FEE2E2] hover:text-[#DC2626] hover:border-[#FEE2E2] text-[#525866] rounded-[14px] flex items-center justify-center transition-all active:scale-90">
                <Icon icon="solar:trash-bin-trash-bold" className="text-[22px]" />
              </button>
            </div>
          </motion.div>

          {/* Integrated Consignment Detail Modal */}
          <ConsignmentDetailsModal 
            consignment={selectedConsignment}
            onClose={() => setSelectedConsignment(null)}
          />
        </>
      )}
    </AnimatePresence>
  );
}
