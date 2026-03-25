import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from '@iconify/react';
import * as Dialog from '@radix-ui/react-dialog';
import { useNavigate } from 'react-router';
import { MOCK_RETAILER_ORDERS } from '../../data/mockRetailerOrders';

const FILTERS = ['All Orders', 'New', 'Pending Payment', 'Ready for Dispatch', 'In Transit', 'Completed', 'Credit Orders'];

/* ─── Catalog data ──────────────────────────────────────── */
const CATALOG = [
  { label: 'Portland Cement 50kg', price: 85 },
  { label: 'Iron Rods 16mm', price: 120 },
  { label: 'Emulsion Paint 20L', price: 450 },
  { label: 'Sand (1 Tipper)', price: 600 },
  { label: 'Gravel (1 Tipper)', price: 750 },
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
    <div className="flex items-stretch gap-2 bg-[#F7F7F8] rounded-[12px] p-3 border border-[#ECEDEF]">
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

/* ─── Main export ────────────────────────────────────────── */

export function OrdersTab() {
  const [activeFilter, setActiveFilter] = useState('All Orders');
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [itemRows, setItemRows] = useState([0]); // array of unique keys
  const navigate = useNavigate();

  const addRow = () => setItemRows(r => [...r, Date.now()]);
  const removeRow = (key: number) => setItemRows(r => r.filter(k => k !== key));

  return (
    <div className="bg-white rounded-[16px] border border-[#ECEDEF] flex flex-col min-h-[600px]">
      {/* Header and Filters */}
      <div className="p-4 border-b border-[#ECEDEF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <div className="relative group w-full sm:w-[320px] shrink-0">
            <Icon icon="solar:magnifer-linear" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B93A7] group-focus-within:text-[#D40073] transition-colors text-[16px]" />
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full h-10 pl-10 pr-4 bg-[#F7F7F8] border border-transparent rounded-[8px] text-[13px] text-[#111111] placeholder:text-[#8B93A7] focus:outline-none focus:bg-white focus:border-[#D40073] transition-all"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0 flex-1">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`whitespace-nowrap h-8 px-3 rounded-[6px] text-[13px] font-semibold transition-colors ${
                  activeFilter === f ? 'bg-[#111111] text-white' : 'bg-[#F7F7F8] text-[#525866] hover:bg-[#ECEDEF]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setIsNewOrderModalOpen(true)}
          className="h-10 px-4 shrink-0 flex items-center gap-2 bg-[#D40073] hover:bg-[#B80063] text-white rounded-[10px] text-[13px] font-semibold transition-colors"
        >
          <Icon icon="solar:add-circle-linear" className="text-[18px]" />
          Issue New Order
        </button>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F7F7F8] border-b border-[#ECEDEF]">
              <th className="py-3 px-5 text-[12px] font-bold text-[#525866] uppercase tracking-wider">Order ID</th>
              <th className="py-3 px-5 text-[12px] font-bold text-[#525866] uppercase tracking-wider">Customer</th>
              <th className="py-3 px-5 text-[12px] font-bold text-[#525866] uppercase tracking-wider">Type / Amount</th>
              <th className="py-3 px-5 text-[12px] font-bold text-[#525866] uppercase tracking-wider">Payment Status</th>
              <th className="py-3 px-5 text-[12px] font-bold text-[#525866] uppercase tracking-wider">Delivery Status</th>
              <th className="py-3 px-5 text-[12px] font-bold text-[#525866] uppercase tracking-wider">Date</th>
              <th className="py-3 px-5 text-[12px] font-bold text-[#525866] uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-[13px]">
            {MOCK_RETAILER_ORDERS.map((order) => (
              <tr
                key={order.id}
                onClick={() => navigate(`/dashboard/retailer/orders/${order.id}`)}
                className="border-b border-[#ECEDEF] last:border-0 hover:bg-[#FBFBFC] transition-colors cursor-pointer group"
              >
                <td className="py-4 px-5"><span className="font-bold text-[#111111]">{order.id}</span></td>
                <td className="py-4 px-5 font-semibold text-[#111111]">{order.customer}</td>
                <td className="py-4 px-5">
                  <div className="font-bold text-[#111111]">{order.amount}</div>
                  <div className="text-[12px] text-[#8B93A7] font-medium">{order.type}</div>
                </td>
                <td className="py-4 px-5">
                  <span className={`inline-flex items-center px-2 py-1 rounded-[6px] text-[12px] font-bold ${
                    order.payStatus === 'Paid' ? 'bg-[#ECFDF3] text-[#16A34A]' :
                    order.payStatus === 'Credit' ? 'bg-[#EFF6FF] text-[#2563EB]' :
                    'bg-[#FFF7ED] text-[#D97706]'
                  }`}>
                    {order.payStatus}
                  </span>
                </td>
                <td className="py-4 px-5">
                  <div className="flex items-center gap-1.5 font-semibold text-[#525866]">
                    {order.delStatus === 'Delivered' && <Icon icon="solar:check-circle-bold" className="text-[#16A34A] text-[16px]" />}
                    {order.delStatus === 'In Transit' && <Icon icon="solar:routing-2-bold" className="text-[#2563EB] text-[16px]" />}
                    {order.delStatus === 'Ready' && <Icon icon="solar:box-bold" className="text-[#D40073] text-[16px]" />}
                    {order.delStatus === 'Pending' && <Icon icon="solar:clock-circle-bold" className="text-[#8B93A7] text-[16px]" />}
                    {order.delStatus}
                  </div>
                </td>
                <td className="py-4 px-5 font-medium text-[#525866]">{order.date}</td>
                <td className="py-4 px-5 text-right">
                  <button
                    onClick={(e) => e.stopPropagation()}
                    type="button"
                    aria-label="Order actions"
                    className="w-8 h-8 inline-flex items-center justify-center text-[#8B93A7] hover:text-[#111111] hover:bg-[#F3F4F6] rounded-[8px] transition-colors"
                  >
                    <Icon icon="solar:menu-dots-bold" className="text-[18px]" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-[#ECEDEF] flex items-center justify-between text-[13px] font-medium text-[#525866] bg-[#F7F7F8]">
        <span>Showing {MOCK_RETAILER_ORDERS.length} of {MOCK_RETAILER_ORDERS.length} orders</span>
      </div>

      {/* ════════════════════════════════════════════
          Issue New Order Modal — Premium Design
      ════════════════════════════════════════════ */}
      <Dialog.Root open={isNewOrderModalOpen} onOpenChange={setIsNewOrderModalOpen}>
        <AnimatePresence>
          {isNewOrderModalOpen && (
            <Dialog.Portal forceMount>
              {/* Overlay */}
              <Dialog.Overlay asChild>
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/55 backdrop-blur-[8px] z-50"
                />
              </Dialog.Overlay>

              {/* Panel */}
              <Dialog.Content asChild>
                <motion.div
                  initial={{ opacity: 0, y: 28, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 28, scale: 0.97 }}
                  transition={{ type: 'spring', duration: 0.42, bounce: 0.16 }}
                  className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[640px] z-50 focus:outline-none flex flex-col max-h-[92vh] rounded-[28px] overflow-hidden"
                  style={{ boxShadow: '0 40px 100px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,255,255,0.06)' }}
                >

                  {/* ── Hero Header ── */}
                  <div
                    className="relative shrink-0 overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #120009 0%, #2e001a 55%, #120009 100%)' }}
                  >
                    {/* Decorative glow orbs */}
                    <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-25 pointer-events-none"
                      style={{ background: 'radial-gradient(circle, #D40073 0%, transparent 65%)' }} />
                    <div className="absolute top-6 left-1/3 w-32 h-32 rounded-full opacity-10 pointer-events-none"
                      style={{ background: 'radial-gradient(circle, #ff80c8 0%, transparent 70%)' }} />
                    <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full opacity-15 pointer-events-none"
                      style={{ background: 'radial-gradient(circle, #ff4db8 0%, transparent 70%)' }} />

                    <div className="relative px-8 pt-8 pb-7 flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        {/* Icon badge */}
                        <div
                          className="w-[52px] h-[52px] rounded-[16px] flex items-center justify-center shrink-0"
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
                        <button
                          className="w-9 h-9 shrink-0 mt-0.5 flex items-center justify-center rounded-full transition-all"
                          style={{ color: 'rgba(255,255,255,0.5)' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          <Icon icon="solar:close-square-linear" className="text-[22px]" />
                        </button>
                      </Dialog.Close>
                    </div>

                    {/* Step indicators */}
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

                  {/* ── Scrollable Body ── */}
                  <div className="flex-1 overflow-y-auto bg-[#F3F4F6]">
                    <div className="p-5 space-y-3">

                      {/* Customer */}
                      <NewOrderSection icon="solar:user-rounded-bold" label="Customer Information" color="#2563EB" bgColor="#EFF6FF">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FieldGroup label="Customer Name" icon="solar:user-linear">
                            <input type="text" placeholder="e.g. Kwame Mensah" className="modal-input" />
                          </FieldGroup>
                          <FieldGroup label="Phone Number" icon="solar:phone-linear">
                            <input type="tel" placeholder="e.g. 024 XXX XXXX" className="modal-input" />
                          </FieldGroup>
                          <FieldGroup label="Location / Area" icon="solar:map-point-linear" className="sm:col-span-2">
                            <input type="text" placeholder="e.g. Accra, East Legon" className="modal-input" />
                          </FieldGroup>
                        </div>
                      </NewOrderSection>

                      {/* Order Items */}
                      <NewOrderSection icon="solar:box-bold" label="Order Items" color="#D40073" bgColor="rgba(212,0,115,0.08)">
                        <div className="space-y-2">
                          {itemRows.map((key, idx) => (
                            <OrderItemRow
                              key={key}
                              showRemove={itemRows.length > 1}
                              onRemove={() => removeRow(key)}
                            />
                          ))}
                          <button
                            type="button"
                            onClick={addRow}
                            className="w-full h-10 rounded-[10px] border-2 border-dashed border-[#ECEDEF] text-[13px] font-semibold text-[#8B93A7] hover:border-[#D40073] hover:text-[#D40073] hover:bg-[rgba(212,0,115,0.03)] transition-all flex items-center justify-center gap-2"
                          >
                            <Icon icon="solar:add-circle-linear" className="text-[16px]" />
                            Add another item
                          </button>
                        </div>
                      </NewOrderSection>

                      {/* Fulfillment */}
                      <NewOrderSection icon="solar:routing-2-bold" label="Fulfillment & Payment" color="#9333EA" bgColor="#F5F3FF">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FieldGroup label="Delivery Method" icon="solar:delivery-linear">
                            <div className="relative">
                              <select className="modal-input appearance-none pr-9 cursor-pointer">
                                <option>Delivery / Dispatch</option>
                                <option>In-Store Pickup</option>
                              </select>
                              <Icon icon="solar:alt-arrow-down-linear" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B93A7] text-[15px] pointer-events-none" />
                            </div>
                          </FieldGroup>
                          <FieldGroup label="Payment Status" icon="solar:card-linear">
                            <div className="relative">
                              <select className="modal-input appearance-none pr-9 cursor-pointer">
                                <option>Pending Payment</option>
                                <option>Paid (Cash)</option>
                                <option>Paid (Mobile Money)</option>
                                <option>Credit Issue</option>
                              </select>
                              <Icon icon="solar:alt-arrow-down-linear" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B93A7] text-[15px] pointer-events-none" />
                            </div>
                          </FieldGroup>
                        </div>
                        <FieldGroup label="Delivery Notes (optional)" icon="solar:document-text-linear" className="mt-4">
                          <textarea rows={2} placeholder="Any special delivery instructions..." className="modal-input resize-none py-3 leading-relaxed" />
                        </FieldGroup>
                      </NewOrderSection>

                    </div>
                  </div>

                  {/* ── Footer ── */}
                  <div className="shrink-0 px-6 py-5 bg-white border-t border-[#ECEDEF] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <div className="text-[11px] font-bold text-[#B0B7C3] uppercase tracking-widest mb-0.5">Estimated Total</div>
                      <div className="text-[26px] font-extrabold text-[#111111] tracking-tight leading-none">
                        0.00 <span className="text-[15px] text-[#8B93A7] font-semibold">GHS</span>
                      </div>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => setIsNewOrderModalOpen(false)}
                        className="flex-1 sm:flex-none h-11 px-5 rounded-[12px] bg-[#F3F4F6] hover:bg-[#E4E7EC] text-[#525866] font-bold text-[14px] transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="flex-1 sm:flex-none h-11 px-7 rounded-[12px] font-bold text-[14px] text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                        style={{
                          background: 'linear-gradient(135deg, #D40073 0%, #a0005a 100%)',
                          boxShadow: '0 4px 20px rgba(212,0,115,0.38)',
                        }}
                      >
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
      </Dialog.Root>

      {/* Scoped input styles */}
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
    </div>
  );
}