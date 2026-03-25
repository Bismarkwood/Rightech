import React, { useEffect, useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'motion/react';
import { useNavigate, useParams } from 'react-router';
import { MOCK_RETAILER_ORDERS, type RetailerOrder, type RetailerOrderItem } from '../../data/mockRetailerOrders';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type OrderDraft = Pick<
  RetailerOrder,
  | 'payStatus'
  | 'paymentMethod'
  | 'amount'
  | 'delStatus'
  | 'credStatus'
  | 'deliveryAddress'
  | 'orderNotes'
  | 'updatedAt'
>;

const PAYMENT_METHODS = ['Cash', 'Mobile Money', 'Bank Transfer', 'POS', 'Invoice / Credit'];
const PAYMENT_STATUSES = ['Paid', 'Pending', 'Credit'];
const DELIVERY_STATUSES = ['Pending', 'Ready', 'In Transit', 'Delivered'];

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

  const baseOrder = useMemo(
    () => (orderId ? MOCK_RETAILER_ORDERS.find((o) => o.id === orderId) : undefined),
    [orderId],
  );

  const storageKey = orderId ? `rightech.retailerOrderEdits:${orderId}` : null;

  const [draft, setDraft] = useState<(OrderDraft & { items?: RetailerOrderItem[] }) | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (!baseOrder || !storageKey) {
      setDraft(null);
      setIsDirty(false);
      return;
    }

    try {
      const raw = localStorage.getItem(storageKey);
      const parsed = raw ? (JSON.parse(raw) as Partial<OrderDraft>) : null;
      const next: OrderDraft = {
        payStatus: baseOrder.payStatus,
        paymentMethod: baseOrder.paymentMethod,
        amount: baseOrder.amount,
        delStatus: baseOrder.delStatus,
        credStatus: baseOrder.credStatus,
        deliveryAddress: baseOrder.deliveryAddress,
        orderNotes: baseOrder.orderNotes,
        updatedAt: baseOrder.updatedAt,
        ...(parsed ?? {}),
      };
      setDraft({ ...next, items: (parsed as any)?.items ?? baseOrder.items ?? [] });
      setIsDirty(false);
    } catch {
      setDraft({
        payStatus: baseOrder.payStatus,
        paymentMethod: baseOrder.paymentMethod,
        amount: baseOrder.amount,
        delStatus: baseOrder.delStatus,
        credStatus: baseOrder.credStatus,
        deliveryAddress: baseOrder.deliveryAddress,
        orderNotes: baseOrder.orderNotes,
        updatedAt: baseOrder.updatedAt,
        items: baseOrder.items ?? [],
      });
      setIsDirty(false);
    }
  }, [baseOrder, storageKey]);

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
    const prev = items[index] ?? { name: '', qty: 1, unitPrice: '0 GHS', lineTotal: '0 GHS' };
    const nextItem: RetailerOrderItem = { ...prev, ...patch };

    // Keep line total coherent when qty/unitPrice changes
    const unit = parseMoneyToNumber(nextItem.unitPrice);
    const qty = Number.isFinite(nextItem.qty) ? nextItem.qty : 0;
    nextItem.lineTotal = formatGhs(unit * qty);

    items[index] = nextItem;
    setItems(items);
    recalcTotals(items);
  };

  const addItem = () => {
    const items = [...(draft?.items ?? order?.items ?? [])];
    items.push({ name: 'New item', qty: 1, unitPrice: '0 GHS', lineTotal: '0 GHS' });
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
    if (!storageKey || !draft) return;
    const next = { ...draft, updatedAt: nowIso() };
    localStorage.setItem(storageKey, JSON.stringify(next));
    setDraft(next);
    setIsDirty(false);
  };

  const reset = () => {
    if (!baseOrder || !storageKey) return;
    localStorage.removeItem(storageKey);
    setDraft({
      payStatus: baseOrder.payStatus,
      paymentMethod: baseOrder.paymentMethod,
      amount: baseOrder.amount,
      delStatus: baseOrder.delStatus,
      credStatus: baseOrder.credStatus,
      deliveryAddress: baseOrder.deliveryAddress,
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

                {/* Footer */}
                <div className="p-5 border-t border-[#ECEDEF] bg-white shrink-0">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={reset}
                      disabled={!order || (!isDirty && !storageKey)}
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

