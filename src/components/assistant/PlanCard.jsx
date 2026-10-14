import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

// DijiBot koç yanıtlarındaki mini eylem planı — sohbette işaretli liste kartı
export default function PlanCard({ items = [] }) {
  const { lang } = useLanguage();
  return (
    <div className="mt-3 rounded-2xl border-2 border-mint/40 bg-card p-4">
      <div className="font-mono text-[10px] font-bold tracking-[0.15em] text-mint">
        {lang === 'en' ? 'MY COACH PLAN' : 'KOÇ PLANIM'}
      </div>
      <ul className="mt-2 space-y-1.5">
        {items.map((t, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-foreground/85">
            <CheckCircle2 className="mt-0.5 w-4 h-4 shrink-0 text-mint" />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}