import React from 'react';
import { motion } from 'motion/react';
import { Icon } from '@iconify/react';
import { usePayments } from '../../context/PaymentContext';
import { ArrowUpRight, ArrowDownLeft, CreditCard, Clock, TrendingUp, TrendingDown, Landmark } from 'lucide-react';

const KPICard = ({ title, value, label, trend, icon: IconComp, colorClass, gradient }: any) => (
  <div className={`relative p-8 rounded-[32px] border border-[#ECEDEF] bg-white overflow-hidden group transition-all duration-500 hover:border-[#D40073]/20`}>
    <div className={`absolute top-0 right-0 w-32 h-32 -translate-x-4 -translate-y-12 rounded-full opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-700 ${colorClass}`} />
    
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-6">
        <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center ${gradient} text-white`}>
          <IconComp size={22} strokeWidth={2.5} />
        </div>
        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-[12px] font-black ${
          trend === 'up' ? 'bg-[#16A34A]/10 text-[#16A34A]' : 
          trend === 'down' ? 'bg-[#EF4444]/10 text-[#EF4444]' : 
          'bg-[#525866]/10 text-[#525866]'
        }`}>
          {trend === 'up' ? <TrendingUp size={12} /> : trend === 'down' ? <TrendingDown size={12} /> : null}
          {label}
        </div>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-[14px] font-bold text-[#8B93A7] uppercase tracking-widest">{title}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-[34px] font-black text-[#111111] tracking-tight">GHS {value}</span>
        </div>
      </div>
    </div>
  </div>
);

export function OverviewTab() {
  const { transactions } = usePayments();
  
  const stats = {
    in: 48200,
    out: 19400,
    net: 28800
  };

  const recentTransactions = transactions.slice(0, 6);

  return (
    <div className="space-y-10 pb-16 max-w-[1400px] mx-auto">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-[32px] font-black text-[#111111] tracking-tight">Financial Pulse</h1>
          <p className="text-[15px] font-medium text-[#525866] mt-1">Real-time settlement data across the RightTech network.</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-[20px] border border-[#ECEDEF]">
          <button className="px-5 h-10 rounded-[14px] text-[13px] font-bold bg-[#111111] text-white">Month</button>
          <button className="px-5 h-10 rounded-[14px] text-[13px] font-bold text-[#8B93A7] hover:text-[#111111] transition-colors">Quarter</button>
          <button className="px-5 h-10 rounded-[14px] text-[13px] font-bold text-[#8B93A7] hover:text-[#111111] transition-colors">Year</button>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <KPICard 
          title="Money In" 
          value={stats.in.toLocaleString()} 
          label="+12.5%" 
          trend="up" 
          icon={ArrowDownLeft}
          colorClass="bg-[#16A34A]"
          gradient="bg-gradient-to-br from-[#16A34A] to-[#22C55E]"
        />
        <KPICard 
          title="Money Out" 
          value={stats.out.toLocaleString()} 
          label="+4.2%" 
          trend="down" 
          icon={ArrowUpRight}
          colorClass="bg-[#EF4444]"
          gradient="bg-gradient-to-br from-[#DC2626] to-[#EF4444]"
        />
        <KPICard 
          title="Net Position" 
          value={stats.net.toLocaleString()} 
          label="Profit" 
          trend="up" 
          icon={Landmark}
          colorClass="bg-[#D40073]"
          gradient="bg-gradient-to-br from-[#D40073] to-[#FF4DB8]"
        />
      </div>

      {/* Recent Activity Feed */}
      <section>
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-3">
             <div className="w-2 h-8 bg-[#D40073] rounded-full" />
             <h3 className="text-[22px] font-black text-[#111111] tracking-tight">Recent Ledger Entries</h3>
          </div>
          <button className="flex items-center gap-2 px-6 h-12 bg-white border border-[#ECEDEF] rounded-[16px] text-[14px] font-black text-[#111111] hover:border-[#D40073] transition-all">
            Full History
            <Icon icon="solar:arrow-right-linear" />
          </button>
        </div>

        <div className="bg-white rounded-[32px] border border-[#ECEDEF] overflow-hidden">
          <div className="divide-y divide-[#F1F3F5]">
            {recentTransactions.map((tx) => (
              <button 
                key={tx.id} 
                className="w-full px-10 py-6 flex items-center justify-between hover:bg-[#FAFBFC] transition-all group text-left border-l-4 border-l-transparent hover:border-l-[#D40073]"
              >
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-[22px] flex items-center justify-center font-black text-[11px] shrink-0 border-2 ${
                    tx.direction === 'in' ? 'bg-[#16A34A]/5 text-[#16A34A] border-[#16A34A]/10' :
                    tx.direction === 'out' ? 'bg-[#EF4444]/5 text-[#EF4444] border-[#EF4444]/10' :
                    'bg-[#2563EB]/5 text-[#2563EB] border-[#2563EB]/10'
                  }`}>
                    {tx.direction === 'in' ? '↓ IN' : tx.direction === 'out' ? '↑ OUT' : '◎ CR'}
                  </div>
                  <div>
                    <div className="text-[17px] font-black text-[#111111] group-hover:text-[#D40073] transition-colors">{tx.type}</div>
                    <div className="text-[14px] font-bold text-[#8B93A7] mt-0.5">{tx.party}</div>
                  </div>
                </div>

                <div className="flex items-center gap-16">
                  <div className="text-right hidden lg:block">
                    <div className="text-[13px] font-black text-[#111111] uppercase tracking-wider mb-0.5">{tx.method}</div>
                    <div className="text-[12px] font-bold text-[#8B93A7]">{tx.reference || 'REF-N/A'}</div>
                  </div>

                  <div className="text-right">
                    <div className={`text-[18px] font-black ${
                       tx.direction === 'in' ? 'text-[#16A34A]' : 
                       tx.direction === 'out' ? 'text-[#EF4444]' : 
                       'text-[#2563EB]'
                    }`}>
                      {tx.direction === 'in' ? '+' : '-'}{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-[12px] font-bold text-[#8B93A7] mt-1">{new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                  
                  <div className="flex items-center gap-3 w-[140px] justify-end">
                    <span className={`px-4 py-1.5 rounded-full text-[13px] font-black tracking-tight ${
                      tx.status === 'Confirmed' ? 'bg-[#16A34A]/10 text-[#16A34A]' : 
                      tx.status === 'Pending' ? 'bg-[#D97706]/10 text-[#D97706]' : 
                      'bg-[#EF4444]/10 text-[#EF4444]'
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
