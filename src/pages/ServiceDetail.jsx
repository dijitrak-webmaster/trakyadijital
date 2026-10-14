import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { serviceBySlug, serviceCatalog, priceLabel, categoryOf } from '@/lib/serviceCatalog';
import IconBadge from '@/components/site/IconBadge';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { useAssistant } from '@/lib/AssistantContext';
import { useLanguage } from '@/lib/LanguageContext';
import useSeo from '@/hooks/useSeo';
import RelatedContent from '@/components/service/RelatedContent';

export default function ServiceDetail() {
  const { slug } = useParams();
  const { openAssistant } = useAssistant();
  const { tl } = useLanguage();
  const service = serviceBySlug(slug);

  useSeo(service && {
    title: `${service.title} — Dijitrak`,
    description: service.tagline,
    path: `/hizmet/${service.slug}`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: service.title,
      description: service.tagline,
      provider: { '@type': 'Organization', name: 'Dijitrak' },
      areaServed: ['Edirne', 'Tekirdağ', 'Kırklareli'],
    },
  });

  if (!service) {
    return (
      <div className="pt-40 pb-24 max-w-3xl mx-auto px-6 text-center">
        <h1 className="font-display text-4xl font-semibold">{tl('Hizmet bulunamadı')}</h1>
        <p className="text-foreground/70 mt-3">{tl('Aradığınız hizmet sayfası taşınmış veya kaldırılmış olabilir.')}</p>
        <Link to="/hizmetler" className="inline-block mt-6 rounded-full bg-mint text-ink font-semibold px-6 py-3">{tl('Tüm hizmetler')}</Link>
      </div>
    );
  }

  const category = categoryOf(service.category);
  const related = serviceCatalog.filter((s) => s.category === service.category && s.slug !== service.slug).slice(0, 3);

  return (
    <div className="pt-28 pb-24 max-w-6xl mx-auto px-5 md:px-6">
      <Link to="/hizmetler" className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-mint transition-colors">
        <ArrowLeft className="w-4 h-4" /> {tl('tüm hizmetler')}
      </Link>

      <div className={`${service.color} text-ink rounded-3xl p-8 md:p-12 mt-6 relative overflow-hidden`}>
        <span className="font-mono text-xs font-semibold opacity-70">{tl(category.name)}</span>
        <h1 className="font-display text-4xl md:text-5xl font-semibold mt-2">{tl(service.title)}</h1>
        <p className="mt-4 max-w-2xl text-lg">{tl(service.tagline)}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-10">
        <div className="lg:col-span-2 space-y-12">
          <section>
            <span className="font-mono text-xs uppercase text-mint">{tl('Neler dahil')}</span>
            <p className="text-foreground/80 mt-3 leading-relaxed">{tl(service.desc)}</p>
            <ul className="grid sm:grid-cols-2 gap-3 mt-6">
              {service.features.map((f) => (
                <li key={f} className="flex items-start gap-3 bg-card rounded-2xl p-4 text-sm">
                  <span className="mt-0.5"><Check className="w-4 h-4 text-mint" /></span>
                  {tl(f)}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <span className="font-mono text-xs uppercase text-mint">{tl('Nasıl çalışıyoruz')}</span>
            <div className="mt-6 space-y-4">
              {service.process.map((p, i) => (
                <div key={p.title} className="flex gap-5">
                  <div className="flex flex-col items-center">
                    <span className="w-9 h-9 rounded-full bg-mint text-ink font-display font-semibold flex items-center justify-center shrink-0">{i + 1}</span>
                    {i < service.process.length - 1 && <span className="w-px flex-1 bg-border mt-2" />}
                  </div>
                  <div className="pb-6">
                    <h4 className="font-display font-semibold text-lg">{tl(p.title)}</h4>
                    <p className="text-sm text-foreground/70 mt-1 leading-relaxed">{tl(p.desc)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {service.faqs?.length > 0 && (
            <section>
              <span className="font-mono text-xs uppercase text-mint">{tl('Sık sorulan sorular')}</span>
              <Accordion type="single" collapsible className="mt-4">
                {service.faqs.map((f) => (
                  <AccordionItem key={f.q} value={f.q}>
                    <AccordionTrigger className="text-left font-semibold">{tl(f.q)}</AccordionTrigger>
                    <AccordionContent className="text-sm text-foreground/75">{tl(f.a)}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          )}

          <RelatedContent service={service} />
        </div>

        <aside className="space-y-6">
          <div className="bg-card rounded-3xl p-6 sticky top-28">
            <span className="font-mono text-xs uppercase text-muted-foreground">{tl('Yatırım aralığı')}</span>
            <p className="font-display text-3xl font-semibold mt-2">{priceLabel(service)}</p>
            <p className="text-xs text-foreground/60 mt-2">{tl('Net teklif, kapsamınızı netleştirdikten sonra 24 saat içinde hazırlanır.')}</p>
            <button
              onClick={() => openAssistant({ intent: 'quote', service: service.title })}
              className="w-full mt-5 rounded-full bg-mint text-ink font-semibold py-3 hover:-translate-y-0.5 hover:shadow-sticker transition-all"
            >
              {tl('Teklif Al')}
            </button>
            <Link to="/#iletisim" className="block text-center text-sm text-muted-foreground hover:text-mint mt-3">{tl('ya da bizi arayın')}</Link>
          </div>

          {related.length > 0 && (
            <div className="space-y-3">
              <span className="font-mono text-xs uppercase text-mint">{tl('İlgili hizmetler')}</span>
              {related.map((r) => (
                <Link key={r.slug} to={`/hizmet/${r.slug}`} className="flex items-center justify-between bg-card rounded-2xl p-4 hover:bg-secondary transition-colors">
                  <span className="font-semibold text-sm">{tl(r.title)}</span>
                  <ArrowRight className="w-4 h-4 text-mint" />
                </Link>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 bg-card rounded-2xl p-4">
            <IconBadge icon={service.icon} className="bg-secondary" />
            <span className="text-sm text-foreground/70">{tl(category.desc)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}