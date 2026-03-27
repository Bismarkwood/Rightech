import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from '@iconify/react';
import { Plus } from 'lucide-react';
import { OrdersTab } from './OrdersTab';
import { CreditTab } from './CreditTab';
import { DeliveryAssignmentTab } from './DeliveryAssignmentTab';
import { InventoryTab } from './InventoryTab';
import { useOrderWorkflow } from '../orders/OrderWorkflowContext';

const TABS = [
  { id: 'orders', label: 'Sales Orders', icon: 'solar:bag-bold' },
  { id: 'dispatch', label: 'Dispatch Queue', icon: 'solar:delivery-bold' },
  { id: 'inventory', label: 'Inventory / Warehouse', icon: 'solar:box-bold' },
  { id: 'credit', label: 'Credit Management', icon: 'solar:card-2-bold' },
];

export function RetailerWorkspace() {
  const [activeTab, setActiveTab] = useState('orders');
  const { openCreateOrder } = useOrderWorkflow();
  
  return (
    <div className="flex flex-col h-full bg-[#F7F7F8]">
      {/* Tab Navigation & CTAs */}
      <div className="bg-white border-b border-[#ECEDEF] px-8 py-4 shrink-0 flex items-end justify-between">
        <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-[14px] font-bold whitespace-nowrap transition-all relative ${
                activeTab === tab.id ? 'text-[#D40073]' : 'text-[#8B93A7] hover:text-[#111111]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon icon={activeTab === tab.id ? tab.icon : tab.icon.replace('-bold', '-linear')} className="text-[18px]" />
                {tab.label}
              </div>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#D40073] rounded-t-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
        
        <button 
          onClick={() => openCreateOrder()}
          className="h-10 px-5 mb-1 bg-[#D40073] hover:bg-[#B80063] text-white text-[14px] font-bold rounded-[10px] flex items-center gap-2 transition-colors shadow-sm shadow-[#D40073]/20 shrink-0"
        >
          <Plus size={16} />
          New Order
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'orders' && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full p-6 lg:p-8"
            >
              <OrdersTab />
            </motion.div>
          )}
          {activeTab === 'dispatch' && (
            <motion.div
              key="dispatch"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full p-6 lg:p-8"
            >
              <DeliveryAssignmentTab />
            </motion.div>
          )}
          {activeTab === 'inventory' && (
            <motion.div
              key="inventory"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full p-6 lg:p-8"
            >
              <InventoryTab />
            </motion.div>
          )}
          {activeTab === 'credit' && (
            <motion.div
              key="credit"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full p-6 lg:p-8"
            >
              <CreditTab />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}