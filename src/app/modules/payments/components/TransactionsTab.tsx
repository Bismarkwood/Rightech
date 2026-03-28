import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { Search, Download } from 'lucide-react';
import { usePayments } from '../context/PaymentContext';

const ROW_HEIGHT = 80; // Fixed height for virtualisation
const VIEWPORT_HEIGHT = 600; // Estimated height for clipping
const BUFFER = 5;

export function TransactionsTab() {
  const { transactions, setSelectedTransactionId } = usePayments();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All Types');
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const filtered = useMemo(() => {
    return transactions.filter(tx => {
      const matchesSearch = tx.party.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           tx.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'All Types' || tx.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [transactions, searchTerm, filterType]);

  // Virtualisation logic
  const totalHeight = filtered.length * ROW_HEIGHT;
  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER);
  const endIndex = Math.min(filtered.length - 1, Math.floor((scrollTop + VIEWPORT_HEIGHT) / ROW_HEIGHT) + BUFFER);
  
  const visibleItems = useMemo(() => {
    return filtered.slice(startIndex, endIndex + 1).map((tx, index) => ({
      ...tx,
      virtualIndex: startIndex + index
    }));
  }, [filtered, startIndex, endIndex]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

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

      {/* Ledger Table Container */}
      <div className="bg-white rounded-[24px] border border-[#ECEDEF] overflow-hidden flex flex-col h-[600px]">
        {/* Sticky Header */}
        <table className="w-full text-left border-separate border-spacing-0">
          <thead>
            <tr className="bg-[#FAFBFC] border-b border-[#F1F3F5]">
              <th className="px-8 py-4 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider w-[20%]">Transaction ID</th>
              <th className="px-6 py-4 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider w-[30%]">Party / Type</th>
              <th className="px-6 py-4 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider w-[20%]">Method</th>
              <th className="px-6 py-4 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider text-right w-[15%]">Amount</th>
              <th className="px-6 py-4 text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider text-center w-[15%]">Status</th>
            </tr>
          </thead>
        </table>

        {/* Scrollable Body */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto custom-scrollbar relative"
        >
          {/* Virtual Spacer */}
          <div style={{ height: `${totalHeight}px`, position: 'relative', width: '100%' }}>
            {visibleItems.map((tx) => (
              <div
                key={tx.id}
                onClick={() => setSelectedTransactionId(tx.id)}
                className="absolute left-0 right-0 border-b border-[#F1F3F5] hover:bg-[#FAFBFC] transition-colors cursor-pointer flex items-center"
                style={{ 
                  height: `${ROW_HEIGHT}px`, 
                  transform: `translateY(${tx.virtualIndex * ROW_HEIGHT}px)` 
                }}
              >
                <div className="px-8 w-[20%]">
                  <div className="text-[14px] font-bold text-[#111111]">{tx.id}</div>
                  <div className="text-[12px] font-medium text-[#8B93A7] mt-1">
                    {new Date(tx.timestamp).toLocaleDateString()}
                  </div>
                </div>
                <div className="px-6 w-[30%]">
                  <div className="text-[14px] font-bold text-[#111111] truncate">{tx.party}</div>
                  <div className="text-[12px] font-medium text-[#525866] mt-1 flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${tx.direction === 'in' ? 'bg-[#16A34A]' : tx.direction === 'out' ? 'bg-[#EF4444]' : 'bg-[#2563EB]'}`} />
                    {tx.type}
                  </div>
                </div>
                <div className="px-6 w-[20%]">
                  <div className="text-[14px] font-bold text-[#111111]">{tx.method}</div>
                  <div className="text-[12px] font-medium text-[#8B93A7] mt-1 truncate">{tx.reference || 'No ref'}</div>
                </div>
                <div className="px-6 w-[15%] text-right">
                  <div className={`text-[15px] font-black ${tx.direction === 'in' ? 'text-[#16A34A]' : tx.direction === 'out' ? 'text-[#EF4444]' : 'text-[#2563EB]'}`}>
                    {tx.direction === 'in' ? '+' : '-'}{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[11px] font-bold text-[#8B93A7] uppercase mt-1">GHS</div>
                </div>
                <div className="px-6 w-[15%]">
                  <div className="flex justify-center">
                    <span className={`px-3 py-1 rounded-full text-[12px] font-bold ${
                      tx.status === 'Confirmed' ? 'bg-[#16A34A]/10 text-[#16A34A]' :
                      tx.status === 'Pending' ? 'bg-[#D97706]/10 text-[#D97706]' :
                      'bg-[#EF4444]/10 text-[#EF4444]'
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#8B93A7] mb-4">
                <Icon icon="solar:bill-list-broken" className="text-[32px]" />
              </div>
              <h3 className="text-[18px] font-bold text-[#111111]">No transactions found</h3>
              <p className="text-[14px] text-[#525866] mt-1">Try adjusting your filters or search term.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
