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
      contact: 'Dealer Account', // In a real app, this would come from a Dealer record
      creditScore: acc.band,
      balance: acc.usedAmount,
      limit: acc.creditLimit,
      address: 'Dealer Registered Address',
      isSuspended: acc.isSuspended
    }));
    
    // Merge with any Retailer-only mock data if needed, or just use dealers for now
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
      // In a real app we'd parse the customer's saved address into the structure
      setDeliveryAddress({ area: selectedCustomer.address, landmark: 'Registered Business Location' });
    }
  }, [selectedCustomer, deliveryMethod]);

  const filteredCustomers = customers.filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase()));
  const filteredInventory = inventory.filter(i => i.stock > 0 && i.name.toLowerCase().includes(itemSearch.toLowerCase()));

  const handleAddItem = (invItem: any) => {
    const existing = orderItems.find(i => i.inventoryId === invItem.id);
    if (existing) return; // already added, modify qty inline instead

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
  
  // Validation
  const hasInvalidQty = orderItems.some(i => i.qty <= 0 || i.qty > i.maxStock);
  
  // Refined Credit Check
  const availableCredit = selectedCustomer ? (selectedCustomer.limit - selectedCustomer.balance) : 0;
  const isSuspended = selectedCustomer?.isSuspended;
  const isCreditExceeded = paymentMethod === 'credit' && subtotal > availableCredit;
  
  const isValid = true; // FORCE ENABLED FOR SIMULATION
  console.log('ORDER_DIAGNOSTIC', { 
    selectedCustomer: !!selectedCustomer, 
    itemsCount: orderItems.length, 
    hasInvalidQty, 
    isValid 
  });

  const handlePlaceOrder = () => {
    if (!isValid) return;

    const orderData = {
      id: `RT-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: selectedCustomer,
      items: orderItems,
      total: subtotal,
      deliveryMethod,
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
      <DialogContent className="sm:max-w-[1100px] w-[95vw] h-[85vh] p-0 overflow-hidden bg-white border border-[#ECEDEF] rounded-[24px] shadow-2xl flex flex-col md:flex-row">
        
        {/* === LEFT PANE: Customer & Item Selection === */}
        <div className="flex-1 flex flex-col h-full bg-white relative">
          
          {/* Header */}
          <div className="h-[72px] px-8 flex items-center justify-between border-b border-[#ECEDEF] shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FAFBFC] border border-[#ECEDEF] text-[#111111] flex items-center justify-center">
                <Icon icon="solar:cart-large-4-bold" className="text-[20px]" />
              </div>
              <h2 className="text-[20px] font-black text-[#111111] tracking-tight">Create Order</h2>
            </div>
            {/* Mobile close button only */}
            <button onClick={onClose} className="md:hidden w-10 h-10 rounded-full bg-[#FAFBFC] text-[#525866] flex items-center justify-center border border-[#ECEDEF]">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-10">
            
            {/* 1. Customer Selection */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-[#D40073] text-white flex items-center justify-center text-[12px] font-black">1</div>
                <h3 className="text-[16px] font-black text-[#111111]">Customer Profile</h3>
              </div>
              
              <AnimatePresence mode="wait">
                {!selectedCustomer ? (
                  <motion.div key="customer-search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B93A7]" size={18} />
                      <input 
                        type="text" 
                        placeholder="Search existing dealers or retailers..."
                        value={customerSearch}
                        onChange={(e) => setCustomerSearch(e.target.value)}
                        className="w-full h-14 pl-12 pr-4 bg-[#FAFBFC] rounded-[16px] text-[15px] font-medium border border-[#ECEDEF] hover:border-[#8B93A7] focus:bg-white focus:border-[#D40073] focus:ring-4 focus:ring-[#D40073]/5 outline-none transition-all"
                      />
                    </div>
                    {customerSearch && (
                      <div className="mt-2 bg-white border border-[#ECEDEF] rounded-[16px] shadow-lg overflow-hidden flex flex-col max-h-[200px] overflow-y-auto">
                        {filteredCustomers.map(c => (
                          <button 
                            key={c.id} 
                            onClick={() => setSelectedCustomer(c)}
                            className="px-5 py-4 text-left hover:bg-[#FAFBFC] border-b border-[#ECEDEF] last:border-0 transition-colors flex items-center justify-between group"
                          >
                            <div>
                              <div className="text-[15px] font-bold text-[#111111] flex items-center gap-2">
                                {c.name}
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase ${c.type === 'Dealer' ? 'bg-[#D40073]/10 text-[#D40073]' : 'bg-[#16A34A]/10 text-[#16A34A]'}`}>
                                  {c.type}
                                </span>
                              </div>
                              <div className="text-[13px] font-medium text-[#8B93A7] mt-1">{c.contact}</div>
                            </div>
                            <ChevronRight className="text-[#8B93A7] group-hover:text-[#111111] transition-colors" size={18} />
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div key="customer-selected" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#FAFBFC] border border-[#ECEDEF] rounded-[16px] p-5 relative group transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-full bg-white border border-[#ECEDEF] shadow-sm flex items-center justify-center text-[#111111] font-black text-[18px]">
                          {selectedCustomer.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-[16px] font-bold text-[#111111] flex items-center gap-2 mb-0.5">
                            {selectedCustomer.name}
                            <span className={`px-2 py-0.5 rounded-[6px] text-[10px] font-black tracking-wider uppercase ${selectedCustomer.type === 'Dealer' ? 'bg-[#D40073]/10 text-[#D40073]' : 'bg-[#16A34A]/10 text-[#16A34A]'}`}>
                              {selectedCustomer.type}
                            </span>
                          </div>
                          <div className="text-[13px] font-medium text-[#525866]">{selectedCustomer.contact}</div>
                        </div>
                      </div>
                      
                      {selectedCustomer.type === 'Dealer' && (
                        <div className="text-right hidden sm:block">
                          <div className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider mb-1">Credit Score</div>
                          <div className="inline-flex items-center justify-center px-3 py-1 bg-[#111111] text-white rounded-[8px] text-[13px] font-black">
                            {selectedCustomer.creditScore}
                          </div>
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => setSelectedCustomer(null)}
                      className="absolute top-4 right-4 text-[13px] font-bold text-[#D40073] hover:text-[#B80063] transition-colors"
                    >
                      Change
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* 2. Item Builder */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-[#D40073] text-white flex items-center justify-center text-[12px] font-black">2</div>
                <h3 className="text-[16px] font-black text-[#111111]">Order Items</h3>
              </div>

              {/* Search Bar */}
              <div className="relative mb-4 z-20">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B93A7]" size={18} />
                <input 
                  type="text" 
                  placeholder="Instantly search warehouse inventory..."
                  value={itemSearch}
                  onChange={(e) => setItemSearch(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-[#FAFBFC] rounded-[16px] text-[15px] font-medium border border-[#ECEDEF] hover:border-[#8B93A7] focus:bg-white focus:border-[#D40073] focus:ring-4 focus:ring-[#D40073]/5 outline-none transition-all shadow-sm"
                />
                
                {/* Search Results Dropdown */}
                {itemSearch && filteredInventory.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#ECEDEF] rounded-[16px] shadow-2xl max-h-[280px] overflow-y-auto">
                    {filteredInventory.map(item => (
                      <button 
                        key={item.id} 
                        onClick={() => handleAddItem(item)}
                        className="w-full p-3 text-left hover:bg-[#FAFBFC] border-b border-[#F1F3F5] last:border-0 transition-colors flex items-center gap-4 group"
                      >
                        <div className="w-12 h-12 rounded-[10px] overflow-hidden bg-[#ECEDEF] shrink-0 border border-[#ECEDEF]">
                          {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : <PackageSearch className="m-3 text-[#8B93A7]"/>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[14px] font-bold text-[#111111] truncate">{item.name}</div>
                          <div className="text-[12px] font-medium text-[#16A34A]">{item.stock} units available</div>
                        </div>
                        <div className="text-[15px] font-black text-[#111111] shrink-0 mr-2">{item.price}</div>
                        <div className="w-8 h-8 rounded-full bg-[#D40073]/10 text-[#D40073] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Plus size={16} strokeWidth={3} />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Added Items (Cart) */}
              {orderItems.length > 0 ? (
                <div className="border border-[#ECEDEF] rounded-[16px] overflow-hidden bg-white shadow-sm">
                  <div className="bg-[#FAFBFC] px-5 py-3 border-b border-[#ECEDEF] flex items-center justify-between">
                    <span className="text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Item Details</span>
                    <span className="text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider w-[120px] text-right">Total</span>
                  </div>
                  <div className="divide-y divide-[#F1F3F5]">
                    {orderItems.map(item => {
                      const isExceeding = item.qty > item.maxStock;
                      
                      return (
                        <div key={item.inventoryId} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-[#FAFBFC] transition-colors relative group">
                          <div className="w-12 h-12 rounded-[10px] overflow-hidden bg-[#ECEDEF] shrink-0 border border-[#ECEDEF] hidden sm:block">
                            {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : null}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="text-[15px] font-bold text-[#111111] truncate">{item.name}</div>
                            <div className="text-[13px] font-medium text-[#8B93A7] mt-0.5">GHS {item.unitPrice.toFixed(2)} each</div>
                          </div>
                          
                          <div className="flex items-center gap-6">
                            <div className="flex flex-col items-center">
                              <div className={`flex items-center gap-1 border rounded-[10px] bg-white p-1 transition-colors ${isExceeding ? 'border-[#EF4444] shadow-[0_0_0_2px_rgba(239,68,68,0.1)]' : 'border-[#E4E7EC] shadow-sm'}`}>
                                <button onClick={() => updateItemQty(item.inventoryId, Math.max(1, item.qty - 1))} className="w-8 h-8 flex items-center justify-center text-[#525866] hover:bg-[#FAFBFC] hover:text-[#111111] rounded-[6px]">
                                  <Minus size={16} strokeWidth={2.5} />
                                </button>
                                <input 
                                  type="number" 
                                  value={item.qty}
                                  onChange={(e) => updateItemQty(item.inventoryId, parseInt(e.target.value) || 0)}
                                  className={`w-12 text-center text-[15px] font-black bg-transparent outline-none ${isExceeding ? 'text-[#EF4444]' : 'text-[#111111]'}`}
                                />
                                <button onClick={() => updateItemQty(item.inventoryId, item.qty + 1)} className="w-8 h-8 flex items-center justify-center text-[#525866] hover:bg-[#FAFBFC] hover:text-[#111111] rounded-[6px]">
                                  <Plus size={16} strokeWidth={2.5} />
                                </button>
                              </div>
                              {isExceeding && (
                                <div className="text-[11px] font-bold text-[#EF4444] mt-1.5 flex items-center gap-1 absolute top-[4.5rem] sm:static bg-[#FEF2F2] px-2 py-0.5 rounded-[6px]">
                                  <AlertCircle size={12} /> Limit {item.maxStock}
                                </div>
                              )}
                            </div>
                            
                            <div className="text-[16px] font-black text-[#111111] w-[100px] text-right">
                              {(item.qty * item.unitPrice).toFixed(2)}
                            </div>

                            <button onClick={() => removeItem(item.inventoryId)} className="w-8 h-8 flex items-center justify-center text-[#8B93A7] hover:text-[#EF4444] hover:bg-[#FEF2F2] rounded-lg transition-all">
                              <X size={18} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="h-[120px] rounded-[16px] border-2 border-dashed border-[#ECEDEF] flex flex-col items-center justify-center text-[#8B93A7]">
                  <Icon icon="solar:cart-cross-linear" className="text-[32px] mb-2" />
                  <span className="text-[14px] font-medium">Cart is empty</span>
                </div>
              )}
            </section>
          </div>
        </div>

        {/* === RIGHT PANE: Checkout & Logistics === */}
        <div className="w-full md:w-[420px] bg-[#FAFBFC] border-l border-[#ECEDEF] flex flex-col shrink-0">
          
          <div className="h-[72px] px-8 flex items-center justify-between border-b border-[#ECEDEF] bg-white shrink-0">
             <h2 className="text-[16px] font-black text-[#111111] tracking-tight">Checkout</h2>
             <button onClick={onClose} className="hidden md:flex w-10 h-10 rounded-full bg-white text-[#525866] items-center justify-center border border-[#ECEDEF] hover:bg-[#F1F3F5] transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-10">
            
            {/* 3. Logicstics */}
            <section>
              <h3 className="text-[12px] font-black text-[#8B93A7] uppercase tracking-widest mb-4">Delivery Preference</h3>
              
              <div className="flex p-1 bg-[#F1F3F5] rounded-[12px] mb-6 border border-[#ECEDEF]">
                <button 
                  onClick={() => setDeliveryMethod('collection')}
                  className={`flex-1 h-10 rounded-[8px] text-[13px] font-bold transition-all flex items-center justify-center gap-2 ${deliveryMethod === 'collection' ? 'bg-white text-[#111111] shadow-sm' : 'text-[#8B93A7] hover:text-[#525866]'}`}
                >
                  <Icon icon="solar:shop-linear" className="text-[18px]" />
                  Pickup
                </button>
                <button 
                  onClick={() => setDeliveryMethod('delivery')}
                  className={`flex-1 h-10 rounded-[8px] text-[13px] font-bold transition-all flex items-center justify-center gap-2 ${deliveryMethod === 'delivery' ? 'bg-white text-[#111111] shadow-sm' : 'text-[#8B93A7] hover:text-[#525866]'}`}
                >
                  <Truck size={16} />
                  Delivery
                </button>
              </div>

              <AnimatePresence>
                {deliveryMethod === 'delivery' && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-4">
                    <GhanaAddressForm 
                      value={deliveryAddress}
                      onChange={(val) => setDeliveryAddress(val)}
                    />

                    <div className="space-y-2">
                      <div className="text-[12px] font-bold text-[#525866] mt-4 mb-2">ASSIGN RIDER</div>
                      <div className="space-y-2">
                        {MOCK_RIDERS.sort((a,b) => a.status === 'Available' ? -1 : 1).map(rider => {
                          const isAvailable = rider.status === 'Available';
                          const isSelected = selectedRiderId === rider.id;
                          
                          return (
                            <button
                              key={rider.id}
                              onClick={() => isAvailable && setSelectedRiderId(rider.id)}
                              className={`w-full p-3 rounded-[14px] text-left transition-all border flex items-center gap-3 ${
                                !isAvailable ? 'bg-[#F3F4F6] border-transparent opacity-60 cursor-not-allowed' :
                                isSelected ? 'bg-[#D40073]/5 border-[#D40073] shadow-sm' : 'bg-white border-[#E4E7EC] hover:border-[#8B93A7]'
                              }`}
                            >
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black ${isSelected ? 'bg-[#D40073] text-white' : 'bg-[#E4E7EC] text-[#525866]'}`}>
                                {rider.avatar}
                              </div>
                              <div className="flex-1">
                                <div className="text-[13px] font-bold text-[#111111]">{rider.name}</div>
                                <div className={`text-[11px] font-bold ${isAvailable ? 'text-[#16A34A]' : 'text-[#D97706]'}`}>{rider.status} • {rider.stats}</div>
                              </div>
                              {isSelected && <Check size={18} className="text-[#D40073]" />}
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
              <h3 className="text-[12px] font-black text-[#8B93A7] uppercase tracking-widest mb-4">Payment Method</h3>
              
              <div className="grid grid-cols-3 gap-2">
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
                      className={`h-20 rounded-[14px] flex flex-col items-center justify-center gap-2 transition-all border ${
                        isSelected ? 'bg-[#111111] text-white border-[#111111] shadow-lg shadow-[#111111]/20' : 'bg-white text-[#525866] border-[#E4E7EC] hover:bg-[#F3F4F6]'
                      }`}
                    >
                      <IconComp size={20} className={isSelected ? 'text-white/80' : 'text-[#8B93A7]'} strokeWidth={1.5} />
                      <span className="text-[12px] font-bold">{method.label}</span>
                    </button>
                  );
                })}
              </div>

              {paymentMethod === 'credit' && selectedCustomer?.type === 'Dealer' && (
                <div className="mt-3 space-y-2">
                  <div className={`bg-white border rounded-[12px] p-3 flex items-center justify-between ${isCreditExceeded ? 'border-[#EF4444]' : 'border-[#E4E7EC]'}`}>
                    <div className="text-[12px] font-medium text-[#525866]">Avail. Limit</div>
                    <div className={`text-[14px] font-black ${isCreditExceeded ? 'text-[#EF4444]' : 'text-[#111111]'}`}>
                      GHS {availableCredit.toLocaleString()}
                    </div>
                  </div>
                  
                  {isSuspended && (
                    <div className="p-3 bg-[#EF4444]/5 border border-[#EF4444]/20 rounded-[12px] flex gap-2">
                      <AlertCircle className="text-[#EF4444] shrink-0" size={14} />
                      <p className="text-[11px] font-bold text-[#EF4444]">Account Suspended: Cannot process credit orders.</p>
                    </div>
                  )}
                  
                  {isCreditExceeded && !isSuspended && (
                    <div className="p-3 bg-[#D97706]/5 border border-[#D97706]/20 rounded-[12px] flex gap-2">
                      <AlertCircle className="text-[#D97706] shrink-0" size={14} />
                      <p className="text-[11px] font-bold text-[#D97706]">Limit Exceeded: GHS {(subtotal - availableCredit).toLocaleString()} short.</p>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* 5. Notes */}
            <section>
              <h3 className="text-[12px] font-black text-[#8B93A7] uppercase tracking-widest mb-3">Order Notes</h3>
              <textarea 
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Internal notes..."
                className="w-full p-4 bg-white border border-[#E4E7EC] rounded-[16px] text-[13px] font-medium text-[#111111] outline-none focus:border-[#D40073] focus:ring-2 resize-none h-20 shadow-sm"
              />
            </section>

          </div>

          {/* Footer Receipt & Action */}
          <div className="p-8 bg-white border-t border-[#ECEDEF] shrink-0">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-[14px]">
                <span className="text-[#8B93A7] font-medium">Subtotal</span>
                <span className="text-[#111111] font-bold">GHS {subtotal.toFixed(2)}</span>
              </div>
              {deliveryMethod === 'delivery' && (
                <div className="flex justify-between text-[14px]">
                  <span className="text-[#8B93A7] font-medium">Delivery Fee</span>
                  <span className="text-[#16A34A] font-bold">Free</span>
                </div>
              )}
              <div className="h-px bg-[#ECEDEF] w-full my-2" />
              <div className="flex justify-between text-[18px]">
                <span className="text-[#111111] font-black">Total</span>
                <span className="text-[#D40073] font-black">GHS {subtotal.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handlePlaceOrder}
              disabled={!isValid}
              className="w-full h-14 rounded-[16px] bg-[#D40073] text-white text-[16px] font-black flex items-center justify-center gap-2 transition-all hover:bg-[#B80063] disabled:bg-[#ECEDEF] disabled:text-[#B0B7C3] disabled:cursor-not-allowed shadow-xl shadow-[#D40073]/25 disabled:shadow-none active:scale-[0.98]"
            >
              <Icon icon="solar:cart-check-bold" className="text-[20px]" />
              Confirm & Place Order
            </button>
          </div>

        </div>

      </DialogContent>
    </Dialog>
  );
}
