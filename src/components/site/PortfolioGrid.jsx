import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Image } from '@/components/ui/image';
import { useLanguage } from '@/lib/LanguageContext';
import Reveal from '@/components/site/Reveal';
import ShareButtons from '@/components/site/ShareButtons';

export default function PortfolioGrid() {
  const { tl } = useLanguage();
  const [items, setItems] = useState(undefined);

  useEffect(() => {
    base44.entities.PortfolioProject.filter({ status: 'published' }, '-created_date', 6).then(setItems);
  }, []);

  return (
    <section id="portfoy" className="scroll-mt-28">
      <span className="font-mono text-xs uppercase text-mint">{tl('Portföy')}</span>
      <h2 className="font-display text-3xl md:text-4xl font-semibold mt-2">{tl('Bitirdiğimiz işler')}</h2>

      {items === undefined && (
        <div className="border border-border p-10 text-center font-mono text-sm text-muted-foreground mt-6">{tl('Projeler yükleniyor...')}</div>
      )}

      {items !== undefined && items?.length === 0 && (
        <div className="border border-border p-10 text-center font-mono text-sm text-muted-foreground mt-6">{tl('Yakında burada olacak.')}</div>
      )}

      {items?.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {items.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.05}>
              <div className="bg-card rounded-3xl overflow-hidden h-full hover:shadow-sticker transition-shadow">
                {p.image_url ? <Image src={p.image_url} className="w-full h-44" /> : <div className={`h-2 ${p.color || 'bg-mint'}`} />}
                <div className="p-6">
                  <span className="font-mono text-xs text-mint">{tl(p.sector)}</span>
                  <h3 className="font-display font-semibold text-xl leading-tight mt-2">{p.title}</h3>
                  <p className="text-sm text-foreground/70 mt-3 leading-relaxed">{p.summary}</p>
                  <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 mt-5">
                    <span className="font-mono text-xs text-muted-foreground min-w-0 break-words">{p.client}</span>
                    <ShareButtons compact title={`${p.title} — ${p.result}`} url={`${window.location.origin}/portfolyo`} />
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}