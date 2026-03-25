import React from 'react';
import { Search, Filter, MoreHorizontal, ShieldAlert, CheckCircle2, TrendingUp } from 'lucide-react';

const MOCK_CREDITS = [
  { id: 'CRD-102', customer: 'Westgate Builders', orderId: 'ORD-8990', amount: '14,500 GHS', settled: '0 GHS', balance: '14,500 GHS', dueDate: '15 Oct 2023', status: 'Active' },
  { id: 'CRD-098', customer: 'Kingsway Const.', orderId: 'ORD-8712', amount: '8,000 GHS', settled: '8,000 GHS', balance: '0 GHS', dueDate: '10 Sep 2023', status: 'Settled' },
  { id: 'CRD-095', customer: 'K.A Enterprise', orderId: 'ORD-8650', amount: '5,000 GHS', settled: '2,500 GHS', balance: '2,500 GHS', dueDate: '01 Oct 2023', status: 'Overdue' },
];

export function CreditTab() {
  return (
    <div className="space-y-6">
      {/* Alerts */}
      <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-[12px] p-4 flex items-start gap-3">
        <ShieldAlert size={20} className="text-[#DC2626] shrink-0 mt-0.5" />
        <div>
          <h4 className="text-[14px] font-bold text-[#DC2626]">Overdue Accounts</h4>
          <p className="text-[13px] text-[#991B1B] mt-0.5">K.A Enterprise is 4 days overdue on a balance of 2,500 GHS. Further credit paused.</p>
        </div>
      </div>

      <div className="bg-white rounded-[16px] border border-[#ECEDEF] flex flex-col min-h-[500px]">
        <div className="p-4 border-b border-[#ECEDEF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative group w-full sm:w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B93A7] group-focus-within:text-[#D40073] transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search credit accounts..." 
              className="w-full h-9 pl-9 pr-4 bg-[#F7F7F8] border border-transparent rounded-[8px] text-[13px] text-[#111111] placeholder:text-[#8B93A7] focus:outline-none focus:bg-white focus:border-[#D40073] transition-all"
            />
          </div>
          <button className="h-9 px-3 flex items-center gap-2 bg-[#F7F7F8] border border-transparent rounded-[8px] text-[13px] font-semibold text-[#111111] hover:bg-[#E4E7EC] transition-colors">
            <Filter size={14} />
            Status Filter
          </button>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F7F7F8] border-b border-[#ECEDEF]">
                <th className="py-3 px-5 text-[12px] font-bold text-[#525866] uppercase tracking-wider">Customer / Acc</th>
                <th className="py-3 px-5 text-[12px] font-bold text-[#525866] uppercase tracking-wider">Order ID</th>
                <th className="py-3 px-5 text-[12px] font-bold text-[#525866] uppercase tracking-wider">Credit Amount</th>
                <th className="py-3 px-5 text-[12px] font-bold text-[#525866] uppercase tracking-wider">Settled</th>
                <th className="py-3 px-5 text-[12px] font-bold text-[#525866] uppercase tracking-wider">Balance</th>
                <th className="py-3 px-5 text-[12px] font-bold text-[#525866] uppercase tracking-wider">Due Date</th>
                <th className="py-3 px-5 text-[12px] font-bold text-[#525866] uppercase tracking-wider">Status</th>
                <th className="py-3 px-5 text-[12px] font-bold text-[#525866] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[13px]">
              {MOCK_CREDITS.map((credit) => (
                <tr key={credit.id} className="border-b border-[#ECEDEF] last:border-0 hover:bg-[#FBFBFC] transition-colors cursor-pointer">
                  <td className="py-4 px-5">
                    <div className="font-bold text-[#111111]">{credit.customer}</div>
                    <div className="text-[12px] text-[#8B93A7] font-medium">{credit.id}</div>
                  </td>
                  <td className="py-4 px-5 font-semibold text-[#525866]">{credit.orderId}</td>
                  <td className="py-4 px-5 font-bold text-[#111111]">{credit.amount}</td>
                  <td className="py-4 px-5 font-medium text-[#16A34A]">{credit.settled}</td>
                  <td className="py-4 px-5 font-bold text-[#DC2626]">{credit.balance}</td>
                  <td className="py-4 px-5 font-medium text-[#525866]">{credit.dueDate}</td>
                  <td className="py-4 px-5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-[6px] text-[12px] font-bold ${
                      credit.status === 'Active' ? 'bg-[#EFF6FF] text-[#2563EB]' :
                      credit.status === 'Settled' ? 'bg-[#ECFDF3] text-[#16A34A]' :
                      'bg-[#FEF2F2] text-[#DC2626]'
                    }`}>
                      {credit.status}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <button className="w-8 h-8 inline-flex items-center justify-center text-[#8B93A7] hover:text-[#111111] hover:bg-[#F3F4F6] rounded-[8px] transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}