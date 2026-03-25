import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from '@iconify/react';
import { MOCK_NOTIFICATIONS, NOTIF_CONFIG, Notification } from '../data/mockNotifications';

/* ════════════════════════════════════════════════════════════
   NotificationCenter
   - Bell icon in Topbar (with badge)
   - Clicking bell → glassmorphic dropdown (quick view)
   - "View all" → full-screen staggered panel
   - Incoming toast simulation (fires 3 s after mount)
════════════════════════════════════════════════════════════ */

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [dropOpen, setDropOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [toast, setToast] = useState<Notification | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const dropRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  /* ── Simulate an incoming notification after 3 s ── */
  useEffect(() => {
    const t = setTimeout(() => {
      const incoming: Notification = {
        id: 'n-live',
        type: 'order',
        title: 'New Order Incoming!',
        body: 'Ama Darko just placed an order for 20 bags of Cement.',
        time: 'Just now',
        read: false,
      };
      setNotifications(prev => [incoming, ...prev]);
      setToast(incoming);
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  /* Hide toast after 5 s */
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(t);
  }, [toast]);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const displayed = filter === 'unread' ? notifications.filter(n => !n.read) : notifications;

  return (
    <>
      {/* ── Bell Button ── */}
      <div ref={dropRef} className="relative">
        <button
          id="notif-bell-btn"
          onClick={() => { setDropOpen(o => !o); setToast(null); }}
          className="relative w-10 h-10 flex items-center justify-center text-[#525866] hover:text-[#111111] hover:bg-[#F3F4F6] rounded-full transition-colors"
        >
          <motion.div
            animate={unreadCount > 0 ? { rotate: [0, -12, 12, -8, 8, 0] } : {}}
            transition={{ duration: 0.5, delay: 3.1 }}
          >
            <Icon icon={dropOpen ? 'solar:bell-bold' : 'solar:bell-linear'} className="text-[20px]" />
          </motion.div>
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                key="badge"
                initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-[#D40073] rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white leading-none"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* ── Glassmorphic Dropdown ── */}
        <AnimatePresence>
          {dropOpen && (
            <motion.div
              id="notif-dropdown"
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ type: 'spring', duration: 0.3, bounce: 0.15 }}
              className="absolute right-0 top-[calc(100%+10px)] w-[380px] z-[60] rounded-[20px] overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.82)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(0,0,0,0.06)',
              }}
            >
              {/* Dropdown header */}
              <div className="px-5 pt-5 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-[15px] font-bold text-[#111111] tracking-tight">Notifications</h3>
                  <p className="text-[12px] text-[#8B93A7] font-medium mt-0.5">
                    {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                  </p>
                </div>
                <button
                  onClick={markAllRead}
                  className="text-[12px] font-semibold text-[#D40073] hover:underline whitespace-nowrap"
                >
                  Mark all read
                </button>
              </div>

              {/* Notification list (latest 5) */}
              <div className="max-h-[300px] overflow-y-auto px-2 pb-2 space-y-0.5">
                <AnimatePresence initial={false}>
                  {notifications.slice(0, 5).map((n, i) => {
                    const cfg = NOTIF_CONFIG[n.type];
                    return (
                      <motion.button
                        key={n.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8 }}
                        transition={{ delay: i * 0.04 }}
                        onClick={() => { markRead(n.id); }}
                        className="w-full flex items-start gap-3 px-3 py-3 rounded-[12px] hover:bg-white/80 transition-colors text-left group"
                      >
                        {/* Icon */}
                        <div className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0 mt-0.5" style={{ background: cfg.bg }}>
                          <Icon icon={cfg.icon} className="text-[18px]" style={{ color: cfg.color }} />
                        </div>
                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <span className={`text-[13px] font-bold leading-snug line-clamp-1 ${n.read ? 'text-[#525866]' : 'text-[#111111]'}`}>{n.title}</span>
                            {!n.read && <span className="w-2 h-2 rounded-full bg-[#D40073] shrink-0 mt-1.5" />}
                          </div>
                          <p className="text-[12px] text-[#8B93A7] font-medium mt-0.5 line-clamp-2 leading-snug">{n.body}</p>
                          <span className="text-[11px] text-[#B0B7C3] font-semibold mt-1 block">{n.time}</span>
                        </div>
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Footer CTA */}
              <div className="border-t border-[rgba(0,0,0,0.06)] px-5 py-3">
                <button
                  id="view-all-notifs-btn"
                  onClick={() => { setDropOpen(false); setPanelOpen(true); }}
                  className="w-full h-9 flex items-center justify-center gap-2 rounded-[10px] text-[13px] font-bold transition-colors bg-[#111111] hover:bg-[#333333] text-white"
                >
                  <Icon icon="solar:bell-bing-bold" className="text-[16px]" />
                  View All Notifications
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ════ Full-Screen Notification Panel ════ */}
      <AnimatePresence>
        {panelOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setPanelOpen(false)}
              className="fixed inset-0 z-[70]"
              style={{ background: 'rgba(10,0,6,0.65)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, x: 60, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.97 }}
              transition={{ type: 'spring', duration: 0.45, bounce: 0.14 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-[520px] z-[80] flex flex-col"
              style={{
                background: 'rgba(255,255,255,0.88)',
                backdropFilter: 'blur(32px)',
                WebkitBackdropFilter: 'blur(32px)',
                borderLeft: '1px solid rgba(0,0,0,0.06)',
              }}
            >
              {/* Panel Header */}
              <div
                className="shrink-0 px-7 pt-7 pb-5 relative overflow-hidden bg-white border-b border-[#ECEDEF]"
              >
                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-10 h-10 rounded-[12px] flex items-center justify-center bg-[#F7F7F8] border border-[#ECEDEF]"
                      >
                        <Icon icon="solar:bell-bing-bold" className="text-[22px] text-[#111111]" />
                      </div>
                      <div>
                        <h2 className="text-[20px] font-bold text-[#111111] tracking-tight">Notifications</h2>
                        <p className="text-[12px] font-medium text-[#8B93A7]">
                          {unreadCount > 0 ? `${unreadCount} unread messages` : 'All caught up'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setPanelOpen(false)}
                    className="w-9 h-9 shrink-0 flex items-center justify-center rounded-full transition-all mt-0.5 text-[#8B93A7] hover:bg-[#F3F4F6] hover:text-[#111111]"
                  >
                    <Icon icon="solar:close-square-linear" className="text-[22px]" />
                  </button>
                </div>

                {/* Filter tabs */}
                <div className="relative mt-4 flex gap-1 bg-[#F3F4F6] p-1 rounded-[10px] w-fit">
                  {(['all', 'unread'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className="h-7 px-4 rounded-[8px] text-[12px] font-bold transition-all capitalize"
                      style={filter === f
                        ? { background: '#111111', color: '#fff' }
                        : { color: '#8B93A7' }}
                    >
                      {f === 'unread' ? `Unread (${unreadCount})` : 'All'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mark all button */}
              <div className="px-7 py-3 flex items-center justify-between border-b border-[rgba(0,0,0,0.06)] shrink-0">
                <span className="text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider">
                  {displayed.length} notification{displayed.length !== 1 ? 's' : ''}
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[12px] font-bold text-[#D40073] hover:underline flex items-center gap-1"
                  >
                    <Icon icon="solar:check-read-linear" className="text-[14px]" />
                    Mark all as read
                  </button>
                )}
              </div>

              {/* Notification list */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
                <AnimatePresence initial={false}>
                  {displayed.length === 0 ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center justify-center py-20 text-center"
                    >
                      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                        style={{ background: 'rgba(212,0,115,0.08)' }}>
                        <Icon icon="solar:bell-off-bold" className="text-[32px] text-[#D40073]" />
                      </div>
                      <p className="text-[15px] font-bold text-[#111111]">No unread notifications</p>
                      <p className="text-[13px] text-[#8B93A7] mt-1">You're all caught up!</p>
                    </motion.div>
                  ) : (
                    displayed.map((n, i) => {
                      const cfg = NOTIF_CONFIG[n.type];
                      return (
                        <motion.div
                          key={n.id}
                          initial={{ opacity: 0, y: 16, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, x: 40, scale: 0.96 }}
                          transition={{ delay: i * 0.05, type: 'spring', duration: 0.4, bounce: 0.1 }}
                          className="flex items-start gap-4 p-4 rounded-[16px] cursor-pointer group transition-all"
                          style={{
                            background: n.read ? '#F7F7F8' : '#ffffff',
                            border: '1px solid #ECEDEF',
                          }}
                          onClick={() => markRead(n.id)}
                          onMouseEnter={e => (e.currentTarget.style.background = '#FBFBFC')}
                          onMouseLeave={e => (e.currentTarget.style.background = n.read ? '#F7F7F8' : '#ffffff')}
                        >
                          {/* Icon badge */}
                          <div
                            className="w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0"
                            style={{ background: cfg.bg }}
                          >
                            <Icon icon={cfg.icon} className="text-[22px]" style={{ color: cfg.color }} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <span className={`text-[14px] font-bold leading-snug ${n.read ? 'text-[#525866]' : 'text-[#0d0008]'}`}>
                                {n.title}
                              </span>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="text-[11px] text-[#B0B7C3] font-semibold whitespace-nowrap">{n.time}</span>
                                {!n.read && (
                                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: cfg.color }} />
                                )}
                              </div>
                            </div>
                            <p className="text-[13px] text-[#525866] font-medium mt-1 leading-relaxed">{n.body}</p>

                            {/* Type pill */}
                            <div className="mt-2 flex items-center gap-1.5">
                              <span
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold capitalize"
                                style={{ background: cfg.bg, color: cfg.color }}
                              >
                                <Icon icon={cfg.icon} className="text-[11px]" />
                                {n.type}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </AnimatePresence>
              </div>

              {/* Panel footer */}
              <div className="shrink-0 px-7 py-5 border-t border-[rgba(0,0,0,0.06)]">
                <p className="text-[12px] text-center text-[#B0B7C3] font-medium">
                  Showing last 30 days · Notifications older than 30 days are auto-archived
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ════ Incoming Toast ════ */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.96 }}
            transition={{ type: 'spring', duration: 0.45, bounce: 0.2 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-[90] w-full max-w-[400px] flex items-start gap-3 px-4 py-4 rounded-[18px] cursor-pointer"
            style={{
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(0,0,0,0.08)',
            }}
            onClick={() => { setToast(null); setPanelOpen(true); }}
          >
            {/* Icon */}
            <div
              className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0"
              style={{ background: NOTIF_CONFIG[toast.type].bg }}
            >
              <Icon icon={NOTIF_CONFIG[toast.type].icon} className="text-[20px]" style={{ color: NOTIF_CONFIG[toast.type].color }} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: NOTIF_CONFIG[toast.type].bg, color: NOTIF_CONFIG[toast.type].color }}>
                  New notification
                </span>
                <span className="text-[11px] text-[#B0B7C3] font-medium">{toast.time}</span>
              </div>
              <p className="text-[13px] font-bold text-[#111111] mt-1 leading-snug">{toast.title}</p>
              <p className="text-[12px] text-[#525866] font-medium mt-0.5 line-clamp-2 leading-snug">{toast.body}</p>
            </div>

            {/* Dismiss */}
            <button
              onClick={e => { e.stopPropagation(); setToast(null); }}
              className="w-7 h-7 flex items-center justify-center rounded-full text-[#B0B7C3] hover:bg-[#F3F4F6] hover:text-[#525866] transition-colors shrink-0"
            >
              <Icon icon="solar:close-circle-linear" className="text-[18px]" />
            </button>

            {/* Progress bar */}
            <motion.div
              className="absolute bottom-0 left-0 h-[3px] rounded-b-[18px]"
              style={{ background: `linear-gradient(to right, ${NOTIF_CONFIG[toast.type].color}, transparent)` }}
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 5, ease: 'linear' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
