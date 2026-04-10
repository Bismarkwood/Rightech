import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Icon } from '@iconify/react';
import { Check, ChevronRight, X } from 'lucide-react';

interface DealerWorkflowContextType {
  openCreateDealer: () => void;
}

const DealerWorkflowContext = createContext<DealerWorkflowContextType | undefined>(undefined);

const STEPS = ['Business Info', 'Contact Details', 'Credit Setup'];

const REGIONS = ['Accra', 'Kumasi', 'Takoradi', 'Cape Coast', 'Tamale', 'Sunyani', 'Ho', 'Koforidua'];
const BUSINESS_TYPES = ['Retailer', 'Wholesaler', 'Distributor', 'Agent', 'Other'];

const InputField = ({ label, placeholder, type = 'text', value, onChange, icon }: any) => (
  <div>
    <label className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider mb-1.5 block">{label}</label>
    <div className="relative">
      {icon && (
        <Icon icon={icon} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B93A7] text-[18px] pointer-events-none" />
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full h-[44px] ${icon ? 'pl-10' : 'pl-4'} pr-4 border border-[#E4E7EC] rounded-[10px] text-[14px] font-medium text-[#111111] placeholder:text-[#C4C9D4] focus:outline-none focus:ring-[3px] focus:ring-[rgba(212,0,115,0.1)] focus:border-[#D40073] transition-all bg-white`}
      />
    </div>
  </div>
);

const SelectField = ({ label, value, onChange, options, icon }: any) => (
  <div>
    <label className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider mb-1.5 block">{label}</label>
    <div className="relative">
      {icon && (
        <Icon icon={icon} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B93A7] text-[18px] pointer-events-none z-10" />
      )}
      <select
        value={value}
        onChange={onChange}
        className={`w-full h-[44px] ${icon ? 'pl-10' : 'pl-4'} pr-10 border border-[#E4E7EC] rounded-[10px] text-[14px] font-medium text-[#111111] focus:outline-none focus:ring-[3px] focus:ring-[rgba(212,0,115,0.1)] focus:border-[#D40073] transition-all bg-white appearance-none cursor-pointer`}
      >
        <option value="">Select...</option>
        {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
      </select>
      <Icon icon="solar:alt-arrow-down-linear" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B93A7] pointer-events-none" />
    </div>
  </div>
);

export function DealerWorkflowProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    name: '', businessType: '', region: '', taxId: '',
    phone: '', email: '', address: '',
    creditLimit: '', paymentTerms: '', riskBand: '',
  });

  const setField = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const openCreateDealer = () => {
    setStep(0);
    setForm({ name: '', businessType: '', region: '', taxId: '', phone: '', email: '', address: '', creditLimit: '', paymentTerms: '', riskBand: '' });
    setIsOpen(true);
  };

  const handleNext = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const handleBack = () => setStep(s => Math.max(s - 1, 0));

  const handleSubmit = () => {
    setIsOpen(false);
    const dealerName = form.name || 'New Dealer';
    setToast(dealerName);
    setTimeout(() => setToast(null), 5000);
  };

  const canProceedStep0 = form.name.trim() && form.businessType && form.region;
  const canProceedStep1 = form.phone.trim() && form.email.trim();

  return (
    <DealerWorkflowContext.Provider value={{ openCreateDealer }}>
      {children}

      {/* Create Dealer Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-[6px]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ type: 'spring', duration: 0.4, bounce: 0.18 }}
              className="relative w-full max-w-[520px] bg-white rounded-[24px] overflow-hidden z-10 flex flex-col max-h-[92vh]"
            >
              {/* Header */}
              <div className="relative px-7 pt-7 pb-6 bg-[#111111] text-white overflow-hidden shrink-0">
                <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-[#D40073] opacity-20 blur-[50px] pointer-events-none" />
                <div className="relative flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-[12px] bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center">
                      <Icon icon="solar:user-plus-bold" className="text-[22px] text-[#D40073]" />
                    </div>
                    <div>
                      <h2 className="text-[20px] font-bold leading-tight">Create Dealer</h2>
                      <p className="text-[13px] text-[rgba(255,255,255,0.5)] font-medium mt-0.5">Register a new business partner</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[rgba(255,255,255,0.5)] hover:bg-[rgba(255,255,255,0.1)] transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Step Indicators */}
                <div className="flex items-center gap-2">
                  {STEPS.map((label, i) => (
                    <React.Fragment key={i}>
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 transition-all ${
                          i < step ? 'bg-[#16A34A] text-white' :
                          i === step ? 'bg-[#D40073] text-white' :
                          'bg-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.4)]'
                        }`}>
                          {i < step ? <Check size={13} strokeWidth={3} /> : i + 1}
                        </div>
                        <span className={`text-[12px] font-semibold transition-colors ${i === step ? 'text-white' : 'text-[rgba(255,255,255,0.4)]'}`}>
                          {label}
                        </span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className={`flex-1 h-[2px] rounded-full transition-colors ${i < step ? 'bg-[#16A34A]' : 'bg-[rgba(255,255,255,0.15)]'}`} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-7 bg-[#F7F7F8]">
                <AnimatePresence mode="wait">
                  {step === 0 && (
                    <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="space-y-4">
                      <div className="p-5 bg-white rounded-[16px] border border-[#ECEDEF] space-y-4">
                        <h3 className="text-[13px] font-bold text-[#111111] flex items-center gap-2">
                          <Icon icon="solar:buildings-linear" className="text-[#D40073]" /> Business Information
                        </h3>
                        <InputField label="Business Name" placeholder="e.g. Kofi Tech Distributors" value={form.name} onChange={setField('name')} icon="solar:user-linear" />
                        <div className="grid grid-cols-2 gap-3">
                          <SelectField label="Business Type" value={form.businessType} onChange={setField('businessType')} options={BUSINESS_TYPES} icon="solar:buildings-2-linear" />
                          <SelectField label="Region" value={form.region} onChange={setField('region')} options={REGIONS} icon="solar:map-point-linear" />
                        </div>
                        <InputField label="Tax ID / GhanaCard No." placeholder="e.g. C0012345678" value={form.taxId} onChange={setField('taxId')} icon="solar:document-linear" />
                      </div>
                    </motion.div>
                  )}

                  {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="space-y-4">
                      <div className="p-5 bg-white rounded-[16px] border border-[#ECEDEF] space-y-4">
                        <h3 className="text-[13px] font-bold text-[#111111] flex items-center gap-2">
                          <Icon icon="solar:phone-linear" className="text-[#2563EB]" /> Contact Details
                        </h3>
                        <InputField label="Phone Number" placeholder="e.g. 0244 000 000" type="tel" value={form.phone} onChange={setField('phone')} icon="solar:phone-linear" />
                        <InputField label="Email Address" placeholder="e.g. dealer@company.com" type="email" value={form.email} onChange={setField('email')} icon="solar:letter-linear" />
                        <InputField label="Business Address" placeholder="e.g. 12 Accra Mall Road, Accra" value={form.address} onChange={setField('address')} icon="solar:map-point-linear" />
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="space-y-4">
                      <div className="p-5 bg-white rounded-[16px] border border-[#ECEDEF] space-y-4">
                        <h3 className="text-[13px] font-bold text-[#111111] flex items-center gap-2">
                          <Icon icon="solar:card-linear" className="text-[#16A34A]" /> Credit & Payment Setup
                        </h3>
                        <InputField label="Initial Credit Limit (GHS)" placeholder="e.g. 50000" type="number" value={form.creditLimit} onChange={setField('creditLimit')} icon="solar:wallet-linear" />
                        <SelectField label="Payment Terms" value={form.paymentTerms} onChange={setField('paymentTerms')} options={['Cash Only', 'Net 7', 'Net 15', 'Net 30', 'Consignment']} icon="solar:calendar-linear" />
                        <SelectField label="Initial Risk Band" value={form.riskBand} onChange={setField('riskBand')} options={['Platinum', 'Gold', 'Silver', 'Bronze']} icon="solar:shield-check-linear" />
                      </div>

                      {/* Summary Preview */}
                      <div className="p-4 bg-white rounded-[16px] border border-[#ECEDEF]">
                        <h3 className="text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider mb-3">Summary</h3>
                        <div className="space-y-2">
                          {[
                            { label: 'Business', value: form.name || '—' },
                            { label: 'Region', value: form.region || '—' },
                            { label: 'Contact', value: form.phone || '—' },
                            { label: 'Credit Limit', value: form.creditLimit ? `GHS ${Number(form.creditLimit).toLocaleString()}` : '—' },
                          ].map(row => (
                            <div key={row.label} className="flex justify-between text-[13px]">
                              <span className="text-[#8B93A7] font-medium">{row.label}</span>
                              <span className="font-semibold text-[#111111]">{row.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="px-7 py-5 border-t border-[#ECEDEF] bg-white flex items-center justify-between shrink-0">
                <button
                  onClick={step === 0 ? () => setIsOpen(false) : handleBack}
                  className="h-[44px] px-5 bg-[#F3F4F6] hover:bg-[#E4E7EC] rounded-[10px] text-[14px] font-bold text-[#111111] transition-colors"
                >
                  {step === 0 ? 'Cancel' : 'Back'}
                </button>

                {step < STEPS.length - 1 ? (
                  <button
                    onClick={handleNext}
                    disabled={step === 0 ? !canProceedStep0 : !canProceedStep1}
                    className="h-[44px] px-6 bg-[#111111] hover:bg-[#333333] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-[10px] text-[14px] font-bold flex items-center gap-2 transition-colors"
                  >
                    Next <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="h-[44px] px-6 bg-[#D40073] hover:bg-[#B80063] text-white rounded-[10px] text-[14px] font-bold flex items-center gap-2 transition-all"
                  >
                    <Check size={16} strokeWidth={2.5} />
                    Create Dealer
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-[300] w-[360px] bg-white rounded-[16px] border border-[#ECEDEF] p-4 flex gap-4 pointer-events-auto"
          >
            <div className="w-10 h-10 rounded-full bg-[#16A34A] text-white flex items-center justify-center shrink-0">
              <Check size={20} className="stroke-[3]" />
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="text-[14px] font-black text-[#111111] mb-1">Dealer created successfully</div>
              <div className="text-[13px] font-medium text-[#525866] leading-tight">{toast} has been registered as a business partner.</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </DealerWorkflowContext.Provider>
  );
}

export const useDealerWorkflow = () => {
  const context = useContext(DealerWorkflowContext);
  if (context === undefined) {
    throw new Error('useDealerWorkflow must be used within a DealerWorkflowProvider');
  }
  return context;
};
