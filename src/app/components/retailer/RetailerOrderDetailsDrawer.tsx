import React, { useEffect, useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'motion/react';
import { useNavigate, useParams } from 'react-router';
import { type RetailerOrder, type RetailerOrderItem } from '../../data/mockRetailerOrders';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useRetailer } from './RetailerContext';

type OrderDraft = Pick<
  RetailerOrder,
  | 'payStatus'
  | 'paymentMethod'
  | 'amount'
  | 'delStatus'
  | 'credStatus'
  | 'deliveryAddress'
  | 'digitalAddress'
  | 'orderNotes'
  | 'updatedAt'
>;

const PAYMENT_METHODS = ['Cash', 'Mobile Money', 'Bank Transfer', 'POS', 'Invoice / Credit'];
const PAYMENT_STATUSES = ['Paid', 'Pending', 'Credit'];
const DELIVERY_STATUSES = ['Pending', 'Ready', 'In Transit', 'Delivered', 'In-Store Pickup'];

const MOCK_AGENT = {
  name: 'John Doe',
  phone: '+233 24 123 4567',
  avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=100',
  vehicle: 'Motorbike — GT-2931-22',
};

function nowIso() {
  return new Date().toISOString();
}

function parseMoneyToNumber(value: string) {
  const raw = value.replace(/[^0-9.]/g, '');
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) ? n : 0;
}

function formatGhs(n: number) {
  const formatted = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(n);
  return `${formatted} GHS`;
}

function formatTs(ts: string) {
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return ts;
  return d.toLocaleString();
}

export function RetailerOrderDetailsDrawer() {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const { orders, updateOrder } = useRetailer();

  const baseOrder = useMemo(
    () => (orderId ? orders.find((o) => o.id === orderId) : undefined),
    [orderId, orders],
  );

  const [draft, setDraft] = useState<(OrderDraft & { items?: RetailerOrderItem[] }) | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  useEffect(() => {
    if (!baseOrder) {
      setDraft(null);
      setIsDirty(false);
      return;
    }

    setDraft({
      payStatus: baseOrder.payStatus,
      paymentMethod: baseOrder.paymentMethod,
      amount: baseOrder.amount,
      delStatus: baseOrder.delStatus,
      credStatus: baseOrder.credStatus,
      deliveryAddress: baseOrder.deliveryAddress,
      digitalAddress: baseOrder.digitalAddress,
      orderNotes: baseOrder.orderNotes,
      updatedAt: baseOrder.updatedAt,
      items: baseOrder.items ?? [],
    });
    setIsDirty(false);
  }, [baseOrder]);

  const order: RetailerOrder | undefined = useMemo(() => {
    if (!baseOrder) return undefined;
    if (!draft) return baseOrder;
    return { ...baseOrder, ...draft };
  }, [baseOrder, draft]);

  const open = Boolean(orderId);

  const close = () => {
    navigate('/dashboard/retailer', { state: { activeTab: 'Orders' } });
  };

  const setField = <K extends keyof OrderDraft>(key: K, value: OrderDraft[K]) => {
    setDraft((prev) => {
      const next = { ...(prev ?? ({} as any)), [key]: value };
      return next;
    });
    setIsDirty(true);
  };

  const setItems = (items: RetailerOrderItem[]) => {
    setDraft((prev) => ({ ...(prev ?? ({} as any)), items }));
    setIsDirty(true);
  };

  const recalcTotals = (items: RetailerOrderItem[]) => {
    const total = items.reduce((sum, it) => sum + parseMoneyToNumber(it.lineTotal), 0);
    setField('amount', formatGhs(total));
  };

  const updateItem = (index: number, patch: Partial<RetailerOrderItem>) => {
    const items = [...(draft?.items ?? order?.items ?? [])];
    const prev = items[index] ?? { name: '', qty: 1, unitPrice: '0 GHS', lineTotal: '0 GHS', image: '' };
    const nextItem: RetailerOrderItem = { ...prev, ...patch };

    const unit = parseMoneyToNumber(nextItem.unitPrice);
    const qty = Number.isFinite(nextItem.qty) ? nextItem.qty : 0;
    nextItem.lineTotal = formatGhs(unit * qty);

    items[index] = nextItem;
    setItems(items);
    recalcTotals(items);
  };

  const addItem = () => {
    const items = [...(draft?.items ?? order?.items ?? [])];
    items.push({ name: 'New item', qty: 1, unitPrice: '0 GHS', lineTotal: '0 GHS', image: '' });
    setItems(items);
    recalcTotals(items);
  };

  const removeItem = (index: number) => {
    const items = [...(draft?.items ?? order?.items ?? [])];
    items.splice(index, 1);
    setItems(items);
    recalcTotals(items);
  };

  const markAsPaid = () => {
    setField('payStatus', 'Paid');
  };

  const advanceDeliveryStatus = () => {
    const current = order?.delStatus ?? 'Pending';
    const idx = DELIVERY_STATUSES.indexOf(current);
    const next = DELIVERY_STATUSES[(idx + 1) % DELIVERY_STATUSES.length];
    setField('delStatus', next);
  };

  const save = () => {
    if (!orderId || !draft) return;
    updateOrder(orderId, draft);
    setIsDirty(false);
  };

  const reset = () => {
    if (!baseOrder) return;
    setDraft({
      payStatus: baseOrder.payStatus,
      paymentMethod: baseOrder.paymentMethod,
      amount: baseOrder.amount,
      delStatus: baseOrder.delStatus,
      credStatus: baseOrder.credStatus,
      deliveryAddress: baseOrder.deliveryAddress,
      digitalAddress: baseOrder.digitalAddress,
      orderNotes: baseOrder.orderNotes,
      updatedAt: baseOrder.updatedAt,
      items: baseOrder.items ?? [],
    });
    setIsDirty(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={(v) => (!v ? close() : null)}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-50"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div
                initial={{ x: 24, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 24, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                className="fixed right-0 top-0 h-[100dvh] w-full max-w-[520px] bg-white z-50 shadow-2xl border-l border-[#ECEDEF] flex flex-col focus:outline-none"
              >
                {/* Header */}
                <div className="p-5 border-b border-[#ECEDEF] bg-white shrink-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="text-[18px] font-bold text-[#111111] tracking-tight truncate">
                          {order?.id ?? 'Order details'}
                        </h2>
                        {isDirty && (
                          <span className="inline-flex items-center px-2 py-1 rounded-[8px] text-[11px] font-bold bg-[#FFF7ED] text-[#D97706]">
                            Unsaved
                          </span>
                        )}
                      </div>
                      <p className="text-[13px] text-[#525866] font-medium mt-1 truncate">
                        {order ? `${order.customer} • ${order.type}` : `Order ${orderId}`}
                      </p>
                    </div>

                    <Dialog.Close asChild>
                      <button
                        type="button"
                        className="w-9 h-9 rounded-full flex items-center justify-center text-[#8B93A7] hover:bg-[#F3F4F6] transition-colors shrink-0"
                        aria-label="Close"
                      >
                        <Icon icon="solar:close-circle-linear" className="text-[22px]" />
                      </button>
                    </Dialog.Close>
                  </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#FBFBFC]">
                  {!order ? (
                    <div className="bg-white border border-[#ECEDEF] rounded-[16px] p-5">
                      <div className="text-[14px] font-bold text-[#111111] mb-1">Order not found</div>
                      <div className="text-[13px] text-[#525866]">
                        The order <span className="font-semibold text-[#111111]">{orderId}</span> doesn’t exist.
                      </div>
                      <button
                        type="button"
                        onClick={close}
                        className="mt-4 h-10 px-4 bg-[#111111] hover:bg-[#333333] text-white rounded-[12px] font-bold text-[13px] transition-colors"
                      >
                        Back to Orders
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Quick Actions */}
                      <div className="bg-white border border-[#ECEDEF] rounded-[16px] p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <Icon icon="solar:settings-linear" className="text-[#D40073] text-[18px]" />
                          <div className="text-[14px] font-bold text-[#111111]">Quick actions</div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={markAsPaid}
                            className="h-10 px-4 flex items-center gap-2 bg-[#ECFDF3] hover:bg-[#D1FAE5] text-[#16A34A] rounded-[12px] text-[13px] font-bold transition-colors"
                          >
                            <Icon icon="solar:check-circle-linear" className="text-[16px]" />
                            Mark as Paid
                          </button>
                          <button
                            type="button"
                            onClick={advanceDeliveryStatus}
                            className="h-10 px-4 flex items-center gap-2 bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#2563EB] rounded-[12px] text-[13px] font-bold transition-colors"
                          >
                            <Icon icon="solar:routing-2-linear" className="text-[16px]" />
                            Advance delivery status
                          </button>
                          <button
                            type="button"
                            onClick={save}
                            disabled={!isDirty}
                            className="h-10 px-4 flex items-center gap-2 bg-[#111111] hover:bg-[#333333] text-white rounded-[12px] text-[13px] font-bold transition-colors disabled:opacity-50 disabled:hover:bg-[#111111] ml-auto"
                          >
                            <Icon icon="solar:diskette-linear" className="text-[16px]" />
                            Save
                          </button>
                        </div>
                      </div>

                      {/* Timestamps */}
                      <div className="bg-white border border-[#ECEDEF] rounded-[16px] p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <Icon icon="solar:clock-circle-linear" className="text-[#D40073] text-[18px]" />
                          <div className="text-[14px] font-bold text-[#111111]">Timestamps</div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-[#F7F7F8] border border-[#ECEDEF] rounded-[12px] p-3">
                            <div className="text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Created</div>
                            <div className="text-[13px] font-semibold text-[#111111] mt-1">{formatTs(order.createdAt)}</div>
                          </div>
                          <div className="bg-[#F7F7F8] border border-[#ECEDEF] rounded-[12px] p-3">
                            <div className="text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Updated</div>
                            <div className="text-[13px] font-semibold text-[#111111] mt-1">{formatTs(order.updatedAt)}</div>
                          </div>
                        </div>
                      </div>

                      {/* Payment */}
                      <div className="bg-white border border-[#ECEDEF] rounded-[16px] p-5 space-y-4">
                        <div className="flex items-center gap-2">
                          <Icon icon="solar:wallet-money-linear" className="text-[#D40073] text-[18px]" />
                          <div className="text-[14px] font-bold text-[#111111]">Payment</div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <label className="text-[12px] font-bold text-[#525866]">Payment Status</label>
                            <Select value={order.payStatus} onValueChange={(v) => setField('payStatus', v)}>
                              <SelectTrigger size="form">
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                              <SelectContent>
                                {PAYMENT_STATUSES.map((s) => (
                                  <SelectItem key={s} value={s}>
                                    {s}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[12px] font-bold text-[#525866]">Payment Method</label>
                            <Select value={order.paymentMethod} onValueChange={(v) => setField('paymentMethod', v)}>
                              <SelectTrigger size="form">
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                              <SelectContent>
                                {PAYMENT_METHODS.map((m) => (
                                  <SelectItem key={m} value={m}>
                                    {m}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[12px] font-bold text-[#525866]">Credit Status</label>
                          <input
                            value={order.credStatus}
                            onChange={(e) => setField('credStatus', e.target.value)}
                            className="w-full h-11 px-4 bg-[#F7F7F8] border border-[#ECEDEF] rounded-[12px] text-[14px] font-semibold text-[#111111] focus:outline-none focus:border-[#D40073] focus:bg-white transition-colors"
                          />
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="bg-white border border-[#ECEDEF] rounded-[16px] overflow-hidden">
                        <div className="p-5 border-b border-[#ECEDEF] flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <Icon icon="solar:box-linear" className="text-[#D40073] text-[18px]" />
                            <div className="text-[14px] font-bold text-[#111111]">Order items</div>
                          </div>
                          <button
                            type="button"
                            onClick={addItem}
                            className="h-9 px-3 flex items-center gap-2 bg-[#D40073] hover:bg-[#B80063] text-white rounded-[10px] text-[13px] font-bold transition-colors"
                          >
                            <Icon icon="solar:add-circle-linear" className="text-[16px]" />
                            Add item
                          </button>
                        </div>

                        <div className="p-5 space-y-3">
                          {(draft?.items ?? order.items ?? []).length ? (
                            (draft?.items ?? order.items ?? []).map((it, idx) => (
                              <div key={`${it.name}-${idx}`} className="bg-[#F7F7F8] border border-[#ECEDEF] rounded-[14px] p-4">
                                <div className="flex items-start gap-4">
                                  {/* Item Image */}
                                  <div className="w-20 h-20 rounded-[12px] bg-white border border-[#ECEDEF] overflow-hidden shrink-0 flex items-center justify-center">
                                    {it.image ? (
                                      <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
                                    ) : (
                                      <Icon icon="solar:box-linear" className="text-[24px] text-[#8B93A7]" />
                                    )}
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="flex-1 min-w-0">
                                        <label className="text-[12px] font-bold text-[#525866]">Item name</label>
                                        <input
                                          value={it.name}
                                          onChange={(e) => updateItem(idx, { name: e.target.value })}
                                          className="mt-2 w-full h-10 px-4 bg-white border border-[#ECEDEF] rounded-[12px] text-[14px] font-semibold text-[#111111] focus:outline-none focus:border-[#D40073]"
                                        />
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => removeItem(idx)}
                                        className="w-10 h-10 rounded-[12px] bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#EF4444] flex items-center justify-center transition-colors shrink-0 mt-6"
                                        aria-label="Remove item"
                                      >
                                        <Icon icon="solar:trash-bin-trash-linear" className="text-[18px]" />
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mt-4">
                                  <div className="space-y-2">
                                    <label className="text-[12px] font-bold text-[#525866]">Qty</label>
                                    <input
                                      type="number"
                                      min={0}
                                      value={it.qty}
                                      onChange={(e) => updateItem(idx, { qty: Number(e.target.value) })}
                                      className="w-full h-10 px-4 bg-white border border-[#ECEDEF] rounded-[12px] text-[14px] font-semibold text-[#111111] focus:outline-none focus:border-[#D40073]"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-[12px] font-bold text-[#525866]">Unit price</label>
                                    <input
                                      value={it.unitPrice}
                                      onChange={(e) => updateItem(idx, { unitPrice: e.target.value })}
                                      className="w-full h-10 px-4 bg-white border border-[#ECEDEF] rounded-[12px] text-[14px] font-semibold text-[#111111] focus:outline-none focus:border-[#D40073]"
                                    />
                                  </div>
                                </div>

                                <div className="mt-4 flex items-center justify-between bg-white border border-[#ECEDEF] rounded-[12px] px-4 py-3">
                                  <div className="text-[12px] font-bold text-[#525866]">Line total</div>
                                  <div className="text-[14px] font-bold text-[#111111]">{it.lineTotal}</div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="py-10 text-center text-[#8B93A7] text-[13px] font-medium">
                              No items yet. Add the first item.
                            </div>
                          )}
                        </div>

                        <div className="p-5 border-t border-[#ECEDEF] bg-[#F7F7F8] flex items-center justify-between">
                          <div className="text-[13px] font-bold text-[#525866]">Order total</div>
                          <div className="text-[16px] font-bold text-[#111111]">{order.amount}</div>
                        </div>
                      </div>

                      {/* Delivery */}
                      <div className="bg-white border border-[#ECEDEF] rounded-[16px] p-5 space-y-4">
                        <div className="flex items-center gap-2">
                          <Icon icon="solar:routing-2-linear" className="text-[#D40073] text-[18px]" />
                          <div className="text-[14px] font-bold text-[#111111]">Delivery</div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <label className="text-[12px] font-bold text-[#525866]">Delivery Status</label>
                            <Select value={order.delStatus} onValueChange={(v) => setField('delStatus', v)}>
                              <SelectTrigger size="form">
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                              <SelectContent>
                                {DELIVERY_STATUSES.map((s) => (
                                  <SelectItem key={s} value={s}>
                                    {s}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[12px] font-bold text-[#525866]">Order Date</label>
                            <input
                              value={order.date}
                              readOnly
                              className="w-full h-11 px-4 bg-[#F7F7F8] border border-[#ECEDEF] rounded-[12px] text-[14px] font-semibold text-[#525866]"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[12px] font-bold text-[#525866]">Delivery Address</label>
                          <textarea
                            value={order.deliveryAddress}
                            onChange={(e) => setField('deliveryAddress', e.target.value)}
                            className="w-full min-h-[92px] px-4 py-3 bg-[#F7F7F8] border border-[#ECEDEF] rounded-[12px] text-[14px] font-semibold text-[#111111] focus:outline-none focus:border-[#D40073] focus:bg-white transition-colors resize-none"
                          />
                        </div>

                        {order.agent && (
                          <div className="mt-4 p-4 rounded-[16px] bg-[#D40073]/5 border border-[#D40073]/10 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="text-[12px] font-bold text-[#D40073] uppercase tracking-wider flex items-center gap-1.5">
                                <Icon icon="solar:user-speak-bold" />
                                Assigned Agent
                              </div>
                              <span className="px-2 py-0.5 bg-[#D40073] text-white text-[10px] font-bold rounded-full">ACTIVE</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <img src={order.agent.avatar} alt={order.agent.name} className="w-12 h-12 rounded-[12px] border-2 border-white shadow-sm" />
                              <div className="min-w-0">
                                <div className="text-[14px] font-bold text-[#111111]">{order.agent.name}</div>
                                <div className="text-[12px] font-medium text-[#8B93A7] flex items-center gap-1">
                                  <Icon icon="solar:delivery-bold" className="text-[14px]" />
                                  {order.agent.vehicle}
                                </div>
                              </div>
                              <button className="ml-auto w-9 h-9 rounded-full bg-white border border-[#ECEDEF] text-[#D40073] flex items-center justify-center hover:bg-[#D40073] hover:text-white transition-all shadow-sm">
                                <Icon icon="solar:phone-bold" />
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="space-y-2">
                          <label className="flex items-center gap-1.5 text-[12px] font-bold text-[#525866]">
                            <Icon icon="emojione:flag-for-ghana" />
                            Ghana Digital Address (GPS)
                          </label>
                          <input
                            value={order.digitalAddress || ''}
                            onChange={(e) => setField('digitalAddress', e.target.value.toUpperCase())}
                            className="w-full h-11 px-4 bg-[#2563EB]/5 border border-[#2563EB]/10 rounded-[12px] text-[14px] font-bold text-[#111111] focus:outline-none focus:border-[#2563EB]/40 transition-colors uppercase tracking-widest placeholder:text-[#2563EB]/20"
                            placeholder="e.g. GA-183-4927"
                          />
                        </div>

                        {/* PICKUP AGENT & TRACKING SECTION */}
                        {(order.delStatus === 'In-Store Pickup' || order.id === 'ORD-8989') && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-5 rounded-[20px] bg-gradient-to-br from-[#111111] to-[#333333] text-white border border-[#222] shadow-xl"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-2">
                                <Icon icon="solar:routing-2-bold" className="text-[#D40073] text-[18px]" />
                                <span className="text-[13px] font-bold uppercase tracking-wider">Pickup Logistics</span>
                              </div>
                              <span className="px-2.5 py-1 bg-[#D40073] text-white text-[10px] font-extrabold rounded-full uppercase tracking-widest animate-pulse">
                                Live Tracking
                              </span>
                            </div>

                            <div className="flex items-center gap-3 mb-5">
                              <div className="w-12 h-12 rounded-[16px] overflow-hidden border border-white/10 relative shrink-0">
                                <img src={MOCK_AGENT.avatar} alt={MOCK_AGENT.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-[15px] font-bold truncate">{MOCK_AGENT.name}</div>
                                <div className="text-[11px] text-white/50 font-medium mt-0.5 truncate">{MOCK_AGENT.vehicle}</div>
                              </div>
                              <div className="ml-auto flex gap-2">
                                <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                                  <Icon icon="solar:phone-bold" className="text-[16px]" />
                                </button>
                                <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                                  <Icon icon="solar:chat-round-dots-bold" className="text-[16px]" />
                                </button>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => setIsMapOpen(true)}
                              className="w-full h-11 bg-white text-[#111111] rounded-[14px] font-bold text-[13px] flex items-center justify-center gap-2 hover:bg-[#F3F4F6] transition-all active:scale-[0.98] shadow-lg"
                            >
                              <Icon icon="solar:map-point-wave-bold" className="text-[18px] text-[#D40073]" />
                              View Map Live Tracking
                            </button>
                          </motion.div>
                        )}
                      </div>

                      {/* Notes */}
                      <div className="bg-white border border-[#ECEDEF] rounded-[16px] p-5 space-y-3">
                        <div className="flex items-center gap-2">
                          <Icon icon="solar:notes-linear" className="text-[#D40073] text-[18px]" />
                          <div className="text-[14px] font-bold text-[#111111]">Order Notes</div>
                        </div>
                        <textarea
                          value={order.orderNotes}
                          onChange={(e) => setField('orderNotes', e.target.value)}
                          placeholder="Add notes for this order..."
                          className="w-full min-h-[110px] px-4 py-3 bg-[#F7F7F8] border border-[#ECEDEF] rounded-[12px] text-[14px] font-semibold text-[#111111] placeholder:text-[#8B93A7] focus:outline-none focus:border-[#D40073] focus:bg-white transition-colors resize-none"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Tracking Map Modal */}
                <Dialog.Root open={isMapOpen} onOpenChange={setIsMapOpen}>
                  <AnimatePresence>
                    {isMapOpen && (
                      <Dialog.Portal forceMount>
                        <Dialog.Overlay asChild>
                          <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-[4px] z-[70]"
                          />
                        </Dialog.Overlay>
                        <Dialog.Content asChild>
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[800px] h-[600px] bg-white rounded-[24px] overflow-hidden z-[70] shadow-2xl flex flex-col"
                          >
                            <div className="p-4 border-b border-[#ECEDEF] flex items-center justify-between bg-white shrink-0">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#D40073]/10 flex items-center justify-center">
                                  <Icon icon="solar:routing-2-bold" className="text-[#D40073] text-[20px]" />
                                </div>
                                <div>
                                  <div className="text-[15px] font-bold text-[#111111]">Live Order Tracking</div>
                                  <div className="text-[12px] text-[#8B93A7] font-medium">Tracking {order?.id} — {order?.customer}</div>
                                </div>
                              </div>
                              <Dialog.Close asChild>
                                <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#F3F4F6] text-[#8B93A7] transition-colors">
                                  <Icon icon="solar:close-circle-linear" className="text-[20px]" />
                                </button>
                              </Dialog.Close>
                            </div>

                            <div className="flex-1 relative bg-[#F3F4F6] overflow-hidden">
                              {/* Mock Map Background */}
                              <div className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none">
                                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#D1D5DB" strokeWidth="1"/>
                                  </pattern>
                                  <rect width="100%" height="100%" fill="url(#grid)" />
                                </svg>
                              </div>

                              {/* Mock Streets */}
                              <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 800 600" preserveAspectRatio="none">
                                <path d="M0,100 L800,100 M0,250 L800,250 M0,450 L800,450 M150,0 L150,600 M400,0 L400,600 M650,0 L650,600" stroke="#111" strokeWidth="20" fill="none" />
                              </svg>

                              {/* Destination Marker */}
                              <motion.div 
                                initial={{ scale: 0 }} animate={{ scale: 1 }}
                                className="absolute left-[70%] top-[30%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2"
                              >
                                <div className="px-3 py-1.5 bg-[#111111] text-white text-[11px] font-bold rounded-full shadow-lg whitespace-nowrap">
                                  Destination
                                </div>
                                <div className="w-8 h-8 bg-[#111111] rounded-full border-4 border-white shadow-xl flex items-center justify-center">
                                  <Icon icon="solar:home-2-bold" className="text-white text-[16px]" />
                                </div>
                                <div className="w-4 h-4 rounded-full bg-[#111111]/20 animate-ping absolute -bottom-1" />
                              </motion.div>

                              {/* Agent Marker */}
                              <motion.div
                                animate={{ 
                                  x: [50, 450, 450, 560], 
                                  y: [500, 500, 250, 180] 
                                }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                className="absolute flex flex-col items-center gap-2"
                              >
                                <div className="px-3 py-2 bg-white rounded-[12px] shadow-[0_8px_20px_rgba(0,0,0,0.15)] border border-[#ECEDEF] flex items-center gap-2 whitespace-nowrap">
                                  <div className="w-6 h-6 rounded-full overflow-hidden border border-[#ECEDEF]">
                                    <img src={MOCK_AGENT.avatar} alt="" className="w-full h-full object-cover" />
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-[11px] font-bold text-[#111111] leading-none">{MOCK_AGENT.name}</span>
                                    <span className="text-[9px] font-medium text-[#2563EB] mt-0.5">3.2 km away • 8 mins</span>
                                  </div>
                                </div>
                                <div className="w-10 h-10 bg-[#D40073] rounded-full border-4 border-white shadow-xl flex items-center justify-center">
                                  <Icon icon="solar:routing-2-bold" className="text-white text-[20px] animate-pulse" />
                                </div>
                                <div className="w-6 h-6 rounded-full bg-[#D40073]/30 animate-ping absolute -bottom-1" />
                              </motion.div>

                              {/* Tracking Overlay Card */}
                              <div className="absolute left-6 bottom-6 right-6 p-5 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-[20px] border border-[#ECEDEF] flex items-center justify-between gap-6 overflow-hidden">
                                <div className="absolute top-0 left-0 w-2 h-full bg-[#D40073]" />
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-[14px] overflow-hidden border-2 border-[#ECEDEF]">
                                    <img src={MOCK_AGENT.avatar} alt="" className="w-full h-full object-cover" />
                                  </div>
                                  <div>
                                    <div className="text-[15px] font-extrabold text-[#111111]">{MOCK_AGENT.name}</div>
                                    <div className="text-[12px] font-bold text-[#2563EB] flex items-center gap-1.5 mt-0.5">
                                      <Icon icon="solar:delivery-bold" />
                                      {MOCK_AGENT.vehicle}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex-1 max-w-[200px] h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden relative">
                                  <motion.div 
                                    animate={{ width: ["10%", "90%"] }}
                                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-y-0 left-0 bg-[#D40073]" 
                                  />
                                </div>

                                <div className="flex items-center gap-3">
                                  <button className="w-11 h-11 rounded-full bg-[#F3F4F6] hover:bg-[#E4E7EC] text-[#111111] flex items-center justify-center transition-all">
                                    <Icon icon="solar:phone-bold" className="text-[20px]" />
                                  </button>
                                  <button className="h-11 px-6 bg-[#111111] hover:bg-[#333333] text-white rounded-full font-bold text-[14px] transition-all">
                                    Message Agent
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </Dialog.Content>
                      </Dialog.Portal>
                    )}
                  </AnimatePresence>
                </Dialog.Root>

                {/* Footer */}
                <div className="p-5 border-t border-[#ECEDEF] bg-white shrink-0">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={reset}
                      disabled={!order || (!isDirty)}
                      className="h-11 px-4 bg-[#F3F4F6] hover:bg-[#E4E7EC] text-[#111111] rounded-[12px] font-bold text-[14px] transition-colors disabled:opacity-50 disabled:hover:bg-[#F3F4F6]"
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      onClick={save}
                      disabled={!order || !isDirty}
                      className="flex-1 h-11 px-5 bg-[#D40073] hover:bg-[#B80063] text-white rounded-[12px] font-bold text-[14px] transition-colors disabled:opacity-50 disabled:hover:bg-[#D40073]"
                    >
                      Save changes
                    </button>
                    <button
                      type="button"
                      onClick={close}
                      className="h-11 px-4 bg-[#111111] hover:bg-[#333333] text-white rounded-[12px] font-bold text-[14px] transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}


