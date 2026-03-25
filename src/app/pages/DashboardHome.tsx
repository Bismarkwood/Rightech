import React from 'react';
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
  Clock,
  ArrowRight,
  CheckCircle2,
  FileText
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
  <div className={`bg-white rounded-[18px] border border-[#ECEDEF] overflow-hidden ${className}`}>
    {children}
  </div>
);

const KPICard = ({ title, value, trend, trendValue, icon: Icon, gradientClass }: any) => (
  <Card className="p-[20px] flex flex-col justify-between transition-colors hover:border-[#D40073]/30">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-[44px] h-[44px] rounded-[14px] flex items-center justify-center text-white ${gradientClass}`}>
        <Icon size={20} strokeWidth={2} />
      </div>
      <button className="text-[#8B93A7] hover:text-[#111111] transition-colors">
        <MoreHorizontal size={20} />
      </button>
    </div>
    <div>
      <p className="text-[15px] font-medium text-[#525866] mb-1">{title}</p>
      <h3 className="text-[32px] sm:text-[40px] font-bold text-[#111111] tracking-tight leading-none mb-2">{value}</h3>
      <div className="flex items-center gap-2">
        <span className={`flex items-center text-[13px] font-semibold ${trend === 'up' ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
          {trend === 'up' ? <ArrowUpRight size={16} className="mr-0.5" /> : <ArrowDownRight size={16} className="mr-0.5" />}
          {trendValue}
        </span>
        <span className="text-[13px] text-[#8B93A7]">vs last week</span>
      </div>
    </div>
  </Card>
);

const QuickAction = ({ icon: Icon, title, desc, gradientClass }: any) => (
  <button className="flex flex-col items-start p-[20px] bg-white rounded-[18px] border border-[#ECEDEF] hover:border-[#D40073]/40 transition-all group text-left relative overflow-hidden">
    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 duration-300">
      <ArrowRight size={18} className="text-[#D40073]" />
    </div>
    <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center text-white mb-3 ${gradientClass}`}>
      <Icon size={18} strokeWidth={2} />
    </div>
    <span className="text-[15px] font-bold text-[#111111] group-hover:text-[#D40073] transition-colors mb-1">{title}</span>
    <span className="text-[13px] text-[#8B93A7]">{desc}</span>
  </button>
);

const ActivityItem = ({ icon: Icon, title, time, status, colorClass, iconColorClass }: any) => (
  <div className="flex items-center gap-4 py-3 border-b border-[#ECEDEF] last:border-0 hover:bg-[#FBFBFC] -mx-4 px-4 transition-colors">
    <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0 ${colorClass}`}>
      <Icon size={16} className={iconColorClass} strokeWidth={2.5} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[14px] font-medium text-[#111111] truncate">{title}</p>
      <p className="text-[12px] text-[#8B93A7] truncate">{time}</p>
    </div>
    <div className={`text-[12px] font-semibold px-2.5 py-1 rounded-[6px] ${
      status === 'Completed' ? 'bg-[#ECFDF3] text-[#16A34A]' :
      status === 'Pending' ? 'bg-[#FFF7ED] text-[#D97706]' :
      'bg-[#EFF6FF] text-[#2563EB]'
    }`}>
      {status}
    </div>
  </div>
);

export default function DashboardHome() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">
        
        {/* Row 1: Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-[#111111] tracking-tight mb-1">Overview</h1>
          <p className="text-[14px] text-[#525866]">Monitor your business performance and operations.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-[40px] px-4 flex items-center gap-2 bg-white border border-[#E4E7EC] rounded-[12px] text-[14px] font-medium text-[#111111] hover:bg-[#F3F4F6] transition-colors">
            <Filter size={16} />
            Last 7 days
          </button>
          <button className="h-[40px] px-4 flex items-center gap-2 bg-[#D40073] hover:bg-[#B80063] text-white rounded-[12px] text-[14px] font-semibold transition-colors">
            <Plus size={16} />
            Create Report
          </button>
        </div>
      </div>

      {/* Row 2: KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        <KPICard 
          title="Total Orders" 
          value="1,240" 
          trend="up" 
          trendValue="12.5%" 
          icon={ShoppingCart} 
          gradientClass="bg-gradient-to-br from-[#5B8CFF] to-[#7C3AED]"
        />
        <KPICard 
          title="Revenue (GHS)" 
          value="48.2k" 
          trend="up" 
          trendValue="8.2%" 
          icon={TrendingUp} 
          gradientClass="bg-gradient-to-br from-[#16A34A] to-[#22C55E]"
        />
        <KPICard 
          title="Active Dealers" 
          value="156" 
          trend="up" 
          trendValue="4.1%" 
          icon={Users} 
          gradientClass="bg-gradient-to-br from-[#9333EA] to-[#D40073]"
        />
        <KPICard 
          title="Inventory Value" 
          value="1.2M" 
          trend="down" 
          trendValue="1.2%" 
          icon={PackageSearch} 
          gradientClass="bg-gradient-to-br from-[#EC4899] to-[#D40073]"
        />
        <KPICard 
          title="Pending Deliveries" 
          value="42" 
          trend="down" 
          trendValue="5.0%" 
          icon={Truck} 
          gradientClass="bg-gradient-to-br from-[#F97316] to-[#FB923C]"
        />
      </div>

      {/* Row 3: Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <QuickAction icon={ShoppingCart} title="Add Order" desc="Create new retail order" gradientClass="bg-gradient-to-br from-[#5B8CFF] to-[#7C3AED]" />
        <QuickAction icon={UserPlus} title="Add Dealer" desc="Register business partner" gradientClass="bg-gradient-to-br from-[#9333EA] to-[#D40073]" />
        <QuickAction icon={Box} title="Add Retail Sale" desc="Quick POS transaction" gradientClass="bg-gradient-to-br from-[#EC4899] to-[#D40073]" />
        <QuickAction icon={Truck} title="Assign Delivery" desc="Dispatch agent tasks" gradientClass="bg-gradient-to-br from-[#F97316] to-[#FB923C]" />
      </div>

      {/* Row 4: Chart & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 p-[24px]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-[16px] font-semibold text-[#111111]">Sales & Orders</h3>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-[13px] text-[#525866]">Orders: 1,240</span>
                <span className="text-[13px] text-[#525866]">Rev: 48,200 GHS</span>
                <span className="text-[13px] text-[#525866]">Avg: 38 GHS</span>
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
                <CartesianGrid key="grid" strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
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
            <h3 className="text-[16px] font-semibold text-[#111111]">Recent Activity</h3>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16A34A]"></span>
              </span>
              <span className="text-[12px] font-medium text-[#525866]">Live</span>
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
          
          <button className="w-full mt-4 text-[13px] font-medium text-[#525866] hover:text-[#111111] transition-colors flex items-center justify-center gap-1 group">
            View all activity <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </Card>
      </div>

      {/* Row 5: Operations Context */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="p-[20px]">
          <h3 className="text-[14px] font-semibold text-[#111111] mb-4 flex items-center gap-2">
            <PackageSearch size={16} className="text-[#8B93A7]" /> Inventory Health
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[20px] font-bold text-[#111111]">14</p>
                <p className="text-[12px] text-[#525866]">Low stock items</p>
              </div>
              <div className="text-right">
                <p className="text-[20px] font-bold text-[#DC2626]">3</p>
                <p className="text-[12px] text-[#525866]">Out of stock</p>
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
          <h3 className="text-[14px] font-semibold text-[#111111] mb-4 flex items-center gap-2">
            <FileText size={16} className="text-[#8B93A7]" /> Dealer Credit
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#ECEDEF] pb-2">
              <span className="text-[13px] text-[#525866]">Active Accounts</span>
              <span className="text-[13px] font-semibold text-[#111111]">48</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#ECEDEF] pb-2">
              <span className="text-[13px] text-[#525866]">Overdue Payments</span>
              <span className="text-[13px] font-semibold text-[#DC2626]">12.4k GHS</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#525866]">High Risk Dealers</span>
              <span className="text-[13px] font-semibold text-[#D97706]">2</span>
            </div>
          </div>
        </Card>

        <Card className="p-[20px]">
          <h3 className="text-[14px] font-semibold text-[#111111] mb-4 flex items-center gap-2">
            <MapPin size={16} className="text-[#8B93A7]" /> Branch Overview
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#ECEDEF] pb-2">
              <span className="text-[13px] text-[#525866]">Total Branches</span>
              <span className="text-[13px] font-semibold text-[#111111]">4</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#ECEDEF] pb-2">
              <span className="text-[13px] text-[#525866]">Top Performing</span>
              <span className="text-[13px] font-semibold text-[#16A34A]">Accra Central</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#525866]">Active Staff</span>
              <span className="text-[13px] font-semibold text-[#111111]">24</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Row 6: Tables & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 p-[20px]">
          <h3 className="text-[16px] font-semibold text-[#111111] mb-4">Recent Transactions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#ECEDEF]">
                  <th className="pb-3 text-[12px] font-medium text-[#8B93A7]">ID</th>
                  <th className="pb-3 text-[12px] font-medium text-[#8B93A7]">Type</th>
                  <th className="pb-3 text-[12px] font-medium text-[#8B93A7]">Amount</th>
                  <th className="pb-3 text-[12px] font-medium text-[#8B93A7]">Status</th>
                  <th className="pb-3 text-[12px] font-medium text-[#8B93A7]">Date</th>
                </tr>
              </thead>
              <tbody className="text-[13px]">
                {[
                  { id: 'TRX-829', type: 'Dealer Payment', amount: '4,200 GHS', status: 'Completed', date: 'Today, 10:42 AM' },
                  { id: 'TRX-828', type: 'Retail Sale', amount: '850 GHS', status: 'Completed', date: 'Today, 09:15 AM' },
                  { id: 'TRX-827', type: 'Supplier Invoice', amount: '-12,000 GHS', status: 'Pending', date: 'Yesterday' },
                  { id: 'TRX-826', type: 'Dealer Payment', amount: '2,100 GHS', status: 'Failed', date: 'Yesterday' },
                ].map((trx, idx) => (
                  <tr key={trx.id} className="border-b border-[#ECEDEF] last:border-0 hover:bg-[#FBFBFC] transition-colors">
                    <td className="py-3 font-medium text-[#111111]">{trx.id}</td>
                    <td className="py-3 text-[#525866]">{trx.type}</td>
                    <td className="py-3 font-medium text-[#111111]">{trx.amount}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-[6px] text-[11px] font-semibold ${
                        trx.status === 'Completed' ? 'bg-[#ECFDF3] text-[#16A34A]' :
                        trx.status === 'Pending' ? 'bg-[#FFF7ED] text-[#D97706]' :
                        'bg-[#FEF2F2] text-[#DC2626]'
                      }`}>
                        {trx.status}
                      </span>
                    </td>
                    <td className="py-3 text-[#8B93A7]">{trx.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-[20px] flex flex-col">
          <h3 className="text-[16px] font-semibold text-[#111111] mb-4 flex items-center gap-2 text-[#DC2626]">
            <AlertTriangle size={18} /> Attention Required
          </h3>
          <div className="space-y-3 flex-1">
            <div className="p-3 bg-[#FEF2F2] rounded-[12px] border border-[#DC2626]/20">
              <p className="text-[13px] font-semibold text-[#DC2626] mb-0.5">3 Out of Stock Items</p>
              <p className="text-[12px] text-[#DC2626]/80">Cement (50kg), Iron Rods (16mm) need restock immediately.</p>
            </div>
            <div className="p-3 bg-[#FFF7ED] rounded-[12px] border border-[#D97706]/20">
              <p className="text-[13px] font-semibold text-[#D97706] mb-0.5">Overdue Dealer Balance</p>
              <p className="text-[12px] text-[#D97706]/80">K.A Enterprise is 14 days overdue for 4,200 GHS.</p>
            </div>
            <div className="p-3 bg-[#EFF6FF] rounded-[12px] border border-[#2563EB]/20">
              <p className="text-[13px] font-semibold text-[#2563EB] mb-0.5">Pending Deliveries</p>
              <p className="text-[12px] text-[#2563EB]/80">5 orders waiting to be assigned to agents.</p>
            </div>
          </div>
        </Card>
      </div>

      </div>
    </div>
  );
}
