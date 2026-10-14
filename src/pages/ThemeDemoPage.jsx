import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DEMO_FONTS_HREF, DEMO_THEMES } from '@/lib/demoThemes';
import { resolveDbTheme } from '@/lib/demoThemeData';
import { base44 } from '@/api/base44Client';
import DemoNav from '@/components/demo/DemoNav';
import DemoHero from '@/components/demo/DemoHero';
import DemoFeatures from '@/components/demo/DemoFeatures';
import DemoAbout from '@/components/demo/DemoAbout';
import DemoFooter from '@/components/demo/DemoFooter';

/** Market temalarının canlı demo sitesi (önizleme çerçevesinde açılır). */
export default function ThemeDemoPage() {
  const { themeKey } = useParams();
  const [dbTheme, setDbTheme] = useState(undefined);
  const theme = DEMO_THEMES[themeKey] || dbTheme;

  // Yönetim panelinden eklenen özel temalar veritabanından gelir
  useEffect(() => {
    let alive = true;
    setDbTheme(undefined);
    base44.entities.DemoTheme.filter({ key: themeKey }, undefined, 1)
      .then((rows) => { if (alive) setDbTheme(rows[0] ? resolveDbTheme(rows[0]) : null); })
      .catch(() => { if (alive) setDbTheme(null); });
    return () => { alive = false; };
  }, [themeKey]);

  useEffect(() => {
    if (document.getElementById('demo-fonts')) return;
    const link = document.createElement('link');
    link.id = 'demo-fonts';
    link.rel = 'stylesheet';
    link.href = DEMO_FONTS_HREF;
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    document.title = theme ? `${theme.brand} — Dijitrak Tema Önizleme` : 'Tema Önizleme';
  }, [theme]);

  // Önizlemede masaüstü kaydırma çubuğu görünmesin — gerçek cihaz gibi kayar
  useEffect(() => {
    if (document.getElementById('demo-scroll-style')) return;
    const style = document.createElement('style');
    style.id = 'demo-scroll-style';
    style.textContent = 'html, body { scrollbar-width: none; } *::-webkit-scrollbar { display: none; }';
    document.head.appendChild(style);
  }, []);

  if (theme === undefined) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (!theme) {
    return (
      <div className="min-h-screen grid place-items-center text-center px-5">
        <div>
          <p className="font-display text-2xl font-semibold">Önizleme bulunamadı</p>
          <Link to="/market?kat=tema" className="mt-4 inline-block text-mint font-semibold">Temalara dön</Link>
        </div>
      </div>
    );
  }

  // Tarayıcının yerleşik #çapa kaydırması önizlemeyi taşıyan dış sayfayı da kaydırır; yalnızca demonun kendisini kaydır
  const scrollToAnchor = (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    e.preventDefault();
    const el = document.getElementById(a.getAttribute('href').slice(1));
    window.scrollTo({ top: el ? el.getBoundingClientRect().top + window.scrollY : 0, behavior: 'smooth' });
  };

  const p = theme.palette;
  const vars = {
    '--d-bg': p.bg, '--d-surface': p.surface, '--d-text': p.text, '--d-muted': p.muted,
    '--d-accent': p.accent, '--d-on': p.on, '--d-border': p.border,
    '--d-head': theme.head, '--d-body': "'Inter', ui-sans-serif, system-ui, sans-serif",
  };

  return (
    <div style={vars} onClick={scrollToAnchor} className="min-h-screen bg-[var(--d-bg)] text-[var(--d-text)] [font-family:var(--d-body)]">
      <DemoNav theme={theme} />
      <DemoHero theme={theme} />
      <DemoFeatures theme={theme} />
      <DemoAbout theme={theme} />
      <DemoFooter theme={theme} />
    </div>
  );
}