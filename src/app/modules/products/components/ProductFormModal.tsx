import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from '@iconify/react';
import { X, Upload, Image as ImageIcon, AlertCircle, Check } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { Product, ProductUnit, MOCK_CATEGORIES } from '../../../core/data/productData';

const UNITS: ProductUnit[] = ['Unit', 'Kg', 'Bag', 'Roll', 'Box', 'Sqm', 'Litre', 'Sheet', 'Pair'];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editProduct?: Product | null;
}

interface FormState {
  name: string;
  sku: string;
  category: string;
  description: string;
  price: string;
  costPrice: string;
  unit: ProductUnit;
  stock: string;
  lowStockThreshold: string;
  supplier: string;
  tags: string;
  image: string;
}

const EMPTY_FORM: FormState = {
  name: '',
  sku: '',
  category: MOCK_CATEGORIES[0].name,
  description: '',
  price: '',
  costPrice: '',
  unit: 'Unit',
  stock: '',
  lowStockThreshold: '10',
  supplier: '',
  tags: '',
  image: '',
};

export function ProductFormModal({ isOpen, onClose, editProduct }: Props) {
  const { addProduct, updateProduct } = useProducts();
  const isEditing = !!editProduct;

  const [form, setForm] = useState<FormState>(isEditing && editProduct ? {
    name: editProduct.name,
    sku: editProduct.sku,
    category: editProduct.category,
    description: editProduct.description,
    price: String(editProduct.price),
    costPrice: String(editProduct.costPrice ?? ''),
    unit: editProduct.unit,
    stock: String(editProduct.stock),
    lowStockThreshold: String(editProduct.lowStockThreshold),
    supplier: editProduct.supplier ?? '',
    tags: (editProduct.tags ?? []).join(', '),
    image: editProduct.image ?? '',
  } : EMPTY_FORM);

  const [imagePreview, setImagePreview] = useState<string>(form.image);
  const [dragOver, setDragOver] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setImagePreview(src);
      setForm(prev => ({ ...prev, image: src }));
    };
    reader.readAsDataURL(file);
  };

  const isValid = form.name.trim() && form.sku.trim() && form.price && form.stock;

  const handleSubmit = () => {
    if (!isValid) { setSubmitted(true); return; }
    const payload = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      category: form.category,
      description: form.description.trim(),
      price: parseFloat(form.price) || 0,
      costPrice: parseFloat(form.costPrice) || 0,
      unit: form.unit,
      stock: parseInt(form.stock) || 0,
      lowStockThreshold: parseInt(form.lowStockThreshold) || 10,
      supplier: form.supplier.trim() || undefined,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      image: form.image || undefined,
    };
    if (isEditing && editProduct) {
      updateProduct(editProduct.id, payload);
    } else {
      addProduct(payload);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-[4px] z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 260 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[860px] z-[110] bg-white rounded-[28px] overflow-hidden border border-[#ECEDEF] flex flex-col max-h-[92vh] font-sans"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-[#ECEDEF] flex items-center justify-between bg-[#F7F7F8] shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-[14px] bg-[#111111] text-white flex items-center justify-center">
                  <Icon icon={isEditing ? 'solar:pen-bold-duotone' : 'solar:add-square-bold-duotone'} className="text-[24px]" />
                </div>
                <div>
                  <h2 className="text-[20px] font-black text-[#111111]">{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
                  <p className="text-[13px] font-medium text-[#8B93A7] mt-0.5">
                    {isEditing ? `Editing ${editProduct?.name}` : 'Fill in product details below'}
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-[rgba(0,0,0,0.06)] text-[#8B93A7] flex items-center justify-center transition-all">
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-5 divide-x divide-[#ECEDEF]">

                {/* Left: Image Upload */}
                <div className="col-span-2 p-8 flex flex-col gap-6 bg-[#FAFBFC]">
                  <div>
                    <p className="text-[12px] font-black uppercase tracking-wider text-[#8B93A7] mb-3">Product Image</p>

                    <div
                      className={`relative group rounded-[20px] border-2 border-dashed transition-all cursor-pointer overflow-hidden ${
                        dragOver ? 'border-[#D40073] bg-[#D40073]/5' : 'border-[#ECEDEF] hover:border-[#D40073]/40'
                      }`}
                      style={{ aspectRatio: '1' }}
                      onClick={() => fileRef.current?.click()}
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={(e) => {
                        e.preventDefault(); setDragOver(false);
                        const file = e.dataTransfer.files[0];
                        if (file) handleImageFile(file);
                      }}
                    >
                      {imagePreview ? (
                        <>
                          <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-2">
                            <Upload size={24} className="text-white" />
                            <span className="text-white text-[13px] font-bold">Change Image</span>
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
                          <div className="w-14 h-14 rounded-full bg-[#ECEDEF] flex items-center justify-center">
                            <ImageIcon size={24} className="text-[#8B93A7]" />
                          </div>
                          <div>
                            <p className="text-[14px] font-bold text-[#525866]">Drag & drop or click</p>
                            <p className="text-[12px] font-medium text-[#8B93A7] mt-1">PNG, JPG up to 5MB</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageFile(file);
                    }} />
                  </div>

                  {/* Pricing Summary (live preview) */}
                  {(form.price || form.costPrice) && (
                    <div className="bg-white border border-[#ECEDEF] rounded-[18px] p-4 space-y-2">
                      <p className="text-[11px] font-black uppercase tracking-wider text-[#8B93A7] mb-3">Margin Preview</p>
                      {form.price && <div className="flex justify-between text-[13px]">
                        <span className="font-medium text-[#525866]">Sell Price</span>
                        <span className="font-black text-[#111111]">GHS {parseFloat(form.price).toLocaleString()}</span>
                      </div>}
                      {form.costPrice && <div className="flex justify-between text-[13px]">
                        <span className="font-medium text-[#525866]">Cost Price</span>
                        <span className="font-bold text-[#525866]">GHS {parseFloat(form.costPrice).toLocaleString()}</span>
                      </div>}
                      {form.price && form.costPrice && (() => {
                        const margin = ((parseFloat(form.price) - parseFloat(form.costPrice)) / parseFloat(form.price)) * 100;
                        return (
                          <div className="flex justify-between text-[13px] pt-2 border-t border-[#F1F3F5]">
                            <span className="font-medium text-[#525866]">Margin</span>
                            <span className={`font-black ${margin >= 20 ? 'text-[#16A34A]' : margin >= 10 ? 'text-[#D97706]' : 'text-[#EF4444]'}`}>
                              {margin.toFixed(1)}%
                            </span>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>

                {/* Right: Form Fields */}
                <div className="col-span-3 p-8 space-y-6">

                  {/* Section: Identity */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-4 bg-[#D40073] rounded-full" />
                      <h3 className="text-[12px] font-black text-[#111111] uppercase tracking-wider">Product Identity</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 flex flex-col gap-1.5">
                        <label className="text-[12px] font-bold text-[#525866]">Product Name *</label>
                        <input value={form.name} onChange={set('name')} placeholder="e.g. Dangote Cement 50kg"
                          className={`h-11 px-4 bg-[#F7F7F8] border rounded-[12px] text-[14px] font-medium focus:outline-none focus:ring-[3px] focus:ring-[rgba(212,0,115,0.08)] focus:border-[#D40073] transition-all ${submitted && !form.name ? 'border-[#EF4444]' : 'border-[#E4E7EC]'}`} />
                        {submitted && !form.name && <p className="text-[11px] text-[#EF4444] font-bold flex items-center gap-1"><AlertCircle size={11} />Required</p>}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[12px] font-bold text-[#525866]">SKU *</label>
                        <input value={form.sku} onChange={set('sku')} placeholder="CEM-50-D"
                          className={`h-11 px-4 bg-[#F7F7F8] border rounded-[12px] text-[13px] font-mono focus:outline-none focus:ring-[3px] focus:ring-[rgba(212,0,115,0.08)] focus:border-[#D40073] transition-all ${submitted && !form.sku ? 'border-[#EF4444]' : 'border-[#E4E7EC]'}`} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[12px] font-bold text-[#525866]">Category</label>
                        <select value={form.category} onChange={set('category')}
                          className="h-11 px-4 bg-[#F7F7F8] border border-[#E4E7EC] rounded-[12px] text-[14px] font-medium focus:outline-none focus:border-[#D40073] cursor-pointer appearance-none">
                          {MOCK_CATEGORIES.map(c => <option key={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div className="col-span-2 flex flex-col gap-1.5">
                        <label className="text-[12px] font-bold text-[#525866]">Description</label>
                        <textarea value={form.description} onChange={set('description')} rows={3} placeholder="What is this product used for?"
                          className="px-4 py-3 bg-[#F7F7F8] border border-[#E4E7EC] rounded-[12px] text-[14px] font-medium resize-none focus:outline-none focus:ring-[3px] focus:ring-[rgba(212,0,115,0.08)] focus:border-[#D40073] transition-all" />
                      </div>
                    </div>
                  </div>

                  {/* Section: Pricing */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-4 bg-[#D40073] rounded-full" />
                      <h3 className="text-[12px] font-black text-[#111111] uppercase tracking-wider">Pricing</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[12px] font-bold text-[#525866]">Sell Price (GHS) *</label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] font-bold text-[#D40073]">₵</span>
                          <input type="number" min="0" value={form.price} onChange={set('price')} placeholder="0.00"
                            className={`w-full h-11 pl-8 pr-3 bg-[#F7F7F8] border rounded-[12px] text-[14px] font-bold focus:outline-none focus:ring-[3px] focus:ring-[rgba(212,0,115,0.08)] focus:border-[#D40073] transition-all ${submitted && !form.price ? 'border-[#EF4444]' : 'border-[#E4E7EC]'}`} />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[12px] font-bold text-[#525866]">Cost Price (GHS)</label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] font-bold text-[#8B93A7]">₵</span>
                          <input type="number" min="0" value={form.costPrice} onChange={set('costPrice')} placeholder="0.00"
                            className="w-full h-11 pl-8 pr-3 bg-[#F7F7F8] border border-[#E4E7EC] rounded-[12px] text-[14px] font-medium focus:outline-none focus:ring-[3px] focus:ring-[rgba(212,0,115,0.08)] focus:border-[#D40073] transition-all" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[12px] font-bold text-[#525866]">Unit</label>
                        <select value={form.unit} onChange={set('unit')}
                          className="h-11 px-4 bg-[#F7F7F8] border border-[#E4E7EC] rounded-[12px] text-[14px] font-medium focus:outline-none focus:border-[#D40073] cursor-pointer appearance-none">
                          {UNITS.map(u => <option key={u}>{u}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section: Inventory */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-4 bg-[#D40073] rounded-full" />
                      <h3 className="text-[12px] font-black text-[#111111] uppercase tracking-wider">Stock Management</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[12px] font-bold text-[#525866]">Current Stock *</label>
                        <input type="number" min="0" value={form.stock} onChange={set('stock')} placeholder="0"
                          className={`h-11 px-4 bg-[#F7F7F8] border rounded-[12px] text-[14px] font-medium focus:outline-none focus:ring-[3px] focus:ring-[rgba(212,0,115,0.08)] focus:border-[#D40073] transition-all ${submitted && !form.stock ? 'border-[#EF4444]' : 'border-[#E4E7EC]'}`} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[12px] font-bold text-[#525866]">Low Stock Alert At</label>
                        <input type="number" min="1" value={form.lowStockThreshold} onChange={set('lowStockThreshold')}
                          className="h-11 px-4 bg-[#F7F7F8] border border-[#E4E7EC] rounded-[12px] text-[14px] font-medium focus:outline-none focus:ring-[3px] focus:ring-[rgba(212,0,115,0.08)] focus:border-[#D40073] transition-all" />
                      </div>
                      <div className="col-span-2 flex flex-col gap-1.5">
                        <label className="text-[12px] font-bold text-[#525866]">Supplier</label>
                        <input value={form.supplier} onChange={set('supplier')} placeholder="e.g. Dangote Industries"
                          className="h-11 px-4 bg-[#F7F7F8] border border-[#E4E7EC] rounded-[12px] text-[14px] font-medium focus:outline-none focus:ring-[3px] focus:ring-[rgba(212,0,115,0.08)] focus:border-[#D40073] transition-all" />
                      </div>
                      <div className="col-span-2 flex flex-col gap-1.5">
                        <label className="text-[12px] font-bold text-[#525866]">Tags (comma separated)</label>
                        <input value={form.tags} onChange={set('tags')} placeholder="cement, construction, fast-moving"
                          className="h-11 px-4 bg-[#F7F7F8] border border-[#E4E7EC] rounded-[12px] text-[14px] font-medium focus:outline-none focus:ring-[3px] focus:ring-[rgba(212,0,115,0.08)] focus:border-[#D40073] transition-all" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-5 border-t border-[#ECEDEF] bg-[#F7F7F8] flex items-center justify-end gap-3 shrink-0">
              <button onClick={onClose} className="h-11 px-6 bg-white border border-[#ECEDEF] text-[#111111] font-bold rounded-[14px] text-[14px] hover:bg-[#F3F4F6] transition-all">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="h-11 px-8 bg-[#D40073] hover:bg-[#B80063] text-white font-bold rounded-[14px] text-[14px] flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <Check size={18} strokeWidth={2.5} />
                {isEditing ? 'Save Changes' : 'Add Product'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
