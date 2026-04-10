import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from '@iconify/react';
import { useCredit } from '../context/CreditContext';
import { CreditAccount } from '../../../core/data/creditData';
import { X, ShieldCheck, TrendingUp, TrendingDown, Info, ExternalLink, History } from 'lucide-react';

export function RatingsTab() {
  const { accounts } = useCredit();
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  const selectedAccount = accounts.find(acc => acc.id === selectedAccountId);

  return (
    <div className="relative pb-20">
      <div className="bg-white dark:bg-[#151B2B] rounded-[22px] border border-[#ECEDEF] dark:border-white/10 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#F9FAFB] dark:bg-white/5 border-b border-[#ECEDEF] dark:border-white/5">
              <th className="px-6 py-4 text-[12px] font-black uppercase tracking-widest text-[#8B93A7]">Dealer Entity</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase tracking-widest text-[#8B93A7]">Credit Score</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase tracking-widest text-[#8B93A7]">Risk Band</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase tracking-widest text-[#8B93A7]">Trend</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase tracking-widest text-[#8B93A7]">Last Calculated</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase tracking-widest text-right text-[#8B93A7]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ECEDEF] dark:divide-white/5">
            {accounts.map((acc) => (
              <tr 
                key={acc.id} 
                onClick={() => setSelectedAccountId(acc.id)}
                className="hover:bg-[#FBFBFC] dark:hover:bg-white/5 transition-all group cursor-pointer"
              >
                <td className="px-6 py-4">
                  <p className="text-[14px] font-black text-[#111111] dark:text-white group-hover:text-[#D40073] transition-colors">{acc.dealerName}</p>
                  <p className="text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider mt-1">{acc.dealerId}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[16px] font-black text-[#111111] dark:text-white tracking-tight">{acc.score}</span>
                    <div className="flex-1 h-1.5 w-20 bg-[#F3F4F6] dark:bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-[#111111] dark:bg-white rounded-full transition-all" style={{ width: `${acc.score / 10}%` }} />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-[6px] text-[11px] font-black uppercase tracking-wider border shadow-sm ${
                    acc.band === 'Excellent' ? 'bg-[#ECFDF5] dark:bg-[#064E3B]/30 text-[#16A34A] border-[#16A34A]/10' :
                    acc.band === 'Good' ? 'bg-[#EFF6FF] dark:bg-[#1E3A8A]/30 text-[#2563EB] border-[#2563EB]/10' :
                    acc.band === 'Fair' ? 'bg-[#FFF7ED] dark:bg-[#78350F]/30 text-[#D97706] border-[#D97706]/10' :
                    'bg-[#FEF2F2] dark:bg-[#7F1D1D]/30 text-[#DC2626] border-[#DC2626]/10'
                  }`}>
                    {acc.band}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    {acc.trend === 'up' ? (
                      <><Icon icon="solar:round-arrow-right-up-bold" className="text-[#16A34A]" /><span className="text-[12px] font-black text-[#16A34A] uppercase tracking-wider">Rising</span></>
                    ) : acc.trend === 'down' ? (
                      <><Icon icon="solar:round-arrow-right-down-bold" className="text-[#DC2626]" /><span className="text-[12px] font-black text-[#DC2626] uppercase tracking-wider">Falling</span></>
                    ) : (
                      <span className="text-[12px] font-black text-[#8B93A7] uppercase tracking-wider">Stable</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-[13px] font-bold text-[#8B93A7] uppercase tracking-tighter">
                  {new Date(acc.lastRecalculated).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button className="w-9 h-9 rounded-[10px] bg-white dark:bg-white/5 border border-[#ECEDEF] dark:border-white/10 flex items-center justify-center text-[#8B93A7] hover:bg-[#F3F4F6] dark:hover:bg-white/10 hover:text-[#D40073] transition-all shadow-sm">
                      <Icon icon="solar:info-circle-bold" className="text-[18px]" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <RatingDetailDrawer 
        account={selectedAccount || null} 
        onClose={() => setSelectedAccountId(null)} 
      />
    </div>
  );
}

function RatingDetailDrawer({ account, onClose }: { account: CreditAccount | null, onClose: () => void }) {
  if (!account) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 pointer-events-none">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto"
        />
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute right-0 top-0 bottom-0 w-[480px] bg-white border-l border-[#ECEDEF] pointer-events-auto flex flex-col"
        >
          <div className="p-8 border-b border-[#ECEDEF] flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-[18px] bg-[#111111] text-white flex items-center justify-center font-black text-[20px]">
                 {account.score}
               </div>
               <div>
                  <h3 className="text-[18px] font-black text-[#111111]">{account.dealerName}</h3>
                  <p className="text-[13px] font-bold text-[#8B93A7]">Credit Rating Details</p>
               </div>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-[#F3F4F6] flex items-center justify-center transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 no-scrollbar space-y-8">
            {/* Score Band Info */}
            <div className={`p-6 rounded-[24px] border border-transparent flex items-start gap-4 ${
              account.band === 'Excellent' ? 'bg-[#16A34A]/5 border-[#16A34A]/20' :
              account.band === 'Good' ? 'bg-[#2563EB]/5 border-[#2563EB]/20' :
              account.band === 'Fair' ? 'bg-[#D97706]/5 border-[#D97706]/20' :
              'bg-[#EF4444]/5 border-[#EF4444]/20'
            }`}>
              <ShieldCheck className={
                account.band === 'Excellent' ? 'text-[#16A34A]' :
                account.band === 'Good' ? 'text-[#2563EB]' :
                account.band === 'Fair' ? 'text-[#D97706]' :
                'text-[#EF4444]'
              } size={24} />
              <div>
                <div className="text-[15px] font-black text-[#111111] uppercase tracking-wider">{account.band} Rating</div>
                <p className="text-[13px] font-medium text-[#525866] mt-1">
                  Based on repayment behavior and credit history. {account.band === 'Poor' ? 'Credit access is currently suspended.' : 'Full credit terms available.'}
                </p>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="space-y-6">
               <h4 className="text-[14px] font-black text-[#111111] uppercase tracking-widest">Score Breakdown</h4>
               {[
                 { label: 'On-time Repayments', score: 38, max: 40, weight: 40 },
                 { label: 'Repayment Frequency', score: 18, max: 25, weight: 25 },
                 { label: 'Credit Utilisation', score: 12, max: 20, weight: 20 },
                 { label: 'Account Age', score: 6, max: 10, weight: 10 },
                 { label: 'Overdue Incidents', score: 0, max: 5, weight: 5 }
               ].map((factor) => (
                 <div key={factor.label} className="space-y-2">
                    <div className="flex justify-between text-[13px] font-black">
                       <span className="text-[#525866]">{factor.label}</span>
                       <span className="text-[#111111]">{factor.score} / {factor.max} pts</span>
                    </div>
                    <div className="h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${(factor.score / factor.max) * 100}%` }}
                         className="h-full bg-[#111111] rounded-full"
                       />
                    </div>
                 </div>
               ))}
            </div>

            {/* Score History placeholder */}
            <div className="space-y-6 pt-4 border-top border-[#ECEDEF]">
               <h4 className="text-[14px] font-black text-[#111111] uppercase tracking-widest flex items-center gap-2">
                 <History size={16} />
                 Score History
               </h4>
               <div className="space-y-3">
                  {[
                    { month: 'Mar 2026', score: account.score, change: account.trend === 'up' ? '+3' : '0' },
                    { month: 'Feb 2026', score: Math.max(0, account.score - 3), change: '+2' },
                    { month: 'Jan 2026', score: Math.max(0, account.score - 5), change: '0' }
                  ].map((h) => (
                    <div key={h.month} className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-[18px]">
                       <span className="text-[14px] font-bold text-[#525866]">{h.month}</span>
                       <div className="flex items-center gap-3 font-black">
                          <span className="text-[#111111]">{h.score}</span>
                          <span className={h.change.startsWith('+') ? 'text-[#16A34A]' : 'text-[#8B93A7]'}>{h.change}</span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          <div className="p-8 border-t border-[#ECEDEF]">
             <button className="w-full h-12 bg-white border border-[#ECEDEF] text-[#111111] rounded-[18px] text-[14px] font-black hover:bg-[#F9FAFB] transition-all flex items-center justify-center gap-2">
               Manual Override
               <Info size={16} />
             </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
