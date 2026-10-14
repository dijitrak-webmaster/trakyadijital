import React, { useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { sectors, cases } from '@/lib/siteData';
import { useAssistant } from '@/lib/AssistantContext';
import SectorHero from '@/components/sector/SectorHero';
import SectorDetails from '@/components/sector/SectorDetails';
import SectorPackages from '@/components/sector/SectorPackages';
import SectorGuides from '@/components/sector/SectorGuides';
import Reveal from '@/components/site/Reveal';
import useSeo from '@/hooks/useSeo';

export default function SectorPage() {
  const { slug } = useParams();
  const location = useLocation();
  const { openAssistant } = useAssistant();
  const sector = sectors.find((s) => s.slug === slug);
  const story = cases.find((c) => c.sector === slug);

  useSeo(sector && {
    title: `${sector.name} İçin Dijital Çözümler | Dijitrak`,
    description: sector.intro,
    path: `/sektor/${sector.slug}`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Dijitrak', item: 'https://trakya-digital-core.base44.app/' },
        { '@type': 'ListItem', position: 2, name: 'Sektörler', item: 'https://trakya-digital-core.base44.app/hizmetler' },
        { '@type': 'ListItem', position: 3, name: `${sector.name} Dijital Çözümler`, item: `https://trakya-digital-core.base44.app/sektor/${sector.slug}` },
      ],
    },
  });

  useEffect(() => {
    if (!location.hash) return;
    const t = setTimeout(() => document.querySelector(location.hash)?.scrollIntoView({ behavior: 'smooth' }), 150);
    return () => clearTimeout(t);
  }, [slug, location.hash]);

  if (!sector) {
    return (
      <div className="pt-40 pb-32 text-center px-6">
        <h1 className="font-display text-4xl font-semibold">Sektör bulunamadı</h1>
        <Link to="/" className="mt-6 inline-block rounded-full bg-mint text-ink font-semibold px-6 py-3">Ana sayfaya dön</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-6 pt-28 md:pt-32 pb-24 space-y-20 md:space-y-24">
      <SectorHero sector={sector} />
      <SectorDetails sector={sector} />
      <SectorPackages sector={sector} />
      {story && (
        <Reveal>
          <div className="rounded-3xl border-2 border-dashed border-border p-8 md:p-10 grid md:grid-cols-[auto,1fr] gap-6 items-center">
            <div className={`${story.color} text-ink rounded-2xl px-6 py-5 font-display font-bold text-3xl md:text-4xl`}>{story.metric}</div>
            <div>
              <span className="font-mono text-xs text-mint uppercase tracking-widest">Başarı Hikayesi</span>
              <h3 className="mt-2 font-display font-semibold text-3xl">{story.title}</h3>
              <p className="mt-2 text-foreground/70">{story.desc}</p>
            </div>
          </div>
        </Reveal>
      )}
      <SectorGuides sector={sector} />
      <Reveal>
        <div className="rounded-[2rem] bg-sun text-ink p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h2 className="font-display font-semibold text-3xl md:text-4xl max-w-lg">İşletmenize özel dijital yol haritası alın.</h2>
          <div className="flex flex-wrap gap-3 self-start md:self-auto">
            <Link to="/simulasyon" className="rounded-full border-2 border-ink font-semibold px-7 py-3 hover:-translate-y-0.5 transition-transform">Maliyet Simüle Et</Link>
            <button onClick={() => openAssistant({ intent: 'appointment' })} className="rounded-full bg-ink text-foreground font-semibold px-7 py-3 hover:-translate-y-0.5 transition-transform">Randevu Oluştur</button>
          </div>
        </div>
      </Reveal>
    </div>
  );
}