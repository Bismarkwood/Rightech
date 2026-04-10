import React from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from '@iconify/react';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function LogoutConfirmModal({ isOpen, onConfirm, onCancel }: LogoutConfirmModalProps) {
  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — sits above everything including drawers & other modals */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
            onClick={onCancel}
          />

          {/* Modal card */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0.25 }}
            className="fixed inset-0 flex items-center justify-center z-[9999] pointer-events-none"
          >
            <div
              className="bg-white dark:bg-[#151B2B] rounded-[24px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.18)] dark:shadow-none border border-[#ECEDEF] dark:border-white/10 w-[380px] overflow-hidden pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Icon header */}
              <div className="flex flex-col items-center pt-8 pb-5 px-8 bg-gradient-to-b from-[#FEF2F2] to-white dark:from-red-500/5 dark:to-transparent">
                <div className="w-16 h-16 rounded-full bg-white dark:bg-white/5 border-2 border-[#FECACA] dark:border-red-500/20 flex items-center justify-center shadow-sm dark:shadow-[0_0_20px_rgba(239,68,68,0.1)] mb-4">
                  <Icon icon="solar:logout-3-bold-duotone" className="text-[32px] text-[#EF4444]" />
                </div>
                <h2 className="text-[18px] font-black text-[#111111] dark:text-white tracking-tight">Log Out?</h2>
                <p className="text-[13px] text-[#8B93A7] dark:text-[#8B93A7] font-medium text-center mt-1.5 leading-relaxed">
                  You're about to end your session.<br />Are you sure you want to log out?
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 p-5 border-t border-[#ECEDEF] dark:border-white/10 bg-[#F7F7F8] dark:bg-white/5">
                <button
                  onClick={onCancel}
                  className="flex-1 h-11 rounded-[12px] border border-[#ECEDEF] dark:border-white/10 bg-white dark:bg-white/5 text-[14px] font-bold text-[#525866] dark:text-[#8B93A7] hover:bg-[#F3F4F6] dark:hover:bg-white/10 hover:text-[#111111] dark:hover:text-white transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 h-11 rounded-[12px] bg-[#EF4444] text-[14px] font-bold text-white hover:bg-[#DC2626] active:scale-[0.98] transition-all shadow-[0_4px_12px_rgba(239,68,68,0.3)] dark:shadow-none cursor-pointer"
                >
                  Yes, Log Out
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
