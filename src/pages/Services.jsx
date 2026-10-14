import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { sectors } from '@/lib/siteData';
import { serviceCategories, serviceCatalog, priceLabel, categoryOf, serviceBySlug } from '@/lib/serviceCatalog';
import { sectorFit } from '@/lib/sectorFit';
import { useLanguage } from '@/lib/LanguageContext';
import useSeo from '@/hooks/useSeo';
import SectorPackages from '@/components/sector/SectorPackages';

export default function Services() {
  const { tl } = useLanguage();
  useSeo({
    title: 'Hizmetler — Web Tasarım, E-Ticaret, SEO ve Daha Fazlası | Dijitrak',
    description: "Kurumsal web, e-ticaret, mobil uygulama, Google İşletme Profili, yerel SEO ve reklam yönetimi — Trakya işletmeleri için kapsamlı hizmet kataloğu ve yatırım aralıkları.",
    path: '/hizmetler',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Dijitrak Hizmet Kataloğu',
      itemListElement: serviceCatalog.map((s, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Service',
          name: s.title,
          url: `https://trakya-digital-core.base44.app/hizmet/${s.slug}`,
          provider: { '@type': 'LocalBusiness', name: 'Dijitrak', areaServed: ['Edirne', 'Kırklareli', 'Tekirdağ'] },
        },
      })),
    },
  });
  const [cat, setCat] = useState(null);
  const [sector, setSector] = useState(null);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const k = p.get('k');
    const s = p.get('s');
    if (k && serviceCategories.some((c) => c.id === k)) setCat(k);
    if (s && sectors.some((x) => x.slug === s)) setSector(s);
  }, []);

  const sectorObj = sectors.find((x) => x.slug === sector);
  const base = sector
    ? Object.entries(sectorFit[sector])
        .map(([slug, note]) => ({ ...serviceBySlug(slug), note }))
        .filter((s) => s.slug)
    : serviceCatalog.map((s) => ({ ...s }));
  const shown = cat ? base.filter((s) => s.category === cat) : base;

  return (
    <div className="pt-36 md:pt-44 pb-24 max-w-6xl mx-auto px-5 md:px-6">
      <span className="inline-block rounded-full border border-mint/40 bg-mint/10 text-mint font-mono text-xs px-4 py-1.5">{tl('HİZMETLER')}</span>
      <h1 className="font-display text-4xl md:text-6xl font-semibold mt-4 tracking-tight">{tl('Dijitalde ihtiyacınız olan her şey')}</h1>
      <p className="text-foreground/70 mt-4 max-w-2xl text-lg">
        {tl("Önce sektörünüzü seçin — her hizmet, kendi işinizde nasıl sonuç getirdiğini göstersin. Web'den mobil uygulamaya, Google İşletme Profilinden reklam yönetimine kapsamlı katalog.")}
      </p>

      <div className="mt-8">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{tl('Sektörünüze göre')}</span>
        <div className="flex flex-wrap gap-2 mt-3">
          <button
            onClick={() => setSector(null)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${sector === null ? 'bg-mint text-ink' : 'bg-secondary hover:bg-muted'}`}
          >
            {tl('Tümü')} ({serviceCatalog.length})
          </button>
          {sectors.map((s) => (
            <button
              key={s.slug}
              onClick={() => setSector(sector === s.slug ? null : s.slug)}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-colors ${sector === s.slug ? `${s.color} text-ink` : 'bg-secondary hover:bg-muted'}`}
            >
              <s.icon className="w-4 h-4" /> {tl(s.name)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{tl('Kategoriye göre')}</span>
        <div className="flex flex-wrap gap-2 mt-3">
          <button
            onClick={() => setCat(null)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${cat === null ? 'bg-mint text-ink' : 'bg-secondary hover:bg-muted'}`}
          >
            {tl('Tümü')}
          </button>
          {serviceCategories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(cat === c.id ? null : c.id)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${cat === c.id ? `${c.color} text-ink` : 'bg-secondary hover:bg-muted'}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {sectorObj && (
        <div className={`${sectorObj.color} text-ink rounded-[2rem] p-8 md:p-10 mt-10 flex flex-col md:flex-row md:items-center gap-6`}>
          <div className="flex-1">
            <span className="font-mono text-xs uppercase tracking-widest">{tl('Sektörünüz:')} {tl(sectorObj.name)}</span>
            <h2 className="font-display font-bold text-2xl md:text-3xl mt-2">{tl(sectorObj.title)}</h2>
            <p className="mt-3 text-sm md:text-base text-ink/80 max-w-2xl">{tl(sectorObj.intro)}</p>
          </div>
          <Link
            to={`/sektor/${sectorObj.slug}`}
            className="self-start rounded-full bg-ink text-foreground font-semibold px-6 py-3 inline-flex items-center gap-2 hover:-translate-y-0.5 transition-transform"
          >
            {tl('Sektör sayfası')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {shown.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-3xl p-14 text-center font-mono text-sm text-muted-foreground mt-10">
          {tl('Bu seçimde hizmet bulunmuyor; filtreleri sıfırlamayı deneyin.')}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
          {shown.map((s, i) => {
            const c = categoryOf(s.category);
            return (
              <motion.div
                key={s.slug}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
                className="flex"
              >
                <Link
                  to={`/hizmet/${s.slug}`}
                  className={`group ${s.color} text-ink rounded-3xl p-6 min-h-[190px] flex flex-col justify-between flex-1 hover:shadow-sticker transition-shadow`}
                >
                  <div>
                    <span className="font-mono text-xs font-medium opacity-70">{tl(c.name)}</span>
                    <h3 className="font-display font-semibold text-2xl leading-tight mt-2">{tl(s.title)}</h3>
                    <p className="text-sm text-ink/75 mt-3 leading-relaxed">{tl(s.tagline)}</p>
                    {s.note && (
                      <p className="text-xs text-ink/70 mt-3 leading-relaxed flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {s.note}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-5">
                    <span className="font-mono text-xs font-semibold">{priceLabel(s)}</span>
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}

      {sectorObj && <div className="mt-16"><SectorPackages sector={sectorObj} /></div>}
    </div>
  );
}