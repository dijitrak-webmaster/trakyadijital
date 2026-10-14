import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const IDS = ['top', 'ozellikler', 'hakkimizda', 'iletisim'];

export default function DemoNav({ theme }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-20 bg-[var(--d-bg)] border-b border-[var(--d-border)]">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
        <a href="#top" className={`[font-family:var(--d-head)] text-xl font-bold truncate ${theme.headClass}`}>{theme.brand}</a>
        <nav className="hidden md:flex items-center gap-7 text-sm text-[var(--d-muted)]">
          {theme.nav.map((n, i) => (
            <a key={n} href={`#${IDS[i]}`} className="hover:text-[var(--d-text)] transition-colors">{n}</a>
          ))}
        </nav>
        <a href="#iletisim" className="hidden md:inline-flex rounded-full bg-[var(--d-accent)] text-[var(--d-on)] px-5 py-2 text-sm font-semibold">
          {theme.hero.cta2}
        </a>
        <button onClick={() => setOpen(!open)} className="md:hidden p-2 -mr-2" aria-label="Menü">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      {open && (
        <nav className="md:hidden border-t border-[var(--d-border)] px-5 py-2 flex flex-col">
          {theme.nav.map((n, i) => (
            <a key={n} href={`#${IDS[i]}`} onClick={() => setOpen(false)} className="py-3 font-medium border-b border-[var(--d-border)] last:border-0">{n}</a>
          ))}
        </nav>
      )}
    </header>
  );
}