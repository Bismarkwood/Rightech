import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from '@iconify/react';
import { Plus } from 'lucide-react';
import { OverviewTab } from './OverviewTab';
import { AccountsTab } from './AccountsTab';
import { RepaymentTrackerTab } from './RepaymentTrackerTab';
import { RatingsTab } from './RatingsTab';
import { RulesTab } from './RulesTab';

const TABS = [
  { id: 'overview', label: 'Overview', icon: 'solar:widget-bold' },
  { id: 'accounts', label: 'Credit Accounts', icon: 'solar:users-group-two-rounded-bold' },
  { id: 'tracker', label: 'Repayment Tracker', icon: 'solar:history-bold' },
  { id: 'ratings', label: 'Credit Ratings', icon: 'solar:star-bold' },
  { id: 'rules', label: 'Rules & Limits', icon: 'solar:settings-minimalistic-bold' },
];

export function CreditWorkspace() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="flex flex-col h-full bg-[#F7F7F8]">
      {/* ── Page Header ── */}
      <div className="bg-white border-b border-[#ECEDEF] px-8 pt-6 shrink-0">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h1 className="text-[24px] font-black text-[#111111] tracking-tight">Credit Management</h1>
            <p className="text-[13px] font-medium text-[#8B93A7] mt-0.5">Monitor credit health and automated dealer ratings.</p>
          </div>
          <div className="flex items-center gap-3 mb-1">
            <button className="h-10 px-4 bg-white border border-[#E4E7EC] text-[#111111] text-[13px] font-bold rounded-[10px] flex items-center gap-2 hover:bg-[#F3F4F6] transition-colors">
              <Icon icon="solar:download-square-linear" className="text-[17px]" />
              Export
            </button>
            <button className="h-10 px-5 bg-[#D40073] hover:bg-[#B80063] text-white text-[13px] font-bold rounded-[10px] flex items-center gap-2 transition-colors shadow-sm shadow-[#D40073]/20">
              <Plus size={15} strokeWidth={2.5} />
              Extend Credit
            </button>
          </div>
        </div>

        {/* ── Tab Nav (Shipment-style) ── */}
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
                <Icon
                  icon={activeTab === tab.id ? tab.icon : tab.icon.replace('-bold', '-linear')}
                  className="text-[18px]"
                />
                {tab.label}
              </div>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="creditTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#D40073] rounded-t-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ── */}
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
            {activeTab === 'accounts' && <AccountsTab />}
            {activeTab === 'tracker' && <RepaymentTrackerTab />}
            {activeTab === 'ratings' && <RatingsTab />}
            {activeTab === 'rules' && <RulesTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
