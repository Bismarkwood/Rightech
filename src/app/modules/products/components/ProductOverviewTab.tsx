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
          <div key={kpi.label} className="bg-white rounded-[22px] border border-[#ECEDEF] p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0" style={{ background: kpi.bg }}>
              <Icon icon={kpi.icon} className="text-[24px]" style={{ color: kpi.color }} />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#8B93A7]">{kpi.label}</p>
              <p className="text-[22px] font-black text-[#111111] tracking-tight leading-tight mt-0.5">{kpi.value}</p>
              <p className={`text-[11px] font-medium mt-0.5 ${kpi.critical ? 'text-[#EF4444] font-bold' : 'text-[#8B93A7]'}`}>{kpi.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* Category Breakdown */}
        <div className="lg:col-span-3 bg-white rounded-[22px] border border-[#ECEDEF] p-7">
          <h3 className="text-[16px] font-black text-[#111111] mb-5">Category Breakdown</h3>
          <div className="space-y-4">
            {catBreakdown.map((cat) => {
              const pct = Math.round((cat.count / totalProducts) * 100);
              return (
                <div key={cat.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <Icon icon={cat.icon} className="text-[18px] text-[#8B93A7]" />
                      <span className="text-[13px] font-bold text-[#525866]">{cat.name}</span>
                    </div>
                    <span className="text-[13px] font-black text-[#111111]">{cat.count} · {pct}%</span>
                  </div>
                  <div className="h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
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
        <div className="lg:col-span-2 bg-white rounded-[22px] border border-[#ECEDEF] p-7 flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[16px] font-black text-[#111111]">Stock Alerts</h3>
            {alertProducts.length > 0 && (
              <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-[#EF4444]/10 text-[#EF4444]">
                {alertProducts.length} items
              </span>
            )}
          </div>
          {alertProducts.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-2">
              <div className="w-12 h-12 rounded-full bg-[#ECFDF3] flex items-center justify-center">
                <Icon icon="solar:shield-check-bold-duotone" className="text-[24px] text-[#16A34A]" />
              </div>
              <p className="text-[14px] font-bold text-[#111111]">All stock healthy</p>
              <p className="text-[12px] font-medium text-[#8B93A7]">No alerts at this time</p>
            </div>
          ) : (
            <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar">
              {alertProducts.slice(0, 6).map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-[14px] bg-[#F9FAFB] border border-[#ECEDEF] hover:border-[#D40073]/30 transition-all group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-[8px] bg-[#F3F4F6] flex items-center justify-center">
                      {p.image
                        ? <img src={p.image} alt={p.name} className="w-full h-full object-cover rounded-[8px]" />
                        : <Package size={14} className="text-[#8B93A7]" />}
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-[#111111] leading-tight">{p.name}</p>
                      <p className={`text-[11px] font-bold mt-0.5 ${p.status === 'Out of Stock' ? 'text-[#EF4444]' : 'text-[#D97706]'}`}>
                        {p.status === 'Out of Stock' ? '⚠ Out of Stock' : `⚡ ${p.stock} left`}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight size={14} className="text-[#8B93A7] group-hover:text-[#D40073] transition-colors" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top Products by Value */}
      <div className="bg-white rounded-[22px] border border-[#ECEDEF] p-7">
        <h3 className="text-[16px] font-black text-[#111111] mb-5">Top Products by Inventory Value</h3>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#F1F3F5]">
              {['Product', 'Category', 'Stock', 'Unit Price', 'Total Value'].map(h => (
                <th key={h} className="py-2 px-3 text-[11px] font-bold uppercase tracking-wider text-[#8B93A7]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F7F7F8]">
            {[...products]
              .sort((a, b) => (b.price * b.stock) - (a.price * a.stock))
              .slice(0, 5)
              .map(p => (
                <tr key={p.id} className="hover:bg-[#F9FAFB] transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-[8px] bg-[#F3F4F6] flex items-center justify-center">
                        {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover rounded-[8px]" /> : <Package size={14} className="text-[#8B93A7]" />}
                      </div>
                      <span className="text-[14px] font-bold text-[#111111]">{p.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-[13px] font-medium text-[#525866]">{p.category}</td>
                  <td className="py-3 px-3 text-[14px] font-bold text-[#111111]">{p.stock.toLocaleString()} {p.unit}s</td>
                  <td className="py-3 px-3 text-[14px] font-bold text-[#111111]">GHS {p.price.toLocaleString()}</td>
                  <td className="py-3 px-3 text-[14px] font-black text-[#D40073]">GHS {(p.price * p.stock).toLocaleString()}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
