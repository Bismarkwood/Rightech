import React, { useState, useMemo } from 'react';
import { Search, Filter, Plus, PackageSearch, AlertCircle, ShoppingCart, X, Check, MoreVertical, Edit3, Save, Upload, Image as ImageIcon } from 'lucide-react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_PRODUCTS, CATEGORIES, Product } from '../../data/mockProducts';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function StorefrontTab() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState<'All Status' | 'In Stock' | 'Low Stock' | 'Out of Stock'>('All Status');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [showCartFeedback, setShowCartFeedback] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isNewProduct, setIsNewProduct] = useState(false);

  // Filtered products based on search and category
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           product.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All Categories' || product.category === selectedCategory;
      const matchesStatus = selectedStatus === 'All Status' || product.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchQuery, selectedCategory, selectedStatus]);

  const handleEditClick = (product: Product) => {
    setEditingProduct({ ...product });
    setIsNewProduct(false);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    const newProduct: Product = {
      id: `PRD-${Math.floor(1000 + Math.random() * 9000)}`,
      name: '',
      sku: '',
      price: '0.00 GHS',
      category: CATEGORIES[1],
      stock: 0,
      status: 'Out of Stock',
      image: '',
      description: ''
    };
    setEditingProduct(newProduct);
    setIsNewProduct(true);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async () => {
    if (!editingProduct) return;
    
    setIsSaving(true);
    try {
      // Simulate network delay for premium feel
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedProduct = {
        ...editingProduct,
        stock: Number(editingProduct.stock) || 0
      };

      if (isNewProduct) {
        setProducts(prev => [updatedProduct, ...prev]);
      } else {
        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      setIsNewProduct(false);
    } catch (error) {
      console.error("Failed to save product:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = () => {
    if (!editingProduct) return;
    setProducts(prev => prev.filter(p => p.id !== editingProduct.id));
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleAddToCart = (productId: string) => {
    setCartCount(prev => prev + 1);
    setShowCartFeedback(productId);
    setTimeout(() => setShowCartFeedback(null), 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, [name]: value });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingProduct) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingProduct({ ...editingProduct, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white rounded-[24px] border border-[#ECEDEF] flex flex-col min-h-[600px] shadow-sm overflow-hidden">
      {/* Header and Search */}
      <div className="p-5 border-b border-[#ECEDEF] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm sticky top-0 z-10 transition-all">
        <div className="relative group w-full sm:w-[320px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B93A7] group-focus-within:text-[#D40073] transition-colors" size={18} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products or SKU..." 
            className="w-full h-11 pl-11 pr-4 bg-[#F7F7F8] border border-transparent rounded-[12px] text-[14px] font-medium text-[#111111] placeholder:text-[#8B93A7] focus:outline-none focus:bg-white focus:border-[#D40073] focus:ring-4 focus:ring-[#D40073]/5 transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B93A7] hover:text-[#111111] p-1"
            >
              <X size={14} />
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={`h-11 px-4 flex items-center gap-2 rounded-[12px] text-[14px] font-bold transition-all border ${
                selectedCategory !== 'All Categories' 
                  ? 'bg-[#D40073]/5 border-[#D40073]/20 text-[#D40073]' 
                  : 'bg-[#F7F7F8] border-transparent text-[#111111] hover:bg-[#E4E7EC]'
              }`}>
                <Filter size={16} />
                {selectedCategory}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px] rounded-[16px] p-2 shadow-none border-[#ECEDEF] bg-white/95 backdrop-blur-xl">
              {CATEGORIES.map((cat) => (
                <DropdownMenuItem 
                  key={cat} 
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-[10px] px-3 py-2 cursor-pointer font-medium ${
                    selectedCategory === cat ? 'bg-[#D40073]/5 text-[#D40073]' : 'text-[#525866]'
                  }`}
                >
                  {cat}
                  {selectedCategory === cat && <Check size={14} className="ml-auto" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={`h-11 px-4 flex items-center gap-2 rounded-[12px] text-[14px] font-bold transition-all border ${
                selectedStatus !== 'All Status' 
                  ? 'bg-[#D40073]/5 border-[#D40073]/20 text-[#D40073]' 
                  : 'bg-[#F7F7F8] border-transparent text-[#111111] hover:bg-[#E4E7EC]'
              }`}>
                <AlertCircle size={16} />
                {selectedStatus}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px] rounded-[16px] p-2 shadow-none border-[#ECEDEF] bg-white/95 backdrop-blur-xl">
              {['All Status', 'In Stock', 'Low Stock', 'Out of Stock'].map((status) => (
                <DropdownMenuItem 
                  key={status} 
                  onClick={() => setSelectedStatus(status as any)}
                  className={`rounded-[10px] px-3 py-2 cursor-pointer font-medium ${
                    selectedStatus === status ? 'bg-[#D40073]/5 text-[#D40073]' : 'text-[#525866]'
                  }`}
                >
                  {status}
                  {selectedStatus === status && <Check size={14} className="ml-auto" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button 
            onClick={handleAddClick}
            className="h-11 bg-[#D40073] hover:bg-[#B80063] text-white rounded-[12px] px-5 font-bold gap-2 active:scale-95 transition-all border-none bg-gradient-to-tr from-[#D40073] to-[#FF4EAC]"
          >
            <Plus size={18} />
            New Product
          </Button>

          <Button className="h-11 bg-[#111111] hover:bg-[#222222] text-white rounded-[12px] px-4 font-bold gap-2 relative border border-transparent shadow-none">
            <ShoppingCart size={18} />
            Cart ({cartCount})
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D40073] text-white text-[10px] rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in">
                {cartCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Grid of Products */}
      <div className="p-6 flex-1 overflow-y-auto bg-[#FAFBFC]">
        <AnimatePresence mode="popLayout">
          {filteredProducts.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredProducts.map((product) => (
                <motion.div 
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white border-2 border-[#ECEDEF] rounded-[24px] overflow-hidden hover:border-[#D40073] transition-all group flex flex-col cursor-pointer"
                  onClick={() => handleEditClick(product)}
                >
                  <div className="h-[160px] bg-[#F7F7F8] flex items-center justify-center relative group-hover:bg-[#F0F1F3] transition-colors overflow-hidden">
                    <motion.div whileHover={{ scale: 1.1 }} transition={{ type: 'spring', stiffness: 300 }} className="w-full h-full flex items-center justify-center">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <PackageSearch size={48} className="text-[#8B93A7] opacity-20" />
                      )}
                    </motion.div>
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {product.status === 'Low Stock' && (
                        <div className="bg-[#FFF7ED] text-[#D97706] px-2.5 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 border border-[#FFEDD5] shadow-sm">
                          <AlertCircle size={14} /> Low Stock
                        </div>
                      )}
                      {product.status === 'Out of Stock' && (
                        <div className="bg-[#FEF2F2] text-[#DC2626] px-2.5 py-1.5 rounded-full text-[11px] font-bold border border-[#FECACA] shadow-sm">
                          Out of Stock
                        </div>
                      )}
                    </div>

                    {/* Quick Edit Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-white text-[#111111] px-4 py-2 rounded-full text-[13px] font-bold shadow-lg flex items-center gap-2">
                        <Edit3 size={16} />
                        Edit Details
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-[11px] font-extrabold text-[#D40073] uppercase tracking-[0.08em] bg-[#D40073]/5 px-2 py-0.5 rounded-md">{product.category}</span>
                    </div>
                    <h3 className="text-[15px] font-bold text-[#111111] mb-1 group-hover:text-[#D40073] transition-colors">{product.name}</h3>
                    <p className="text-[12px] font-medium text-[#8B93A7] mb-4">{product.sku}</p>
                    
                    <div className="mt-auto pt-4 border-t border-[#F7F7F8] flex items-center justify-between">
                      <div>
                        <p className="text-[18px] font-black text-[#111111] tracking-tight">{product.price}</p>
                        <p className={`text-[12px] font-bold mt-0.5 flex items-center gap-1 ${
                          product.stock === 0 ? 'text-[#DC2626]' : 
                          product.stock < 50 ? 'text-[#D97706]' : 'text-[#16A34A]'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${
                             product.stock === 0 ? 'bg-[#DC2626]' : 
                             product.stock < 50 ? 'bg-[#D97706]' : 'bg-[#16A34A]'
                          }`} />
                          {product.stock} available
                        </p>
                      </div>
                      
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleAddToCart(product.id); }}
                        disabled={product.stock === 0}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm relative ${
                          product.stock === 0 
                            ? 'bg-[#F3F4F6] text-[#8B93A7] cursor-not-allowed' 
                            : showCartFeedback === product.id 
                              ? 'bg-[#16A34A] text-white scale-110'
                              : 'bg-[#111111] text-white hover:bg-[#D40073] hover:scale-105 active:scale-95'
                        }`}
                      >
                        {showCartFeedback === product.id ? <Check size={20} /> : <Plus size={20} />}
                        
                        <AnimatePresence>
                          {showCartFeedback === product.id && (
                            <motion.div
                              initial={{ opacity: 0, y: 0 }}
                              animate={{ opacity: 1, y: -40 }}
                              exit={{ opacity: 0 }}
                              className="absolute text-[12px] font-bold text-[#16A34A] pointer-events-none whitespace-nowrap"
                            >
                              Added to cart!
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-20 h-20 bg-[#F7F7F8] rounded-full flex items-center justify-center mb-6">
                <PackageSearch size={40} className="text-[#8B93A7] opacity-30" />
              </div>
              <h3 className="text-[18px] font-bold text-[#111111] mb-2">No products found</h3>
              <p className="text-[#8B93A7] text-[14px]">Try adjusting your search or category filter</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory('All Categories'); }}
                className="mt-6 text-[#D40073] font-bold text-[14px] hover:underline"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Product Edit/Add Modal — Premium Shadowless Design */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[1000px] p-0 overflow-hidden rounded-[32px] border border-[#ECEDEF] bg-white/95 backdrop-blur-2xl shadow-none">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="flex flex-col md:flex-row h-full max-h-[90vh]"
          >
            {/* Left side: Premium Preview Card */}
            <div className="w-full md:w-[45%] bg-[#F8F9FA] p-8 flex flex-col items-center justify-center relative border-r border-[#ECEDEF]">
               <div className="w-full max-w-[320px] aspect-[4/5] relative group">
                  {/* Real-time Dynamic Card Preview */}
                  <motion.div 
                    layout
                    className="w-full h-full bg-white rounded-[32px] border-2 border-[#ECEDEF] overflow-hidden flex flex-col transition-all duration-500 group-hover:border-[#D40073]/50"
                  >
                    <div className="h-[60%] bg-[#F1F3F5] relative overflow-hidden flex items-center justify-center">
                      {editingProduct?.image ? (
                        <motion.img 
                          layoutId="product-image"
                          src={editingProduct.image} 
                          alt="Preview" 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-3 opacity-20 group-hover:opacity-40 transition-opacity">
                          <PackageSearch size={64} className="text-[#8B93A7]" />
                          <span className="text-[12px] font-black uppercase tracking-widest text-[#8B93A7]">Image Required</span>
                        </div>
                      )}
                      
                      {/* Interactive Upload Layer */}
                      <label className="absolute inset-0 bg-[#D40073]/10 opacity-0 group-hover:opacity-100 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 backdrop-blur-[4px]">
                        <div className="w-14 h-14 rounded-full bg-white text-[#D40073] flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                          <Upload size={24} />
                        </div>
                        <span className="text-[#D40073] text-[14px] font-black uppercase tracking-wider bg-white px-4 py-1.5 rounded-full">
                          {editingProduct?.image ? 'Change Photo' : 'Upload Photo'}
                        </span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                      </label>

                      <div className="absolute top-5 left-5">
                        <span className="bg-[#D40073] text-white text-[10px] font-black uppercase tracking-[0.1em] px-3.5 py-2 rounded-full border border-white/20 shadow-none">
                          {editingProduct?.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex-1">
                        <motion.h4 layoutId="product-name" className="text-[20px] font-black text-[#111111] leading-tight mb-1 truncate">
                          {editingProduct?.name || 'Vibrant Product Name'}
                        </motion.h4>
                        <p className="text-[12px] font-medium text-[#8B93A7] uppercase tracking-[0.12em] mb-4">
                          {editingProduct?.sku || 'SKU-000000'}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-[#F1F3F5]">
                        <div>
                          <p className="text-[10px] font-black text-[#8B93A7] uppercase tracking-widest leading-none mb-1">Store Price</p>
                          <p className="text-[24px] font-black text-[#D40073] tracking-tighter leading-none">
                            {editingProduct?.price || '0.00 GHS'}
                          </p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-[#111111] text-white flex items-center justify-center">
                          <Plus size={20} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
               </div>
               
               <div className="mt-8 text-center px-6">
                 <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#16A34A]/5 text-[#16A34A] rounded-full text-[11px] font-black uppercase tracking-widest mb-2">
                   <Check size={14} /> Live Storefront Preview
                 </div>
                 <p className="text-[13px] font-medium text-[#8B93A7] max-w-[200px] mx-auto">This is exactly how customers will see your product on the app.</p>
               </div>
            </div>

            {/* Right side: Modern Editor (Shadowless) */}
            <div className="flex-1 flex flex-col h-full bg-white">
              <div className="p-8 pb-4 shrink-0">
                <div className="flex items-center gap-4 mb-2">
                  <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center transition-colors ${isNewProduct ? 'bg-[#16A34A] text-white' : 'bg-[#D40073] text-white'}`}>
                    {isNewProduct ? <Plus size={24} /> : <Edit3 size={24} />}
                  </div>
                  <div>
                    <h2 className="text-[24px] font-black text-[#111111] tracking-tight">
                      {isNewProduct ? 'Publish New Product' : 'Refine Product'}
                    </h2>
                    <p className="text-[14px] font-medium text-[#8B93A7]">
                      {isNewProduct ? 'Fill in details to release into your storefront' : 'Update the inventory records for this item'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-8 py-2 custom-scrollbar">
                <div className="grid grid-cols-1 gap-5">
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-black text-[#B0B7C3] uppercase tracking-[0.1em] pl-1">Name on Storefront</Label>
                    <Input 
                      name="name"
                      value={editingProduct?.name || ''}
                      onChange={handleInputChange}
                      placeholder="e.g. Iron Rods - Ultra Grade"
                      className="h-12 rounded-[16px] font-bold border-[#ECEDEF] focus:border-[#D40073] focus:ring-4 focus:ring-[#D40073]/5 shadow-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-black text-[#B0B7C3] uppercase tracking-[0.1em] pl-1">Stock ID (SKU)</Label>
                      <Input 
                        name="sku"
                        value={editingProduct?.sku || ''}
                        onChange={handleInputChange}
                        placeholder="SKU-XXXX"
                        className="h-12 rounded-[16px] font-bold border-[#ECEDEF] shadow-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-black text-[#B0B7C3] uppercase tracking-[0.1em] pl-1">Store Category</Label>
                      <select 
                        name="category"
                        value={editingProduct?.category || ''}
                        onChange={(e) => editingProduct && setEditingProduct({ ...editingProduct, category: e.target.value })}
                        className="w-full h-12 rounded-[16px] border border-[#ECEDEF] bg-[#F7F7F8] px-4 text-[14px] font-bold focus:outline-none focus:border-[#D40073] transition-all appearance-none"
                      >
                        {CATEGORIES.filter(c => c !== 'All Categories').map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-black text-[#B0B7C3] uppercase tracking-[0.1em] pl-1">Display Price</Label>
                      <div className="relative">
                        <Input 
                          name="price"
                          value={editingProduct?.price || ''}
                          onChange={handleInputChange}
                          className="h-12 rounded-[16px] font-black text-[#D40073] border-[#ECEDEF] shadow-none pl-4"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] font-black text-[#D40073]/40 tracking-widest">GHS</div>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-black text-[#B0B7C3] uppercase tracking-[0.1em] pl-1">Initial Stock</Label>
                      <div className="relative">
                        <Input 
                          name="stock"
                          type="number"
                          value={editingProduct?.stock || 0}
                          onChange={handleInputChange}
                          className="h-12 rounded-[16px] font-bold border-[#ECEDEF] shadow-none"
                        />
                        <Icon icon="solar:box-bold" className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B0B7C3]" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-black text-[#B0B7C3] uppercase tracking-[0.1em] pl-1">Product Description</Label>
                    <textarea 
                      rows={3}
                      value={editingProduct?.description || ''}
                      onChange={(e) => editingProduct && setEditingProduct({ ...editingProduct, description: e.target.value })}
                      className="w-full rounded-[16px] border border-[#ECEDEF] bg-white p-4 text-[14px] font-medium focus:outline-none focus:border-[#D40073] transition-all resize-none shadow-none"
                      placeholder="Highlight quality, usage, and benefits..."
                    />
                  </div>
                </div>
              </div>

              <div className="p-8 shrink-0 flex items-center gap-3 border-t border-[#F1F3F5]">
                {!isNewProduct && (
                  <button 
                    onClick={handleDeleteProduct}
                    className="w-13 h-13 rounded-[18px] text-[#EF4444] hover:bg-[#FEF2F2] transition-all flex items-center justify-center border border-transparent hover:border-[#EF4444]/20"
                    title="Delete Product"
                  >
                    <Icon icon="solar:trash-bin-minimalistic-bold" className="text-[24px]" />
                  </button>
                )}
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 h-13 rounded-[18px] text-[15px] font-bold text-[#525866] hover:bg-[#F7F7F8] transition-all active:scale-95 border border-[#ECEDEF]"
                >
                  Discard
                </button>
                <button 
                  onClick={handleSaveProduct}
                  disabled={isSaving || !editingProduct?.name || !editingProduct?.image}
                  className={`flex-[1.5] h-13 rounded-[18px] text-[15px] font-black flex items-center justify-center gap-2 transition-all active:scale-95 shadow-none border-0 ${
                    isSaving 
                      ? 'bg-[#F1F3F5] text-[#B0B7C3]' 
                      : isNewProduct 
                        ? 'bg-[#16A34A] hover:bg-[#15803d] text-white outline-none ring-0' 
                        : 'bg-[#111111] hover:bg-black text-white outline-none ring-0'
                  }`}
                >
                  {isSaving ? (
                    <motion.div 
                      animate={{ rotate: 360 }} 
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    >
                      <Icon icon="solar:restart-bold" className="text-[20px]" />
                    </motion.div>
                  ) : (
                    <>
                      <Icon icon={isNewProduct ? "solar:cloud-upload-bold" : "solar:diskette-bold"} className="text-[20px]" />
                      {isNewProduct ? 'Publish to Store' : 'Update Listing'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  );
}