import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

/** TR/EN dil değiştirme düğmesi — seçim tarayıcıda saklanır. */
const DEFAULT_CLASS = 'inline-flex items-center gap-1.5 h-9 rounded-full border border-border bg-secondary/50 px-3 font-mono text-xs font-bold hover:border-mint/50 hover:text-mint active:scale-95 transition-all';

export default function LangToggle({ className = DEFAULT_CLASS, compact = false }) {
  const { lang, toggle } = useLanguage();
  return (
    <button
      onClick={toggle}
      aria-label="Dili değiştir / Switch language"
      className={className}
    >
      {!compact && <Globe className="w-3.5 h-3.5" />}
      {lang === 'tr' ? 'TR' : 'EN'}
    </button>
  );
}