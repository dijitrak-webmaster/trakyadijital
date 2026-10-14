import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';

// Ana sayfa bölüm + modül anahtarları; kayıt yoksa tüm bölümler açık, modüller kapalı.
export const SITE_SETTINGS_DEFAULTS = {
  market_enabled: false,
  show_hero: true,
  show_marquee: true,
  show_stats: true,
  show_services: true,
  show_why: true,
  show_sectors: true,
  show_process: true,
  show_packages: true,
  show_simulator: true,
  show_tools: true,
  show_calculator: true,
  show_portfolio: true,
  show_testimonials: true,
  show_instagram: true,
  show_faq: true,
  show_explore: true,
  show_cta: true,
};

// Tüm bileşenler tek ortak kopyayı kullanır: tek istek, tek abonelik (hız limiti koruması).
let cache = SITE_SETTINGS_DEFAULTS;
let ready = false;
const listeners = new Set();
let refetchTimer = null;

const notify = () => listeners.forEach((l) => l());

const apply = (list) => {
  cache = list[0] ? { ...SITE_SETTINGS_DEFAULTS, ...list[0] } : SITE_SETTINGS_DEFAULTS;
  ready = true;
  notify();
};

const refetch = () =>
  base44.entities.SiteSettings.list().then(apply).catch(() => { ready = true; notify(); });

if (typeof window !== 'undefined') {
  refetch();
  base44.entities.SiteSettings.subscribe(() => {
    // Aynı anda gelen çoklu olayları tek isteğe indirger.
    clearTimeout(refetchTimer);
    refetchTimer = setTimeout(refetch, 800);
  });
}

export default function useSiteSettings() {
  const [settings, setSettings] = useState(cache);
  const [isReady, setIsReady] = useState(ready);

  useEffect(() => {
    const l = () => { setSettings(cache); setIsReady(true); };
    listeners.add(l);
    l();
    return () => { listeners.delete(l); };
  }, []);

  return [settings, isReady];
}