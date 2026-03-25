import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from '@iconify/react';
import * as Dialog from '@radix-ui/react-dialog';

const MOCK_INVENTORY = [
  { id: 'INV-101', name: 'Portland Cement 50kg', category: 'Cement', stock: 450, minStock: 100, price: '85 GHS', status: 'In Stock', lastUpdated: 'Today' },
  { id: 'INV-102', name: 'Iron Rods 16mm', category: 'Steel', stock: 12, minStock: 50, price: '120 GHS', status: 'Low Stock', lastUpdated: 'Yesterday' },
  { id: 'INV-103', name: 'Roofing Sheets (Aluzinc)', category: 'Roofing', stock: 0, minStock: 20, price: '350 GHS', status: 'Out of Stock', lastUpdated: '2 days ago' },
  { id: 'INV-104', name: 'Emulsion Paint 20L', category: 'Paint', stock: 85, minStock: 30, price: '450 GHS', status: 'In Stock', lastUpdated: 'Today' },
  { id: 'INV-105', name: 'PVC Pipes 4"', category: 'Plumbing', stock: 120, minStock: 40, price: '65 GHS', status: 'In Stock', lastUpdated: '1 week ago' },
];

export function InventoryTab() {
  const [searchTerm, setSearchTerm] = useState('');
  const [inventory, setInventory] = useState(MOCK_INVENTORY);
  const [selectedItem, setSelectedItem] = useState<typeof MOCK_INVENTORY[0] | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = () => {
    if (itemToDelete) {
      setInventory(prev => prev.filter(i => i.id !== itemToDelete));
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const openViewModal = (item: typeof MOCK_INVENTORY[0]) => {
    setSelectedItem(item);
    setIsViewModalOpen(true);
  };

  const openDeleteModal = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="bg-white rounded-[16px] border border-[#ECEDEF] flex flex-col min-h-[600px] shadow-sm">
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
        <button className="h-[40px] px-4 flex items-center gap-2 bg-[#111111] hover:bg-[#333333] text-white rounded-[10px] text-[13px] font-semibold transition-colors">
          <Icon icon="solar:add-circle-linear" className="text-[18px]" />
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
                  <div className="font-bold text-[#111111]">{item.name}</div>
                  <div className="text-[12px] text-[#8B93A7] font-medium">{item.id}</div>
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
                  className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-[24px] p-6 z-50 shadow-2xl focus:outline-none"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-[20px] font-bold text-[#111111] tracking-tight">{selectedItem.name}</h2>
                      <p className="text-[13px] text-[#525866] font-medium mt-1">ID: {selectedItem.id} • {selectedItem.category}</p>
                    </div>
                    <Dialog.Close asChild>
                      <button className="w-8 h-8 flex items-center justify-center text-[#8B93A7] hover:bg-[#F3F4F6] rounded-full transition-colors">
                        <Icon icon="solar:close-circle-linear" className="text-[20px]" />
                      </button>
                    </Dialog.Close>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-[#F7F7F8] rounded-[12px]">
                      <span className="text-[13px] text-[#525866] font-medium">Current Stock</span>
                      <span className="text-[14px] font-bold text-[#111111]">{selectedItem.stock} units</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-[#F7F7F8] rounded-[12px]">
                      <span className="text-[13px] text-[#525866] font-medium">Minimum Threshold</span>
                      <span className="text-[14px] font-bold text-[#111111]">{selectedItem.minStock} units</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-[#F7F7F8] rounded-[12px]">
                      <span className="text-[13px] text-[#525866] font-medium">Unit Price</span>
                      <span className="text-[14px] font-bold text-[#111111]">{selectedItem.price}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-[#F7F7F8] rounded-[12px]">
                      <span className="text-[13px] text-[#525866] font-medium">Status</span>
                      <span className={`text-[13px] font-bold ${
                        selectedItem.status === 'In Stock' ? 'text-[#16A34A]' :
                        selectedItem.status === 'Low Stock' ? 'text-[#D97706]' :
                        'text-[#DC2626]'
                      }`}>
                        {selectedItem.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-[#F7F7F8] rounded-[12px]">
                      <span className="text-[13px] text-[#525866] font-medium">Last Updated</span>
                      <span className="text-[14px] font-bold text-[#111111]">{selectedItem.lastUpdated}</span>
                    </div>
                  </div>

                  <div className="mt-8 flex gap-3">
                    <button className="flex-1 h-11 bg-[#F3F4F6] hover:bg-[#E4E7EC] text-[#111111] rounded-[12px] font-bold text-[14px] transition-colors">
                      Edit Details
                    </button>
                    <button className="flex-1 h-11 bg-[#111111] hover:bg-[#333333] text-white rounded-[12px] font-bold text-[14px] transition-colors">
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
                  className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-[20px] p-6 z-50 shadow-2xl focus:outline-none text-center"
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
