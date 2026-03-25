import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Phone, Check, Bike, Truck, Car, IdCard, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

interface NewAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (agent: any) => void;
}

const VEHICLE_TYPES = [
  { id: 'bike', label: 'Motorbike', icon: Bike },
  { id: 'van', label: 'Delivery Van', icon: Car },
  { id: 'truck', label: 'Box Truck', icon: Truck },
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
      const colors = ['#D40073', '#111111', '#ffffff'];

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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-[480px] bg-white rounded-[24px] overflow-hidden"
          >
            {/* Header */}
            <div className="h-[72px] px-6 border-b border-[#ECEDEF] flex items-center justify-between">
              <div>
                <h2 className="text-[18px] font-bold text-[#111111]">Add New Agent</h2>
                <p className="text-[13px] text-[#525866]">Step {step} of 2</p>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-[#F3F4F6] hover:bg-[#E4E7EC] flex items-center justify-center transition-colors text-[#525866]"
              >
                <X size={20} />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-[#F3F4F6] w-full">
              <motion.div 
                className="h-full bg-[#D40073]"
                initial={{ width: '50%' }}
                animate={{ width: step === 1 ? '50%' : '100%' }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    <div className="flex justify-center mb-6">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-[#F3F4F6] border-2 border-dashed border-[#D40073] flex items-center justify-center">
                          <User size={32} className="text-[#D40073] opacity-50" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center border-2 border-white">
                          <Star size={14} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-[13px] font-bold text-[#111111] mb-2 uppercase tracking-wider">Full Name</label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B93A7]">
                            <User size={18} />
                          </div>
                          <input 
                            type="text"
                            placeholder="e.g. Kwame Mensah"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full h-[48px] pl-11 pr-4 bg-[#F7F7F8] border border-transparent focus:border-[#D40073] focus:bg-white rounded-[12px] outline-none transition-all text-[14px] text-[#111111] placeholder:text-[#8B93A7]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[13px] font-bold text-[#111111] mb-2 uppercase tracking-wider">Phone Number</label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B93A7]">
                            <Phone size={18} />
                          </div>
                          <input 
                            type="tel"
                            placeholder="+233 XX XXX XXXX"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="w-full h-[48px] pl-11 pr-4 bg-[#F7F7F8] border border-transparent focus:border-[#D40073] focus:bg-white rounded-[12px] outline-none transition-all text-[14px] text-[#111111] placeholder:text-[#8B93A7]"
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
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-[13px] font-bold text-[#111111] mb-3 uppercase tracking-wider">Vehicle Type</label>
                      <div className="grid grid-cols-3 gap-3">
                        {VEHICLE_TYPES.map((type) => {
                          const Icon = type.icon;
                          const isSelected = formData.vehicleType === type.id;
                          return (
                            <button
                              key={type.id}
                              onClick={() => setFormData({...formData, vehicleType: type.id})}
                              className={`h-[80px] flex flex-col items-center justify-center gap-2 rounded-[12px] border transition-all ${
                                isSelected 
                                  ? 'bg-[#D40073]/5 border-[#D40073] text-[#D40073]' 
                                  : 'bg-white border-[#ECEDEF] text-[#525866] hover:bg-[#F7F7F8]'
                              }`}
                            >
                              <Icon size={24} />
                              <span className="text-[12px] font-bold">{type.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold text-[#111111] mb-2 uppercase tracking-wider">License Plate / ID</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B93A7]">
                          <IdCard size={18} />
                        </div>
                        <input 
                          type="text"
                          placeholder="e.g. GR-1234-23"
                          value={formData.licensePlate}
                          onChange={(e) => setFormData({...formData, licensePlate: e.target.value})}
                          className="w-full h-[48px] pl-11 pr-4 bg-[#F7F7F8] border border-transparent focus:border-[#D40073] focus:bg-white rounded-[12px] outline-none transition-all text-[14px] text-[#111111] placeholder:text-[#8B93A7]"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-[#ECEDEF] bg-[#F7F7F8] flex items-center justify-between">
              {step === 2 ? (
                <button 
                  onClick={() => setStep(1)}
                  className="px-6 h-[44px] text-[#525866] font-bold text-[14px] hover:text-[#111111] transition-colors"
                >
                  Back
                </button>
              ) : (
                <div />
              )}
              
              <button 
                onClick={handleNext}
                disabled={step === 1 ? (!formData.name || !formData.phone) : (!formData.vehicleType || !formData.licensePlate)}
                className="h-[44px] px-8 bg-[#111111] hover:bg-[#333333] disabled:opacity-50 disabled:hover:bg-[#111111] text-white font-bold text-[14px] rounded-[12px] flex items-center gap-2 transition-all ml-auto"
              >
                {step === 1 ? 'Continue' : 'Create Agent'}
                {step === 1 ? <User size={16} /> : <Check size={16} />}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}