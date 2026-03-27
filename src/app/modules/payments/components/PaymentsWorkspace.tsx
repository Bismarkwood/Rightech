import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from '@iconify/react';
import { OverviewTab } from '../../credit/components/OverviewTab';
import { TransactionsTab } from './TransactionsTab';
import { PayoutsTab } from './PayoutsTab';
import { PaymentMethodsTab } from './PaymentMethodsTab';

const TABS = [
  { id: 'overview', label: 'Overview', icon: 'solar:chart-2-bold' },
  { id: 'transactions', label: 'Transactions', icon: 'solar:checklist-bold' },
  { id: 'payouts', label: 'Payouts', icon: 'solar:arrow-up-bold' },
];

export function PaymentsWorkspace() {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <div className="flex flex-col h-full bg-[#F7F7F8]">

      {/* ── Page Header ── */}
      <div className="bg-white border-b border-[#ECEDEF] px-8 pt-6 shrink-0">
        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-[11px] bg-[#111111] text-white flex items-center justify-center">
                <Icon icon="solar:card-2-bold-duotone" className="text-[18px]" />
              </div>
              <h1 className="text-[24px] font-black text-[#111111] tracking-tight">Payments</h1>
            </div>
            <p className="text-[13px] font-medium text-[#8B93A7] mt-0.5 ml-0.5">
              All transactions, payouts, and financial activity in one place.
            </p>
          </div>
          <div className="flex items-center gap-3 mb-1">
            <button className="h-10 px-4 bg-white border border-[#E4E7EC] text-[#111111] text-[13px] font-bold rounded-[10px] flex items-center gap-2 hover:bg-[#F3F4F6] transition-colors">
              <Icon icon="solar:download-square-linear" className="text-[17px]" />
              Export
            </button>
          </div>
        </div>

        {/* ── Tab Nav ── */}
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
                  layoutId="activeTabIndicatorPayments"
                  className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#D40073] rounded-t-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="h-full p-6 lg:p-8 overflow-y-auto custom-scrollbar"
          >
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'transactions' && <TransactionsTab />}
            {activeTab === 'payouts' && <PayoutsTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
