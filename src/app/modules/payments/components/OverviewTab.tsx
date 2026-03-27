import React from 'react';
import { Icon } from '@iconify/react';
import { usePayments } from '../context/PaymentContext';
import { ArrowUpRight, ArrowDownLeft, Landmark, TrendingUp, TrendingDown } from 'lucide-react';

const KPICard = ({ title, value, label, trend, icon: IconComp, gradient }: any) => (
  <div className="bg-white rounded-[14px] border border-[#ECEDEF] p-5 flex items-center gap-4 hover:border-[#D40073]/30 transition-colors">
    <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 text-white ${gradient}`}>
      <IconComp size={18} strokeWidth={2} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[12px] font-medium text-[#8B93A7] mb-0.5">{title}</p>
      <p className="text-[20px] font-bold text-[#111111] tracking-tight leading-none">GHS {value}</p>
    </div>
    <div className={`flex items-center gap-1 px-2.5 py-1 rounded-[6px] text-[11px] font-semibold shrink-0 ${
      trend === 'up' ? 'bg-[#ECFDF3] text-[#16A34A]' :
      trend === 'down' ? 'bg-[#FEF2F2] text-[#EF4444]' :
      'bg-[#F3F4F6] text-[#525866]'
    }`}>
      {trend === 'up' ? <TrendingUp size={11} /> : trend === 'down' ? <TrendingDown size={11} /> : null}
      {label}
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-bold text-[#111111] tracking-tight">Financial Overview</h2>
          <p className="text-[13px] text-[#525866] mt-0.5">Real-time settlement data across the RightTech network.</p>
        </div>
        <div className="flex items-center gap-1 bg-[#F3F4F6] p-1 rounded-[10px]">
          {['Month', 'Quarter', 'Year'].map((t, i) => (
            <button key={t} className={`px-4 h-8 rounded-[8px] text-[13px] font-medium transition-colors ${i === 0 ? 'bg-white text-[#111111] shadow-sm' : 'text-[#525866] hover:text-[#111111]'}`}>
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
      <div className="bg-white rounded-[14px] border border-[#ECEDEF] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#ECEDEF]">
          <h3 className="text-[14px] font-semibold text-[#111111]">Recent Ledger Entries</h3>
          <button className="flex items-center gap-1.5 text-[13px] font-medium text-[#525866] hover:text-[#111111] transition-colors">
            Full History
            <Icon icon="solar:arrow-right-linear" className="text-[15px]" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#ECEDEF] bg-[#FAFBFC]">
                <th className="py-3 px-5 text-[11px] font-semibold text-[#8B93A7] uppercase tracking-wider">Type</th>
                <th className="py-3 px-5 text-[11px] font-semibold text-[#8B93A7] uppercase tracking-wider">Party</th>
                <th className="py-3 px-5 text-[11px] font-semibold text-[#8B93A7] uppercase tracking-wider">Reference</th>
                <th className="py-3 px-5 text-[11px] font-semibold text-[#8B93A7] uppercase tracking-wider">Method</th>
                <th className="py-3 px-5 text-[11px] font-semibold text-[#8B93A7] uppercase tracking-wider">Time</th>
                <th className="py-3 px-5 text-[11px] font-semibold text-[#8B93A7] uppercase tracking-wider">Status</th>
                <th className="py-3 px-5 text-[11px] font-semibold text-[#8B93A7] uppercase tracking-wider text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECEDEF]">
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
                  {/* Type badge */}
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-2.5">
                      <span className={`inline-flex w-6 h-6 rounded-[6px] items-center justify-center text-[10px] font-bold shrink-0 ${
                        tx.direction === 'in' ? 'bg-[#ECFDF3] text-[#16A34A]' :
                        tx.direction === 'out' ? 'bg-[#FEF2F2] text-[#EF4444]' :
                        'bg-[#EFF6FF] text-[#2563EB]'
                      }`}>
                        {tx.direction === 'in' ? '↓' : tx.direction === 'out' ? '↑' : '○'}
                      </span>
                      <span className="text-[13px] font-medium text-[#111111] group-hover:text-[#D40073] transition-colors">{tx.type}</span>
                    </div>
                  </td>
                  {/* Party */}
                  <td className="py-3 px-5 text-[13px] text-[#525866]">{tx.party}</td>
                  {/* Reference */}
                  <td className="py-3 px-5 text-[12px] font-mono text-[#8B93A7]">{tx.reference || 'REF-N/A'}</td>
                  {/* Method */}
                  <td className="py-3 px-5 text-[13px] text-[#525866]">{tx.method}</td>
                  {/* Time */}
                  <td className="py-3 px-5 text-[12px] text-[#8B93A7] whitespace-nowrap">
                    {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  {/* Status */}
                  <td className="py-3 px-5">
                    <span className={`px-2.5 py-0.5 rounded-[5px] text-[11px] font-semibold ${
                      tx.status === 'Confirmed' ? 'bg-[#ECFDF3] text-[#16A34A]' :
                      tx.status === 'Pending' ? 'bg-[#FFF7ED] text-[#D97706]' :
                      'bg-[#FEF2F2] text-[#EF4444]'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  {/* Amount */}
                  <td className={`py-3 px-5 text-right text-[13px] font-semibold ${
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
