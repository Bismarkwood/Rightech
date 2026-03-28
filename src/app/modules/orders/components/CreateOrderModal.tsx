import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, PackageSearch, AlertCircle, Plus, Minus, Banknote, CreditCard, Smartphone, Check, X } from 'lucide-react';
import { Icon } from '@iconify/react';
import { useRetailer } from '../../retailer/components/RetailerContext';
import { useCredit } from '../../credit/context/CreditContext';
import { Dialog, DialogContent } from '../../../core/components/ui/dialog';
import { GhanaAddress } from '../../../core/types/address';
import { GhanaAddressForm } from '../../../core/components/GhanaAddressForm';

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

  const customers = useMemo(() => {
    return accounts.map(acc => ({
      id: acc.dealerId,
      name: acc.dealerName,
      type: 'Dealer' as const,
      contact: 'Business Account',
      balance: acc.usedAmount,
      limit: acc.creditLimit,
      isSuspended: acc.isSuspended,
      address: 'Dealer Registered Address',
    }));
  }, [accounts]);
  
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(
    prefilledCustomerId ? customers.find(c => c.id === prefilledCustomerId) : null
  );

  const [itemSearch, setItemSearch] = useState('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [deliveryMethod, setDeliveryMethod] = useState<'collection' | 'delivery'>('collection');
  const [deliveryAddress, setDeliveryAddress] = useState<Partial<GhanaAddress>>({});
  const [selectedRiderId, setSelectedRiderId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'momo' | 'credit'>('cash');

  const filteredCustomers = customers.filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase()));
  const filteredInventory = inventory.filter(i => i.stock > 0 && i.name.toLowerCase().includes(itemSearch.toLowerCase()));

  const subtotal = orderItems.reduce((sum, item) => sum + (item.qty * item.unitPrice), 0);
  const availableCredit = selectedCustomer ? (selectedCustomer.limit - selectedCustomer.balance) : 0;
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
      trackingToken: `TRK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      riderLocation: { lat: 5.6037, lng: -0.1870 },
      estimatedArrivalMin: 15,
      createdAt: new Date()
    };
    onOrderSuccess(orderData);
    setSelectedCustomer(null);
    setOrderItems([]);
    setDeliveryMethod('collection');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] sm:max-w-[1100px] w-[96vw] h-[88vh] p-0 overflow-hidden bg-white border border-[#ECEDEF] flex flex-col md:flex-row outline-none rounded-[28px] shadow-none">
        
        {/* === LEFT: Catalog & Basket === */}
        <div className="flex-1 flex flex-col h-full bg-white border-r border-[#ECEDEF]">
          <div className="h-[72px] px-8 flex items-center justify-between border-b border-[#ECEDEF] shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D40073] flex items-center justify-center text-white">
                <Icon icon="solar:cart-large-4-bold" className="text-[20px]" />
              </div>
              <h2 className="text-[18px] font-black text-[#111111] tracking-tight">New Sales Order</h2>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
            {/* 1. Customer */}
            <section>
              <div className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-[0.1em] mb-4">Step 1: Assign Customer</div>
              {!selectedCustomer ? (
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B0B7C3]" size={18} />
                  <input 
                    placeholder="Search dealers or retail stores..."
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 bg-[#F9FAFB] rounded-xl text-[14px] font-semibold border border-[#ECEDEF] focus:bg-white focus:border-[#D40073] outline-none transition-all"
                  />
                  {customerSearch && (
                    <div className="mt-2 bg-white border border-[#ECEDEF] rounded-xl overflow-hidden flex flex-col absolute w-full top-full left-0 z-50">
                      {filteredCustomers.map(c => (
                        <button key={c.id} onClick={() => setSelectedCustomer(c)} className="px-5 py-3.5 text-left hover:bg-[#F9FAFB] border-b border-[#ECEDEF] last:border-0 transition-colors flex items-center justify-between group">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center font-bold text-[12px]">{c.name.charAt(0)}</div>
                             <div className="text-[14px] font-bold text-[#111111]">{c.name}</div>
                          </div>
                          <Plus size={14} className="text-[#D40073] opacity-0 group-hover:opacity-100" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-[#F9FAFB] border border-[#ECEDEF] rounded-xl p-4 flex items-center justify-between group">
                  <div className="flex gap-4 items-center">
                    <div className="w-10 h-10 rounded-xl bg-white border border-[#ECEDEF] flex items-center justify-center text-[#111111] font-bold text-[16px]">{selectedCustomer.name.charAt(0)}</div>
                    <div>
                      <div className="text-[15px] font-bold text-[#111111]">{selectedCustomer.name}</div>
                      <div className="text-[12px] font-medium text-[#8B93A7]">{selectedCustomer.contact}</div>
                    </div>
                  </div>
                  <button onClick={() => setSelectedCustomer(null)} className="p-2 hover:bg-white rounded-lg text-[#D40073] transition-colors"><Icon icon="solar:pen-new-square-bold" /></button>
                </div>
              )}
            </section>

            {/* 2. Basket */}
            <section>
              <div className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-[0.1em] mb-4">Step 2: Configure Basket</div>
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B0B7C3]" size={18} />
                <input 
                  placeholder="Search warehouse inventory..."
                  value={itemSearch}
                  onChange={(e) => setItemSearch(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 bg-[#F9FAFB] rounded-xl text-[14px] font-semibold border border-[#ECEDEF] focus:bg-white focus:border-[#D40073] outline-none transition-all"
                />
                {itemSearch && filteredInventory.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#ECEDEF] rounded-xl overflow-y-auto max-h-[220px] z-50">
                    {filteredInventory.map(item => (
                      <button key={item.id} onClick={() => {
                        const existing = orderItems.find(i => i.inventoryId === item.id);
                        if (!existing) setOrderItems([...orderItems, { inventoryId: item.id, name: item.name, image: item.image || '', unitPrice: parseFloat(item.price.replace(/[^0-9.]/g, '')), qty: 1, maxStock: item.stock }]);
                        setItemSearch('');
                      }} className="w-full p-3.5 text-left hover:bg-[#F9FAFB] border-b border-[#ECEDEF] last:border-0 flex items-center gap-4 group">
                        <div className="w-10 h-10 rounded-lg bg-[#F3F4F6] border border-[#ECEDEF] overflow-hidden">
                          {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : <PackageSearch className="m-2.5 text-[#B0B7C3]" size={15}/>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] font-bold text-[#111111] truncate">{item.name}</div>
                          <div className="text-[11px] font-bold text-[#16A34A]">{item.stock} in stock</div>
                        </div>
                        <div className="text-[14px] font-black text-[#111111]">{item.price}</div>
                        <Plus size={16} className="text-[#D40073] opacity-0 group-hover:opacity-100" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {orderItems.map(item => (
                  <div key={item.inventoryId} className="flex items-center gap-4 p-3 bg-white border border-[#ECEDEF] rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-[#F3F4F6] border border-[#ECEDEF] overflow-hidden shrink-0">
                      {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : <PackageSearch className="p-2.5 text-[#B0B7C3]" size={15}/>}
                    </div>
                    <div className="flex-1">
                      <div className="text-[13px] font-bold text-[#111111]">{item.name}</div>
                      <div className="text-[11px] font-medium text-[#8B93A7]">GHS {item.unitPrice.toFixed(2)}</div>
                    </div>
                    <div className="flex items-center gap-2 border border-[#ECEDEF] rounded-lg p-1 bg-[#F9FAFB]">
                      <button onClick={() => setOrderItems(prev => prev.map(i => i.inventoryId === item.inventoryId ? { ...i, qty: Math.max(1, i.qty - 1) } : i))} className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-md text-[#525866]"><Minus size={14} /></button>
                      <input type="number" value={item.qty} className="w-8 text-center bg-transparent font-black text-[13px]" readOnly />
                      <button onClick={() => setOrderItems(prev => prev.map(i => i.inventoryId === item.inventoryId ? { ...i, qty: Math.min(i.maxStock, i.qty + 1) } : i))} className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-md text-[#525866]"><Plus size={14} /></button>
                    </div>
                    <div className="w-20 text-right text-[14px] font-black text-[#111111]">{(item.qty * item.unitPrice).toFixed(2)}</div>
                    <button onClick={() => setOrderItems(orderItems.filter(i => i.inventoryId !== item.inventoryId))} className="text-[#B0B7C3] hover:text-[#EF4444] transition-colors"><Icon icon="solar:trash-bin-trash-bold" /></button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* === RIGHT: Checkout & Summary === */}
        <div className="w-full md:w-[400px] bg-[#F9FAFB] flex flex-col shrink-0 flex-1 h-full">
          <div className="h-[72px] px-8 flex items-center border-b border-[#ECEDEF] shrink-0">
            <h2 className="text-[13px] font-black text-[#111111] uppercase tracking-wider">Order Execution</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
            {/* Fulfillment */}
            <section>
              <div className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-[0.1em] mb-4">Fulfillment Strategy</div>
              <div className="grid grid-cols-2 gap-2 p-1 bg-white border border-[#ECEDEF] rounded-xl">
                <button onClick={() => setDeliveryMethod('collection')} className={`h-10 rounded-lg text-[13px] font-bold transition-all ${deliveryMethod === 'collection' ? 'bg-[#111111] text-white' : 'text-[#8B93A7] hover:bg-[#F9FAFB]'}`}>Pickup</button>
                <button onClick={() => setDeliveryMethod('delivery')} className={`h-10 rounded-lg text-[13px] font-bold transition-all ${deliveryMethod === 'delivery' ? 'bg-[#111111] text-white' : 'text-[#8B93A7] hover:bg-[#F9FAFB]'}`}>Delivery</button>
              </div>
              {deliveryMethod === 'delivery' && (
                <div className="mt-4 space-y-4">
                  <div className="p-1 border border-[#ECEDEF] bg-white rounded-xl"><GhanaAddressForm value={deliveryAddress} onChange={setDeliveryAddress} /></div>
                  <div className="space-y-2 text-[11px] font-bold text-[#8B93A7] uppercase px-1">Assign Rider</div>
                  <div className="space-y-2">
                    {MOCK_RIDERS.map(r => (
                      <button key={r.id} onClick={() => r.status === 'Available' && setSelectedRiderId(r.id)} className={`w-full p-3 rounded-xl border flex items-center gap-3 transition-all ${selectedRiderId === r.id ? 'border-[#D40073] bg-white' : 'border-[#ECEDEF] bg-white opacity-60'}`}>
                        <div className="w-8 h-8 rounded-lg bg-[#111111] text-white flex items-center justify-center text-[10px] font-bold">{r.avatar}</div>
                        <div className="flex-1 text-left">
                          <div className="text-[12px] font-bold text-[#111111]">{r.name}</div>
                          <div className="text-[10px] text-[#16A34A]">{r.status}</div>
                        </div>
                        {selectedRiderId === r.id && <Check size={14} className="text-[#D40073]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Settlement */}
            <section>
              <div className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-[0.1em] mb-4">Settlement Method</div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'cash', label: 'Cash', icon: Banknote },
                  { id: 'momo', label: 'E-Money', icon: Smartphone },
                  { id: 'credit', label: 'Credit', icon: CreditCard },
                ].map(m => (
                  <button key={m.id} onClick={() => setPaymentMethod(m.id as any)} className={`h-16 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all bg-white ${paymentMethod === m.id ? 'border-[#D40073] text-[#D40073]' : 'border-[#ECEDEF] text-[#8B93A7]'}`}>
                    <m.icon size={18} />
                    <span className="text-[11px] font-black">{m.label}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Receipt Footer */}
          <div className="p-8 bg-white border-t border-[#ECEDEF] shrink-0">
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-[13px] font-medium text-[#8B93A7]"><span>Cart Subtotal</span><span>GHS {subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-[13px] font-medium text-[#16A34A]"><span>Logistics</span><span>Free</span></div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#ECEDEF]">
                <span className="text-[15px] font-black text-[#111111]">Grand Total</span>
                <span className="text-[22px] font-black text-[#D40073]">GHS {subtotal.toFixed(2)}</span>
              </div>
            </div>
            <button 
              onClick={handlePlaceOrder}
              disabled={!isValid || isCreditExceeded || (selectedCustomer?.isSuspended && paymentMethod === 'credit')}
              className="w-full h-12 bg-[#111111] text-white text-[14px] font-black rounded-xl hover:bg-black disabled:bg-[#F3F4F6] disabled:text-[#B0B7C3] transition-all flex items-center justify-center gap-2"
            >
              <Icon icon="solar:cart-check-bold" />
              Place Order Now
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
