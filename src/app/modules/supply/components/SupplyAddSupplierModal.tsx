import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from '@iconify/react';
import { useSuppliers, VettingStatus } from '../context/SupplierContext';
import { X } from 'lucide-react';

export function SupplyAddSupplierModal() {
  const { 
    isAddSupplierModalOpen, 
    setAddSupplierModalOpen, 
    addSupplier, 
    editingSupplier, 
    setEditingSupplier, 
    updateSupplier 
  } = useSuppliers();

  const emptyForm = {
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    category: 'Electronics',
    status: 'Pending' as VettingStatus,
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (editingSupplier) {
      setForm({
        name: editingSupplier.name,
        contactPerson: editingSupplier.contactPerson,
        phone: editingSupplier.phone,
        email: editingSupplier.email,
        category: editingSupplier.category,
        status: editingSupplier.status,
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingSupplier]);

  const handleSubmit = () => {
    if (!form.name.trim() || !form.phone.trim()) return;
    
    if (editingSupplier) {
      updateSupplier(editingSupplier.id, form);
    } else {
      addSupplier(form);
    }

    setForm(emptyForm);
    setEditingSupplier(null);
    setAddSupplierModalOpen(false);
  };

  const handleClose = () => {
    setForm(emptyForm);
    setEditingSupplier(null);
    setAddSupplierModalOpen(false);
  };

  return (
    <AnimatePresence>
      {isAddSupplierModalOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[520px] bg-white rounded-[24px] border border-[#ECEDEF] z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-[#ECEDEF] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center ${editingSupplier ? 'bg-[#2563EB]/10' : 'bg-[#D40073]/10'}`}>
                  <Icon icon={editingSupplier ? "solar:user-speak-bold" : "solar:user-plus-bold"} className={editingSupplier ? "text-[#2563EB] text-[18px]" : "text-[#D40073] text-[18px]"} />
                </div>
                <div>
                  <h2 className="text-[16px] font-bold text-[#111111]">{editingSupplier ? 'Edit Supplier Profile' : 'Add New Supplier'}</h2>
                  <p className="text-[12px] text-[#8B93A7]">{editingSupplier ? 'Update partner information and contact details' : 'Register a new partner to your supply network'}</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#8B93A7] hover:bg-[#F3F4F6] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-4">
              {/* Company Name */}
              <div>
                <label className="block text-[12px] font-semibold text-[#525866] mb-1.5">Company Name *</label>
                <input
                  type="text"
                  placeholder="e.g. TechFlow Global"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full h-10 px-3 bg-[#F7F7F8] border border-[#ECEDEF] rounded-[10px] text-[13px] font-medium focus:outline-none focus:border-[#D40073] focus:ring-2 focus:ring-[#D40073]/10 transition-all"
                />
              </div>

              {/* Contact Person + Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-[#525866] mb-1.5">Contact Person</label>
                  <input
                    type="text"
                    placeholder="Full name"
                    value={form.contactPerson}
                    onChange={e => setForm({ ...form, contactPerson: e.target.value })}
                    className="w-full h-10 px-3 bg-[#F7F7F8] border border-[#ECEDEF] rounded-[10px] text-[13px] font-medium focus:outline-none focus:border-[#D40073] focus:ring-2 focus:ring-[#D40073]/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#525866] mb-1.5">Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full h-10 px-3 bg-[#F7F7F8] border border-[#ECEDEF] rounded-[10px] text-[13px] font-medium focus:outline-none focus:border-[#D40073] transition-all appearance-none"
                  >
                    {['Electronics', 'Hardware', 'Logistics', 'Appliances', 'FMCG', 'Other'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Phone + Email */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-[#525866] mb-1.5">Phone *</label>
                  <input
                    type="tel"
                    placeholder="+233 00 000 0000"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full h-10 px-3 bg-[#F7F7F8] border border-[#ECEDEF] rounded-[10px] text-[13px] font-medium focus:outline-none focus:border-[#D40073] focus:ring-2 focus:ring-[#D40073]/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#525866] mb-1.5">Email</label>
                  <input
                    type="email"
                    placeholder="contact@company.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full h-10 px-3 bg-[#F7F7F8] border border-[#ECEDEF] rounded-[10px] text-[13px] font-medium focus:outline-none focus:border-[#D40073] focus:ring-2 focus:ring-[#D40073]/10 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[#ECEDEF] bg-[#FAFBFC] flex items-center justify-end gap-3">
              <button
                onClick={handleClose}
                className="h-9 px-5 rounded-[10px] text-[13px] font-medium text-[#525866] hover:bg-[#ECEDEF] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!form.name.trim() || !form.phone.trim()}
                className={`h-9 px-5 rounded-[10px] text-[13px] font-bold text-white transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center gap-2 ${
                  editingSupplier ? 'bg-[#2563EB] hover:bg-[#1D4ED8]' : 'bg-[#D40073] hover:bg-[#B80063]'
                }`}
              >
                <Icon icon={editingSupplier ? "solar:check-read-bold" : "solar:user-plus-bold"} className="text-[15px]" />
                {editingSupplier ? 'Update Supplier' : 'Add Supplier'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
