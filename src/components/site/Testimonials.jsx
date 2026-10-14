import React, { useEffect, useState } from 'react';
import { Star, Quote } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import Reveal from '@/components/site/Reveal';
import { base44 } from '@/api/base44Client';

const FALLBACK = [
  { id: 'f1', author: 'Hüseyin K.', role: 'Ayçiçek Üreticisi · Edirne', color: 'bg-mint', text: 'Mahsulümüzü ilk kez aracısız sattık. Mağaza kurulalı 8 ay oldu, online satışlar beklediğimizden hızlı büyüdü.' },
  { id: 'f2', author: 'Merve A.', role: 'Tekstil İşletmesi · Çorlu', color: 'bg-sun', text: 'Alman müşterilerimiz artık bizi Google\'da buluyor. Çok dilli site sayesinde ihracat talepleri adeta ikiye katlandı.' },
  { id: 'f3', author: 'Emre T.', role: 'Peynir İşletmesi · Malkara', color: 'bg-coral', text: 'En çok yorumlar şaşırttı: Google profilimizi düzenledikten sonra hafta sonları sıra oluşuyor. Hesaplı ve etkili bir yatırım oldu.' },
];

const COLORS = ['bg-mint', 'bg-sun', 'bg-coral'];

// Panelde yönetilen yayınlanmış referansları gösterir; kayıt yoksa sabit üçlüye döner.
export default function Testimonials() {
  const { tl } = useLanguage();
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    let alive = true;
    base44.entities.Testimonial.filter({ status: 'published' }, { limit: 3 })
      .then((page) => {
        if (!alive) return;
        const items = Array.isArray(page) ? page : (page.items || []);
        setQuotes(items.map((t, i) => ({
          id: t.id,
          author: t.author,
          role: t.role || '',
          text: t.text,
          color: t.color || COLORS[i % COLORS.length],
        })));
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  const QUOTES = quotes.length ? quotes : FALLBACK;

  return (
    <section>
      <Reveal className="text-center max-w-2xl mx-auto">
        <p className="font-mono text-xs text-sun">{tl('// MÜŞTERİLERİMİZ NE DİYOR')}</p>
        <h2 className="mt-3 font-display font-bold text-4xl md:text-5xl">{tl('Trakya konuşuyor')}</h2>
      </Reveal>
      <div className="mt-6 md:mt-10 grid md:grid-cols-3 gap-4 md:gap-5">
        {QUOTES.map((q, i) => (
          <Reveal key={q.id} delay={i * 0.1}>
            <div className="h-full rounded-2xl border-2 border-border bg-card p-6 flex flex-col hover:-translate-y-1 transition-transform">
              <Quote className={`w-8 h-8 ${q.color} rounded-lg p-1.5 text-ink border-2 border-ink`} />
              <p className="mt-4 text-foreground/85 leading-relaxed flex-1">"{tl(q.text)}"</p>
              <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                <div>
                  <div className="font-semibold text-sm">{q.author}</div>
                  <div className="text-xs text-foreground/60">{tl(q.role)}</div>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => <Star key={s} className="w-3.5 h-3.5 text-sun fill-sun" />)}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}