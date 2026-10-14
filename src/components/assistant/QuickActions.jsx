import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, CalendarClock, Sparkles, Search, RotateCcw, ScanSearch, GraduationCap } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { BOT_TEXTS } from '@/lib/botI18n';
import { openToolsDrawer } from '@/lib/seoScan';

const CHIPS = {
  tr: [
    { label: 'Fiyatlar ne kadar?', icon: HelpCircle },
    { label: 'Proje ne kadar sürer?', icon: CalendarClock },
    { label: 'Referanslar var mı?', icon: Sparkles },
    { label: 'SEO nedir?', icon: Search },
  ],
  en: [
    { label: 'How much does it cost?', icon: HelpCircle },
    { label: 'How long does a project take?', icon: CalendarClock },
    { label: 'Do you have references?', icon: Sparkles },
    { label: 'What is SEO?', icon: Search },
  ],
};

export default function QuickActions({ onSend, onReset, onCoach, disabled }) {
  const { lang } = useLanguage();
  const T = BOT_TEXTS[lang] || BOT_TEXTS.tr;
  const chips = [
    { label: T.menuCoach, icon: GraduationCap, coach: true },
    ...(CHIPS[lang] || CHIPS.tr),
    { label: lang === 'en' ? 'Free SEO scan' : 'Ücretsiz SEO analizi', icon: ScanSearch, tool: true },
    { label: lang === 'en' ? 'New chat' : 'Yeni sohbet', icon: RotateCcw, reset: true },
  ];

  return (
    <div className="px-4 sm:px-5 pb-1 space-y-3">
      <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible pb-1 -mx-1 px-1">
        {chips.map((c, i) => (
          <motion.button
            key={c.label}
            type="button"
            disabled={disabled}
            onClick={() => (c.reset ? onReset?.() : c.coach ? onCoach?.() : c.tool ? openToolsDrawer('seo') : onSend(c.label))}
            className="inline-flex shrink-0 whitespace-nowrap items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-2 font-body text-xs font-semibold text-foreground/90 hover:bg-mint hover:text-ink hover:border-mint transition-colors disabled:opacity-40"
            initial={{ opacity: 0, y: 14, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.15 + i * 0.12, type: 'spring', stiffness: 220, damping: 16 }}
          >
            <c.icon className="w-3.5 h-3.5 text-mint" />
            {c.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}