import React, { useState } from 'react';
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

export function AddSupplierModal() {
  const { isAddSupplierModalOpen, setAddSupplierModalOpen, addSupplier } = useRetailer();
  
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

  const handleAddSupplier = () => {
    const supplierToAdd: Supplier = {
      ...newSupplier as Supplier,
      id: `SUP-${Math.floor(1000 + Math.random() * 9000)}`,
      logo: `https://api.dicebear.com/7.x/initials/svg?seed=${newSupplier.name}`
    };
    addSupplier(supplierToAdd);
    setAddSupplierModalOpen(false);
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

  return (
    <Dialog open={isAddSupplierModalOpen} onOpenChange={setAddSupplierModalOpen}>
      <DialogContent className="sm:max-w-[500px] border-none bg-white/90 backdrop-blur-xl rounded-[28px] p-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D40073] via-[#FF4D94] to-[#D40073]" />
        
        <DialogHeader className="px-8 pt-8 pb-4">
          <DialogTitle className="text-[24px] font-black text-[#111111] tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-[#D40073]/10 flex items-center justify-center">
              <Icon icon="solar:user-plus-bold" className="text-[#D40073] text-[22px]" />
            </div>
            Onboard New Supplier
          </DialogTitle>
          <p className="text-[14px] font-medium text-[#8B93A7] mt-1">Register a new partner to your supply network.</p>
        </DialogHeader>

        <div className="px-8 py-4 space-y-5 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 gap-5">
            <div className="space-y-2">
              <Label className="text-[12px] font-black text-[#111111] uppercase tracking-widest ml-1">Company Name</Label>
              <Input 
                placeholder="e.g. Dangote Cement" 
                value={newSupplier.name}
                onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
                className="h-12 bg-[#F7F7F8] border-2 border-transparent focus:border-[#D40073] rounded-[14px] px-4 font-bold text-[14px] transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[12px] font-black text-[#111111] uppercase tracking-widest ml-1">Contact Person</Label>
                <Input 
                  placeholder="Full name" 
                  value={newSupplier.contactPerson}
                  onChange={(e) => setNewSupplier({...newSupplier, contactPerson: e.target.value})}
                  className="h-12 bg-[#F7F7F8] border-2 border-transparent focus:border-[#D40073] rounded-[14px] px-4 font-bold text-[14px] transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[12px] font-black text-[#111111] uppercase tracking-widest ml-1">Category</Label>
                <select 
                  value={newSupplier.category}
                  onChange={(e) => setNewSupplier({...newSupplier, category: e.target.value})}
                  className="w-full h-12 bg-[#F7F7F8] border-2 border-transparent focus:border-[#D40073] rounded-[14px] px-4 font-bold text-[14px] transition-all outline-none appearance-none"
                >
                  <option value="Cement">Cement</option>
                  <option value="Steel">Steel</option>
                  <option value="Paint">Paint</option>
                  <option value="Roofing">Roofing</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Wood">Wood</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[12px] font-black text-[#111111] uppercase tracking-widest ml-1">Phone Number</Label>
                <div className="relative">
                  <Icon icon="solar:phone-bold" className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B93A7]" />
                  <Input 
                    placeholder="+233..." 
                    value={newSupplier.phone}
                    onChange={(e) => setNewSupplier({...newSupplier, phone: e.target.value})}
                    className="h-12 pl-11 bg-[#F7F7F8] border-2 border-transparent focus:border-[#D40073] rounded-[14px] font-bold text-[14px] transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[12px] font-black text-[#111111] uppercase tracking-widest ml-1">Email Address</Label>
                <div className="relative">
                  <Icon icon="solar:letter-bold" className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B93A7]" />
                  <Input 
                    type="email"
                    placeholder="company@email.com" 
                    value={newSupplier.email}
                    onChange={(e) => setNewSupplier({...newSupplier, email: e.target.value})}
                    className="h-12 pl-11 bg-[#F7F7F8] border-2 border-transparent focus:border-[#D40073] rounded-[14px] font-bold text-[14px] transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[12px] font-black text-[#111111] uppercase tracking-widest ml-1">Business Address</Label>
              <div className="relative">
                <Icon icon="solar:map-point-bold" className="absolute left-4 top-4 text-[#8B93A7]" />
                <textarea 
                  placeholder="Enter physical address..." 
                  value={newSupplier.address}
                  onChange={(e) => setNewSupplier({...newSupplier, address: e.target.value})}
                  className="w-full min-h-[100px] bg-[#F7F7F8] border-2 border-transparent focus:border-[#D40073] rounded-[20px] p-4 pl-11 font-bold text-[14px] transition-all outline-none resize-none placeholder:font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 bg-[#F7F7F8]/50 flex gap-3">
          <button 
            onClick={() => setAddSupplierModalOpen(false)}
            className="flex-1 h-14 rounded-[18px] text-[15px] font-bold text-[#525866] hover:bg-[#ECEDEF] transition-all active:scale-95"
          >
            Cancel
          </button>
          <button 
            onClick={handleAddSupplier}
            disabled={!newSupplier.name || !newSupplier.phone}
            className="flex-[2] h-14 bg-[#111111] hover:bg-black text-white rounded-[18px] text-[15px] font-bold transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 disabled:hover:bg-[#111111]"
          >
            Complete Onboarding
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
