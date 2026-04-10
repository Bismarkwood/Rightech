import React from 'react';
import { motion } from 'motion/react';
import { Icon } from '@iconify/react';
import { usePayments } from '../context/PaymentContext';
import { Check, Settings2, Smartphone, Banknote, CreditCard, AlertCircle } from 'lucide-react';

export function PaymentMethodsTab() {
  const { paymentMethods, togglePaymentMethod } = usePayments();

  const categories = [
    { id: 'cash', label: 'Cash', icon: Banknote, description: 'Direct physical currency transactions. Always active for internal recording.' },
    { id: 'momo', label: 'Mobile Money', icon: Smartphone, description: 'Accept payments via MTN MoMo, Telecel Cash, and AirtelTigo.' },
    { id: 'credit', label: 'Store Credit', icon: CreditCard, description: 'Allow trusted dealers to purchase on credit terms.' },
  ];

  return (
    <div className="max-w-[1000px] mx-auto space-y-10 pb-20">
      
      {categories.map((cat) => (
        <section key={cat.id}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-[14px] bg-white border border-[#ECEDEF] flex items-center justify-center text-[#111111]">
              <cat.icon size={20} />
            </div>
            <div>
              <h3 className="text-[16px] font-black text-[#111111]">{cat.label}</h3>
              <p className="text-[13px] font-medium text-[#8B93A7]">{cat.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paymentMethods.filter(m => m.type === cat.id).map((method) => (
              <div 
                key={method.id} 
                className={`bg-white p-6 rounded-[24px] border transition-all duration-300 relative group ${
                  method.status === 'Active' ? 'border-[#ECEDEF] hover:border-[#D40073]/30' : 'border-[#ECEDEF] opacity-60 grayscale'
                }`}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 rounded-[16px] bg-[#FAFBFC] border border-[#ECEDEF] flex items-center justify-center text-[20px] font-black text-[#111111]">
                     {method.name.charAt(0)}
                  </div>
                  <button 
                    onClick={() => togglePaymentMethod(method.id)}
                    className={`w-12 h-6 rounded-full p-1 transition-all duration-300 relative ${
                      method.status === 'Active' ? 'bg-[#16A34A]' : 'bg-[#E4E7EC]'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                      method.status === 'Active' ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                <div className="mb-6">
                  <div className="text-[15px] font-bold text-[#111111] mb-1">{method.name}</div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${method.status === 'Active' ? 'bg-[#16A34A]' : 'bg-[#8B93A7]'}`} />
                    <span className="text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">{method.status}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-5 border-t border-[#F1F3F5]">
                  {method.merchantCode ? (
                    <div className="flex-1 text-[12px] font-medium text-[#525866]">
                      Merchant: <span className="font-bold text-[#111111]">{method.merchantCode}</span>
                    </div>
                  ) : (
                    <div className="flex-1 text-[12px] font-medium text-[#8B93A7]">System Default</div>
                  )}
                  <button className="p-2 text-[#8B93A7] hover:text-[#D40073] hover:bg-[#D40073]/5 rounded-lg transition-all">
                    <Settings2 size={16} />
                  </button>
                </div>
                
                {method.id === 'm5' && method.status === 'Inactive' && (
                  <div className="mt-4 p-3 bg-[#FEF2F2] rounded-[12px] flex items-start gap-2 border border-[#FEE2E2]">
                    <AlertCircle size={14} className="text-[#EF4444] mt-0.5" />
                    <p className="text-[11px] font-bold text-[#EF4444] leading-tight">Disabling Credit affects POS, Invoicing, and Dealer terms globally.</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

    </div>
  );
}
