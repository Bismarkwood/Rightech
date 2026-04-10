import React from 'react';
import { motion } from 'motion/react';
import { Icon } from '@iconify/react';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, ArrowUpRight } from 'lucide-react';

const KPI_DATA = [
  {
    label: 'Total Extended',
    value: 'GHS 84,000',
    sub: 'Across 18 accounts',
    icon: 'solar:dollar-minimalistic-bold-duotone',
    color: '#2563EB',
    bg: 'rgba(37,99,235,0.07)',
    trend: '+8.2%',
    up: true
  },
  {
    label: 'Total Outstanding',
    value: 'GHS 31,200',
    sub: 'Active balances',
    icon: 'solar:card-recive-bold-duotone',
    color: '#D40073',
    bg: 'rgba(212,0,115,0.07)',
    trend: '+2.1%',
    up: false
  },
  {
    label: 'Collected Today',
    value: 'GHS 4,800',
    sub: 'Repayments in',
    icon: 'solar:wallet-money-bold-duotone',
    color: '#16A34A',
    bg: 'rgba(22,163,74,0.07)',
    trend: '+14.7%',
    up: true
  },
  {
    label: 'Overdue',
    value: 'GHS 9,400',
    sub: 'Past due date',
    icon: 'solar:danger-triangle-bold-duotone',
    color: '#EF4444',
    bg: 'rgba(239,68,68,0.07)',
    trend: '-3 accounts',
    up: false,
    critical: true
  },
];

const DISTRIBUTION = [
  { label: 'Excellent', count: 6, percent: 35, color: '#16A34A' },
  { label: 'Good', count: 9, percent: 50, color: '#2563EB' },
  { label: 'Fair', count: 2, percent: 10, color: '#D97706' },
  { label: 'Poor', count: 1, percent: 5, color: '#EF4444' },
];

const OVERDUE_ALERTS = [
  { name: 'NorthStar Traders', amount: 'GHS 1,800', daysLabel: '12 days overdue', severity: 'high' },
  { name: 'BrightMart Supplies', amount: 'GHS 4,200', daysLabel: '2 days overdue', severity: 'medium' },
];

export function OverviewTab() {
  return (
    <div className="space-y-6 pb-10">

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {KPI_DATA.map((kpi) => (
          <div key={kpi.label} className="bg-white dark:bg-[#151B2B] rounded-[22px] border border-[#ECEDEF] dark:border-white/10 p-6 flex flex-col gap-4 shadow-sm hover:border-[#D40073]/30 transition-all group">
            <div className="flex items-start justify-between">
              <div
                className="w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0 shadow-lg shadow-black/5 group-hover:scale-110 transition-transform"
                style={{ background: kpi.bg }}
              >
                <Icon icon={kpi.icon} className="text-[24px]" style={{ color: kpi.color }} />
              </div>
              <div
                className={`flex items-center gap-1 text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-[6px] shadow-sm border ${kpi.up ? 'bg-[#ECFDF3] dark:bg-[#064E3B]/20 text-[#16A34A] border-[#16A34A]/10' : kpi.critical ? 'bg-[#FEF2F2] dark:bg-[#7F1D1D]/20 text-[#EF4444] border-[#EF4444]/10' : 'bg-[#FFF7ED] dark:bg-[#78350F]/20 text-[#D97706] border-[#D97706]/10'}`}
              >
                {kpi.up ? <TrendingUp size={12} strokeWidth={3} /> : <TrendingDown size={12} strokeWidth={3} />}
                {kpi.trend}
              </div>
            </div>
            <div>
              <p className="text-[28px] font-black text-[#111111] dark:text-white tracking-tight leading-none">{kpi.value.replace('GHS ', '')}<span className="text-[14px] ml-1 text-[#8B93A7]">GHS</span></p>
              <p className="text-[11px] font-black uppercase tracking-widest text-[#8B93A7] mt-3">{kpi.label}</p>
              <p className={`text-[12px] font-bold mt-1 ${kpi.critical ? 'text-[#EF4444]' : 'text-[#8B93A7] dark:text-[#525866]'}`}>{kpi.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* Risk Distribution — wider */}
        <div className="lg:col-span-3 bg-white dark:bg-[#151B2B] rounded-[22px] border border-[#ECEDEF] dark:border-white/10 p-7 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-[16px] font-black text-[#111111] dark:text-white uppercase tracking-tight">Risk Distribution</h3>
              <p className="text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider mt-1">18 total accounts monitored</p>
            </div>
            <div className="w-10 h-10 rounded-[12px] bg-[#F9FAFB] dark:bg-white/5 flex items-center justify-center border border-[#ECEDEF] dark:border-white/10">
              <Icon icon="solar:chart-square-bold-duotone" className="text-[#8B93A7] text-[20px]" />
            </div>
          </div>
          <div className="space-y-6">
            {DISTRIBUTION.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-[13px] font-black mb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-[#525866] dark:text-[#8B93A7] uppercase tracking-wider">{item.label}</span>
                  </div>
                  <span className="text-[#111111] dark:text-white">{item.count} Dealers · {item.percent}%</span>
                </div>
                <div className="h-3 bg-[#F3F4F6] dark:bg-white/5 rounded-full overflow-hidden shadow-inner border border-transparent dark:border-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percent}%` }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className="h-full rounded-full shadow-sm"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Overdue Alerts — narrower */}
        <div className="lg:col-span-2 bg-white dark:bg-[#151B2B] rounded-[22px] border border-[#ECEDEF] dark:border-white/10 p-7 flex flex-col shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-[16px] font-black text-[#111111] dark:text-white uppercase tracking-tight">Overdue Alerts</h3>
            <span className="px-3 py-1 bg-[#FEF2F2] dark:bg-[#7F1D1D]/30 text-[#EF4444] rounded-[6px] text-[11px] font-black uppercase tracking-wider border border-[#EF4444]/10">
              {OVERDUE_ALERTS.length} ACCOUNTS
            </span>
          </div>
          <div className="space-y-4 flex-1">
            {OVERDUE_ALERTS.map((alert) => (
              <div
                key={alert.name}
                className="flex items-center justify-between p-4 bg-[#F9FAFB] dark:bg-white/5 rounded-[22px] border border-[#ECEDEF] dark:border-white/10 hover:border-[#EF4444]/30 transition-all group cursor-pointer shadow-sm"
              >
                <div>
                  <p className="text-[14px] font-black text-[#111111] dark:text-white group-hover:text-[#D40073] transition-colors">{alert.name}</p>
                  <p className="text-[11px] font-black text-[#EF4444] mt-1 flex items-center gap-1 uppercase tracking-wider bg-[#EF4444]/5 dark:bg-[#EF4444]/10 px-2 py-0.5 rounded-full w-fit">
                    <AlertTriangle size={12} strokeWidth={3} />
                    {alert.daysLabel}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[16px] font-black text-[#111111] dark:text-white">{alert.amount}</p>
                  <button className="text-[12px] font-black text-[#D40073] mt-1.5 hover:text-[#B80063] flex items-center gap-1 ml-auto uppercase tracking-tighter transition-all group-hover:gap-2">
                    REMIND <ArrowUpRight size={12} strokeWidth={3} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary footer */}
          <div className="mt-8 pt-5 border-t border-[#ECEDEF] dark:border-white/5 flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-[#ECFDF3] dark:bg-[#064E3B]/20 flex items-center justify-center shrink-0">
              <CheckCircle2 size={14} className="text-[#16A34A]" strokeWidth={3} />
            </div>
            <span className="text-[12px] font-bold text-[#16A34A] uppercase tracking-wider">
              16 accounts in good standing
            </span>
          </div>
        </div>
      </div>

      {/* Recent Activity Row */}
      <div className="bg-white dark:bg-[#151B2B] rounded-[22px] border border-[#ECEDEF] dark:border-white/10 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#ECEDEF] dark:border-white/5 bg-[#F9FAFB] dark:bg-white/5">
          <div>
            <h3 className="text-[16px] font-black text-[#111111] dark:text-white uppercase tracking-tight">Recent Transactions</h3>
            <p className="text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider mt-1">Latest credit activity</p>
          </div>
          <button className="text-[12px] font-black text-[#D40073] hover:text-[#B80063] transition-all flex items-center gap-2 uppercase tracking-widest group">
            View all ledger
            <ArrowUpRight size={16} strokeWidth={3} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F9FAFB] dark:bg-white/5 border-b border-[#ECEDEF] dark:border-white/5">
                <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Dealer</th>
                <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Type</th>
                <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Amount</th>
                <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Date</th>
                <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider text-right">Balance After</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECEDEF] dark:divide-white/5">
              {[
                { dealer: 'Kwame Dealers Ltd', type: 'Extension', amount: 'GHS 2,000', date: 'Mar 15, 2026', balance: 'GHS 6,200', typeColor: '#EF4444' },
                { dealer: 'Kwame Dealers Ltd', type: 'Repayment', amount: 'GHS 1,500', date: 'Mar 10, 2026', balance: 'GHS 4,200', typeColor: '#16A34A' },
                { dealer: 'Ama Wholesale', type: 'Extension', amount: 'GHS 3,000', date: 'Mar 02, 2026', balance: 'GHS 5,700', typeColor: '#EF4444' },
              ].map((tx, i) => (
                <tr key={i} className="hover:bg-[#F7F7F8] dark:hover:bg-white/5 transition-colors group cursor-pointer">
                  <td className="py-4 px-6">
                     <p className="text-[14px] font-black text-[#111111] dark:text-white group-hover:text-[#D40073] transition-colors">{tx.dealer}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-[6px] text-[11px] font-black uppercase tracking-wider border shadow-sm ${
                      tx.type === 'Repayment' ? 'bg-[#ECFDF3] dark:bg-[#064E3B]/30 text-[#16A34A] border-[#16A34A]/10' : 'bg-[#FEF2F2] dark:bg-[#7F1D1D]/30 text-[#EF4444] border-[#EF4444]/10'
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className={`py-4 px-6 text-[15px] font-black ${tx.type === 'Repayment' ? 'text-[#16A34A]' : 'text-[#EF4444]'}`}>{tx.amount}</td>
                  <td className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">{tx.date}</td>
                  <td className="py-4 px-6 text-right">
                    <span className="text-[14px] font-black text-[#111111] dark:text-white">{tx.balance}</span>
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
