import {
  Sprout, Tractor, Truck, Wheat, Cog, Factory, ShieldCheck, Gauge,
  Coffee, Croissant, UtensilsCrossed, CalendarCheck, BedDouble, Waves, Trees, Sparkles,
  Star, Heart, Zap, Award, Users, Camera, ShoppingBag, Dumbbell, Stethoscope, Scissors,
  Car, Package, Palette, Wrench, Leaf, Briefcase, GraduationCap, MapPin,
} from 'lucide-react';

/** Yönetim panelinden seçilebilir demo özellik ikonları */
export const THEME_ICONS = {
  Sprout, Tractor, Truck, Wheat, Cog, Factory, ShieldCheck, Gauge,
  Coffee, Croissant, UtensilsCrossed, CalendarCheck, BedDouble, Waves, Trees, Sparkles,
  Star, Heart, Zap, Award, Users, Camera, ShoppingBag, Dumbbell, Stethoscope, Scissors,
  Car, Package, Palette, Wrench, Leaf, Briefcase, GraduationCap, MapPin,
};
export const THEME_ICON_NAMES = Object.keys(THEME_ICONS);

/** Tema başlıklarında kullanılabilen Google yazı tipleri (demo-fonts ile yüklenir) */
export const THEME_FONTS = [
  ["'Playfair Display', serif", 'Playfair Display'],
  ["'Space Grotesk', sans-serif", 'Space Grotesk'],
  ["'Fraunces', serif", 'Fraunces'],
  ["'Cormorant Garamond', serif", 'Cormorant Garamond'],
];

export const DEFAULT_PALETTE = {
  bg: '#f7f3e8', surface: '#ffffff', text: '#1f2a1c', muted: '#5f6b58',
  accent: '#d99a1e', on: '#ffffff', border: '#e6dfcc',
};

/** Veritabanındaki DemoTheme kaydını canlı demo teması nesnesine çevirir. */
export function resolveDbTheme(record) {
  if (!record) return null;
  let d = {};
  try { d = JSON.parse(record.data || '{}'); } catch { return null; }
  const p = d.palette || {};
  return {
    brand: record.brand,
    head: d.head || "'Playfair Display', serif",
    headClass: d.headClass || '',
    heroStyle: d.heroStyle === 'split' ? 'split' : 'overlay',
    palette: { ...DEFAULT_PALETTE, ...p },
    nav: Array.isArray(d.nav) ? d.nav.slice(0, 4) : [],
    hero: d.hero || { eyebrow: '', title: '', text: '', cta: '', cta2: '', image: '' },
    featuresTitle: d.featuresTitle || '',
    features: (Array.isArray(d.features) ? d.features : []).slice(0, 4).map((f) => ({
      icon: THEME_ICONS[f?.icon] || Star,
      title: f?.title || '',
      text: f?.text || '',
    })),
    about: d.about || { title: '', text: '', image: '', stats: [] },
    quote: d.quote || { text: '', author: '' },
    contact: d.contact || { phone: '', address: '', hours: '' },
  };
}