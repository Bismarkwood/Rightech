import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PackageSearch, Search, Filter, Plus, 
  MoreHorizontal, Download, ArrowUpRight,
  TrendingUp, Clock, CheckCircle2, AlertCircle, Box,
  X, MapPin, Truck, ChevronRight, Mail, Phone, ExternalLink, Calendar
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const MOCK_SUPPLIERS = [
  { id: 'SUP-001', name: 'Global Tech Electronics', category: 'Consumer Electronics', consignments: 12, pendingShipments: 3, outstanding: '$45,200', status: 'Active', lastDelivery: 'Today, 10:30 AM', email: 'orders@globaltech.com', phone: '+1 (555) 123-4567', joinedDate: 'Jan 2024' },
  { id: 'SUP-002', name: 'Premium Appliance Hub', category: 'Home Appliances', consignments: 8, pendingShipments: 1, outstanding: '$12,850', status: 'Active', lastDelivery: 'Yesterday', email: 'sales@premiumapp.com', phone: '+1 (555) 987-6543', joinedDate: 'Mar 2024' },
  { id: 'SUP-003', name: 'NextGen Mobile Solutions', category: 'Smartphones', consignments: 24, pendingShipments: 5, outstanding: '$118,500', status: 'Warning', lastDelivery: '2 days ago', email: 'support@nextgen.mobile', phone: '+1 (555) 456-7890', joinedDate: 'Jun 2023' },
  { id: 'SUP-004', name: 'MegaHome Distributors', category: 'Furniture', consignments: 5, pendingShipments: 0, outstanding: '$0', status: 'Inactive', lastDelivery: '1 week ago', email: 'contact@megahome.com', phone: '+1 (555) 234-5678', joinedDate: 'Nov 2024' },
  { id: 'SUP-005', name: 'QuickSpares Auto', category: 'Automotive Parts', consignments: 42, pendingShipments: 8, outstanding: '$89,300', status: 'Active', lastDelivery: 'Today, 08:15 AM', email: 'supply@quickspares.com', phone: '+1 (555) 876-5432', joinedDate: 'Feb 2024' }
];

const MOCK_CONSIGNMENTS = [
  { id: 'CON-8932', supplier: 'Global Tech Electronics', items: 450, value: '$32,000', status: 'In Transit', eta: 'Tomorrow, 14:00', origin: 'Shenzhen, China', destination: 'Accra Central', mode: 'Sea Freight' },
  { id: 'CON-8933', supplier: 'NextGen Mobile Solutions', items: 1200, value: '$85,000', status: 'Customs Clearance', eta: 'Oct 28', origin: 'Dubai, UAE', destination: 'Tema Port', mode: 'Air Freight' },
  { id: 'CON-8934', supplier: 'Premium Appliance Hub', items: 32, value: '$12,850', status: 'Delivered', eta: 'Delivered Yesterday', origin: 'Lagos, Nigeria', destination: 'Kumasi Hub', mode: 'Road Freight' },
  { id: 'CON-8935', supplier: 'QuickSpares Auto', items: 210, value: '$15,400', status: 'Pending', eta: 'Nov 02', origin: 'Johannesburg, SA', destination: 'Takoradi Hub', mode: 'Road Freight' },
];

export default function SupplyManagement() {
  const [activeTab, setActiveTab] = useState('Consignments');
  const [consignments, setConsignments] = useState(MOCK_CONSIGNMENTS);
  const [selectedConsignment, setSelectedConsignment] = useState<any>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [isNewConsignmentOpen, setIsNewConsignmentOpen] = useState(false);
  const [newConsignment, setNewConsignment] = useState({
    supplier: '',
    origin: '',
    destination: '',
    mode: 'Road Freight',
    eta: '',
    items: 1,
    value: '',
    status: 'Pending',
    notes: '',
  });

  const canCreateConsignment =
    newConsignment.supplier.trim().length > 0 &&
    newConsignment.origin.trim().length > 0 &&
    newConsignment.destination.trim().length > 0 &&
    newConsignment.eta.trim().length > 0 &&
    Number.isFinite(newConsignment.items) &&
    newConsignment.items > 0 &&
    newConsignment.value.trim().length > 0;

  const openNewConsignment = () => {
    setNewConsignment({
      supplier: '',
      origin: '',
      destination: '',
      mode: 'Road Freight',
      eta: '',
      items: 1,
      value: '',
      status: 'Pending',
      notes: '',
    });
    setIsNewConsignmentOpen(true);
  };

  const createConsignment = () => {
    if (!canCreateConsignment) return;
    const nextId = `CON-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();
    const track = (title: string, detail: string, minutesAgo = 0) => {
      const d = new Date(Date.now() - minutesAgo * 60_000).toISOString();
      return { at: d, title, detail };
    };
    const record = {
      id: nextId,
      supplier: newConsignment.supplier,
      items: newConsignment.items,
      value: newConsignment.value,
      status: newConsignment.status,
      eta: newConsignment.eta,
      origin: newConsignment.origin,
      destination: newConsignment.destination,
      mode: newConsignment.mode,
      notes: newConsignment.notes,
      createdAt: now,
      updatedAt: now,
      trackingHistory: [
        track('Consignment Created', `Created for ${newConsignment.supplier}`),
        track('Origin Confirmed', newConsignment.origin, 2),
        track('Destination Confirmed', newConsignment.destination, 3),
      ],
    };
    setConsignments((prev) => [record, ...prev]);
    setIsNewConsignmentOpen(false);
    setSelectedConsignment(record);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#F7F7F8] relative min-h-0">
      {/* Header */}
      <div className="px-6 md:px-8 pt-8 pb-6 bg-[#F7F7F8] shrink-0 sticky top-0 z-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-[28px] font-bold text-[#111111] tracking-tight mb-2">Supply Management</h1>
            <p className="text-[14px] text-[#525866] max-w-xl leading-relaxed">
              View consignments · Track payment status<br />
              Update shipment status · View shipping records
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="h-[40px] px-4 flex items-center gap-2 bg-white border border-[#E4E7EC] rounded-[12px] text-[14px] font-semibold text-[#111111] hover:bg-[#F3F4F6] transition-colors">
              <Download size={16} />
              Export Data
            </button>
            <button className="h-[40px] px-4 flex items-center gap-2 bg-[#D40073] hover:bg-[#B80063] text-white rounded-[12px] text-[14px] font-semibold transition-colors">
              <Plus size={16} />
              Add Supplier
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-[#D40073] to-[#B3005F] text-white p-5 rounded-[16px] border-0 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
            <div className="flex items-center justify-between mb-3 relative z-10">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-md">
                <Box size={20} />
              </div>
              <span className="px-2 py-1 rounded-[6px] bg-white/20 text-white text-[12px] font-bold backdrop-blur-md">+12%</span>
            </div>
            <p className="text-[13px] font-medium text-white/80 mb-1 relative z-10">Active Consignments</p>
            <p className="text-[24px] font-bold text-white relative z-10">24</p>
          </div>
          <div className="bg-gradient-to-br from-[#5B8CFF] to-[#3B82F6] text-white p-5 rounded-[16px] border-0 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
            <div className="flex items-center justify-between mb-3 relative z-10">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-md">
                <TrendingUp size={20} />
              </div>
              <span className="px-2 py-1 rounded-[6px] bg-white/20 text-white text-[12px] font-bold backdrop-blur-md">-2.4%</span>
            </div>
            <p className="text-[13px] font-medium text-white/80 mb-1 relative z-10">Pending Shipments</p>
            <p className="text-[24px] font-bold text-white relative z-10">17</p>
          </div>
          <div className="bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] text-white p-5 rounded-[16px] border-0 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
            <div className="flex items-center justify-between mb-3 relative z-10">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-md">
                <AlertCircle size={20} />
              </div>
            </div>
            <p className="text-[13px] font-medium text-white/80 mb-1 relative z-10">Outstanding Balance</p>
            <p className="text-[24px] font-bold text-white relative z-10">$265.8k</p>
          </div>
          <div className="bg-gradient-to-br from-[#10B981] to-[#059669] text-white p-5 rounded-[16px] border-0 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
            <div className="flex items-center justify-between mb-3 relative z-10">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-md">
                <CheckCircle2 size={20} />
              </div>
              <span className="px-2 py-1 rounded-[6px] bg-white/20 text-white text-[12px] font-bold backdrop-blur-md">+8%</span>
            </div>
            <p className="text-[13px] font-medium text-white/80 mb-1 relative z-10">Suppliers Paid</p>
            <p className="text-[24px] font-bold text-white relative z-10">142</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar border-b border-[#ECEDEF]">
          {['Suppliers', 'Consignments', 'Payments'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-[14px] font-medium whitespace-nowrap transition-colors relative ${
                activeTab === tab ? 'text-[#D40073]' : 'text-[#525866] hover:text-[#111111]'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="supplyTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D40073]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 min-h-0">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="max-w-[1400px] mx-auto"
        >
          {activeTab === 'Suppliers' && (
            <div className="bg-white rounded-[16px] border border-[#ECEDEF] overflow-hidden">
              <div className="p-4 border-b border-[#ECEDEF] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative max-w-md w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B93A7]" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search suppliers by name or ID..."
                    className="w-full pl-10 pr-4 h-[40px] bg-[#F7F7F8] border border-[#ECEDEF] rounded-[12px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#D40073]/20 focus:border-[#D40073] transition-all"
                  />
                </div>
                <button className="h-[40px] px-4 flex items-center justify-center gap-2 bg-white border border-[#E4E7EC] rounded-[12px] text-[14px] font-semibold text-[#111111] hover:bg-[#F3F4F6] transition-colors">
                  <Filter size={16} />
                  Filters
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#ECEDEF]">
                      <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Supplier</th>
                      <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Status</th>
                      <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Consignments</th>
                      <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Outstanding Balance</th>
                      <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Last Delivery</th>
                      <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ECEDEF]">
                    {MOCK_SUPPLIERS.map((supplier) => (
                      <tr 
                        key={supplier.id} 
                        onClick={() => setSelectedSupplier(supplier)}
                        className="hover:bg-[#F7F7F8] transition-colors group cursor-pointer"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#111111] font-bold shrink-0">
                              {supplier.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-[14px] font-bold text-[#111111]">{supplier.name}</p>
                              <p className="text-[13px] text-[#525866]">{supplier.id} • {supplier.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex px-2.5 py-1 rounded-[6px] text-[12px] font-bold ${
                            supplier.status === 'Active' ? 'bg-[#ECFDF5] text-[#059669]' : 
                            supplier.status === 'Warning' ? 'bg-[#FFFBEB] text-[#D97706]' : 
                            'bg-[#F3F4F6] text-[#525866]'
                          }`}>
                            {supplier.status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-[14px] font-bold text-[#111111]">{supplier.consignments}</p>
                          <p className="text-[13px] text-[#525866]">{supplier.pendingShipments} pending</p>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-[14px] font-bold text-[#111111]">{supplier.outstanding}</p>
                        </td>
                        <td className="py-4 px-6 text-[13px] text-[#525866]">
                          {supplier.lastDelivery}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#525866] hover:bg-white hover:shadow-sm hover:text-[#111111] transition-all border border-transparent hover:border-[#ECEDEF]">
                              <ArrowUpRight size={16} />
                            </button>
                            <button className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#525866] hover:bg-white hover:shadow-sm hover:text-[#111111] transition-all border border-transparent hover:border-[#ECEDEF]">
                              <MoreHorizontal size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Consignments' && (
             <div className="bg-white rounded-[16px] border border-[#ECEDEF] overflow-hidden">
              <div className="p-4 border-b border-[#ECEDEF] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative max-w-md w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B93A7]" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search consignments by ID or supplier..."
                    className="w-full pl-10 pr-4 h-[40px] bg-[#F7F7F8] border border-[#ECEDEF] rounded-[12px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#D40073]/20 focus:border-[#D40073] transition-all"
                  />
                </div>
                <div className="flex gap-2">
                  <button className="h-[40px] px-4 flex items-center justify-center gap-2 bg-white border border-[#E4E7EC] rounded-[12px] text-[14px] font-semibold text-[#111111] hover:bg-[#F3F4F6] transition-colors">
                    <Filter size={16} />
                    Filters
                  </button>
                  <button
                    onClick={openNewConsignment}
                    className="h-[40px] px-4 flex items-center justify-center gap-2 bg-[#111111] border border-transparent rounded-[12px] text-[14px] font-semibold text-white hover:bg-[#333333] transition-colors"
                  >
                    <Plus size={16} />
                    New Consignment
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#ECEDEF]">
                      <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Consignment ID</th>
                      <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Supplier</th>
                      <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Details</th>
                      <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Status</th>
                      <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">ETA</th>
                      <th className="py-4 px-6 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ECEDEF]">
                    {consignments.map((cons) => (
                      <tr 
                        key={cons.id} 
                        onClick={() => setSelectedConsignment(cons)}
                        className="hover:bg-[#F7F7F8] transition-colors cursor-pointer group"
                      >
                        <td className="py-4 px-6">
                          <p className="text-[14px] font-bold text-[#111111]">{cons.id}</p>
                          <p className="text-[13px] text-[#525866]">{cons.mode}</p>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-[14px] font-bold text-[#111111]">{cons.supplier}</p>
                          <p className="text-[13px] text-[#525866]">{cons.origin}</p>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-[14px] font-medium text-[#111111]">{cons.items} Items</p>
                          <p className="text-[13px] text-[#525866]">{cons.value}</p>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex px-2.5 py-1 rounded-[6px] text-[12px] font-bold ${
                            cons.status === 'Delivered' ? 'bg-[#ECFDF5] text-[#059669]' : 
                            cons.status === 'In Transit' ? 'bg-[#EFF6FF] text-[#2563EB]' :
                            cons.status === 'Customs Clearance' ? 'bg-[#FFFBEB] text-[#D97706]' :
                            'bg-[#F3F4F6] text-[#525866]'
                          }`}>
                            {cons.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-[13px] text-[#525866] font-medium">
                          {cons.eta}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#525866] hover:bg-white hover:shadow-sm hover:text-[#111111] transition-all border border-transparent hover:border-[#ECEDEF]">
                              <ChevronRight size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {activeTab === 'Payments' && (
            <div className="bg-white rounded-[16px] border border-[#ECEDEF] p-16 text-center">
              <h3 className="text-[18px] font-bold text-[#111111] mb-2">Payment Status</h3>
              <p className="text-[14px] text-[#525866]">Supplier payment tracking features go here.</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Consignment Details Drawer */}
      <AnimatePresence>
        {isNewConsignmentOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewConsignmentOpen(false)}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl bg-white rounded-[24px] border border-[#ECEDEF] shadow-2xl z-50 overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-[#ECEDEF] flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-[20px] font-bold text-[#111111] tracking-tight">New Consignment</h2>
                  <p className="text-[13px] text-[#525866] mt-1">Create and track a shipment from your suppliers.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewConsignmentOpen(false)}
                  className="w-10 h-10 rounded-full hover:bg-[#F3F4F6] flex items-center justify-center transition-colors text-[#525866]"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-[#525866] uppercase tracking-wider">Supplier</label>
                    <Select value={newConsignment.supplier} onValueChange={(v) => setNewConsignment((p) => ({ ...p, supplier: v }))}>
                      <SelectTrigger size="form">
                        <SelectValue placeholder="Select supplier..." />
                      </SelectTrigger>
                      <SelectContent>
                        {MOCK_SUPPLIERS.map((s) => (
                          <SelectItem key={s.id} value={s.name}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[12px] font-bold text-[#525866] uppercase tracking-wider">Mode</label>
                      <Select value={newConsignment.mode} onValueChange={(v) => setNewConsignment((p) => ({ ...p, mode: v }))}>
                        <SelectTrigger size="form">
                          <SelectValue placeholder="Select mode..." />
                        </SelectTrigger>
                        <SelectContent>
                          {['Road Freight', 'Air Freight', 'Sea Freight'].map((m) => (
                            <SelectItem key={m} value={m}>
                              {m}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[12px] font-bold text-[#525866] uppercase tracking-wider">Status</label>
                      <Select value={newConsignment.status} onValueChange={(v) => setNewConsignment((p) => ({ ...p, status: v }))}>
                        <SelectTrigger size="form">
                          <SelectValue placeholder="Select status..." />
                        </SelectTrigger>
                        <SelectContent>
                          {['Pending', 'In Transit', 'Customs Clearance', 'Delivered'].map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[12px] font-bold text-[#525866] uppercase tracking-wider">Items</label>
                      <input
                        type="number"
                        min={1}
                        value={newConsignment.items}
                        onChange={(e) => setNewConsignment((p) => ({ ...p, items: Number(e.target.value) }))}
                        className="w-full h-[44px] px-4 bg-[#F7F7F8] border border-[#ECEDEF] rounded-[12px] text-[14px] font-semibold text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#D40073]/20 focus:border-[#D40073] transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[12px] font-bold text-[#525866] uppercase tracking-wider">Declared value</label>
                      <input
                        value={newConsignment.value}
                        onChange={(e) => setNewConsignment((p) => ({ ...p, value: e.target.value }))}
                        placeholder="e.g. $32,000"
                        className="w-full h-[44px] px-4 bg-[#F7F7F8] border border-[#ECEDEF] rounded-[12px] text-[14px] font-semibold text-[#111111] placeholder:text-[#8B93A7] focus:outline-none focus:ring-2 focus:ring-[#D40073]/20 focus:border-[#D40073] transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-[#525866] uppercase tracking-wider">Origin</label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B93A7]" />
                      <input
                        value={newConsignment.origin}
                        onChange={(e) => setNewConsignment((p) => ({ ...p, origin: e.target.value }))}
                        placeholder="e.g. Shenzhen, China"
                        className="w-full h-[44px] pl-11 pr-4 bg-[#F7F7F8] border border-[#ECEDEF] rounded-[12px] text-[14px] font-semibold text-[#111111] placeholder:text-[#8B93A7] focus:outline-none focus:ring-2 focus:ring-[#D40073]/20 focus:border-[#D40073] transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-[#525866] uppercase tracking-wider">Destination</label>
                    <div className="relative">
                      <Truck size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B93A7]" />
                      <input
                        value={newConsignment.destination}
                        onChange={(e) => setNewConsignment((p) => ({ ...p, destination: e.target.value }))}
                        placeholder="e.g. Accra Central"
                        className="w-full h-[44px] pl-11 pr-4 bg-[#F7F7F8] border border-[#ECEDEF] rounded-[12px] text-[14px] font-semibold text-[#111111] placeholder:text-[#8B93A7] focus:outline-none focus:ring-2 focus:ring-[#D40073]/20 focus:border-[#D40073] transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-[#525866] uppercase tracking-wider">ETA</label>
                    <div className="relative">
                      <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B93A7]" />
                      <input
                        value={newConsignment.eta}
                        onChange={(e) => setNewConsignment((p) => ({ ...p, eta: e.target.value }))}
                        placeholder="e.g. Tomorrow, 14:00"
                        className="w-full h-[44px] pl-11 pr-4 bg-[#F7F7F8] border border-[#ECEDEF] rounded-[12px] text-[14px] font-semibold text-[#111111] placeholder:text-[#8B93A7] focus:outline-none focus:ring-2 focus:ring-[#D40073]/20 focus:border-[#D40073] transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-[#525866] uppercase tracking-wider">Notes (optional)</label>
                    <textarea
                      value={newConsignment.notes}
                      onChange={(e) => setNewConsignment((p) => ({ ...p, notes: e.target.value }))}
                      placeholder="Add a short note for your operations team..."
                      className="w-full min-h-[120px] px-4 py-3 bg-[#F7F7F8] border border-[#ECEDEF] rounded-[12px] text-[14px] font-medium text-[#111111] placeholder:text-[#8B93A7] focus:outline-none focus:ring-2 focus:ring-[#D40073]/20 focus:border-[#D40073] transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="px-6 py-5 border-t border-[#ECEDEF] bg-white flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <div className="text-[12px] text-[#8B93A7] font-semibold">
                  Required: Supplier, Origin, Destination, ETA, Items, Value
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsNewConsignmentOpen(false)}
                    className="h-[44px] px-5 bg-white border border-[#E4E7EC] text-[#111111] font-semibold text-[14px] rounded-[12px] hover:bg-[#F3F4F6] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={createConsignment}
                    disabled={!canCreateConsignment}
                    className="h-[44px] px-6 bg-[#D40073] text-white font-semibold text-[14px] rounded-[12px] hover:bg-[#B80063] transition-colors disabled:opacity-50 disabled:hover:bg-[#D40073]"
                  >
                    Create consignment
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {selectedConsignment && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedConsignment(null)}
              className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-[480px] bg-white/85 backdrop-blur-2xl border-l border-[#ECEDEF] shadow-none z-50 flex flex-col"
            >
              {/* Drawer Header */}
              <div className="h-[72px] px-6 border-b border-[#ECEDEF] flex items-center justify-between shrink-0">
                <div>
                  <h2 className="text-[18px] font-bold text-[#111111]">Consignment Details</h2>
                  <p className="text-[13px] text-[#525866]">{selectedConsignment.id}</p>
                </div>
                <button 
                  onClick={() => setSelectedConsignment(null)}
                  className="w-10 h-10 rounded-full hover:bg-black/5 flex items-center justify-center transition-colors text-[#525866]"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                
                {/* Status Block */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex px-3 py-1.5 rounded-[8px] text-[13px] font-bold ${
                      selectedConsignment.status === 'Delivered' ? 'bg-[#ECFDF5] text-[#059669]' : 
                      selectedConsignment.status === 'In Transit' ? 'bg-[#EFF6FF] text-[#2563EB]' :
                      selectedConsignment.status === 'Customs Clearance' ? 'bg-[#FFFBEB] text-[#D97706]' :
                      'bg-[#F3F4F6] text-[#525866]'
                    }`}>
                      {selectedConsignment.status}
                    </span>
                    <span className="text-[13px] font-medium text-[#525866]">ETA: {selectedConsignment.eta}</span>
                  </div>

                  <div className="p-4 rounded-[12px] bg-white border border-[#ECEDEF]">
                    <div className="flex items-center gap-3 mb-1">
                      <Truck size={18} className="text-[#8B93A7]" />
                      <h4 className="text-[14px] font-bold text-[#111111]">{selectedConsignment.supplier}</h4>
                    </div>
                    <div className="pl-7 text-[13px] text-[#525866]">
                      <p>{selectedConsignment.items} Items • {selectedConsignment.value}</p>
                      <p className="mt-1">Mode: {selectedConsignment.mode}</p>
                    </div>
                  </div>
                </div>

                {/* Route */}
                <div>
                  <h3 className="text-[13px] font-bold text-[#8B93A7] uppercase tracking-wider mb-4">Route Info</h3>
                  <div className="relative pl-3 space-y-6">
                    <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-[#ECEDEF]" />
                    
                    <div className="relative flex gap-4">
                      <div className="w-2.5 h-2.5 rounded-full bg-white border-2 border-[#111111] z-10 mt-1.5" />
                      <div>
                        <p className="text-[14px] font-bold text-[#111111]">Origin</p>
                        <p className="text-[13px] text-[#525866]">{selectedConsignment.origin}</p>
                      </div>
                    </div>

                    <div className="relative flex gap-4">
                      <div className="w-2.5 h-2.5 rounded-full bg-white border-2 border-[#D40073] z-10 mt-1.5" />
                      <div>
                        <p className="text-[14px] font-bold text-[#111111]">Destination</p>
                        <p className="text-[13px] text-[#525866]">{selectedConsignment.destination}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline / Tracking */}
                <div>
                  <h3 className="text-[13px] font-bold text-[#8B93A7] uppercase tracking-wider mb-4">Tracking History</h3>
                  <div className="space-y-4">
                    {Array.isArray((selectedConsignment as any).trackingHistory) && (selectedConsignment as any).trackingHistory.length ? (
                      (selectedConsignment as any).trackingHistory
                        .slice()
                        .sort((a: any, b: any) => String(b.at).localeCompare(String(a.at)))
                        .map((ev: any, idx: number) => {
                          const t = new Date(ev.at);
                          const time = Number.isNaN(t.getTime())
                            ? '--:--'
                            : t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                          const faded = idx === ((selectedConsignment as any).trackingHistory.length - 1);
                          return (
                            <div key={`${ev.at}-${idx}`} className={`flex gap-4 ${faded ? 'opacity-60' : ''}`}>
                              <div className="w-12 text-[12px] font-medium text-[#8B93A7] pt-0.5 shrink-0">{time}</div>
                              <div className={`flex-1 ${idx < (selectedConsignment as any).trackingHistory.length - 1 ? 'pb-4 border-b border-[#ECEDEF]' : ''}`}>
                                <p className="text-[14px] font-medium text-[#111111]">{ev.title}</p>
                                <p className="text-[13px] text-[#525866]">{ev.detail}</p>
                              </div>
                            </div>
                          );
                        })
                    ) : (
                      <>
                        <div className="flex gap-4">
                          <div className="w-8 text-[12px] font-medium text-[#8B93A7] pt-0.5 shrink-0">10:30</div>
                          <div className="flex-1 pb-4 border-b border-[#ECEDEF]">
                            <p className="text-[14px] font-medium text-[#111111]">Departed Origin Facility</p>
                            <p className="text-[13px] text-[#525866]">{selectedConsignment.origin}</p>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="w-8 text-[12px] font-medium text-[#8B93A7] pt-0.5 shrink-0">14:00</div>
                          <div className="flex-1 pb-4 border-b border-[#ECEDEF]">
                            <p className="text-[14px] font-medium text-[#111111]">In Transit</p>
                            <p className="text-[13px] text-[#525866]">Moving to destination</p>
                          </div>
                        </div>
                        <div className="flex gap-4 opacity-50">
                          <div className="w-8 text-[12px] font-medium text-[#8B93A7] pt-0.5 shrink-0">--:--</div>
                          <div className="flex-1">
                            <p className="text-[14px] font-medium text-[#111111]">Arrive at Destination</p>
                            <p className="text-[13px] text-[#525866]">{selectedConsignment.destination}</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

              </div>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-[#ECEDEF] bg-white/50 shrink-0">
                <button className="w-full h-[44px] flex items-center justify-center gap-2 bg-[#111111] text-white font-semibold text-[14px] rounded-[12px] hover:bg-[#333333] transition-colors">
                  Update Status
                </button>
              </div>
            </motion.div>
          </>
        )}

        {selectedSupplier && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSupplier(null)}
              className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-[480px] bg-white/85 backdrop-blur-2xl border-l border-[#ECEDEF] shadow-none z-50 flex flex-col"
            >
              {/* Drawer Header */}
              <div className="h-[72px] px-6 border-b border-[#ECEDEF] flex items-center justify-between shrink-0">
                <div>
                  <h2 className="text-[18px] font-bold text-[#111111]">Supplier Details</h2>
                  <p className="text-[13px] text-[#525866]">{selectedSupplier.id}</p>
                </div>
                <button 
                  onClick={() => setSelectedSupplier(null)}
                  className="w-10 h-10 rounded-full hover:bg-black/5 flex items-center justify-center transition-colors text-[#525866]"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                
                {/* Profile Block */}
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-[#F3F4F6] border border-[#ECEDEF] flex items-center justify-center text-[#111111] text-[24px] font-bold shrink-0">
                      {selectedSupplier.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-[18px] font-bold text-[#111111]">{selectedSupplier.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex px-2 py-0.5 rounded-[4px] text-[11px] font-bold ${
                          selectedSupplier.status === 'Active' ? 'bg-[#ECFDF5] text-[#059669]' : 
                          selectedSupplier.status === 'Warning' ? 'bg-[#FFFBEB] text-[#D97706]' : 
                          'bg-[#F3F4F6] text-[#525866]'
                        }`}>
                          {selectedSupplier.status}
                        </span>
                        <span className="text-[13px] text-[#525866]">· {selectedSupplier.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-[12px] bg-white border border-[#ECEDEF]">
                      <p className="text-[13px] text-[#525866] mb-1">Outstanding</p>
                      <p className="text-[18px] font-bold text-[#111111]">{selectedSupplier.outstanding}</p>
                    </div>
                    <div className="p-4 rounded-[12px] bg-white border border-[#ECEDEF]">
                      <p className="text-[13px] text-[#525866] mb-1">Consignments</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-[18px] font-bold text-[#111111]">{selectedSupplier.consignments}</p>
                        <p className="text-[12px] text-[#8B93A7]">{selectedSupplier.pendingShipments} pending</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div>
                  <h3 className="text-[13px] font-bold text-[#8B93A7] uppercase tracking-wider mb-3">Contact Information</h3>
                  <div className="rounded-[12px] border border-[#ECEDEF] bg-white overflow-hidden">
                    <div className="flex items-center gap-3 p-4 border-b border-[#ECEDEF]">
                      <Mail size={16} className="text-[#8B93A7]" />
                      <a href={`mailto:${selectedSupplier.email}`} className="text-[14px] text-[#111111] font-medium hover:text-[#D40073] transition-colors">{selectedSupplier.email}</a>
                    </div>
                    <div className="flex items-center gap-3 p-4 border-b border-[#ECEDEF]">
                      <Phone size={16} className="text-[#8B93A7]" />
                      <a href={`tel:${selectedSupplier.phone}`} className="text-[14px] text-[#111111] font-medium hover:text-[#D40073] transition-colors">{selectedSupplier.phone}</a>
                    </div>
                    <div className="flex items-center gap-3 p-4">
                      <Calendar size={16} className="text-[#8B93A7]" />
                      <span className="text-[14px] text-[#525866]">Partner since {selectedSupplier.joinedDate}</span>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[13px] font-bold text-[#8B93A7] uppercase tracking-wider">Recent Activity</h3>
                    <button className="text-[12px] font-bold text-[#D40073] flex items-center gap-1 hover:text-[#B80063]">
                      View All <ChevronRight size={14} />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-[10px] hover:bg-[#F7F7F8] transition-colors cursor-pointer border border-transparent hover:border-[#ECEDEF]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#ECFDF5] text-[#059669] flex items-center justify-center">
                          <CheckCircle2 size={16} />
                        </div>
                        <div>
                          <p className="text-[14px] font-medium text-[#111111]">Delivery Completed</p>
                          <p className="text-[12px] text-[#525866]">{selectedSupplier.lastDelivery}</p>
                        </div>
                      </div>
                      <span className="text-[13px] font-medium text-[#111111]">$12,450</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-[10px] hover:bg-[#F7F7F8] transition-colors cursor-pointer border border-transparent hover:border-[#ECEDEF]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                          <Truck size={16} />
                        </div>
                        <div>
                          <p className="text-[14px] font-medium text-[#111111]">New Consignment Created</p>
                          <p className="text-[12px] text-[#525866]">3 days ago</p>
                        </div>
                      </div>
                      <span className="text-[13px] font-medium text-[#111111]">$8,200</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-[#ECEDEF] bg-white/50 shrink-0 flex gap-3">
                <button className="flex-1 h-[44px] flex items-center justify-center gap-2 bg-white border border-[#E4E7EC] text-[#111111] font-semibold text-[14px] rounded-[12px] hover:bg-[#F3F4F6] transition-colors">
                  <ExternalLink size={16} />
                  View Profile
                </button>
                <button className="flex-1 h-[44px] flex items-center justify-center gap-2 bg-[#D40073] text-white font-semibold text-[14px] rounded-[12px] hover:bg-[#B80063] transition-colors">
                  <Mail size={16} />
                  Contact
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}