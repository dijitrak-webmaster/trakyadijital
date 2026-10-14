import React from 'react';
import { Link } from 'react-router-dom';
import { BadgeCheck, ChevronRight, MonitorSmartphone } from 'lucide-react';

export default function ItemHeader({ item, catLabel }) {
  return (
    <header className="space-y-4">
      <nav className="flex items-center gap-1.5 text-sm text-foreground/55 min-w-0">
        <Link to="/market" className="hover:text-mint transition-colors shrink-0">Market</Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <Link to={`/market?kat=${item.category}`} className="hover:text-mint transition-colors shrink-0">{catLabel}</Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <span className="text-foreground/80 truncate">{item.title}</span>
      </nav>
      <h1 className="font-display text-3xl md:text-5xl font-bold leading-tight">{item.title}</h1>
      <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
        <span className="inline-block rounded-full border-2 border-ink/20 bg-coral text-ink px-3.5 py-1 font-semibold shadow-sticker -rotate-2">{catLabel}</span>
        {item.badge && <span className="inline-block rounded-full border-2 border-ink/20 bg-sun text-ink px-3.5 py-1 font-semibold shadow-sticker rotate-1">{item.badge}</span>}
        {item.preview_url && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-mint/40 bg-mint/10 text-mint px-3 py-1">
            <MonitorSmartphone className="w-3.5 h-3.5" /> Responsive
          </span>
        )}
        <span className="inline-flex items-center gap-1.5 rounded-full border border-mint/40 bg-mint/10 text-mint px-3 py-1">
          <BadgeCheck className="w-3.5 h-3.5" /> Dijitrak güvencesi
        </span>
      </div>
    </header>
  );
}