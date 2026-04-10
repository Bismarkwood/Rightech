import React from 'react';
import { motion } from 'motion/react';
import { Icon } from '@iconify/react';
import { useCredit } from '../context/CreditContext';
import { MoreVertical, ShieldCheck, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';

export function AccountsTab() {
  const { accounts, toggleSuspension } = useCredit();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
      {accounts.map((account) => {
        const utilization = (account.usedAmount / account.creditLimit) * 100;
        const barColor = utilization > 85 ? '#EF4444' : utilization > 60 ? '#D97706' : '#16A34A';
        
        return (
          <div key={account.id} className="bg-white rounded-[32px] border border-[#ECEDEF] p-6 transition-all">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-[18px] font-black text-[#111111]">{account.dealerName}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider flex items-center gap-1 ${
                    account.band === 'Excellent' || account.band === 'Good' ? 'bg-[#16A34A]/10 text-[#16A34A]' : 'bg-[#EF4444]/10 text-[#EF4444]'
                  }`}>
                    <ShieldCheck size={12} />
                    {account.band} {account.score}/100
                  </span>
                  {account.trend === 'up' ? <TrendingUp size={14} className="text-[#16A34A]" /> : <TrendingDown size={14} className="text-[#EF4444]" />}
                </div>
              </div>
              <button className="w-8 h-8 flex items-center justify-center text-[#8B93A7] hover:text-[#111111] transition-colors rounded-full hover:bg-[#F3F4F6]">
                <MoreVertical size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-[13px] font-black">
                <span className="text-[#8B93A7]">Credit Limit</span>
                <span className="text-[#111111]">GHS {account.creditLimit.toLocaleString()}</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[13px] font-black">
                  <span className="text-[#8B93A7]">Used</span>
                  <span className="text-[#111111]">GHS {account.usedAmount.toLocaleString()} ({utilization.toFixed(0)}%)</span>
                </div>
                <div className="h-2.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${utilization}%` }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: barColor }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3 bg-[#F9FAFB] rounded-[20px] border border-[#ECEDEF]">
                  <div className="text-[11px] font-black text-[#8B93A7] uppercase tracking-wider">Available</div>
                  <div className="text-[14px] font-black text-[#111111] mt-0.5">GHS {(account.creditLimit - account.usedAmount).toLocaleString()}</div>
                </div>
                <div className="p-3 bg-[#F9FAFB] rounded-[20px] border border-[#ECEDEF]">
                  <div className="text-[11px] font-black text-[#8B93A7] uppercase tracking-wider">Next Due</div>
                  <div className="text-[14px] font-black text-[#111111] mt-0.5">GHS {account.nextRepaymentAmount.toLocaleString()}</div>
                </div>
              </div>

              {account.usedAmount > account.creditLimit * 0.85 && (
                <div className="flex items-center gap-2 p-3 bg-[#EF4444]/5 text-[#EF4444] rounded-[18px] border border-[#EF4444]/20">
                  <AlertCircle size={16} />
                  <span className="text-[12px] font-black uppercase tracking-wider">Utilisation High — Review Limit</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 mt-6">
              <button 
                onClick={() => toggleSuspension(account.id)}
                className={`flex-1 h-11 rounded-[16px] text-[13px] font-black transition-all ${
                  account.isSuspended 
                    ? 'bg-[#EF4444] text-white' 
                    : 'bg-[#F3F4F6] text-[#111111] hover:bg-[#E5E7EB]'
                }`}
              >
                {account.isSuspended ? 'Lift Suspension' : 'Suspend Credit'}
              </button>
              <button className="px-4 h-11 bg-[#111111] text-white rounded-[16px] text-[13px] font-black hover:bg-black transition-all">
                View History
              </button>
            </div>
          </div>
        );
      })}

      {/* Add Account Card */}
      <button className="border-2 border-dashed border-[#ECEDEF] rounded-[32px] p-8 flex flex-col items-center justify-center gap-4 hover:border-[#D40073] hover:bg-[#D40073]/5 group transition-all">
        <div className="w-14 h-14 rounded-full bg-[#111111] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
          <Icon icon="solar:add-circle-bold-duotone" className="text-[28px]" />
        </div>
        <div className="text-center">
          <div className="text-[16px] font-black text-[#111111]">Extend New Credit</div>
          <p className="text-[13px] font-medium text-[#8B93A7] mt-1">Assign limit and terms to a dealer.</p>
        </div>
      </button>
    </div>
  );
}
