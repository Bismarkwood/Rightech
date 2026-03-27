import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from '@iconify/react';
import { Plus, Search, PackageSearch, LayoutGrid } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { StorefrontEditorModal } from '../components/storefront/StorefrontEditorModal';
import { StorefrontSettings } from '../components/storefront/StorefrontSettings';

export interface StorefrontListing {
  inventoryId: string;
  displayName: string;
  description: string;
  displayPrice: string;
  storeCategory: string;
  images: string[];
  isPublished: boolean;
  isFeatured: boolean;
  minOrder: number;
}

export default function StorefrontManagement() {
  const { products } = useProducts();
  
  const [listings, setListings] = useState<StorefrontListing[]>(() => {
    // Filter out archived products for the storefront
    const activeProducts = products.filter(p => !p.isArchived);
    return activeProducts.slice(0, 3).map((item, index) => ({
      inventoryId: item.id,
      displayName: item.storefrontName || item.name,
      description: item.storefrontDescription || item.description || 'Premium quality building material.',
      displayPrice: `GHS ${item.price.toLocaleString()}`,
      storeCategory: item.category,
      images: item.image ? [item.image] : [],
      isPublished: index < 2,
      isFeatured: index === 0,
      minOrder: 1,
    }));
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'listings' | 'settings'>('listings');
  
  // Editor Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<'add' | 'edit'>('add');
  const [editingListingId, setEditingListingId] = useState<string | null>(null);

  const filteredListings = listings.filter(l => {
    const product = products.find(p => p.id === l.inventoryId);
    if (!product || product.isArchived) return false;
    return l.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           l.inventoryId.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleAddProduct = () => {
    setEditorMode('add');
    setEditingListingId(null);
    setIsEditorOpen(true);
  };

  const handleEditProduct = (inventoryId: string) => {
    setEditorMode('edit');
    setEditingListingId(inventoryId);
    setIsEditorOpen(true);
  };

  return (
    <div className="flex flex-col h-full bg-[#FAFBFC]">
      {/* Header */}
      <div className="bg-white border-b border-[#ECEDEF] px-8 py-6 shrink-0 z-10 sticky top-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-[#111111] tracking-tight">Storefront</h1>
          <p className="text-[14px] text-[#525866] mt-1">Design your live shop window and select inventory to display.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveView(activeView === 'listings' ? 'settings' : 'listings')}
            className={`h-11 px-5 rounded-[12px] text-[14px] font-bold transition-all flex items-center gap-2 border ${
              activeView === 'settings' 
                ? 'bg-[#111111] text-white border-[#111111]' 
                : 'bg-white text-[#525866] border-[#ECEDEF] hover:bg-[#F7F7F8] hover:text-[#111111]'
            }`}
          >
            <Icon icon="solar:settings-bold" className="text-[18px]" />
            Settings
          </button>
          
          {activeView === 'listings' && (
            <button 
              onClick={handleAddProduct}
              className="h-11 px-5 rounded-[12px] bg-[#D40073] text-white font-bold transition-colors hover:bg-[#B80063] shadow-md shadow-[#D40073]/20 flex items-center gap-2"
            >
              <Plus size={18} />
              Add Product
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto w-full p-8 custom-scrollbar">
        <AnimatePresence mode="wait">
          {activeView === 'settings' ? (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <StorefrontSettings />
            </motion.div>
          ) : (
            <motion.div
              key="listings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-[1400px] mx-auto"
            >
              {/* Search Bar */}
              <div className="relative w-full max-w-[400px] mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B93A7]" size={18} />
                <input 
                  type="text" 
                  placeholder="Search live listings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 bg-white rounded-[14px] text-[14px] font-medium border border-[#ECEDEF] focus:bg-[#F7F7F8] focus:border-[#D40073] focus:ring-4 focus:ring-[#D40073]/10 transition-all outline-none shadow-sm"
                />
              </div>

              {/* Verified Product Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredListings.length > 0 ? (
                    filteredListings.map((listing) => {
                      // Lookup live baseline from context
                      const liveItem = products.find(i => i.id === listing.inventoryId);
                      if (!liveItem || liveItem.isArchived) return null;

                      const isOutOfStock = liveItem.stock === 0;
                      const displayStatus = isOutOfStock ? 'Out of Stock' : (!listing.isPublished ? 'Hidden' : 'Live');
                      const statusColor = isOutOfStock ? 'text-[#EF4444] bg-[#FEF2F2] border-[#FECACA]' : 
                                          (!listing.isPublished ? 'text-[#525866] bg-[#F1F3F5] border-[#ECEDEF]' : 'text-[#16A34A] bg-[#DCFCE7] border-[#BBF7D0]');

                      return (
                        <motion.div
                          key={listing.inventoryId}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          whileHover={{ y: -4 }}
                          className={`bg-white rounded-[24px] border-[2px] overflow-hidden group hover:border-[#D40073]/40 transition-all duration-300 flex flex-col ${
                            listing.isPublished && !isOutOfStock ? 'border-transparent hover:border-[#D40073]/20' : 'border-[#ECEDEF] opacity-80 hover:opacity-100'
                          }`}
                        >
                          {/* Image Container */}
                          <div className="h-[200px] bg-[#F7F7F8] relative overflow-hidden flex items-center justify-center">
                            {listing.images.length > 0 ? (
                              <img src={listing.images[0]} alt={listing.displayName} className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${!listing.isPublished || isOutOfStock ? 'grayscale' : ''}`} />
                            ) : (
                              <PackageSearch size={40} className="text-[#8B93A7] opacity-20" />
                            )}
                            
                            {/* Top Badges */}
                            <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
                              <div className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${statusColor}`}>
                                {displayStatus}
                              </div>
                              {listing.isFeatured && listing.isPublished && !isOutOfStock && (
                                <div className="bg-[#D40073] text-white px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                                  Featured
                                </div>
                              )}
                            </div>

                            {/* Transparent Edit Overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                              <button 
                                onClick={() => handleEditProduct(listing.inventoryId)}
                                className="bg-white text-[#111111] px-5 py-2.5 rounded-full text-[13px] font-bold shadow-xl hover:scale-105 active:scale-95 transition-transform flex items-center gap-2"
                              >
                                <Icon icon="solar:pen-bold" className="text-[16px]" />
                                Edit Storefront Card
                              </button>
                            </div>
                          </div>
                          
                          {/* Details */}
                          <div className="p-5 flex-1 flex flex-col relative z-0 bg-white">
                            <div className="text-[11px] font-black text-[#D40073]/80 uppercase tracking-widest mb-1.5">{listing.storeCategory}</div>
                            <h3 className="text-[17px] font-bold text-[#111111] leading-tight mb-2 line-clamp-2">{listing.displayName}</h3>
                            <p className="text-[13px] text-[#8B93A7] line-clamp-2 mb-4 leading-relaxed font-medium">{listing.description}</p>
                            
                            <div className="mt-auto pt-4 border-t border-[#F1F3F5] flex items-center justify-between">
                              <div>
                                <span className={`text-[18px] font-black ${isOutOfStock ? 'text-[#8B93A7] line-through' : 'text-[#111111]'}`}>
                                  GHS {liveItem.price.toLocaleString()}
                                </span>
                              </div>
                              <div className="text-[12px] font-bold text-[#525866] bg-[#F7F7F8] px-2 py-1 rounded-md border border-[#ECEDEF]">
                                {liveItem.stock} in stock
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <motion.div className="col-span-full py-24 flex flex-col items-center justify-center text-center">
                      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm border border-[#ECEDEF] mb-6">
                         <LayoutGrid size={32} className="text-[#8B93A7]" />
                      </div>
                      <h3 className="text-[20px] font-bold text-[#111111] mb-2 tracking-tight">No published products</h3>
                      <p className="text-[#8B93A7] text-[14px] max-w-[300px]">Your storefront is empty or matches no search results. Add items from inventory to display them.</p>
                      <button 
                        onClick={handleAddProduct}
                        className="mt-6 h-11 px-6 rounded-[12px] bg-[#111111] text-white font-bold transition-colors hover:bg-[#D40073] shadow-md flex items-center gap-2"
                      >
                        <Plus size={18} />
                        Add First Product
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <StorefrontEditorModal 
        isOpen={isEditorOpen}
        mode={editorMode}
        editingListingId={editingListingId}
        listings={listings}
        setListings={setListings}
        onClose={() => setIsEditorOpen(false)}
      />
    </div>
  );
}
