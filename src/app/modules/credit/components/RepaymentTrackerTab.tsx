import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Icon } from '@iconify/react';
import { useCredit } from '../context/CreditContext';
import { ArrowUpRight, ArrowDownLeft, FileText, Search, CreditCard, DollarSign } from 'lucide-react';

export function RepaymentTrackerTab() {
  const { accounts, transactions } = useCredit();
  const [selectedDealerId, setSelectedDealerId] = useState(accounts[0]?.dealerId || '');

  const filteredTransactions = transactions.filter(tx => tx.dealerId === selectedDealerId);
  const selectedAccount = accounts.find(acc => acc.dealerId === selectedDealerId);

  return (
    <div className="flex gap-8 h-[calc(100vh-280px)] pb-10">
      {/* Left Sidebar: Dealers */}
      <div className="w-80 bg-white rounded-[32px] border border-[#ECEDEF] flex flex-col overflow-hidden shrink-0">
        <div className="p-6 border-b border-[#ECEDEF]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B93A7]" size={18} />
            <input 
              type="text" 
              placeholder="Search dealers..." 
              className="w-full h-11 pl-10 pr-4 bg-[#F3F4F6] border-none rounded-[16px] text-[14px] font-medium focus:ring-2 focus:ring-[#D40073]/20 transition-all"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar p-2">
          {accounts.map(acc => (
            <button
              key={acc.id}
              onClick={() => setSelectedDealerId(acc.dealerId)}
              className={`w-full text-left p-4 rounded-[20px] transition-all flex items-center justify-between group ${
                selectedDealerId === acc.dealerId ? 'bg-[#111111] text-white' : 'hover:bg-[#F9FAFB]'
              }`}
            >
              <div>
                <div className="text-[14px] font-black">{acc.dealerName}</div>
                <div className={`text-[12px] font-bold mt-0.5 ${selectedDealerId === acc.dealerId ? 'text-white/60' : 'text-[#8B93A7]'}`}>
                  GHS {acc.usedAmount.toLocaleString()} balance
                </div>
              </div>
              <Icon 
                icon="solar:alt-arrow-right-linear" 
                className={`text-[18px] transition-transform ${selectedDealerId === acc.dealerId ? 'translate-x-1' : 'group-hover:translate-x-1'}`} 
              />
            </button>
          ))}
        </div>
      </div>

      {/* Right Content: Timeline */}
      <div className="flex-1 bg-white rounded-[32px] border border-[#ECEDEF] flex flex-col overflow-hidden">
        {selectedAccount ? (
          <>
            <div className="p-8 border-b border-[#ECEDEF] flex items-center justify-between">
              <div>
                <h3 className="text-[20px] font-black text-[#111111]">{selectedAccount.dealerName}</h3>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5 text-[13px] font-bold text-[#8B93A7]">
                    <CreditCard size={14} />
                    Limit: GHS {selectedAccount.creditLimit.toLocaleString()}
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ECEDEF]" />
                  <div className="flex items-center gap-1.5 text-[13px] font-bold text-[#D40073]">
                    <DollarSign size={14} />
                    Current Balance: GHS {selectedAccount.usedAmount.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-6 h-12 bg-[#F3F4F6] text-[#111111] rounded-[18px] text-[14px] font-black hover:bg-[#E5E7EB] transition-all">
                  <FileText size={18} />
                  Download Statement
                </button>
                <button className="flex items-center gap-2 px-6 h-12 bg-[#D40073] text-white rounded-[18px] text-[14px] font-black hover:bg-[#B3005F] transition-all">
                  Record Repayment
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
              <div className="space-y-8 relative before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-[2px] before:bg-[#F3F4F6]">
                {filteredTransactions.map((tx, idx) => (
                  <div key={tx.id} className="relative pl-12">
                    <div className={`absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.type === 'Extension' ? 'bg-[#EF4444] text-white' : 'bg-[#16A34A] text-white'
                    }`}>
                      {tx.type === 'Extension' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                    </div>
                    
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="text-[15px] font-black text-[#111111]">
                            {tx.type === 'Extension' ? 'Credit Extended' : 'Repayment Received'}
                          </span>
                          <span className="text-[12px] font-bold text-[#8B93A7]">{tx.date}</span>
                        </div>
                        <div className="text-[13px] font-medium text-[#525866] mt-1">
                          {tx.type === 'Extension' ? `Order #${tx.referenceId}` : `${tx.method} • Ref: ${tx.referenceId}`}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-[16px] font-black ${tx.type === 'Extension' ? 'text-[#EF4444]' : 'text-[#16A34A]'}`}>
                          {tx.type === 'Extension' ? '+' : '-'} GHS {tx.amount.toLocaleString()}
                        </div>
                        <div className="text-[12px] font-bold text-[#8B93A7] mt-1">
                          Balance: GHS {tx.balanceAfter.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 rounded-full bg-[#F3F4F6] flex items-center justify-center mb-4">
              <Icon icon="solar:user-block-linear" className="text-[40px] text-[#8B93A7]" />
            </div>
            <h3 className="text-[18px] font-black text-[#111111]">No account selected</h3>
            <p className="text-[14px] font-medium text-[#8B93A7] mt-2">Select a dealer from the left to view their credit history.</p>
          </div>
        )}
      </div>
    </div>
  );
}
