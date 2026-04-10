import React, { useState } from 'react';
import { useLocation } from 'react-router';
import { Icon } from '@iconify/react';
import {
  Plus,
  Download,
  Users,
  Store,
  PackageSearch,
  ShoppingCart,
  CreditCard,
  Truck,
  AlertCircle,
  Clock,
  ChevronRight,
  Search,
  Filter,
  MoreHorizontal,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import DealerManagement from '../../dealer/pages/DealerManagement';
import { useOrderWorkflow } from '../../orders/components/OrderWorkflowContext';

const TABS = [
  'Overview',
  'Suppliers',
  'Dealers',
  'Inventory',
  'Orders',
  'Payments',
  'Credit',
  'Reports'
];

const Card = ({ children, className = "" }: any) => (
  <div className={`bg-white dark:bg-[#151B2B] border border-[#ECEDEF] dark:border-white/10 shadow-sm rounded-[22px] overflow-hidden ${className}`}>
    {children}
  </div>
);

const KPICard = ({ title, value, icon: Icon, colorClass, gradientClass }: any) => (
  <Card className={`p-[20px] flex flex-col justify-between transition-colors hover:border-[#D40073]/30 ${gradientClass || ''} relative overflow-hidden border-0`}>
    {gradientClass && <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/3"></div>}
    <div className="flex items-start justify-between mb-4 relative z-10">
      <div className={`w-[40px] h-[40px] rounded-[12px] flex items-center justify-center ${gradientClass ? 'bg-white/20 text-white backdrop-blur-md' : colorClass}`}>
        <Icon size={18} strokeWidth={2.5} />
      </div>
    </div>
    <div className="relative z-10">
      <h3 className={`text-[28px] font-bold tracking-tight leading-none mb-1.5 ${gradientClass ? 'text-white' : 'text-[#111111] dark:text-white'}`}>{value}</h3>
      <p className={`text-[14px] font-medium ${gradientClass ? 'text-white/80' : 'text-[#525866] dark:text-[#8B93A7]'}`}>{title}</p>
    </div>
  </Card>
);

const FlowNode = ({ icon: Icon, title, value, status, isLast = false }: any) => (
  <div className="flex items-center">
    <div className="flex flex-col items-center group">
      <div className="w-[80px] h-[80px] bg-white dark:bg-white/5 border border-[#ECEDEF] dark:border-white/10 shadow-sm rounded-[16px] flex flex-col items-center justify-center gap-1 hover:border-[#D40073]/50 transition-all relative z-10">
        <Icon size={20} className="text-[#111111] dark:text-white" strokeWidth={2} />
        <span className="text-[18px] font-bold text-[#111111] dark:text-white leading-none mt-1">{value}</span>
      </div>
      <div className="mt-3 text-center">
        <p className="text-[13px] font-bold text-[#111111] dark:text-white">{title}</p>
        <p className="text-[12px] text-[#8B93A7] font-medium mt-0.5">{status}</p>
      </div>
    </div>
    {!isLast && (
      <div className="flex-1 w-[40px] sm:w-[60px] md:w-[80px] h-[2px] bg-[#ECEDEF] mx-2 relative top-[-16px]">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[#8B93A7]">
          <ChevronRight size={16} />
        </div>
      </div>
    )}
  </div>
);

const AlertItem = ({ type, title, desc, time }: any) => {
  const isDanger = type === 'danger';
  const isWarning = type === 'warning';
  
  const colors = isDanger 
    ? { bg: 'bg-[#DC2626]/5 dark:bg-[#DC2626]/20', border: 'border-[#DC2626]/10 dark:border-white/5', text: 'text-[#DC2626] dark:text-[#F87171]' }
    : isWarning 
    ? { bg: 'bg-[#D97706]/5 dark:bg-[#D97706]/20', border: 'border-[#D97706]/10 dark:border-white/5', text: 'text-[#D97706] dark:text-[#FB923C]' }
    : { bg: 'bg-[#2563EB]/5 dark:bg-[#2563EB]/20', border: 'border-[#2563EB]/10 dark:border-white/5', text: 'text-[#2563EB] dark:text-[#60A5FA]' };

  return (
    <div className={`${colors.bg} ${colors.border} flex items-start gap-4 p-[16px] border rounded-[14px] hover:border-[#D40073]/30 transition-colors group shadow-sm`}>
      <div className={`mt-0.5 shrink-0 w-[32px] h-[32px] rounded-[10px] flex items-center justify-center ${
        isDanger ? 'bg-[#DC2626]/10 text-[#DC2626] dark:text-[#F87171]' : 
        isWarning ? 'bg-[#D97706]/10 text-[#D97706] dark:text-[#FB923C]' : 
        'bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA]'
      }`}>
        {isDanger ? <AlertCircle size={16} strokeWidth={2.5} /> : 
         isWarning ? <Clock size={16} strokeWidth={2.5} /> : 
         <Truck size={16} strokeWidth={2.5} />}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className={`text-[14px] font-black ${colors.text} mb-0.5`}>{title}</h4>
        <p className={`text-[13px] font-medium ${colors.text}/80 leading-relaxed`}>{desc}</p>
      </div>
      <div className={`shrink-0 text-[12px] font-black ${colors.text}/60`}>
        {time}
      </div>
    </div>
  );
};

// Mock Supplier Data
const MOCK_SUPPLIERS = [
  { id: 'SUP-01', name: 'Dangote Cement Ghana', type: 'Local', products: 12, balance: '0 GHS', status: 'Active' },
  { id: 'SUP-02', name: 'Global Tech Importers', type: 'Import', products: 45, balance: '124,000 GHS', status: 'Active' },
  { id: 'SUP-03', name: 'Accra Metal Works', type: 'Local', products: 8, balance: '12,400 GHS', status: 'Pending' },
  { id: 'SUP-04', name: 'China Build Wholesale', type: 'Import', products: 120, balance: '45,000 GHS', status: 'Active' },
  { id: 'SUP-05', name: 'West Africa Plastics', type: 'Local', products: 15, balance: '0 GHS', status: 'Inactive' },
];

export default function BusinessManagement() {
  const location = useLocation();
  const { openCreateOrder } = useOrderWorkflow();
  
  // Set default tab based on route
  const defaultTab = location.pathname.includes('/dealer') ? 'Dealers' : 'Overview';
                     
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Update active tab when route changes
  React.useEffect(() => {
    if (location.pathname.includes('/dealer')) setActiveTab('Dealers');
    else if (location.pathname.includes('/business')) setActiveTab('Overview');
  }, [location]);

  return (
    <div className="flex flex-col h-full bg-[#F7F7F8] dark:bg-[#0B0F1A] font-sans overflow-hidden">
      
      {/* ── Page Header ── */}
      <div className="bg-white dark:bg-[#151B2B] border-b border-[#ECEDEF] dark:border-white/5 px-8 pt-6 shrink-0 sticky top-0 z-20">
        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-[11px] bg-[#111111] dark:bg-white text-white dark:text-[#111111] flex items-center justify-center">
                <Icon icon="solar:layers-bold-duotone" className="text-[18px]" />
              </div>
              <h1 className="text-[24px] font-black text-[#111111] dark:text-white tracking-tight">Business Management</h1>
            </div>
            <p className="text-[13px] font-medium text-[#8B93A7] mt-0.5 ml-0.5">Manage your operations, supply chain, and financial performance</p>
          </div>
          <div className="flex items-center gap-3 mb-1">
            <button className="h-10 px-4 bg-white border border-[#E4E7EC] text-[#111111] text-[13px] font-bold rounded-[10px] flex items-center gap-2 hover:bg-[#F3F4F6] transition-colors">
              <Download size={16} />
              Export
            </button>
            <button 
              onClick={() => openCreateOrder()}
              className="h-10 px-4 bg-white border border-[#E4E7EC] text-[#111111] text-[13px] font-bold rounded-[10px] flex items-center gap-2 hover:bg-[#F3F4F6] transition-colors"
            >
              <Plus size={16} />
              Add Order
            </button>
            <button className="h-10 px-4 bg-[#D40073] hover:bg-[#B80063] text-white text-[13px] font-bold rounded-[10px] flex items-center gap-2 transition-colors">
              <Plus size={16} />
              Add Supplier
            </button>
          </div>
        </div>

        {/* ── Tab Nav ── */}
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-[14px] font-bold whitespace-nowrap transition-colors relative ${
                activeTab === tab ? 'text-[#D40073]' : 'text-[#8B93A7] hover:text-[#111111]'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#D40073] rounded-t-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col relative min-h-0 ${
        (activeTab === 'Dealers') ? 'overflow-hidden' : 'overflow-y-auto'
      }`}>
        <AnimatePresence mode="wait">
          {activeTab === 'Overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-8 max-w-[1600px] mx-auto p-6 md:p-8 w-full"
            >
              {/* Section 1: Operational KPIs */}
              <div>
                <h2 className="text-[16px] font-bold text-[#111111] dark:text-white mb-4">Operational Snapshot</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                  <KPICard title="Total Suppliers" value="24" icon={Users} gradientClass="bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9]" />
                  <KPICard title="Active Dealers" value="156" icon={Store} gradientClass="bg-gradient-to-br from-[#3B82F6] to-[#2563EB]" />
                  <KPICard title="Inventory Value" value="1.2M" icon={PackageSearch} gradientClass="bg-gradient-to-br from-[#EC4899] to-[#D40073]" />
                  <KPICard title="Pending Orders" value="48" icon={ShoppingCart} gradientClass="bg-gradient-to-br from-[#F59E0B] to-[#D97706]" />
                  <KPICard title="Out. Payments" value="124k" icon={CreditCard} gradientClass="bg-gradient-to-br from-[#EF4444] to-[#DC2626]" />
                  <KPICard title="Active Deliveries" value="12" icon={Truck} gradientClass="bg-gradient-to-br from-[#10B981] to-[#059669]" />
                </div>
              </div>

              {/* Section 2: Flow Summary */}
              <Card className="p-[32px] overflow-hidden relative">
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[radial-gradient(circle_at_top_right,_rgba(212,0,115,0.05),_transparent_70%)] pointer-events-none" />
                <h2 className="text-[16px] font-bold text-[#111111] mb-8">Supply Chain Flow</h2>
                <div className="flex items-center justify-between max-w-[1000px] mx-auto overflow-x-auto no-scrollbar pb-4">
                  <FlowNode icon={Users} title="Suppliers" value="8" status="Pending Shipments" />
                  <FlowNode icon={PackageSearch} title="Inventory" value="1.2M" status="Value in GHS" />
                  <FlowNode icon={ShoppingCart} title="Orders" value="48" status="Processing" />
                  <FlowNode icon={CreditCard} title="Payments" value="12" status="Awaiting Clearance" />
                  <FlowNode icon={Truck} title="Delivery" value="5" status="In Transit" isLast />
                </div>
              </Card>

              {/* Section 3: Priority Alerts */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[16px] font-bold text-[#111111] dark:text-white">Attention Required</h2>
                  <button className="text-[13px] font-semibold text-[#D40073] hover:text-[#B80063] transition-colors">
                    View all alerts
                  </button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <AlertItem 
                    type="danger" 
                    title="Critical Low Stock: Cement (50kg)" 
                    desc="Current inventory is below minimum threshold (3 bags remaining). Recommended reorder quantity: 500 bags." 
                    time="10 mins ago" 
                  />
                  <AlertItem 
                    type="danger" 
                    title="Overdue Payment: K.A Enterprise" 
                    desc="Dealer has an outstanding balance of 12,400 GHS that is 14 days overdue. Credit limit paused." 
                    time="1 hr ago" 
                  />
                  <AlertItem 
                    type="warning" 
                    title="Delayed Delivery #DL-492" 
                    desc="Truck to Kumasi branch is delayed by 4 hours due to vehicle maintenance. Customer notified." 
                    time="2 hrs ago" 
                  />
                  <AlertItem 
                    type="info" 
                    title="New Supplier Registration Pending" 
                    desc="Dangote Cement has submitted their onboarding documents. Requires Master Admin approval." 
                    time="4 hrs ago" 
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'Suppliers' && (
            <motion.div
              key="suppliers"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-[1600px] mx-auto"
            >
              <Card className="flex flex-col min-h-[500px]">
                {/* Table Header / Filters */}
                <div className="p-4 border-b border-[#ECEDEF] dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#151B2B]">
                  <div className="relative group w-full sm:w-[320px]">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B93A7] group-focus-within:text-[#D40073] transition-colors" size={16} />
                    <input 
                      type="text" 
                      placeholder="Search suppliers..." 
                      className="w-full h-10 pl-10 pr-4 bg-[#F7F7F8] dark:bg-white/5 border border-transparent dark:border-white/10 rounded-[10px] text-[13px] text-[#111111] dark:text-white placeholder:text-[#8B93A7] focus:outline-none focus:bg-white dark:focus:bg-white/10 focus:border-[#D40073] transition-all"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="h-10 px-4 flex items-center gap-2 bg-white dark:bg-white/5 border border-[#E4E7EC] dark:border-white/10 rounded-[10px] text-[13px] font-bold text-[#111111] dark:text-[#8B93A7] hover:bg-[#F3F4F6] dark:hover:bg-white/10 transition-colors">
                      <Filter size={14} />
                      Filters
                    </button>
                    <button className="h-10 px-4 flex items-center gap-2 bg-[#111111] dark:bg-white text-white dark:text-[#111111] rounded-[10px] text-[13px] font-black transition-all hover:bg-[#D40073] hover:text-white">
                      <Plus size={14} strokeWidth={3} />
                      New Supplier
                    </button>
                  </div>
                </div>

                {/* Main Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#F9FAFB] dark:bg-white/5 border-b border-[#ECEDEF] dark:border-white/5">
                        <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Supplier Name</th>
                        <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Type</th>
                        <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Active Products</th>
                        <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Outstanding Payment</th>
                        <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Status</th>
                        <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#ECEDEF] dark:divide-white/5">
                      {MOCK_SUPPLIERS.map((supplier) => (
                        <tr key={supplier.id} className="hover:bg-[#F7F7F8] dark:hover:bg-white/5 transition-colors cursor-pointer group">
                          <td className="py-4 px-6">
                            <div className="text-[14px] font-black text-[#111111] dark:text-white flex items-center gap-2 group-hover:text-[#D40073] transition-colors">
                              {supplier.name}
                              <ArrowUpRight size={14} className="text-[#8B93A7] opacity-0 group-hover:opacity-100 transition-all" />
                            </div>
                            <div className="text-[11px] font-bold text-[#D40073] uppercase mt-1 tracking-wider">{supplier.id}</div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center px-2 py-1 rounded-[6px] text-[11px] font-black uppercase tracking-wider bg-[#F3F4F6] dark:bg-white/5 text-[#525866] dark:text-[#8B93A7] border border-transparent dark:border-white/10">
                              {supplier.type}
                            </span>
                          </td>
                          <td className="py-4 px-6 font-bold text-[#111111] dark:text-white">{supplier.products} Items</td>
                          <td className="py-4 px-6">
                            <span className={`text-[14px] font-black ${supplier.balance !== '0 GHS' ? 'text-[#DC2626]' : 'text-[#16A34A]'}`}>
                              {supplier.balance}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-[6px] text-[11px] font-black uppercase tracking-wider border ${
                              supplier.status === 'Active' ? 'bg-[#ECFDF3] dark:bg-[#064E3B]/30 text-[#16A34A] border-[#16A34A]/10' :
                              supplier.status === 'Pending' ? 'bg-[#FFF7ED] dark:bg-[#78350F]/30 text-[#D97706] border-[#D97706]/10' :
                              'bg-[#F3F4F6] dark:bg-white/5 text-[#525866] dark:text-[#8B93A7] border-transparent'
                            }`}>
                              {supplier.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button className="w-9 h-9 inline-flex items-center justify-center text-[#8B93A7] hover:text-[#111111] dark:hover:text-white hover:bg-white dark:hover:bg-white/5 border border-transparent hover:border-[#ECEDEF] dark:hover:border-white/10 rounded-[10px] transition-all shadow-sm">
                              <MoreHorizontal size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer / Pagination */}
                <div className="p-4 border-t border-[#ECEDEF] dark:border-white/5 flex items-center justify-between text-[13px] font-bold text-[#8B93A7] uppercase tracking-wider bg-[#F9FAFB] dark:bg-white/5 mt-auto">
                  <div>Showing 1 to 5 of 24 suppliers</div>
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 border border-[#ECEDEF] dark:border-white/10 rounded-[10px] hover:bg-white dark:hover:bg-white/5 disabled:opacity-50 transition-all shadow-sm">Previous</button>
                    <button className="px-4 py-2 border border-[#ECEDEF] dark:border-white/10 rounded-[10px] hover:bg-white dark:hover:bg-white/5 disabled:opacity-50 transition-all shadow-sm text-[#111111] dark:text-white">Next</button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'Dealers' && (
            <motion.div
              key="dealers"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full flex-1 flex flex-col min-h-0"
            >
              <DealerManagement />
            </motion.div>
          )}

          {activeTab !== 'Overview' && activeTab !== 'Suppliers' && activeTab !== 'Dealers' && (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center justify-center h-[400px] text-center w-full"
            >
              <div className="w-[64px] h-[64px] bg-[#F3F4F6] rounded-[16px] flex items-center justify-center mb-6">
                <Store size={28} className="text-[#8B93A7]" />
              </div>
              <h2 className="text-[20px] font-bold text-[#111111] mb-2">{activeTab} Module</h2>
              <p className="text-[14px] text-[#525866] max-w-[400px]">
                This module is structured and ready for implementation. It will integrate seamlessly into the Business Management operating system.
              </p>
              <button className="mt-8 px-6 py-2.5 bg-white border border-[#E4E7EC] rounded-[12px] text-[14px] font-semibold text-[#111111] hover:bg-[#F3F4F6] transition-colors">
                Configure {activeTab}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
