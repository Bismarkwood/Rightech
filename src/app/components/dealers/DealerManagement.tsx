import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Filter, Plus, ArrowLeft, MoreHorizontal, ShoppingCart,
  CreditCard, Clock, AlertCircle, ArrowUpRight, Package, Truck,
  ChevronRight, CheckCircle2, X
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

// Mock Data
const MOCK_DEALERS = [
  { id: 'DLR-101', name: 'Kwame Trading Ltd', location: 'Accra', score: 82, risk: 'Low', outstanding: '12,400 GHS', lastOrder: '2 days ago', status: 'Active' },
  { id: 'DLR-102', name: 'BuildRight Supplies', location: 'Kumasi', score: 45, risk: 'High', outstanding: '45,000 GHS', lastOrder: '15 days ago', status: 'Active' },
  { id: 'DLR-103', name: 'Osei & Sons Hardware', location: 'Tema', score: 68, risk: 'Medium', outstanding: '8,200 GHS', lastOrder: '5 days ago', status: 'Active' },
  { id: 'DLR-104', name: 'Asempa Ventures', location: 'Takoradi', score: 91, risk: 'Low', outstanding: '0 GHS', lastOrder: '1 day ago', status: 'Active' },
  { id: 'DLR-105', name: 'City Building Materials', location: 'Accra', score: 85, risk: 'Low', outstanding: '3,500 GHS', lastOrder: '4 days ago', status: 'Active' },
];

const MOCK_PRODUCTS = [
  { id: 'PRD-1', name: 'Dangote Cement (50kg)', category: 'Cement', price: 95, stock: 1200, image: 'https://images.unsplash.com/photo-1523293915678-d126868e96f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjZW1lbnQlMjBiYWdzfGVufDF8fHx8MTc3NDQ0MzEzNXww&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'PRD-2', name: 'Iron Rods 16mm (Ton)', category: 'Steel', price: 7500, stock: 45, image: 'https://images.unsplash.com/photo-1582540730843-f4418d96ccbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGVlbCUyMHJlYmFyc3xlbnwxfHx8fDE3NzQ0NDMxMzl8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'PRD-3', name: 'Aluzinc Roofing (Bundle)', category: 'Roofing', price: 2400, stock: 80, image: 'https://images.unsplash.com/photo-1655373617557-7138d45582d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb29maW5nJTIwc2hlZXRzfGVufDF8fHx8MTc3NDQ0MzE0M3ww&ixlib=rb-4.1.0&q=80&w=1080' },
];

const PROFILE_TABS = ['Overview', 'Orders', 'Payments', 'Consignment', 'Credit'];

export function DealerManagement() {
  const [selectedDealer, setSelectedDealer] = useState<any>(null);
  const [activeProfileTab, setActiveProfileTab] = useState('Overview');
  const [isOrdering, setIsOrdering] = useState(false);
  const [cart, setCart] = useState<{product: any, qty: number}[]>([]);

  // Helpers
  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const updateQty = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = Math.max(0, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }).filter(item => item.qty > 0));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.qty), 0);

  // Components
  const Card = ({ children, className = "" }: any) => (
    <div className={`bg-white rounded-[18px] border border-[#ECEDEF] overflow-hidden ${className}`}>
      {children}
    </div>
  );

  const getRiskColor = (risk: string) => {
    if (risk === 'Low') return 'bg-[#ECFDF3] text-[#16A34A]';
    if (risk === 'Medium') return 'bg-[#FFF7ED] text-[#D97706]';
    return 'bg-[#FEF2F2] text-[#DC2626]';
  };

  return (
    <div className="h-full flex flex-col relative w-full">
      <AnimatePresence mode="wait">
        
        {/* --- DEALER LIST VIEW --- */}
        {!selectedDealer && (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full max-w-[1600px] mx-auto flex flex-col min-h-0"
          >
            <Card className="flex flex-col h-full min-h-0">
              {/* Header / Filters */}
              <div className="p-4 border-b border-[#ECEDEF] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
                <div className="relative group w-full sm:w-[320px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B93A7] group-focus-within:text-[#D40073] transition-colors" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search dealers..." 
                    className="w-full h-9 pl-9 pr-4 bg-[#F7F7F8] border border-transparent rounded-[8px] text-[13px] text-[#111111] placeholder:text-[#8B93A7] focus:outline-none focus:bg-white focus:border-[#D40073] transition-all"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button className="h-9 px-3 flex items-center gap-2 bg-white border border-[#E4E7EC] rounded-[8px] text-[13px] font-medium text-[#111111] hover:bg-[#F3F4F6] transition-colors">
                    <Filter size={14} />
                    Filter Risk
                  </button>
                  <button className="h-9 px-3 flex items-center gap-2 bg-[#D40073] hover:bg-[#B80063] text-white rounded-[8px] text-[13px] font-semibold transition-colors">
                    <Plus size={14} />
                    Add Dealer
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="flex-1 overflow-x-auto overflow-y-auto min-h-0">
                <table className="w-full text-left border-collapse relative">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-[#F7F7F8] border-b border-[#ECEDEF]">
                      <th className="py-3 px-5 text-[12px] font-semibold text-[#525866] uppercase tracking-wider">Dealer Name</th>
                      <th className="py-3 px-5 text-[12px] font-semibold text-[#525866] uppercase tracking-wider">Credit Score</th>
                      <th className="py-3 px-5 text-[12px] font-semibold text-[#525866] uppercase tracking-wider">Outstanding Balance</th>
                      <th className="py-3 px-5 text-[12px] font-semibold text-[#525866] uppercase tracking-wider">Last Order</th>
                      <th className="py-3 px-5 text-[12px] font-semibold text-[#525866] uppercase tracking-wider">Status</th>
                      <th className="py-3 px-5 text-[12px] font-semibold text-[#525866] uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-[13px]">
                    {MOCK_DEALERS.map((dealer) => (
                      <tr 
                        key={dealer.id} 
                        onClick={() => setSelectedDealer(dealer)}
                        className="border-b border-[#ECEDEF] last:border-0 hover:bg-[#FBFBFC] transition-colors cursor-pointer group"
                      >
                        <td className="py-4 px-5">
                          <div className="font-semibold text-[#111111] flex items-center gap-2">
                            {dealer.name}
                            <ArrowUpRight size={14} className="text-[#8B93A7] opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="text-[12px] text-[#8B93A7] mt-0.5">{dealer.id} • {dealer.location}</div>
                        </td>
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#111111]">{dealer.score}</span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-[4px] text-[11px] font-bold ${getRiskColor(dealer.risk)}`}>
                              {dealer.risk}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-5">
                          <span className={`font-semibold ${dealer.outstanding !== '0 GHS' ? 'text-[#111111]' : 'text-[#8B93A7]'}`}>
                            {dealer.outstanding}
                          </span>
                        </td>
                        <td className="py-4 px-5 font-medium text-[#525866]">{dealer.lastOrder}</td>
                        <td className="py-4 px-5">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-[6px] text-[12px] font-semibold bg-[#F3F4F6] text-[#525866]">
                            {dealer.status}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-right">
                          <button className="w-8 h-8 inline-flex items-center justify-center text-[#8B93A7] hover:text-[#111111] hover:bg-[#F3F4F6] rounded-[8px] transition-colors">
                            <MoreHorizontal size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        )}

        {/* --- DEALER PROFILE VIEW --- */}
        {selectedDealer && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full max-w-[1600px] mx-auto flex flex-col space-y-6 min-h-0"
          >
            {/* Breadcrumb & Actions */}
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setSelectedDealer(null)}
                className="flex items-center gap-2 text-[14px] font-medium text-[#525866] hover:text-[#111111] transition-colors"
              >
                <ArrowLeft size={16} />
                Back to Dealers
              </button>
              <div className="flex items-center gap-3">
                <button className="h-[40px] px-4 flex items-center gap-2 bg-white border border-[#E4E7EC] rounded-[12px] text-[14px] font-semibold text-[#111111] hover:bg-[#F3F4F6] transition-colors">
                  <CreditCard size={16} />
                  Record Payment
                </button>
                <button 
                  onClick={() => setIsOrdering(true)}
                  className="h-[40px] px-4 flex items-center gap-2 bg-[#D40073] hover:bg-[#B80063] text-white rounded-[12px] text-[14px] font-semibold transition-colors"
                >
                  <Plus size={16} />
                  Add Order
                </button>
              </div>
            </div>

            {/* Profile Header */}
            <Card className="p-6 bg-white flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-[64px] h-[64px] rounded-[16px] bg-[#F7F7F8] border border-[#ECEDEF] flex items-center justify-center text-[24px] font-bold text-[#111111]">
                  {selectedDealer.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-[24px] font-bold text-[#111111] tracking-tight mb-1">{selectedDealer.name}</h2>
                  <div className="flex items-center gap-3 text-[13px] text-[#525866] font-medium">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#16A34A]"></span> {selectedDealer.status}</span>
                    <span>•</span>
                    <span>{selectedDealer.location}</span>
                    <span>•</span>
                    <span>ID: {selectedDealer.id}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-8">
                <div>
                  <p className="text-[13px] text-[#525866] font-medium mb-1">Credit Score</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[20px] font-bold text-[#111111]">{selectedDealer.score}</span>
                    <span className={`inline-flex px-2 py-0.5 rounded-[4px] text-[11px] font-bold ${getRiskColor(selectedDealer.risk)}`}>
                      {selectedDealer.risk} Risk
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-[13px] text-[#525866] font-medium mb-1">Outstanding</p>
                  <span className={`text-[20px] font-bold ${selectedDealer.outstanding !== '0 GHS' ? 'text-[#DC2626]' : 'text-[#111111]'}`}>
                    {selectedDealer.outstanding}
                  </span>
                </div>
              </div>
            </Card>

            {/* Sub Nav */}
            <div className="flex items-center gap-6 border-b border-[#ECEDEF]">
              {PROFILE_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveProfileTab(tab)}
                  className={`pb-3 text-[14px] font-medium whitespace-nowrap transition-colors relative ${
                    activeProfileTab === tab ? 'text-[#D40073]' : 'text-[#525866] hover:text-[#111111]'
                  }`}
                >
                  {tab}
                  {activeProfileTab === tab && (
                    <motion.div
                      layoutId="profileTabIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D40073]"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Profile Tab Contents */}
            <div className="flex-1 overflow-y-auto min-h-0 pb-6">
              {activeProfileTab === 'Overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: Stats & Credit */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Card className="p-5 bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] text-white border-0 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-[100px] h-[100px] bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/3"></div>
                        <p className="text-[13px] font-medium text-white/80 mb-1 relative z-10">Total Orders</p>
                        <p className="text-[24px] font-bold text-white relative z-10">142</p>
                      </Card>
                      <Card className="p-5 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] text-white border-0 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-[100px] h-[100px] bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/3"></div>
                        <p className="text-[13px] font-medium text-white/80 mb-1 relative z-10">Total Payments</p>
                        <p className="text-[24px] font-bold text-white relative z-10">1.2M <span className="text-[14px] text-white/70">GHS</span></p>
                      </Card>
                      <Card className="p-5 bg-gradient-to-br from-[#EF4444] to-[#DC2626] text-white border-0 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-[100px] h-[100px] bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/3"></div>
                        <p className="text-[13px] font-medium text-white/80 mb-1 relative z-10">Outstanding</p>
                        <p className="text-[24px] font-bold text-white relative z-10">{selectedDealer.outstanding}</p>
                      </Card>
                      <Card className="p-5 bg-gradient-to-br from-[#10B981] to-[#059669] text-white border-0 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-[100px] h-[100px] bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/3"></div>
                        <p className="text-[13px] font-medium text-white/80 mb-1 relative z-10">Credit Limit</p>
                        <p className="text-[24px] font-bold text-white relative z-10">50K <span className="text-[14px] text-white/70">GHS</span></p>
                      </Card>
                    </div>

                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-[16px] font-bold text-[#111111]">Credit Usage</h3>
                        <span className="text-[13px] font-medium text-[#D40073]">Adjust Limit</span>
                      </div>
                      <div className="mb-2 flex items-center justify-between text-[13px] font-medium">
                        <span className="text-[#525866]">Used: 12,400 GHS</span>
                        <span className="text-[#111111]">Limit: 50,000 GHS</span>
                      </div>
                      <div className="w-full h-[8px] bg-[#F3F4F6] rounded-full overflow-hidden">
                        <div className="h-full bg-[#D40073] rounded-full" style={{ width: '25%' }}></div>
                      </div>
                    </Card>
                  </div>

                  {/* Right Column: Activity & Alerts */}
                  <div className="space-y-6">
                    <Card className="p-0">
                      <div className="p-4 border-b border-[#ECEDEF]">
                        <h3 className="text-[14px] font-bold text-[#111111]">Recent Alerts</h3>
                      </div>
                      <div className="p-4 flex flex-col gap-3">
                        <div className="flex gap-3">
                          <AlertCircle size={16} className="text-[#DC2626] mt-0.5" />
                          <div>
                            <p className="text-[13px] font-semibold text-[#111111]">Payment Overdue</p>
                            <p className="text-[12px] text-[#525866]">Invoice #INV-092 is 3 days late.</p>
                          </div>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-0">
                      <div className="p-4 border-b border-[#ECEDEF]">
                        <h3 className="text-[14px] font-bold text-[#111111]">Recent Activity</h3>
                      </div>
                      <div className="p-4 flex flex-col gap-4">
                        {[1,2,3].map((i) => (
                          <div key={i} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center shrink-0">
                              {i === 1 ? <Package size={14} className="text-[#525866]"/> : <CreditCard size={14} className="text-[#525866]"/>}
                            </div>
                            <div>
                              <p className="text-[13px] font-medium text-[#111111]">
                                {i === 1 ? 'Placed Order #ORD-102' : 'Made Payment of 5,000 GHS'}
                              </p>
                              <p className="text-[12px] text-[#8B93A7]">{i} days ago</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {activeProfileTab !== 'Overview' && (
                <Card className="p-12 flex flex-col items-center justify-center text-center h-[300px]">
                  <div className="w-16 h-16 bg-[#F3F4F6] rounded-[16px] flex items-center justify-center mb-4">
                    <CheckCircle2 size={24} className="text-[#8B93A7]" />
                  </div>
                  <h3 className="text-[18px] font-bold text-[#111111] mb-2">{activeProfileTab} Module</h3>
                  <p className="text-[14px] text-[#525866] max-w-[300px]">
                    This section is part of the dealer management system and will be populated with specific {activeProfileTab.toLowerCase()} data.
                  </p>
                </Card>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- ADD ORDER DRAWER (BROWSE PRODUCTS) --- */}
      <AnimatePresence>
        {isOrdering && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOrdering(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[600px] bg-white z-50 border-l border-[#ECEDEF] flex flex-col"
            >
              {/* Drawer Header */}
              <div className="px-6 py-5 border-b border-[#ECEDEF] flex items-center justify-between bg-white shrink-0">
                <div>
                  <h2 className="text-[20px] font-bold text-[#111111]">New Order</h2>
                  <p className="text-[13px] text-[#525866]">For {selectedDealer?.name}</p>
                </div>
                <button 
                  onClick={() => setIsOrdering(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F3F4F6] text-[#525866] hover:bg-[#E4E7EC] transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto flex flex-col bg-[#F7F7F8]">
                {/* Product Catalog */}
                <div className="p-6 border-b border-[#ECEDEF] bg-white">
                  <h3 className="text-[14px] font-bold text-[#111111] mb-4">Browse Products</h3>
                  <div className="relative group w-full mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B93A7]" size={16} />
                    <input 
                      type="text" 
                      placeholder="Search catalog..." 
                      className="w-full h-10 pl-9 pr-4 bg-[#F7F7F8] border border-transparent rounded-[8px] text-[13px] text-[#111111] focus:outline-none focus:bg-white focus:border-[#D40073]"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {MOCK_PRODUCTS.map((product) => (
                      <div key={product.id} className="flex items-center gap-4 p-3 border border-[#ECEDEF] rounded-[12px] hover:border-[#D40073]/30 transition-colors">
                        <div className="w-[60px] h-[60px] rounded-[8px] bg-[#F3F4F6] overflow-hidden shrink-0">
                          <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-[14px] font-semibold text-[#111111]">{product.name}</h4>
                          <div className="flex items-center gap-2 text-[12px] text-[#525866] mt-0.5">
                            <span className="font-bold text-[#D40073]">{product.price} GHS</span>
                            <span>•</span>
                            <span>{product.stock} in stock</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => addToCart(product)}
                          className="px-3 py-1.5 bg-[#F7F7F8] hover:bg-[#E4E7EC] text-[#111111] text-[12px] font-bold rounded-[6px] transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cart Area */}
                <div className="p-6 flex-1 bg-[#F7F7F8]">
                  <h3 className="text-[14px] font-bold text-[#111111] mb-4 flex items-center justify-between">
                    <span>Order Summary</span>
                    <span className="text-[#8B93A7]">{cart.length} items</span>
                  </h3>
                  
                  {cart.length === 0 ? (
                    <div className="h-[150px] flex flex-col items-center justify-center text-center border-2 border-dashed border-[#ECEDEF] rounded-[16px]">
                      <ShoppingCart size={24} className="text-[#8B93A7] mb-2" />
                      <p className="text-[13px] text-[#525866]">Cart is empty</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {cart.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-white border border-[#ECEDEF] rounded-[12px]">
                          <div>
                            <p className="text-[13px] font-semibold text-[#111111]">{item.product.name}</p>
                            <p className="text-[12px] text-[#525866]">{item.product.price} GHS / unit</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center bg-[#F7F7F8] rounded-[6px] border border-[#ECEDEF]">
                              <button onClick={() => updateQty(item.product.id, -1)} className="w-7 h-7 flex items-center justify-center text-[#525866] hover:text-[#111111]">-</button>
                              <span className="w-8 text-center text-[13px] font-bold text-[#111111]">{item.qty}</span>
                              <button onClick={() => updateQty(item.product.id, 1)} className="w-7 h-7 flex items-center justify-center text-[#525866] hover:text-[#111111]">+</button>
                            </div>
                            <span className="w-[60px] text-right text-[13px] font-bold text-[#111111]">
                              {item.qty * item.product.price}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-6 bg-white border-t border-[#ECEDEF] shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[14px] text-[#525866] font-medium">Total Amount</span>
                  <span className="text-[20px] font-bold text-[#111111]">{cartTotal.toLocaleString()} GHS</span>
                </div>
                
                <div className="mb-6">
                  <p className="text-[13px] text-[#525866] font-medium mb-2">Payment Method</p>
                  <div className="grid grid-cols-3 gap-2">
                    {['Credit', 'Mobile Money', 'Cash'].map(method => (
                      <button key={method} className={`py-2 text-[12px] font-bold rounded-[8px] border transition-colors ${method === 'Credit' ? 'bg-[#FFF7ED] border-[#D97706] text-[#D97706]' : 'bg-white border-[#ECEDEF] text-[#525866] hover:border-[#8B93A7]'}`}>
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  disabled={cart.length === 0}
                  className="w-full h-[48px] bg-[#D40073] hover:bg-[#B80063] disabled:opacity-50 disabled:hover:bg-[#D40073] text-white rounded-[12px] text-[15px] font-bold transition-colors"
                >
                  Place Order
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
