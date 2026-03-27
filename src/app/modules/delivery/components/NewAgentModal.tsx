import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Phone, Check, Bike, Truck, Car, IdCard, Star, ImagePlus } from 'lucide-react';
import confetti from 'canvas-confetti';

interface NewAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (agent: any) => void;
}

const VEHICLE_TYPES = [
  { id: 'bike', label: 'Motorbike', icon: Bike, desc: 'Fast local delivery' },
  { id: 'van', label: 'Delivery Van', icon: Car, desc: 'Mid-size packages' },
  { id: 'truck', label: 'Box Truck', icon: Truck, desc: 'Heavy cargo' },
];

export function NewAgentModal({ isOpen, onClose, onAdd }: NewAgentModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vehicleType: '',
    licensePlate: '',
  });

  const handleNext = () => {
    if (step === 1 && formData.name && formData.phone) {
      setStep(2);
    } else if (step === 2 && formData.vehicleType && formData.licensePlate) {
      // Trigger confetti
      const end = Date.now() + 1.5 * 1000;
      const colors = ['#D40073', '#FF6B6B', '#4ECDC4'];

      (function frame() {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());

      onAdd({
        id: `AG-${Math.floor(Math.random() * 1000) + 5000}`,
        ...formData,
        status: 'active',
        rating: '5.0',
        deliveries: 0
      });
      
      setTimeout(() => {
        onClose();
        setStep(1);
        setFormData({ name: '', phone: '', vehicleType: '', licensePlate: '' });
      }, 1500);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-[520px] bg-white/95 backdrop-blur-xl rounded-[28px] shadow-2xl overflow-hidden border border-white/20"
          >
            {/* Header */}
            <div className="relative h-[88px] px-8 flex items-center justify-between border-b border-white/40 bg-gradient-to-r from-white/60 to-white/30 backdrop-blur-sm">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#F3F4F6]">
                <motion.div 
                  className="h-full bg-gradient-to-r from-[#D40073] to-[#FF6B6B]"
                  initial={{ width: '50%' }}
                  animate={{ width: step === 1 ? '50%' : '100%' }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
              <div>
                <h2 className="text-[20px] font-bold text-[#111111] tracking-tight">Onboard New Agent</h2>
                <p className="text-[13px] font-medium text-[#525866] mt-0.5">Step {step} of 2 • {step === 1 ? 'Personal Details' : 'Vehicle Information'}</p>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white shadow-sm border border-[#ECEDEF] hover:bg-[#F7F7F8] hover:scale-105 active:scale-95 flex items-center justify-center transition-all text-[#525866]"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-8">
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="space-y-6"
                  >
                    <div className="flex justify-center mb-8">
                      <div className="relative group cursor-pointer">
                        <div className="w-[104px] h-[104px] rounded-full bg-gradient-to-tr from-[#F7F7F8] to-[#FFFFFF] border border-[#E4E7EC] shadow-sm flex items-center justify-center group-hover:border-[#D40073]/50 transition-all duration-300 relative overflow-hidden">
                          <User size={40} className="text-[#8B93A7] group-hover:scale-110 transition-transform duration-300" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <ImagePlus size={24} className="text-white" />
                          </div>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-gradient-to-br from-[#111111] to-[#333333] shadow-lg text-white flex items-center justify-center border-2 border-white group-hover:scale-110 transition-transform">
                          <Star size={16} className="text-[#FEF08A]" fill="currentColor" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <label className="block text-[13px] font-bold text-[#111111] mb-2 uppercase tracking-wider">Full Name</label>
                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B93A7] group-focus-within:text-[#D40073] transition-colors">
                            <User size={20} />
                          </div>
                          <input 
                            type="text"
                            placeholder="e.g. Kwame Mensah"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full h-[54px] pl-12 pr-4 bg-white/50 border border-[#E4E7EC] focus:border-[#D40073] focus:ring-4 focus:ring-[#D40073]/10 rounded-[16px] outline-none transition-all text-[15px] font-medium text-[#111111] placeholder:text-[#8B93A7] placeholder:font-normal shadow-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[13px] font-bold text-[#111111] mb-2 uppercase tracking-wider">Phone Number</label>
                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B93A7] group-focus-within:text-[#D40073] transition-colors">
                            <Phone size={20} />
                          </div>
                          <input 
                            type="tel"
                            placeholder="+233 XX XXX XXXX"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="w-full h-[54px] pl-12 pr-4 bg-white/50 border border-[#E4E7EC] focus:border-[#D40073] focus:ring-4 focus:ring-[#D40073]/10 rounded-[16px] outline-none transition-all text-[15px] font-medium text-[#111111] placeholder:text-[#8B93A7] placeholder:font-normal shadow-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="space-y-8"
                  >
                    <div>
                      <label className="block text-[13px] font-bold text-[#111111] mb-3 uppercase tracking-wider">Vehicle Type</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {VEHICLE_TYPES.map((type) => {
                          const Icon = type.icon;
                          const isSelected = formData.vehicleType === type.id;
                          return (
                            <button
                              key={type.id}
                              onClick={() => setFormData({...formData, vehicleType: type.id})}
                              className={`relative h-[110px] flex flex-col items-center justify-center gap-2 rounded-[16px] border-[1.5px] transition-all duration-300 overflow-hidden ${
                                isSelected 
                                  ? 'bg-gradient-to-b from-[#FFF5F9] to-white border-[#D40073] shadow-[0_4px_20px_-4px_rgba(212,0,115,0.2)]' 
                                  : 'bg-white border-[#E4E7EC] hover:border-[#8B93A7] hover:bg-[#F7F7F8] shadow-sm'
                              }`}
                            >
                              {isSelected && (
                                <motion.div 
                                  layoutId="activeIndicator"
                                  className="absolute top-2 right-2 w-4 h-4 bg-[#D40073] rounded-full flex items-center justify-center text-white"
                                >
                                  <Check size={10} strokeWidth={3} />
                                </motion.div>
                              )}
                              <Icon size={32} className={`mb-1 transition-colors ${isSelected ? 'text-[#D40073]' : 'text-[#8B93A7]'}`} />
                              <span className={`text-[13px] font-bold ${isSelected ? 'text-[#111111]' : 'text-[#525866]'}`}>{type.label}</span>
                              <span className="text-[10px] font-medium text-[#8B93A7]">{type.desc}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold text-[#111111] mb-2 uppercase tracking-wider">License Plate / ID</label>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B93A7] group-focus-within:text-[#D40073] transition-colors">
                          <IdCard size={20} />
                        </div>
                        <input 
                          type="text"
                          placeholder="e.g. GR-1234-23"
                          value={formData.licensePlate}
                          onChange={(e) => setFormData({...formData, licensePlate: e.target.value})}
                          className="w-full h-[54px] pl-12 pr-4 bg-white/50 border border-[#E4E7EC] focus:border-[#D40073] focus:ring-4 focus:ring-[#D40073]/10 rounded-[16px] outline-none transition-all text-[15px] font-medium text-[#111111] placeholder:text-[#8B93A7] placeholder:font-normal shadow-sm uppercase uppercase"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-6 md:px-8 md:py-6 border-t border-[#E4E7EC] bg-white/60 backdrop-blur-md flex items-center justify-between">
              {step === 2 ? (
                <button 
                  onClick={() => setStep(1)}
                  className="px-6 h-[48px] text-[#525866] font-bold text-[14px] hover:text-[#111111] hover:bg-[#F3F4F6] rounded-[14px] transition-colors"
                >
                  Back
                </button>
              ) : (
                <div />
              )}
              
              <button 
                onClick={handleNext}
                disabled={step === 1 ? (!formData.name || !formData.phone) : (!formData.vehicleType || !formData.licensePlate)}
                className="h-[48px] px-8 bg-gradient-to-r from-[#111111] to-[#333333] hover:shadow-lg disabled:opacity-50 disabled:hover:shadow-none text-white font-bold text-[14px] rounded-[14px] flex items-center gap-2 transition-all ml-auto hover:scale-[1.02] active:scale-[0.98]"
              >
                {step === 1 ? 'Continue' : 'Complete Setup'}
                {step === 1 ? <Check size={18} className="opacity-0 w-0 -ml-2 transition-all" /> : <Check size={18} />}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}