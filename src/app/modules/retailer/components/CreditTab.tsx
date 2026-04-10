import React from 'react';
import { Search, Filter, MoreHorizontal, ShieldAlert, CheckCircle2, TrendingUp } from 'lucide-react';

const MOCK_CREDITS = [
  { id: 'CRD-102', customer: 'Westgate Builders', orderId: 'ORD-8990', amount: '14,500 GHS', settled: '0 GHS', balance: '14,500 GHS', dueDate: '15 Oct 2023', status: 'Active' },
  { id: 'CRD-098', customer: 'Kingsway Const.', orderId: 'ORD-8712', amount: '8,000 GHS', settled: '8,000 GHS', balance: '0 GHS', dueDate: '10 Sep 2023', status: 'Settled' },
  { id: 'CRD-095', customer: 'K.A Enterprise', orderId: 'ORD-8650', amount: '5,000 GHS', settled: '2,500 GHS', balance: '2,500 GHS', dueDate: '01 Oct 2023', status: 'Overdue' },
];

export function CreditTab() {
  return (
    <div className="space-y-6">
      {/* Alerts */}
      {/* Overdue Alert Banner */}
      <div className="bg-[#FEF2F2] dark:bg-[#7F1D1D]/20 border border-[#DC2626]/20 dark:border-[#DC2626]/30 rounded-[22px] p-5 flex items-center gap-5 shadow-sm">
        <div className="w-12 h-12 rounded-[14px] bg-[#DC2626] flex items-center justify-center text-white shrink-0 shadow-lg shadow-[#DC2626]/20 animate-pulse">
          <Icon icon="solar:danger-triangle-bold-duotone" className="text-[26px]" />
        </div>
        <div className="flex-1">
          <h4 className="text-[14px] font-black text-[#DC2626] dark:text-[#F87171] uppercase tracking-tight">Critical Overdue Accounts Detected</h4>
          <p className="text-[13px] font-bold text-[#991B1B] dark:text-[#F87171]/80 mt-0.5 uppercase tracking-tighter">K.A Enterprise is 4 days overdue on a balance of <span className="underline decoration-2 text-[#DC2626]">2,500 GHS</span>. Further credit lines have been automatically suspended.</p>
        </div>
        <button className="h-9 px-4 bg-white dark:bg-white/10 text-[#DC2626] dark:text-white rounded-[10px] text-[12px] font-black uppercase tracking-widest hover:bg-[#DC2626] hover:text-white transition-all border border-[#DC2626]/10 shadow-sm ml-auto">
          Manage Risk
        </button>
      </div>

      <div className="bg-white dark:bg-[#151B2B] rounded-[22px] border border-[#ECEDEF] dark:border-white/10 flex flex-col min-h-[500px] overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#ECEDEF] dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative group w-full sm:w-[320px]">
            <Icon icon="solar:magnifer-linear" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B93A7] group-focus-within:text-[#D40073] transition-colors text-[18px]" />
            <input 
              type="text" 
              placeholder="Search by Credit ID, Entity or Order..." 
              className="w-full h-10 pl-11 pr-4 bg-white dark:bg-white/5 border border-[#E4E7EC] dark:border-white/10 rounded-[12px] text-[13px] font-black text-[#111111] dark:text-white placeholder:text-[#8B93A7] focus:outline-none focus:border-[#D40073] transition-all shadow-sm"
            />
          </div>
          <button className="h-10 px-5 flex items-center gap-2 bg-white dark:bg-[#151B2B] border border-[#E4E7EC] dark:border-white/10 rounded-[12px] text-[13px] font-black text-[#525866] dark:text-white hover:border-[#D40073] hover:text-[#D40073] transition-all shadow-sm uppercase tracking-widest">
            <Icon icon="solar:filter-bold-duotone" className="text-[18px]" />
            Risk Status
          </button>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] dark:bg-white/5 border-b border-[#ECEDEF] dark:border-white/5 sticky top-0 z-10">
                <th className="py-4 px-6 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest">Financed Entity / Account</th>
                <th className="py-4 px-6 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest">Reference Order</th>
                <th className="py-4 px-6 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest">Principal Amount</th>
                <th className="py-4 px-6 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest">Recovered</th>
                <th className="py-4 px-6 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest text-[#DC2626]">Delta Exposure</th>
                <th className="py-4 px-6 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest">Final Maturity</th>
                <th className="py-4 px-6 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest">Exposure Status</th>
                <th className="py-4 px-6 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECEDEF] dark:divide-white/5">
              {MOCK_CREDITS.map((credit) => (
                <tr key={credit.id} className="hover:bg-[#FBFBFC] dark:hover:bg-white/10 transition-all border-b border-[#ECEDEF] dark:border-white/5 cursor-pointer group">
                  <td className="py-4 px-6">
                    <div className="font-black text-[14px] text-[#111111] dark:text-white uppercase tracking-tight group-hover:text-[#D40073] transition-colors">{credit.customer}</div>
                    <div className="text-[11px] text-[#8B93A7] font-bold uppercase tracking-widest mt-0.5">{credit.id}</div>
                  </td>
                  <td className="py-4 px-6 font-black text-[11px] text-[#525866] dark:text-[#8B93A7] uppercase tracking-widest">{credit.orderId}</td>
                  <td className="py-4 px-6 font-black text-[15px] text-[#111111] dark:text-white tracking-tighter italic">{credit.amount}</td>
                  <td className="py-4 px-6 font-black text-[14px] text-[#16A34A] tracking-tight">{credit.settled}</td>
                  <td className="py-4 px-6 font-black text-[16px] text-[#DC2626] tracking-tighter italic">{credit.balance}</td>
                  <td className="py-4 px-6 font-bold text-[12px] text-[#8B93A7] uppercase tracking-widest">{credit.dueDate}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[11px] font-black uppercase tracking-wider border shadow-sm ${
                      credit.status === 'Active' ? 'bg-[#EFF6FF] dark:bg-[#1E3A8A]/30 text-[#2563EB] border-[#2563EB]/10' :
                      credit.status === 'Settled' ? 'bg-[#ECFDF3] dark:bg-[#064E3B]/30 text-[#16A34A] border-[#16A34A]/10' :
                      'bg-[#FEF2F2] dark:bg-[#7F1D1D]/30 text-[#DC2626] border-[#DC2626]/10'
                    }`}>
                      <Icon icon={credit.status === 'Settled' ? 'solar:check-circle-bold' : credit.status === 'Overdue' ? 'solar:danger-triangle-bold' : 'solar:clock-circle-bold'} />
                      {credit.status}
                    </span>
                  </td>
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