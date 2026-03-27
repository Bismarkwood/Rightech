import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from '@iconify/react';
import { useRetailer, Supplier } from './RetailerContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../core/components/ui/dialog';
import { Input } from '../../../core/components/ui/input';
import { Label } from '../../../core/components/ui/label';

export function SuppliersTab() {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useRetailer();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  // New Supplier State
  const [newSupplier, setNewSupplier] = useState<Partial<Supplier>>({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    category: 'Cement',
    status: 'Active',
    address: '',
    rating: 5.0,
    totalOrders: 0,
    outstandingDebt: '0.00 GHS'
  });

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [suppliers, searchQuery]);

  const handleAddSupplier = () => {
    const supplierToAdd: Supplier = {
      ...newSupplier as Supplier,
      id: `SUP-${Math.floor(1000 + Math.random() * 9000)}`,
      logo: `https://api.dicebear.com/7.x/initials/svg?seed=${newSupplier.name}`
    };
    addSupplier(supplierToAdd);
    setIsAddModalOpen(false);
    setNewSupplier({
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      category: 'Cement',
      status: 'Active',
      address: '',
      rating: 5.0,
      totalOrders: 0,
      outstandingDebt: '0.00 GHS'
    });
  };

  const handleViewDetails = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative group w-full sm:w-[320px]">
          <Icon icon="solar:magnifer-linear" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B93A7] group-focus-within:text-[#D40073] transition-colors" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search suppliers..." 
            className="w-full h-11 pl-10 pr-4 bg-white border border-[#ECEDEF] rounded-[12px] text-[14px] font-medium text-[#111111] focus:outline-none focus:border-[#D40073] transition-all"
          />
        </div>
        
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="h-11 px-6 bg-[#111111] hover:bg-black text-white rounded-[12px] text-[14px] font-bold flex items-center gap-2 transition-all active:scale-95 shadow-none"
        >
          <Icon icon="solar:user-plus-bold" className="text-[18px]" />
          Add Supplier
        </button>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredSuppliers.map((supplier, index) => (
            <motion.div
              key={supplier.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleViewDetails(supplier)}
              className="bg-white border-2 border-[#ECEDEF] rounded-[24px] p-6 hover:border-[#D40073] transition-all cursor-pointer group flex flex-col gap-4 relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-[16px] overflow-hidden border-2 border-[#F7F7F8] bg-[#F7F7F8]">
                    <img src={supplier.logo} alt={supplier.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-[#111111] tracking-tight group-hover:text-[#D40073] transition-colors">{supplier.name}</h3>
                    <p className="text-[12px] font-medium text-[#8B93A7]">{supplier.category}</p>
                  </div>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  supplier.status === 'Active' ? 'bg-[#16A34A]/10 text-[#16A34A]' : 'bg-[#EF4444]/10 text-[#EF4444]'
                }`}>
                  {supplier.status}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="p-3 rounded-[16px] bg-[#F7F7F8] border border-transparent group-hover:bg-white group-hover:border-[#ECEDEF] transition-all">
                  <p className="text-[10px] font-black text-[#8B93A7] uppercase tracking-widest mb-1">Orders</p>
                  <p className="text-[15px] font-bold text-[#111111]">{supplier.totalOrders}</p>
                </div>
                <div className="p-3 rounded-[16px] bg-[#F7F7F8] border border-transparent group-hover:bg-white group-hover:border-[#ECEDEF] transition-all">
                  <p className="text-[10px] font-black text-[#8B93A7] uppercase tracking-widest mb-1">Debt</p>
                  <p className="text-[15px] font-bold text-[#EF4444]">{supplier.outstandingDebt}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#F7F7F8]">
                <div className="flex items-center gap-1.5">
                  <Icon icon="solar:star-bold" className="text-[#F59E0B] text-[16px]" />
                  <span className="text-[13px] font-bold text-[#111111]">{supplier.rating}</span>
                </div>
                <div className="flex items-center gap-2 text-[#8B93A7]">
                  <Icon icon="solar:phone-bold" className="text-[16px]" />
                  <span className="text-[12px] font-medium truncate max-w-[100px]">{supplier.phone}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Supplier Modal — Shadowless Refined Design */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden rounded-[32px] border border-[#ECEDEF] bg-white/95 backdrop-blur-2xl shadow-none">
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="p-8"
          >
            <DialogHeader className="mb-8">
              <div className="w-12 h-12 rounded-[20px] bg-[#111111] text-white flex items-center justify-center mb-4">
                <Icon icon="solar:user-plus-bold" className="text-[24px]" />
              </div>
              <DialogTitle className="text-[24px] font-black text-[#111111] tracking-tight">Onboard New Supplier</DialogTitle>
              <p className="text-[14px] font-medium text-[#8B93A7]">Enter the credentials of your new partnership</p>
            </DialogHeader>

            <div className="grid grid-cols-1 gap-5">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-black text-[#B0B7C3] uppercase tracking-[0.1em] pl-1">Supplier / Company Name</Label>
                <Input 
                  value={newSupplier.name}
                  onChange={e => setNewSupplier({...newSupplier, name: e.target.value})}
                  placeholder="e.g. West Coast Wood"
                  className="h-12 rounded-[16px] font-bold border-[#ECEDEF] focus:border-[#D40073] focus:ring-4 focus:ring-[#D40073]/5 shadow-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-black text-[#B0B7C3] uppercase tracking-[0.1em] pl-1">Contact Person</Label>
                  <Input 
                    value={newSupplier.contactPerson}
                    onChange={e => setNewSupplier({...newSupplier, contactPerson: e.target.value})}
                    placeholder="Full name"
                    className="h-12 rounded-[16px] font-bold border-[#ECEDEF] shadow-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-black text-[#B0B7C3] uppercase tracking-[0.1em] pl-1">Category</Label>
                  <select 
                    value={newSupplier.category}
                    onChange={e => setNewSupplier({...newSupplier, category: e.target.value})}
                    className="w-full h-12 rounded-[16px] border border-[#ECEDEF] bg-[#F7F7F8] px-4 text-[14px] font-bold focus:outline-none focus:border-[#D40073] transition-all appearance-none"
                  >
                    {['Cement', 'Steel', 'Wood', 'Paint', 'Electrical', 'Plumbing', 'Roofing'].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-black text-[#B0B7C3] uppercase tracking-[0.1em] pl-1">Phone Number</Label>
                  <Input 
                    value={newSupplier.phone}
                    onChange={e => setNewSupplier({...newSupplier, phone: e.target.value})}
                    placeholder="+233..."
                    className="h-12 rounded-[16px] font-bold border-[#ECEDEF] shadow-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-black text-[#B0B7C3] uppercase tracking-[0.1em] pl-1">Email Address</Label>
                  <Input 
                    value={newSupplier.email}
                    onChange={e => setNewSupplier({...newSupplier, email: e.target.value})}
                    placeholder="email@company.com"
                    className="h-12 rounded-[16px] font-bold border-[#ECEDEF] shadow-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[11px] font-black text-[#B0B7C3] uppercase tracking-[0.1em] pl-1">Office Address</Label>
                <textarea 
                  rows={2}
                  value={newSupplier.address}
                  onChange={e => setNewSupplier({...newSupplier, address: e.target.value})}
                  className="w-full rounded-[16px] border border-[#ECEDEF] bg-white p-4 text-[14px] font-medium focus:outline-none focus:border-[#D40073] transition-all resize-none shadow-none"
                  placeholder="Street name, City, Region..."
                />
              </div>

              <div className="flex gap-3 mt-4">
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 h-13 rounded-[18px] text-[15px] font-bold text-[#525866] hover:bg-[#F7F7F8] transition-all active:scale-95 border border-[#ECEDEF]"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddSupplier}
                  disabled={!newSupplier.name || !newSupplier.phone}
                  className="flex-[2] h-13 rounded-[18px] bg-[#111111] hover:bg-black text-white text-[15px] font-black flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icon icon="solar:check-circle-bold" className="text-[20px]" />
                  Create Partnership
                </button>
              </div>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>

      {/* Supplier Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="sm:max-w-[750px] p-0 overflow-hidden rounded-[40px] border border-[#ECEDEF] bg-white shadow-none">
          {selectedSupplier && (
            <div className="flex flex-col md:flex-row h-full">
              {/* Profile Background Side */}
              <div className="w-full md:w-[40%] bg-[#111111] p-10 flex flex-col relative text-white">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Icon icon={TABS_INFO[selectedSupplier.category]?.icon || 'solar:users-group-two-rounded-bold'} width={120} height={120} />
                </div>
                
                <div className="relative z-10">
                  <div className="w-20 h-20 rounded-[28px] bg-white border-4 border-white/20 overflow-hidden mb-6 shadow-2xl">
                    <img src={selectedSupplier.logo} alt={selectedSupplier.name} className="w-full h-full object-cover" />
                  </div>
                  <h2 className="text-[28px] font-black leading-tight tracking-tight mb-2">{selectedSupplier.name}</h2>
                  <p className="text-[14px] font-bold text-[#D40073] uppercase tracking-[0.2em] mb-8">{selectedSupplier.category} PARTNER</p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                        <Icon icon="solar:user-bold" className="text-[18px]" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest leading-none mb-1">Contact Person</p>
                        <p className="text-[14px] font-bold">{selectedSupplier.contactPerson}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                        <Icon icon="solar:phone-bold" className="text-[18px]" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest leading-none mb-1">Phone Number</p>
                        <p className="text-[14px] font-bold">{selectedSupplier.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-10">
                  <div className="p-4 rounded-[20px] bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none mb-1">Partner Rating</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Icon icon="solar:star-bold" className="text-[#F59E0B] text-[18px]" />
                        <span className="text-[18px] font-black">{selectedSupplier.rating}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none mb-1">Status</p>
                      <span className={`text-[12px] font-black mt-1 inline-block ${selectedSupplier.status === 'Active' ? 'text-[#16A34A]' : 'text-[#EF4444]'}`}>
                        {selectedSupplier.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Side */}
              <div className="flex-1 p-10 bg-[#F7F7F8]">
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-[24px] p-5 border border-[#ECEDEF]">
                      <Icon icon="solar:box-minimalistic-bold" className="text-[#D40073] text-[24px] mb-3" />
                      <p className="text-[28px] font-black text-[#111111] leading-none mb-1">{selectedSupplier.totalOrders}</p>
                      <p className="text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Total Orders</p>
                    </div>
                    <div className="bg-white rounded-[24px] p-5 border border-[#ECEDEF]">
                      <Icon icon="solar:bill-list-bold" className="text-[#EF4444] text-[24px] mb-3" />
                      <p className="text-[28px] font-black text-[#EF4444] leading-none mb-1">{selectedSupplier.outstandingDebt.split(' ')[0]}</p>
                      <p className="text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Outstanding Debt</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[12px] font-black text-[#111111] uppercase tracking-[0.15em] pl-1">Partner Information</h4>
                    <div className="bg-white rounded-[24px] p-6 border border-[#ECEDEF] space-y-5">
                      <div className="flex items-start gap-4">
                        <Icon icon="solar:letter-bold" className="text-[#8B93A7] mt-1 text-[18px]" />
                        <div className="min-w-0">
                          <p className="text-[11px] font-black text-[#B0B7C3] uppercase tracking-widest leading-none mb-1.5">Business Email</p>
                          <p className="text-[14px] font-semibold text-[#111111] truncate">{selectedSupplier.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <Icon icon="solar:map-point-bold" className="text-[#8B93A7] mt-1 text-[18px]" />
                        <div>
                          <p className="text-[11px] font-black text-[#B0B7C3] uppercase tracking-widest leading-none mb-1.5">Primary Location</p>
                          <p className="text-[14px] font-semibold text-[#111111] leading-relaxed">{selectedSupplier.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button className="flex-1 h-12 rounded-[16px] bg-[#111111] text-white font-bold text-[14px] flex items-center justify-center gap-2 hover:bg-black transition-all">
                      <Icon icon="solar:cart-large-bold" />
                      Place Restock Order
                    </button>
                    <button className="w-12 h-12 rounded-[16px] bg-white border border-[#ECEDEF] flex items-center justify-center text-[#111111] hover:bg-[#F7F7F8] transition-all">
                      <Icon icon="solar:pen-new-square-bold" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

const TABS_INFO: Record<string, { icon: string }> = {
  'Cement': { icon: 'solar:box-bold' },
  'Steel': { icon: 'solar:layers-bold' },
  'Wood': { icon: 'solar:tree-bold' },
  'Paint': { icon: 'solar:palet-bold' },
  'Electrical': { icon: 'solar:plug-circle-bold' },
  'Plumbing': { icon: 'solar:piping-bold' },
  'Roofing': { icon: 'solar:home-bold' },
};
