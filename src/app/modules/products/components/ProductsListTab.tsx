import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from '@iconify/react';
import { Search, Plus, Edit2, Trash2, Package, MoreVertical, ChevronDown } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { Product } from '../../../core/data/productData';
import { ProductFormModal } from './ProductFormModal';

const STATUS_BADGE = {
  'In Stock': { bg: '#ECFDF3', color: '#16A34A' },
  'Low Stock': { bg: '#FFF7ED', color: '#D97706' },
  'Out of Stock': { bg: '#FEF2F2', color: '#EF4444' },
};

type SortKey = 'name' | 'stock' | 'price' | 'category';

export function ProductsListTab() {
  const { products, deleteProduct } = useProducts();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState<SortKey>('name');
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map(p => p.category)));
    return ['All', ...unique];
  }, [products]);

  const filtered = useMemo(() => {
    return products
      .filter(p => {
        const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
        const matchCat = categoryFilter === 'All' || p.category === categoryFilter;
        const matchStatus = statusFilter === 'All' || p.status === statusFilter;
        return matchSearch && matchCat && matchStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'stock') return b.stock - a.stock;
        if (sortBy === 'price') return b.price - a.price;
        if (sortBy === 'category') return a.category.localeCompare(b.category);
        return 0;
      });
  }, [products, search, categoryFilter, statusFilter, sortBy]);

  return (
    <div className="space-y-5 pb-10">

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative group flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B93A7] group-focus-within:text-[#D40073] transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-white border border-[#E4E7EC] rounded-[12px] text-[13px] font-medium focus:outline-none focus:border-[#D40073] focus:ring-[3px] focus:ring-[rgba(212,0,115,0.08)] transition-all"
          />
        </div>

        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
          className="h-10 pl-4 pr-8 bg-white border border-[#E4E7EC] rounded-[12px] text-[13px] font-bold text-[#525866] cursor-pointer appearance-none focus:outline-none focus:border-[#D40073] transition-all">
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>

        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="h-10 pl-4 pr-8 bg-white border border-[#E4E7EC] rounded-[12px] text-[13px] font-bold text-[#525866] cursor-pointer appearance-none focus:outline-none focus:border-[#D40073] transition-all">
          {['All', 'In Stock', 'Low Stock', 'Out of Stock'].map(s => <option key={s}>{s}</option>)}
        </select>

        <select value={sortBy} onChange={e => setSortBy(e.target.value as SortKey)}
          className="h-10 pl-4 pr-8 bg-white border border-[#E4E7EC] rounded-[12px] text-[13px] font-bold text-[#525866] cursor-pointer appearance-none focus:outline-none focus:border-[#D40073] transition-all">
          <option value="name">Sort: Name</option>
          <option value="stock">Sort: Stock</option>
          <option value="price">Sort: Price</option>
          <option value="category">Sort: Category</option>
        </select>

        <button onClick={() => setAddOpen(true)}
          className="h-10 px-5 bg-[#D40073] hover:bg-[#B80063] text-white text-[13px] font-bold rounded-[12px] flex items-center gap-2 transition-colors shadow-sm shadow-[#D40073]/20 shrink-0 ml-auto">
          <Plus size={15} strokeWidth={2.5} />
          Add Product
        </button>
      </div>

      {/* Count */}
      <p className="text-[13px] font-medium text-[#8B93A7]">
        Showing <span className="font-bold text-[#111111]">{filtered.length}</span> of {products.length} products
      </p>

      {/* Table */}
      <div className="bg-white border border-[#ECEDEF] rounded-[22px] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#F7F7F8] border-b border-[#ECEDEF]">
              <th className="py-3.5 px-6 text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider">Product</th>
              <th className="py-3.5 px-5 text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider">SKU</th>
              <th className="py-3.5 px-5 text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider">Category</th>
              <th className="py-3.5 px-5 text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider">Price</th>
              <th className="py-3.5 px-5 text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider">Stock</th>
              <th className="py-3.5 px-5 text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider">Status</th>
              <th className="py-3.5 px-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F7F7F8]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="py-16 flex flex-col items-center justify-center text-center">
                    <Icon icon="solar:box-minimalistic-linear" className="text-[48px] text-[#ECEDEF] mb-3" />
                    <p className="text-[15px] font-bold text-[#8B93A7]">No products found</p>
                    <p className="text-[13px] text-[#B0B7C3] font-medium mt-1">Try adjusting your filters</p>
                  </div>
                </td>
              </tr>
            ) : filtered.map(product => {
              const badge = STATUS_BADGE[product.status];
              return (
                <tr key={product.id} className="hover:bg-[#FBFBFC] transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-[10px] overflow-hidden bg-[#F3F4F6] shrink-0 border border-[#ECEDEF]">
                        {product.image
                          ? <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center"><Package size={16} className="text-[#8B93A7]" /></div>}
                      </div>
                      <div>
                        <p className="text-[14px] font-bold text-[#111111] group-hover:text-[#D40073] transition-colors">{product.name}</p>
                        {product.supplier && <p className="text-[12px] font-medium text-[#8B93A7]">{product.supplier}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <code className="text-[12px] font-mono font-bold text-[#525866] bg-[#F3F4F6] px-2 py-1 rounded-[6px]">{product.sku}</code>
                  </td>
                  <td className="py-4 px-5 text-[13px] font-medium text-[#525866]">{product.category}</td>
                  <td className="py-4 px-5">
                    <p className="text-[14px] font-black text-[#111111]">GHS {product.price.toLocaleString()}</p>
                    {product.costPrice && <p className="text-[11px] font-medium text-[#8B93A7]">Cost: GHS {product.costPrice.toLocaleString()}</p>}
                  </td>
                  <td className="py-4 px-5">
                    <p className="text-[14px] font-bold text-[#111111]">{product.stock.toLocaleString()} <span className="text-[12px] text-[#8B93A7] font-medium">{product.unit}s</span></p>
                  </td>
                  <td className="py-4 px-5">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold" style={{ background: badge.bg, color: badge.color }}>
                      {product.status}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                      <button onClick={() => setEditProduct(product)}
                        className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#525866] hover:bg-[#F3F4F6] hover:text-[#111111] transition-all">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => setConfirmDelete(product.id)}
                        className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#525866] hover:bg-[#FEF2F2] hover:text-[#EF4444] transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Delete Confirm */}
      <AnimatePresence>
        {confirmDelete && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setConfirmDelete(null)} className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[200]" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[210] bg-white rounded-[24px] p-8 shadow-2xl w-[380px] border border-[#ECEDEF]"
            >
              <div className="w-14 h-14 rounded-full bg-[#FEF2F2] flex items-center justify-center mx-auto mb-5">
                <Trash2 size={24} className="text-[#EF4444]" />
              </div>
              <h3 className="text-[18px] font-black text-[#111111] text-center">Delete Product?</h3>
              <p className="text-[14px] font-medium text-[#525866] text-center mt-2">This action cannot be undone. The product will be permanently removed.</p>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setConfirmDelete(null)}
                  className="flex-1 h-11 bg-[#F3F4F6] rounded-[14px] text-[14px] font-bold text-[#111111] hover:bg-[#E5E7EB] transition-all">
                  Cancel
                </button>
                <button onClick={() => { deleteProduct(confirmDelete); setConfirmDelete(null); }}
                  className="flex-1 h-11 bg-[#EF4444] text-white rounded-[14px] text-[14px] font-bold hover:bg-[#DC2626] transition-all">
                  Delete
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modals */}
      <ProductFormModal isOpen={addOpen} onClose={() => setAddOpen(false)} />
      {editProduct && (
        <ProductFormModal isOpen={!!editProduct} onClose={() => setEditProduct(null)} editProduct={editProduct} />
      )}
    </div>
  );
}
