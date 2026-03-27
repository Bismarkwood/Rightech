import React, { useState, useMemo } from 'react';
import { Icon } from '@iconify/react';
import { Search, Filter, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { usePayments } from '../context/PaymentContext';
import { Transaction } from '../../../core/data/mockPayments';

export function TransactionsTab() {
  const { transactions } = usePayments();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All Types');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return transactions.filter(tx => {
      const matchesSearch = tx.party.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           tx.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'All Types' || tx.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [transactions, searchTerm, filterType]);

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-[20px] border border-[#ECEDEF]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B93A7]" size={16} />
            <input 
              type="text" 
              placeholder="Search party or Reference..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 pl-10 pr-4 bg-[#F3F4F6] border-transparent rounded-[12px] text-[14px] focus:bg-white focus:border-[#D40073] outline-none transition-all w-[260px]"
            />
          </div>
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="h-10 px-4 bg-[#F3F4F6] border-transparent rounded-[12px] text-[14px] font-bold text-[#111111] focus:bg-white outline-none cursor-pointer"
          >
            <option>All Types</option>
            <option>Order Payment</option>
            <option>Supplier Payout</option>
            <option>Credit Extension</option>
            <option>Consignment Payment</option>
          </select>
        </div>

        <button className="h-10 px-4 flex items-center gap-2 bg-white border border-[#E4E7EC] rounded-[12px] text-[13px] font-bold text-[#111111] hover:bg-[#F3F4F6] transition-colors">
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-[24px] border border-[#ECEDEF] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#F1F3F5] bg-[#FAFBFC]">
              <th className="px-8 py-4 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Transaction ID</th>
              <th className="px-6 py-4 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Party / Type</th>
              <th className="px-6 py-4 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">Method</th>
              <th className="px-6 py-4 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider text-right">Amount</th>
              <th className="px-6 py-4 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider text-center">Status</th>
              <th className="px-8 py-4 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F3F5]">
            {filtered.map((tx) => (
              <React.Fragment key={tx.id}>
                <tr 
                  className={`hover:bg-[#FAFBFC] transition-colors cursor-pointer ${expandedId === tx.id ? 'bg-[#FAFBFC]' : ''}`}
                  onClick={() => setExpandedId(expandedId === tx.id ? null : tx.id)}
                >
                  <td className="px-8 py-5">
                    <div className="text-[14px] font-bold text-[#111111]">{tx.id}</div>
                    <div className="text-[12px] font-medium text-[#8B93A7] mt-1">
                      {new Date(tx.timestamp).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-[14px] font-bold text-[#111111]">{tx.party}</div>
                    <div className="text-[12px] font-medium text-[#525866] mt-1 flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${tx.direction === 'in' ? 'bg-[#16A34A]' : tx.direction === 'out' ? 'bg-[#EF4444]' : 'bg-[#2563EB]'}`} />
                      {tx.type}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-[14px] font-bold text-[#111111]">{tx.method}</div>
                    <div className="text-[12px] font-medium text-[#8B93A7] mt-1">{tx.reference || 'No ref'}</div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className={`text-[15px] font-black ${tx.direction === 'in' ? 'text-[#16A34A]' : tx.direction === 'out' ? 'text-[#EF4444]' : 'text-[#2563EB]'}`}>
                      {tx.direction === 'in' ? '+' : '-'}{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-[11px] font-bold text-[#8B93A7] uppercase mt-1">GHS</div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center">
                      <span className={`px-3 py-1 rounded-full text-[12px] font-bold ${
                        tx.status === 'Confirmed' ? 'bg-[#16A34A]/10 text-[#16A34A]' :
                        tx.status === 'Pending' ? 'bg-[#D97706]/10 text-[#D97706]' :
                        'bg-[#EF4444]/10 text-[#EF4444]'
                      }`}>
                        {tx.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    {expandedId === tx.id ? <ChevronUp size={18} className="text-[#8B93A7]" /> : <ChevronDown size={18} className="text-[#8B93A7]" />}
                  </td>
                </tr>
                {expandedId === tx.id && (
                  <tr>
                    <td colSpan={6} className="px-8 py-6 bg-[#FAFBFC] border-t border-[#ECEDEF]">
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        <div>
                          <div className="text-[11px] font-black text-[#8B93A7] uppercase tracking-wider mb-2">Recorded By</div>
                          <div className="text-[14px] font-bold text-[#111111]">{tx.recordedBy}</div>
                        </div>
                        <div>
                          <div className="text-[11px] font-black text-[#8B93A7] uppercase tracking-wider mb-2">Linked Entry</div>
                          <div className="text-[14px] font-bold text-[#D40073] hover:underline cursor-pointer">{tx.linkedId || 'Manual Entry'}</div>
                        </div>
                        <div className="col-span-2">
                          <div className="text-[11px] font-black text-[#8B93A7] uppercase tracking-wider mb-2">Notes</div>
                          <div className="text-[14px] font-medium text-[#525866]">{tx.notes || 'No additional notes provided for this transaction.'}</div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
