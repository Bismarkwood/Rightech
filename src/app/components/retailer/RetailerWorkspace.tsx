import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from '@iconify/react';
import { useLocation } from 'react-router';

// Sub-components
import { OverviewTab } from './OverviewTab';
import { OrdersTab } from './OrdersTab';
import { StorefrontTab } from './StorefrontTab';
import { PaymentsTab } from './PaymentsTab';
import { CreditTab } from './CreditTab';
import { DeliveryAssignmentTab } from './DeliveryAssignmentTab';
import { InventoryTab } from './InventoryTab';

const TABS = [
  { id: 'Overview', label: 'Overview', icon: 'solar:home-2-linear' },
  { id: 'Orders', label: 'Orders', icon: 'solar:cart-large-2-linear' },
  { id: 'Inventory', label: 'Inventory', icon: 'solar:box-linear' },
  { id: 'Storefront', label: 'Storefront', icon: 'solar:shop-linear' },
  { id: 'Payments', label: 'Payments', icon: 'solar:wallet-money-linear' },
  { id: 'Credit', label: 'Credit', icon: 'solar:card-linear' },
  { id: 'Delivery', label: 'Delivery', icon: 'solar:routing-2-linear' },
];

export function RetailerWorkspace() {
  const location = useLocation();
  const initialTab =
    (location.state as any)?.activeTab ??
    (location.pathname.includes('/dashboard/retailer/orders/') ? 'Orders' : 'Overview');
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const nextTab = (location.state as any)?.activeTab;
    if (nextTab) setActiveTab(nextTab);
  }, [location.state]);

  return (
    <div className="flex flex-col h-full bg-[#F7F7F8] font-sans overflow-hidden">
      {/* Header Area */}
      <div className="px-6 md:px-8 pt-8 pb-0 bg-[#F7F7F8] shrink-0 z-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-[28px] font-bold text-[#111111] tracking-tight mb-1">Retailer Operations</h1>
            <p className="text-[14px] text-[#525866]">Manage storefront, orders, stock, and daily fulfillment</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="h-[40px] px-4 flex items-center gap-2 bg-white border border-[#E4E7EC] rounded-[12px] text-[14px] font-semibold text-[#111111] hover:bg-[#F3F4F6] transition-colors">
              <Icon icon="solar:download-minimalistic-linear" className="text-[18px]" />
              Export Report
            </button>
            <button 
              onClick={() => setActiveTab('Storefront')}
              className="h-[40px] px-4 flex items-center gap-2 bg-[#D40073] hover:bg-[#B80063] text-white rounded-[12px] text-[14px] font-semibold transition-colors"
            >
              <Icon icon="solar:add-circle-linear" className="text-[18px]" />
              New Order
            </button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex items-center gap-8 overflow-x-auto no-scrollbar border-b border-[#ECEDEF]">
          {TABS.map((tab) => {
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 text-[14px] font-medium whitespace-nowrap transition-colors relative flex items-center gap-2 ${
                  activeTab === tab.id ? 'text-[#D40073]' : 'text-[#525866] hover:text-[#111111]'
                }`}
              >
                <Icon icon={tab.icon} className={`text-[18px] ${activeTab === tab.id ? "text-[#D40073]" : "text-[#8B93A7]"}`} />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="retailerTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D40073]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col relative min-h-0 ${activeTab === 'Delivery' ? 'overflow-hidden' : 'overflow-y-auto'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`w-full ${activeTab === 'Delivery' ? 'h-full flex flex-col' : 'max-w-[1600px] mx-auto p-6 md:p-8'}`}
          >
            {activeTab === 'Overview' && <OverviewTab onNavigate={setActiveTab} />}
            {activeTab === 'Orders' && <OrdersTab />}
            {activeTab === 'Inventory' && <InventoryTab />}
            {activeTab === 'Storefront' && <StorefrontTab />}
            {activeTab === 'Payments' && <PaymentsTab />}
            {activeTab === 'Credit' && <CreditTab />}
            {activeTab === 'Delivery' && <DeliveryAssignmentTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}