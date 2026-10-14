import React from 'react';
import { Clock, MapPin, Phone, Quote } from 'lucide-react';

export default function DemoFooter({ theme }) {
  const { quote, contact, headClass } = theme;
  const items = [[Phone, contact.phone], [MapPin, contact.address], [Clock, contact.hours]];
  return (
    <>
      <section className="max-w-4xl mx-auto px-5 py-16 md:py-24 text-center">
        <Quote className="w-8 h-8 mx-auto text-[var(--d-accent)]" />
        <p className="[font-family:var(--d-head)] text-2xl md:text-3xl mt-5 leading-snug">“{quote.text}”</p>
        <p className="mt-5 text-sm text-[var(--d-muted)]">{quote.author}</p>
      </section>
      <section id="iletisim" className="max-w-6xl mx-auto px-5 pb-16">
        <div className="rounded-3xl bg-[var(--d-accent)] text-[var(--d-on)] p-8 md:p-12 grid md:grid-cols-[1.2fr_1fr] gap-8 items-center">
          <div>
            <h2 className={`[font-family:var(--d-head)] text-3xl md:text-4xl font-bold ${headClass}`}>Bize ulaşın</h2>
            <p className="mt-3 opacity-85">Sorularınız için arayın ya da bir mesaj bırakın; en kısa sürede dönüş yapalım.</p>
            <a href="#top" className="mt-6 inline-flex rounded-full bg-[var(--d-on)] text-[var(--d-accent)] px-6 py-3 font-semibold">{theme.hero.cta2}</a>
          </div>
          <ul className="space-y-4">
            {items.map(([Icon, t]) => (
              <li key={t} className="flex items-center gap-3"><Icon className="w-5 h-5 shrink-0" />{t}</li>
            ))}
          </ul>
        </div>
      </section>
      <footer className="border-t border-[var(--d-border)]">
        <div className="max-w-6xl mx-auto px-5 py-6 flex flex-col sm:flex-row justify-between gap-2 text-xs text-[var(--d-muted)]">
          <span>© 2026 {theme.brand}</span>
          <span>Bu bir Dijitrak tema önizlemesidir.</span>
        </div>
      </footer>
    </>
  );
}