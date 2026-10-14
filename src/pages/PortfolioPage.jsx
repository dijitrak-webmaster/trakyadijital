import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Filter } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Image } from '@/components/ui/image';
import { useLanguage } from '@/lib/LanguageContext';
import useSeo from '@/hooks/useSeo';

export default function PortfolioPage() {
  const { tl } = useLanguage();
  useSeo({
    title: 'Portföy — Bitirdiğimiz Projeler | Dijitrak',
    description: "Tarımdan turizme, sanayiden gıdaya Trakya'da hayata geçirdiğimiz web tasarımı, e-ticaret ve dijital dönüşüm projeleri ile ölçülebilir sonuçları.",
    path: '/portfolyo',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Dijitrak Proje Portföyü',
      url: 'https://trakya-digital-core.base44.app/portfolyo',
      about: 'Trakya bölgesindeki web tasarımı, e-ticaret ve dijital dönüşüm projeleri',
    },
  });
  const [items, setItems] = useState(undefined);
  const [sector, setSector] = useState('Tümü');

  useEffect(() => {
    base44.entities.PortfolioProject.filter({ status: 'published' }, '-created_date', 200).then(setItems);
  }, []);

  const sectors = ['Tümü', ...(items || []).map((p) => p.sector).filter((s, i, a) => s && a.indexOf(s) === i)];
  const shown = sector === 'Tümü' ? items || [] : (items || []).filter((p) => p.sector === sector);

  return (
    <div className="pt-36 md:pt-44 pb-24 max-w-6xl mx-auto px-5 md:px-6">
      <span className="inline-block rounded-full border border-mint/40 bg-mint/10 text-mint font-mono text-xs px-4 py-1.5">{tl('PORTFÖY')}</span>
      <h1 className="font-display text-4xl md:text-6xl font-semibold mt-4 tracking-tight">{tl('Bitirdiğimiz işler')}</h1>
      <p className="text-foreground/70 mt-4 max-w-2xl text-lg">
        {tl("Tarımdan turizme, sanayiden gıdaya — Trakya'da hayata geçirdiğimiz projeler ve ölçülebilir sonuçları.")}
      </p>

      {sectors.length > 1 && (
        <div className="flex flex-wrap items-center gap-2 mt-8">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {sectors.map((s) => (
            <button
              key={s}
              onClick={() => setSector(s)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${sector === s ? 'bg-mint text-ink' : 'bg-secondary hover:bg-muted'}`}
            >
              {tl(s)}
            </button>
          ))}
        </div>
      )}

      {items === undefined ? (
        <div className="border border-border p-14 text-center font-mono text-sm text-muted-foreground mt-10">{tl('Projeler yükleniyor...')}</div>
      ) : shown.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-3xl p-14 text-center font-mono text-sm text-muted-foreground mt-10">
          {tl('Henüz yayınlanmış proje yok.')} <Link to="/iletisim" className="text-mint hover:underline">{tl('İlk projeniz olmak isteriz.')}</Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5 mt-10">
          {shown.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="bg-card rounded-3xl overflow-hidden hover:shadow-sticker transition-shadow"
            >
              {p.image_url ? <Image src={p.image_url} className="w-full h-56 md:h-64" /> : <div className={`h-2 ${p.color || 'bg-mint'}`} />}
              <div className="p-6 md:p-7">
                <span className="font-mono text-xs text-mint">{tl(p.sector)}</span>
                <h2 className="font-display font-semibold text-2xl leading-tight mt-2">{p.title}</h2>
                <p className="text-sm text-foreground/70 mt-3 leading-relaxed">{p.summary}</p>
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 mt-5">
                  <span className="font-mono text-xs text-muted-foreground min-w-0 break-words">{p.client}</span>
                  <span className="font-display font-bold text-mint text-xl text-right">{p.result}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      <div className="mt-14 rounded-3xl border-2 border-dashed border-mint/40 bg-card p-8 flex flex-col md:flex-row md:items-center gap-5">
        <p className="flex-1 font-display font-semibold text-xl">{tl('Sıradaki başarı hikayesini birlikte yazalım.')}</p>
        <Link to="/iletisim" className="rounded-full bg-mint text-ink font-semibold px-6 py-3 inline-flex items-center gap-2 hover:shadow-sticker transition-all self-start">
          {tl('Projeni anlat')} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}