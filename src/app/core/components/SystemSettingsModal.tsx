import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from '@iconify/react';
import { useAppearance } from '../context/AppearanceContext';

/* ─── Types ─────────────────────────────────────── */
type TabId = 'profile' | 'notifications' | 'appearance' | 'security' | 'system';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: TabId;
}

/* ─── Tab definitions ───────────────────────────── */
const TABS: { id: TabId; label: string; icon: string; desc: string }[] = [
  { id: 'profile',       label: 'My Profile',    icon: 'solar:user-circle-bold-duotone',            desc: 'Personal info & role'      },
  { id: 'notifications', label: 'Notifications', icon: 'solar:bell-bold-duotone',                   desc: 'Alerts & preferences'      },
  { id: 'appearance',    label: 'Appearance',    icon: 'solar:palette-bold-duotone',                desc: 'Theme & display'           },
  { id: 'security',      label: 'Security',      icon: 'solar:shield-keyhole-bold-duotone',         desc: 'Password & sessions'       },
  { id: 'system',        label: 'System',        icon: 'solar:settings-minimalistic-bold-duotone',  desc: 'Business & integrations'   },
];

/* ─── Shared UI atoms ───────────────────────────── */
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-300 cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-[#D40073]/30 ${checked ? 'bg-[#D40073]' : 'bg-[#D1D5DB]'}`}
    >
      <motion.div
        animate={{ x: checked ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 700, damping: 35 }}
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
      />
    </button>
  );
}

function SectionHeader({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="mb-5">
      <h3 className="text-[15px] font-black text-[#111111] tracking-tight">{title}</h3>
      {desc && <p className="text-[12px] font-medium text-[#8B93A7] mt-0.5">{desc}</p>}
    </div>
  );
}

function SettingRow({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-[#F3F4F6] last:border-0 gap-6">
      <div className="min-w-0">
        <p className="text-[13px] font-bold text-[#111111]">{label}</p>
        {desc && <p className="text-[12px] font-medium text-[#8B93A7] mt-0.5 leading-relaxed">{desc}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider mb-1.5">{children}</label>;
}

function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full h-[42px] px-3.5 bg-[#F7F7F8] border border-[#E4E7EC] rounded-[10px] text-[13px] font-medium text-[#111111] placeholder:text-[#C0C4CE] focus:outline-none focus:bg-white focus:border-[#D40073] focus:ring-[3px] focus:ring-[rgba(212,0,115,0.1)] transition-all ${props.className ?? ''}`}
    />
  );
}

function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="w-full h-[42px] px-3.5 bg-[#F7F7F8] border border-[#E4E7EC] rounded-[10px] text-[13px] font-medium text-[#111111] focus:outline-none focus:bg-white focus:border-[#D40073] transition-all appearance-none cursor-pointer"
    >
      {children}
    </select>
  );
}

/* ─── Tab: Profile ──────────────────────────────── */
function ProfileTab() {
  const [saved, setSaved] = useState(false);
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="space-y-8">
      {/* Avatar */}
      <div className="flex items-center gap-5 p-5 bg-[#F7F7F8] dark:bg-white/5 border border-[#ECEDEF] dark:border-white/5 rounded-[18px]">
        <div className="relative shrink-0">
          <img src="https://i.pravatar.cc/120?img=33" alt="Avatar" className="w-20 h-20 rounded-full border-4 border-white shadow-md object-cover" />
          <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#111111] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#D40073] transition-colors cursor-pointer">
            <Icon icon="solar:camera-bold" className="text-[14px]" />
          </button>
        </div>
        <div>
          <p className="text-[15px] font-black text-[#111111]">Kwame Asante</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2 py-0.5 bg-[#111111] text-white text-[10px] font-bold rounded-[6px] uppercase tracking-wide">Master Admin</span>
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
            <span className="text-[11px] font-medium text-[#16A34A]">Active</span>
          </div>
          <button className="mt-2 text-[12px] font-bold text-[#D40073] hover:underline cursor-pointer">Change photo</button>
        </div>
      </div>

      {/* Basic Info */}
      <div>
        <SectionHeader title="Personal Information" desc="Your name and contact details visible to the team." />
        <div className="grid grid-cols-2 gap-4">
          <div><FieldLabel>First Name</FieldLabel><Input defaultValue="Kwame" /></div>
          <div><FieldLabel>Last Name</FieldLabel><Input defaultValue="Asante" /></div>
          <div><FieldLabel>Email Address</FieldLabel>
            <div className="relative">
              <Input defaultValue="kwame@rightech.io" className="pr-24" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#16A34A] bg-[#ECFDF3] px-2 py-0.5 rounded-full">Verified</span>
            </div>
          </div>
          <div><FieldLabel>Phone Number</FieldLabel><Input defaultValue="+233 24 000 0000" type="tel" /></div>
          <div className="col-span-2"><FieldLabel>Role / Title</FieldLabel><Input defaultValue="Master Administrator" readOnly className="opacity-60 cursor-not-allowed" /></div>
          <div className="col-span-2">
            <FieldLabel>Bio / Notes</FieldLabel>
            <textarea
              defaultValue="Oversees all platform operations and distributor relationships."
              rows={3}
              className="w-full px-3.5 py-3 bg-[#F7F7F8] border border-[#E4E7EC] rounded-[10px] text-[13px] font-medium text-[#111111] focus:outline-none focus:bg-white focus:border-[#D40073] focus:ring-[3px] focus:ring-[rgba(212,0,115,0.1)] transition-all resize-none"
            />
          </div>
        </div>
      </div>

      <button onClick={handleSave} className="h-11 px-8 bg-[#111111] hover:bg-[#D40073] text-white text-[13px] font-bold rounded-[12px] transition-all flex items-center gap-2 cursor-pointer">
        {saved ? <><Icon icon="solar:check-circle-bold" className="text-[16px]" /> Saved!</> : <><Icon icon="solar:floppy-disk-bold" className="text-[16px]" /> Save Changes</>}
      </button>
    </div>
  );
}

/* ─── Tab: Notifications ────────────────────────── */
const NOTIF_EVENTS = [
  { id: 'order_placed',   label: 'New Order Placed',     desc: 'When a dealer or retailer creates an order' },
  { id: 'order_delivered',label: 'Order Delivered',       desc: 'Confirmed delivery status update' },
  { id: 'payment_received',label:'Payment Received',     desc: 'Credit or cash payment logged' },
  { id: 'low_stock',      label: 'Low Stock Alert',       desc: 'When inventory drops below threshold' },
  { id: 'new_dealer',     label: 'New Dealer Registered', desc: 'A new dealer account is created' },
  { id: 'credit_limit',   label: 'Credit Limit Exceeded', desc: 'Dealer credit usage over 90%' },
];

function NotificationsTab() {
  type Channel = 'email' | 'sms' | 'app';
  const [prefs, setPrefs] = useState<Record<string, Record<Channel, boolean>>>(() =>
    Object.fromEntries(NOTIF_EVENTS.map(e => [e.id, { email: true, sms: e.id === 'low_stock' || e.id === 'credit_limit', app: true }]))
  );
  const [quietHours, setQuietHours] = useState(true);

  const toggle = (id: string, ch: Channel) =>
    setPrefs(p => ({ ...p, [id]: { ...p[id], [ch]: !p[id][ch] } }));

  return (
    <div className="space-y-8">
      <div>
        <SectionHeader title="Notification Channels" desc="Choose how you receive alerts for each event." />
        <div className="bg-[#F7F7F8] dark:bg-white/5 border border-[#ECEDEF] dark:border-white/5 rounded-[16px] overflow-hidden">
          {/* Header row */}
          <div className="grid grid-cols-[1fr_80px_80px_80px] items-center px-5 py-3 bg-[#F7F7F8] border-b border-[#ECEDEF]">
            <p className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider">Event</p>
            {(['Email','SMS','In-App'] as const).map(ch => (
              <p key={ch} className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider text-center">{ch}</p>
            ))}
          </div>
          {NOTIF_EVENTS.map((ev, i) => (
            <div key={ev.id} className={`grid grid-cols-[1fr_80px_80px_80px] items-center px-5 py-4 ${i < NOTIF_EVENTS.length - 1 ? 'border-b border-[#F3F4F6]' : ''}`}>
              <div>
                <p className="text-[13px] font-bold text-[#111111]">{ev.label}</p>
                <p className="text-[11px] font-medium text-[#8B93A7] mt-0.5">{ev.desc}</p>
              </div>
              {(['email','sms','app'] as Channel[]).map(ch => (
                <div key={ch} className="flex items-center justify-center">
                  <Toggle checked={prefs[ev.id][ch]} onChange={v => toggle(ev.id, ch)} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionHeader title="Quiet Hours" desc="Suppress non-critical notifications during off-hours." />
        <div className="bg-[#F7F7F8] dark:bg-white/5 border border-[#ECEDEF] dark:border-white/5 rounded-[16px] p-5 space-y-4">
          <SettingRow label="Enable Quiet Hours" desc="No alerts between 10 PM – 7 AM local time">
            <Toggle checked={quietHours} onChange={setQuietHours} />
          </SettingRow>
          {quietHours && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="grid grid-cols-2 gap-4 overflow-hidden">
              <div><FieldLabel>Start Time</FieldLabel><Input type="time" defaultValue="22:00" /></div>
              <div><FieldLabel>End Time</FieldLabel><Input type="time" defaultValue="07:00" /></div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Tab: Appearance ───────────────────────────── */
const THEMES = [
  { id: 'light',  label: 'Light',  icon: 'solar:sun-bold-duotone',   bg: 'bg-white', border: 'border-[#ECEDEF]' },
  { id: 'dark',   label: 'Dark',   icon: 'solar:moon-bold-duotone',   bg: 'bg-[#1A1C23]', border: 'border-[#333]' },
  { id: 'system', label: 'System', icon: 'solar:monitor-bold-duotone', bg: 'bg-[#F7F7F8]', border: 'border-[#ECEDEF]' },
];
const ACCENT_COLORS = ['#D40073','#4F46E5','#0284C7','#059669','#EA580C','#9333EA'];

function AppearanceTab() {
  const {
    theme, setTheme,
    accentColor, setAccentColor,
    density, setDensity,
    timeFormat, setTimeFormat,
    language, setLanguage,
  } = useAppearance();

  return (
    <div className="space-y-8">
      {/* Theme */}
      <div>
        <SectionHeader title="Theme" desc="Choose your preferred color mode." />
        <div className="grid grid-cols-3 gap-3">
          {THEMES.map(t => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id as any)}
              className={`flex flex-col items-center gap-3 p-5 rounded-[16px] border-2 transition-all cursor-pointer ${theme === t.id ? 'border-[#D40073] shadow-[0_0_0_4px_rgba(212,0,115,0.1)]' : 'border-[#ECEDEF] hover:border-[#D1D5DB]'}`}
            >
              <div className={`w-12 h-12 rounded-[12px] ${t.bg} border ${t.border} flex items-center justify-center shadow-sm`}>
                <Icon icon={t.icon} className={`text-[22px] ${t.id === 'dark' ? 'text-white' : 'text-[#111111]'}`} />
              </div>
              <span className="text-[12px] font-bold text-[#111111]">{t.label}</span>
              {theme === t.id && <span className="w-2 h-2 rounded-full bg-[#D40073]" />}
            </button>
          ))}
        </div>
      </div>

      {/* Accent color */}
      <div>
        <SectionHeader title="Accent Color" desc="Primary color used for highlights and interactive elements." />
        <div className="flex items-center gap-3">
          {ACCENT_COLORS.map(c => (
            <button
              key={c}
              onClick={() => setAccentColor(c)}
              style={{ background: c }}
              className="w-9 h-9 rounded-full transition-all cursor-pointer hover:scale-110 flex items-center justify-center"
            >
              {accentColor === c && <Icon icon="solar:check-circle-bold" className="text-white text-[22px]" />}
            </button>
          ))}
          <div className="ml-2 flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border border-[#ECEDEF]" style={{ background: accentColor }} />
            <span className="text-[12px] font-mono font-bold text-[#525866]">{accentColor}</span>
          </div>
        </div>
      </div>

      {/* Sidebar Density */}
      <div>
        <SectionHeader title="Sidebar Density" desc="Controls the spacing of navigation items." />
        <div className="grid grid-cols-3 gap-3">
          {(['compact','comfortable','spacious'] as const).map(d => (
            <button
              key={d}
              onClick={() => setDensity(d)}
              className={`py-3 px-4 rounded-[12px] border-2 text-[12px] font-bold capitalize transition-all cursor-pointer ${density === d ? 'border-[#D40073] text-[#D40073] bg-[rgba(212,0,115,0.04)]' : 'border-[#ECEDEF] text-[#525866] hover:border-[#D1D5DB]'}`}
            >
              {d}
            </button>
          ))}
        </div>
        <p className="text-[11px] font-medium text-[#8B93A7] mt-2">
          Preview updates immediately in the sidebar.
        </p>
      </div>

      {/* Format */}
      <div>
        <SectionHeader title="Format Preferences" />
        <div className="bg-[#F7F7F8] dark:bg-white/5 border border-[#ECEDEF] dark:border-white/5 rounded-[16px] divide-y divide-[#ECEDEF] dark:divide-white/5">
          <SettingRow label="Time Format" desc="12-hour (AM/PM) or 24-hour clock">
            <div className="flex rounded-[8px] border border-[#ECEDEF] overflow-hidden">
              {(['12h','24h'] as const).map(f => (
                <button key={f} onClick={() => setTimeFormat(f)} className={`px-4 py-2 text-[12px] font-bold transition-all cursor-pointer ${timeFormat === f ? 'bg-[#111111] text-white' : 'text-[#525866] hover:bg-[#F3F4F6]'}`}>{f}</button>
              ))}
            </div>
          </SettingRow>
          <div className="px-5 py-4">
            <FieldLabel>Language</FieldLabel>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="w-full h-[42px] px-3.5 mt-1.5 bg-[#F7F7F8] border border-[#E4E7EC] rounded-[10px] text-[13px] font-medium text-[#111111] focus:outline-none focus:bg-white focus:border-[#D40073] transition-all appearance-none cursor-pointer"
            >
              <option>English (US)</option>
              <option>French</option>
              <option>Twi</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Tab: Security ─────────────────────────────── */
const SESSIONS = [
  { device: 'Chrome on Mac',    location: 'Accra, GH',   icon: 'solar:monitor-bold-duotone',  time: 'Active now',    current: true  },
  { device: 'Safari on iPhone', location: 'Kumasi, GH',  icon: 'solar:phone-bold-duotone',     time: '2 hrs ago',   current: false },
  { device: 'Firefox on Windows',location:'Tema, GH',    icon: 'solar:monitor-bold-duotone',  time: '3 days ago',  current: false },
];

function SecurityTab() {
  const [twoFA, setTwoFA] = useState(false);
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="space-y-8">
      {/* Password */}
      <div>
        <SectionHeader title="Change Password" desc="Use a strong password you don't use elsewhere." />
        <div className="space-y-3">
          {['Current Password','New Password','Confirm New Password'].map((label, i) => (
            <div key={i}>
              <FieldLabel>{label}</FieldLabel>
              <div className="relative">
                <Input type={showPass ? 'text' : 'password'} placeholder="••••••••" />
                {i === 0 && (
                  <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B93A7] hover:text-[#111111] transition-colors cursor-pointer">
                    <Icon icon={showPass ? 'solar:eye-closed-bold' : 'solar:eye-bold'} className="text-[18px]" />
                  </button>
                )}
              </div>
            </div>
          ))}
          <button className="mt-1 h-11 px-6 bg-[#111111] hover:bg-[#D40073] text-white text-[13px] font-bold rounded-[12px] transition-all cursor-pointer">
            Update Password
          </button>
        </div>
      </div>

      {/* 2FA */}
      <div>
        <SectionHeader title="Two-Factor Authentication" desc="Add an extra layer of security to your account." />
        <div className="bg-[#F7F7F8] dark:bg-white/5 border border-[#ECEDEF] dark:border-white/5 rounded-[16px] p-5">
          <SettingRow label="Authenticator App" desc={twoFA ? 'Enabled — TOTP via Google Authenticator' : 'Not configured. Strongly recommended.'}>
            <Toggle checked={twoFA} onChange={setTwoFA} />
          </SettingRow>
          {twoFA && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 pt-4 border-t border-[#F3F4F6] flex items-center gap-3 overflow-hidden">
              <div className="w-20 h-20 bg-[#F7F7F8] border border-[#ECEDEF] rounded-[12px] flex items-center justify-center text-[#8B93A7]">
                <Icon icon="solar:qr-code-bold-duotone" className="text-[40px]" />
              </div>
              <div>
                <p className="text-[13px] font-bold text-[#111111]">Scan with your authenticator app</p>
                <p className="text-[12px] font-medium text-[#8B93A7] mt-0.5">Or enter code: <span className="font-mono tracking-widest text-[#D40073]">JBSW Y3DP</span></p>
                <button className="mt-2 text-[12px] font-bold text-[#D40073] hover:underline cursor-pointer">View backup codes</button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Sessions */}
      <div>
        <SectionHeader title="Active Sessions" desc="Devices currently signed into your account." />
        <div className="space-y-2">
          {SESSIONS.map((s, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-white/5 border border-[#ECEDEF] dark:border-white/5 rounded-[14px]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[10px] bg-[#F7F7F8] border border-[#ECEDEF] flex items-center justify-center text-[#525866]">
                  <Icon icon={s.icon} className="text-[20px]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-bold text-[#111111]">{s.device}</p>
                    {s.current && <span className="px-1.5 py-0.5 bg-[#ECFDF3] text-[#16A34A] text-[9px] font-bold rounded uppercase">This device</span>}
                  </div>
                  <p className="text-[11px] font-medium text-[#8B93A7]">{s.location} · {s.time}</p>
                </div>
              </div>
              {!s.current && (
                <button className="h-8 px-3 bg-[#FEF2F2] text-[#EF4444] text-[12px] font-bold rounded-[8px] hover:bg-[#FEE2E2] transition-colors cursor-pointer">Revoke</button>
              )}
            </div>
          ))}
          <button className="w-full h-10 border border-[#ECEDEF] rounded-[12px] text-[12px] font-bold text-[#EF4444] hover:bg-[#FEF2F2] transition-colors cursor-pointer mt-1">
            Sign out of all other sessions
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Tab: System ───────────────────────────────── */
function SystemTab() {
  const [apiVisible, setApiVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyKey = () => {
    navigator.clipboard.writeText('rtk_live_xK9mP2qRzTvYwL8nHjD4sFcBu6eAoN1Xb');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Business Info */}
      <div>
        <SectionHeader title="Business Information" desc="Core details about your organisation." />
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><FieldLabel>Company Name</FieldLabel><Input defaultValue="RightTech Distribution Ltd." /></div>
          <div><FieldLabel>Business Email</FieldLabel><Input defaultValue="admin@rightech.io" type="email" /></div>
          <div><FieldLabel>Business Phone</FieldLabel><Input defaultValue="+233 30 290 1234" type="tel" /></div>
          <div><FieldLabel>Tax / VAT ID</FieldLabel><Input defaultValue="GH-VAT-0029183" /></div>
          <div><FieldLabel>Registration No.</FieldLabel><Input defaultValue="CS-012-2021" /></div>
        </div>
      </div>

      {/* Regional */}
      <div>
        <SectionHeader title="Regional Settings" desc="Localisation preferences for dates, currency, and timezone." />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel>Timezone</FieldLabel>
            <Select><option>Africa/Accra (GMT+0)</option><option>Africa/Lagos (GMT+1)</option><option>Europe/London (GMT+0)</option></Select>
          </div>
          <div>
            <FieldLabel>Currency</FieldLabel>
            <Select><option>GHS — Ghanaian Cedi</option><option>USD — US Dollar</option><option>EUR — Euro</option><option>GBP — British Pound</option></Select>
          </div>
          <div>
            <FieldLabel>Date Format</FieldLabel>
            <Select><option>DD/MM/YYYY</option><option>MM/DD/YYYY</option><option>YYYY-MM-DD</option></Select>
          </div>
          <div>
            <FieldLabel>Fiscal Year Start</FieldLabel>
            <Select><option>January</option><option>April</option><option>July</option><option>October</option></Select>
          </div>
        </div>
      </div>

      {/* API */}
      <div>
        <SectionHeader title="API & Integrations" desc="Manage your API key and webhook endpoint." />
        <div className="bg-[#F7F7F8] dark:bg-white/5 border border-[#ECEDEF] dark:border-white/5 rounded-[16px] p-5 space-y-4">
          <div>
            <FieldLabel>Live API Key</FieldLabel>
            <div className="flex gap-2 mt-1">
              <div className="relative flex-1">
                <Input
                  readOnly
                  value={apiVisible ? 'rtk_live_xK9mP2qRzTvYwL8nHjD4sFcBu6eAoN1Xb' : 'rtk_live_••••••••••••••••••••••••••••••••'}
                  className="font-mono text-[12px] pr-10"
                />
                <button onClick={() => setApiVisible(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B93A7] hover:text-[#111111] transition-colors cursor-pointer">
                  <Icon icon={apiVisible ? 'solar:eye-closed-bold' : 'solar:eye-bold'} className="text-[16px]" />
                </button>
              </div>
              <button onClick={copyKey} className={`h-[42px] px-4 rounded-[10px] text-[12px] font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${copied ? 'bg-[#ECFDF3] border-[#16A34A] text-[#16A34A]' : 'bg-white border-[#E4E7EC] text-[#111111] hover:bg-[#F3F4F6]'}`}>
                <Icon icon={copied ? 'solar:check-circle-bold' : 'solar:copy-bold'} className="text-[16px]" />
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
          <div>
            <FieldLabel>Webhook URL</FieldLabel>
            <Input defaultValue="https://hooks.rightech.io/events" placeholder="https://your-domain.com/webhooks" className="mt-1 font-mono text-[12px]" />
          </div>
          <div className="flex gap-2 pt-2 border-t border-[#F3F4F6]">
            <button className="h-9 px-4 bg-white border border-[#E4E7EC] text-[12px] font-bold text-[#111111] rounded-[8px] hover:bg-[#F3F4F6] cursor-pointer transition-colors">Regenerate Key</button>
            <button className="h-9 px-4 bg-white border border-[#E4E7EC] text-[12px] font-bold text-[#111111] rounded-[8px] hover:bg-[#F3F4F6] cursor-pointer transition-colors flex items-center gap-1.5">
              <Icon icon="solar:document-text-bold-duotone" className="text-[14px]" />
              API Docs
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div>
        <SectionHeader title="Data & Storage" />
        <div className="p-5 border-2 border-dashed border-[#FECACA] bg-[#FEF2F2]/50 rounded-[16px] space-y-3">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-[10px] bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-center">
              <Icon icon="solar:danger-bold-duotone" className="text-[20px] text-[#EF4444]" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-[#EF4444]">Danger Zone</p>
              <p className="text-[11px] font-medium text-[#8B93A7]">These actions are irreversible. Proceed with caution.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="h-9 px-4 bg-white border border-[#E4E7EC] text-[12px] font-bold text-[#525866] rounded-[8px] hover:bg-[#F3F4F6] cursor-pointer transition-colors flex items-center gap-1.5">
              <Icon icon="solar:download-square-bold-duotone" className="text-[14px]" />
              Export All Data
            </button>
            <button className="h-9 px-4 bg-white border border-[#FECACA] text-[12px] font-bold text-[#EF4444] rounded-[8px] hover:bg-[#FEF2F2] cursor-pointer transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Modal ────────────────────────────────── */
export function SystemSettingsModal({ isOpen, onClose, defaultTab = 'profile' }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>(defaultTab);

  // Sync defaultTab when modal opens
  useEffect(() => { if (isOpen) setActiveTab(defaultTab); }, [isOpen, defaultTab]);

  // Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const TabContent = {
    profile:       <ProfileTab />,
    notifications: <NotificationsTab />,
    appearance:    <AppearanceTab />,
    security:      <SecurityTab />,
    system:        <SystemTab />,
  }[activeTab];

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="bg"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: 'spring', duration: 0.45, bounce: 0.2 }}
            className="fixed inset-0 flex items-center justify-center z-[9999] p-4 pointer-events-none"
          >
            <div
              className="w-full max-w-[940px] max-h-[90vh] bg-white dark:bg-[#151B2B] border border-[#ECEDEF] dark:border-white/10 rounded-[28px] overflow-hidden flex flex-col pointer-events-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* ── Modal Header ── */}
              <div className="flex items-center justify-between px-8 py-5 border-b border-[#ECEDEF] dark:border-white/5 bg-[#F7F7F8] dark:bg-white/5 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[12px] bg-[#111111] flex items-center justify-center">
                    <Icon icon="solar:settings-minimalistic-bold-duotone" className="text-[20px] text-white" />
                  </div>
                  <div>
                    <h2 className="text-[17px] font-black text-[#111111] tracking-tight">Settings</h2>
                    <p className="text-[12px] font-medium text-[#8B93A7]">Manage your account and workspace</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[#8B93A7] hover:bg-[#ECEDEF] hover:text-[#111111] transition-colors cursor-pointer"
                >
                  <Icon icon="solar:close-square-linear" className="text-[22px]" />
                </button>
              </div>

              {/* ── Body ── */}
              <div className="flex flex-1 min-h-0 overflow-hidden">
                {/* Left nav */}
                <div className="w-[220px] shrink-0 border-r border-[#ECEDEF] dark:border-white/5 bg-[#F7F7F8] dark:bg-white/5 flex flex-col py-4 px-3 gap-1 overflow-y-auto">
                  {TABS.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative w-full flex items-center gap-3 px-3 py-3 rounded-[12px] text-left transition-all cursor-pointer group ${activeTab === tab.id ? 'bg-white shadow-sm border border-[#ECEDEF]' : 'hover:bg-white/60'}`}
                    >
                      {activeTab === tab.id && <div className="absolute left-0 top-3 bottom-3 w-[3px] bg-[#D40073] rounded-r-full" />}
                      <div className={`w-8 h-8 rounded-[9px] flex items-center justify-center transition-colors ${activeTab === tab.id ? 'bg-[#111111] text-white' : 'bg-[#ECEDEF] text-[#525866] group-hover:bg-white'}`}>
                        <Icon icon={tab.icon} className="text-[16px]" />
                      </div>
                      <div>
                        <p className={`text-[12px] font-bold tracking-tight ${activeTab === tab.id ? 'text-[#111111]' : 'text-[#525866]'}`}>{tab.label}</p>
                        <p className="text-[10px] font-medium text-[#B0B7C3] leading-tight mt-0.5">{tab.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Right content */}
                <div className="flex-1 overflow-y-auto">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="p-8"
                    >
                      {/* Tab header */}
                      <div className="mb-7 pb-5 border-b border-[#F3F4F6]">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-[10px] bg-[#F7F7F8] border border-[#ECEDEF] flex items-center justify-center">
                            <Icon icon={TABS.find(t => t.id === activeTab)!.icon} className="text-[18px] text-[#D40073]" />
                          </div>
                          <div>
                            <h2 className="text-[18px] font-black text-[#111111] tracking-tight">
                              {TABS.find(t => t.id === activeTab)!.label}
                            </h2>
                            <p className="text-[12px] font-medium text-[#8B93A7]">
                              {TABS.find(t => t.id === activeTab)!.desc}
                            </p>
                          </div>
                        </div>
                      </div>

                      {TabContent}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
