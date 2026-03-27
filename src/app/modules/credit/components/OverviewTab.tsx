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
          <div key={kpi.label} className="bg-white rounded-[22px] border border-[#ECEDEF] p-5 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div
                className="w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0"
                style={{ background: kpi.bg }}
              >
                <Icon icon={kpi.icon} className="text-[22px]" style={{ color: kpi.color }} />
              </div>
              <div
                className={`flex items-center gap-1 text-[12px] font-bold px-2.5 py-1 rounded-full ${kpi.up ? 'bg-[#ECFDF3] text-[#16A34A]' : kpi.critical ? 'bg-[#FEF2F2] text-[#EF4444]' : 'bg-[#FFF7ED] text-[#D97706]'}`}
              >
                {kpi.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {kpi.trend}
              </div>
            </div>
            <div>
              <p className="text-[24px] font-black text-[#111111] tracking-tight leading-tight">{kpi.value}</p>
              <p className="text-[12px] font-bold uppercase tracking-wider text-[#8B93A7] mt-1">{kpi.label}</p>
              <p className={`text-[12px] font-medium mt-1 ${kpi.critical ? 'text-[#EF4444]' : 'text-[#8B93A7]'}`}>{kpi.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* Risk Distribution — wider */}
        <div className="lg:col-span-3 bg-white rounded-[22px] border border-[#ECEDEF] p-7">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[16px] font-black text-[#111111]">Risk Distribution</h3>
            <span className="text-[12px] font-bold text-[#8B93A7]">18 total accounts</span>
          </div>
          <div className="space-y-5">
            {DISTRIBUTION.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-[13px] font-bold mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-[#525866]">{item.label}</span>
                  </div>
                  <span className="text-[#111111]">{item.count} dealers · {item.percent}%</span>
                </div>
                <div className="h-2.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percent}%` }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Overdue Alerts — narrower */}
        <div className="lg:col-span-2 bg-white rounded-[22px] border border-[#ECEDEF] p-7 flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[16px] font-black text-[#111111]">Overdue Alerts</h3>
            <span className="px-2.5 py-1 bg-[#EF4444]/10 text-[#EF4444] rounded-full text-[11px] font-black">
              {OVERDUE_ALERTS.length} Accounts
            </span>
          </div>
          <div className="space-y-3 flex-1">
            {OVERDUE_ALERTS.map((alert) => (
              <div
                key={alert.name}
                className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-[16px] border border-[#ECEDEF] hover:border-[#EF4444]/30 transition-all group cursor-pointer"
              >
                <div>
                  <p className="text-[14px] font-black text-[#111111]">{alert.name}</p>
                  <p className="text-[12px] font-bold text-[#EF4444] mt-0.5 flex items-center gap-1">
                    <AlertTriangle size={11} />
                    {alert.daysLabel}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[15px] font-black text-[#111111]">{alert.amount}</p>
                  <button className="text-[12px] font-black text-[#D40073] mt-1 hover:underline flex items-center gap-1 ml-auto">
                    Remind <ArrowUpRight size={11} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary footer */}
          <div className="mt-5 pt-5 border-t border-[#ECEDEF] flex items-center gap-2">
            <CheckCircle2 size={15} className="text-[#16A34A]" />
            <span className="text-[12px] font-bold text-[#525866]">
              16 accounts are in good standing
            </span>
          </div>
        </div>
      </div>

      {/* Recent Activity Row */}
      <div className="bg-white rounded-[22px] border border-[#ECEDEF] p-7">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[16px] font-black text-[#111111]">Recent Transactions</h3>
          <button className="text-[13px] font-bold text-[#D40073] hover:underline flex items-center gap-1">
            View all <ArrowUpRight size={13} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#F1F3F5]">
                {['Dealer', 'Type', 'Amount', 'Date', 'Balance After'].map(h => (
                  <th key={h} className="py-2 px-3 text-[11px] font-bold uppercase tracking-wider text-[#8B93A7]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F7F7F8]">
              {[
                { dealer: 'Kwame Dealers Ltd', type: 'Extension', amount: 'GHS 2,000', date: 'Mar 15, 2026', balance: 'GHS 6,200', typeColor: '#EF4444' },
                { dealer: 'Kwame Dealers Ltd', type: 'Repayment', amount: 'GHS 1,500', date: 'Mar 10, 2026', balance: 'GHS 4,200', typeColor: '#16A34A' },
                { dealer: 'Ama Wholesale', type: 'Extension', amount: 'GHS 3,000', date: 'Mar 02, 2026', balance: 'GHS 5,700', typeColor: '#EF4444' },
              ].map((tx, i) => (
                <tr key={i} className="hover:bg-[#F9FAFB] transition-colors">
                  <td className="py-3 px-3 text-[14px] font-bold text-[#111111]">{tx.dealer}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex px-2.5 py-1 rounded-full text-[12px] font-bold" style={{ background: `${tx.typeColor}12`, color: tx.typeColor }}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[14px] font-bold text-[#111111]">{tx.amount}</td>
                  <td className="py-3 px-3 text-[13px] font-medium text-[#8B93A7]">{tx.date}</td>
                  <td className="py-3 px-3 text-[13px] font-bold text-[#525866]">{tx.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
