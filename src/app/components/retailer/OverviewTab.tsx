import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Icon } from '@iconify/react';

const Card = ({ children, className = "", style = {} }: any) => (
  <div
    className={`bg-white rounded-[24px] border border-[#ECEDEF] ${className}`}
    style={style}
  >
    {children}
  </div>
);

const KPICard = ({ title, value, icon, gradient, trend, trendUp }: any) => (
  <Card className="p-5 flex flex-col justify-between hover:border-[#D40073]/30 transition-all group relative">
    <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full opacity-[0.03] group-hover:opacity-[0.06] transition-opacity ${gradient}`} />

    <div className="flex items-start justify-between mb-4 relative z-10">
      <div className={`w-11 h-11 rounded-[14px] flex items-center justify-center text-white shadow-lg shadow-black/5 ${gradient}`}>
        <Icon icon={icon} className="text-[22px]" />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${trendUp ? 'bg-[#ECFDF3] text-[#16A34A]' : 'bg-[#FEF2F2] text-[#DC2626]'}`}>
          <Icon icon={trendUp ? "solar:trend-up-bold" : "solar:trend-down-bold"} />
          {trend}
        </div>
      )}
    </div>

    <div className="relative z-10">
      <h3 className="text-[26px] font-bold text-[#111111] tracking-tight leading-none mb-1.5">{value}</h3>
      <p className="text-[13px] font-bold text-[#525866] uppercase tracking-wider opacity-70">{title}</p>
    </div>
  </Card>
);

const ActivityItem = ({ title, time, type, amount }: any) => {
  const isOrder = type === 'order';
  const isPayment = type === 'payment';

  return (
    <div className="flex items-center justify-between p-4 hover:bg-[#F7F7F8] border-b border-[#ECEDEF] last:border-0 transition-all cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center ${isOrder ? 'bg-[#D40073]/5 text-[#D40073]' :
          isPayment ? 'bg-[#16A34A]/5 text-[#16A34A]' :
            'bg-[#4F46E5]/5 text-[#4F46E5]'
          }`}>
          <Icon icon={isOrder ? "solar:cart-large-bold-duotone" : isPayment ? "solar:card-2-bold-duotone" : "solar:delivery-bold-duotone"} className="text-[20px]" />
        </div>
        <div>
          <h4 className="text-[14px] font-bold text-[#111111] leading-tight mb-0.5">{title}</h4>
          <p className="text-[12px] font-bold text-[#8B93A7] uppercase tracking-wide flex items-center gap-1.5">
            <Icon icon="solar:clock-circle-linear" />
            {time}
          </p>
        </div>
      </div>
      <div className="text-right flex items-center gap-4">
        {amount && (
          <div className="hidden md:block">
            <p className="text-[14px] font-bold text-[#111111]">{amount}</p>
            <p className="text-[10px] font-bold text-[#8B93A7] uppercase">GHS Value</p>
          </div>
        )}
        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white border border-[#ECEDEF] text-[#8B93A7] opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
          <Icon icon="solar:alt-arrow-right-linear" className="text-[18px]" />
        </div>
      </div>
    </div>
  );
};

export function OverviewTab({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const [timePeriod, setTimePeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  const periodData = {
    daily: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      values: [45, 62, 38, 75, 52, 90, 68],
      title: 'Daily Sales Performance',
      subtitle: 'Orders volume trends - today'
    },
    weekly: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      values: [320, 450, 380, 520],
      title: 'Weekly Sales Performance',
      subtitle: 'Orders volume trends vs last month'
    },
    monthly: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      values: [1200, 1450, 1380, 1680, 1520, 1890],
      title: 'Monthly Sales Performance',
      subtitle: 'Orders volume trends vs last year'
    }
  };
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      {/* ── KPIs Command Center ── */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[18px] font-bold text-[#111111] flex items-center gap-2">
            <Icon icon="solar:bolt-bold-duotone" className="text-[#D40073] text-[22px]" />
            Fulfillment Command Center
          </h2>
          <div className="flex items-center gap-2 px-3 py-1 bg-[#111111] rounded-full text-[11px] font-bold text-white uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
            Live Statistics
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          <KPICard title="New Orders" value="12" icon="solar:cart-plus-bold-duotone" gradient="bg-gradient-to-br from-[#120009] to-[#2e001a]" trend="+12%" trendUp={true} />
          <KPICard title="Pending Pay" value="5" icon="solar:wallet-bold-duotone" gradient="bg-gradient-to-br from-[#ea580c] to-[#7c2d12]" trend="-2" trendUp={false} />
          <KPICard title="Ready Disp" value="8" icon="solar:box-bold-duotone" gradient="bg-gradient-to-br from-[#059669] to-[#064e3b]" trend="+4" trendUp={true} />
          <KPICard title="En Route" value="4" icon="solar:delivery-bold-duotone" gradient="bg-gradient-to-br from-[#4f46e5] to-[#312e81]" />
          <KPICard title="Credit Desk" value="15" icon="solar:bill-list-bold-duotone" gradient="bg-gradient-to-br from-[#DC2626] to-[#991B1B]" trend="85%" />
          <KPICard title="Stock Alerts" value="3" icon="solar:bell-bing-bold-duotone" gradient="bg-gradient-to-br from-[#D40073] to-[#B80063]" trendUp={false} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Performance Graph & Insights */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-[16px] font-bold text-[#111111]">{periodData[timePeriod].title}</h3>
                <p className="text-[13px] text-[#8B93A7] font-medium tracking-tight">{periodData[timePeriod].subtitle}</p>
              </div>
              <div className="p-2 bg-[#F7F7F8] border border-[#ECEDEF] rounded-[10px] flex gap-2">
                <button
                  onClick={() => setTimePeriod('daily')}
                  className={`px-3 py-1 text-[11px] font-bold rounded-[6px] transition-colors ${timePeriod === 'daily' ? 'bg-white text-[#111111] shadow-sm' : 'text-[#8B93A7] hover:text-[#111111]'}`}
                >
                  Daily
                </button>
                <button
                  onClick={() => setTimePeriod('weekly')}
                  className={`px-3 py-1 text-[11px] font-bold rounded-[6px] transition-colors ${timePeriod === 'weekly' ? 'bg-white text-[#111111] shadow-sm' : 'text-[#8B93A7] hover:text-[#111111]'}`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setTimePeriod('monthly')}
                  className={`px-3 py-1 text-[11px] font-bold rounded-[6px] transition-colors ${timePeriod === 'monthly' ? 'bg-white text-[#111111] shadow-sm' : 'text-[#8B93A7] hover:text-[#111111]'}`}
                >
                  Monthly
                </button>
              </div>
            </div>

            <div className="h-[200px] w-full flex items-end justify-between gap-3 px-2">
              {periodData[timePeriod].values.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                  <div className="relative w-full">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(val / Math.max(...periodData[timePeriod].values)) * 100}%` }}
                      className={`w-full rounded-t-[10px] transition-all group-hover:scale-x-105 ${i === periodData[timePeriod].values.length - 1 ? 'bg-[#D40073]' : 'bg-[#111111]/10 group-hover:bg-[#111111]/20'}`}
                    >
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#111111] text-white text-[10px] font-bold py-1 px-2 rounded-[4px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {val} orders
                      </div>
                    </motion.div>
                  </div>
                  <p className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider">{periodData[timePeriod].labels[i]}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Monitoring Strip */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-5 flex items-center gap-4 bg-[#D40073]/[0.02] border-[#D40073]/10">
              <div className="w-12 h-12 rounded-[16px] bg-[#D40073] text-white flex items-center justify-center">
                <Icon icon="solar:fire-bold-duotone" className="text-[24px]" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider">Top Product</p>
                <p className="text-[15px] font-bold text-[#111111]">Ultra-Bond Cement</p>
                <p className="text-[12px] font-bold text-[#16A34A]">High Velocity</p>
              </div>
            </Card>
            <Card className="p-5 flex items-center gap-4 bg-[#F59E0B]/[0.02] border-[#F59E0B]/10">
              <div className="w-12 h-12 rounded-[16px] bg-[#F59E0B] text-white flex items-center justify-center">
                <Icon icon="solar:shield-warning-bold-duotone" className="text-[24px]" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider">Stock Alert</p>
                <p className="text-[15px] font-bold text-[#111111]">Steel Rods 12mm</p>
                <p className="text-[12px] font-bold text-[#DC2626]">Only 8 units left</p>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-[#111111] flex items-center gap-2 tracking-tight">
                <Icon icon="solar:history-bold-duotone" className="text-[#D40073] text-[20px]" />
                Recent Operational Activity
              </h2>
              <button onClick={() => onNavigate('Orders')} className="text-[13px] font-bold text-[#D40073] hover:text-[#B80063] transition-colors flex items-center gap-1">
                Deep Dive Log
                <Icon icon="solar:alt-arrow-right-linear" />
              </button>
            </div>
            <Card className="divide-y divide-[#ECEDEF]">
              <ActivityItem type="order" title="Order #ORD-8991 received from K.A Enterprise" time="10 mins ago" amount="GHS 12,400" />
              <ActivityItem type="payment" title="Payment recorded for Metro Electronics" time="25 mins ago" amount="GHS 8,500" />
              <ActivityItem type="dispatch" title="Rider AG-1021 assigned to #ORD-8980" time="1 hr ago" />
              <ActivityItem type="order" title="Order #ORD-8975 marked as Ready for Dispatch" time="1.5 hrs ago" amount="GHS 42,000" />
              <ActivityItem type="payment" title="Credit limit exceeded for Westgate Builders" time="2 hrs ago" />
            </Card>
          </div>
        </div>

        {/* Right Sidebar: Quick Actions & Delivery Glances */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 bg-[#111111] text-white border-0 shadow-xl shadow-black/10">
            <h3 className="text-[18px] font-bold mb-1 tracking-tight">Supply Health</h3>
            <p className="text-[13px] text-white/50 mb-6 font-medium leading-[1.4]">You've reached 94% of your fulfillment target this week.</p>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider mb-2 text-white/70">
                  <span>Same-day Dispatch</span>
                  <span>94%</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '94%' }} className="h-full bg-[#16A34A] rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider mb-2 text-white/70">
                  <span>Inventory Accuracy</span>
                  <span>100%</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} className="h-full bg-[#D40073] rounded-full shadow-[0_0_10px_rgba(212,0,115,0.5)]" />
                </div>
              </div>
            </div>
          </Card>

          <h2 className="text-[16px] font-bold text-[#111111] px-1">Control Operations</h2>
          <div className="grid grid-cols-1 gap-3">
            {[
              { name: 'Issue Store Order', icon: 'solar:shop-2-bold-duotone', tab: 'Storefront', color: '#D40073' },
              { name: 'Assign Deliveries', icon: 'solar:delivery-bold-duotone', tab: 'Delivery', color: '#4F46E5' },
              { name: 'Financial Ledger', icon: 'solar:card-transfer-bold-duotone', tab: 'Payments', color: '#16A34A' },
              { name: 'Stock Movement', icon: 'solar:box-minimalistic-bold-duotone', tab: 'Inventory', color: '#EA580C' },
            ].map((action, i) => (
              <button
                key={i}
                onClick={() => onNavigate(action.tab)}
                className="p-4 bg-white border border-[#ECEDEF] rounded-[20px] flex items-center justify-between hover:border-[#D40073]/40 hover:shadow-lg hover:shadow-black/[0.02] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[12px] flex items-center justify-center text-white" style={{ backgroundColor: action.color }}>
                    <Icon icon={action.icon} className="text-[20px]" />
                  </div>
                  <span className="text-[14px] font-bold text-[#111111]">{action.name}</span>
                </div>
                <Icon icon="solar:alt-arrow-right-linear" className="text-[#8B93A7] group-hover:text-[#D40073] transition-colors" />
              </button>
            ))}
          </div>

          {/* Upcoming Schedule */}
          <Card className="p-5 border-dashed border-2">
            <h3 className="text-[14px] font-bold text-[#111111] mb-4">Upcoming Next 48h</h3>
            <div className="space-y-4">
              <div className="flex gap-3 relative before:absolute before:left-[11px] before:top-6 before:bottom-0 before:w-px before:bg-[#ECEDEF]">
                <div className="w-[22px] h-[22px] rounded-full bg-[#D40073]/10 text-[#D40073] flex items-center justify-center relative z-10 bg-white border border-[#D40073]/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D40073]" />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-[#111111]">12 Dispatches Scheduled</p>
                  <p className="text-[11px] font-medium text-[#8B93A7]">Starting Today, 14:00</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-[22px] h-[22px] rounded-full bg-[#8B93A7]/10 flex items-center justify-center relative z-10 bg-white border border-[#8B93A7]/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#8B93A7]" />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-[#525866]">Stock Replenishment</p>
                  <p className="text-[11px] font-medium text-[#8B93A7]">Tomorrow, 08:30</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}