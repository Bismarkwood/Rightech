import React, { useState } from 'react';
import { Search, Filter, Plus, PackageSearch, AlertCircle, ShoppingCart } from 'lucide-react';

const MOCK_PRODUCTS = [
  { id: 'PRD-01', name: 'Dangote Cement (50kg)', sku: 'CEM-50-D', stock: 450, price: '85 GHS', category: 'Building Materials', status: 'In Stock' },
  { id: 'PRD-02', name: 'Iron Rods (16mm)', sku: 'IR-16-T', stock: 120, price: '120 GHS', category: 'Metals', status: 'In Stock' },
  { id: 'PRD-03', name: 'PVC Pipe (3 inch)', sku: 'PVC-3-P', stock: 15, price: '45 GHS', category: 'Plumbing', status: 'Low Stock' },
  { id: 'PRD-04', name: 'White Paint (20L)', sku: 'PNT-W-20', stock: 0, price: '250 GHS', category: 'Finishing', status: 'Out of Stock' },
  { id: 'PRD-05', name: 'Roofing Sheets (Aluzinc)', sku: 'RF-AL-Z', stock: 300, price: '850 GHS', category: 'Roofing', status: 'In Stock' },
  { id: 'PRD-06', name: 'Floor Tiles (60x60)', sku: 'TL-FL-60', stock: 85, price: '120 GHS/sqm', category: 'Finishing', status: 'In Stock' },
];

export function StorefrontTab() {
  return (
    <div className="bg-white rounded-[16px] border border-[#ECEDEF] flex flex-col min-h-[600px]">
      {/* Header and Search */}
      <div className="p-4 border-b border-[#ECEDEF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative group w-full sm:w-[320px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B93A7] group-focus-within:text-[#D40073] transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search inventory..." 
            className="w-full h-9 pl-9 pr-4 bg-[#F7F7F8] border border-transparent rounded-[8px] text-[13px] text-[#111111] placeholder:text-[#8B93A7] focus:outline-none focus:bg-white focus:border-[#D40073] transition-all"
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="h-9 px-3 flex items-center gap-2 bg-[#F7F7F8] border border-transparent rounded-[8px] text-[13px] font-semibold text-[#111111] hover:bg-[#E4E7EC] transition-colors">
            <Filter size={14} />
            Categories
          </button>
          <div className="h-9 flex items-center gap-2 px-3 bg-[#EFF6FF] text-[#2563EB] rounded-[8px] text-[13px] font-bold">
            <ShoppingCart size={16} />
            Cart (0)
          </div>
        </div>
      </div>

      {/* Grid of Products */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 flex-1 overflow-y-auto">
        {MOCK_PRODUCTS.map((product) => (
          <div key={product.id} className="border border-[#ECEDEF] rounded-[16px] overflow-hidden hover:border-[#D40073]/50 transition-colors group flex flex-col">
            <div className="h-[140px] bg-[#F7F7F8] flex items-center justify-center relative">
              <PackageSearch size={40} className="text-[#8B93A7] opacity-20" />
              {product.status === 'Low Stock' && (
                <div className="absolute top-3 left-3 bg-[#FFF7ED] text-[#D97706] px-2 py-1 rounded-[6px] text-[11px] font-bold flex items-center gap-1 border border-[#FFEDD5]">
                  <AlertCircle size={12} /> Low Stock
                </div>
              )}
              {product.status === 'Out of Stock' && (
                <div className="absolute top-3 left-3 bg-[#FEF2F2] text-[#DC2626] px-2 py-1 rounded-[6px] text-[11px] font-bold border border-[#FECACA]">
                  Out of Stock
                </div>
              )}
            </div>
            
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex items-start justify-between mb-1">
                <span className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider">{product.category}</span>
                <span className="text-[12px] font-medium text-[#525866]">{product.sku}</span>
              </div>
              <h3 className="text-[14px] font-bold text-[#111111] mb-2 leading-tight">{product.name}</h3>
              
              <div className="mt-auto pt-4 flex items-end justify-between">
                <div>
                  <p className="text-[18px] font-bold text-[#111111]">{product.price}</p>
                  <p className={`text-[12px] font-semibold mt-0.5 ${
                    product.stock === 0 ? 'text-[#DC2626]' : 
                    product.stock < 50 ? 'text-[#D97706]' : 'text-[#16A34A]'
                  }`}>
                    {product.stock} available
                  </p>
                </div>
                
                <button 
                  disabled={product.stock === 0}
                  className={`w-9 h-9 rounded-[8px] flex items-center justify-center transition-colors ${
                    product.stock === 0 
                      ? 'bg-[#F3F4F6] text-[#8B93A7] cursor-not-allowed' 
                      : 'bg-[#F7F7F8] text-[#111111] hover:bg-[#D40073] hover:text-white group-hover:border-[#D40073]'
                  }`}
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}