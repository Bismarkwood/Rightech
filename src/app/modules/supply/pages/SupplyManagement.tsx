import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Filter, Plus,
  MoreHorizontal, Download, ArrowUpRight, Box
} from 'lucide-react';
import { Icon } from '@iconify/react';
import { useSuppliers, Supplier } from '../context/SupplierContext';
import { useConsignment } from '../../consignment/context/ConsignmentContext';
import { useProducts } from '../../products/context/ProductContext';
import { SupplierDetailDrawer } from '../components/SupplierDetailDrawer';
import { SupplyAddSupplierModal } from '../components/SupplyAddSupplierModal';

const MOCK_CONSIGNMENTS = [
  { id: 'CON-8932', supplier: 'Global Tech Electronics', items: 450, value: '$32,000', status: 'In Transit', eta: 'Tomorrow, 14:00', origin: 'Shenzhen, China', destination: 'Accra Central', mode: 'Sea Freight' },
  { id: 'CON-8933', supplier: 'NextGen Mobile Solutions', items: 1200, value: '$85,000', status: 'Customs Clearance', eta: 'Oct 28', origin: 'Dubai, UAE', destination: 'Tema Port', mode: 'Air Freight' },
  { id: 'CON-8934', supplier: 'Premium Appliance Hub', items: 32, value: '$12,850', status: 'Delivered', eta: 'Delivered Yesterday', origin: 'Lagos, Nigeria', destination: 'Kumasi Hub', mode: 'Road Freight' },
  { id: 'CON-8935', supplier: 'QuickSpares Auto', items: 210, value: '$15,400', status: 'Pending', eta: 'Nov 02', origin: 'Johannesburg, SA', destination: 'Takoradi Hub', mode: 'Road Freight' },
];


export default function SupplyManagement() {
  const { suppliers, setAddSupplierModalOpen } = useSuppliers();
  const { inboundConsignments } = useConsignment();
  const [activeTab, setActiveTab] = useState('Suppliers');
  const navigate = useNavigate();
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  return (
    <div className="flex flex-col h-full w-full bg-[#F7F7F8] relative min-h-0">

      {/* ── Page Header (Product-style) ── */}
      <div className="bg-white border-b border-[#ECEDEF] px-8 pt-6 shrink-0">
        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-[11px] bg-[#111111] text-white flex items-center justify-center">
                <Icon icon="solar:box-minimalistic-bold-duotone" className="text-[18px]" />
              </div>
              <h1 className="text-[24px] font-black text-[#111111] tracking-tight">Supply Management</h1>
            </div>
            <p className="text-[13px] font-medium text-[#8B93A7] mt-0.5 ml-0.5">
              Manage suppliers, consignments, and incoming shipments.
            </p>
          </div>
          <div className="flex items-center gap-3 mb-1">
            <button className="h-10 px-4 bg-white border border-[#E4E7EC] text-[#111111] text-[13px] font-bold rounded-[10px] flex items-center gap-2 hover:bg-[#F3F4F6] transition-colors">
              <Download size={16} />
              Export
            </button>
            <button
              onClick={() => setAddSupplierModalOpen(true)}
              className="h-10 px-5 bg-[#D40073] hover:bg-[#B80063] text-white text-[13px] font-bold rounded-[10px] flex items-center gap-2 transition-colors"
            >
              <Plus size={15} />
              Add Supplier
            </button>
          </div>
        </div>

        {/* Tab Nav */}
        <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
          {['Suppliers', 'Catalog'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-[14px] font-bold whitespace-nowrap transition-colors relative ${
                activeTab === tab ? 'text-[#D40073]' : 'text-[#8B93A7] hover:text-[#111111]'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="supplyTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#D40073] rounded-t-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
          {activeTab === 'Suppliers' && (
            <div className="bg-white rounded-[22px] border border-[#ECEDEF] overflow-hidden">
              <div className="p-4 border-b border-[#ECEDEF] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative max-w-md w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B93A7]" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search suppliers by name or ID..."
                    className="w-full pl-10 pr-4 h-[40px] bg-[#F7F7F8] border border-[#ECEDEF] rounded-[12px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#D40073]/20 focus:border-[#D40073] transition-all"
                  />
                </div>
                <button className="h-[40px] px-4 flex items-center justify-center gap-2 bg-white border border-[#E4E7EC] rounded-[12px] text-[14px] font-semibold text-[#111111] hover:bg-[#F3F4F6] transition-colors">
                  <Filter size={16} />
                  Filters
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#ECEDEF]">
                      <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Supplier</th>
                      <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Status</th>
                      <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Consignments</th>
                      <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Outstanding Balance</th>
                      <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Last Delivery</th>
                      <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ECEDEF]">
                    {suppliers.map((supplier) => (
                      <tr 
                        key={supplier.id} 
                        onClick={() => setSelectedSupplier(supplier)}
                        className="hover:bg-[#F7F7F8] transition-colors group cursor-pointer"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#111111] font-bold shrink-0">
                              {supplier.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-[14px] font-bold text-[#111111]">{supplier.name}</p>
                              <p className="text-[13px] text-[#525866]">{supplier.id} • {supplier.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex px-2.5 py-1 rounded-[6px] text-[12px] font-bold ${
                            supplier.status === 'Verified' ? 'bg-[#ECFDF5] text-[#059669]' : 
                            supplier.status === 'Pending' ? 'bg-[#FFFBEB] text-[#D97706]' : 
                            'bg-[#F3F4F6] text-[#525866]'
                          }`}>
                            {supplier.status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-[14px] font-bold text-[#111111]">{supplier.totalConsignments}</p>
                          <p className="text-[13px] text-[#525866]">
                            {inboundConsignments.filter(c => c.partnerId === supplier.id).length} consignments
                          </p>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-[14px] font-bold text-[#111111]">GHS {supplier.rating * 1000}</p>
                        </td>
                        <td className="py-4 px-6 text-[13px] text-[#525866]">
                          Recently
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#525866] hover:bg-white hover:shadow-sm hover:text-[#111111] transition-all border border-transparent hover:border-[#ECEDEF]">
                              <ArrowUpRight size={16} />
                            </button>
                            <button className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#525866] hover:bg-white hover:shadow-sm hover:text-[#111111] transition-all border border-transparent hover:border-[#ECEDEF]">
                              <MoreHorizontal size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Catalog' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {useProducts().products.map(product => {
                const supplier = useSuppliers().suppliers.find(s => s.id === product.supplierId);
                return (
                  <div key={product.id} className="bg-white rounded-[22px] border border-[#ECEDEF] p-4 group hover:border-[#D40073] transition-all">
                    <div className="aspect-square rounded-[14px] bg-[#F7F7F8] mb-4 overflow-hidden relative">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#8B93A7]">
                          <Box size={32} />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-[6px] text-[10px] font-bold border border-[#ECEDEF]">
                        {product.status}
                      </div>
                    </div>
                    <h3 className="text-[14px] font-bold text-[#111111] mb-1 truncate">{product.name}</h3>
                    <p className="text-[12px] text-[#525866] mb-3">{supplier?.name || 'Unknown Supplier'}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-[14px] font-black text-[#D40073]">GHS {product.price}</p>
                      <p className="text-[12px] font-bold text-[#111111]">{product.stock} in stock</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {activeTab === 'Payments' && (
            <div className="bg-white rounded-[22px] border border-[#ECEDEF] p-16 text-center">
              <h3 className="text-[18px] font-bold text-[#111111] mb-2">Payment Status</h3>
              <p className="text-[14px] text-[#525866]">Supplier payment tracking features go here.</p>
            </div>
          )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Add Supplier Modal */}
      <SupplyAddSupplierModal />

      {/* Supplier Detail Drawer */}
      <SupplierDetailDrawer
        supplier={selectedSupplier}
        onClose={() => setSelectedSupplier(null)}
      />
    </div>
  );
}