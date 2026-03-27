import React from 'react';
import { Search, Filter, MoreHorizontal, Wallet, CheckCircle2, Clock } from 'lucide-react';

const MOCK_PAYMENTS = [
  { id: 'PAY-1102', orderId: 'ORD-8991', customer: 'K.A Enterprise', amount: '1,200 GHS', method: 'Mobile Money', status: 'Completed', date: 'Today, 10:35 AM' },
  { id: 'PAY-1101', orderId: 'ORD-8988', customer: 'Accra Mall Co.', amount: '8,900 GHS', method: 'Bank Transfer', status: 'Completed', date: 'Yesterday' },
  { id: 'PAY-1100', orderId: 'ORD-8985', customer: 'Westgate Builders', amount: '5,000 GHS', method: 'Cash', status: 'Pending', date: 'Yesterday' },
];

export function PaymentsTab() {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-[#ECEDEF] rounded-[16px] p-5">
          <p className="text-[13px] font-semibold text-[#525866] mb-1">Total Paid Today</p>
          <p className="text-[24px] font-bold text-[#111111]">1,200 GHS</p>
        </div>
        <div className="bg-white border border-[#ECEDEF] rounded-[16px] p-5">
          <p className="text-[13px] font-semibold text-[#525866] mb-1">Outstanding Retail Payments</p>
          <p className="text-[24px] font-bold text-[#DC2626]">450 GHS</p>
        </div>
        <div className="bg-white border border-[#ECEDEF] rounded-[16px] p-5">
          <p className="text-[13px] font-semibold text-[#525866] mb-1">Credit Awaiting Settlement</p>
          <p className="text-[24px] font-bold text-[#D97706]">14,500 GHS</p>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-[16px] border border-[#ECEDEF] flex flex-col min-h-[500px]">
        <div className="p-4 border-b border-[#ECEDEF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative group w-full sm:w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B93A7] group-focus-within:text-[#D40073] transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search payments..." 
              className="w-full h-9 pl-9 pr-4 bg-[#F7F7F8] border border-transparent rounded-[8px] text-[13px] text-[#111111] placeholder:text-[#8B93A7] focus:outline-none focus:bg-white focus:border-[#D40073] transition-all"
            />
          </div>
          <button className="h-9 px-3 flex items-center gap-2 bg-[#F7F7F8] border border-transparent rounded-[8px] text-[13px] font-semibold text-[#111111] hover:bg-[#E4E7EC] transition-colors">
            <Filter size={14} />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F7F7F8] border-b border-[#ECEDEF]">
                <th className="py-3 px-5 text-[12px] font-bold text-[#525866] uppercase tracking-wider">Payment ID / Order</th>
                <th className="py-3 px-5 text-[12px] font-bold text-[#525866] uppercase tracking-wider">Customer</th>
                <th className="py-3 px-5 text-[12px] font-bold text-[#525866] uppercase tracking-wider">Amount</th>
                <th className="py-3 px-5 text-[12px] font-bold text-[#525866] uppercase tracking-wider">Method</th>
                <th className="py-3 px-5 text-[12px] font-bold text-[#525866] uppercase tracking-wider">Status</th>
                <th className="py-3 px-5 text-[12px] font-bold text-[#525866] uppercase tracking-wider">Date</th>
                <th className="py-3 px-5 text-[12px] font-bold text-[#525866] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[13px]">
              {MOCK_PAYMENTS.map((payment) => (
                <tr key={payment.id} className="border-b border-[#ECEDEF] last:border-0 hover:bg-[#FBFBFC] transition-colors cursor-pointer">
                  <td className="py-4 px-5">
                    <div className="font-bold text-[#111111]">{payment.id}</div>
                    <div className="text-[12px] text-[#8B93A7] font-medium">{payment.orderId}</div>
                  </td>
                  <td className="py-4 px-5 font-semibold text-[#111111]">{payment.customer}</td>
                  <td className="py-4 px-5 font-bold text-[#111111]">{payment.amount}</td>
                  <td className="py-4 px-5 text-[#525866] font-medium">{payment.method}</td>
                  <td className="py-4 px-5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[12px] font-bold ${
                      payment.status === 'Completed' ? 'bg-[#ECFDF3] text-[#16A34A]' : 'bg-[#FFF7ED] text-[#D97706]'
                    }`}>
                      {payment.status === 'Completed' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                      {payment.status}
                    </span>
                  </td>
                  <td className="py-4 px-5 font-medium text-[#525866]">{payment.date}</td>
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