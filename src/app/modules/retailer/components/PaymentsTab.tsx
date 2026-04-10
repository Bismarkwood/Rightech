import React from 'react';
import { Search, Filter, MoreHorizontal, Wallet, CheckCircle2, Clock } from 'lucide-react';

const MOCK_PAYMENTS = [
  { id: 'PAY-1102', orderId: 'ORD-8991', customer: 'K.A Enterprise', amount: '1,200 GHS', method: 'Mobile Money', status: 'Completed', date: 'Today, 10:35 AM' },
  { id: 'PAY-1101', orderId: 'ORD-8988', customer: 'Accra Mall Co.', amount: '8,900 GHS', method: 'Bank Transfer', status: 'Completed', date: 'Yesterday' },
  { id: 'PAY-1100', orderId: 'ORD-8985', customer: 'Westgate Builders', amount: '5,000 GHS', method: 'Cash', status: 'Pending', date: 'Yesterday' },
];

export function PaymentsTab() {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { label: 'Total Settled Today', value: '1,200 GHS', icon: 'solar:wallet-money-bold-duotone', color: '#16A34A', bg: '#ECFDF3', border: '#D1FAE5' },
          { label: 'Outstanding Balance', value: '450 GHS', icon: 'solar:danger-bold-duotone', color: '#DC2626', bg: '#FEF2F2', border: '#FEE2E2' },
          { label: 'Settlement Pipeline', value: '14,500 GHS', icon: 'solar:clock-circle-bold-duotone', color: '#D97706', bg: '#FFF7ED', border: '#FFEDD5' },
        ].map(kpi => (
          <div key={kpi.label} className="group relative bg-white dark:bg-[#151B2B] border border-[#ECEDEF] dark:border-white/10 rounded-[22px] p-6 flex items-center gap-5 transition-all hover:translate-y-[-2px] hover:shadow-md overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-black/5 dark:from-white/5 to-transparent rounded-bl-[40px] transition-transform group-hover:scale-110" />
            <div className="w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0 border transition-all group-hover:scale-110" style={{ background: kpi.bg, borderColor: kpi.border }}>
              <Icon icon={kpi.icon} className="text-[24px]" style={{ color: kpi.color }} />
            </div>
            <div className="relative z-10">
              <p className="text-[11px] font-black text-[#8B93A7] uppercase tracking-widest group-hover:text-[#111111] dark:group-hover:text-white transition-colors">{kpi.label}</p>
              <p className="text-[24px] font-black text-[#111111] dark:text-white tracking-tighter mt-0.5">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-[#151B2B] rounded-[22px] border border-[#ECEDEF] dark:border-white/10 flex flex-col min-h-[500px] overflow-hidden">
        <div className="p-4 border-b border-[#ECEDEF] dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative group w-full sm:w-[320px]">
            <Icon icon="solar:magnifer-linear" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B93A7] group-focus-within:text-[#D40073] transition-colors text-[18px]" />
            <input 
              type="text" 
              placeholder="Search by Payment ID, Order or Customer..." 
              className="w-full h-10 pl-11 pr-4 bg-white dark:bg-white/5 border border-[#E4E7EC] dark:border-white/10 rounded-[12px] text-[13px] font-black text-[#111111] dark:text-white placeholder:text-[#8B93A7] focus:outline-none focus:border-[#D40073] transition-all shadow-sm"
            />
          </div>
          <button className="h-10 px-5 flex items-center gap-2 bg-white dark:bg-[#151B2B] border border-[#E4E7EC] dark:border-white/10 rounded-[12px] text-[13px] font-black text-[#525866] dark:text-white hover:border-[#D40073] hover:text-[#D40073] transition-all shadow-sm uppercase tracking-widest">
            <Icon icon="solar:filter-bold-duotone" className="text-[18px]" />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] dark:bg-white/5 border-b border-[#ECEDEF] dark:border-white/5 sticky top-0 z-10">
                <th className="py-4 px-6 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest">Transaction Descriptor</th>
                <th className="py-4 px-6 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest">Payer Entity</th>
                <th className="py-4 px-6 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest">Face Value</th>
                <th className="py-4 px-6 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest">Channel</th>
                <th className="py-4 px-6 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest">Execution</th>
                <th className="py-4 px-6 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest">Timestamp</th>
                <th className="py-4 px-6 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECEDEF] dark:divide-white/5">
              {MOCK_PAYMENTS.map((payment) => (
                <tr key={payment.id} className="hover:bg-[#FBFBFC] dark:hover:bg-white/10 transition-all border-b border-[#ECEDEF] dark:border-white/5 cursor-pointer group">
                  <td className="py-4 px-6">
                    <div className="font-black text-[14px] text-[#111111] dark:text-white uppercase tracking-tight group-hover:text-[#D40073] transition-colors">{payment.id}</div>
                    <div className="text-[11px] text-[#8B93A7] font-bold uppercase tracking-widest mt-0.5">{payment.orderId}</div>
                  </td>
                  <td className="py-4 px-6 font-black text-[14px] text-[#111111] dark:text-white uppercase tracking-tight group-hover:text-[#D40073] transition-colors">{payment.customer}</td>
                  <td className="py-4 px-6 font-black text-[16px] text-[#111111] dark:text-white tracking-tighter italic">{payment.amount}</td>
                  <td className="py-4 px-6 text-[#525866] dark:text-[#8B93A7] font-black text-[11px] uppercase tracking-widest">{payment.method}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[11px] font-black uppercase tracking-wider border shadow-sm ${
                      payment.status === 'Completed' ? 'bg-[#ECFDF3] dark:bg-[#064E3B]/30 text-[#16A34A] border-[#16A34A]/10' : 'bg-[#FFF7ED] dark:bg-[#78350F]/30 text-[#D97706] border-[#D97706]/10'
                    }`}>
                      <Icon icon={payment.status === 'Completed' ? 'solar:check-circle-bold' : 'solar:clock-circle-bold'} />
                      {payment.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-bold text-[12px] text-[#8B93A7] uppercase tracking-widest whitespace-nowrap">{payment.date}</td>
                  <td className="py-4 px-6 text-right">
                    <button className="w-8 h-8 inline-flex items-center justify-center text-[#8B93A7] hover:text-[#111111] dark:hover:text-white hover:bg-[#F3F4F6] dark:hover:bg-white/10 rounded-[8px] border border-transparent hover:border-[#ECEDEF] dark:hover:border-white/10 transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}