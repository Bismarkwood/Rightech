import React from 'react';
import { motion } from 'motion/react';
import { Icon } from '@iconify/react';
import { AlertTriangle, TrendingUp, Package, ArrowUpRight } from 'lucide-react';
import { useProducts } from '../context/ProductContext';

export function ProductOverviewTab() {
  const { products, getLowStockProducts, getOutOfStockProducts, getTotalInventoryValue, categories } = useProducts();

  const totalProducts = products.length;
  const lowStock = getLowStockProducts().length;
  const outOfStock = getOutOfStockProducts().length;
  const inventoryValue = getTotalInventoryValue();
  const inStock = products.filter(p => p.status === 'In Stock').length;

  const KPIs = [
    { label: 'Total Products', value: String(totalProducts), icon: 'solar:box-bold-duotone', color: '#2563EB', bg: 'rgba(37,99,235,0.07)', sub: `${inStock} in stock` },
    { label: 'Inventory Value', value: `GHS ${inventoryValue.toLocaleString()}`, icon: 'solar:dollar-minimalistic-bold-duotone', color: '#D40073', bg: 'rgba(212,0,115,0.07)', sub: 'At retail price' },
    { label: 'Low Stock', value: String(lowStock), icon: 'solar:danger-square-bold-duotone', color: '#D97706', bg: 'rgba(217,119,6,0.07)', sub: 'Needs restock' },
    { label: 'Out of Stock', value: String(outOfStock), icon: 'solar:close-square-bold-duotone', color: '#EF4444', bg: 'rgba(239,68,68,0.07)', sub: 'Urgent restock', critical: outOfStock > 0 },
  ];

  // Category breakdown
  const catBreakdown = categories.map(cat => ({
    ...cat,
    count: products.filter(p => p.category === cat.name).length,
  })).filter(c => c.count > 0).sort((a, b) => b.count - a.count);

  // Alerts
  const alertProducts = [...getLowStockProducts(), ...getOutOfStockProducts()];

  return (
    <div className="space-y-6 pb-10">

      {/* KPI Row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
        {KPIs.map(kpi => (
          <div key={kpi.label} className="group relative bg-white dark:bg-[#151B2B] p-5 rounded-[22px] border border-[#ECEDEF] dark:border-white/10 shadow-sm transition-all hover:translate-y-[-2px] hover:shadow-md overflow-hidden">
             <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-black/5 to-transparent dark:from-white/5 rounded-bl-[40px] transition-transform group-hover:scale-110" />
             <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0 transition-all group-hover:scale-110" style={{ background: kpi.bg }}>
                  <Icon icon={kpi.icon} className="text-[24px]" style={{ color: kpi.color }} />
                </div>
                <div>
                  <p className="text-[11px] font-black text-[#8B93A7] uppercase tracking-widest group-hover:text-[#111111] dark:group-hover:text-white transition-colors">{kpi.label}</p>
                  <p className="text-[24px] font-black text-[#111111] dark:text-white tracking-tighter leading-tight mt-0.5">{kpi.value}</p>
                  <p className={`text-[10px] font-black mt-0.5 uppercase tracking-tighter ${kpi.critical ? 'text-[#EF4444]' : 'text-[#8B93A7]'}`}>{kpi.sub}</p>
                </div>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* Category Breakdown */}
        <div className="lg:col-span-3 bg-white dark:bg-[#151B2B] rounded-[22px] border border-[#ECEDEF] dark:border-white/10 p-7 shadow-sm">
          <h3 className="text-[16px] font-black text-[#111111] dark:text-white mb-5 uppercase tracking-tight">Category Breakdown</h3>
          <div className="space-y-5">
            {catBreakdown.map((cat) => {
              const pct = Math.round((cat.count / totalProducts) * 100);
              return (
                <div key={cat.id} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-[8px] bg-[#F7F7F8] dark:bg-white/5 flex items-center justify-center transition-all group-hover:bg-[#D40073] group-hover:text-white">
                        <Icon icon={cat.icon} className="text-[18px]" />
                      </div>
                      <span className="text-[13px] font-black text-[#525866] dark:text-[#8B93A7] uppercase tracking-wider">{cat.name}</span>
                    </div>
                    <span className="text-[13px] font-black text-[#111111] dark:text-white">{cat.count} <span className="text-[#8B93A7]"> · {pct}%</span></span>
                  </div>
                  <div className="h-1.5 bg-[#F3F4F6] dark:bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                      className="h-full rounded-full bg-[#D40073]"
                      style={{ opacity: 0.4 + pct / 150 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stock Alerts */}
        <div className="lg:col-span-2 bg-white dark:bg-[#151B2B] rounded-[22px] border border-[#ECEDEF] dark:border-white/10 p-7 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[16px] font-black text-[#111111] dark:text-white uppercase tracking-tight">Stock Alerts</h3>
            {alertProducts.length > 0 && (
              <span className="text-[11px] font-black px-2.5 py-1 rounded-[6px] bg-[#FEF2F2] dark:bg-[#7F1D1D]/30 text-[#DC2626] border border-[#DC2626]/10 uppercase tracking-widest shadow-sm">
                {alertProducts.length} ACTIONS
              </span>
            )}
          </div>
          {alertProducts.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-2">
              <div className="w-14 h-14 rounded-[20px] bg-[#ECFDF5] dark:bg-[#064E3B]/30 flex items-center justify-center border border-[#059669]/10">
                <Icon icon="solar:shield-check-bold-duotone" className="text-[32px] text-[#16A34A]" />
              </div>
              <p className="text-[14px] font-black text-[#111111] dark:text-white uppercase tracking-wider mt-4">All stock healthy</p>
              <p className="text-[12px] font-bold text-[#8B93A7] uppercase tracking-tighter">No alerts at this time</p>
            </div>
          ) : (
            <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar">
              {alertProducts.slice(0, 6).map(p => (
                <div key={p.id} className="flex items-center justify-between p-3.5 rounded-[16px] bg-[#F9FAFB] dark:bg-white/5 border border-[#ECEDEF] dark:border-white/10 hover:border-[#D40073]/50 transition-all group cursor-pointer shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-[10px] bg-white dark:bg-white/10 border border-[#ECEDEF] dark:border-white/10 overflow-hidden flex items-center justify-center shadow-sm">
                      {p.image
                        ? <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                        : <Package size={14} className="text-[#8B93A7]" />}
                    </div>
                    <div>
                      <p className="text-[13px] font-black text-[#111111] dark:text-white leading-none group-hover:text-[#D40073] transition-colors uppercase tracking-tight">{p.name}</p>
                      <p className={`text-[11px] font-black mt-1.5 uppercase tracking-widest flex items-center gap-1.5 ${p.status === 'Out of Stock' ? 'text-[#DC2626]' : 'text-[#D97706]'}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                        {p.status === 'Out of Stock' ? 'Critical Out' : `${p.stock} units remaining`}
                      </p>
                    </div>
                  </div>
                  <Icon icon="solar:arrow-right-up-linear" className="text-[#8B93A7] group-hover:text-[#D40073] transition-all" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top Products by Value */}
      <div className="bg-white dark:bg-[#151B2B] rounded-[22px] border border-[#ECEDEF] dark:border-white/10 p-7 shadow-sm">
        <h3 className="text-[16px] font-black text-[#111111] dark:text-white mb-6 uppercase tracking-tight">Top Products by Inventory Value</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] dark:bg-white/5 border-b border-[#ECEDEF] dark:border-white/5">
                {['Product Details', 'Category', 'Stock Level', 'Unit Assessment', 'Total Value'].map(h => (
                  <th key={h} className="py-4 px-4 text-[12px] font-black uppercase tracking-widest text-[#8B93A7]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECEDEF] dark:divide-white/5">
              {[...products]
                .sort((a, b) => (b.price * b.stock) - (a.price * a.stock))
                .slice(0, 5)
                .map(p => (
                  <tr key={p.id} className="hover:bg-[#FBFBFC] dark:hover:bg-white/5 transition-all group cursor-pointer">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-[10px] bg-white dark:bg-white/10 border border-[#ECEDEF] dark:border-white/10 overflow-hidden flex items-center justify-center shadow-sm">
                          {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" /> : <Package size={16} className="text-[#8B93A7]" />}
                        </div>
                        <div>
                          <p className="text-[14px] font-black text-[#111111] dark:text-white group-hover:text-[#D40073] transition-colors uppercase tracking-tight">{p.name}</p>
                          <p className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider mt-1">{p.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                       <span className="text-[12px] font-black text-[#525866] dark:text-[#8B93A7] uppercase tracking-wider">{p.category}</span>
                    </td>
                    <td className="py-4 px-4">
                       <p className="text-[14px] font-black text-[#111111] dark:text-white leading-none">{p.stock.toLocaleString()}</p>
                       <p className="text-[11px] font-bold text-[#8B93A7] mt-1.5 uppercase tracking-widest">{p.unit}S AVAILABLE</p>
                    </td>
                    <td className="py-4 px-4 text-[14px] font-black text-[#111111] dark:text-white tracking-tight">GHS {p.price.toLocaleString()}</td>
                    <td className="py-4 px-4 text-[16px] font-black text-[#D40073] tracking-tighter italic">GHS {(p.price * p.stock).toLocaleString()}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
