import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  Filter, 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  PackageSearch, 
  Truck,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Box,
  UserPlus,
  AlertTriangle,
  MapPin,
  ArrowRight,
  FileText,
  ShieldCheck
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Icon } from '@iconify/react';

const chartData = [
  { name: 'Mon', orders: 120, revenue: 1400 },
  { name: 'Tue', orders: 200, revenue: 2400 },
  { name: 'Wed', orders: 150, revenue: 2000 },
  { name: 'Thu', orders: 280, revenue: 3200 },
  { name: 'Fri', orders: 220, revenue: 2800 },
  { name: 'Sat', orders: 320, revenue: 4100 },
  { name: 'Sun', orders: 450, revenue: 5200 },
];

const Card = ({ children, className = "" }: any) => (
  <div className={`bg-white dark:bg-[#151B2B] border border-[#ECEDEF] dark:border-white/10 shadow-sm rounded-[22px] overflow-hidden ${className}`}>
    {children}
  </div>
);

const KPICard = ({ title, value, trend, trendValue, icon: LucideIcon, gradientClass }: any) => (
  <Card className="group relative p-6 transition-all hover:translate-y-[-2px] hover:shadow-md border-[#ECEDEF] dark:border-white/10 hover:border-[#D40073]/30 min-h-[145px] overflow-hidden bg-white dark:bg-[#151B2B]">
    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-black/5 dark:from-white/5 to-transparent rounded-bl-full transition-transform group-hover:scale-110" />
    <div className="flex items-center justify-between mb-4 relative z-10">
      <div className={`w-11 h-11 rounded-[12px] flex items-center justify-center text-white shadow-lg ${gradientClass} group-hover:scale-110 transition-transform`}>
        <LucideIcon size={20} strokeWidth={2.5} />
      </div>
      <div className="flex items-center gap-1.5">
        <span className={`flex items-center text-[11px] font-black uppercase tracking-wider px-2 py-1 rounded-[6px] border shadow-sm ${
          trend === 'up' ? 'bg-[#ECFDF5] text-[#16A34A] border-[#16A34A]/10' : 'bg-[#FEF2F2] text-[#DC2626] border-[#DC2626]/10'
        }`}>
          {trend === 'up' ? <Icon icon="solar:round-arrow-right-up-bold" className="mr-1" /> : <Icon icon="solar:round-arrow-right-down-bold" className="mr-1" />}
          {trendValue}
        </span>
      </div>
    </div>
    <div className="relative z-10">
      <p className="text-[12px] font-black text-[#8B93A7] dark:text-[#8B93A7] uppercase tracking-widest mb-1 group-hover:text-[#111111] dark:group-hover:text-white transition-colors">{title}</p>
      <h3 className="text-[28px] font-black text-[#111111] dark:text-white tracking-tighter leading-none">{value}</h3>
    </div>
  </Card>
);

const QuickAction = ({ icon: LucideIcon, title, desc, gradientClass, onClick }: any) => (
  <button onClick={onClick} className="flex flex-col items-start p-6 bg-white dark:bg-[#151B2B] rounded-[22px] border border-[#ECEDEF] dark:border-white/10 hover:border-[#D40073]/50 transition-all group text-left relative overflow-hidden shadow-sm hover:shadow-md">
    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 duration-300">
      <Icon icon="solar:arrow-right-up-linear" className="text-[20px] text-[#D40073]" />
    </div>
    <div className={`w-11 h-11 rounded-[12px] flex items-center justify-center text-white mb-4 shadow-lg ${gradientClass} transition-transform group-hover:scale-110`}>
      <LucideIcon size={20} />
    </div>
    <span className="text-[14px] font-black text-[#111111] dark:text-white group-hover:text-[#D40073] transition-colors mb-1 uppercase tracking-tight">{title}</span>
    <span className="text-[12px] font-bold text-[#8B93A7] leading-tight uppercase tracking-tighter">{desc}</span>
  </button>
);

const ActivityItem = ({ icon: LucideIcon, title, time, status, colorClass, iconColorClass }: any) => (
  <div className="flex items-center gap-4 py-3.5 border-b border-[#ECEDEF] dark:border-white/5 last:border-0 hover:bg-[#FBFBFC] dark:hover:bg-white/5 -mx-4 px-4 transition-all group cursor-pointer">
    <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 border border-transparent group-hover:border-current/10 shadow-sm ${colorClass} transition-transform group-hover:scale-110`}>
      <LucideIcon size={18} className={iconColorClass} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[14px] font-black text-[#111111] dark:text-white truncate group-hover:text-[#D40073] transition-colors uppercase tracking-tight">{title}</p>
      <p className="text-[11px] font-bold text-[#8B93A7] truncate uppercase tracking-widest mt-1">{time}</p>
    </div>
    <div className={`text-[10px] font-black px-2.5 py-1 rounded-[6px] shadow-sm border uppercase tracking-widest ${
      status === 'Completed' ? 'bg-[#ECFDF3] dark:bg-[#16A34A]/10 text-[#16A34A] border-[#16A34A]/10' :
      status === 'Pending' ? 'bg-[#FFF7ED] dark:bg-[#D97706]/10 text-[#D97706] border-[#D97706]/10' :
      'bg-[#EFF6FF] dark:bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/10'
    }`}>
      {status}
    </div>
  </div>
);

import { useOrderWorkflow } from '../../orders/components/OrderWorkflowContext';
import { useDealerWorkflow } from '../../dealer/components/DealerWorkflowContext';
import { SupplierVettingModal } from '../../supply/components/SupplierVettingModal';
import { ReportGenerationModal } from '../../reports/components/ReportGenerationModal';

export default function DashboardHome() {
  const { openCreateOrder } = useOrderWorkflow();
  const { openCreateDealer } = useDealerWorkflow();
  const [isVettingModalOpen, setIsVettingModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">
        
        {/* Row 1: Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-black text-[#111111] dark:text-white tracking-tighter mb-1">Company Overview</h1>
          <p className="text-[13px] font-bold text-[#8B93A7] uppercase tracking-wider">Monitor metrics, operations and field activity.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-10 px-5 flex items-center gap-2 bg-white dark:bg-[#151B2B] border border-[#E4E7EC] dark:border-white/10 rounded-[10px] text-[13px] font-black text-[#525866] dark:text-white hover:border-[#D40073] hover:text-[#D40073] transition-all shadow-sm uppercase tracking-widest">
            <Icon icon="solar:calendar-bold-duotone" className="text-[18px]" />
            Last 7 days
          </button>
          <button 
            onClick={() => setIsVettingModalOpen(true)}
            className="h-10 px-5 flex items-center gap-2 bg-white dark:bg-[#151B2B] border border-[#E4E7EC] dark:border-white/10 text-[#111111] dark:text-white rounded-[10px] text-[13px] font-black transition-all hover:bg-[#F3F4FB] shadow-sm uppercase tracking-widest"
          >
            <ShieldCheck size={16} className="text-[#2563EB]" />
            Vetting
          </button>
          <button 
            onClick={() => setIsReportModalOpen(true)}
            className="h-10 px-5 flex items-center gap-2 bg-[#D40073] hover:bg-[#B80063] text-white rounded-[10px] text-[13px] font-black transition-all shadow-lg uppercase tracking-widest"
          >
            <Plus size={16} />
            Add Report
          </button>
        </div>
      </div>

      {/* Row 2: KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {[
          { title: 'Total Orders', value: '1,240', trend: 'up', trendValue: '12.5%', icon: ShoppingCart, gradientClass: 'bg-gradient-to-br from-[#5B8CFF] to-[#7C3AED]' },
          { title: 'Revenue (GHS)', value: '48.2k', trend: 'up', trendValue: '8.2%', icon: TrendingUp, gradientClass: 'bg-gradient-to-br from-[#16A34A] to-[#22C55E]' },
          { title: 'Active Dealers', value: '156', trend: 'up', trendValue: '4.1%', icon: Users, gradientClass: 'bg-gradient-to-br from-[#9333EA] to-[#D40073]' },
          { title: 'Inventory Value', value: '1.2M', trend: 'down', trendValue: '1.2%', icon: PackageSearch, gradientClass: 'bg-gradient-to-br from-[#EC4899] to-[#D40073]' },
          { title: 'Pending Deliveries', value: '42', trend: 'down', trendValue: '5.0%', icon: Truck, gradientClass: 'bg-gradient-to-br from-[#F97316] to-[#FB923C]' },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <KPICard {...kpi} />
          </motion.div>
        ))}
      </div>

      {/* Row 3: Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <QuickAction onClick={() => openCreateOrder()} icon={ShoppingCart} title="Add Order" desc="Create new retail order" gradientClass="bg-gradient-to-br from-[#5B8CFF] to-[#7C3AED]" />
        <QuickAction onClick={() => openCreateDealer()} icon={UserPlus} title="Add Dealer" desc="Register business partner" gradientClass="bg-gradient-to-br from-[#9333EA] to-[#D40073]" />
        <QuickAction icon={Box} title="Add Retail Sale" desc="Quick POS transaction" gradientClass="bg-gradient-to-br from-[#EC4899] to-[#D40073]" />
        <QuickAction icon={Truck} title="Assign Delivery" desc="Dispatch agent tasks" gradientClass="bg-gradient-to-br from-[#F97316] to-[#FB923C]" />
      </div>

      {/* Row 4: Chart & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 p-8 bg-white dark:bg-[#151B2B]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-[18px] font-black text-[#111111] dark:text-white uppercase tracking-tight">Sales & Analytics Hub</h3>
              <div className="flex items-center gap-5 mt-2">
                <span className="text-[12px] font-black text-[#8B93A7] uppercase tracking-widest flex items-center gap-1.5"><Icon icon="solar:cart-large-bold" /> 1,240 ORDERS</span>
                <span className="text-[12px] font-black text-[#D40073] uppercase tracking-widest flex items-center gap-1.5"><Icon icon="solar:wad-of-money-bold" /> 48.2K REV</span>
                <span className="text-[12px] font-black text-[#16A34A] uppercase tracking-widest flex items-center gap-1.5"><Icon icon="solar:ranking-bold" /> +12.5% GROWTH</span>
              </div>
            </div>
            <div className="bg-[#F3F4F6] border border-[#E4E7EC] rounded-[10px] p-1 flex">
              {['Day', 'Week', 'Month'].map((filter, i) => (
                <button 
                  key={filter} 
                  className={`px-3 py-1.5 rounded-[8px] text-[13px] font-medium transition-colors ${
                    i === 1 ? 'bg-white text-[#111111] border border-[#ECEDEF]' : 'text-[#525866] hover:text-[#111111]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-[280px] w-full -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs key="defs">
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D40073" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#D40073" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid key="grid" strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-[#F3F4F6] dark:text-white/5" />
                <XAxis 
                  key="xaxis"
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#8B93A7' }} 
                  dy={10} 
                />
                <YAxis 
                  key="yaxis"
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#8B93A7' }} 
                  dx={-10}
                />
                <Tooltip 
                  key="tooltip"
                  contentStyle={{ borderRadius: '10px', border: '1px solid #ECEDEF', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
                  labelStyle={{ fontWeight: '600', color: '#111111', marginBottom: '4px' }}
                />
                <Area 
                  key="area"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#D40073" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-[24px] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[16px] font-semibold text-[#111111] dark:text-white">Recent Activity</h3>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16A34A]"></span>
              </span>
              <span className="text-[12px] font-medium text-[#525866] dark:text-[#8B93A7]">Live</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <ActivityItem 
              icon={ShoppingCart} title="Order #4920 from RightShop" time="2 mins ago" status="Pending" 
              colorClass="bg-[#EFF6FF]" iconColorClass="text-[#2563EB]" 
            />
            <ActivityItem 
              icon={Truck} title="Delivery dispatched to Kumasi" time="14 mins ago" status="In Transit" 
              colorClass="bg-[#FFF7ED]" iconColorClass="text-[#D97706]" 
            />
            <ActivityItem 
              icon={Box} title="Inventory restock (Electronics)" time="1 hour ago" status="Completed" 
              colorClass="bg-[#FCE7F2]" iconColorClass="text-[#D40073]" 
            />
            <ActivityItem 
              icon={Users} title="New dealer registered" time="3 hours ago" status="Completed" 
              colorClass="bg-[#F3E8FF]" iconColorClass="text-[#9333EA]" 
            />
            <ActivityItem 
              icon={TrendingUp} title="Daily revenue target met" time="5 hours ago" status="Completed" 
              colorClass="bg-[#ECFDF3]" iconColorClass="text-[#16A34A]" 
            />
          </div>
          
          <button className="w-full mt-4 text-[13px] font-medium text-[#525866] dark:text-[#8B93A7] hover:text-[#111111] dark:hover:text-white transition-colors flex items-center justify-center gap-1 group">
            View all activity <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </Card>
      </div>

      {/* Row 5: Operations Context */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="p-[20px]">
          <h3 className="text-[14px] font-semibold text-[#111111] dark:text-white mb-4 flex items-center gap-2">
            <PackageSearch size={16} className="text-[#8B93A7]" /> Inventory Health
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[20px] font-bold text-[#111111] dark:text-white">14</p>
                <p className="text-[12px] text-[#525866] dark:text-[#8B93A7]">Low stock items</p>
              </div>
              <div className="text-right">
                <p className="text-[20px] font-bold text-[#DC2626]">3</p>
                <p className="text-[12px] text-[#525866] dark:text-[#8B93A7]">Out of stock</p>
              </div>
            </div>
            <div className="h-2 w-full bg-[#ECEDEF] rounded-full overflow-hidden flex">
              <div className="h-full bg-[#16A34A] w-[75%]"></div>
              <div className="h-full bg-[#D97706] w-[20%]"></div>
              <div className="h-full bg-[#DC2626] w-[5%]"></div>
            </div>
          </div>
        </Card>

        <Card className="p-[20px]">
          <h3 className="text-[14px] font-semibold text-[#111111] dark:text-white mb-4 flex items-center gap-2">
            <FileText size={16} className="text-[#8B93A7]" /> Dealer Credit
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#ECEDEF] dark:border-white/5 pb-2">
              <span className="text-[13px] text-[#525866] dark:text-[#8B93A7]">Active Accounts</span>
              <span className="text-[13px] font-semibold text-[#111111] dark:text-white">48</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#ECEDEF] dark:border-white/5 pb-2">
              <span className="text-[13px] text-[#525866] dark:text-[#8B93A7]">Overdue Payments</span>
              <span className="text-[13px] font-semibold text-[#DC2626]">12.4k GHS</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#525866] dark:text-[#8B93A7]">High Risk Dealers</span>
              <span className="text-[13px] font-semibold text-[#D97706]">2</span>
            </div>
          </div>
        </Card>

        <Card className="p-[20px]">
          <h3 className="text-[14px] font-semibold text-[#111111] dark:text-white mb-4 flex items-center gap-2">
            <MapPin size={16} className="text-[#8B93A7]" /> Branch Overview
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#ECEDEF] dark:border-white/5 pb-2">
              <span className="text-[13px] text-[#525866] dark:text-[#8B93A7]">Total Branches</span>
              <span className="text-[13px] font-semibold text-[#111111] dark:text-white">4</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#ECEDEF] dark:border-white/5 pb-2">
              <span className="text-[13px] text-[#525866] dark:text-[#8B93A7]">Top Performing</span>
              <span className="text-[13px] font-semibold text-[#16A34A]">Accra Central</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#525866] dark:text-[#8B93A7]">Active Staff</span>
              <span className="text-[13px] font-semibold text-[#111111] dark:text-white">24</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Row 6: Tables & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <div className="p-5 border-b border-[#ECEDEF] dark:border-white/5">
            <h3 className="text-[16px] font-bold text-[#111111] dark:text-white">Recent Transactions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F9FAFB] dark:bg-white/5 border-b border-[#ECEDEF] dark:border-white/5 sticky top-0 z-10">
                    <th className="py-4 px-6 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest">Transaction ID</th>
                    <th className="py-4 px-6 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest">Payment Source</th>
                    <th className="py-4 px-6 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest">Face Value</th>
                    <th className="py-4 px-6 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest">Execution</th>
                    <th className="py-4 px-6 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest">Timestamp</th>
                  </tr>
                </thead>
              <tbody className="divide-y divide-[#ECEDEF] dark:divide-white/5">
                {[
                  { id: 'TRX-829', type: 'Dealer Payment', amount: '4,200 GHS', status: 'Completed', date: 'Today, 10:42 AM' },
                  { id: 'TRX-828', type: 'Retail Sale', amount: '850 GHS', status: 'Completed', date: 'Today, 09:15 AM' },
                  { id: 'TRX-827', type: 'Supplier Invoice', amount: '-12,000 GHS', status: 'Pending', date: 'Yesterday' },
                  { id: 'TRX-826', type: 'Dealer Payment', amount: '2,100 GHS', status: 'Failed', date: 'Yesterday' },
                ].map((trx, idx) => (
                  <tr key={trx.id} className="hover:bg-[#FBFBFC] dark:hover:bg-white/10 transition-all group cursor-pointer border-b border-[#ECEDEF] dark:border-white/5">
                    <td className="py-4 px-6 font-black text-[14px] text-[#111111] dark:text-white group-hover:text-[#D40073] transition-colors uppercase tracking-tight">{trx.id}</td>
                    <td className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-widest">{trx.type}</td>
                    <td className="py-4 px-6 text-[15px] font-black text-[#111111] dark:text-white">{trx.amount}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-2.5 py-1 rounded-[6px] text-[11px] font-black uppercase tracking-wider border shadow-sm ${
                        trx.status === 'Completed' ? 'bg-[#ECFDF3] dark:bg-[#064E3B]/30 text-[#16A34A] border-[#16A34A]/10' :
                        trx.status === 'Pending' ? 'bg-[#FFF7ED] dark:bg-[#78350F]/30 text-[#D97706] border-[#D97706]/10' :
                        'bg-[#FEF2F2] dark:bg-[#7F1D1D]/30 text-[#DC2626] border-[#DC2626]/10'
                      }`}>
                        {trx.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-[11px] font-bold text-[#8B93A7] uppercase tracking-widest">{trx.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-[20px] flex flex-col">
          <h3 className="text-[16px] font-semibold text-[#111111] dark:text-white mb-4 flex items-center gap-2 text-[#DC2626]">
            <AlertTriangle size={18} /> Attention Required
          </h3>
          <div className="space-y-3 flex-1">
            <div className="p-3 bg-[#DC2626]/5 dark:bg-[#DC2626]/20 rounded-[12px] border border-[#DC2626]/10 dark:border-white/5 shadow-sm">
              <p className="text-[13px] font-black text-[#DC2626] dark:text-[#F87171] mb-0.5">3 Out of Stock Items</p>
              <p className="text-[12px] font-medium text-[#DC2626]/80 dark:text-[#F87171]/80">Cement (50kg), Iron Rods (16mm) need restock immediately.</p>
            </div>
            <div className="p-3 bg-[#D97706]/5 dark:bg-[#D97706]/20 rounded-[12px] border border-[#D97706]/10 dark:border-white/5 shadow-sm">
              <p className="text-[13px] font-black text-[#D97706] dark:text-[#FB923C] mb-0.5">Overdue Dealer Balance</p>
              <p className="text-[12px] font-medium text-[#D97706]/80 dark:text-[#FB923C]/80">K.A Enterprise is 14 days overdue for 4,200 GHS.</p>
            </div>
            <div className="p-3 bg-[#2563EB]/5 dark:bg-[#2563EB]/20 rounded-[12px] border border-[#2563EB]/10 dark:border-white/5 shadow-sm">
              <p className="text-[13px] font-black text-[#2563EB] dark:text-[#60A5FA] mb-0.5">Pending Deliveries</p>
              <p className="text-[12px] font-medium text-[#2563EB]/80 dark:text-[#60A5FA]/80">5 orders waiting to be assigned to agents.</p>
            </div>
          </div>
        </Card>
      </div>

      </div>

      <SupplierVettingModal 
        isOpen={isVettingModalOpen} 
        onClose={() => setIsVettingModalOpen(false)} 
      />

      <ReportGenerationModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
}
