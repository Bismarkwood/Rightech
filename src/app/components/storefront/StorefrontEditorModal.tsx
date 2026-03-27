import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Check, PackageSearch, Save, Icon as LucideIcon } from 'lucide-react';
import { Icon } from '@iconify/react';
import { StorefrontListing } from '../../pages/StorefrontManagement';
import { useRetailer } from '../retailer/RetailerContext';
import { Dialog, DialogContent } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface StorefrontEditorModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  editingListingId: string | null;
  listings: StorefrontListing[];
  setListings: React.Dispatch<React.SetStateAction<StorefrontListing[]>>;
  onClose: () => void;
}

export function StorefrontEditorModal({
  isOpen,
  mode,
  editingListingId,
  listings,
  setListings,
  onClose
}: StorefrontEditorModalProps) {
  const { inventory } = useRetailer();
  
  // Step State for 'Add' mode
  const [step, setStep] = useState<1 | 2>(mode === 'add' ? 1 : 2);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Editor Form State
  const [editedListing, setEditedListing] = useState<StorefrontListing | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize data on open
  useEffect(() => {
    if (isOpen) {
      if (mode === 'add') {
        setStep(1);
        setEditedListing(null);
      } else if (mode === 'edit' && editingListingId) {
        setStep(2);
        const existing = listings.find(l => l.inventoryId === editingListingId);
        if (existing) setEditedListing(existing);
      }
    }
  }, [isOpen, mode, editingListingId, listings]);

  // Inventory available for adding (i.e., not already listed)
  const listedIds = new Set(listings.map(l => l.inventoryId));
  const availableInventory = inventory.filter(item => 
    !listedIds.has(item.id) && 
    (item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.id.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSelectInventoryItem = (itemId: string) => {
    const item = inventory.find(i => i.id === itemId);
    if (!item) return;

    // Seed the form with default inventory data
    setEditedListing({
      inventoryId: item.id,
      displayName: item.name,
      description: item.description || '',
      displayPrice: item.price,
      storeCategory: item.category,
      images: item.image ? [item.image] : [],
      isPublished: true,
      isFeatured: false,
      minOrder: 1,
    });
    setStep(2);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editedListing) return;
    const { name, value } = e.target;
    setEditedListing(prev => prev ? { ...prev, [name]: value } : prev);
  };

  const handleToggleChange = (name: keyof StorefrontListing) => {
    if (!editedListing) return;
    setEditedListing(prev => prev ? { ...prev, [name]: !prev[name] } : prev);
  };

  const handleSave = () => {
    if (!editedListing) return;
    setIsSaving(true);
    setTimeout(() => {
      if (mode === 'add') {
        setListings(prev => [editedListing, ...prev]);
      } else {
        setListings(prev => prev.map(l => l.inventoryId === editedListing.inventoryId ? editedListing : l));
      }
      setIsSaving(false);
      onClose();
    }, 600);
  };

  // Derive live inventory data for the "Source Truth" header in Step 2
  const liveItem = inventory.find(i => i.id === editedListing?.inventoryId);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open && !isSaving) onClose();
    }}>
      <DialogContent className={`p-0 overflow-hidden rounded-[32px] border border-[#ECEDEF] bg-white shadow-none transition-all duration-300 ${step === 1 ? 'sm:max-w-[700px]' : 'sm:max-w-[1000px]'}`}>
        
        {/* Step 1: Select Inventory Item */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col max-h-[80vh]"
            >
              <div className="p-6 border-b border-[#ECEDEF] bg-[#F7F7F8] flex items-center justify-between sticky top-0 z-10">
                <div>
                  <h2 className="text-[20px] font-black tracking-tight text-[#111111] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[12px] bg-[#111111] text-white flex items-center justify-center shadow-lg">
                      <Icon icon="solar:box-bold" className="text-[20px]" />
                    </div>
                    Select Source Inventory
                  </h2>
                  <p className="text-[14px] text-[#525866] mt-2 font-medium leading-relaxed">Choose an item from your warehouse. It will serve as the live stock database for the storefront card.</p>
                </div>
                <button 
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-white text-[#525866] flex items-center justify-center hover:bg-[#E4E7EC] hover:text-[#111111] transition-colors border border-[#ECEDEF] shadow-sm"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 border-b border-[#ECEDEF] bg-white">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B93A7]" size={18} />
                  <Input 
                    placeholder="Search available inventory by name or SKU..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 bg-[#F7F7F8] border border-[#ECEDEF] font-medium rounded-[14px] focus:bg-white focus:border-[#D40073] shadow-none"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 bg-[#F7F7F8] custom-scrollbar">
                <div className="grid grid-cols-1 gap-3">
                  {availableInventory.length > 0 ? (
                    availableInventory.map(item => (
                      <button 
                        key={item.id}
                        onClick={() => handleSelectInventoryItem(item.id)}
                        className="p-4 rounded-[16px] bg-white border border-[#ECEDEF] hover:border-[#D40073]/40 hover:shadow-md transition-all text-left flex items-center gap-4 group"
                      >
                        <div className="w-14 h-14 rounded-[12px] bg-[#F7F7F8] overflow-hidden shrink-0 border border-[#ECEDEF]">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#B0B7C3]">
                              <PackageSearch size={24} />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[15px] font-bold text-[#111111] truncate mb-1">{item.name}</h4>
                          <div className="flex items-center gap-3 text-[13px] font-medium text-[#8B93A7]">
                            <span className="bg-[#F1F3F5] text-[#525866] px-2 py-0.5 rounded-md font-semibold">{item.id}</span>
                            <div className="w-1 h-1 rounded-full bg-[#D1D5DB]" />
                            <span className={item.stock === 0 ? 'text-[#EF4444]' : ''}>{item.stock} in stock</span>
                            <div className="w-1 h-1 rounded-full bg-[#D1D5DB]" />
                            <span className="text-[#111111] font-bold">{item.price}</span>
                          </div>
                        </div>

                        <div className="w-10 h-10 rounded-full bg-[#F7F7F8] text-[#8B93A7] group-hover:bg-[#111111] group-hover:text-white flex items-center justify-center transition-colors">
                          <Icon icon="solar:alt-arrow-right-linear" className="text-[20px]" />
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="py-16 flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-[#ECEDEF] mb-4">
                        <PackageSearch size={28} className="text-[#8B93A7]" />
                      </div>
                      <h4 className="text-[16px] font-bold text-[#111111]">No available items found</h4>
                      <p className="text-[13px] text-[#8B93A7] mt-1 max-w-[250px]">All matching items are already listed, or the inventory is completely empty.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Editor with Live Preview */}
          {step === 2 && editedListing && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col md:flex-row h-full max-h-[85vh] md:h-[650px] bg-white relative"
            >
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-[#F3F4F6] text-[#525866] flex items-center justify-center hover:bg-[#E4E7EC] hover:text-[#111111] transition-colors z-20"
              >
                <X size={16} />
              </button>

              {/* Left Column: Real-Time Card Preview */}
              <div className="w-full md:w-[45%] bg-[#FAFBFC] border-r border-[#ECEDEF] flex flex-col items-center justify-center p-8 relative overflow-hidden">
                <div className="absolute inset-0 pattern-dots pattern-gray-200 pattern-bg-white pattern-size-4 pattern-opacity-20 z-0" />
                
                <h3 className="absolute top-8 left-8 text-[11px] font-black text-[#8B93A7] uppercase tracking-[0.2em] z-10">Live Customer Preview</h3>

                <div className="w-full max-w-[320px] bg-white rounded-[24px] border-[2px] border-transparent shadow-2xl flex flex-col overflow-hidden relative z-10 mt-8 hover:shadow-[#D40073]/10 hover:-translate-y-2 transition-all duration-300">
                  {/* Card Image */}
                  <div className="h-[200px] bg-[#F7F7F8] relative overflow-hidden flex items-center justify-center">
                    {editedListing.images.length > 0 ? (
                      <img src={editedListing.images[0]} alt={editedListing.displayName} className="w-full h-full object-cover" />
                    ) : (
                      <PackageSearch size={40} className="text-[#8B93A7] opacity-20" />
                    )}
                    
                    {/* Live Badges */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                       <div className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                         (liveItem?.stock || 0) === 0 ? 'text-[#EF4444] bg-[#FEF2F2] border-[#FECACA]' : 
                         (!editedListing.isPublished ? 'text-[#525866] bg-[#F1F3F5] border-[#ECEDEF]' : 'text-[#16A34A] bg-[#DCFCE7] border-[#BBF7D0]')
                       }`}>
                         {(liveItem?.stock || 0) === 0 ? 'Out of Stock' : (!editedListing.isPublished ? 'Hidden' : 'Live')}
                       </div>
                       {editedListing.isFeatured && editedListing.isPublished && (liveItem?.stock || 0) > 0 && (
                         <div className="bg-[#D40073] text-white px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                           Featured
                         </div>
                       )}
                    </div>
                  </div>
                  
                  {/* Card Details */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="text-[11px] font-black text-[#D40073]/80 uppercase tracking-widest mb-1.5 min-h-[16px]">{editedListing.storeCategory}</div>
                    <h3 className="text-[17px] font-bold text-[#111111] leading-tight mb-2 line-clamp-2 min-h-[40px]">{editedListing.displayName || <span className="opacity-30">No Name</span>}</h3>
                    <p className="text-[13px] text-[#8B93A7] line-clamp-2 mb-4 leading-relaxed font-medium min-h-[40px]">{editedListing.description || <span className="opacity-30">No Description</span>}</p>
                    
                    <div className="mt-auto pt-4 border-t border-[#F1F3F5] flex items-center justify-between">
                      <div>
                        <span className="text-[18px] font-black text-[#111111]">
                          {editedListing.displayPrice || <span className="opacity-30">0.00 GHS</span>}
                        </span>
                      </div>
                      <div className="w-10 h-10 rounded-[12px] bg-[#111111] text-white flex items-center justify-center relative shadow-md">
                        <Icon icon="solar:cart-large-2-bold" className="text-[18px]" />
                        {(liveItem?.stock || 0) === 0 && <div className="absolute inset-0 bg-white/70 rounded-[12px] cursor-not-allowed"></div>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Editor Form */}
              <div className="flex-1 flex flex-col overflow-hidden bg-white">
                 
                {/* Source Truth Banner */}
                <div className="bg-[#111111] px-6 py-4 flex items-center justify-between text-white shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                      <Icon icon="solar:database-bold" className="text-[16px]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-0.5">Inventory Link: {liveItem?.id}</p>
                      <p className="text-[13px] font-bold">{liveItem?.name} <span className="text-white/40 ml-2 font-mono">{liveItem?.price}</span></p>
                    </div>
                  </div>
                  <div className={`px-3 py-1.5 rounded-[8px] border text-[12px] font-bold flex items-center gap-2 ${
                    (liveItem?.stock || 0) === 0 ? 'bg-[#EF4444]/20 border-[#EF4444]/30 text-[#FCA5A5]' : 'bg-[#16A34A]/20 border-[#16A34A]/30 text-[#86EFAC]'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${ (liveItem?.stock || 0) === 0 ? 'bg-[#FCA5A5]' : 'bg-[#86EFAC]'}`} />
                    {liveItem?.stock || 0} left
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 custom-scrollbar">
                  <div>
                    <h2 className="text-[24px] font-black text-[#111111] tracking-tight">{mode === 'add' ? 'Configure Listing' : 'Edit Listing'}</h2>
                    <p className="text-[14px] font-medium text-[#8B93A7] mt-1">Adjust the marketing layers independently from the inventory records.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5 col-span-2">
                       <Label className="text-[11px] font-black text-[#B0B7C3] uppercase tracking-[0.1em] pl-1">Storefront Name</Label>
                       <Input 
                         name="displayName"
                         value={editedListing.displayName}
                         onChange={handleInputChange}
                         className="h-12 rounded-[14px] font-bold text-[#111111] border-[#ECEDEF] focus:border-[#D40073] focus:ring-4 focus:ring-[#D40073]/5 shadow-none transition-all"
                       />
                    </div>
                    
                    <div className="space-y-1.5">
                       <Label className="text-[11px] font-black text-[#B0B7C3] uppercase tracking-[0.1em] pl-1">Display Category</Label>
                       <Input 
                         name="storeCategory"
                         value={editedListing.storeCategory}
                         onChange={handleInputChange}
                         className="h-12 rounded-[14px] font-bold text-[#111111] border-[#ECEDEF] focus:border-[#D40073] focus:ring-4 focus:ring-[#D40073]/5 shadow-none transition-all"
                       />
                    </div>

                    <div className="space-y-1.5">
                       <Label className="text-[11px] font-black text-[#B0B7C3] uppercase tracking-[0.1em] pl-1">Listed Price</Label>
                       <Input 
                         name="displayPrice"
                         value={editedListing.displayPrice}
                         onChange={handleInputChange}
                         className="h-12 rounded-[14px] font-black text-[#D40073] border-[#ECEDEF] focus:border-[#D40073] focus:ring-4 focus:ring-[#D40073]/5 shadow-none transition-all pl-4 bg-[#F7F7F8]"
                       />
                    </div>

                    <div className="space-y-1.5 col-span-2">
                       <Label className="text-[11px] font-black text-[#B0B7C3] uppercase tracking-[0.1em] pl-1">Marketing Description</Label>
                       <textarea 
                         name="description"
                         rows={3}
                         value={editedListing.description}
                         onChange={handleInputChange}
                         className="w-full rounded-[14px] border border-[#ECEDEF] bg-[#F7F7F8] p-4 text-[13px] font-medium text-[#111111] focus:outline-none focus:bg-white focus:border-[#D40073] focus:ring-4 focus:ring-[#D40073]/5 transition-all resize-none shadow-none"
                         placeholder="Highlight product quality and specifics for the buyer..."
                       />
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                   {/* Toggles */}
                   <div className="p-4 rounded-[16px] border border-[#ECEDEF] bg-[#FAFBFC] flex items-center justify-between">
                     <div>
                       <h4 className="text-[14px] font-bold text-[#111111]">Publish on Storefront</h4>
                       <p className="text-[12px] text-[#525866]">Instantly make this product visible to retailers.</p>
                     </div>
                     <label className="relative inline-flex items-center cursor-pointer">
                       <input type="checkbox" className="sr-only peer" checked={editedListing.isPublished} onChange={() => handleToggleChange('isPublished')} />
                       <div className="w-12 h-6 bg-[#ECEDEF] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16A34A]"></div>
                     </label>
                   </div>

                   <div className="p-4 rounded-[16px] border border-[#ECEDEF] bg-[#FAFBFC] flex items-center justify-between">
                     <div>
                       <h4 className="text-[14px] font-bold text-[#111111]">Featured Pick</h4>
                       <p className="text-[12px] text-[#525866]">Highlight this item heavily in its category.</p>
                     </div>
                     <label className="relative inline-flex items-center cursor-pointer">
                       <input type="checkbox" className="sr-only peer" checked={editedListing.isFeatured} onChange={() => handleToggleChange('isFeatured')} />
                       <div className="w-12 h-6 bg-[#ECEDEF] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D40073]"></div>
                     </label>
                   </div>
                  </div>
                </div>

                <div className="p-6 shrink-0 border-t border-[#ECEDEF] bg-white flex justify-end gap-3 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
                   {mode === 'edit' && (
                     <button 
                       onClick={() => {
                         setListings(prev => prev.filter(l => l.inventoryId !== editedListing.inventoryId));
                         onClose();
                       }}
                       className="h-12 px-6 rounded-[12px] font-bold text-[#EF4444] hover:bg-[#FEF2F2] transition-colors mr-auto border border-transparent hover:border-[#FCA5A5]/40"
                     >
                       Remove Listing
                     </button>
                   )}
                   <button 
                     onClick={onClose}
                     className="h-12 px-6 rounded-[12px] font-bold text-[#525866] hover:bg-[#F3F4F6] transition-colors"
                   >
                     Discard
                   </button>
                   <button 
                      onClick={handleSave}
                      disabled={isSaving}
                      className="h-12 px-8 rounded-[12px] text-[15px] font-black flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-[#111111]/10 bg-[#111111] hover:bg-[#D40073] hover:shadow-[#D40073]/20 text-white min-w-[160px]"
                    >
                      {isSaving ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                          <Icon icon="solar:restart-bold" className="text-[20px]" />
                        </motion.div>
                      ) : (
                        <>
                          <Save size={18} />
                          {mode === 'add' ? 'Publish Listing' : 'Save Changes'}
                        </>
                      )}
                    </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
