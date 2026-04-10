import React, { useState } from 'react';
import { Settings2, Upload, PhoneOff, Bot, Save } from 'lucide-react';
import { Icon } from '@iconify/react';
import { motion } from 'motion/react';

export function StorefrontSettings() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 800);
  };

  return (
    <div className="max-w-[800px] mx-auto pb-12">
      <div className="bg-white rounded-[24px] border border-[#ECEDEF] p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-[14px] bg-[#111111] text-white flex items-center justify-center">
             <Settings2 size={24} />
          </div>
          <div>
            <h2 className="text-[20px] font-black text-[#111111] tracking-tight">Storefront Configuration</h2>
            <p className="text-[14px] text-[#8B93A7] font-medium">Manage brand identity and customer experience.</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Brand Identity */}
          <section className="space-y-6">
            <h3 className="text-[14px] font-bold text-[#111111] uppercase tracking-widest border-b border-[#ECEDEF] pb-3">Brand Identity</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[12px] font-black text-[#525866] uppercase tracking-wider">Store Display Name</label>
                <input 
                  type="text" 
                  defaultValue="BuildTech Supplies"
                  className="w-full h-12 px-4 rounded-[12px] bg-[#F7F7F8] border-transparent font-bold text-[#111111] focus:bg-white focus:border-[#D40073] focus:ring-4 focus:ring-[#D40073]/10 transition-all outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[12px] font-black text-[#525866] uppercase tracking-wider">Brand Highlight Color</label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-[12px] bg-[#D40073] shrink-0" />
                  <input 
                    type="text" 
                    defaultValue="#D40073"
                    className="flex-1 h-12 px-4 rounded-[12px] bg-[#F7F7F8] border-transparent font-mono text-[#111111] focus:bg-white focus:border-[#D40073] focus:ring-4 focus:ring-[#D40073]/10 transition-all outline-none uppercase"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-black text-[#525866] uppercase tracking-wider">Store Tagline / Description</label>
              <textarea 
                rows={3}
                defaultValue="Premium building materials delivered fast. Trusted by contractors across Accra."
                className="w-full p-4 rounded-[12px] bg-[#F7F7F8] border-transparent font-medium text-[#111111] focus:bg-white focus:border-[#D40073] focus:ring-4 focus:ring-[#D40073]/10 transition-all outline-none resize-none"
              />
            </div>
          </section>

          {/* Customer Experience */}
          <section className="space-y-6 pt-6">
            <h3 className="text-[14px] font-bold text-[#111111] uppercase tracking-widest border-b border-[#ECEDEF] pb-3">Customer Experience</h3>
            
            <div className="p-5 rounded-[16px] border border-[#ECEDEF] bg-[#F7F7F8] flex items-center justify-between">
              <div className="pr-8">
                <div className="flex items-center gap-2 mb-1">
                  <Bot size={18} className="text-[#D40073]" />
                  <h4 className="text-[14px] font-bold text-[#111111]">Virtual Attendant (AI)</h4>
                </div>
                <p className="text-[13px] text-[#525866] leading-relaxed">
                  Enable an automated chatbot on the storefront to answer basic product queries based on your inventory data.
                </p>
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-[#ECEDEF] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16A34A]"></div>
              </label>
            </div>

            <div className="p-5 rounded-[16px] border border-[#ECEDEF] bg-[#F7F7F8] flex items-center justify-between">
              <div className="pr-8">
                <div className="flex items-center gap-2 mb-1">
                  <Icon icon="solar:megaphone-bold-duotone" className="text-[#D97706] text-[18px]" />
                  <h4 className="text-[14px] font-bold text-[#111111]">Top Announcement Bar</h4>
                </div>
                <p className="text-[13px] text-[#525866] leading-relaxed">
                  Display a banner across the top of the store for promotions or urgent notices.
                </p>
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-[#ECEDEF] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16A34A]"></div>
              </label>
            </div>
          </section>

          {/* Action Footer */}
          <div className="pt-6 flex items-center justify-end gap-3 mt-8 border-t border-[#ECEDEF]">
            <button className="h-12 px-6 rounded-[12px] font-bold text-[#525866] hover:bg-[#F7F7F8] transition-colors">
              Reset Changes
            </button>
            <button 
              onClick={handleSave}
              className="h-12 px-8 rounded-[12px] font-bold text-white bg-[#111111] hover:bg-[#D40073] transition-colors flex items-center justify-center gap-2 min-w-[140px]"
            >
              {isSaving ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                  <Icon icon="solar:restart-bold" className="text-[20px]" />
                </motion.div>
              ) : (
                <>
                  <Save size={18} />
                  Save Context
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
