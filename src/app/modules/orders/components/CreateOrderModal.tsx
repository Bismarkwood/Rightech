import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Check, PackageSearch, AlertCircle, Plus, Minus, UserRound, MapPin, CreditCard, Banknote, Smartphone, Receipt, ChevronRight, Truck } from 'lucide-react';
import { Icon } from '@iconify/react';
import { useRetailer } from '../../retailer/components/RetailerContext';
import { useCredit } from '../../credit/context/CreditContext';
import { Dialog, DialogContent } from '../../../core/components/ui/dialog';
import { GhanaAddress } from '../../../core/types/address';
import { GhanaAddressForm } from '../../../core/components/GhanaAddressForm';

// --- Mock Data --- 
const MOCK_CUSTOMERS = [
  { id: 'c1', name: 'TechHub Accra', type: 'Dealer', contact: '+233 24 123 4567', creditScore: 'A+', balance: 4500, limit: 10000, address: '14 Independence Ave, Accra' },
  { id: 'c2', name: 'Kasoa Electronics', type: 'Retailer', contact: '+233 55 987 6543', creditScore: null, balance: 0, limit: 0, address: 'Market Road, Kasoa' },
  { id: 'c3', name: 'Spintex Gadgets', type: 'Dealer', contact: '+233 20 444 5555', creditScore: 'B', balance: 1200, limit: 5000, address: 'Spintex Road, Accra' },
];

const MOCK_RIDERS = [
  { id: 'r2', name: 'Ama Boateng', status: 'Available', stats: '0 today', avatar: 'AB' },
  { id: 'r1', name: 'Kofi Mensah', status: 'Available', stats: '2 today', avatar: 'KM' },
  { id: 'r3', name: 'Yaw Darko', status: 'On delivery', stats: 'ETA 25m', avatar: 'YD' },
];

export interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledCustomerId?: string;
  onOrderSuccess: (orderData: any) => void;
}

interface OrderItem {
  inventoryId: string;
  name: string;
  image: string;
  unitPrice: number;
  qty: number;
  maxStock: number;
}

export function CreateOrderModal({ isOpen, onClose, prefilledCustomerId, onOrderSuccess }: CreateOrderModalProps) {
  const { inventory } = useRetailer();
  const { accounts } = useCredit();

  // Map Credit Accounts to Customer objects
  const customers = useMemo(() => {
    const dealerCustomers = accounts.map(acc => ({
      id: acc.dealerId,
      name: acc.dealerName,
      type: 'Dealer' as const,
      contact: 'Dealer Account',
      creditScore: acc.band,
      balance: acc.usedAmount,
      limit: acc.creditLimit,
      address: 'Dealer Registered Address',
      isSuspended: acc.isSuspended
    }));
    return [...dealerCustomers, ...MOCK_CUSTOMERS.filter(c => c.type === 'Retailer')];
  }, [accounts]);
  
  // Section 1: Customer
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(
    prefilledCustomerId ? customers.find(c => c.id === prefilledCustomerId) : null
  );

  // Section 2: Items
  const [itemSearch, setItemSearch] = useState('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  // Section 3: Delivery
  const [deliveryMethod, setDeliveryMethod] = useState<'collection' | 'delivery' | null>('collection');
  const [deliveryAddress, setDeliveryAddress] = useState<Partial<GhanaAddress>>({});
  const [selectedRiderId, setSelectedRiderId] = useState<string | null>(null);

  // Section 4: Payment
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'momo' | 'credit'>('cash');
  const [notes, setNotes] = useState('');

  // Initialization & Helpers
  React.useEffect(() => {
    if (selectedCustomer && deliveryMethod === 'delivery' && Object.keys(deliveryAddress).length === 0) {
      setDeliveryAddress({ area: selectedCustomer.address, landmark: 'Registered Business Location' });
    }
  }, [selectedCustomer, deliveryMethod]);

  const filteredCustomers = customers.filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase()));
  const filteredInventory = inventory.filter(i => i.stock > 0 && i.name.toLowerCase().includes(itemSearch.toLowerCase()));

  const handleAddItem = (invItem: any) => {
    const existing = orderItems.find(i => i.inventoryId === invItem.id);
    if (existing) return;

    const priceNum = parseFloat(invItem.price.replace(/[^0-9.]/g, ''));
    setOrderItems(prev => [...prev, {
      inventoryId: invItem.id,
      name: invItem.name,
      image: invItem.image || '',
      unitPrice: isNaN(priceNum) ? 0 : priceNum,
      qty: 1,
      maxStock: invItem.stock
    }]);
    setItemSearch('');
  };

  const updateItemQty = (id: string, newQty: number) => {
    setOrderItems(prev => prev.map(item => {
      if (item.inventoryId === id) {
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setOrderItems(prev => prev.filter(i => i.inventoryId !== id));
  };

  const subtotal = orderItems.reduce((sum, item) => sum + (item.qty * item.unitPrice), 0);
  
  const availableCredit = selectedCustomer ? (selectedCustomer.limit - selectedCustomer.balance) : 0;
  const isSuspended = selectedCustomer?.isSuspended;
  const isCreditExceeded = paymentMethod === 'credit' && subtotal > availableCredit;
  
  const isValid = selectedCustomer && orderItems.length > 0 && !orderItems.some(i => i.qty <= 0 || i.qty > i.maxStock);

  const handlePlaceOrder = () => {
    if (!isValid) return;

    const orderData = {
      id: `RT-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: selectedCustomer,
      items: orderItems,
      total: subtotal,
      deliveryMethod: deliveryMethod === 'delivery' ? 'Dispatch' : 'Self Collection',
      deliveryAddress: deliveryMethod === 'delivery' ? deliveryAddress : null,
      rider: deliveryMethod === 'delivery' ? MOCK_RIDERS.find(r => r.id === selectedRiderId) : null,
      paymentMethod,
      notes,
      trackingToken: `TRK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      riderLocation: { lat: 5.6037, lng: -0.1870 },
      estimatedArrivalMin: 15,
      createdAt: new Date()
    };
    
    onOrderSuccess(orderData);
    
    // Reset state for next open
    setSelectedCustomer(null);
    setOrderItems([]);
    setDeliveryMethod('collection');
    setPaymentMethod('cash');
    setNotes('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] sm:max-w-[1240px] w-[98vw] h-[92vh] p-0 overflow-hidden bg-white border-0 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.3)] flex flex-col md:flex-row outline-none rounded-[36px]">
        
        {/* === LEFT PANE: Customer & Item Selection === */}
        <div className="flex-1 flex flex-col h-full bg-white relative">
          
          {/* Main Header - Now with the ONLY Closing Button */}
          <div className="h-[88px] px-10 flex items-center justify-between border-b border-[#ECEDEF] shrink-0 bg-white/80 backdrop-blur-md sticky top-0 z-[60]">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-[20px] bg-[#111111] flex items-center justify-center text-white shadow-xl shadow-black/10">
                <Icon icon="solar:cart-large-4-bold-duotone" className="text-[28px]" />
              </div>
              <div>
                <h2 className="text-[24px] font-black text-[#111111] leading-none tracking-tight mb-1.5">New Sales Order</h2>
                <p className="text-[13px] font-bold text-[#8B93A7] uppercase tracking-widest leading-none">Terminal RT-P04</p>
              </div>
            </div>
            
            <button 
              onClick={onClose} 
              className="w-12 h-12 rounded-full bg-[#FAFBFC] text-[#525866] flex items-center justify-center border border-[#ECEDEF] hover:bg-[#F1F3F5] hover:text-[#111111] transition-all active:scale-95 shadow-sm"
            >
              <X size={22} strokeWidth={2.5} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-12">
            
            {/* 1. Customer Selection */}
            <section className="relative">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-8 h-8 rounded-full bg-[#D40073]/5 text-[#D40073] flex items-center justify-center text-[14px] font-black border border-[#D40073]/10">1</div>
                 <h3 className="text-[18px] font-black text-[#111111]">Assign Customer</h3>
              </div>
              
              <AnimatePresence mode="wait">
                {!selectedCustomer ? (
                  <motion.div key="customer-search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="relative group">
                      <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#8B93A7] group-focus-within:text-[#D40073] transition-colors" size={20} />
                      <input 
                        type="text" 
                        placeholder="Search for a dealer or retail store..."
                        value={customerSearch}
                        onChange={(e) => setCustomerSearch(e.target.value)}
                        className="w-full h-16 pl-14 pr-6 bg-[#FAFBFC] rounded-[22px] text-[16px] font-semibold border border-[#ECEDEF] hover:border-[#8B93A7] focus:bg-white focus:border-[#D40073] focus:ring-8 focus:ring-[#D40073]/5 outline-none transition-all shadow-sm"
                      />
                    </div>
                    {customerSearch && (
                      <div className="mt-2 bg-white border border-[#ECEDEF] rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[280px] overflow-y-auto z-50 absolute w-full top-full left-0">
                        {filteredCustomers.map(c => (
                          <button 
                            key={c.id} 
                            onClick={() => setSelectedCustomer(c)}
                            className="px-6 py-5 text-left hover:bg-[#FAFBFC] border-b border-[#F1F3F5] last:border-0 transition-colors flex items-center justify-between group"
                          >
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center font-black text-[14px]">{c.name.charAt(0)}</div>
                               <div>
                                 <div className="text-[16px] font-bold text-[#111111] flex items-center gap-2">
                                   {c.name}
                                   <span className={`px-2 py-0.5 rounded-[6px] text-[10px] font-black tracking-wider uppercase ${c.type === 'Dealer' ? 'bg-[#D40073]/10 text-[#D40073]' : 'bg-[#16A34A]/10 text-[#16A34A]'}`}>
                                     {c.type}
                                   </span>
                                 </div>
                                 <div className="text-[13px] font-medium text-[#8B93A7] mt-1">{c.contact}</div>
                               </div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-[#D40073]/10 text-[#D40073] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                              <Plus size={18} strokeWidth={3} />
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div key="customer-selected" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#FAFBFC] border border-[#ECEDEF] rounded-[24px] p-6 relative flex items-center justify-between hover:shadow-md transition-all group">
                    <div className="flex gap-5 items-center">
                      <div className="w-16 h-16 rounded-[20px] bg-white border border-[#ECEDEF] shadow-sm flex items-center justify-center text-[#111111] font-black text-[22px]">
                        {selectedCustomer.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-[18px] font-black text-[#111111] flex items-center gap-2 mb-1">
                          {selectedCustomer.name}
                          <span className={`px-2 py-1 rounded-[8px] text-[11px] font-black tracking-widest uppercase ${selectedCustomer.type === 'Dealer' ? 'bg-[#D40073]/10 text-[#D40073]' : 'bg-[#16A34A]/10 text-[#16A34A]'}`}>
                            {selectedCustomer.type}
                          </span>
                        </div>
                        <div className="text-[14px] font-bold text-[#525866]">{selectedCustomer.contact}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      {selectedCustomer.type === 'Dealer' && (
                        <div className="text-right hidden sm:block">
                          <p className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-widest mb-1.5">Credit Status</p>
                          <div className="inline-flex items-center justify-center px-4 py-1.5 bg-[#111111] text-white rounded-[10px] text-[14px] font-black shadow-lg shadow-black/10">
                            Band {selectedCustomer.creditScore}
                          </div>
                        </div>
                      )}
                      <button 
                        onClick={() => setSelectedCustomer(null)}
                        className="w-10 h-10 rounded-full bg-white border border-[#ECEDEF] text-[#D40073] flex items-center justify-center hover:bg-[#D40073] hover:text-white transition-all shadow-sm active:scale-95"
                      >
                        <Icon icon="solar:pen-new-square-bold" className="text-[20px]" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* 2. Item Builder */}
            <section className="relative">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-8 h-8 rounded-full bg-[#D40073]/5 text-[#D40073] flex items-center justify-center text-[14px] font-black border border-[#D40073]/10">2</div>
                 <h3 className="text-[18px] font-black text-[#111111]">Configure Basket</h3>
              </div>

              {/* Search Bar */}
              <div className="relative mb-6 z-40">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#8B93A7]" size={20} />
                <input 
                  type="text" 
                  placeholder="Instantly search warehouse inventory..."
                  value={itemSearch}
                  onChange={(e) => setItemSearch(e.target.value)}
                  className="w-full h-16 pl-14 pr-6 bg-[#FAFBFC] rounded-[22px] text-[16px] font-semibold border border-[#ECEDEF] hover:border-[#8B93A7] focus:bg-white focus:border-[#D40073] focus:ring-8 focus:ring-[#D40073]/5 outline-none transition-all shadow-sm"
                />
                
                {itemSearch && filteredInventory.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#ECEDEF] rounded-[24px] shadow-2xl max-h-[320px] overflow-y-auto">
                    {filteredInventory.map(item => (
                      <button 
                        key={item.id} 
                        onClick={() => handleAddItem(item)}
                        className="w-full p-4 text-left hover:bg-[#FAFBFC] border-b border-[#F1F3F5] last:border-0 transition-colors flex items-center gap-5 group"
                      >
                        <div className="w-14 h-14 rounded-[14px] overflow-hidden bg-[#F3F4F6] shrink-0 border border-[#ECEDEF]">
                          {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : <PackageSearch className="m-4 text-[#8B93A7]"/>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[15px] font-bold text-[#111111] truncate">{item.name}</div>
                          <div className="text-[13px] font-bold text-[#16A34A] mt-0.5">{item.stock} in stock</div>
                        </div>
                        <div className="text-[16px] font-black text-[#111111] shrink-0 mr-4 tracking-tight">{item.price}</div>
                        <div className="w-10 h-10 rounded-full bg-[#D40073]/10 text-[#D40073] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                          <Plus size={20} strokeWidth={3} />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Added Items List */}
              {orderItems.length > 0 ? (
                <div className="border border-[#ECEDEF] rounded-[28px] overflow-hidden bg-white shadow-xl shadow-black/5">
                  <div className="bg-[#FAFBFC] px-8 py-4 border-b border-[#ECEDEF] flex items-center justify-between">
                    <span className="text-[13px] font-black text-[#8B93A7] uppercase tracking-[0.15em]">Cart Items Details</span>
                    <span className="text-[13px] font-black text-[#8B93A7] uppercase tracking-[0.15em] w-[140px] text-right">Line Total</span>
                  </div>
                  <div className="divide-y divide-[#F1F3F5]">
                    {orderItems.map(item => {
                      const isExceeding = item.qty > item.maxStock;
                      return (
                        <div key={item.inventoryId} className="p-6 flex flex-col sm:flex-row sm:items-center gap-6 hover:bg-[#FAFBFC] transition-colors relative">
                          <div className="w-16 h-16 rounded-[16px] overflow-hidden bg-[#F3F4F6] shrink-0 border border-[#ECEDEF]">
                            {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : <PackageSearch className="m-4 text-[#8B93A7]"/>}
                          </div>
                          
                          <div className="flex-1 min-w-0 flex flex-col">
                            <span className="text-[16px] font-black text-[#111111] truncate">{item.name}</span>
                            <span className="text-[13px] font-bold text-[#8B93A7] mt-1">GHS {item.unitPrice.toFixed(2)} / unit</span>
                          </div>
                          
                          <div className="flex items-center gap-6">
                            <div className="flex flex-col items-center">
                              <div className={`flex items-center gap-2 border rounded-[14px] bg-white p-1.5 transition-all ${isExceeding ? 'border-[#EF4444] shadow-[0_0_0_4px_rgba(239,68,68,0.1)]' : 'border-[#E4E7EC] shadow-sm hover:border-[#D40073]'}`}>
                                <button onClick={() => updateItemQty(item.inventoryId, Math.max(1, item.qty - 1))} className="w-10 h-10 flex items-center justify-center text-[#525866] hover:bg-[#FAFBFC] hover:text-[#111111] rounded-[8px] transition-colors">
                                  <Minus size={18} strokeWidth={3} />
                                </button>
                                <input 
                                  type="number" 
                                  value={item.qty}
                                  onChange={(e) => updateItemQty(item.inventoryId, parseInt(e.target.value) || 0)}
                                  className={`w-14 text-center text-[17px] font-black bg-transparent outline-none ${isExceeding ? 'text-[#EF4444]' : 'text-[#111111]'}`}
                                />
                                <button onClick={() => updateItemQty(item.inventoryId, item.qty + 1)} className="w-10 h-10 flex items-center justify-center text-[#525866] hover:bg-[#FAFBFC] hover:text-[#111111] rounded-[8px] transition-colors">
                                  <Plus size={18} strokeWidth={3} />
                                </button>
                              </div>
                              {isExceeding && (
                                <div className="text-[11px] font-black text-[#EF4444] mt-2 flex items-center gap-1 bg-[#FEF2F2] px-2 py-0.5 rounded-[6px]">
                                  <AlertCircle size={14} /> Limit {item.maxStock}
                                </div>
                              )}
                            </div>
                            
                            <div className="text-[18px] font-black text-[#111111] w-[110px] text-right tracking-tight">
                              {(item.qty * item.unitPrice).toFixed(2)}
                            </div>

                            <button onClick={() => removeItem(item.inventoryId)} className="w-10 h-10 flex items-center justify-center text-[#8B93A7] hover:text-[#EF4444] hover:bg-[#FEF2F2] rounded-full transition-all active:scale-95">
                              <Icon icon="solar:trash-bin-trash-bold" className="text-[20px]" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="h-[180px] rounded-[28px] border-2 border-dashed border-[#ECEDEF] flex flex-col items-center justify-center text-[#8B93A7] bg-[#FAFBFC]">
                  <div className="w-14 h-14 rounded-full bg-white border border-[#ECEDEF] flex items-center justify-center mb-4">
                    <Icon icon="solar:cart-cross-bold-duotone" className="text-[28px] text-[#ECEDEF]" />
                  </div>
                  <span className="text-[15px] font-bold">Shopping cart is empty</span>
                  <span className="text-[12px] font-medium mt-1">Add items from the inventory to proceed</span>
                </div>
              )}
            </section>
          </div>
        </div>

        {/* === RIGHT PANE: Checkout & Logistics === */}
        <div className="w-full md:w-[480px] bg-[#FAFBFC] border-l border-[#ECEDEF] flex flex-col shrink-0 flex-1 h-full">
          
          <div className="h-[88px] px-10 flex items-center justify-between border-b border-[#ECEDEF] bg-[#FAFBFC] shrink-0 sticky top-0 z-50">
             <h2 className="text-[18px] font-black text-[#111111] tracking-tight flex items-center gap-2">
               <Icon icon="solar:wallet-2-bold" className="text-[#D40073]" />
               Order Execution
             </h2>
             <div className="px-3 py-1 bg-[#16A34A]/10 text-[#16A34A] rounded-full text-[11px] font-black uppercase tracking-wider">
               Online Terminal
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-12">
            
            {/* 3. Logicstics */}
            <section>
              <h3 className="text-[13px] font-black text-[#8B93A7] uppercase tracking-[0.2em] mb-4">Fulfillment Strategy</h3>
              
              <div className="flex p-1.5 bg-white rounded-[20px] mb-8 border border-[#ECEDEF] shadow-sm">
                <button 
                  onClick={() => setDeliveryMethod('collection')}
                  className={`flex-1 h-12 rounded-[14px] text-[14px] font-black transition-all flex items-center justify-center gap-2 ${deliveryMethod === 'collection' ? 'bg-[#111111] text-white shadow-xl' : 'text-[#8B93A7] hover:text-[#111111]'}`}
                >
                  <Icon icon="solar:shop-bold-duotone" className="text-[20px]" />
                  Pickup
                </button>
                <button 
                  onClick={() => setDeliveryMethod('delivery')}
                  className={`flex-1 h-12 rounded-[14px] text-[14px] font-black transition-all flex items-center justify-center gap-2 ${deliveryMethod === 'delivery' ? 'bg-[#111111] text-white shadow-xl' : 'text-[#8B93A7] hover:text-[#111111]'}`}
                >
                  <Icon icon="solar:routing-2-bold-duotone" className="text-[20px]" />
                  Delivery
                </button>
              </div>

              <AnimatePresence>
                {deliveryMethod === 'delivery' && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-6">
                    <div className="p-1 border border-[#ECEDEF] bg-white rounded-[24px]">
                      <GhanaAddressForm 
                        value={deliveryAddress}
                        onChange={(val) => setDeliveryAddress(val)}
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="text-[11px] font-black text-[#8B93A7] uppercase tracking-[0.2em] px-2 flex items-center justify-between">
                        Assign Logistics Rider
                        <span className="text-[#16A34A] flex items-center gap-1 normal-case tracking-normal">
                           <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                           Real-time active
                        </span>
                      </div>
                      <div className="space-y-2.5">
                        {MOCK_RIDERS.sort((a,b) => a.status === 'Available' ? -1 : 1).map(rider => {
                          const isAvailable = rider.status === 'Available';
                          const isSelected = selectedRiderId === rider.id;
                          
                          return (
                            <button
                              key={rider.id}
                              onClick={() => isAvailable && setSelectedRiderId(rider.id)}
                              className={`w-full p-4 rounded-[20px] text-left transition-all border flex items-center gap-4 ${
                                !isAvailable ? 'bg-[#F3F4F6] border-transparent opacity-60 cursor-not-allowed' :
                                isSelected ? 'bg-white border-[#D40073] shadow-lg shadow-[#D40073]/5' : 'bg-white border-[#E4E7EC] hover:border-[#8B93A7]'
                              }`}
                            >
                              <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center text-[14px] font-black ${isSelected ? 'bg-[#D40073] text-white' : 'bg-[#111111] text-white'}`}>
                                {rider.avatar}
                              </div>
                              <div className="flex-1">
                                <div className="text-[14px] font-black text-[#111111]">{rider.name}</div>
                                <div className={`text-[12px] font-bold ${isAvailable ? 'text-[#16A34A]' : 'text-[#D97706]'}`}>
                                  {rider.status} · {rider.stats}
                                </div>
                              </div>
                              {isSelected && <div className="w-6 h-6 rounded-full bg-[#D40073] flex items-center justify-center text-white"><Check size={14} strokeWidth={3} /></div>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* 4. Payment */}
            <section>
              <h3 className="text-[13px] font-black text-[#8B93A7] uppercase tracking-[0.2em] mb-4">Payment & Settlement</h3>
              
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'cash', label: 'Cash', icon: Banknote },
                  { id: 'momo', label: 'Momo', icon: Smartphone },
                  { id: 'credit', label: 'Credit', icon: CreditCard },
                ].map(method => {
                  const isSelected = paymentMethod === method.id;
                  const IconComp = method.icon;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={`h-24 rounded-[22px] flex flex-col items-center justify-center gap-3 transition-all border ${
                        isSelected ? 'bg-[#111111] text-white border-[#111111] shadow-2xl shadow-black/20' : 'bg-white text-[#525866] border-[#E4E7EC] hover:bg-white hover:border-[#D40073]'
                      }`}
                    >
                      <IconComp size={24} className={isSelected ? 'text-white/90' : 'text-[#8B93A7]'} strokeWidth={2} />
                      <span className="text-[13px] font-black">{method.label}</span>
                    </button>
                  );
                })}
              </div>

              {paymentMethod === 'credit' && selectedCustomer?.type === 'Dealer' && (
                <div className="mt-4 space-y-3">
                  <div className={`bg-white border rounded-[18px] p-4 flex items-center justify-between shadow-sm transition-colors ${isCreditExceeded ? 'border-[#EF4444]' : 'border-[#ECEDEF]'}`}>
                    <span className="text-[13px] font-bold text-[#8B93A7]">Avail. Credit Limit</span>
                    <span className={`text-[16px] font-black ${isCreditExceeded ? 'text-[#EF4444]' : 'text-[#111111]'}`}>
                      GHS {availableCredit.toLocaleString()}
                    </span>
                  </div>
                  
                  {isSuspended && (
                    <div className="p-4 bg-[#EF4444]/5 border border-[#EF4444]/20 rounded-[18px] flex gap-3 items-center">
                      <div className="w-8 h-8 rounded-full bg-[#EF4444] text-white flex items-center justify-center shrink-0 shadow-lg shadow-[#EF4444]/20">
                         <AlertCircle size={16} strokeWidth={3} />
                      </div>
                      <p className="text-[12px] font-bold text-[#EF4444] leading-tight">Account Suspended: Credit transactions disabled.</p>
                    </div>
                  )}
                </div>
              )}
            </section>

          </div>

          {/* Footer Receipt & Action */}
          <div className="p-10 bg-white border-t border-[#ECEDEF] shrink-0 shadow-[0_-24px_48px_-12px_rgba(0,0,0,0.05)]">
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-[15px] font-bold">
                <span className="text-[#8B93A7]">Basket Subtotal</span>
                <span className="text-[#111111]">GHS {subtotal.toFixed(2)}</span>
              </div>
              {deliveryMethod === 'delivery' && (
                <div className="flex justify-between text-[15px] font-bold">
                  <span className="text-[#8B93A7]">Logistics & Delivery</span>
                  <span className="text-[#16A34A] uppercase tracking-widest text-[11px] font-black border border-[#16A34A]/20 px-2 py-0.5 rounded-full">Complimentary</span>
                </div>
              )}
              <div className="h-px bg-gradient-to-r from-transparent via-[#ECEDEF] to-transparent w-full my-4" />
              <div className="flex justify-between items-center">
                <span className="text-[16px] font-black text-[#111111]">Total Amount Due</span>
                <span className="text-[28px] font-black text-[#D40073] tracking-tighter">GHS {subtotal.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handlePlaceOrder}
              disabled={!isValid || isSuspended || isCreditExceeded}
              className="group w-full h-16 rounded-[24px] bg-[#111111] text-white text-[18px] font-black flex items-center justify-center gap-3 transition-all hover:bg-black disabled:bg-[#ECEDEF] disabled:text-[#B0B7C3] disabled:cursor-not-allowed shadow-2xl active:scale-[0.98] relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <Icon icon="solar:cart-check-bold-duotone" className="text-[24px]" />
              Confirm & Finalize Order
            </button>
          </div>

        </div>

      </DialogContent>
    </Dialog>
  );
}
