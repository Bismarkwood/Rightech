import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, X, ArrowLeft, Package, CheckCircle2, ArrowRight, ChevronDown, Check } from 'lucide-react';
import { Icon } from '@iconify/react';
import * as Select from '@radix-ui/react-select';
import { useNavigate } from 'react-router';

// Abstract dark magenta/pink background image
const IMG_ABSTRACT = "https://images.unsplash.com/photo-1710755138489-022101f89cd9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwYWJzdHJhY3QlMjBtb2Rlcm4lMjBnbG93aW5nJTIwbWFnZW50YSUyMDNkJTIwcmVuZGVyfGVufDF8fHx8MTc3NDQ0MDM4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

// Premium Input Component
const Input = ({ label, id, helperText, ...props }: any) => (
  <div className="space-y-2">
    <label htmlFor={id} className="block text-[14px] font-medium text-[#111827]">
      {label}
    </label>
    <div className="relative">
      <input
        id={id}
        className="w-full h-[52px] px-4 bg-white border border-[#E5E7EB] rounded-xl text-[15px] text-[#111827] placeholder:text-[#98A2B3] focus:outline-none focus:border-[#D40073] focus:ring-[4px] focus:ring-[rgba(212,0,115,0.10)] transition-all duration-200"
        {...props}
      />
    </div>
    {helperText && <p className="text-[13px] text-[#667085] mt-1">{helperText}</p>}
  </div>
);

// Password Input Component
const PasswordInput = ({ label, id, ...props }: any) => {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-[14px] font-medium text-[#111827]">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          className="w-full h-[52px] pl-4 pr-12 bg-white border border-[#E5E7EB] rounded-xl text-[15px] text-[#111827] placeholder:text-[#98A2B3] focus:outline-none focus:border-[#D40073] focus:ring-[4px] focus:ring-[rgba(212,0,115,0.10)] transition-all duration-200"
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#98A2B3] hover:text-[#667085] transition-colors focus:outline-none"
        >
          {show ? <EyeOff size={20} strokeWidth={2} /> : <Eye size={20} strokeWidth={2} />}
        </button>
      </div>
    </div>
  );
};

// Premium Select Component
const PremiumSelect = ({ label, placeholder, options, value, onChange, helperText }: any) => (
  <div className="space-y-2">
    <label className="block text-[14px] font-medium text-[#111827]">{label}</label>
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger className="w-full h-[52px] px-4 bg-white border border-[#E5E7EB] rounded-xl text-[15px] text-left text-[#111827] focus:outline-none focus:border-[#D40073] focus:ring-[4px] focus:ring-[rgba(212,0,115,0.10)] transition-all duration-200 flex items-center justify-between group data-[placeholder]:text-[#98A2B3]">
        <Select.Value placeholder={placeholder} />
        <Select.Icon>
          <ChevronDown size={18} className="text-[#98A2B3] group-hover:text-[#667085] transition-colors" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="overflow-hidden bg-white rounded-xl border border-[#E5E7EB] z-50 animate-in fade-in zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2">
          <Select.ScrollUpButton className="flex items-center justify-center h-8 bg-white text-[#667085] cursor-default">
            <ChevronDown size={16} className="rotate-180" />
          </Select.ScrollUpButton>
          <Select.Viewport className="p-2">
            {options.map((option: string) => (
              <Select.Item key={option} value={option} className="text-[15px] text-[#111827] rounded-lg flex items-center px-8 py-3 relative select-none data-[highlighted]:bg-[#F9FAFB] data-[highlighted]:text-[#D40073] data-[highlighted]:outline-none cursor-pointer transition-colors">
                <Select.ItemText>{option}</Select.ItemText>
                <Select.ItemIndicator className="absolute left-3 flex items-center justify-center">
                  <Check size={16} className="text-[#D40073]" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
          <Select.ScrollDownButton className="flex items-center justify-center h-8 bg-white text-[#667085] cursor-default">
            <ChevronDown size={16} />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
    {helperText && <p className="text-[13px] text-[#667085] mt-1">{helperText}</p>}
  </div>
);

// Logo Component
export const RightTechLogo = ({ dark = false }: { dark?: boolean }) => (
  <div className={`flex items-center gap-2.5 font-bold text-[22px] tracking-tight ${dark ? 'text-white' : 'text-[#111827]'}`}>
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${dark ? 'bg-[#D40073] text-white' : 'bg-[#D40073] text-white'}`}>
      <Icon icon="solar:box-minimalistic-bold" className="text-[20px]" />
    </div>
    RightTech
  </div>
);

// OTP Input Component
const OTPInput = ({ value, onChange }: { value: string, onChange: (v: string) => void }) => {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const length = 6;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value;
    if (/[^0-9]/.test(val)) return;
    
    const newVal = value.split('');
    newVal[index] = val;
    const finalVal = newVal.join('').substring(0, length);
    onChange(finalVal);

    if (val && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-between gap-3 sm:gap-4">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          type="text"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          className="w-12 h-14 sm:w-14 sm:h-16 text-center text-[24px] font-bold bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#D40073] focus:bg-white focus:ring-[4px] focus:ring-[rgba(212,0,115,0.10)] transition-all duration-200 text-[#111827]"
        />
      ))}
    </div>
  );
};

// Signup Progress Component
const SignupProgress = ({ currentStep, totalSteps }: { currentStep: number, totalSteps: number }) => {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-5">
        <span className="text-[13px] font-bold text-[#D40073] tracking-widest uppercase">
          Step {String(currentStep).padStart(2, '0')} of {String(totalSteps).padStart(2, '0')}
        </span>
      </div>
      <div className="relative flex items-center justify-between w-full h-6">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-[#E5E7EB]" />
        
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#D40073]"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
        
        {Array.from({ length: totalSteps }).map((_, i) => {
          const isActive = i + 1 === currentStep;
          const isCompleted = i + 1 < currentStep;
          
          return (
            <div key={i} className="relative z-10 flex items-center justify-center w-6 h-6 bg-[#F9FAFB] rounded-full">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isCompleted || isActive ? '#D40073' : '#FFFFFF',
                  borderColor: isCompleted || isActive ? '#D40073' : '#E5E7EB',
                  scale: isActive ? 1.2 : 1
                }}
                className="w-3.5 h-3.5 rounded-full border-2 transition-colors duration-300 flex items-center justify-center"
              >
                 {isCompleted && <Check size={8} className="text-white" strokeWidth={4} />}
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Primary Button Component
const PrimaryButton = ({ children, disabled, loading, ...props }: any) => (
  <motion.button
    whileHover={{ y: disabled ? 0 : -2 }}
    whileTap={{ y: disabled ? 0 : 0 }}
    disabled={disabled || loading}
    className="w-full h-[52px] bg-[#D40073] hover:bg-[#B80063] text-white rounded-xl font-bold text-[16px] transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed relative group"
    {...props}
  >
    {loading ? (
      <div className="w-5 h-5 border-[2.5px] border-white/30 border-t-white rounded-full animate-spin" />
    ) : (
      children
    )}
  </motion.button>
);

export default function Auth() {
  const navigate = useNavigate();
  const [view, setView] = useState<'login' | 'signup' | 'success'>('login');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState<'email' | 'otp'>('email');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtpCode, setForgotOtpCode] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

  const [signupStep, setSignupStep] = useState(1);
  const [signupOtp, setSignupOtp] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    setTimeout(() => {
      setModalLoading(false);
      setForgotStep('otp');
    }, 1200);
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
    setTimeout(() => {
      setForgotStep('email');
      setForgotOtpCode('');
    }, 300);
  };

  const stepTitles: any = {
    1: { heading: "Your company at a glance", support: "This is your company's identity in the RightTech system. Every supplier, dealer, and transaction will be tied to this account." },
    2: { heading: "Where are you operating from?", support: "Your primary business location. You can add more branches and warehouses from your dashboard after setup." },
    3: { heading: "Who is the account owner?", support: "This person becomes the Master Business Admin. They have full control over the account and can invite all other staff members." },
    4: { heading: "Check your email", support: "" },
    5: { heading: "Financial preferences", support: "Configure how money flows through your system. Ghana Cedi is your primary currency by default." }
  };

  const renderSignupStep = () => {
    switch(signupStep) {
      case 1: return (
        <div className="space-y-5">
          <Input label="Registered Business Name *" placeholder="e.g. RightShop Ghana Ltd" />
          <Input label="Registration Number" placeholder="e.g. CS123456789" helperText="Ghana Registrar-General number" />
          <PremiumSelect label="Industry *" placeholder="Select industry" options={['Retail', 'Wholesale', 'Manufacturing', 'Logistics']} />
          <PremiumSelect label="Company Size" placeholder="Select size" options={['1-10 employees', '11-50 employees', '51-200 employees', '201+ employees']} />
          <Input label="Trading Name" placeholder="e.g. RightShop" helperText="If different from registered name" />
        </div>
      );
      case 2: return (
        <div className="space-y-5">
          <Input label="Street Address *" placeholder="e.g. 14 Independence Avenue" />
          <Input label="City *" placeholder="e.g. Accra" />
          <PremiumSelect label="Region *" placeholder="Select region" options={['Greater Accra', 'Ashanti', 'Western', 'Central', 'Eastern', 'Volta', 'Northern', 'Upper East', 'Upper West', 'Bono', 'Bono East', 'Ahafo', 'Savannah', 'North East', 'Oti', 'Western North']} />
          <Input label="Digital Address (GPS)" placeholder="e.g. GA-123-4567" helperText="Ghana Post GPS address" />
          <PremiumSelect label="Location Type" placeholder="Headquarters" options={['Headquarters', 'Branch', 'Warehouse']} value="Headquarters" />
        </div>
      );
      case 3: return (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <Input label="First Name *" placeholder="Kwame" />
            <Input label="Last Name *" placeholder="Asante" />
          </div>
          <Input label="Work Email *" placeholder="kwame@rightshop.com" type="email" />
          <Input label="Phone Number *" placeholder="+233 20 000 0000" type="tel" />
          <Input label="Job Title" placeholder="e.g. Managing Director, Owner, CEO" />
        </div>
      );
      case 4: return (
        <div className="space-y-10">
          <p className="text-[16px] text-[#667085] leading-relaxed -mt-4 mb-4">
            We sent a 6-digit code to <span className="text-[#111827] font-semibold">kwame@rightshop.com</span>. Enter it below.
            <br /><span className="text-[#98A2B3] text-[14px]">For this demo, use: 1 2 3 4 5 6</span>
          </p>
          <OTPInput value={signupOtp} onChange={setSignupOtp} />
          <p className="text-center text-[15px] font-medium text-[#667085]">
            Didn't get it?{' '}
            <button type="button" className="font-semibold text-[#D40073] hover:text-[#B80063] transition-colors">
              Resend code (52s)
            </button>
          </p>
        </div>
      );
      case 5: return (
        <div className="space-y-6">
          <div className="p-5 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-[15px] font-semibold text-[#111827]">Primary Currency</h4>
                <p className="text-[14px] text-[#667085] mt-1">Fixed to GHS for Ghana market</p>
              </div>
              <div className="text-[14px] font-bold text-[#111827] bg-white px-4 py-2 rounded-lg border border-[#E5E7EB]">
                GHS — Cedi
              </div>
            </div>
          </div>
          
          <PremiumSelect label="Reference Currency" placeholder="Select currency" options={['USD — US Dollar', 'EUR — Euro', 'GBP — British Pound']} value="USD — US Dollar" helperText="Shown alongside GHS in P&L reports" />
          <PremiumSelect label="Cedi Rate Tracking" placeholder="Select tracking method" options={['Manual — Finance Officer updates rates', 'Automatic — Bank of Ghana rates']} value="Manual — Finance Officer updates rates" />
          
          <div className="space-y-3 pt-4">
            <div>
              <label className="block text-[14px] font-medium text-[#111827]">Accepted Payment Methods</label>
              <p className="text-[13px] text-[#667085] mt-1">These appear in the POS and checkout flows</p>
            </div>
            <div className="space-y-3">
               {['Mobile Money (MoMo)', 'Cash', 'Credit/Debit Card', 'Bank Transfer'].map((method, idx) => (
                 <label key={method} className="flex items-center gap-4 p-4 rounded-xl border border-[#E5E7EB] hover:border-[#D40073] bg-white transition-all cursor-pointer group">
                   <div className="relative flex items-center justify-center w-5 h-5 rounded border border-[#D1D5DB] bg-white transition-colors group-hover:border-[#D40073]">
                     <input type="checkbox" defaultChecked={idx < 2} className="sr-only" />
                     <div className={`absolute inset-0 rounded flex items-center justify-center transition-colors ${idx < 2 ? 'bg-[#D40073] border-[#D40073]' : 'bg-transparent border-transparent'}`}>
                       {idx < 2 && <CheckCircle2 size={14} className="text-white fill-[#D40073]" />}
                     </div>
                   </div>
                   <span className="text-[15px] font-medium text-[#111827] select-none">{method}</span>
                 </label>
               ))}
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="w-full h-screen flex bg-[#F9FAFB] font-sans text-[#111827] selection:bg-[rgba(212,0,115,0.2)] selection:text-[#D40073] overflow-hidden">
      <div className="hidden lg:flex lg:w-[45%] xl:w-[48%] relative flex-col justify-between overflow-hidden bg-[#0B0B0F] p-12 xl:p-16">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img src={IMG_ABSTRACT} alt="Abstract architecture" className="w-full h-full object-cover object-center opacity-40 mix-blend-screen" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0F]/90 via-[#0B0B0F]/80 to-[#0B0B0F]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(212,0,115,0.15),_transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(212,0,115,0.10),_transparent_50%)]" />
        </div>
        <div className="relative z-10 flex flex-col items-start gap-8">
          <RightTechLogo dark />
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(212,0,115,0.12)] border border-[rgba(212,0,115,0.2)] text-[#D40073] text-[13px] font-bold tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-[#D40073]" />
            V3.0 LIVE
          </div>
        </div>
        <div className="relative z-10 my-auto py-12 max-w-[500px]">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}>
            <h1 className="text-[40px] xl:text-[48px] leading-[1.1] font-bold text-white tracking-tight mb-6">
              Run your inventory,<br />orders, and operations<br />with precision.
            </h1>
            <p className="text-[18px] text-[#98A2B3] font-medium leading-relaxed">
              A modern SaaS platform built for retail, wholesale, and operational management across Ghana.
            </p>
          </motion.div>
        </div>
        <div className="relative z-10 flex items-center gap-4 mt-auto pt-8 border-t border-white/10">
          <div className="flex items-center -space-x-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full bg-[#1A1C23] border-2 border-[#0B0B0F] flex items-center justify-center overflow-hidden">
                <img src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="User" className="w-full h-full object-cover opacity-90" />
              </div>
            ))}
            <div className="w-10 h-10 rounded-full bg-[#1A1C23] border-2 border-[#0B0B0F] flex items-center justify-center text-[11px] font-bold text-white pl-1">
              +5k
            </div>
          </div>
          <div className="text-[15px] font-medium text-[#98A2B3]">
            Trusted by growing businesses across Ghana
          </div>
        </div>
      </div>

      <div className="flex-1 h-full overflow-y-auto relative flex flex-col bg-[#F9FAFB]">
        <div className="absolute top-8 left-6 sm:left-12 lg:hidden z-20">
          <RightTechLogo />
        </div>
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-16">
          <div className="w-full max-w-[460px] p-4 sm:p-8 relative z-10">
            <AnimatePresence mode="wait">
              {view === 'login' ? (
                <motion.div key="login-view" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
                  <div className="mb-10 text-center sm:text-left">
                    <h2 className="text-[32px] font-bold tracking-tight text-[#111827] mb-3">Welcome back</h2>
                    <p className="text-[16px] text-[#667085]">Log in to access your dashboard.</p>
                  </div>
                  <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-5">
                      <Input id="email" type="email" label="Email address" placeholder="name@company.com" value={email} onChange={(e: any) => setEmail(e.target.value)} required />
                      <PasswordInput id="password" label="Password" placeholder="••••••••" value={password} onChange={(e: any) => setPassword(e.target.value)} required />
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center w-5 h-5 rounded border border-[#D1D5DB] bg-white transition-colors group-hover:border-[#D40073]">
                          <input type="checkbox" className="sr-only" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                          {remember && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute inset-0 bg-[#D40073] rounded border border-[#D40073] flex items-center justify-center">
                              <CheckCircle2 size={14} className="text-white fill-[#D40073]" />
                            </motion.div>
                          )}
                        </div>
                        <span className="text-[14px] font-medium text-[#475467] group-hover:text-[#111827] transition-colors select-none">Remember me</span>
                      </label>
                      <button type="button" onClick={() => setShowForgotModal(true)} className="text-[14px] font-bold text-[#D40073] hover:text-[#B80063] transition-colors">Forgot password?</button>
                    </div>
                    <div className="pt-4">
                      <PrimaryButton type="submit" loading={loading}>
                        <span className="flex items-center gap-2">Sign in <ArrowRight size={18} className="opacity-80 group-hover:translate-x-1 transition-transform" /></span>
                      </PrimaryButton>
                    </div>
                  </form>
                  <div className="mt-10 text-center border-t border-[#F3F4F6] pt-8">
                    <p className="text-[15px] font-medium text-[#667085]">
                      Don't have an account? <button onClick={() => setView('signup')} className="font-bold text-[#111827] hover:text-[#D40073] transition-colors ml-1">Sign up for free</button>
                    </p>
                  </div>
                </motion.div>
              ) : view === 'signup' ? (
                <motion.div key="signup-view" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
                   <SignupProgress currentStep={signupStep} totalSteps={5} />
                   <AnimatePresence mode="wait">
                      <motion.div key={signupStep} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}>
                         <div className="mb-10">
                            <h2 className="text-[32px] font-bold tracking-tight text-[#111827] mb-3 leading-[1.2]">{stepTitles[signupStep].heading}</h2>
                            {stepTitles[signupStep].support && <p className="text-[16px] text-[#667085] leading-relaxed">{stepTitles[signupStep].support}</p>}
                         </div>
                         <div className="mb-10 min-h-[300px]">
                            {renderSignupStep()}
                         </div>
                         <div className="flex items-center gap-4 border-t border-[#F3F4F6] pt-8">
                            {signupStep > 1 && (
                               <button type="button" onClick={() => setSignupStep(s => s - 1)} className="h-[52px] w-[52px] rounded-xl border border-[#E5E7EB] text-[#475467] hover:bg-[#F9FAFB] hover:text-[#111827] transition-all flex items-center justify-center shrink-0">
                                  <ArrowLeft size={20} />
                               </button>
                            )}
                            <div className="flex-1">
                              <PrimaryButton type="button" onClick={() => { 
                                if(signupStep < 5) setSignupStep(s => s + 1); 
                                else {
                                  setView('success');
                                  setTimeout(() => { navigate('/dashboard'); }, 3000);
                                }
                              }}>
                                {signupStep === 5 ? 'Complete Setup' : signupStep === 3 ? 'Send Verification Code' : signupStep === 4 ? 'Verify & Continue' : 'Continue'}
                                {signupStep !== 5 && signupStep !== 3 && signupStep !== 4 && <ArrowRight size={18} className="ml-2 opacity-80 group-hover:translate-x-1 transition-transform" />}
                              </PrimaryButton>
                            </div>
                         </div>
                         {signupStep === 1 && (
                            <p className="mt-8 text-center text-[15px] font-medium text-[#667085]">
                               Already have an account? <button type="button" onClick={() => setView('login')} className="font-bold text-[#111827] hover:text-[#D40073] transition-colors ml-1">Log in</button>
                            </p>
                         )}
                      </motion.div>
                   </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div key="success-view" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="flex flex-col items-center justify-center text-center py-12">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5, delay: 0.2 }} className="w-24 h-24 bg-[rgba(212,0,115,0.1)] rounded-full flex items-center justify-center mb-8 relative">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: "spring" }} className="w-16 h-16 bg-[#D40073] rounded-full flex items-center justify-center relative z-10">
                      <Check size={32} className="text-white" strokeWidth={3} />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: [0, 1, 0], scale: [1, 1.5, 2] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} className="absolute inset-0 rounded-full border-2 border-[#D40073]" />
                  </motion.div>
                  <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-[32px] font-bold text-[#111827] mb-3 tracking-tight">You're all set!</motion.h2>
                  <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="text-[16px] text-[#667085]">Preparing your customized dashboard...</motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="absolute inset-0 bg-black/30 backdrop-blur-[8px]" onClick={closeForgotModal} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="relative w-full max-w-[440px] bg-white rounded-[24px] overflow-hidden border border-[#ECEDEF]" onClick={(e) => e.stopPropagation()}>
              <button onClick={closeForgotModal} className="absolute top-6 right-6 p-2 text-[#98A2B3] hover:text-[#111827] hover:bg-[#F9FAFB] rounded-full transition-colors z-10"><X size={20} strokeWidth={2} /></button>
              <div className="p-10">
                <AnimatePresence mode="wait">
                  {forgotStep === 'email' ? (
                    <motion.div key="step-email" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }} className="flex flex-col">
                      <div className="w-14 h-14 bg-[rgba(212,0,115,0.1)] rounded-2xl flex items-center justify-center mb-8 text-[#D40073]">
                        <Package size={28} strokeWidth={2} />
                      </div>
                      <h3 className="text-[28px] font-bold text-[#111827] tracking-tight mb-3">Reset password</h3>
                      <p className="text-[16px] text-[#667085] leading-relaxed mb-8">Enter the email address associated with your account and we'll send you a link to reset your password.</p>
                      <form onSubmit={handleSendOTP} className="space-y-8">
                        <Input id="forgot-email" type="email" label="Email address" placeholder="name@company.com" value={forgotEmail} onChange={(e: any) => setForgotEmail(e.target.value)} required autoFocus />
                        <PrimaryButton type="submit" loading={modalLoading} disabled={!forgotEmail}>Send reset instructions</PrimaryButton>
                      </form>
                    </motion.div>
                  ) : (
                    <motion.div key="step-otp" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }} className="flex flex-col">
                      <button onClick={() => setForgotStep('email')} className="w-10 h-10 -ml-2 mb-6 text-[#667085] hover:text-[#111827] flex items-center justify-center rounded-full hover:bg-[#F9FAFB] transition-colors"><ArrowLeft size={20} strokeWidth={2} /></button>
                      <h3 className="text-[28px] font-bold text-[#111827] tracking-tight mb-3">Check your email</h3>
                      <p className="text-[16px] text-[#667085] leading-relaxed mb-8">We sent a password reset link to <span className="text-[#111827] font-semibold">{forgotEmail}</span></p>
                      <form onSubmit={(e) => { e.preventDefault(); closeForgotModal(); }} className="space-y-8">
                        <PrimaryButton type="submit" loading={modalLoading}>Open email app</PrimaryButton>
                        <p className="text-center text-[15px] font-medium text-[#667085]">Didn't receive the email? <button type="button" className="font-bold text-[#D40073] hover:text-[#B80063] transition-colors ml-1">Click to resend</button></p>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}