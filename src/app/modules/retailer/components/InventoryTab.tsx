import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from '@iconify/react';
import * as Dialog from '@radix-ui/react-dialog';

import { useRetailer, type InventoryItem } from './RetailerContext';

const CATEGORIES = ['Building Materials', 'Steel', 'Cement', 'Roofing', 'Paint', 'Plumbing', 'Electrical', 'Other'];

export function InventoryTab() {
  const { inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem } = useRetailer();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdateStockOpen, setIsUpdateStockOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // Form states
  const [itemForm, setItemForm] = useState<Partial<InventoryItem>>({});
  const [stockDelta, setStockDelta] = useState<number>(0);

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = () => {
    if (itemToDelete) {
      deleteInventoryItem(itemToDelete);
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const openViewModal = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsViewModalOpen(true);
  };

  const openCreateModal = () => {
    setItemForm({
      name: '',
      category: CATEGORIES[0],
      stock: 0,
      minStock: 10,
      price: '0 GHS',
      image: '',
      description: '',
    });
    setIsCreateModalOpen(true);
  };

  const openEditModal = (item: InventoryItem) => {
    setSelectedItem(item);
    setItemForm({ ...item });
    setIsViewModalOpen(false);
    setIsEditModalOpen(true);
  };

  const openUpdateStockModal = (item: InventoryItem) => {
    setSelectedItem(item);
    setStockDelta(0);
    setIsViewModalOpen(false);
    setIsUpdateStockOpen(true);
  };

  const handleCreate = () => {
    const stock = Number(itemForm.stock) || 0;
    const lowStockThreshold = Number(itemForm.minStock) || 0;
    const priceStr = itemForm.price || '0';
    const price = Number(priceStr.replace(/[^0-9.]/g, '')) || 0;

    addInventoryItem({
      name: itemForm.name,
      category: itemForm.category as any,
      stock,
      lowStockThreshold,
      price,
      image: itemForm.image,
      description: itemForm.description,
      status: (stock <= 0 ? 'Out of Stock' : stock <= lowStockThreshold ? 'Low Stock' : 'In Stock') as any
    });
    setIsCreateModalOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setItemForm(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = () => {
    if (selectedItem) {
      const priceStr = itemForm.price || '0';
      const price = typeof priceStr === 'string' ? Number(priceStr.replace(/[^0-9.]/g, '')) : priceStr;
      
      updateInventoryItem(selectedItem.id, {
        ...itemForm,
        price: Number(price) || 0,
        lowStockThreshold: itemForm.minStock,
      } as any);
      setIsEditModalOpen(false);
    }
  };

  const handleStockUpdate = () => {
    if (selectedItem) {
      const newStock = Math.max(0, selectedItem.stock + stockDelta);
      updateInventoryItem(selectedItem.id, { stock: newStock });
      setIsUpdateStockOpen(false);
    }
  };

  const openDeleteModal = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="bg-white rounded-[16px] border border-[#ECEDEF] flex flex-col min-h-[600px]">
      {/* Header */}
      <div className="p-4 border-b border-[#ECEDEF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative group w-full sm:w-[320px]">
          <Icon icon="solar:magnifer-linear" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B93A7] group-focus-within:text-[#D40073] transition-colors text-[18px]" />
          <input 
            type="text" 
            placeholder="Search inventory..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-[#F7F7F8] border border-transparent rounded-[8px] text-[13px] text-[#111111] placeholder:text-[#8B93A7] focus:outline-none focus:bg-white focus:border-[#D40073] focus:ring-[3px] focus:ring-[rgba(212,0,115,0.1)] transition-all font-medium"
          />
        </div>
        <button 
          onClick={openCreateModal}
          className="h-[40px] px-4 flex items-center gap-2 bg-[#111111] hover:bg-[#D40073] text-white rounded-[10px] text-[13px] font-semibold transition-all active:scale-95"
        >
          <Icon icon="solar:add-circle-bold" className="text-[18px]" />
          Add Item
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F7F7F8] border-b border-[#ECEDEF]">
              <th className="py-3 px-5 text-[12px] font-bold text-[#525866] uppercase tracking-wider">Item Details</th>
              <th className="py-3 px-5 text-[12px] font-bold text-[#525866] uppercase tracking-wider">Category</th>
              <th className="py-3 px-5 text-[12px] font-bold text-[#525866] uppercase tracking-wider">Stock Level</th>
              <th className="py-3 px-5 text-[12px] font-bold text-[#525866] uppercase tracking-wider">Price</th>
              <th className="py-3 px-5 text-[12px] font-bold text-[#525866] uppercase tracking-wider">Status</th>
              <th className="py-3 px-5 text-[12px] font-bold text-[#525866] uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-[13px]">
            {filteredInventory.map((item) => (
              <tr 
                key={item.id} 
                onClick={() => openViewModal(item)}
                className="border-b border-[#ECEDEF] last:border-0 hover:bg-[#FBFBFC] transition-colors cursor-pointer group"
              >
                <td className="py-4 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[8px] overflow-hidden bg-[#F3F4F6] flex-shrink-0 border border-[#ECEDEF]">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#8B93A7]">
                          <Icon icon="solar:box-linear" className="text-[20px]" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-[#111111] line-clamp-1">{item.name}</div>
                      <div className="text-[12px] text-[#8B93A7] font-medium">{item.id}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-5 font-semibold text-[#525866]">{item.category}</td>
                <td className="py-4 px-5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#111111]">{item.stock}</span>
                    <span className="text-[12px] text-[#8B93A7]">/ {item.minStock} min</span>
                  </div>
                  {/* Progress bar for stock visually */}
                  <div className="w-full max-w-[100px] h-1.5 bg-[#ECEDEF] rounded-full mt-1.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${item.stock === 0 ? 'bg-[#EF4444]' : item.stock <= item.minStock ? 'bg-[#F59E0B]' : 'bg-[#10B981]'}`}
                      style={{ width: `${Math.min(100, (item.stock / (item.minStock * 3)) * 100)}%` }}
                    />
                  </div>
                </td>
                <td className="py-4 px-5 font-bold text-[#111111]">{item.price}</td>
                <td className="py-4 px-5">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[12px] font-bold ${
                    item.status === 'In Stock' ? 'bg-[#ECFDF3] text-[#16A34A]' :
                    item.status === 'Low Stock' ? 'bg-[#FFF7ED] text-[#D97706]' :
                    'bg-[#FEF2F2] text-[#DC2626]'
                  }`}>
                    {item.status === 'In Stock' && <Icon icon="solar:check-circle-bold" />}
                    {item.status === 'Low Stock' && <Icon icon="solar:danger-triangle-bold" />}
                    {item.status === 'Out of Stock' && <Icon icon="solar:close-circle-bold" />}
                    {item.status}
                  </span>
                </td>
                <td className="py-4 px-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => openViewModal(item)}
                      className="w-8 h-8 flex items-center justify-center text-[#8B93A7] hover:text-[#111111] hover:bg-[#F3F4F6] rounded-[8px] transition-colors"
                      title="View Details"
                    >
                      <Icon icon="solar:eye-linear" className="text-[18px]" />
                    </button>
                    <button 
                      onClick={(e) => openDeleteModal(item.id, e)}
                      className="w-8 h-8 flex items-center justify-center text-[#8B93A7] hover:text-[#EF4444] hover:bg-[#FEF2F2] rounded-[8px] transition-colors"
                      title="Delete Item"
                    >
                      <Icon icon="solar:trash-bin-trash-linear" className="text-[18px]" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredInventory.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-[#8B93A7] font-medium">
                  No inventory items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Details Modal */}
      <Dialog.Root open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <AnimatePresence>
          {isViewModalOpen && selectedItem && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-[24px] p-6 z-50 border border-[#ECEDEF] focus:outline-none"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-[12px] overflow-hidden bg-[#F7F7F8] border border-[#ECEDEF] flex-shrink-0">
                        {selectedItem.image ? (
                          <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#8B93A7]">
                            <Icon icon="solar:box-linear" className="text-[28px]" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h2 className="text-[20px] font-bold text-[#111111] tracking-tight">{selectedItem.name}</h2>
                        <p className="text-[13px] text-[#525866] font-medium mt-1">ID: {selectedItem.id} • {selectedItem.category}</p>
                      </div>
                    </div>
                    <Dialog.Close asChild>
                      <button className="w-8 h-8 flex items-center justify-center text-[#8B93A7] hover:bg-[#F3F4F6] rounded-full transition-colors">
                        <Icon icon="solar:close-circle-linear" className="text-[20px]" />
                      </button>
                    </Dialog.Close>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3.5 bg-[#F7F7F8] rounded-[14px]">
                      <span className="text-[13px] text-[#525866] font-semibold">Current Stock</span>
                      <span className="text-[14px] font-extrabold text-[#111111]">{selectedItem.stock} units</span>
                    </div>
                    <div className="flex items-center justify-between p-3.5 bg-[#F7F7F8] rounded-[14px]">
                      <span className="text-[13px] text-[#525866] font-semibold">Minimum Threshold</span>
                      <span className="text-[14px] font-extrabold text-[#111111]">{selectedItem.minStock} units</span>
                    </div>
                    <div className="flex items-center justify-between p-3.5 bg-[#F7F7F8] rounded-[14px]">
                      <span className="text-[13px] text-[#525866] font-semibold">Unit Price</span>
                      <span className="text-[14px] font-extrabold text-[#111111]">{selectedItem.price}</span>
                    </div>
                    <div className="flex items-center justify-between p-3.5 bg-[#F7F7F8] rounded-[14px]">
                      <span className="text-[13px] text-[#525866] font-semibold">Status</span>
                      <span className={`text-[13px] font-bold px-2 py-0.5 rounded-full ${
                        selectedItem.status === 'In Stock' ? 'bg-[#ECFDF3] text-[#16A34A]' :
                        selectedItem.status === 'Low Stock' ? 'bg-[#FFF7ED] text-[#D97706]' :
                        'bg-[#FEF2F2] text-[#DC2626]'
                      }`}>
                        {selectedItem.status}
                      </span>
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => openEditModal(selectedItem)}
                      className="h-11 bg-[#F3F4F6] hover:bg-[#E4E7EC] text-[#111111] rounded-[12px] font-bold text-[14px] transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Icon icon="solar:pen-bold" />
                      Edit Details
                    </button>
                    <button 
                      onClick={() => openUpdateStockModal(selectedItem)}
                      className="h-11 bg-[#111111] hover:bg-[#333333] text-white rounded-[12px] font-bold text-[14px] transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Icon icon="solar:box-bold" />
                      Update Stock
                    </button>
                  </div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>

      {/* Create / Edit Modal */}
      <Dialog.Root open={isCreateModalOpen || isEditModalOpen} onOpenChange={(v) => !v && (setIsCreateModalOpen(false), setIsEditModalOpen(false))}>
        <AnimatePresence>
          {(isCreateModalOpen || isEditModalOpen) && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-[28px] overflow-hidden z-50 border border-[#ECEDEF] focus:outline-none flex flex-col max-h-[90vh]"
                >
                  <div className="p-6 border-b border-[#ECEDEF] flex items-center justify-between bg-white shrink-0">
                    <div>
                      <h2 className="text-[20px] font-bold text-[#111111] tracking-tight">{isCreateModalOpen ? 'Add New Item' : 'Edit Item Details'}</h2>
                      <p className="text-[13px] text-[#525866] font-medium mt-0.5">{isCreateModalOpen ? 'Register a new product to your inventory' : `Modify ${selectedItem?.id}`}</p>
                    </div>
                    <Dialog.Close asChild>
                      <button className="w-10 h-10 flex items-center justify-center text-[#8B93A7] hover:bg-[#F3F4F6] rounded-full transition-colors">
                        <Icon icon="solar:close-circle-linear" className="text-[22px]" />
                      </button>
                    </Dialog.Close>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#FBFBFC]">
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-bold text-[#525866] uppercase tracking-wider">Item Name</label>
                      <input 
                        type="text" 
                        value={itemForm.name}
                        onChange={e => setItemForm({...itemForm, name: e.target.value})}
                        placeholder="e.g. Portland Cement" 
                        className="w-full h-11 px-4 bg-white border border-[#E4E7EC] rounded-[12px] text-[14px] font-semibold text-[#111111] focus:outline-none focus:border-[#D40073] focus:ring-[3px] focus:ring-[#D40073]/5 transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[12px] font-bold text-[#525866] uppercase tracking-wider">Category</label>
                        <select 
                          value={itemForm.category}
                          onChange={e => setItemForm({...itemForm, category: e.target.value})}
                          className="w-full h-11 px-4 bg-white border border-[#E4E7EC] rounded-[12px] text-[14px] font-semibold text-[#111111] focus:outline-none focus:border-[#D40073] transition-all appearance-none cursor-pointer"
                        >
                          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[12px] font-bold text-[#525866] uppercase tracking-wider">Unit Price</label>
                        <input 
                          type="text" 
                          value={itemForm.price}
                          onChange={e => setItemForm({...itemForm, price: e.target.value})}
                          placeholder="e.g. 85 GHS" 
                          className="w-full h-11 px-4 bg-white border border-[#E4E7EC] rounded-[12px] text-[14px] font-semibold text-[#111111] focus:outline-none focus:border-[#D40073] transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[12px] font-bold text-[#525866] uppercase tracking-wider">Stock Level</label>
                        <input 
                          type="number" 
                          value={itemForm.stock}
                          onChange={e => setItemForm({...itemForm, stock: Number(e.target.value)})}
                          className="w-full h-11 px-4 bg-white border border-[#E4E7EC] rounded-[12px] text-[14px] font-semibold text-[#111111] focus:outline-none focus:border-[#D40073] transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[12px] font-bold text-[#525866] uppercase tracking-wider">Min Threshold</label>
                        <input 
                          type="number" 
                          value={itemForm.minStock}
                          onChange={e => setItemForm({...itemForm, minStock: Number(e.target.value)})}
                          className="w-full h-11 px-4 bg-white border border-[#E4E7EC] rounded-[12px] text-[14px] font-semibold text-[#111111] focus:outline-none focus:border-[#D40073] transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="text-[12px] font-bold text-[#525866] uppercase tracking-wider">Product Image</label>
                        <div 
                          onClick={() => document.getElementById('inventory-image-upload')?.click()}
                          className="relative group cursor-pointer"
                        >
                          <div className="w-full h-24 border-2 border-dashed border-[#E4E7EC] hover:border-[#D40073] hover:bg-[#D40073]/5 rounded-[16px] transition-all flex flex-col items-center justify-center gap-1 text-[#8B93A7] hover:text-[#D40073]">
                            <Icon icon="solar:camera-add-bold" className="text-[24px]" />
                            <span className="text-[12px] font-bold">Click to Upload Image</span>
                          </div>
                          <input 
                            id="inventory-image-upload"
                            type="file" 
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </div>
                      </div>

                      <AnimatePresence>
                        {itemForm.image && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.9, height: 0 }}
                            animate={{ opacity: 1, scale: 1, height: 'auto' }}
                            exit={{ opacity: 0, scale: 0.9, height: 0 }}
                            className="relative group mt-2"
                          >
                            <div className="relative aspect-video rounded-[16px] overflow-hidden bg-[#F7F7F8] border border-[#ECEDEF]">
                              <img 
                                src={itemForm.image} 
                                alt="Preview" 
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    document.getElementById('inventory-image-upload')?.click();
                                  }}
                                  className="w-10 h-10 rounded-full bg-white text-[#111111] border border-[#ECEDEF] flex items-center justify-center hover:scale-110 transition-transform"
                                >
                                  <Icon icon="solar:pen-bold" />
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setItemForm(prev => ({ ...prev, image: '' }));
                                  }}
                                  className="w-10 h-10 rounded-full bg-white text-[#EF4444] border border-[#ECEDEF] flex items-center justify-center hover:scale-110 transition-transform"
                                >
                                  <Icon icon="solar:trash-bin-trash-bold" />
                                </button>
                              </div>
                            </div>
                            <div className="absolute top-3 right-3 px-2.5 py-1 bg-[#111111]/80 backdrop-blur-md rounded-full text-[10px] text-white font-black tracking-widest">
                              READY FOR UPLOAD
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="p-6 border-t border-[#ECEDEF] bg-white flex gap-3 shrink-0">
                    <button 
                      onClick={() => isCreateModalOpen ? setIsCreateModalOpen(false) : setIsEditModalOpen(false)}
                      className="flex-1 h-11 bg-[#F3F4F6] hover:bg-[#E4E7EC] text-[#111111] rounded-[12px] font-bold text-[14px] transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={isCreateModalOpen ? handleCreate : handleUpdate}
                      className="flex-1 h-11 bg-[#D40073] hover:bg-[#B80063] text-white rounded-[12px] font-bold text-[14px] transition-all active:scale-[0.98]"
                    >
                      {isCreateModalOpen ? 'Create Item' : 'Save Changes'}
                    </button>
                  </div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>

      {/* Update Stock Modal */}
      <Dialog.Root open={isUpdateStockOpen} onOpenChange={setIsUpdateStockOpen}>
        <AnimatePresence>
          {isUpdateStockOpen && selectedItem && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-[28px] p-6 z-50 border border-[#ECEDEF] focus:outline-none text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-[#D40073]/10 flex items-center justify-center mx-auto mb-4 text-[#D40073]">
                    <Icon icon="solar:box-bold" className="text-[32px]" />
                  </div>
                  <h2 className="text-[20px] font-bold text-[#111111] mb-1">Update Stock Levels</h2>
                  <p className="text-[13px] text-[#525866] mb-8 font-medium">{selectedItem.name}</p>
                  
                  <div className="flex items-center justify-center gap-6 mb-8">
                    <button 
                      onClick={() => setStockDelta(d => d - 1)}
                      className="w-12 h-12 rounded-full border-2 border-[#E4E7EC] flex items-center justify-center text-[#111111] hover:bg-[#F3F4F6] transition-all active:scale-90"
                    >
                      <Icon icon="solar:minus-circle-bold" className="text-[24px]" />
                    </button>
                    <div className="flex flex-col items-center min-w-[80px]">
                      <span className={`text-[32px] font-black ${stockDelta > 0 ? 'text-[#16A34A]' : stockDelta < 0 ? 'text-[#DC2626]' : 'text-[#111111]'}`}>
                        {stockDelta > 0 ? `+${stockDelta}` : stockDelta}
                      </span>
                      <span className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-widest mt-1">Change</span>
                    </div>
                    <button 
                      onClick={() => setStockDelta(d => d + 1)}
                      className="w-12 h-12 rounded-full border-2 border-[#E4E7EC] flex items-center justify-center text-[#111111] hover:bg-[#F3F4F6] transition-all active:scale-90"
                    >
                      <Icon icon="solar:add-circle-bold" className="text-[24px]" />
                    </button>
                  </div>

                  <div className="bg-[#F7F7F8] rounded-[16px] p-4 mb-8 flex items-center justify-between border border-[#ECEDEF]">
                    <div className="text-left">
                      <div className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider">New Total</div>
                      <div className="text-[18px] font-bold text-[#111111]">{Math.max(0, selectedItem.stock + stockDelta)} units</div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                      Math.max(0, selectedItem.stock + stockDelta) <= selectedItem.minStock ? 'bg-[#FFF7ED] text-[#D97706]' : 'bg-[#ECFDF3] text-[#16A34A]'
                    }`}>
                      {Math.max(0, selectedItem.stock + stockDelta) <= selectedItem.minStock ? 'Low Stock alert' : 'Healthy Level'}
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setIsUpdateStockOpen(false)}
                      className="flex-1 h-11 bg-[#F3F4F6] hover:bg-[#E4E7EC] text-[#111111] rounded-[14px] font-bold text-[14px] transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleStockUpdate}
                      className="flex-1 h-11 bg-[#111111] hover:bg-[#333333] text-white rounded-[14px] font-bold text-[14px] transition-all active:scale-[0.98]"
                    >
                      Update Stock
                    </button>
                  </div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>

      {/* Delete Confirmation Modal */}
      <Dialog.Root open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AnimatePresence>
          {isDeleteModalOpen && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                  className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-[20px] p-6 z-50 border border-[#ECEDEF] focus:outline-none text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-[#FEF2F2] flex items-center justify-center mx-auto mb-4 text-[#EF4444]">
                    <Icon icon="solar:danger-triangle-bold" className="text-[24px]" />
                  </div>
                  <h2 className="text-[18px] font-bold text-[#111111] mb-2">Delete Inventory Item</h2>
                  <p className="text-[14px] text-[#525866] mb-6">Are you sure you want to remove this item? This action cannot be undone and will remove the item from all listings.</p>
                  
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setIsDeleteModalOpen(false)}
                      className="flex-1 h-10 bg-[#F3F4F6] hover:bg-[#E4E7EC] text-[#111111] rounded-[10px] font-bold text-[13px] transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleDelete}
                      className="flex-1 h-10 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-[10px] font-bold text-[13px] transition-colors"
                    >
                      Delete Item
                    </button>
                  </div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </div>
  );
}
