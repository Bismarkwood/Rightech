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
        <div className="relative group flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B93A7] group-focus-within:text-[#D40073] transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-11 pl-11 pr-4 bg-white dark:bg-white/5 border border-[#E4E7EC] dark:border-white/10 rounded-[12px] text-[13px] font-bold text-[#111111] dark:text-white placeholder:text-[#8B93A7] focus:outline-none focus:border-[#D40073] focus:ring-4 focus:ring-[#D40073]/5 transition-all shadow-sm"
          />
        </div>

        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
          className="h-11 pl-4 pr-10 bg-white dark:bg-white/5 border border-[#E4E7EC] dark:border-white/10 rounded-[12px] text-[13px] font-bold text-[#525866] dark:text-[#8B93A7] cursor-pointer appearance-none focus:outline-none focus:border-[#D40073] transition-all shadow-sm">
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>

        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="h-11 pl-4 pr-10 bg-white dark:bg-white/5 border border-[#E4E7EC] dark:border-white/10 rounded-[12px] text-[13px] font-bold text-[#525866] dark:text-[#8B93A7] cursor-pointer appearance-none focus:outline-none focus:border-[#D40073] transition-all shadow-sm">
          {['All Status', 'In Stock', 'Low Stock', 'Out of Stock'].map(s => <option key={s}>{s}</option>)}
        </select>

        <button onClick={() => setAddOpen(true)}
          className="h-11 px-6 bg-[#111111] dark:bg-white text-white dark:text-[#111111] text-[13px] font-black rounded-[12px] flex items-center gap-2 hover:bg-[#D40073] hover:text-white transition-all active:scale-95 shadow-sm ml-auto">
          <Plus size={16} strokeWidth={3} />
          Add Product
        </button>
      </div>

      {/* Count */}
      <p className="text-[13px] font-bold text-[#8B93A7] uppercase tracking-wider">
        Showing <span className="text-[#D40073]">{filtered.length}</span> Products
      </p>

      {/* Table */}
      <div className="bg-white dark:bg-[#151B2B] border border-[#ECEDEF] dark:border-white/10 rounded-[22px] overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#F9FAFB] dark:bg-white/5 border-b border-[#ECEDEF] dark:border-white/5">
              <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Product Detail</th>
              <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">SKU</th>
              <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Category</th>
              <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Price</th>
              <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Stock</th>
              <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ECEDEF] dark:divide-white/5">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="py-20 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full bg-[#F9FAFB] dark:bg-white/5 flex items-center justify-center text-[#8B93A7] mb-4">
                      <Icon icon="solar:box-minimalistic-linear" className="text-[32px]" />
                    </div>
                    <p className="text-[16px] font-black text-[#111111] dark:text-white">No products found</p>
                    <p className="text-[14px] text-[#8B93A7] font-bold mt-1 uppercase tracking-wider">Try adjusting your filters</p>
                  </div>
                </td>
              </tr>
            ) : filtered.map(product => {
              const badge = STATUS_BADGE[product.status];
              return (
                <tr key={product.id} className="hover:bg-[#F7F7F8] dark:hover:bg-white/5 transition-colors group cursor-pointer">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-[10px] overflow-hidden bg-[#F3F4F6] dark:bg-white/5 shrink-0 border border-[#ECEDEF] dark:border-white/10 shadow-sm group-hover:scale-105 transition-transform">
                        {product.image
                          ? <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center"><Package size={18} className="text-[#8B93A7]" /></div>}
                      </div>
                      <div>
                        <p className="text-[14px] font-black text-[#111111] dark:text-white group-hover:text-[#D40073] transition-colors line-clamp-1">{product.name}</p>
                        {product.supplier && <p className="text-[11px] font-bold text-[#8B93A7] uppercase mt-0.5">{product.supplier}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 tracking-wider">
                    <code className="text-[11px] font-black text-[#D40073] bg-[#D40073]/5 px-2 py-1 rounded-[6px] border border-[#D40073]/10">{product.sku}</code>
                  </td>
                  <td className="py-4 px-6 text-[13px] font-bold text-[#525866] dark:text-[#8B93A7]">{product.category}</td>
                  <td className="py-4 px-6">
                    <p className="text-[14px] font-black text-[#111111] dark:text-white">GHS {product.price.toLocaleString()}</p>
                    {product.costPrice && <p className="text-[10px] font-bold text-[#8B93A7] uppercase mt-1">COST: {product.costPrice.toLocaleString()}</p>}
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-[14px] font-black text-[#111111] dark:text-white">{product.stock.toLocaleString()} <span className="text-[11px] text-[#8B93A7] font-bold uppercase">{product.unit}S</span></p>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-[6px] text-[11px] font-black uppercase tracking-wider shadow-sm border ${
                      product.status === 'In Stock' ? 'bg-[#ECFDF3] dark:bg-[#064E3B]/30 text-[#16A34A] border-[#16A34A]/10' :
                      product.status === 'Low Stock' ? 'bg-[#FFF7ED] dark:bg-[#78350F]/30 text-[#D97706] border-[#D97706]/10' :
                      'bg-[#FEF2F2] dark:bg-[#7F1D1D]/30 text-[#DC2626] border-[#DC2626]/10'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all justify-end">
                      <button onClick={(e) => { e.stopPropagation(); setEditProduct(product); }}
                        className="w-8 h-8 rounded-[8px] border border-transparent hover:border-[#ECEDEF] dark:hover:border-white/10 flex items-center justify-center text-[#8B93A7] hover:bg-white dark:hover:bg-white/10 hover:text-[#111111] dark:hover:text-white transition-all shadow-sm">
                        <Edit2 size={14} strokeWidth={2.5} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(product.id); }}
                        className="w-8 h-8 rounded-[8px] border border-transparent hover:border-[#FCA5A5]/20 flex items-center justify-center text-[#8B93A7] hover:bg-[#FEF2F2] dark:hover:bg-[#EF4444]/10 hover:text-[#EF4444] transition-all shadow-sm">
                        <Trash2 size={14} strokeWidth={2.5} />
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
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setConfirmDelete(null)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 bg-white dark:bg-[#151B2B] rounded-[28px] p-8 w-full max-w-[400px] border border-[#ECEDEF] dark:border-white/10 shadow-2xl text-center"
            >
              <div className="w-16 h-16 rounded-full bg-[#FEF2F2] dark:bg-[#7F1D1D]/20 flex items-center justify-center mx-auto mb-6 text-[#EF4444]">
                <Trash2 size={28} strokeWidth={2.5} />
              </div>
              <h3 className="text-[22px] font-black text-[#111111] dark:text-white tracking-tight">Delete Product?</h3>
              <p className="text-[15px] font-bold text-[#8B93A7] mt-3 leading-relaxed uppercase tracking-wider">This action is permanent and cannot be undone.</p>
              
              <div className="flex gap-3 mt-8">
                <button onClick={() => setConfirmDelete(null)}
                  className="flex-1 h-12 bg-[#F9FAFB] dark:bg-white/5 rounded-[14px] text-[14px] font-black text-[#111111] dark:text-white hover:bg-[#F3F4F6] dark:hover:bg-white/10 transition-all border border-transparent hover:border-[#ECEDEF] dark:hover:border-white/10">
                  CANCEL
                </button>
                <button onClick={() => { deleteProduct(confirmDelete); setConfirmDelete(null); }}
                  className="flex-1 h-12 bg-[#EF4444] text-white rounded-[14px] text-[14px] font-black hover:bg-[#DC2626] transition-all shadow-lg shadow-[#EF4444]/20 uppercase tracking-widest">
                  DELETE
                </button>
              </div>
            </motion.div>
          </div>
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
