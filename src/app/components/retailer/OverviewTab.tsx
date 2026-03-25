import React from 'react';
import { 
  ShoppingCart, AlertCircle, PackageCheck, PackageSearch, 
  Truck, CreditCard, ChevronRight, Activity, Clock
} from 'lucide-react';

const Card = ({ children, className = "" }: any) => (
  <div className={`bg-white rounded-[16px] border border-[#ECEDEF] overflow-hidden ${className}`}>
    {children}
  </div>
);

const KPICard = ({ title, value, icon: Icon, colorClass, gradientClass, status = "" }: any) => (
  <Card className={`p-[20px] flex flex-col justify-between transition-colors hover:border-[#D40073]/30 ${gradientClass || ''} relative overflow-hidden ${gradientClass ? 'border-0' : ''}`}>
    {gradientClass && <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/3"></div>}
    <div className="flex items-start justify-between mb-4 relative z-10">
      <div className={`w-[40px] h-[40px] rounded-[12px] flex items-center justify-center ${gradientClass ? 'bg-white/20 text-white backdrop-blur-md' : colorClass}`}>
        <Icon size={18} strokeWidth={2.5} />
      </div>
      {status && <span className={`text-[12px] font-bold ${gradientClass ? 'text-white/90' : 'text-[#8B93A7]'}`}>{status}</span>}
    </div>
    <div className="relative z-10">
      <h3 className={`text-[28px] font-bold tracking-tight leading-none mb-1.5 ${gradientClass ? 'text-white' : 'text-[#111111]'}`}>{value}</h3>
      <p className={`text-[13px] font-semibold ${gradientClass ? 'text-white/80' : 'text-[#525866]'}`}>{title}</p>
    </div>
  </Card>
);

const ActivityItem = ({ title, time, type }: any) => {
  const isOrder = type === 'order';
  const isPayment = type === 'payment';
  
  return (
    <div className="flex items-center justify-between p-4 hover:bg-[#FBFBFC] border-b border-[#ECEDEF] last:border-0 transition-colors cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center ${
          isOrder ? 'bg-[#EFF6FF] text-[#2563EB]' :
          isPayment ? 'bg-[#ECFDF3] text-[#16A34A]' :
          'bg-[#FFF7ED] text-[#D97706]'
        }`}>
          {isOrder ? <ShoppingCart size={18} /> : isPayment ? <CreditCard size={18} /> : <Truck size={18} />}
        </div>
        <div>
          <h4 className="text-[14px] font-semibold text-[#111111]">{title}</h4>
          <p className="text-[13px] text-[#525866]">{time}</p>
        </div>
      </div>
      <ChevronRight size={16} className="text-[#8B93A7] opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};

export function OverviewTab({ onNavigate }: { onNavigate: (tab: string) => void }) {
  return (
    <div className="space-y-8">
      {/* KPIs Grid */}
      <div>
        <h2 className="text-[16px] font-bold text-[#111111] mb-4">Daily Fulfillment Desk</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          <KPICard title="New Orders" value="12" icon={ShoppingCart} gradientClass="bg-gradient-to-br from-[#5B8CFF] to-[#3B82F6]" status="Today" />
          <KPICard title="Awaiting Payment" value="5" icon={AlertCircle} gradientClass="bg-gradient-to-br from-[#F59E0B] to-[#D97706]" />
          <KPICard title="Ready for Dispatch" value="8" icon={PackageCheck} gradientClass="bg-gradient-to-br from-[#10B981] to-[#059669]" />
          <KPICard title="Assigned Delivery" value="4" icon={Truck} gradientClass="bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9]" />
          <KPICard title="Credit Orders" value="15" icon={CreditCard} gradientClass="bg-gradient-to-br from-[#EF4444] to-[#DC2626]" />
          <KPICard title="Low Stock Items" value="3" icon={PackageSearch} gradientClass="bg-gradient-to-br from-[#EC4899] to-[#D40073]" status="Alert" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-[16px] font-bold text-[#111111]">Quick Actions</h2>
          <Card className="flex flex-col">
            <button onClick={() => onNavigate('Storefront')} className="p-4 flex items-center justify-between hover:bg-[#FBFBFC] border-b border-[#ECEDEF] transition-colors group">
              <span className="text-[14px] font-semibold text-[#111111]">Create New Order</span>
              <ChevronRight size={16} className="text-[#8B93A7] group-hover:text-[#D40073]" />
            </button>
            <button onClick={() => onNavigate('Delivery')} className="p-4 flex items-center justify-between hover:bg-[#FBFBFC] border-b border-[#ECEDEF] transition-colors group">
              <span className="text-[14px] font-semibold text-[#111111]">Assign Delivery Agent</span>
              <ChevronRight size={16} className="text-[#8B93A7] group-hover:text-[#D40073]" />
            </button>
            <button onClick={() => onNavigate('Payments')} className="p-4 flex items-center justify-between hover:bg-[#FBFBFC] border-b border-[#ECEDEF] transition-colors group">
              <span className="text-[14px] font-semibold text-[#111111]">Record Payment</span>
              <ChevronRight size={16} className="text-[#8B93A7] group-hover:text-[#D40073]" />
            </button>
            <button onClick={() => onNavigate('Storefront')} className="p-4 flex items-center justify-between hover:bg-[#FBFBFC] transition-colors group">
              <span className="text-[14px] font-semibold text-[#111111]">Check Inventory</span>
              <ChevronRight size={16} className="text-[#8B93A7] group-hover:text-[#D40073]" />
            </button>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-[#D40073] to-[#B80063] text-white mt-6 border-0">
            <h3 className="text-[18px] font-bold mb-2">Fulfillment Target</h3>
            <p className="text-[13px] text-white/80 mb-4">You are hitting 94% of same-day deliveries.</p>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white w-[94%] rounded-full" />
            </div>
          </Card>
        </div>

        {/* Activity Strip */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-bold text-[#111111] flex items-center gap-2">
              <Activity size={18} className="text-[#D40073]" /> 
              Recent Operations
            </h2>
            <button onClick={() => onNavigate('Orders')} className="text-[13px] font-semibold text-[#D40073] hover:text-[#B80063] transition-colors">
              View all
            </button>
          </div>
          <Card>
            <ActivityItem type="order" title="New order #ORD-8991 received from K.A Enterprise" time="10 mins ago" />
            <ActivityItem type="payment" title="Payment of 12,400 GHS recorded for #ORD-8985" time="25 mins ago" />
            <ActivityItem type="dispatch" title="Rider AG-1021 assigned to #ORD-8980" time="1 hr ago" />
            <ActivityItem type="order" title="Order #ORD-8975 marked as Ready for Dispatch" time="1.5 hrs ago" />
            <ActivityItem type="payment" title="Credit limit exceeded for Westgate Builders" time="2 hrs ago" />
          </Card>
        </div>
      </div>
    </div>
  );
}