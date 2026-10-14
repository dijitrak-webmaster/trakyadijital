import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { locationBySlug, locations } from '@/lib/locations';
import { serviceCatalog } from '@/lib/serviceCatalog';
import Reveal from '@/components/site/Reveal';
import useSeo from '@/hooks/useSeo';

const BASE = 'https://trakya-digital-core.base44.app';
const featured = ['web-tasarimi', 'e-ticaret', 'yerel-seo', 'google-isletme'];

export default function LocationPage() {
  const { slug } = useParams();
  const loc = locationBySlug(slug);
  const services = featured.map((s) => serviceCatalog.find((c) => c.slug === s)).filter(Boolean);

  useSeo(loc && {
    title: `${loc.name} Web Tasarım & Dijital Ajans | Dijitrak`,
    description: loc.intro.slice(0, 160),
    path: `/konum/${loc.slug}`,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'Dijitrak',
        description: `${loc.name} bölgesinde web tasarım, e-ticaret ve yerel SEO hizmetleri`,
        areaServed: { '@type': 'City', name: loc.name },
        url: `${BASE}/konum/${loc.slug}`,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Dijitrak', item: `${BASE}/` },
          { '@type': 'ListItem', position: 2, name: 'Hizmet Bölgeleri', item: `${BASE}/hizmetler` },
          { '@type': 'ListItem', position: 3, name: loc.name, item: `${BASE}/konum/${loc.slug}` },
        ],
      },
    ],
  });

  if (!loc) {
    return (
      <div className="pt-40 pb-32 text-center px-6">
        <h1 className="font-display text-4xl font-semibold">Sayfa bulunamadı</h1>
        <Link to="/hizmetler" className="mt-6 inline-block rounded-full bg-mint text-ink font-semibold px-6 py-3">Tüm hizmetler</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-6 pt-28 md:pt-32 pb-24 space-y-16 md:space-y-20">
      {/* Hero */}
      <Reveal>
        <nav aria-label="breadcrumb" className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
          <Link to="/hizmetler" className="hover:text-mint transition-colors">Hizmetler</Link>
          <span className="opacity-50">/</span>
          <span>{loc.name}</span>
        </nav>
        <span className="mt-8 inline-block rounded-full bg-coral/15 text-coral font-mono text-xs px-4 py-1.5 tracking-widest uppercase">
          {loc.province} ili · hizmet bölgesi
        </span>
        <h1 className="font-display text-4xl md:text-6xl font-semibold mt-4 tracking-tight">
          {loc.name} <span className="text-mint">Web Tasarım</span> & Dijital Ajans
        </h1>
        <p className="text-xl text-foreground/70 mt-4 max-w-3xl leading-relaxed">{loc.tagline}</p>
      </Reveal>

      {/* Intro */}
      <Reveal>
        <p className="text-lg text-foreground/85 leading-8 max-w-3xl">{loc.intro}</p>
      </Reveal>

      {/* Highlights */}
      <Reveal>
        <div className="grid sm:grid-cols-2 gap-4">
          {loc.highlights.map((h) => (
            <div key={h.title} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 text-mint">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <h3 className="font-display font-semibold text-lg text-foreground">{h.title}</h3>
              </div>
              <p className="text-sm text-foreground/70 mt-2 leading-relaxed">{h.desc}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Services */}
      <Reveal>
        <h2 className="font-display text-3xl font-semibold">{loc.name}'da sunduğumuz öncelikli hizmetler</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {services.map((s) => (
            <Link
              key={s.slug}
              to={`/hizmet/${s.slug}/${loc.slug}`}
              className={`rounded-2xl ${s.color} text-ink p-5 flex flex-col justify-between min-h-[9rem] hover:-translate-y-1 hover:shadow-sticker transition-all`}
            >
              <s.icon className="w-6 h-6" />
              <div>
                <p className="font-display font-semibold">{s.title}</p>
                <p className="font-mono text-xs opacity-70 mt-1 inline-flex items-center gap-1">
                  {loc.name} · detay <ArrowRight className="w-3 h-3" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Reveal>

      {/* Other locations */}
      <Reveal>
        <h2 className="font-display text-2xl font-semibold">Diğer hizmet bölgelerimiz</h2>
        <div className="flex flex-wrap gap-2.5 mt-5">
          {locations.filter((l) => l.slug !== loc.slug).map((l) => (
            <Link
              key={l.slug}
              to={`/konum/${l.slug}`}
              className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:border-mint hover:text-mint transition-colors"
            >
              {l.name}
            </Link>
          ))}
        </div>
      </Reveal>

      {/* CTA */}
      <Reveal>
        <div className="rounded-[2rem] bg-sun text-ink p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h2 className="font-display font-semibold text-3xl md:text-4xl max-w-lg">
            {loc.name}'da işletmenize özel dijital yol haritası alın.
          </h2>
          <div className="flex flex-wrap gap-3 self-start md:self-auto">
            <Link to="/iletisim" className="rounded-full border-2 border-ink font-semibold px-7 py-3 hover:-translate-y-0.5 transition-transform">
              Ücretsiz Teklif Al
            </Link>
            <Link to="/simulasyon" className="rounded-full bg-ink text-foreground font-semibold px-7 py-3 hover:-translate-y-0.5 transition-transform">
              Maliyet Simüle Et
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  );
}