import React from 'react';
import { Icon } from '@iconify/react';
import { usePayments } from '../context/PaymentContext';
import { ArrowUpRight, ArrowDownLeft, Landmark, TrendingUp, TrendingDown } from 'lucide-react';

const KPICard = ({ title, value, label, trend, icon: IconComp, gradient }: any) => (
  <div className="bg-white dark:bg-[#151B2B] rounded-[22px] border border-[#ECEDEF] dark:border-white/10 p-6 flex items-center gap-5 hover:border-[#D40073]/30 transition-all shadow-sm group">
    <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0 text-white shadow-lg shadow-black/5 group-hover:scale-110 transition-transform ${gradient}`}>
      <IconComp size={20} strokeWidth={2.5} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider mb-1.5">{title}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-[24px] font-black text-[#111111] dark:text-white tracking-tight leading-none overflow-hidden text-ellipsis">GHS {value}</p>
        <span className={`text-[12px] font-black shrink-0 ${
          trend === 'up' ? 'text-[#16A34A]' : trend === 'down' ? 'text-[#EF4444]' : 'text-[#8B93A7]'
        }`}>
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : ''}{label}
        </span>
      </div>
    </div>
  </div>
);

export function OverviewTab() {
  const { transactions } = usePayments();

  const stats = { in: 48200, out: 19400, net: 28800 };
  const recentTransactions = transactions.slice(0, 8);

  return (
    <div className="space-y-6 pb-8 max-w-[1400px] mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[20px] font-black text-[#111111] dark:text-white tracking-tight">Financial Overview</h2>
          <p className="text-[13px] font-bold text-[#8B93A7] uppercase tracking-wider">Settlement Intelligence</p>
        </div>
        <div className="flex items-center gap-1 bg-white dark:bg-white/5 p-1 rounded-[12px] border border-[#ECEDEF] dark:border-white/10 shadow-sm">
          {['Month', 'Quarter', 'Year'].map((t, i) => (
            <button key={t} className={`px-5 h-8 rounded-[9px] text-[13px] font-black transition-all ${i === 0 ? 'bg-white dark:bg-white/10 text-[#111111] dark:text-white shadow-sm' : 'text-[#8B93A7] hover:text-[#111111] dark:hover:text-[#D40073]'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard title="Money In" value={stats.in.toLocaleString()} label="+12.5%" trend="up" icon={ArrowDownLeft} gradient="bg-gradient-to-br from-[#16A34A] to-[#22C55E]" />
        <KPICard title="Money Out" value={stats.out.toLocaleString()} label="+4.2%" trend="down" icon={ArrowUpRight} gradient="bg-gradient-to-br from-[#DC2626] to-[#EF4444]" />
        <KPICard title="Net Position" value={stats.net.toLocaleString()} label="Profit" trend="up" icon={Landmark} gradient="bg-gradient-to-br from-[#D40073] to-[#FF4DB8]" />
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white dark:bg-[#151B2B] rounded-[22px] border border-[#ECEDEF] dark:border-white/10 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#ECEDEF] dark:border-white/5 bg-[#F9FAFB] dark:bg-white/5">
          <h3 className="text-[16px] font-black text-[#111111] dark:text-white uppercase tracking-tight">Recent Ledger Entries</h3>
          <button className="flex items-center gap-2 text-[12px] font-black text-[#D40073] hover:text-[#B80063] transition-all uppercase tracking-widest">
            Full History
            <Icon icon="solar:arrow-right-linear" className="text-[16px]" strokeWidth={3} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] dark:bg-white/5 border-b border-[#ECEDEF] dark:border-white/5">
                <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Type / Info</th>
                <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Party</th>
                <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Reference</th>
                <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Method</th>
                <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Time</th>
                <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECEDEF] dark:divide-white/5">
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#F7F7F8] dark:hover:bg-white/5 transition-colors cursor-pointer group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-[8px] flex items-center justify-center text-[12px] font-black shrink-0 ${
                        tx.direction === 'in' ? 'bg-[#ECFDF3] dark:bg-[#064E3B]/20 text-[#16A34A]' :
                        tx.direction === 'out' ? 'bg-[#FEF2F2] dark:bg-[#7F1D1D]/20 text-[#EF4444]' :
                        'bg-[#EFF6FF] dark:bg-[#1E3A8A]/20 text-[#2563EB]'
                      }`}>
                        {tx.direction === 'in' ? '↓' : tx.direction === 'out' ? '↑' : '○'}
                      </div>
                      <span className="text-[14px] font-black text-[#111111] dark:text-white group-hover:text-[#D40073] transition-colors whitespace-nowrap">{tx.type}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-[14px] font-bold text-[#525866] dark:text-[#E4E7EC] truncate max-w-[150px]">{tx.party}</td>
                  <td className="py-4 px-6 tracking-widest">
                    <code className="text-[11px] font-black text-[#8B93A7] bg-[#F9FAFB] dark:bg-white/5 px-2 py-1 rounded-[6px] border border-[#ECEDEF] dark:border-white/10 uppercase">{tx.reference || 'N/A'}</code>
                  </td>
                  <td className="py-4 px-6 text-[13px] font-bold text-[#525866] dark:text-[#8B93A7] uppercase tracking-wider">{tx.method}</td>
                  <td className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider whitespace-nowrap">
                    {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-[6px] text-[11px] font-black uppercase tracking-wider border shadow-sm ${
                      tx.status === 'Confirmed' ? 'bg-[#ECFDF3] dark:bg-[#064E3B]/30 text-[#16A34A] border-[#16A34A]/10' :
                      tx.status === 'Pending' ? 'bg-[#FFF7ED] dark:bg-[#78350F]/30 text-[#D97706] border-[#D97706]/10' :
                      'bg-[#FEF2F2] dark:bg-[#7F1D1D]/30 text-[#EF4444] border-[#EF4444]/10'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  {/* Amount */}
                  <td className={`py-4 px-6 text-right text-[15px] font-black tracking-tight ${
                    tx.direction === 'in' ? 'text-[#16A34A]' :
                    tx.direction === 'out' ? 'text-[#EF4444]' :
                    'text-[#2563EB]'
                  }`}>
                    {tx.direction === 'in' ? '+' : '-'}GHS {tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
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
