import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Icon } from '@iconify/react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { LogoutConfirmModal } from './LogoutConfirmModal';
import { SystemSettingsModal } from './SystemSettingsModal';
import { useAuth } from '../context/AuthContext';

type SettingsTab = 'profile' | 'notifications' | 'appearance' | 'security' | 'system';

export function UserProfileDropdown() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);
  const [settingsTab, setSettingsTab] = React.useState<SettingsTab | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const menuItems: { id: string; label: string; icon: string; tab: SettingsTab }[] = [
    { id: 'profile',  label: 'My Profile', icon: 'solar:user-circle-bold-duotone',   tab: 'profile'  },
    { id: 'settings', label: 'Settings',   icon: 'solar:settings-bold-duotone',       tab: 'system'   },
    { id: 'support',  label: 'Support',    icon: 'solar:chat-round-dots-bold-duotone',tab: 'system'   },
  ];

  const openSettings = (tab: SettingsTab) => {
    setIsOpen(false);
    setSettingsTab(tab);
  };

  const handleLogoutClick = () => {
    setIsOpen(false);
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    navigate('/auth', { replace: true });
  };

  return (
    <>
      <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenu.Trigger asChild>
          <button className="flex items-center gap-3 hover:bg-[#F3F4F6] px-2 py-1.5 rounded-[12px] transition-all group outline-none cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-[#1A1C23] overflow-hidden border border-[#ECEDEF] grow-0 shrink-0">
              <img src={user?.avatar || "https://i.pravatar.cc/100?img=33"} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-[13px] font-bold text-[#111111] leading-tight">{user?.name || "Kwame Asante"}</p>
              <p className="text-[11px] font-semibold text-[#8B93A7] leading-tight mt-0.5">{user?.role || "Master Admin"}</p>
            </div>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <Icon icon="solar:alt-arrow-down-linear" className="text-[#8B93A7] group-hover:text-[#111111] transition-colors text-[16px]" />
            </motion.div>
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            asChild sideOffset={8} align="end" className="z-[100] outline-none"
          >
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: 'spring', duration: 0.4, bounce: 0.3 }}
              className="w-[280px] bg-white dark:bg-[#151B2B] border border-[#ECEDEF] dark:border-white/10 rounded-[24px] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-5 bg-[#F7F7F8] dark:bg-white/5 border-b border-[#ECEDEF] dark:border-white/5 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#1A1C23] overflow-hidden border-2 border-white shrink-0">
                  <img src={user?.avatar || "https://i.pravatar.cc/100?img=33"} alt="User" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] font-black text-[#111111] leading-tight truncate">{user?.name || "Kwame Asante"}</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
                    <span className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider">{user?.role || "Master Admin"}</span>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2 space-y-0.5">
                {menuItems.map((item) => (
                  <DropdownMenu.Item
                    key={item.id}
                    onSelect={(e) => { e.preventDefault(); openSettings(item.tab); }}
                    className="flex items-center gap-3 px-4 py-3 rounded-[14px] outline-none cursor-pointer hover:bg-[#F3F4F6] dark:hover:bg-white/5 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-[10px] bg-white dark:bg-white/10 border border-[#ECEDEF] dark:border-transparent flex items-center justify-center text-[#525866] dark:text-[#8B93A7] group-hover:text-[#D40073] group-hover:border-[#D40073]/20 transition-all">
                      <Icon icon={item.icon} className="text-[20px]" />
                    </div>
                    <span className="text-[14px] font-bold text-[#111111] dark:text-white font-sans">{item.label}</span>
                  </DropdownMenu.Item>
                ))}
              </div>

              {/* Divider */}
              <div className="h-[1px] bg-[#ECEDEF] mx-4" />

              {/* Log Out */}
              <div className="p-2">
                <DropdownMenu.Item
                  onSelect={(e) => { e.preventDefault(); handleLogoutClick(); }}
                  className="flex items-center justify-between px-4 py-3 rounded-[14px] outline-none cursor-pointer hover:bg-[#FEF2F2] dark:hover:bg-red-500/10 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-[10px] bg-white dark:bg-white/10 border border-[#ECEDEF] dark:border-transparent flex items-center justify-center text-[#525866] dark:text-[#8B93A7] group-hover:text-[#EF4444] group-hover:border-[#EF4444]/20 transition-all">
                      <Icon icon="solar:logout-3-bold-duotone" className="text-[20px]" />
                    </div>
                    <span className="text-[14px] font-bold text-[#111111] dark:text-white group-hover:text-[#EF4444] font-sans">Log Out</span>
                  </div>
                  <Icon icon="solar:alt-arrow-right-linear" className="text-[#8B93A7] opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                </DropdownMenu.Item>
              </div>
            </motion.div>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      {/* System Settings Modal */}
      <SystemSettingsModal
        isOpen={settingsTab !== null}
        defaultTab={settingsTab ?? 'profile'}
        onClose={() => setSettingsTab(null)}
      />

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onConfirm={handleConfirmLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </>
  );
}
