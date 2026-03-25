import { useNavigate, useParams } from 'react-router';
import { Icon } from '@iconify/react';
import { motion } from 'motion/react';
import { MOCK_RETAILER_ORDERS } from '../data/mockRetailerOrders';

const STATUS_STEPS = ['Pending', 'Ready', 'In Transit', 'Delivered'];

function StatusBadge({ status, type }: { status: string; type: 'pay' | 'del' }) {
  if (type === 'pay') {
    const cfg =
      status === 'Paid'
        ? { bg: 'bg-[#ECFDF3]', text: 'text-[#16A34A]', icon: 'solar:check-circle-bold' }
        : status === 'Credit'
        ? { bg: 'bg-[#EFF6FF]', text: 'text-[#2563EB]', icon: 'solar:card-bold' }
        : { bg: 'bg-[#FFF7ED]', text: 'text-[#D97706]', icon: 'solar:clock-circle-bold' };
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[12px] font-bold ${cfg.bg} ${cfg.text}`}>
        <Icon icon={cfg.icon} className="text-[14px]" />
        {status}
      </span>
    );
  }
  const cfg =
    status === 'Delivered'
      ? { bg: 'bg-[#ECFDF3]', text: 'text-[#16A34A]', icon: 'solar:check-circle-bold' }
      : status === 'In Transit'
      ? { bg: 'bg-[#EFF6FF]', text: 'text-[#2563EB]', icon: 'solar:routing-2-bold' }
      : status === 'Ready'
      ? { bg: 'bg-[#FDF4FF]', text: 'text-[#9333EA]', icon: 'solar:box-bold' }
      : { bg: 'bg-[#F7F7F8]', text: 'text-[#525866]', icon: 'solar:clock-circle-bold' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[12px] font-bold ${cfg.bg} ${cfg.text}`}>
      <Icon icon={cfg.icon} className="text-[14px]" />
      {status}
    </span>
  );
}

export default function RetailerOrderDetails() {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const order = MOCK_RETAILER_ORDERS.find((o) => o.id === orderId);

  const currentStep = STATUS_STEPS.indexOf(order?.delStatus ?? '') ;
  const completedStep = currentStep === -1 ? 0 : currentStep;

  if (!order) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 bg-[#F7F7F8]">
        <div className="bg-white rounded-[20px] border border-[#ECEDEF] p-10 text-center max-w-sm w-full shadow-sm">
          <div className="w-14 h-14 bg-[#FEF2F2] rounded-full flex items-center justify-center mx-auto mb-4 text-[#EF4444]">
            <Icon icon="solar:danger-triangle-bold" className="text-[28px]" />
          </div>
          <h2 className="text-[18px] font-bold text-[#111111] mb-2">Order Not Found</h2>
          <p className="text-[14px] text-[#525866] mb-6">
            The order <strong>{orderId}</strong> doesn't exist or was removed.
          </p>
          <button
            type="button"
            onClick={() => navigate('/dashboard/retailer', { state: { activeTab: 'Orders' } })}
            className="h-11 px-6 bg-[#111111] hover:bg-[#333333] text-white rounded-[12px] font-bold text-[14px] transition-colors"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col h-full bg-[#F7F7F8] overflow-hidden font-sans">
      {/* Top bar */}
      <div className="px-6 md:px-8 pt-6 pb-4 bg-[#F7F7F8] shrink-0 border-b border-[#ECEDEF]">
        <div className="flex items-center gap-3 mb-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard/retailer', { state: { activeTab: 'Orders' } })}
            className="h-9 px-4 flex items-center gap-1.5 bg-white border border-[#E4E7EC] rounded-[10px] text-[13px] font-semibold text-[#525866] hover:bg-[#F3F4F6] transition-colors"
          >
            <Icon icon="solar:arrow-left-linear" className="text-[16px]" />
            Orders
          </button>
          <Icon icon="solar:alt-arrow-right-linear" className="text-[#C0C6D4] text-[14px]" />
          <span className="text-[13px] font-semibold text-[#111111]">{order.id}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[26px] font-bold text-[#111111] tracking-tight leading-tight">{order.id}</h1>
            <p className="text-[14px] text-[#525866] mt-1 font-medium">
              {order.customer} &nbsp;·&nbsp; {order.type} &nbsp;·&nbsp; {order.date}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              className="h-9 px-4 flex items-center gap-2 bg-white border border-[#E4E7EC] rounded-[10px] text-[13px] font-semibold text-[#525866] hover:bg-[#F3F4F6] transition-colors"
            >
              <Icon icon="solar:printer-linear" className="text-[16px]" />
              Print
            </button>
            <button
              type="button"
              className="h-9 px-4 flex items-center gap-2 bg-[#111111] hover:bg-[#333333] text-white rounded-[10px] text-[13px] font-semibold transition-colors"
            >
              <Icon icon="solar:pen-linear" className="text-[16px]" />
              Edit Order
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-4xl mx-auto space-y-5">

          {/* === Status Cards === */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Payment */}
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="bg-white border border-[#ECEDEF] rounded-[16px] p-5 space-y-2"
            >
              <div className="text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Payment</div>
              <StatusBadge status={order.payStatus} type="pay" />
              {order.credStatus !== 'N/A' && (
                <div className="text-[12px] font-semibold text-[#525866] pt-1">
                  Credit: <span className="text-[#111111]">{order.credStatus}</span>
                </div>
              )}
            </motion.div>

            {/* Delivery */}
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white border border-[#ECEDEF] rounded-[16px] p-5 space-y-2"
            >
              <div className="text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Delivery</div>
              <StatusBadge status={order.delStatus} type="del" />
            </motion.div>

            {/* Order Total */}
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="bg-white border border-[#ECEDEF] rounded-[16px] p-5 space-y-2"
            >
              <div className="text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Order Total</div>
              <div className="text-[22px] font-bold text-[#111111] tracking-tight">{order.amount}</div>
            </motion.div>
          </div>

          {/* === Delivery Progress === */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white border border-[#ECEDEF] rounded-[16px] p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <Icon icon="solar:routing-2-linear" className="text-[#D40073] text-[18px]" />
              <h2 className="text-[15px] font-bold text-[#111111]">Delivery Progress</h2>
            </div>
            <div className="flex items-center gap-0">
              {STATUS_STEPS.map((step, i) => {
                const done = i <= completedStep;
                const active = i === completedStep;
                return (
                  <div key={step} className="flex-1 flex items-center">
                    <div className="flex flex-col items-center gap-1.5 flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold border-2 transition-colors ${
                        done
                          ? 'bg-[#D40073] border-[#D40073] text-white'
                          : 'bg-white border-[#ECEDEF] text-[#C0C6D4]'
                      } ${active ? 'ring-4 ring-[rgba(212,0,115,0.15)]' : ''}`}>
                        {done ? <Icon icon="solar:check-circle-bold" className="text-[16px]" /> : <span>{i + 1}</span>}
                      </div>
                      <span className={`text-[11px] font-semibold ${done ? 'text-[#111111]' : 'text-[#C0C6D4]'}`}>{step}</span>
                    </div>
                    {i < STATUS_STEPS.length - 1 && (
                      <div className={`h-[2px] flex-1 -mt-5 transition-colors ${i < completedStep ? 'bg-[#D40073]' : 'bg-[#ECEDEF]'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* === Order Items === */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="bg-white border border-[#ECEDEF] rounded-[16px] overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-[#ECEDEF] flex items-center gap-2">
              <Icon icon="solar:box-linear" className="text-[#D40073] text-[18px]" />
              <h2 className="text-[15px] font-bold text-[#111111]">Order Items</h2>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F7F7F8]">
                  <th className="py-3 px-6 text-[12px] font-bold text-[#525866] uppercase tracking-wider">Item</th>
                  <th className="py-3 px-6 text-[12px] font-bold text-[#525866] uppercase tracking-wider text-center">Qty</th>
                  <th className="py-3 px-6 text-[12px] font-bold text-[#525866] uppercase tracking-wider text-right">Unit Price</th>
                  <th className="py-3 px-6 text-[12px] font-bold text-[#525866] uppercase tracking-wider text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.length ? (
                  order.items.map((item, i) => (
                    <tr key={i} className="border-t border-[#ECEDEF] hover:bg-[#FBFBFC] transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-[#111111] text-[13px]">{item.name}</div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-[#F7F7F8] rounded-[8px] text-[13px] font-bold text-[#111111]">
                          {item.qty}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-semibold text-[#525866] text-[13px]">{item.unitPrice}</td>
                      <td className="py-4 px-6 text-right font-bold text-[#111111] text-[13px]">{item.lineTotal}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-[#8B93A7] text-[13px] font-medium">
                      No items recorded for this order.
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-[#ECEDEF] bg-[#F7F7F8]">
                  <td colSpan={3} className="py-4 px-6 text-[13px] font-bold text-[#525866] text-right">Order Total</td>
                  <td className="py-4 px-6 text-right text-[16px] font-bold text-[#111111]">{order.amount}</td>
                </tr>
              </tfoot>
            </table>
          </motion.div>

          {/* === Actions === */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-white border border-[#ECEDEF] rounded-[16px] p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Icon icon="solar:settings-linear" className="text-[#D40073] text-[18px]" />
              <h2 className="text-[15px] font-bold text-[#111111]">Actions</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" className="h-10 px-5 flex items-center gap-2 bg-[#ECFDF3] hover:bg-[#D1FAE5] text-[#16A34A] rounded-[10px] text-[13px] font-semibold transition-colors">
                <Icon icon="solar:check-circle-linear" className="text-[16px]" />
                Mark as Paid
              </button>
              <button type="button" className="h-10 px-5 flex items-center gap-2 bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#2563EB] rounded-[10px] text-[13px] font-semibold transition-colors">
                <Icon icon="solar:routing-2-linear" className="text-[16px]" />
                Update Delivery Status
              </button>
              <button type="button" className="h-10 px-5 flex items-center gap-2 bg-[#F7F7F8] hover:bg-[#ECEDEF] text-[#525866] rounded-[10px] text-[13px] font-semibold transition-colors">
                <Icon icon="solar:share-linear" className="text-[16px]" />
                Share Receipt
              </button>
              <button type="button" className="h-10 px-5 flex items-center gap-2 bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#EF4444] rounded-[10px] text-[13px] font-semibold transition-colors ml-auto">
                <Icon icon="solar:trash-bin-trash-linear" className="text-[16px]" />
                Cancel Order
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
