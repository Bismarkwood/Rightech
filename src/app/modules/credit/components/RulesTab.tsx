import React from 'react';
import { motion } from 'motion/react';
import { Icon } from '@iconify/react';
import { useCredit } from '../context/CreditContext';
import { Info, Bell, Shield, Scale } from 'lucide-react';

export function RulesTab() {
  const { weights, updateWeights } = useCredit();

  // Helper to handle weight changes ensuring sum to 100
  // (Simplified for mock: just update one, in real use we'd redistribute)
  const handleWeightChange = (key: string, val: number) => {
    // This is just a mock UI, logic for redistribution would go here
    updateWeights({ ...weights, [key]: val });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
      <div className="lg:col-span-2 space-y-8">
        {/* Scoring Weights */}
        <div className="bg-white p-8 rounded-[32px] border border-[#ECEDEF]">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-[#D40073]/10 text-[#D40073] rounded-[14px]">
              <Scale size={24} />
            </div>
            <div>
              <h3 className="text-[18px] font-black text-[#111111]">Scoring Weights</h3>
              <p className="text-[13px] font-medium text-[#8B93A7]">Define how much each factor influences the final rating.</p>
            </div>
          </div>

          <div className="space-y-8">
            {[
              { id: 'onTimeRepayments', label: 'On-time Repayments', val: weights.onTimeRepayments },
              { id: 'repaymentFrequency', label: 'Repayment Frequency', val: weights.repaymentFrequency },
              { id: 'utilization', label: 'Credit Utilisation', val: weights.utilization },
              { id: 'accountAge', label: 'Account Age', val: weights.accountAge },
              { id: 'overdueIncidents', label: 'Overdue Incidents', val: weights.overdueIncidents }
            ].map((s) => (
              <div key={s.id} className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[15px] font-black text-[#111111]">{s.label}</span>
                  <div className="px-4 py-1.5 bg-[#F3F4F6] rounded-[10px] text-[14px] font-black text-[#111111]">{s.val}%</div>
                </div>
                <div className="relative h-2 bg-[#F3F4F6] rounded-full">
                  <div className="absolute inset-0 bg-[#D40073]/5 rounded-full" />
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={s.val}
                    onChange={(e) => handleWeightChange(s.id, parseInt(e.target.value))}
                    className="absolute inset-0 w-full h-2 bg-transparent appearance-none cursor-pointer accent-[#D40073] z-10"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-[#ECEDEF] flex items-center justify-between">
             <div className="text-[14px] font-bold text-[#8B93A7]">Weights must total 100%</div>
             <button className="px-6 py-3 bg-[#111111] text-white rounded-[16px] text-[14px] font-black hover:opacity-90 transition-all">
               Save System Settings
             </button>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Automatic Actions */}
        <div className="bg-white p-8 rounded-[32px] border border-[#ECEDEF]">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-[#2563EB]/10 text-[#2563EB] rounded-[12px]">
              <Shield size={20} />
            </div>
            <h3 className="text-[16px] font-black text-[#111111]">Automatic Actions</h3>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Block credit if score < 40', checked: true },
              { label: 'Notify Finance if score < 55', checked: true },
              { label: 'Auto-suspend if 30 days overdue', checked: true },
              { label: 'Flag for legal if 90 days overdue', checked: false }
            ].map((action) => (
              <label key={action.label} className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-[20px] cursor-pointer group hover:bg-[#F3F4F6] transition-all">
                <span className="text-[13px] font-black text-[#525866] group-hover:text-[#111111]">{action.label}</span>
                <div className={`w-12 h-6 rounded-full relative transition-all ${action.checked ? 'bg-[#16A34A]' : 'bg-[#E5E7EB]'}`}>
                   <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${action.checked ? 'left-7' : 'left-1'}`} />
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Recalculation Schedule */}
        <div className="bg-white p-8 rounded-[32px] border border-[#ECEDEF]">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-[#16A34A]/10 text-[#16A34A] rounded-[12px]">
              <Bell size={20} />
            </div>
            <h3 className="text-[16px] font-black text-[#111111]">Recalculation</h3>
          </div>

          <div className="space-y-2">
            {['Real-time (Recommended)', 'Daily at Midnight', 'Weekly on Monday'].map((opt, i) => (
              <button key={opt} className={`w-full text-left p-4 rounded-[20px] border transition-all ${
                i === 0 ? 'border-[#111111] bg-[#111111] text-white' : 'border-[#ECEDEF] bg-white text-[#525866] hover:border-[#111111]'
              }`}>
                <div className="text-[14px] font-black">{opt}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
