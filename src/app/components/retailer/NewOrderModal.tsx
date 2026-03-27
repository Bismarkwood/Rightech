import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from '@iconify/react';
import * as Dialog from '@radix-ui/react-dialog';
import { useRetailer } from './RetailerContext';

/* ─── Catalog data ──────────────────────────────────────── */
const CATALOG = [
  { label: 'Portland Cement 50kg', price: 85, image: 'https://images.unsplash.com/photo-1518709367011-8278783e7869?auto=format&fit=crop&q=80&w=200' },
  { label: 'Iron Rods 16mm', price: 120, image: 'https://images.unsplash.com/photo-1621905252507-b35242f8969d?auto=format&fit=crop&q=80&w=200' },
  { label: 'Emulsion Paint 20L', price: 450, image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&q=80&w=200' },
  { label: 'Sand (1 Tipper)', price: 600, image: 'https://images.unsplash.com/photo-1534067783941-51c9c23eccfd?auto=format&fit=crop&q=80&w=200' },
  { label: 'Gravel (1 Tipper)', price: 750, image: 'https://images.unsplash.com/photo-1517482713221-343fd7215655?auto=format&fit=crop&q=80&w=200' },
];

const GH_ADDRESSES = [
  { code: 'GA-183-4927', area: 'East Legon, Accra' },
  { code: 'GA-200-1122', area: 'Madina, Accra' },
  { code: 'GA-050-9988', area: 'Airport Residential, Accra' },
  { code: 'GS-012-3456', area: 'Adum, Kumasi' },
  { code: 'GT-101-2020', area: 'Community 1, Tema' },
  { code: 'GK-044-5566', area: 'Kotei, Kumasi' },
];

const MOCK_AGENTS = [
  { name: 'John Doe', phone: '+233 24 123 4567', avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=100', vehicle: 'Motorbike — GT-2931-22' },
  { name: 'Sarah Mensah', phone: '+233 20 987 6543', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100', vehicle: 'Van — GE-1029-21' },
  { name: 'Isaac Tetteh', phone: '+233 55 444 3333', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100', vehicle: 'Motorbike — GT-8821-23' },
];

/* ─── Helper sub-components ─────────────────────────────── */

function NewOrderSection({
  icon, label, color, bgColor, children,
}: {
  icon: string; label: string; color: string; bgColor: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-[16px] border border-[#ECEDEF] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[#F3F4F6]">
        <div
          className="w-8 h-8 rounded-[9px] flex items-center justify-center shrink-0 text-[16px]"
          style={{ background: bgColor, color }}
        >
          <Icon icon={icon} />
        </div>
        <span className="text-[14px] font-bold text-[#111111]">{label}</span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function FieldGroup({
  label, icon, children, className = '',
}: {
  label: string; icon: string; children: React.ReactNode; className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="flex items-center gap-1.5 text-[12px] font-bold text-[#525866] uppercase tracking-wider">
        <Icon icon={icon} className="text-[13px] text-[#8B93A7]" />
        {label}
      </label>
      {children}
    </div>
  );
}

function OrderItemRow({ onRemove, showRemove }: { onRemove: () => void; showRemove: boolean }) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const item = CATALOG[selectedIdx];
  const lineTotal = (item.price * qty).toFixed(2);

  return (
    <div className="flex items-center gap-2 bg-[#F7F7F8] rounded-[12px] p-2 pr-3 border border-[#ECEDEF]">
      {/* Product Image */}
      <div className="w-10 h-10 rounded-[8px] bg-white border border-[#E4E7EC] overflow-hidden shrink-0 flex items-center justify-center">
        {item.image ? (
          <img src={item.image} alt={item.label} className="w-full h-full object-cover" />
        ) : (
          <Icon icon="solar:box-linear" className="text-[18px] text-[#8B93A7]" />
        )}
      </div>

      {/* Product select */}
      <div className="relative flex-1 min-w-0">
        <select
          value={selectedIdx}
          onChange={e => setSelectedIdx(Number(e.target.value))}
          className="modal-input appearance-none pr-8 cursor-pointer text-[13px]"
          style={{ height: '42px' }}
        >
          {CATALOG.map((c, i) => (
            <option key={i} value={i}>{c.label} — {c.price} GHS</option>
          ))}
        </select>
        <Icon icon="solar:alt-arrow-down-linear" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8B93A7] text-[14px] pointer-events-none" />
      </div>

      {/* Qty stepper */}
      <div
        className="flex items-center bg-white border border-[#E4E7EC] rounded-[10px] overflow-hidden shrink-0"
        style={{ height: '42px' }}
      >
        <button
          type="button"
          onClick={() => setQty(q => Math.max(1, q - 1))}
          className="w-9 h-full flex items-center justify-center text-[#525866] hover:bg-[#F3F4F6] transition-colors text-lg font-bold"
        >−</button>
        <span className="w-9 text-center text-[13px] font-bold text-[#111111]">{qty}</span>
        <button
          type="button"
          onClick={() => setQty(q => q + 1)}
          className="w-9 h-full flex items-center justify-center text-[#525866] hover:bg-[#F3F4F6] transition-colors text-lg font-bold"
        >+</button>
      </div>

      {/* Line total */}
      <div className="flex items-center justify-end shrink-0 w-[84px]">
        <span className="text-[13px] font-bold text-[#111111]">
          {lineTotal} <span className="text-[11px] text-[#8B93A7] font-semibold">GHS</span>
        </span>
      </div>

      {/* Remove */}
      {showRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="w-9 h-[42px] shrink-0 flex items-center justify-center rounded-[10px] text-[#EF4444] hover:bg-[#FEF2F2] transition-colors"
        >
          <Icon icon="solar:trash-bin-trash-linear" className="text-[17px]" />
        </button>
      )}
    </div>
  );
}

export function NewOrderModal() {
  const { isNewOrderModalOpen, setNewOrderModalOpen, addOrder } = useRetailer();
  const [itemRows, setItemRows] = useState([Date.now()]);
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [digitalAddress, setDigitalAddress] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('Delivery / Dispatch');
  const [payStatus, setPayStatus] = useState('Pending Payment');
  const [selectedAgent, setSelectedAgent] = useState(MOCK_AGENTS[0]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = digitalAddress.length > 1 
    ? GH_ADDRESSES.filter(a => a.code.startsWith(digitalAddress) || a.area.toLowerCase().includes(digitalAddress.toLowerCase()))
    : [];

  const addRow = () => setItemRows(r => [...r, Date.now()]);
  const removeRow = (key: number) => setItemRows(r => r.filter(k => k !== key));

  const handleCreateOrder = () => {
    const newId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const isDelivery = deliveryMethod === 'Delivery / Dispatch';
    
    addOrder({
      id: newId,
      customer: customerName || 'Guest Customer',
      type: 'Retail',
      amount: '0.00 GHS',
      payStatus: payStatus === 'Pending Payment' ? 'Pending' : 'Paid',
      paymentMethod: payStatus.includes('Cash') ? 'Cash' : 'Bank Transfer',
      delStatus: isDelivery ? 'Ready' : 'In-Store Pickup',
      credStatus: 'N/A',
      date: 'Just now',
      deliveryAddress: address,
      digitalAddress: digitalAddress,
      orderNotes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: [],
      agent: isDelivery ? selectedAgent : undefined,
    });
    
    setNewOrderModalOpen(false);
    // Reset form
    setCustomerName('');
    setPhoneNumber('');
    setAddress('');
    setDigitalAddress('');
  };

  return (
    <Dialog.Root open={isNewOrderModalOpen} onOpenChange={setNewOrderModalOpen}>
      <AnimatePresence>
        {isNewOrderModalOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/55 backdrop-blur-[8px] z-50"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, y: 28, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 28, scale: 0.97 }}
                transition={{ type: 'spring', duration: 0.42, bounce: 0.16 }}
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[640px] z-50 focus:outline-none flex flex-col max-h-[92vh] rounded-[28px] overflow-hidden bg-white"
                style={{ boxShadow: '0 40px 100px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,255,255,0.06)' }}
              >
                {/* ── Hero Header ── */}
                <div
                  className="relative shrink-0 overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #120009 0%, #2e001a 55%, #120009 100%)' }}
                >
                  <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-25 pointer-events-none"
                    style={{ background: 'radial-gradient(circle, #D40073 0%, transparent 65%)' }} />
                  <div className="absolute top-6 left-1/3 w-32 h-32 rounded-full opacity-10 pointer-events-none"
                    style={{ background: 'radial-gradient(circle, #ff80c8 0%, transparent 70%)' }} />
                  <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full opacity-15 pointer-events-none"
                    style={{ background: 'radial-gradient(circle, #ff4db8 0%, transparent 70%)' }} />

                  <div className="relative px-8 pt-8 pb-7 flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-[52px] h-[52px] rounded-[16px] flex items-center justify-center shrink-0"
                        style={{
                          background: 'linear-gradient(135deg, rgba(212,0,115,0.3), rgba(212,0,115,0.15))',
                          border: '1px solid rgba(212,0,115,0.4)',
                          boxShadow: '0 0 20px rgba(212,0,115,0.2)',
                        }}
                      >
                        <Icon icon="solar:bag-5-bold" className="text-[28px]" style={{ color: '#ff6ec4' }} />
                      </div>
                      <div>
                        <h2 className="text-[21px] font-bold text-white tracking-tight leading-snug">Issue New Order</h2>
                        <p className="text-[13px] font-medium mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
                          Create a sales order from available inventory
                        </p>
                      </div>
                    </div>

                    <Dialog.Close asChild>
                      <button className="w-9 h-9 shrink-0 mt-0.5 flex items-center justify-center rounded-full transition-all"
                        style={{ color: 'rgba(255,255,255,0.5)' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                        <Icon icon="solar:close-square-linear" className="text-[22px]" />
                      </button>
                    </Dialog.Close>
                  </div>

                  <div className="px-8 pb-6 flex items-center gap-2">
                    {['Customer', 'Items', 'Fulfillment'].map((s, i) => (
                      <React.Fragment key={s}>
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                            style={{ background: i === 0 ? '#D40073' : 'rgba(255,255,255,0.12)', color: i === 0 ? '#fff' : 'rgba(255,255,255,0.4)' }}>
                            {i + 1}
                          </div>
                          <span className="text-[12px] font-semibold" style={{ color: i === 0 ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.35)' }}>{s}</span>
                        </div>
                        {i < 2 && <div className="flex-1 h-[1px] opacity-20" style={{ background: 'white' }} />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto bg-[#F3F4F6]">
                  <div className="p-5 space-y-3">
                    <NewOrderSection icon="solar:user-rounded-bold" label="Customer Information" color="#2563EB" bgColor="#EFF6FF">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FieldGroup label="Customer Name" icon="solar:user-linear">
                          <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="e.g. Kwame Mensah" className="modal-input" />
                        </FieldGroup>
                        <FieldGroup label="Phone Number" icon="solar:phone-linear">
                          <input type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="e.g. 024 XXX XXXX" className="modal-input" />
                        </FieldGroup>
                        <FieldGroup label="Location / Area" icon="solar:map-point-linear" className="sm:col-span-2">
                          <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="e.g. Accra, East Legon" className="modal-input" />
                        </FieldGroup>
                      </div>
                    </NewOrderSection>

                    <NewOrderSection icon="solar:box-bold" label="Order Items" color="#D40073" bgColor="rgba(212,0,115,0.08)">
                      <div className="space-y-2">
                        {itemRows.map((key) => (
                          <OrderItemRow key={key} showRemove={itemRows.length > 1} onRemove={() => removeRow(key)} />
                        ))}
                        <button type="button" onClick={addRow} className="w-full h-10 rounded-[10px] border-2 border-dashed border-[#ECEDEF] text-[13px] font-semibold text-[#8B93A7] hover:border-[#D40073] hover:text-[#D40073] hover:bg-[rgba(212,0,115,0.03)] transition-all flex items-center justify-center gap-2">
                          <Icon icon="solar:add-circle-linear" className="text-[16px]" />
                          Add another item
                        </button>
                      </div>
                    </NewOrderSection>

                    <NewOrderSection icon="solar:routing-2-bold" label="Fulfillment & Payment" color="#9333EA" bgColor="#F5F3FF">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FieldGroup label="Delivery Method" icon="solar:delivery-linear">
                          <div className="relative">
                            <select value={deliveryMethod} onChange={e => setDeliveryMethod(e.target.value)} className="modal-input appearance-none pr-9 cursor-pointer">
                              <option>Delivery / Dispatch</option>
                              <option>In-Store Pickup</option>
                            </select>
                            <Icon icon="solar:alt-arrow-down-linear" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B93A7] text-[15px] pointer-events-none" />
                          </div>
                        </FieldGroup>
                        <AnimatePresence>
                          {deliveryMethod === 'Delivery / Dispatch' && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="sm:col-span-2">
                              <FieldGroup label="Assign Delivery Agent" icon="solar:user-speak-linear">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                  {MOCK_AGENTS.map((agent) => (
                                    <button key={agent.name} type="button" onClick={() => setSelectedAgent(agent)} className={`p-3 rounded-[16px] border-2 transition-all flex items-center gap-3 text-left ${selectedAgent.name === agent.name ? 'border-[#D40073] bg-[#D40073]/5 ring-4 ring-[#D40073]/10' : 'border-[#ECEDEF] bg-white hover:border-[#D40073]/30'}`}>
                                      <img src={agent.avatar} alt={agent.name} className="w-10 h-10 rounded-full border border-white shadow-sm" />
                                      <div className="min-w-0">
                                        <div className="text-[13px] font-bold text-[#111111] truncate">{agent.name}</div>
                                        <div className="text-[10px] font-medium text-[#8B93A7] truncate">{agent.vehicle.split(' — ')[1]}</div>
                                      </div>
                                      {selectedAgent.name === agent.name && <Icon icon="solar:check-circle-bold" className="ml-auto text-[#D40073] text-[18px]" />}
                                    </button>
                                  ))}
                                </div>
                              </FieldGroup>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <FieldGroup label="Payment Status" icon="solar:card-linear">
                          <div className="relative">
                            <select value={payStatus} onChange={e => setPayStatus(e.target.value)} className="modal-input appearance-none pr-9 cursor-pointer">
                              <option>Pending Payment</option>
                              <option>Paid (Cash)</option>
                              <option>Paid (Mobile Money)</option>
                              <option>Credit Issue</option>
                            </select>
                            <Icon icon="solar:alt-arrow-down-linear" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B93A7] text-[15px] pointer-events-none" />
                          </div>
                        </FieldGroup>
                      </div>

                      <div className="mt-4 p-4 rounded-[12px] bg-[#2563EB]/5 border border-[#2563EB]/10">
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-[12px] font-bold text-[#2563EB] uppercase tracking-wider flex items-center gap-2">
                            <Icon icon="emojione:flag-for-ghana" className="text-[16px]" />
                            Ghana Digital Address (GPS)
                          </label>
                        </div>
                        <div className="relative">
                          <Icon icon="solar:map-point-wave-bold" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2563EB] text-[18px]" />
                          <input 
                            type="text" 
                            value={digitalAddress}
                            onChange={e => {
                              setDigitalAddress(e.target.value.toUpperCase());
                              setShowSuggestions(true);
                            }}
                            onFocus={() => setShowSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                            placeholder="e.g. GA-183-4927" 
                            className="w-full h-11 pl-11 pr-4 bg-white border border-[#2563EB]/20 rounded-[10px] text-[14px] font-bold text-[#111111] placeholder:text-[#2563EB]/30 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 transition-all uppercase tracking-widest" 
                          />
                          <AnimatePresence>
                            {showSuggestions && suggestions.length > 0 && (
                              <motion.div initial={{ opacity: 0, y: -4, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4, scale: 0.98 }} className="absolute left-0 right-0 top-full mt-2 bg-white rounded-[12px] border border-[#2563EB]/20 shadow-[0_12px_30px_rgba(37,99,235,0.15)] overflow-hidden z-[60]">
                                {suggestions.map((s, i) => (
                                  <button key={i} type="button" onClick={() => { setDigitalAddress(s.code); setAddress(s.area); setShowSuggestions(false); }} className="w-full px-4 py-3 flex flex-col items-start gap-1 hover:bg-[#2563EB]/5 transition-colors border-b border-[#2563EB]/5 last:border-0">
                                    <span className="text-[14px] font-bold text-[#111111] tracking-widest">{s.code}</span>
                                    <span className="text-[12px] font-medium text-[#2563EB]">{s.area}</span>
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </NewOrderSection>
                  </div>
                </div>

                <div className="shrink-0 px-6 py-5 bg-white border-t border-[#ECEDEF] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <div className="text-[11px] font-bold text-[#B0B7C3] uppercase tracking-widest mb-0.5">Estimated Total</div>
                    <div className="text-[26px] font-extrabold text-[#111111] tracking-tight leading-none">0.00 <span className="text-[15px] text-[#8B93A7] font-semibold">GHS</span></div>
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <button type="button" onClick={() => setNewOrderModalOpen(false)} className="flex-1 sm:flex-none h-11 px-5 rounded-[12px] bg-[#F3F4F6] hover:bg-[#E4E7EC] text-[#525866] font-bold text-[14px] transition-colors">Cancel</button>
                    <button type="button" onClick={handleCreateOrder} className="flex-1 sm:flex-none h-11 px-7 rounded-[12px] font-bold text-[14px] text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98]" style={{ background: 'linear-gradient(135deg, #D40073 0%, #a0005a 100%)', boxShadow: '0 4px 20px rgba(212,0,115,0.38)' }}>
                      <Icon icon="solar:check-circle-bold" className="text-[18px]" />
                      Confirm Order
                    </button>
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>

      <style>{`
        .modal-input {
          width: 100%;
          height: 44px;
          padding: 0 14px;
          background: #ffffff;
          border: 1.5px solid #E4E7EC;
          border-radius: 10px;
          font-size: 13.5px;
          color: #111111;
          font-family: inherit;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .modal-input::placeholder { color: #B0B7C3; }
        .modal-input:focus {
          outline: none;
          border-color: #D40073;
          box-shadow: 0 0 0 3.5px rgba(212,0,115,0.11);
        }
        textarea.modal-input { height: auto; }
      `}</style>
    </Dialog.Root>
  );
}
