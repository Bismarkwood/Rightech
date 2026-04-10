import React, { createContext, useContext, useEffect, useState } from 'react';

/* ─── Types ──────────────────────────────────────── */
export type Theme   = 'light' | 'dark' | 'system';
export type Density = 'compact' | 'comfortable' | 'spacious';

export interface AppearanceState {
  theme:       Theme;
  accentColor: string;
  density:     Density;
  timeFormat:  '12h' | '24h';
  language:    string;
}

interface AppearanceContextValue extends AppearanceState {
  setTheme:       (t: Theme) => void;
  setAccentColor: (c: string) => void;
  setDensity:     (d: Density) => void;
  setTimeFormat:  (f: '12h' | '24h') => void;
  setLanguage:    (l: string) => void;
}

const DEFAULTS: AppearanceState = {
  theme:       'light',
  accentColor: '#D40073',
  density:     'comfortable',
  timeFormat:  '24h',
  language:    'English (US)',
};

/* ─── DOM helpers ────────────────────────────────── */

/** Injects / updates a <style> element in <head> by id */
function upsertStyle(id: string, css: string) {
  let el = document.getElementById(id) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement('style');
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = css;
}

function removeStyle(id: string) {
  document.getElementById(id)?.remove();
}

/**
 * Injects base CSS custom properties that components reference via var().
 * Overriding these in .dark is what makes inline-style components adapt.
 */
function injectBaseVars() {
  upsertStyle('rt-vars', `
    :root {
      /* Glassmorphic surfaces */
      --rt-glass:           rgba(255,255,255,0.82);
      --rt-glass-strong:    rgba(255,255,255,0.92);
      --rt-glass-toast:     rgba(255,255,255,0.96);
      --rt-glass-border:    rgba(0,0,0,0.06);
      /* Notification item backgrounds */
      --rt-notif-bg:        #ffffff;
      --rt-notif-read-bg:   #F7F7F8;
      --rt-notif-hover-bg:  #FBFBFC;
      /* Inline card/surface */
      --rt-surface:         #ffffff;
      --rt-surface-muted:   #F7F7F8;
      --rt-surface-hover:   #FBFBFC;
    }
    /* Dark overrides — these flip the vars so inline styles update automatically */
    .dark {
      --rt-glass:           rgba(15,17,28,0.90);
      --rt-glass-strong:    rgba(12,13,20,0.94);
      --rt-glass-toast:     rgba(18,20,32,0.97);
      --rt-glass-border:    rgba(255,255,255,0.07);
      --rt-notif-bg:        #171922;
      --rt-notif-read-bg:   #0E0F17;
      --rt-notif-hover-bg:  #1D2031;
      --rt-surface:         #171922;
      --rt-surface-muted:   #0E0F17;
      --rt-surface-hover:   #1D2031;
    }
  `);
}

/** Toggle .dark class + inject comprehensive dark-mode overrides for hardcoded colors */
function applyTheme(theme: Theme) {
  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  document.documentElement.classList.toggle('dark', isDark);

  if (!isDark) {
    removeStyle('rt-dark');
    return;
  }

  /*
   * Dark palette:
   *  Page bg      #0C0D14  (deep navy-black)
   *  Card bg      #171922  (dark navy)
   *  Elevated     #1D2031  (slightly lifted)
   *  Subtle bg    #0E0F17  (sunken / sidebar bg)
   *  Border       #252A3D  (blue-gray border)
   *  Text primary #E4E7F5  (cool white)
   *  Text 2nd     #8892B5  (muted blue-gray)
   *  Text muted   #555E7E  (very muted)
   */
  upsertStyle('rt-dark', `
    /* ─── Foundation ─────────────────────────── */
    .dark { color-scheme: dark; }
    .dark body { background-color: #0C0D14 !important; }

    /* ─── White surfaces → dark card ─────────── */
    .dark [class~="bg-white"]                    { background-color: #171922 !important; }
    .dark [class~="from-white"]                  { --tw-gradient-from: #171922 var(--tw-gradient-from-position) !important; }
    .dark [class~="to-white"]                    { --tw-gradient-to: #171922 var(--tw-gradient-to-position) !important; }

    /* ─── Gray surfaces → dark muted ─────────── */
    .dark [class~="bg-[#F9FAFB]"]               { background-color: #0E0F17 !important; }
    .dark [class~="bg-[#F7F7F8]"]               { background-color: #0E0F17 !important; }
    .dark [class~="bg-[#F3F4F6]"]               { background-color: #1D2031 !important; }
    .dark [class~="bg-[#FBFBFC]"]               { background-color: #171922 !important; }
    .dark [class~="bg-[#ECEDEF]"]               { background-color: #262B3E !important; }

    /* Gradient surface shims */
    .dark [class~="from-[#F9FAFB]"]             { --tw-gradient-from: #0E0F17 var(--tw-gradient-from-position) !important; }
    .dark [class~="from-[#FBFBFC]"]             { --tw-gradient-from: #171922 var(--tw-gradient-from-position) !important; }

    /* ─── Hover backgrounds ───────────────────── */
    .dark [class~="hover:bg-white"]:hover         { background-color: #1D2031 !important; }
    .dark [class~="hover:bg-[#F3F4F6]"]:hover    { background-color: #1D2031 !important; }
    .dark [class~="hover:bg-[#F7F7F8]"]:hover    { background-color: #1D2031 !important; }
    .dark [class~="hover:bg-[#FBFBFC]"]:hover    { background-color: #1D2031 !important; }
    .dark [class~="hover:bg-white\\/60"]:hover   { background-color: rgba(29,32,49,0.6) !important; }

    /* ─── Text hierarchy ──────────────────────── */
    .dark [class~="text-[#111111]"]              { color: #E4E7F5 !important; }
    .dark [class~="text-[#525866]"]              { color: #8892B5 !important; }
    .dark [class~="text-[#8B93A7]"]              { color: #555E7E !important; }
    .dark [class~="text-[#B0B7C3]"]              { color: #434C6A !important; }
    .dark [class~="text-[#C0C4CE]"]              { color: #434C6A !important; }
    .dark [class~="hover:text-[#111111]"]:hover  { color: #E4E7F5 !important; }

    /* ─── Border colors ───────────────────────── */
    .dark [class~="border-[#ECEDEF]"]            { border-color: #252A3D !important; }
    .dark [class~="border-[#E4E7EC]"]            { border-color: #252A3D !important; }
    .dark [class~="border-t-[#ECEDEF]"]          { border-top-color: #252A3D !important; }
    .dark [class~="border-b-[#ECEDEF]"]          { border-bottom-color: #252A3D !important; }
    .dark [class~="border-r-[#ECEDEF]"]          { border-right-color: #252A3D !important; }
    .dark [class~="border-[#F3F4F6]"]            { border-color: #1D2031 !important; }

    /* ─── Dividers (divide-y / divide-x) ─────── */
    .dark [class~="divide-y"] > * + *            { border-color: #252A3D !important; }
    .dark [class~="divide-[#F3F4F6]"] > * + *   { border-color: #1D2031 !important; }

    /* ─── Input fields ────────────────────────── */
    .dark [class~="focus:bg-white"]:focus        { background-color: #1D2031 !important; }
    .dark input::placeholder,
    .dark textarea::placeholder                  { color: #434C6A !important; }
    .dark input[type="time"]                     { color-scheme: dark; }

    /* ─── Shadows → deeper in dark ───────────── */
    .dark [class~="shadow-sm"]                   { box-shadow: 0 1px 4px rgba(0,0,0,0.4) !important; }
    .dark [class~="shadow-md"]                   { box-shadow: 0 4px 12px rgba(0,0,0,0.5) !important; }
    .dark [class~="shadow-[0_20px_40px_-12px_rgba(0,0,0,0.12)]"]  { box-shadow: 0 20px 40px -12px rgba(0,0,0,0.55) !important; }
    .dark [class~="shadow-[0_32px_64px_-12px_rgba(0,0,0,0.18)]"]  { box-shadow: 0 32px 64px -12px rgba(0,0,0,0.65) !important; }
    .dark [class~="shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)]"]   { box-shadow: 0 40px 80px -20px rgba(0,0,0,0.7) !important; }

    /* ─── Additional class variants not yet covered ──── */
    /* Subtle whites used in modals */
    .dark [class~="bg-[#FAFBFC]"]                { background-color: #0E0F17 !important; }
    .dark [class~="bg-[#FAFAFA]"]                { background-color: #0E0F17 !important; }
    .dark [class~="bg-[#F0F2F5]"]                { background-color: #171922 !important; }
    /* Borders not yet covered */
    .dark [class~="border-[#F1F3F5]"]            { border-color: #252A3D !important; }
    .dark [class~="border-[#F0F2F5]"]            { border-color: #252A3D !important; }
    .dark [class~="border-[#F3F4F6]"]            { border-color: #1D2031 !important; }
    /* bg-white opacity fractions */
    .dark [class~="bg-white/80"]                 { background-color: rgba(23,25,34,0.80) !important; }
    .dark [class~="bg-white/60"]                 { background-color: rgba(23,25,34,0.60) !important; }
    .dark [class~="bg-white/50"]                 { background-color: rgba(23,25,34,0.50) !important; }
    /* Table row hover */
    .dark [class~="group"] [class~="hover:bg-[#FBFBFC]"]:hover { background-color: #1D2031 !important; }
    /* Payout / finance specific gray bg */
    .dark [class~="bg-[#F5F6F8]"]                { background-color: #0E0F17 !important; }
    .dark [class~="bg-[#EFF0F2]"]                { background-color: #1D2031 !important; }
    /* Inline-style panels: give them IDs or classes so our vars take effect */
    /* Any element that uses var(--rt-glass) will automatically adapt        */
  `);
}


/** Injects CSS overrides that replace every hardcoded brand colour with the chosen accent */
function applyAccentColor(color: string) {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);

  upsertStyle('rt-accent', `
    :root { --rt-accent: ${color}; }
    /* Backgrounds */
    [class~="bg-[#D40073]"]                     { background-color: ${color} !important; }
    [class~="hover\\:bg-[#D40073]"]:hover       { background-color: ${color} !important; }
    [class~="hover\\:bg-[#B80063]"]:hover       { background-color: color-mix(in srgb, ${color} 80%, black) !important; }
    [class~="bg-[#D40073]\\/5"]                 { background-color: rgba(${r},${g},${b},0.05) !important; }
    /* Gradient from */
    [class~="from-[#D40073]"]                   { --tw-gradient-from: ${color} var(--tw-gradient-from-position) !important; }
    [class~="from-[rgba(212,0,115,0.08)]"]       { --tw-gradient-from: rgba(${r},${g},${b},0.08) var(--tw-gradient-from-position) !important; }
    [class~="to-[#B3005F]"]                     { --tw-gradient-to: color-mix(in srgb, ${color} 70%, black) var(--tw-gradient-to-position) !important; }
    /* Text */
    [class~="text-[#D40073]"]                   { color: ${color} !important; }
    /* Borders */
    [class~="border-[#D40073]"]                 { border-color: ${color} !important; }
    [class~="border-t-[#D40073]"]               { border-top-color: ${color} !important; }
    /* Focus rings */
    [class~="focus\\:border-[#D40073]"]:focus   { border-color: ${color} !important; }
    [class~="focus\\:ring-[rgba(212,0,115,0.1)]"]:focus { --tw-ring-color: rgba(${r},${g},${b},0.1) !important; }
    /* Misc */
    [class~="shadow-[0_4px_12px_rgba(212,0,115,0.3)]"] { box-shadow: 0 4px 12px rgba(${r},${g},${b},0.3) !important; }
    /* Active sidebar gradient uses inline rgba — target via [class*] */
    [class*="rgba(212,0,115,0.08)"]             { --tw-gradient-from: rgba(${r},${g},${b},0.08) var(--tw-gradient-from-position) !important; }
    /* Radix active tab indicator */
    [class~="bg-[#D40073]\\/20"]                { background-color: rgba(${r},${g},${b},0.2) !important; }
  `);
}

/* ─── Context ────────────────────────────────────── */
const AppearanceContext = createContext<AppearanceContextValue>({
  ...DEFAULTS,
  setTheme:       () => {},
  setAccentColor: () => {},
  setDensity:     () => {},
  setTimeFormat:  () => {},
  setLanguage:    () => {},
});

/* ─── Provider ───────────────────────────────────── */
export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppearanceState>(() => {
    try {
      const stored = localStorage.getItem('rt-appearance');
      return stored ? { ...DEFAULTS, ...JSON.parse(stored) } : DEFAULTS;
    } catch {
      return DEFAULTS;
    }
  });

  /* Inject base CSS variables once */
  useEffect(() => {
    injectBaseVars();
  }, []);

  /* Apply theme on mount + whenever it changes */
  useEffect(() => {
    applyTheme(state.theme);

    if (state.theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => applyTheme('system');
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, [state.theme]);

  /* Apply accent on mount + change */
  useEffect(() => {
    applyAccentColor(state.accentColor);
  }, [state.accentColor]);

  /* Persist */
  useEffect(() => {
    localStorage.setItem('rt-appearance', JSON.stringify(state));
  }, [state]);

  const setTheme       = (theme: Theme)         => setState(s => ({ ...s, theme }));
  const setAccentColor = (accentColor: string)  => setState(s => ({ ...s, accentColor }));
  const setDensity     = (density: Density)     => setState(s => ({ ...s, density }));
  const setTimeFormat  = (timeFormat: '12h' | '24h') => setState(s => ({ ...s, timeFormat }));
  const setLanguage    = (language: string)     => setState(s => ({ ...s, language }));

  return (
    <AppearanceContext.Provider value={{ ...state, setTheme, setAccentColor, setDensity, setTimeFormat, setLanguage }}>
      {children}
    </AppearanceContext.Provider>
  );
}

export const useAppearance = () => useContext(AppearanceContext);
