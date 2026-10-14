import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { serviceBySlug, priceLabel, serviceCatalog } from '@/lib/serviceCatalog';
import { locationBySlug, locations } from '@/lib/locations';
import Reveal from '@/components/site/Reveal';
import useSeo from '@/hooks/useSeo';

const BASE = 'https://trakya-digital-core.base44.app';
// her hizmet için öne çıkarılan şehirler — arama trafiği en yüksek kombinasyonlar
const FEATURED_LOCS = {
  'web-tasarimi': ['edirne', 'tekirdag', 'corlu', 'kirklareli', 'cerkezkoy', 'luleburgaz', 'uzunkopru', 'malkara', 'kesan'],
  'e-ticaret': ['edirne', 'tekirdag', 'malkara', 'kirklareli', 'corlu', 'luleburgaz'],
  'yerel-seo': ['edirne', 'corlu', 'kesan', 'ipsala', 'tekirdag', 'luleburgaz'],
  'seo': ['tekirdag', 'corlu', 'edirne', 'kirklareli'],
  'google-isletme': ['luleburgaz', 'uzunkopru', 'kesan', 'ipsala', 'edirne', 'tekirdag', 'corlu'],
  'web-bakim': ['corlu', 'tekirdag', 'edirne', 'kirklareli', 'luleburgaz'],
};

// Hizmet × konum SEO sayfası — "web tasarım edirne" gibi kombinasyon aramalarını yakalar
export default function ServiceLocationPage() {
  const { slug, location } = useParams();
  const service = serviceBySlug(slug);
  const loc = locationBySlug(location);
  const valid = service && loc && (FEATURED_LOCS[service.slug] || []).includes(loc.slug);

  useSeo(valid && {
    title: `${loc.name} ${service.title} — Fiyatlar ve Kapsam | Dijitrak`,
    description: `${loc.name} bölgesinde ${service.title.toLowerCase()}: ${service.tagline}`,
    path: `/hizmet/${service.slug}/${loc.slug}`,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: `${service.title} — ${loc.name}`,
        serviceType: service.title,
        areaServed: { '@type': 'City', name: loc.name },
        url: `${BASE}/hizmet/${service.slug}/${loc.slug}`,
        offers: { '@type': 'Offer', priceCurrency: 'TRY', lowPrice: service.price[0], highPrice: service.price[1] },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Hizmetler', item: `${BASE}/hizmetler` },
          { '@type': 'ListItem', position: 2, name: service.title, item: `${BASE}/hizmet/${service.slug}` },
          { '@type': 'ListItem', position: 3, name: loc.name, item: `${BASE}/hizmet/${service.slug}/${loc.slug}` },
        ],
      },
    ],
  });

  if (!valid) {
    return (
      <div className="pt-40 pb-32 text-center px-6">
        <h1 className="font-display text-4xl font-semibold">Sayfa bulunamadı</h1>
        <Link to="/hizmetler" className="mt-6 inline-block rounded-full bg-mint text-ink font-semibold px-6 py-3">Tüm hizmetler</Link>
      </div>
    );
  }

  const siblingLocs = (FEATURED_LOCS[service.slug] || []).filter((l) => l !== loc.slug)
    .map((l) => locations.find((x) => x.slug === l)).filter(Boolean);
  const localServices = ['web-tasarimi', 'e-ticaret', 'yerel-seo', 'google-isletme']
    .map((s) => serviceBySlug(s)).filter((s) => s && s.slug !== service.slug);

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-6 pt-28 md:pt-32 pb-24 space-y-14 md:space-y-16">
      {/* Hero */}
      <Reveal>
        <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-1.5 font-mono text-xs text-muted-foreground">
          <Link to="/hizmetler" className="hover:text-mint transition-colors">Hizmetler</Link>
          <span className="opacity-50">/</span>
          <Link to={`/hizmet/${service.slug}`} className="hover:text-mint transition-colors">{service.title}</Link>
          <span className="opacity-50">/</span>
          <span>{loc.name}</span>
        </nav>
        <span className="mt-8 inline-flex items-center gap-2 rounded-full bg-coral/15 text-coral font-mono text-xs px-4 py-1.5 tracking-widest uppercase">
          <service.icon className="w-3.5 h-3.5" /> {loc.name} · {loc.province} ili
        </span>
        <h1 className="font-display text-4xl md:text-6xl font-semibold mt-4 tracking-tight">
          {service.title} <span className="text-mint">— {loc.name}</span>
        </h1>
        <p className="text-lg text-foreground/70 mt-4 max-w-3xl leading-relaxed">
          {loc.name} ve çevresindeki işletmeler için {service.title.toLowerCase()}: {service.tagline}
        </p>
      </Reveal>

      {/* Açıklama */}
      <Reveal>
        <p className="text-lg text-foreground/85 leading-8 max-w-3xl">{service.desc}</p>
        <p className="text-base text-foreground/70 leading-7 max-w-3xl mt-4">{loc.intro}</p>
      </Reveal>

      {/* Kapsam */}
      <Reveal>
        <h2 className="font-display text-2xl md:text-3xl font-semibold">Kapsamda neler var?</h2>
        <div className="grid sm:grid-cols-2 gap-3 mt-6">
          {service.features.map((f) => (
            <div key={f} className="rounded-2xl border border-border bg-card p-4 flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-mint shrink-0 mt-0.5" />
              <span className="text-sm text-foreground/80">{f}</span>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Fiyat + CTA */}
      <Reveal>
        <div className="rounded-[2rem] bg-sun text-ink p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest opacity-70">Yatırım aralığı</p>
            <p className="font-display font-bold text-3xl md:text-4xl mt-1">{priceLabel(service)}</p>
            <p className="text-sm opacity-80 mt-2 max-w-md">{loc.name}'da keşif görüşmesi ve net teklif ücretsizdir; teklifte yazmayan kalem faturaya girmez.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 self-start md:self-auto">
            <Link to="/iletisim" className="rounded-full border-2 border-ink font-semibold px-7 py-3 inline-flex items-center gap-2 hover:-translate-y-0.5 transition-transform">
              {loc.name} için teklif al <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/simulasyon" className="rounded-full bg-ink text-foreground font-semibold px-7 py-3 hover:-translate-y-0.5 transition-transform">
              Bütçeyi simüle et
            </Link>
          </div>
        </div>
      </Reveal>

      {/* SSS */}
      {service.faqs && (
        <Reveal>
          <h2 className="font-display text-2xl md:text-3xl font-semibold">Sık sorulanlar</h2>
          <Accordion type="single" collapsible className="mt-6 space-y-3">
            {service.faqs.map((f, i) => (
              <AccordionItem key={i} value={`f${i}`} className="rounded-2xl border border-border bg-card px-5">
                <AccordionTrigger className="text-left font-semibold text-sm md:text-base">{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-foreground/70">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      )}

      {/* Aynı hizmetin diğer şehirleri */}
      {siblingLocs.length > 0 && (
        <Reveal>
          <h2 className="font-display text-2xl font-semibold">{service.title} — diğer bölgelerimiz</h2>
          <div className="flex flex-wrap gap-2.5 mt-5">
            {siblingLocs.map((l) => (
              <Link
                key={l.slug}
                to={`/hizmet/${service.slug}/${l.slug}`}
                className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:border-mint hover:text-mint transition-colors"
              >
                {service.title.split(' ')[0]} · {l.name}
              </Link>
            ))}
          </div>
        </Reveal>
      )}

      {/* Aynı bölgenin diğer hizmetleri */}
      <Reveal>
        <h2 className="font-display text-2xl font-semibold">{loc.name} bölgesinde diğer popüler hizmetler</h2>
        <div className="grid sm:grid-cols-3 gap-4 mt-6">
          {localServices.map((s) => (
            <Link
              key={s.slug}
              to={`/hizmet/${s.slug}/${loc.slug}`}
              className={`rounded-2xl ${s.color} text-ink p-5 flex flex-col justify-between min-h-[8rem] hover:-translate-y-1 hover:shadow-sticker transition-all`}
            >
              <s.icon className="w-5 h-5" />
              <div>
                <p className="font-display font-semibold text-sm">{s.title}</p>
                <p className="font-mono text-[10px] opacity-70 mt-1">{loc.name} · detay</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap gap-2.5 mt-6">
          {locations.filter((l) => l.slug !== loc.slug).slice(0, 5).map((l) => (
            <Link
              key={l.slug}
              to={`/konum/${l.slug}`}
              className="rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-muted-foreground hover:border-mint hover:text-mint transition-colors"
            >
              {l.name} dijital ajans
            </Link>
          ))}
        </div>
      </Reveal>
    </div>
  );
}